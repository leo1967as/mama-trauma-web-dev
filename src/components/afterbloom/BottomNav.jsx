import { motion } from "framer-motion";
import { Archive, Home, SmilePlus, CalendarHeart, Target, Users } from "lucide-react";
import { LAYERS, LAYOUT } from "../../lib/theme.jsx";
import { useLang } from "../../lib/i18n";

export default function BottomNav({ activeTab, onTabChange, legacyUnlocked, onHelp, showHelp }) {
  const { t } = useLang();

  const BASE_TABS = [
    { id: "home",      label: t.nav.home,      icon: Home },
    { id: "mood",      label: t.nav.mood,      icon: SmilePlus },
    { id: "therapy",   label: t.nav.therapy,   icon: CalendarHeart },
    { id: "careplans", label: t.nav.plans,     icon: Target },
    { id: "circle",    label: t.nav.circle,    icon: Users },
  ];

  const LEGACY_TAB = { id: "legacy", label: t.nav.legacy, icon: Archive };

  const tabs = legacyUnlocked
    ? [BASE_TABS[0], BASE_TABS[1], LEGACY_TAB, ...BASE_TABS.slice(2)]
    : BASE_TABS;
  return (
    <div className="fixed bottom-0 left-0 right-0" style={{ zIndex: LAYERS.bottomNav }}>
      <div className="max-w-md mx-auto px-3 relative" style={{ paddingBottom: LAYOUT.bottomNavPadding }}>
        {showHelp && (
          <motion.button
            onClick={onHelp}
            whileTap={{ scale: 0.94 }}
            className="absolute right-3 bottom-full mb-3 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/40"
            style={{ zIndex: LAYERS.floatingHelp }}
            aria-label={t.nav.needHelp}
          >
            <svg className="mb-1" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 21s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 11c0 5.5-7 10-7 10z"/></svg>
          </motion.button>
        )}
        <div className="bg-card border border-border/50 rounded-2xl shadow-xl shadow-black/10 px-2 py-2">
          <div className="flex items-center justify-around">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className="flex flex-col items-center gap-1 px-1 sm:px-3 py-1.5 relative cursor-pointer afterbloom-focus"
                >
                  <div
                    className={`relative w-10 sm:w-12 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${
                      isActive ? "bg-primary/15" : ""
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="navPill"
                        className="absolute inset-0 bg-primary/15 rounded-xl"
                        transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
                      />
                    )}
                    <Icon
                      className={`w-5 h-5 relative z-10 transition-colors duration-200 ${
                        isActive ? "text-primary" : "text-muted-foreground"
                      }`}
                      strokeWidth={isActive ? 2.5 : 1.8}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-semibold transition-colors duration-200 ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
