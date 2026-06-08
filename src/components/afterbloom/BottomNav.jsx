import { motion } from "framer-motion";
import { Archive, Home, SmilePlus, CalendarHeart, Target, Users } from "lucide-react";

const BASE_TABS = [
  { id: "home",      label: "Home",    icon: Home },
  { id: "mood",      label: "Mood",    icon: SmilePlus },
  { id: "therapy",   label: "Therapy", icon: CalendarHeart, disabled: true },
  { id: "careplans", label: "Plans",   icon: Target,        disabled: true },
  { id: "circle",    label: "Circle",  icon: Users,         disabled: true },
];

const LEGACY_TAB = { id: "legacy", label: "Legacy", icon: Archive };

export default function BottomNav({ activeTab, onTabChange, legacyUnlocked }) {
  const tabs = legacyUnlocked
    ? [BASE_TABS[0], BASE_TABS[1], LEGACY_TAB, ...BASE_TABS.slice(2)]
    : BASE_TABS;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto px-3 pb-4">
        <div className="bg-card/95 backdrop-blur-xl border border-border/50 rounded-3xl shadow-xl shadow-black/10 px-2 py-2">
          <div className="flex items-center justify-around">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const isDisabled = tab.disabled;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (!isDisabled) onTabChange(tab.id);
                  }}
                  disabled={isDisabled}
                  className={`flex flex-col items-center gap-1 px-3 py-1.5 relative transition-opacity duration-200 ${
                    isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  <div
                    className={`relative w-12 h-10 flex items-center justify-center rounded-2xl transition-all duration-300 ${
                      isActive ? "bg-primary/15" : isDisabled ? "bg-muted/30" : ""
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="navPill"
                        className="absolute inset-0 bg-primary/15 rounded-2xl"
                        transition={{ type: "spring", bounce: 0.25, duration: 0.4 }}
                      />
                    )}
                    <Icon
                      className={`w-5 h-5 relative z-10 transition-colors duration-200 ${
                        isActive ? "text-primary" : isDisabled ? "text-muted-foreground/60" : "text-muted-foreground"
                      }`}
                      strokeWidth={isActive ? 2.5 : isDisabled ? 1.6 : 1.8}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-semibold transition-colors duration-200 ${
                      isActive ? "text-primary" : isDisabled ? "text-muted-foreground/60" : "text-muted-foreground"
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

