import { motion } from "framer-motion";
import { UserPlus, ChevronRight, Heart } from "lucide-react";

const supporters = [
  { name: "David", role: "Partner", emoji: "👨", task: "Night feeding shift" },
  { name: "Mom", role: "Family", emoji: "👩", task: "Grocery run" },
  { name: "Sarah", role: "Trusted person", emoji: "👩🦰", task: "Just check in" },
];

export default function SupportCircle() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-card rounded-3xl p-5 border border-border/40 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-primary" />
          <p className="text-sm font-semibold text-foreground">Your Support Circle</p>
        </div>
        <span className="text-xs bg-primary/10 text-primary font-semibold px-2.5 py-1 rounded-full">
          {supporters.length} people
        </span>
      </div>

      <div className="space-y-2.5 mb-4">
        {supporters.map((person, i) => (
          <motion.div
            key={person.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 + i * 0.05 }}
            className="flex items-center gap-3 bg-muted/40 rounded-2xl p-3"
          >
            <div className="w-10 h-10 rounded-xl bg-calm-lavender flex items-center justify-center text-lg">
              {person.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-foreground">{person.name}</span>
                <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-md font-medium">
                  {person.role}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{person.task}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
          </motion.div>
        ))}
      </div>

      <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-border hover:border-primary/30 hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary">
        <UserPlus className="w-4 h-4" />
        <span className="text-xs font-semibold">Invite someone to your circle</span>
      </button>
    </motion.div>
  );
}

