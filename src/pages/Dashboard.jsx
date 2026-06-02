import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "../components/calmmama/BottomNav";
import CheckInFlow from "../components/calmmama/CheckInFlow";
import HomeTab from "./tabs/HomeTab";
import MoodTab from "./tabs/MoodTab";
import LegacyTab from "./tabs/LegacyTab";
import TherapyTab from "./tabs/TherapyTab";
import CircleTab from "./tabs/CircleTab";
import CarePlansTab from "./tabs/CarePlansTab";

const tabComponents = {
  home: HomeTab,
  mood: MoodTab,
  legacy: LegacyTab,
  therapy: TherapyTab,
  careplans: CarePlansTab,
  circle: CircleTab,
};

const SECRET = "ADMIN";
const TAP_TARGET = 5;
const TAP_WINDOW_MS = 2000;

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("home");
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [legacyUnlocked, setLegacyUnlocked] = useState(false);
  const [toast, setToast] = useState(null);
  const bufferRef = useRef("");
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef(null);
  const TabContent = tabComponents[activeTab];

  const triggerUnlock = () => {
    setLegacyUnlocked(prev => {
      const next = !prev;
      setToast(next ? "🔓 Legacy unlocked" : "🔒 Legacy hidden");
      setTimeout(() => setToast(null), 2000);
      if (!next && activeTab === "legacy") setActiveTab("home");
      return next;
    });
  };

  // desktop: keyboard "ADMIN"
  useEffect(() => {
    const handleKey = (e) => {
      bufferRef.current = (bufferRef.current + e.key).slice(-SECRET.length);
      if (bufferRef.current === SECRET) {
        triggerUnlock();
        bufferRef.current = "";
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeTab]);

  // mobile: 5 rapid taps on date label
  const handleSecretTap = () => {
    tapCountRef.current += 1;
    clearTimeout(tapTimerRef.current);
    if (tapCountRef.current >= TAP_TARGET) {
      tapCountRef.current = 0;
      triggerUnlock();
    } else {
      tapTimerRef.current = setTimeout(() => { tapCountRef.current = 0; }, TAP_WINDOW_MS);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className={`max-w-md mx-auto pb-32 overflow-y-auto overflow-x-hidden${activeTab !== "home" && activeTab !== "mood" ? " px-4 pt-2" : ""}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "home"
              ? <HomeTab onNavigate={setActiveTab} onCheckIn={() => setCheckInOpen(true)} onSecretTap={handleSecretTap} />
              : activeTab === "mood"
                ? <MoodTab onNavigate={setActiveTab} onCheckIn={() => setCheckInOpen(true)} />
                : activeTab === "legacy"
                  ? <LegacyTab onNavigate={setActiveTab} />
                  : <TabContent />
            }
          </motion.div>
        </AnimatePresence>
      </div>

      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        legacyUnlocked={legacyUnlocked}
      />

      {checkInOpen && (
        <CheckInFlow onClose={() => setCheckInOpen(false)} />
      )}

      {/* Admin unlock toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[80] pointer-events-none"
          >
            <div className="bg-foreground/90 text-background text-xs font-bold px-4 py-2 rounded-full shadow-lg">
              {toast}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
