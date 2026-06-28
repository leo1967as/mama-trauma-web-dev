import { useId } from "react";
import { useReducedMotion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const FONT_BODY = "'Plus Jakarta Sans', system-ui, sans-serif";

// Lazy-loaded so recharts (~80kB gz) stays out of the initial bundle.
export default function MoodTrendChart({ data, height = 96, ariaLabel = "Mood trend over the last 7 days" }) {
  const reduceMotion = useReducedMotion();
  const gradientId = useId().replace(/:/g, "");
  const animate = !reduceMotion;

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      style={{ position: "relative", height, margin: "0 -6px" }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C77E83" stopOpacity={0.26} />
              <stop offset="100%" stopColor="#C77E83" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#786A5C", fontFamily: FONT_BODY }} dy={6} />
          <YAxis hide domain={[0, 5]} />
          <Tooltip contentStyle={{ background: "#fff", border: "1px solid #EFE6DC", borderRadius: 8, fontSize: 12, fontFamily: FONT_BODY }} formatter={(v) => [`${v}/5`, "Mood"]} />
          <Area type="monotone" dataKey="mood" stroke="#C77E83" strokeWidth={2.5} fill={`url(#${gradientId})`}
            dot={({ cx, cy, payload }) => payload?.mood != null ? <circle cx={cx} cy={cy} r={3} fill="#C77E83" stroke="white" strokeWidth={1.5} /> : null}
            connectNulls activeDot={{ r: 5, fill: "#C77E83", stroke: "white", strokeWidth: 2 }}
            isAnimationActive={animate}
            animationDuration={animate ? 520 : 0}
            animationBegin={animate ? 40 : 0}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
