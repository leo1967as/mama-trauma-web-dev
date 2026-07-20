import { motion } from "framer-motion";
import { LAYERS, LAYOUT } from "../../lib/theme.jsx";
import { useLang } from "../../lib/i18n";

const SvgHome = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
const SvgHeartPulse = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" /></svg>;
const SvgMapPin = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>;
const SvgUsers = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const SvgClipboardCheck = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M9 14l2 2 4-4" /></svg>;
const SvgUser = (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;

export default function BottomNav({ activeTab, onTabChange, onHelp, showHelp }) {
  const { t } = useLang();

  const tabs = [
    { id: "home",    label: t.nav.home,      icon: SvgHome },
    { id: "mood",    label: t.nav.checkin,   icon: SvgHeartPulse },
    { id: "journey", label: t.nav.journey,   icon: SvgMapPin },
    { id: "therapy", label: t.nav.careCircle, icon: SvgUsers },
    { id: "epds",    label: t.nav.epds,      icon: SvgClipboardCheck },
    { id: "profile", label: t.nav.profile,   icon: SvgUser },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0" style={{ zIndex: LAYERS.bottomNav }}>
      <div className="max-w-md mx-auto px-3 relative" style={{ paddingBottom: LAYOUT.bottomNavPadding }}>
        {showHelp && (
          <motion.button
            type="button"
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
          <div className="grid grid-cols-6 items-center">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  aria-current={isActive ? "page" : undefined}
                  className="flex w-full min-w-0 flex-col items-center gap-1 px-0.5 py-1.5 relative cursor-pointer afterbloom-focus"
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
