import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "../components/afterbloom/BottomNav";
import { logSafetyAccess } from "../lib/mood-data";
import HomeTab from "./tabs/HomeTab";

// Lazy: heavy modals + secondary tabs -> out of initial chunk.
const MoodTab = lazy(() => import("./tabs/MoodTab"));
const CheckInFlow = lazy(() => import("../components/afterbloom/CheckInFlow"));
const EpdsFlow = lazy(() => import("../components/afterbloom/EpdsFlow"));
const SafetySection = lazy(() => import("../components/afterbloom/SafetySection"));
const LegacyTab = lazy(() => import("./tabs/LegacyTab"));
const TherapyTab = lazy(() => import("./tabs/TherapyTab"));
const CircleTab = lazy(() => import("./tabs/CircleTab"));
const CarePlansTab = lazy(() => import("./tabs/CarePlansTab"));

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
  const [epdsOpen, setEpdsOpen] = useState(false);
  const [epdsTrigger, setEpdsTrigger] = useState("manual");
  const [helpOpen, setHelpOpen] = useState(false);
  const [legacyUnlocked, setLegacyUnlocked] = useState(false);
  const [toast, setToast] = useState(null);
  const bufferRef = useRef("");
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef(null);
  const TabContent = tabComponents[activeTab];

  // Spec: I Need Help is reachable from every state and each access is logged.
  const openHelp = (source) => {
    logSafetyAccess({ source: source || activeTab });
    setHelpOpen(true);
  };

  const openEpds = (source) => {
    setEpdsTrigger(source || activeTab);
    setEpdsOpen(true);
  };

  const triggerUnlock = () => {
    setLegacyUnlocked((prev) => {
      const next = !prev;
      setToast(next ? "Legacy unlocked" : "Legacy hidden");
      setTimeout(() => setToast(null), 2000);
      if (!next && activeTab === "legacy") setActiveTab("home");
      return next;
    });
  };

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
            <Suspense fallback={null}>
              {activeTab === "home"
                ? <HomeTab onNavigate={setActiveTab} onCheckIn={() => setCheckInOpen(true)} onEpds={() => openEpds("home")} onSecretTap={handleSecretTap} />
                : activeTab === "mood"
                  ? <MoodTab onNavigate={setActiveTab} onCheckIn={() => setCheckInOpen(true)} onEpds={() => openEpds("mood")} />
                  : activeTab === "legacy"
                    ? <LegacyTab onNavigate={setActiveTab} />
                    : <TabContent />}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </div>

      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        legacyUnlocked={legacyUnlocked}
        onHelp={() => openHelp("global")}
        showHelp={!checkInOpen && !epdsOpen && !helpOpen}
      />

      <Suspense fallback={null}>
        {checkInOpen && <CheckInFlow onClose={() => setCheckInOpen(false)} onNeedHelp={() => openHelp("checkin")} />}
        {epdsOpen && <EpdsFlow onClose={() => setEpdsOpen(false)} onNeedHelp={() => openHelp("epds")} trigger={epdsTrigger} />}
      </Suspense>

      <AnimatePresence>
        {helpOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-black/35 px-4 pt-16"
            onClick={() => setHelpOpen(false)}
          >
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="mx-auto max-w-md rounded-[28px] bg-background p-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <div className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
                  I Need Help
                </div>
                <button
                  onClick={() => setHelpOpen(false)}
                  className="rounded-full border border-border/60 bg-white px-3 py-1 text-xs font-bold text-foreground"
                >
                  Close
                </button>
              </div>
              <Suspense fallback={null}>
                <SafetySection onLog={(action) => logSafetyAccess({ action })} />
              </Suspense>
            </motion.div>
          </motion.div>
        )}

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






