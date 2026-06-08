import { Bell, Settings } from "lucide-react";
import { HeartSvg } from "../../lib/faces";
import { motion } from "framer-motion";

export default function Header() {
  const shortDate = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });

  return (
    <div className="flex items-center justify-between px-1 pt-2 pb-4">
      <div>
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[11px] text-muted-foreground/80 font-semibold uppercase tracking-wide mb-1"
        >
          {shortDate}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-muted-foreground font-medium"
        >
          Good morning
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-2xl font-bold text-foreground tracking-tight"
        >
          Hey there <HeartSvg size={16} color="#C77E83" />
        </motion.h1>
      </div>
      <div className="flex items-center gap-2">
        <button className="w-10 h-10 rounded-2xl bg-card flex items-center justify-center border border-border/50 shadow-sm">
          <Bell className="w-4.5 h-4.5 text-muted-foreground" />
        </button>
        <button className="w-10 h-10 rounded-2xl bg-card flex items-center justify-center border border-border/50 shadow-sm">
          <Settings className="w-4.5 h-4.5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}

