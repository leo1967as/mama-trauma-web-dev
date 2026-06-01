import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check } from "lucide-react";

export default function DailyGoal() {
  const [completed, setCompleted] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-gradient-to-br from-calm-cream to-calm-peach rounded-3xl p-5 border border-border/20 shadow-sm relative overflow-hidden"
    >
      {/* Decorative blob */}
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />

      <div className="flex items-center gap-2 mb-3 relative">
        <Sparkles className="w-4 h-4 text-primary" />
        <p className="text-sm font-semibold text-foreground">Today's Tiny Goal</p>
      </div>

      <div className="flex items-center gap-3 relative">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setCompleted(!completed)}
          className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
            completed
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-card border-2 border-border/60"
          }`}
        >
          <AnimatePresence>
            {completed && (
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
              >
                <Check className="w-4 h-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        <div className="flex-1">
          <p className={`text-sm font-medium transition-all ${
            completed ? "text-muted-foreground line-through" : "text-foreground"
          }`}>
            Rest for 10 quiet minutes
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Even closing your eyes counts 🌸
          </p>
        </div>
      </div>

      <AnimatePresence>
        {completed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 bg-card/60 rounded-xl p-3 text-center"
          >
            <p className="text-xs font-medium text-primary">
              Beautiful! You did something kind for yourself today 💛
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}