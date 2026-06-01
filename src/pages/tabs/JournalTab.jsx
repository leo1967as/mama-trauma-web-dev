import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, PenLine, ChevronRight, Sparkles } from "lucide-react";

const pastEntries = [
  {
    date: "Yesterday, 9:42 PM",
    preview: "Today was hard but the baby smiled at me for the first time and I cried happy tears. Maybe I'm doing better than I think...",
    mood: "🙂",
    tags: ["grateful", "tired"],
  },
  {
    date: "Monday, May 5",
    preview: "Didn't sleep at all. Feeling like I'm failing but I know that's not true. Just need to get through today...",
    mood: "😔",
    tags: ["tired", "overwhelmed"],
  },
  {
    date: "Sunday, May 4",
    preview: "David took the baby for 2 hours and I actually slept. It felt amazing. Asking for help is okay.",
    mood: "😊",
    tags: ["calm", "grateful"],
  },
];

const prompts = [
  "What was one small win today, even if tiny?",
  "What does your body need right now?",
  "Write a kind note to yourself as if you were your best friend.",
  "What are you most proud of this week?",
];

export default function JournalTab() {
  const [writing, setWriting] = useState(false);
  const [text, setText] = useState("");
  const [activePrompt, setActivePrompt] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="pt-2 pb-1">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground">My Journal</h1>
        </div>
        <p className="text-xs text-muted-foreground">Your safe space — just for you</p>
      </div>

      {/* Write New Entry */}
      <AnimatePresence mode="wait">
        {!writing ? (
          <motion.button
            key="start"
            whileTap={{ scale: 0.98 }}
            onClick={() => setWriting(true)}
            className="w-full bg-gradient-to-br from-calm-cream to-calm-peach rounded-3xl p-5 border border-border/20 text-left shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <PenLine className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Continue today's journal</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed italic">
              "Today was hard but the baby smiled at me..."
            </p>
            <div className="flex items-center gap-1 mt-3 text-primary">
              <span className="text-xs font-semibold">Write more</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </motion.button>
        ) : (
          <motion.div
            key="editor"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-3xl p-5 border border-border/40 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-foreground">Today's entry</p>
              <button onClick={() => setWriting(false)} className="text-xs text-muted-foreground hover:text-foreground">Cancel</button>
            </div>
            <textarea
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="How are you really feeling today, mama? No judgment here..."
              className="w-full h-36 bg-muted/30 rounded-2xl p-3.5 text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none leading-relaxed"
            />
            <button
              onClick={() => setWriting(false)}
              disabled={!text.trim()}
              className={`mt-3 w-full py-3 rounded-2xl text-sm font-semibold transition-all ${
                text.trim() ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground"
              }`}
            >
              Save entry
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guided Prompts */}
      <div className="bg-card rounded-3xl p-5 border border-border/40 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <p className="text-sm font-semibold text-foreground">Gentle prompts</p>
        </div>
        <div className="space-y-2">
          {prompts.map((prompt, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setActivePrompt(i); setWriting(true); setText(""); }}
              className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs leading-relaxed transition-all ${
                activePrompt === i
                  ? "bg-primary/10 text-primary border border-primary/20 font-medium"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
              }`}
            >
              "{prompt}"
            </motion.button>
          ))}
        </div>
      </div>

      {/* Past Entries */}
      <div className="bg-card rounded-3xl p-5 border border-border/40 shadow-sm">
        <p className="text-sm font-semibold text-foreground mb-3">Recent entries</p>
        <div className="space-y-3">
          {pastEntries.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-muted/30 rounded-2xl p-3.5 cursor-pointer hover:bg-muted/50 transition-all"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-muted-foreground font-medium">{entry.date}</span>
                <span className="text-base">{entry.mood}</span>
              </div>
              <p className="text-xs text-foreground/80 leading-relaxed line-clamp-2 italic">
                "{entry.preview}"
              </p>
              <div className="flex gap-1.5 mt-2">
                {entry.tags.map((tag) => (
                  <span key={tag} className="text-[10px] bg-primary/8 text-primary px-2 py-0.5 rounded-full font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}