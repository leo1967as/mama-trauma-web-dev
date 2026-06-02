import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronRight, PenLine, Sparkles } from "lucide-react";
import { formatHistoryDate, getTodaysMoodEntry, upsertMoodEntry } from "../../lib/mood-data";
import { MOOD_FACES } from "../../lib/faces";

const moods = MOOD_FACES.map(f => ({ svg: f.svg, bg: f.bg, value: f.score, label: f.label ?? f.word }));

const prompts = [
  "What was one small win today, even if tiny?",
  "What does your body need right now?",
  "Write a kind note to yourself as if you were your best friend.",
  "What are you most proud of this week?",
];

export default function JournalSection({ history, setHistory }) {
  const [writing, setWriting] = useState(false);
  const [text, setText] = useState(getTodaysMoodEntry()?.note ?? "");
  const [activePrompt, setActivePrompt] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setText(getTodaysMoodEntry()?.note ?? "");
  }, [history]);

  const handleSaveJournal = () => {
    try {
      const nextHistory = upsertMoodEntry({ note: text });
      const savedEntry = getTodaysMoodEntry();
      if (!savedEntry || savedEntry.note !== text) {
        throw new Error("Saved journal could not be verified.");
      }
      setHistory(nextHistory);
      setWriting(false);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    } catch {
      setSaved(false);
    }
  };

  const noteEntries = history.filter((entry) => entry.note || entry.moodScore !== null).slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-border/40 bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-4 h-4 text-primary" />
          <p className="text-sm font-semibold text-foreground">Journal</p>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          This moved out of the main Mood flow so the daily check-in can stay lighter.
        </p>
      </div>

      {saved ? (
        <div className="bg-emerald-50 border border-emerald-200/60 rounded-2xl px-4 py-3 text-xs text-emerald-700 font-medium">
          Journal saved into today&apos;s check-in.
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        {!writing ? (
          <motion.button
            key="start"
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => setWriting(true)}
            className="w-full bg-gradient-to-br from-calm-cream to-calm-peach rounded-3xl p-5 border border-border/20 text-left shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <PenLine className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Continue today&apos;s journal</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed italic">
              {text ? `"${text.slice(0, 80)}${text.length > 80 ? "..." : ""}"` : "\"Write a short reflection for today's check-in\""}
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
              <p className="text-sm font-semibold text-foreground">Today&apos;s entry</p>
              <button type="button" onClick={() => setWriting(false)} className="text-xs text-muted-foreground hover:text-foreground">
                Cancel
              </button>
            </div>
            <textarea
              autoFocus
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="How are you really feeling today? Keep it short if needed."
              className="w-full h-36 bg-muted/30 rounded-2xl p-3.5 text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none leading-relaxed"
            />
            <button
              type="button"
              onClick={handleSaveJournal}
              disabled={!text.trim()}
              className={`mt-3 w-full py-3 rounded-2xl text-sm font-semibold transition-all ${text.trim() ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground"}`}
            >
              Save entry
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-card rounded-3xl p-5 border border-border/40 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <p className="text-sm font-semibold text-foreground">Gentle prompts</p>
        </div>
        <div className="space-y-2">
          {prompts.map((prompt, index) => (
            <motion.button
              key={prompt}
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActivePrompt(index);
                setWriting(true);
                setText(prompt.endsWith("?") ? `${prompt}\n\n` : `${prompt}\n`);
              }}
              className={`w-full text-left px-3.5 py-3 rounded-2xl text-xs leading-relaxed transition-all ${
                activePrompt === index ? "bg-primary/10 text-primary border border-primary/20 font-medium" : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
              }`}
            >
              &quot;{prompt}&quot;
            </motion.button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-3xl p-5 border border-border/40 shadow-sm">
        <p className="text-sm font-semibold text-foreground mb-3">Recent entries</p>
        <div className="space-y-3">
          {noteEntries.length ? (
            noteEntries.map((entry) => {
              const moodFace = moods.find((item) => item.value === entry.moodScore);
              const preview = entry.note || "Mood-only check-in saved for this day.";
              return (
                <motion.div
                  key={entry.dateKey}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-muted/30 rounded-2xl p-3.5"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] text-muted-foreground font-medium">{formatHistoryDate(entry.dateKey)}</span>
                    {moodFace
                      ? <span style={{ width: 22, height: 22, borderRadius: "50%", background: moodFace.bg, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{moodFace.svg(18)}</span>
                      : <span className="text-sm text-muted-foreground">·</span>
                    }
                  </div>
                  <p className="text-xs text-foreground/80 leading-relaxed line-clamp-2 italic">&quot;{preview}&quot;</p>
                  {entry.tags.length ? (
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {entry.tags.map((tag) => (
                        <span key={tag} className="text-[10px] bg-primary/8 text-primary px-2 py-0.5 rounded-full font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </motion.div>
              );
            })
          ) : (
            <div className="bg-muted/30 rounded-2xl p-4 text-xs text-muted-foreground leading-relaxed">
              No entries yet. Once a mood or note is saved, recent history will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
