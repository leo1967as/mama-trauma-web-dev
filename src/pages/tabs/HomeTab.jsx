import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Phone, SmilePlus } from "lucide-react";
import Header from "../../components/calmmama/Header";
import CareTimeline from "../../components/calmmama/CareTimeline";
import RiskIndicator from "../../components/calmmama/RiskIndicator";
import DailyGoal from "../../components/calmmama/DailyGoal";
import { getMoodHistory, getMoodSummary, subscribeToMoodHistory } from "../../lib/mood-data";

function moodLabel(score) {
  if (score === null || score === undefined) return "not checked in yet";
  if (score <= 2) return "having a harder day";
  if (score === 3) return "doing okay";
  return "feeling lighter today";
}

export default function HomeTab({ onNavigate }) {
  const [moodEntries, setMoodEntries] = useState([]);

  useEffect(() => {
    setMoodEntries(getMoodHistory());
    const unsubscribe = subscribeToMoodHistory((nextHistory) => {
      setMoodEntries(nextHistory);
    });

    return unsubscribe;
  }, []);

  const moodSummary = getMoodSummary(moodEntries);
  const todayMood = moodSummary.todayEntry?.moodScore ?? null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      <Header />
      <CareTimeline />

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => onNavigate?.("mood")}
        className="w-full overflow-hidden rounded-[28px] border border-primary/20 bg-gradient-to-br from-primary/10 via-calm-peach to-calm-cream p-5 text-left shadow-lg shadow-primary/10"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
              <SmilePlus className="w-3.5 h-3.5" />
              {moodSummary.hasTodayCheckIn ? "Today is saved" : "Primary action"}
            </div>
            <p className="mt-3 text-lg font-bold text-foreground">
              {moodSummary.hasTodayCheckIn ? "Edit today’s check-in" : "Complete today’s check-in"}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {moodSummary.hasTodayCheckIn
                ? `You are currently logged as ${moodLabel(todayMood)}. Update it if anything has shifted.`
                : "A quick mood check-in keeps support gentle, early, and easier to understand."}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70 shadow-sm">
            <ArrowRight className="w-5 h-5 text-primary" />
          </div>
        </div>
      </motion.button>

      <RiskIndicator entries={moodEntries} />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-3xl border border-border/40 bg-card p-5 shadow-sm"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-foreground">Support is here</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              If today feels too heavy, move straight to support instead of trying to push through alone.
            </p>
          </div>
          <div className="rounded-2xl bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
            Connected care
          </div>
        </div>
        <button className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl bg-primary py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20">
            <Phone className="w-4 h-4" />
          </div>
          <div className="text-left">
            <p>Talk to a professional</p>
            <p className="text-xs text-primary-foreground/75">Available when extra support is needed</p>
          </div>
        </button>
      </motion.div>

      <DailyGoal />
    </motion.div>
  );
}
