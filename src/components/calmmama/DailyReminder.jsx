import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Smile, BookOpen, Sparkles } from "lucide-react";

const STORAGE_KEY = "calmmama_reminder";

function getStoredSettings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { enabled: false, time: "20:00" };
  } catch {
    return { enabled: false, time: "20:00" };
  }
}

function saveSettings(s) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

function getLastDismissed() {
  return localStorage.getItem("calmmama_reminder_dismissed") || "";
}

function setLastDismissed() {
  localStorage.setItem("calmmama_reminder_dismissed", new Date().toDateString());
}

function shouldShowNow(time) {
  if (!time) return false;
  const [h, m] = time.split(":").map(Number);
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const targetMins = h * 60 + m;
  // Show within a 30-minute window after the set time
  return nowMins >= targetMins && nowMins < targetMins + 30;
}

const PROMPTS = [
  "How are you feeling right now, mama? 💛",
  "What's one small win from today? ✨",
  "Take a breath — how's your heart today? 🌸",
  "A moment for you: what are you feeling? 🌿",
];

export default function DailyReminder({ onNavigate }) {
  const [settings, setSettings] = useState(getStoredSettings);
  const [showBanner, setShowBanner] = useState(false);
  const [prompt] = useState(() => PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);

  const checkAndShow = useCallback(() => {
    const s = getStoredSettings();
    if (!s.enabled) return;
    const dismissed = getLastDismissed();
    if (dismissed === new Date().toDateString()) return;
    if (shouldShowNow(s.time)) setShowBanner(true);
  }, []);

  useEffect(() => {
    checkAndShow();
    const interval = setInterval(checkAndShow, 60_000);
    return () => clearInterval(interval);
  }, [checkAndShow]);

  const handleUpdate = (patch) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    saveSettings(next);
  };

  const handleDismiss = () => {
    setLastDismissed();
    setShowBanner(false);
  };

  const handleCTA = (target) => {
    handleDismiss();
    if (onNavigate) onNavigate(target);
  };

  return (
    <>
      {/* Reminder Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.45 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm"
          >
            <div className="bg-card border border-border/50 rounded-3xl shadow-xl shadow-black/10 p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-sm font-bold text-foreground">Daily check-in ✨</p>
                </div>
                <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground transition-colors mt-0.5">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">{prompt}</p>
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleCTA("mood")}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-primary-foreground rounded-2xl py-2.5 text-xs font-bold shadow-md"
                >
                  <Smile className="w-3.5 h-3.5" /> Log mood
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleCTA("mood")}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-muted text-foreground rounded-2xl py-2.5 text-xs font-bold"
                >
                  <BookOpen className="w-3.5 h-3.5" /> Journal
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Card */}
      <div className="bg-card rounded-3xl border border-border/40 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            <p className="text-sm font-bold text-foreground">Daily reminder</p>
          </div>
          {/* Toggle */}
          <button
            onClick={() => handleUpdate({ enabled: !settings.enabled })}
            className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${settings.enabled ? "bg-primary" : "bg-muted"}`}
          >
            <motion.span
              animate={{ x: settings.enabled ? 22 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm block"
            />
          </button>
        </div>

        <AnimatePresence>
          {settings.enabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <p className="text-xs text-muted-foreground mb-2">Remind me at</p>
              <input
                type="time"
                value={settings.time}
                onChange={(e) => handleUpdate({ time: e.target.value })}
                className="w-full bg-muted/40 border border-border/40 rounded-2xl px-4 py-3 text-sm font-semibold text-foreground outline-none focus:border-primary/50 transition-colors"
              />
              <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
                A gentle nudge will appear at this time each day to check in with your mood or journal 🌸
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {!settings.enabled && (
          <p className="text-xs text-muted-foreground">Turn on to get a gentle daily check-in prompt.</p>
        )}
      </div>
    </>
  );
}