import { motion } from "framer-motion";
import { Shield, AlertTriangle } from "lucide-react";
import { getMoodRiskSummary } from "../../lib/mood-data";

export default function RiskIndicator({ entries = [] }) {
  const riskConfig = {
    none: {
      bg: "bg-slate-50",
      border: "border-slate-200/60",
      textColor: "text-slate-700",
      dotColor: "bg-slate-400",
      icon: Shield,
    },
    green: {
      bg: "bg-emerald-50",
      border: "border-emerald-200/60",
      textColor: "text-emerald-700",
      dotColor: "bg-emerald-400",
      icon: Shield,
    },
    yellow: {
      bg: "bg-amber-50",
      border: "border-amber-200/60",
      textColor: "text-amber-700",
      dotColor: "bg-amber-400",
      icon: AlertTriangle,
    },
    orange: {
      label: "Needs Support",
      message: "Your mood pattern suggests you might benefit from professional support. There's no shame in asking for help.",
      bg: "bg-orange-50",
      border: "border-orange-200/60",
      textColor: "text-orange-700",
      dotColor: "bg-orange-400",
      icon: AlertTriangle,
    },
    red: {
      label: "Please Reach Out",
      message: "We're concerned about how you're feeling. Please talk to a professional — you deserve support right now.",
      bg: "bg-red-50",
      border: "border-red-200/60",
      textColor: "text-red-700",
      dotColor: "bg-red-400",
      icon: AlertTriangle,
    },
  };

  const summary = getMoodRiskSummary(entries);
  const config = riskConfig[summary.level];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`${config.bg} ${config.border} border rounded-3xl p-4`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
          <Icon className={`w-4.5 h-4.5 ${config.textColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-2 h-2 rounded-full ${config.dotColor} animate-pulse-soft`} />
            <span className={`text-xs font-bold ${config.textColor} uppercase tracking-wider`}>
              {summary.label}
            </span>
          </div>
          <p className={`text-xs ${config.textColor} leading-relaxed opacity-90`}>
            {summary.message}
          </p>
          <p className={`text-[11px] ${config.textColor} mt-2 font-semibold`}>
            Next step: {summary.action}
          </p>
        </div>
      </div>

      {/* Risk Level Dots */}
      <div className="flex items-center gap-1.5 mt-3 ml-12">
        {["green", "yellow", "orange", "red"].map((level) => (
          <div
            key={level}
            className={`h-1.5 flex-1 rounded-full transition-all ${
              level === summary.level ? config.dotColor : "bg-black/5"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}
