import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import {
  AlertCircle,
  Archive,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MessageCircleHeart,
  Moon,
  Smile,
  TrendingUp,
} from "lucide-react";
import {
  getMoodChartData,
  getMoodHistory,
  getMoodInsights,
  getMoodRiskSummary,
  getMoodSummary,
  getTodaysMoodEntry,
  hasMoodChartData,
  subscribeToMoodHistory,
  upsertMoodEntry,
} from "../../lib/mood-data";

const moods = [
  { emoji: "😢", label: "Sad", value: 1 },
  { emoji: "😔", label: "Low", value: 2 },
  { emoji: "😐", label: "Okay", value: 3 },
  { emoji: "🙂", label: "Good", value: 4 },
  { emoji: "😊", label: "Great", value: 5 },
];

const tags = ["overwhelmed", "tired", "anxious", "lonely", "hopeful", "calm", "grateful", "proud"];
const supportOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];
const sleepHoursOptions = Array.from({ length: 25 }, (_, hour) => String(hour));

const insightIconMap = {
  sleep: Moon,
  support: MessageCircleHeart,
  tag: AlertCircle,
  trend: TrendingUp,
};

const riskToneMap = {
  red: "border-red-200/80 bg-red-50 text-red-700",
  orange: "border-amber-200/80 bg-amber-50 text-amber-700",
  yellow: "border-yellow-200/80 bg-yellow-50 text-yellow-700",
  green: "border-emerald-200/80 bg-emerald-50 text-emerald-700",
  none: "border-border/40 bg-card text-foreground",
};

