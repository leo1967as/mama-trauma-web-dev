import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import BottomNav from "../components/afterbloom/BottomNav";
import { logSafetyAccess } from "../lib/mood-data";
import { LAYERS, LAYOUT, EASE_OUT_QUINT } from "../lib/theme.jsx";
import { useBodyScrollLock } from "../hooks/use-body-scroll-lock";
import HomeTab from "./tabs/HomeTab";

// Lazy: heavy modals + secondary tabs -> out of initial chunk.
const tabLoaders = {
  mood: () => import("./tabs/MoodTab"),
  journey: () => import("./tabs/JourneyTab"),
  legacy: () => import("./tabs/LegacyTab"),
  therapy: () => import("./tabs/TherapyTab"),
  epds: () => import("./tabs/EpdsTab"),
  profile: () => import("./tabs/ProfileTab"),
  careplans: () => import("./tabs/CarePlansTab"),
  circle: () => import("./tabs/CircleTab"),
};

const MoodTab = lazy(tabLoaders.mood);
const JourneyTab = lazy(tabLoaders.journey);
const CheckInFlow = lazy(() => import("../components/afterbloom/CheckInFlow"));
const EpdsFlow = lazy(() => import("../components/afterbloom/EpdsFlow"));
const SafetySection = lazy(() => import("../components/afterbloom/SafetySection"));
const LegacyTab = lazy(tabLoaders.legacy);
const TherapyTab = lazy(tabLoaders.therapy);
const EpdsTab = lazy(tabLoaders.epds);
const ProfileTab = lazy(tabLoaders.profile);
const CircleTab = lazy(tabLoaders.circle);
const CarePlansTab = lazy(tabLoaders.careplans);

const tabComponents = {
  home: HomeTab,
  mood: MoodTab,
  journey: JourneyTab,
  legacy: LegacyTab,
  therapy: TherapyTab,
  epds: EpdsTab,
  profile: ProfileTab,
  careplans: CarePlansTab,
  circle: CircleTab,
};

const SECRET = "ADMIN";
const TAP_TARGET = 5;
const TAP_WINDOW_MS = 2000;

