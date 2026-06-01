import { motion } from "framer-motion";
import { Star, Clock, ChevronRight } from "lucide-react";

export default function TherapistCard({ therapist, index, onSelect }) {
  const t = therapist;
  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(t)}
      className="w-full text-left bg-card rounded-3xl p-4 border border-border/40 shadow-sm hover:shadow-md hover:border-primary/20 transition-all"
    >
      <div className="flex items-start gap-3">
        <div className={`w-14 h-14 ${t.bg} rounded-2xl flex items-center justify-center text-3xl flex-shrink-0`}>
          {t.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className="text-sm font-bold text-foreground">{t.name}</span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-lg ${t.tagColor}`}>{t.tag}</span>
          </div>
          <p className="text-xs text-muted-foreground mb-1.5">{t.specialty}</p>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-foreground">{t.rating}</span>
              <span className="text-[10px] text-muted-foreground ml-0.5">({t.reviews})</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />Next: {t.nextSlot}
            </span>
          </div>
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {t.focuses.map((f) => (
              <span key={f} className="text-[10px] bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-full">
                {f}
              </span>
            ))}
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground/40 mt-1 flex-shrink-0" />
      </div>
    </motion.button>
  );
}