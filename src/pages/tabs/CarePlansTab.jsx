import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Sparkles, CheckCircle2, Circle, RefreshCw, Heart, Brain, Moon, ChevronDown } from "lucide-react";
import { FONT_BODY, COLORS, Card, PrimaryButton, TabHero, TabSheet, HeroAccent } from "../../lib/theme.jsx";
import { getMoodHistory, getMoodInsights, getMoodSupportSummary, subscribeToMoodHistory } from "../../lib/mood-data";
import { getCarePlanState, saveCarePlanState, clearCarePlanState } from "../../lib/careplan-data";

const SCORE_WORD = { 1: "rough", 2: "low", 3: "okay", 4: "good", 5: "light" };

const categoryIcons = {
  Emotional: Heart,
  Sleep: Moon,
  Social: Sparkles,
  Mindset: Brain,
};

const categoryColors = {
  Emotional: { bg: COLORS.accentSoft, text: COLORS.accent, dot: COLORS.accent },
  Sleep: { bg: COLORS.blueGreySoft, text: COLORS.blueGrey, dot: COLORS.blueGrey },
  Social: { bg: COLORS.lavenderSoft, text: COLORS.lavender, dot: COLORS.lavender },
  Mindset: { bg: COLORS.greenSoft, text: COLORS.green, dot: COLORS.green },
};

