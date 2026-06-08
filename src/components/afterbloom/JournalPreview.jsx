import { motion } from "framer-motion";
import { BookOpen, ChevronRight } from "lucide-react";

export default function JournalPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-card rounded-3xl p-5 border border-border/40 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="w-4 h-4 text-primary" />
        <p className="text-sm font-semibold text-foreground">Journal</p>
      </div>

      {/* Last Note Preview */}
      <div className="bg-muted/30 rounded-2xl p-3.5 mb-3 border border-border/20">
        <p className="text-[10px] font-medium text-muted-foreground mb-1.5">Yesterday, 9:42 PM</p>
        <p className="text-xs text-foreground/80 leading-relaxed line-clamp-2 italic">
          "Today was hard but the baby smiled at me for the first time and I cried happy tears. Maybe I'm doing better than I think..."
        </p>
      </div>

      <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-primary/8 hover:bg-primary/12 transition-all text-primary group">
        <span className="text-sm font-semibold">Continue today's journal</span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </motion.div>
  );
}