export default function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("home");
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [epdsOpen, setEpdsOpen] = useState(false);
  const [epdsTrigger, setEpdsTrigger] = useState("manual");
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpPath, setHelpPath] = useState(null);
  const [therapyCategory, setTherapyCategory] = useState("caregiver");
  const [legacyUnlocked, setLegacyUnlocked] = useState(false);
  const [toast, setToast] = useState(null);
  const bufferRef = useRef("");

  useBodyScrollLock(helpOpen);
  const reduceMotion = useReducedMotion();
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef(null);
  const helpDialogRef = useRef(null);
  const helpCloseRef = useRef(null);
  const helpReturnFocusRef = useRef(null);
  const TabContent = tabComponents[activeTab];
  const navVisible = !checkInOpen && !epdsOpen && !helpOpen;

  // Spec: I Need Help is reachable from every state and each access is logged.
  const openHelp = (source, path = null) => {
    helpReturnFocusRef.current = typeof document !== "undefined" ? document.activeElement : null;
    logSafetyAccess({ source: source || activeTab });
    setHelpPath(path);
    setHelpOpen(true);
  };

  const closeHelp = () => {
    setHelpOpen(false);
    setHelpPath(null);
    window.requestAnimationFrame(() => {
      helpReturnFocusRef.current?.focus?.();
      helpReturnFocusRef.current = null;
    });
  };

  const openEpds = (source) => {
    setEpdsTrigger(source || activeTab);
    setEpdsOpen(true);
  };

  const changeTab = (nextTab) => {
    if (nextTab === activeTab) return;
    const loadTab = tabLoaders[nextTab];
    if (!loadTab) {
      setActiveTab(nextTab);
      return;
    }
    loadTab().finally(() => setActiveTab(nextTab));
  };

  const openCareCircle = (category = "caregiver") => {
    setTherapyCategory(category);
    closeHelp();
    changeTab("therapy");
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

  useEffect(() => {
    if (!helpOpen) return;
    helpCloseRef.current?.focus();
  }, [helpOpen]);

  useEffect(() => {
    if (!helpOpen) return;
    const handleGlobalHelpKey = (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      closeHelp();
    };

    window.addEventListener("keydown", handleGlobalHelpKey, true);
    return () => window.removeEventListener("keydown", handleGlobalHelpKey, true);
  }, [helpOpen]);

  useEffect(() => {
    const preloadTabs = () => Object.values(tabLoaders).forEach((load) => load());
    let idleId = null;
    const timer = window.setTimeout(() => {
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(preloadTabs, { timeout: 2500 });
        return;
      }
      preloadTabs();
    }, 3500);

    return () => {
      window.clearTimeout(timer);
      if (idleId !== null) window.cancelIdleCallback?.(idleId);
    };
  }, []);

  const handleHelpKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closeHelp();
      return;
    }

    if (e.key !== "Tab") return;
    const focusable = helpDialogRef.current?.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

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

  const canUseDOM = typeof document !== "undefined";
  const helpLayer = helpOpen ? (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2, ease: EASE_OUT_QUINT } }}
      exit={{ opacity: 0, transition: { duration: 0.15, ease: EASE_OUT_QUINT } }}
      className="fixed inset-0 bg-black/35 overflow-y-auto px-4 pt-16"
      style={{ zIndex: LAYERS.urgentOverlay, paddingBottom: LAYOUT.flowScrollPadding, WebkitOverflowScrolling: "touch", overscrollBehavior: "contain" }}
      onClick={closeHelp}
    >
      <motion.div
        ref={helpDialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="global-help-title"
        initial={reduceMotion ? { opacity: 0 } : { y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.24, ease: EASE_OUT_QUINT } }}
        exit={reduceMotion ? { opacity: 0, transition: { duration: 0.15 } } : { y: 24, opacity: 0, transition: { duration: 0.18, ease: EASE_OUT_QUINT } }}
        className="mx-auto max-w-md rounded-2xl bg-background p-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleHelpKeyDown}
      >
        <div className="mb-3 flex items-center justify-between px-1">
          <div id="global-help-title" className="text-sm font-bold text-foreground">
            I Need Help
          </div>
          <button
            ref={helpCloseRef}
            onClick={closeHelp}
            className="afterbloom-focus min-h-11 rounded-full border border-border/60 bg-white px-4 text-xs font-bold text-foreground"
          >
            Close
          </button>
        </div>
        <Suspense fallback={null}>
          <SafetySection initialPath={helpPath} onLog={(action) => logSafetyAccess({ action })} onNavigate={openCareCircle} />
        </Suspense>
      </motion.div>
    </motion.div>
  ) : null;

  return (
    <div className="min-h-screen bg-background">
      <div
        className="max-w-md mx-auto overflow-y-auto overflow-x-hidden"
        style={{ paddingBottom: LAYOUT.bottomNavSpace }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: reduceMotion ? 0.08 : 0.16, ease: EASE_OUT_QUINT } }}
            exit={{ opacity: 0, transition: { duration: reduceMotion ? 0.06 : 0.1, ease: EASE_OUT_QUINT } }}
          >
            <Suspense fallback={null}>
              {activeTab === "home"
                ? <HomeTab onNavigate={(tab) => { if (tab === "therapy") setTherapyCategory("caregiver"); changeTab(tab); }} onCheckIn={() => setCheckInOpen(true)} onEpds={() => openEpds("home")} onNeedHelp={() => openHelp("care_journey")} onSecretTap={handleSecretTap} />
                : activeTab === "mood"
                  ? <MoodTab onNavigate={changeTab} onCheckIn={() => setCheckInOpen(true)} onEpds={() => openEpds("mood")} onNeedHelp={() => openHelp("mood")} />
                  : activeTab === "journey"
                    ? <JourneyTab onEpds={() => openEpds("journey")} onNeedHelp={() => openHelp("care_journey")} onNavigate={changeTab} />
                  : activeTab === "legacy"
                    ? <LegacyTab onNavigate={changeTab} />
                  : activeTab === "therapy"
                      ? <TherapyTab initialCategory={therapyCategory} />
                    : activeTab === "epds"
                      ? <EpdsTab onStart={() => openEpds("epds_tab")} onNeedHelp={() => openHelp("epds_tab")} />
                    : activeTab === "profile"
                      ? <ProfileTab onLogout={onLogout} />
                    : <TabContent />}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </div>

      {navVisible && (
        <BottomNav
          activeTab={activeTab}
          onTabChange={changeTab}
          onHelp={() => openHelp("global")}
          showHelp
        />
      )}

      <AnimatePresence>
        {checkInOpen && (
          <Suspense fallback={null} key="checkin">
            <CheckInFlow
              onClose={() => setCheckInOpen(false)}
              onNeedHelp={(path) => openHelp("checkin", path)}
              onNavigate={(tab = "home") => { setCheckInOpen(false); if (tab === "therapy") setTherapyCategory("caregiver"); changeTab(tab); }}
              onEpds={() => { setCheckInOpen(false); openEpds("support_level_extra"); }}
              onAcknowledgeSafe={() => { logSafetyAccess({ source: "checkin_result", action: "with_safe_person" }); setCheckInOpen(false); }}
            />
          </Suspense>
        )}
        {epdsOpen && (
          <Suspense fallback={null} key="epds">
            <EpdsFlow onClose={() => setEpdsOpen(false)} onNeedHelp={() => openHelp("epds")} trigger={epdsTrigger} />
          </Suspense>
        )}
      </AnimatePresence>

      {canUseDOM
        ? createPortal(<AnimatePresence>{helpLayer}</AnimatePresence>, document.body)
        : <AnimatePresence>{helpLayer}</AnimatePresence>}

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed left-1/2 -translate-x-1/2 pointer-events-none"
            style={{ bottom: LAYOUT.toastBottom, zIndex: LAYERS.toast }}
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