const PLAN_TEMPLATE = [
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
      { action: "Ask for one evening support task", tip: "Choose one concrete task someone else can take." },
    ],
  },
  {
    category: "Social",
    title: "Stay lightly connected",
    why: "Quick connection moments reduce isolation and restore emotional energy.",
    habits: [
      { action: "Send one honest message daily", tip: "Keep it short and real." },
      { action: "Reply to one caring person", tip: "A short reply is enough." },
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
];

function buildCarePlanContext(entries) {
  const recentMoods = entries
    .slice(0, 3)
    .map((entry) => SCORE_WORD[entry.moodScore])
    .filter(Boolean);
  const insights = getMoodInsights(entries);
  const support = getMoodSupportSummary(entries);

  let priorityCategory = null;
  for (const insight of insights) {
    if (insight.key === "sleep-low") priorityCategory = "Sleep";
    else if (insight.type === "support" && !priorityCategory) priorityCategory = "Social";
    else if (insight.type === "tag" && !priorityCategory) priorityCategory = "Emotional";
  }

  return { recentMoods, insights, support, priorityCategory, hasHistory: entries.length > 0 };
}

function buildSummary(context) {
  if (!context.hasHistory) {
    return "Once a few daily check-ins are logged, this plan will reflect your own patterns. For now, here are some gentle places to start.";
  }
  const moodLine = context.recentMoods.length
    ? `Your last few check-ins have felt ${context.recentMoods.join(", ")}. `
    : "";
  const insightLine = context.insights[0]?.text || "";
  return `${moodLine}${insightLine} This plan keeps goals small, kind, and doable today.`;
}

function buildLocalPlan(entries) {
  const context = buildCarePlanContext(entries);
  let goals = PLAN_TEMPLATE.map((goal) => ({ ...goal }));
  if (context.priorityCategory) {
    goals = [
      ...goals.filter((g) => g.category === context.priorityCategory),
      ...goals.filter((g) => g.category !== context.priorityCategory),
    ];
  }
  return { summary: buildSummary(context), goals };
}

function GoalCard({ goal, index, completedHabits, onToggleHabit }) {
  const [expanded, setExpanded] = useState(index === 0);
  const reduceMotion = useReducedMotion();
  const colors = categoryColors[goal.category] || categoryColors.Emotional;
  const Icon = categoryIcons[goal.category] || Heart;
  const doneCount = goal.habits.filter((_, i) => completedHabits.has(`${goal.category}-${i}`)).length;
  const progressValue = Math.round((doneCount / goal.habits.length) * 100);
  const contentId = `care-goal-${goal.category.toLowerCase()}-content`;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? { duration: 0.15 } : { delay: index * 0.05, duration: 0.22 }}
      style={{ borderRadius: 16, border: `1px solid ${COLORS.border}`, background: colors.bg, overflow: "hidden", fontFamily: FONT_BODY }}
    >
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
        aria-controls={contentId}
        style={{ width: "100%", textAlign: "left", minHeight: 44, padding: 16, background: "none", border: 0, cursor: "pointer" }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,.7)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 1px 4px rgba(80,56,42,.06)" }}>
            <Icon style={{ width: 16, height: 16, color: colors.text }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: colors.text }}>{goal.category}</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, color: COLORS.muted }}>
                {doneCount}/{goal.habits.length} today
                <ChevronDown
                  aria-hidden="true"
                  style={{
                    width: 14,
                    height: 14,
                    transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                    transition: reduceMotion ? "none" : "transform 180ms ease",
                  }}
                />
              </span>
            </div>
            <p style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginTop: 2 }}>{goal.title}</p>
            <p style={{ fontSize: 12, color: COLORS.muted, marginTop: 2, lineHeight: 1.5 }}>{goal.why}</p>
          </div>
        </div>

        <div
          style={{ marginTop: 12, height: 6, background: "rgba(255,255,255,.6)", borderRadius: 999, overflow: "hidden" }}
          role="progressbar"
          aria-label={`${goal.category} habits completed`}
          aria-valuemin={0}
          aria-valuemax={goal.habits.length}
          aria-valuenow={doneCount}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressValue}%` }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.25, ease: "easeOut" }}
            aria-hidden="true"
            style={{ height: "100%", background: colors.dot, borderRadius: 999 }}
          />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id={contentId}
            initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={reduceMotion ? { duration: 0.12 } : { duration: 0.22, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
            role="region"
            aria-label={`${goal.category} habit list`}
          >
            <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
              {goal.habits.map((habit, i) => {
                const key = `${goal.category}-${i}`;
                const done = completedHabits.has(key);
                return (
                  <motion.button
                    key={i}
                    type="button"
                    whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                    onClick={() => onToggleHabit(key)}
                    role="checkbox"
                    aria-checked={done}
                    style={{
                      width: "100%",
                      minHeight: 44,
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      padding: 12,
                      borderRadius: 10,
                      border: `2px solid ${done ? "rgba(255,255,255,.7)" : "transparent"}`,
                      background: done ? "rgba(255,255,255,.8)" : "rgba(255,255,255,.4)",
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    {done ? (
                      <CheckCircle2 style={{ width: 16, height: 16, color: colors.text, marginTop: 2, flexShrink: 0 }} />
                    ) : (
                      <Circle style={{ width: 16, height: 16, color: "rgba(60,50,45,.3)", marginTop: 2, flexShrink: 0 }} />
                    )}
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: done ? COLORS.muted : COLORS.text, textDecoration: done ? "line-through" : "none", lineHeight: 1.4 }}>
                        {habit.action}
                      </p>
                      <p style={{ fontSize: 10.5, color: COLORS.muted, marginTop: 2, lineHeight: 1.4 }}>{habit.tip}</p>
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
  const reduceMotion = useReducedMotion();
  const generationTimer = useRef(null);
  const [entries, setEntries] = useState([]);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [completedHabits, setCompletedHabits] = useState(new Set());

  useEffect(() => {
    const history = getMoodHistory();
    setEntries(history);
    const unsubscribe = subscribeToMoodHistory(setEntries);

    const saved = getCarePlanState();
    if (saved) {
      setPlan(saved.plan);
      setCompletedHabits(new Set(saved.completedHabitKeys || []));
    }

    return () => {
      unsubscribe();
      clearTimeout(generationTimer.current);
    };
  }, []);

  const toggleHabit = (key) => {
    setCompletedHabits((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      if (plan) saveCarePlanState(plan, [...next]);
      return next;
    });
  };

  const generatePlan = () => {
    if (loading) return;
    clearTimeout(generationTimer.current);
    setLoading(true);
    setCompletedHabits(new Set());
    generationTimer.current = setTimeout(() => {
      const result = buildLocalPlan(entries);
      setPlan(result);
      saveCarePlanState(result, []);
      setLoading(false);
    }, reduceMotion ? 320 : 450);
  };

  const regeneratePlan = () => {
    clearCarePlanState();
    generatePlan();
  };

  const totalHabits = plan?.goals?.reduce((acc, g) => acc + g.habits.length, 0) || 0;
  const doneCount = completedHabits.size;

  const overallProgress = totalHabits ? Math.round((doneCount / totalHabits) * 100) : 0;

  return (
    <div style={{ fontFamily: FONT_BODY }}>
      <TabHero
        theme="honey"
        eyebrow="Care plan"
        title={<>Your gentle plan<HeroAccent>for today.</HeroAccent></>}
        subtitle="A few small, doable goals — built around how the last few days have felt."
      />
      <TabSheet gap={16}>
      {/* Generate CTA */}
      {!plan && !loading && (
        <Card style={{ textAlign: "center", padding: 28 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: COLORS.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Sparkles style={{ width: 28, height: 28, color: COLORS.accent }} />
          </div>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: COLORS.heading, marginBottom: 6 }}>Your personalized plan awaits</h2>
          <p style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.6, marginBottom: 20, padding: "0 8px" }}>
            Afterbloom will build a small care plan from your recent check-ins — kept gentle, kept doable.
          </p>
          <PrimaryButton
            onClick={generatePlan}
            disabled={loading}
            style={{ minHeight: 44, padding: 15, fontWeight: 700, fontSize: 14.5, boxShadow: `0 12px 24px ${COLORS.ctaShadow}` }}
          >
            Generate my care plan
          </PrimaryButton>
        </Card>
      )}

      {/* Loading */}
      {loading && (
        <div role="status" aria-live="polite" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 0", gap: 16 }}>
          <motion.div
            animate={reduceMotion ? undefined : { rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            aria-hidden="true"
            style={{ width: 40, height: 40, borderRadius: "50%", border: `4px solid ${COLORS.accentSoft}`, borderTopColor: COLORS.accent }}
          />
          <p style={{ fontSize: 14, fontWeight: 600, color: COLORS.heading }}>Building your plan…</p>
        </div>
      )}

      {/* Plan */}
      {plan && !loading && (
        <>
          <Card>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: COLORS.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Heart style={{ width: 16, height: 16, color: COLORS.accent }} />
              </div>
              <p style={{ fontSize: 12.5, color: COLORS.text, lineHeight: 1.6, flex: 1 }}>{plan.summary}</p>
            </div>

            {totalHabits > 0 && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${COLORS.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: COLORS.muted }}>Today's habits</span>
                  <span style={{ fontSize: 10, fontWeight: 800, color: COLORS.accentInk }}>{doneCount}/{totalHabits} done</span>
                </div>
                <div
                  style={{ height: 8, background: COLORS.border, borderRadius: 999, overflow: "hidden" }}
                  role="progressbar"
                  aria-label="Today's habits completed"
                  aria-valuemin={0}
                  aria-valuemax={totalHabits}
                  aria-valuenow={doneCount}
                >
                  <motion.div
                    animate={{ width: `${overallProgress}%` }}
                    transition={reduceMotion ? { duration: 0 } : { duration: 0.25 }}
                    aria-hidden="true"
                    style={{ height: "100%", background: COLORS.accent, borderRadius: 999 }}
                  />
                </div>
              </div>
            )}
          </Card>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {plan.goals?.map((goal, i) => (
              <GoalCard key={goal.category} goal={goal} index={i} completedHabits={completedHabits} onToggleHabit={toggleHabit} />
            ))}
          </div>

          <PrimaryButton
            variant="secondary"
            onClick={regeneratePlan}
            disabled={loading}
            style={{ minHeight: 44, padding: 14, border: `2px solid ${COLORS.border}`, fontSize: 13, fontWeight: 700, color: COLORS.muted }}
          >
            <RefreshCw style={{ width: 16, height: 16 }} /> Regenerate plan
          </PrimaryButton>
        </>
      )}
      </TabSheet>
    </div>
  );
}