function formatSavedTime(updatedAt) {
  if (!updatedAt) {
    return null;
  }

  return new Date(updatedAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MoodTab({ onNavigate }) {
  const [history, setHistory] = useState(() => getMoodHistory());
  const [selectedMood, setSelectedMood] = useState(() => getTodaysMoodEntry()?.moodScore ?? null);
  const [selectedTags, setSelectedTags] = useState(() => getTodaysMoodEntry()?.tags ?? []);
  const [energy, setEnergy] = useState(() => getTodaysMoodEntry()?.energyLevel ?? 50);
  const [sleepHours, setSleepHours] = useState(() => String(getTodaysMoodEntry()?.sleepHours ?? 0));
  const [supportContacted, setSupportContacted] = useState(() => getTodaysMoodEntry()?.supportContacted ?? "no");
  const [note, setNote] = useState(() => getTodaysMoodEntry()?.note ?? "");
  const [detailsOpen, setDetailsOpen] = useState(() => {
    const todayEntry = getTodaysMoodEntry();
    return Boolean(todayEntry?.note || todayEntry?.sleepHours || todayEntry?.supportContacted === "yes");
  });
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [sleepPickerOpen, setSleepPickerOpen] = useState(false);
  const [sleepPickerClosing, setSleepPickerClosing] = useState(false);
  const [sleepTriggerBounce, setSleepTriggerBounce] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToMoodHistory((nextHistory) => {
      setHistory(nextHistory);
    });

    return unsubscribe;
  }, []);

  const summary = useMemo(() => getMoodSummary(history), [history]);
  const todayEntry = summary.todayEntry;
  const riskSummary = useMemo(() => getMoodRiskSummary(history), [history]);
  const primaryInsight = useMemo(() => getMoodInsights(history)[0] || null, [history]);

  useEffect(() => {
    setSelectedMood(todayEntry?.moodScore ?? null);
    setSelectedTags(todayEntry?.tags ?? []);
    setEnergy(todayEntry?.energyLevel ?? 50);
    setSleepHours(String(todayEntry?.sleepHours ?? 0));
    setSupportContacted(todayEntry?.supportContacted ?? "no");
    setNote(todayEntry?.note ?? "");
  }, [todayEntry?.updatedAt]);

  const chartData = getMoodChartData(history, 7, { previewMoodScore: selectedMood });
  const chartAnimationKey = useMemo(
    () => chartData.map((row) => `${row.dateKey}:${row.mood ?? "null"}`).join("|"),
    [chartData],
  );
  const showChartData = hasMoodChartData(chartData);
  const statusLabel = summary.hasTodayCheckIn ? "Saved today" : "Not checked in yet";
  const statusMessage = summary.hasTodayCheckIn
    ? "Today’s check-in is already saved. You can adjust it anytime."
    : "Keep this short: choose your mood, add what matters, and save.";
  const savedTime = formatSavedTime(todayEntry?.updatedAt);

  const toggleTag = (tag) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]));
  };

  const handleSleepSelect = (hour) => {
    setSleepHours(hour);
    setSleepPickerClosing(true);
    setSleepTriggerBounce(true);

    window.setTimeout(() => {
      setSleepPickerOpen(false);
      setSleepPickerClosing(false);
    }, 260);

    window.setTimeout(() => {
      setSleepTriggerBounce(false);
    }, 420);
  };

  const handleSave = () => {
    setSaveError("");

    try {
      const nextHistory = upsertMoodEntry({
        moodScore: selectedMood,
        energyLevel: energy,
        sleepHours,
        tags: selectedTags,
        note,
        supportContacted,
      });

      const savedEntry = getTodaysMoodEntry();
      if (!savedEntry || savedEntry.moodScore !== selectedMood) {
        throw new Error("Saved entry could not be verified.");
      }

      setHistory(nextHistory);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch {
      setSaveError("Save did not complete. Please try again.");
    }
  };

  const sleepPickerPortal =
    sleepPickerOpen && typeof document !== "undefined"
      ? createPortal(
          <AnimatePresence>
            <motion.div
              key="sleep-picker-backdrop"
              onClick={() => {
                setSleepPickerOpen(false);
                setSleepPickerClosing(false);
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[50] bg-black/30 backdrop-blur-[2px]"
            />
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <motion.div
                key="sleep-picker-modal"
                role="dialog"
                aria-modal="true"
                aria-label="Sleep time picker"
                onClick={(event) => event.stopPropagation()}
                initial={{ opacity: 0, y: 18, scale: 0.96 }}
                animate={
                  sleepPickerClosing
                    ? { opacity: [1, 1, 0], y: [0, -6, 10], scale: [1, 1.04, 0.96] }
                    : { opacity: 1, y: 0, scale: [0.96, 1.01, 1] }
                }
                exit={{ opacity: 0, y: 18, scale: 0.96 }}
                transition={{ duration: sleepPickerClosing ? 0.26 : 0.3, ease: "easeOut" }}
                className="z-[60] w-[min(92vw,320px)] overflow-hidden rounded-3xl border border-border/40 bg-card shadow-2xl shadow-black/20"
              >
                <div className="flex items-center justify-between border-b border-border/30 px-4 py-3">
                  <p className="text-xs font-semibold text-foreground">Sleep time</p>
                </div>
                <div className="max-h-[min(60vh,320px)] overflow-y-auto p-2">
                  {sleepHoursOptions.map((hour) => {
                    const active = String(sleepHours) === hour;
                    return (
                      <motion.button
                        key={hour}
                        type="button"
                        onClick={() => handleSleepSelect(hour)}
                        animate={{ scale: 1 }}
                        className={`flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-xs font-medium transition-colors duration-150 ${
                          active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        }`}
                      >
                        <span>{hour} hrs</span>
                        {active ? <span className="h-1.5 w-1.5 rounded-full bg-current" /> : null}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </AnimatePresence>,
          document.body,
        )
      : null;

  const saveSuccessPortal =
    saved && typeof document !== "undefined"
      ? createPortal(
          <AnimatePresence>
            <div className="pointer-events-none fixed inset-x-0 bottom-28 z-[70] flex justify-center px-4">
              <motion.div
                key="save-success-popup"
                initial={{ opacity: 0, y: 18, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: [0.94, 1.025, 1] }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{
                  opacity: { duration: 0.2, ease: "easeOut" },
                  y: { type: "spring", stiffness: 360, damping: 24 },
                  scale: { type: "spring", stiffness: 320, damping: 18 },
                }}
                className="w-[min(92vw,360px)] rounded-[28px] border border-emerald-200/70 bg-white/95 px-4 py-4 shadow-2xl shadow-emerald-900/10 backdrop-blur-xl"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Check-in saved</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      Today&apos;s mood was saved and verified. Your trend has been updated.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </AnimatePresence>,
          document.body,
        )
      : null;

  const InsightIcon = primaryInsight ? insightIconMap[primaryInsight.type] || TrendingUp : TrendingUp;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="space-y-4">
      <div className="pt-2 pb-1">
        <div className="flex items-center gap-2 mb-1">
          <Smile className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Mood Check-In</h1>
        </div>
        <p className="text-xs text-muted-foreground">A quick daily check-in first. Deeper reflection can wait.</p>
      </div>

      <div className="rounded-3xl border border-border/40 bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-foreground">Today&apos;s check-in</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{statusMessage}</p>
          </div>
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">{statusLabel}</span>
        </div>
        {savedTime ? <p className="mt-3 text-[11px] font-medium text-muted-foreground">Last saved at {savedTime}</p> : null}
      </div>

      <div className="bg-card rounded-3xl p-5 border border-border/40 shadow-sm">
        <div className="flex items-center justify-between mb-4 gap-3">
          <p className="text-sm font-semibold text-foreground">How are you feeling?</p>
          <span className="text-[10px] px-2 py-1 rounded-full bg-primary/10 text-primary font-bold">
            {selectedMood ? "Selected" : "Choose one"}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          {moods.map((mood) => (
            <button key={mood.value} type="button" onClick={() => setSelectedMood(mood.value)} className="flex flex-col items-center gap-1.5">
              <motion.div
                whileTap={{ scale: 0.88 }}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all duration-200 ${
                  selectedMood === mood.value ? "bg-primary/15 ring-2 ring-primary/40 shadow-md scale-110" : "bg-muted/60 hover:bg-muted"
                }`}
              >
                {mood.emoji}
              </motion.div>
              <span className={`text-[10px] font-medium ${selectedMood === mood.value ? "text-primary" : "text-muted-foreground"}`}>{mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-3xl p-5 border border-border/40 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-foreground">Energy level</p>
          <span className="text-sm font-bold text-primary">{energy}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={energy}
          onChange={(event) => setEnergy(Number(event.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${energy}%, hsl(var(--muted)) ${energy}%, hsl(var(--muted)) 100%)` }}
        />
        <style>{`input[type='range']::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; border-radius: 50%; background: white; border: 3px solid hsl(var(--primary)); box-shadow: 0 2px 8px rgba(0,0,0,0.12); cursor: pointer; }`}</style>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-muted-foreground">Exhausted</span>
          <span className="text-[10px] text-muted-foreground">Energized</span>
        </div>
      </div>

      <div className="bg-card rounded-3xl p-5 border border-border/40 shadow-sm">
        <p className="text-sm font-semibold text-foreground mb-3">Tags / issues today</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <motion.button
              key={tag}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                selectedTags.includes(tag) ? "bg-primary/15 text-primary border border-primary/30" : "bg-muted/60 text-muted-foreground border border-transparent hover:bg-muted"
              }`}
            >
              {tag}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-3xl border border-border/40 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setDetailsOpen((prev) => !prev)}
          className="flex w-full items-center justify-between px-5 py-4 text-left"
        >
          <div>
            <p className="text-sm font-semibold text-foreground">More details</p>
            <p className="mt-1 text-xs text-muted-foreground">Optional: sleep, support, and a short note.</p>
          </div>
          {detailsOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>
        <AnimatePresence initial={false}>
          {detailsOpen ? (
            <motion.div
              key="details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="space-y-3 border-t border-border/30 px-5 pb-5 pt-3">
                <div className="relative rounded-2xl border border-border/30 bg-[hsl(var(--muted)/0.45)] p-4 shadow-inner">
                  <p className="text-[11px] font-medium text-muted-foreground/85">Sleep last night</p>
                  <motion.button
                    type="button"
                    onClick={() => setSleepPickerOpen(true)}
                    animate={sleepTriggerBounce ? { scale: [1, 1.035, 0.985, 1] } : { scale: 1 }}
                    transition={{ duration: 0.32, ease: "easeOut" }}
                    className="mt-2 flex w-full items-end justify-between rounded-2xl border border-transparent bg-background/70 px-4 py-3 text-left outline-none transition-all duration-200 ease-out hover:border-primary/25 focus:border-primary/40 focus:shadow-md focus:shadow-primary/10"
                  >
                    <div>
                      <span className="block text-2xl font-semibold leading-none text-foreground">{String(sleepHours || "0")} hrs</span>
                      <span className="mt-1 block text-[11px] text-muted-foreground">Tap to change</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </motion.button>
                </div>

                <div className="rounded-2xl border border-border/30 bg-[hsl(var(--muted)/0.45)] p-4 shadow-inner">
                  <p className="text-[11px] font-medium text-muted-foreground/85">Did you reach out to someone today?</p>
                  <div className="mt-3 flex rounded-2xl border border-border/30 bg-background/60 p-1.5 relative">
                    <motion.div
                      animate={{ x: supportContacted === "yes" ? "0%" : "100%" }}
                      transition={{ type: "spring", stiffness: 550, damping: 38 }}
                      className="absolute inset-y-1.5 left-1.5 w-[calc(50%-0.375rem)] rounded-xl bg-primary shadow-[0_8px_18px_rgba(0,0,0,0.12)] ring-1 ring-primary/20"
                    />
                    {supportOptions.map((option) => {
                      const active = supportContacted === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setSupportContacted(option.value)}
                          className={`relative z-10 flex-1 rounded-xl py-3 text-sm font-semibold transition-colors duration-200 ${
                            active ? "text-primary-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border border-border/30 bg-[hsl(var(--muted)/0.3)] p-4">
                  <p className="text-[11px] font-medium text-muted-foreground/85">Anything else you want to note today?</p>
                  <textarea
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="You can keep this short."
                    className="mt-3 w-full min-h-20 bg-background/70 border border-border/30 rounded-2xl p-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/40"
                  />
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      {sleepPickerPortal}
      {saveSuccessPortal}

      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={handleSave}
        disabled={!selectedMood}
        className={`w-full py-4 rounded-2xl font-semibold text-sm transition-all ${
          selectedMood ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground cursor-not-allowed"
        }`}
      >
        <AnimatePresence mode="wait">
          {saved ? (
            <motion.span key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              Saved today&apos;s check-in
            </motion.span>
          ) : (
            <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              Save today&apos;s mood
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {saveError ? (
        <div className="rounded-2xl border border-red-200/70 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">{saveError}</div>
      ) : null}

      <div className="bg-card rounded-3xl p-5 border border-border/40 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-primary" />
          <p className="text-sm font-semibold text-foreground">Your 7-day trend</p>
        </div>
        <div className="relative h-32 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="moodGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} dy={8} />
              <YAxis hide domain={[0, 5]} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "12px" }}
                formatter={(value) => [`${value}/5`, "Mood"]}
              />
              <Area
                key={chartAnimationKey}
                type="monotone"
                dataKey="mood"
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                fill="url(#moodGrad2)"
                isAnimationActive
                animationBegin={40}
                animationDuration={720}
                animationEasing="ease-out"
                dot={({ cx, cy, payload }) =>
                  payload?.mood !== null ? <circle cx={cx} cy={cy} r={3.5} fill="hsl(var(--primary))" stroke="white" strokeWidth={1.5} /> : null
                }
                connectNulls
                activeDot={{ r: 5, fill: "hsl(var(--primary))", stroke: "white", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
          {!showChartData ? (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-gradient-to-b from-transparent to-background/50">
              <p className="px-4 text-center text-[11px] font-medium text-muted-foreground">
                Pick today&apos;s mood or save a check-in to start the trend line.
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {primaryInsight ? (
        <div className="bg-card rounded-3xl p-5 border border-border/40 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <InsightIcon className="w-4 h-4 text-primary" />
            <p className="text-sm font-semibold text-foreground">One pattern to notice</p>
          </div>
          <p className="text-xs leading-relaxed text-foreground/80">{primaryInsight.text}</p>
        </div>
      ) : null}

      <div className={`rounded-3xl border px-5 py-4 shadow-sm ${riskToneMap[riskSummary.level]}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">{riskSummary.label}</p>
            <p className="mt-1 text-xs leading-relaxed opacity-90">{riskSummary.message}</p>
            <p className="mt-3 text-xs font-semibold">Next step: {riskSummary.action}</p>
          </div>
          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
        </div>
      </div>

      {onNavigate ? (
        <button
          type="button"
          onClick={() => onNavigate("legacy")}
          className="w-full rounded-3xl border border-border/40 bg-card px-5 py-4 text-left shadow-sm transition-colors hover:bg-muted/20"
        >
          <div className="flex items-start gap-3">
            <Archive className="mt-0.5 h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground">Looking for journal or older modules?</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Previous Mood sections now live in Legacy so this page can stay focused on the daily check-in.
              </p>
            </div>
          </div>
        </button>
      ) : null}
    </motion.div>
  );
}
