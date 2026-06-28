import { motion } from "framer-motion";
import { TrendingUp, Moon, Lightbulb, MessageCircleHeart, AlertCircle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { getMoodChartData, getMoodInsights, hasMoodChartData } from "../../lib/mood-data";

const iconMap = {
  sleep: Moon,
  support: MessageCircleHeart,
  tag: AlertCircle,
  trend: TrendingUp,
};

export default function MoodInsights({ entries = [] }) {
  const moodData = getMoodChartData(entries, 7);
  const showChartData = hasMoodChartData(moodData);
  const insights = getMoodInsights(entries);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className="bg-card rounded-2xl p-5 border border-border/40 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-primary" />
        <p className="text-sm font-semibold text-foreground">Mood Insights</p>
      </div>

      {/* Mini Chart */}
      <div className="relative h-28 -mx-2 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={moodData}>
            <defs>
              <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              dy={8}
            />
            <YAxis hide domain={[0, 5]} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
              formatter={(value) => [`Mood: ${value}/5`, ""]}
              labelFormatter={(label) => label}
            />
            <Area
              type="monotone"
              dataKey="mood"
              stroke="hsl(var(--primary))"
              strokeWidth={2.5}
              fill="url(#moodGradient)"
              dot={({ cx, cy, payload }) =>
                payload?.mood !== null ? <circle cx={cx} cy={cy} r={3.5} fill="hsl(var(--primary))" stroke="white" strokeWidth={1.5} /> : null
              }
              connectNulls
              activeDot={{ r: 5, fill: "hsl(var(--primary))", stroke: "white", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
        {!showChartData ? (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-gradient-to-b from-transparent to-background/50">
            <p className="px-4 text-center text-[11px] font-medium text-muted-foreground">
              Trend line appears after the first saved mood check-in.
            </p>
          </div>
        ) : null}
      </div>

      {/* Insights */}
      <div className="space-y-2.5">
        {insights.map((insight, i) => (
          <div key={insight.key || i} className="flex items-start gap-2.5 bg-muted/40 rounded-lg p-3">
            {(() => {
              const InsightIcon = iconMap[insight.type] || Lightbulb;
              return <InsightIcon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />;
            })()}
            <p className="text-xs text-muted-foreground leading-relaxed">{insight.text}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

