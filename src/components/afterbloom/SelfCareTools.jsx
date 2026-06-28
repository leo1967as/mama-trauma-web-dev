import { motion } from "framer-motion";
import { Wind, Heart, MessageCircle, Music } from "lucide-react";

const tools = [
  {
    icon: Wind,
    label: "Breathe",
    desc: "2 min calm",
    bg: "bg-blue-50",
    iconColor: "text-blue-400",
  },
  {
    icon: Heart,
    label: "Affirm",
    desc: "You're enough",
    bg: "bg-rose-50",
    iconColor: "text-rose-400",
  },
  {
    icon: MessageCircle,
    label: "Support",
    desc: "Short message",
    bg: "bg-violet-50",
    iconColor: "text-violet-400",
  },
  {
    icon: Music,
    label: "Soothe",
    desc: "Calm sounds",
    bg: "bg-amber-50",
    iconColor: "text-amber-400",
  },
];

export default function SelfCareTools() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55 }}
      className="bg-card rounded-2xl p-5 border border-border/40 shadow-sm"
    >
      <p className="text-sm font-semibold text-foreground mb-1">Micro Self-Care</p>
      <p className="text-xs text-muted-foreground mb-4">Quick tools — under 2 minutes each</p>

      <div className="grid grid-cols-4 gap-2.5">
        {tools.map((tool, i) => (
          <motion.button
            key={tool.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 + i * 0.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-2 group"
          >
            <div className={`w-14 h-14 ${tool.bg} rounded-xl flex items-center justify-center transition-all group-hover:shadow-md group-hover:scale-105`}>
              <tool.icon className={`w-5 h-5 ${tool.iconColor}`} />
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-foreground">{tool.label}</p>
              <p className="text-[10px] text-muted-foreground">{tool.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
