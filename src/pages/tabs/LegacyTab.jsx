import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Archive } from "lucide-react";
import JournalSection from "../../components/calmmama/JournalSection";
import MilestonesSection from "../../components/calmmama/MilestonesSection";
import SelfCareTools from "../../components/calmmama/SelfCareTools";
import DailyReminder from "../../components/calmmama/DailyReminder";
import MoodInsights from "../../components/calmmama/MoodInsights";
import { getMoodHistory, subscribeToMoodHistory } from "../../lib/mood-data";

export default function LegacyTab({ onNavigate }) {
  const [moodEntries, setMoodEntries] = useState([]);

  useEffect(() => {
    setMoodEntries(getMoodHistory());
    const unsubscribe = subscribeToMoodHistory((nextHistory) => {
      setMoodEntries(nextHistory);
    });

    return unsubscribe;
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      <div className="pt-2 pb-1">
        <div className="flex items-center gap-2 mb-1">
          <Archive className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Legacy</h1>
        </div>
        <p className="text-xs text-muted-foreground">Previous Home and Mood modules kept here temporarily so they are not lost during the refactor.</p>
      </div>

      <div className="rounded-3xl border border-border/40 bg-card p-5 shadow-sm">
        <p className="text-sm font-semibold text-foreground">Moved out of Home and Mood</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          These modules were useful but too crowded for the main postpartum flow. They stay here until each one gets its own better destination.
        </p>
      </div>

      <JournalSection history={moodEntries} setHistory={setMoodEntries} />
      <MoodInsights entries={moodEntries} />
      <MilestonesSection />
      <SelfCareTools />
      <DailyReminder onNavigate={onNavigate} />
    </motion.div>
  );
}
