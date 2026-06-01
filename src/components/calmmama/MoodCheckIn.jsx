import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const moods = [
  { emoji: "😢", label: "Sad", value: 1 },
  { emoji: "😔", label: "Low", value: 2 },
  { emoji: "😐", label: "Okay", value: 3 },
  { emoji: "🙂", label: "Good", value: 4 },
  { emoji: "😊", label: "Great", value: 5 },
];

const tags = ["overwhelmed", "tired", "anxious", "lonely", "hopeful", "calm", "grateful"];

export default function MoodCheckIn() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [energy, setEnergy] = useState(50);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-card rounded-3xl p-5 border border-border/40 shadow-sm"
    >
      <p className="text-sm font-semibold text-foreground mb-1">How are you feeling right now?</p>
      <p className="text-xs text-muted-foreground mb-4">No right or wrong answer, mama</p>

      {/* Mood Emojis */}
      <div className="flex items-center justify-between mb-5">
        {moods.map((mood) => (
          <button
            key={mood.value}
            onClick={() => setSelectedMood(mood.value)}
            className="flex flex-col items-center gap-1.5 group"
          >
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all duration-200 ${
                selectedMood === mood.value
                  ? "bg-primary/15 ring-2 ring-primary/40 shadow-md scale-110"
                  : "bg-muted/60 hover:bg-muted"
              }`}
            >
              {mood.emoji}
            </motion.div>
            <span className={`text-[10px] font-medium transition-colors ${
              selectedMood === mood.value ? "text-primary" : "text-muted-foreground"
            }`}>
              {mood.label}
            </span>
          </button>
        ))}
      </div>

      {/* Energy Level */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">Energy level</span>
          <span className="text-xs font-semibold text-foreground">{energy}%</span>
        </div>
        <div className="relative">
          <input
            type="range"
            min="0"
            max="100"
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${energy}%, hsl(var(--muted)) ${energy}%, hsl(var(--muted)) 100%)`,
            }}
          />
          <style>{`
            input[type='range']::-webkit-slider-thumb {
              -webkit-appearance: none;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: white;
              border: 3px solid hsl(var(--primary));
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              cursor: pointer;
            }
          `}</style>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-muted-foreground">Exhausted</span>
          <span className="text-[10px] text-muted-foreground">Energized</span>
        </div>
      </div>

      {/* Tags */}
      <AnimatePresence>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <motion.button
              key={tag}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                selectedTags.includes(tag)
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "bg-muted/60 text-muted-foreground border border-transparent hover:bg-muted"
              }`}
            >
              {tag}
            </motion.button>
          ))}
        </div>
      </AnimatePresence>
    </motion.div>
  );
}