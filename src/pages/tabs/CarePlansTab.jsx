import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Sparkles, CheckCircle2, Circle, RefreshCw, Target, Flame, Heart, Brain, Sun, Moon } from "lucide-react";

// Simulated user context (in a real app this would come from stored mood/journal/therapy data)
const userContext = {
  recentMoods: ["anxious", "tired", "hopeful"],
  journalThemes: ["sleep deprivation", "bonding with baby", "feeling isolated"],
  therapyFocus: "postpartum anxiety and self-compassion",
};

const categoryIcons = {
  "Emotional": Heart,
  "Sleep": Moon,
  "Social": Sparkles,
  "Physical": Flame,
  "Mindset": Brain,
  "Routine": Sun,
};

const categoryColors = {
  "Emotional": { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-200", dot: "bg-rose-400" },
  "Sleep": { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-200", dot: "bg-indigo-400" },
  "Social": { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-200", dot: "bg-violet-400" },
  "Physical": { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200", dot: "bg-orange-400" },
  "Mindset": { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", dot: "bg-emerald-400" },
  "Routine": { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200", dot: "bg-amber-400" },
};

function buildLocalPlan(context) {
  const moodLine = context.recentMoods.join(", ");
  const themeLine = context.journalThemes.join(", ");
  return {
    summary: `You have been feeling ${moodLine}. Based on your recent journal themes (${themeLine}), this plan keeps goals small, kind, and doable each day.`,
    goals: [
      {
        category: "Emotional",
        title: "Name feelings without judgment",
        why: "Naming emotions helps reduce overwhelm and creates emotional space.",
        habits: [
          { action: "Mood check-in after breakfast", tip: "One word is enough today." },
          { action: "Write one feeling in notes", tip: "No need for long journaling." },
          { action: "Say a kind line to yourself", tip: "Speak as you would to someone you trust." },
        ],
      },
      {
        category: "Sleep",
        title: "Protect short recovery windows",
        why: "Small sleep protection steps can improve next-day mood and patience.",
        habits: [
          { action: "10-minute rest before noon", tip: "Eyes closed still counts as rest." },
          { action: "Screen-off 20 minutes before bed", tip: "Use warm light if needed." },
          { action: "Ask for one evening support task", tip: "Delegate one thing, guilt-free." },
        ],
      },
      {
        category: "Social",
        title: "Stay lightly connected",
        why: "Quick connection moments reduce isolation and restore emotional energy.",
        habits: [
          { action: "Send one honest message daily", tip: "Keep it short and real." },
          { action: "Reply to one caring person", tip: "A heart emoji is enough." },
          { action: "Ask one concrete favor", tip: "Specific asks get better help." },
        ],
      },
      {
        category: "Mindset",
        title: "Practice tiny self-compassion",
        why: "Gentle self-talk supports healing through postpartum transitions.",
        habits: [
          { action: "Pause for 3 deep breaths", tip: "Use slow exhale to calm." },
          { action: "List one thing done well", tip: "Small wins are real wins." },
          { action: "Replace one harsh thought", tip: "Try: I am learning, not failing." },
        ],
      },
    ],
  };
}

function GoalCard({ goal, index, completedHabits, onToggleHabit }) {
  const [expanded, setExpanded] = useState(index === 0);
  const colors = categoryColors[goal.category] || categoryColors["Emotional"];
  const Icon = categoryIcons[goal.category] || Heart;
  const doneCount = goal.habits.filter((_, i) => completedHabits.has(`${goal.category}-${i}`)).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`rounded-3xl border ${colors.border} ${colors.bg} overflow-hidden`}
    >
      {/* Goal Header */}
      <button onClick={() => setExpanded((e) => !e)} className="w-full text-left p-4">
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-2xl bg-white/70 flex items-center justify-center flex-shrink-0 shadow-sm`}>
            <Icon className={`w-4 h-4 ${colors.text}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-wide ${colors.text}`}>{goal.category}</span>
              <span className="text-[10px] text-muted-foreground font-medium">{doneCount}/{goal.habits.length} today</span>
            </div>
            <p className="text-sm font-bold text-foreground mt-0.5 leading-snug">{goal.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{goal.why}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1.5 bg-white/60 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(doneCount / goal.habits.length) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`h-full ${colors.dot} rounded-full`}
          />
        </div>
      </button>

      {/* Habits */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2">
              {goal.habits.map((habit, i) => {
                const key = `${goal.category}-${i}`;
                const done = completedHabits.has(key);
                return (
                  <motion.button
                    key={i}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onToggleHabit(key)}
                    className={`w-full flex items-start gap-3 p-3 rounded-2xl border-2 transition-all text-left ${
                      done ? "bg-white/80 border-white/60" : "bg-white/40 border-transparent"
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 className={`w-4 h-4 ${colors.text} mt-0.5 flex-shrink-0`} />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground/40 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <p className={`text-xs font-semibold leading-snug ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                        {habit.action}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{habit.tip}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function CarePlansTab() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [completedHabits, setCompletedHabits] = useState(new Set());

  const toggleHabit = (key) => {
    setCompletedHabits((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const generatePlan = async () => {
    setLoading(true);
    setCompletedHabits(new Set());
    try {
      const result = buildLocalPlan(userContext);
      setPlan(result);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const totalHabits = plan?.goals?.reduce((acc, g) => acc + g.habits.length, 0) || 0;
  const doneCount = completedHabits.size;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="space-y-4">
      {/* Header */}
      <div className="pt-2 pb-1">
        <div className="flex items-center gap-2 mb-1">
          <Target className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Care Plans</h1>
        </div>
        <p className="text-xs text-muted-foreground">Personalized goals built just for you</p>
      </div>

      {/* Generate CTA */}
      {!plan && !loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-calm-lavender to-calm-rose rounded-3xl p-6 text-center border border-border/20 shadow-sm"
        >
          <div className="w-14 h-14 bg-white/60 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Sparkles className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-base font-bold text-foreground mb-1.5">Your personalized plan awaits</h2>
          <p className="text-xs text-muted-foreground leading-relaxed mb-5 px-2">
            Based on your mood logs, journal entries, and therapy sessions, Afterbloom will create a care plan tailored to where you are right now.
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={generatePlan}
            className="w-full py-4 bg-primary text-primary-foreground rounded-2xl text-sm font-bold shadow-lg shadow-primary/25"
          >
            Generate my care plan ✨
          </motion.button>
        </motion.div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary"
          />
          <p className="text-sm font-semibold text-foreground">Building your plan…</p>
          <p className="text-xs text-muted-foreground text-center px-6">Reviewing your mood, journal, and therapy notes</p>
        </div>
      )}

      {/* Plan */}
      {plan && !loading && (
        <>
          {/* Summary card */}
          <div className="bg-card rounded-3xl p-4 border border-border/40 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Heart className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xs text-foreground/80 leading-relaxed flex-1">{plan.summary}</p>
            </div>

            {/* Overall progress */}
            {totalHabits > 0 && (
              <div className="mt-3 pt-3 border-t border-border/30">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground">Today's habits</span>
                  <span className="text-[10px] font-bold text-primary">{doneCount}/{totalHabits} done</span>
                </div>
                <div className="h-2 bg-muted/60 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${(doneCount / totalHabits) * 100}%` }}
                    transition={{ duration: 0.4 }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Goal cards */}
          <div className="space-y-3">
            {plan.goals?.map((goal, i) => (
              <GoalCard
                key={i}
                goal={goal}
                index={i}
                completedHabits={completedHabits}
                onToggleHabit={toggleHabit}
              />
            ))}
          </div>

          {/* Regenerate */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={generatePlan}
            className="w-full py-3.5 rounded-2xl border-2 border-border/50 bg-card text-sm font-semibold text-muted-foreground flex items-center justify-center gap-2 hover:border-primary/30 hover:text-primary transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Regenerate plan
          </motion.button>
        </>
      )}
    </motion.div>
  );
}


