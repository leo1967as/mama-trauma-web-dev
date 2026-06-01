import { motion } from "framer-motion";
import { Phone, Calendar } from "lucide-react";

export default function CTAButtons() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="flex gap-3"
    >
      <button className="flex-1 bg-primary text-primary-foreground rounded-2xl py-3.5 px-4 flex items-center justify-center gap-2.5 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 transition-all active:scale-[0.98]">
        <Phone className="w-4 h-4" />
        <span className="text-sm font-semibold">Talk to a professional</span>
      </button>
      <button className="w-14 h-14 bg-card border border-border/50 rounded-2xl flex items-center justify-center shadow-sm hover:bg-muted/50 transition-all active:scale-[0.98]">
        <Calendar className="w-5 h-5 text-foreground" />
      </button>
    </motion.div>
  );
}