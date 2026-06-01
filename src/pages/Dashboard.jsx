import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "../components/calmmama/BottomNav";
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

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("home");
  const TabContent = tabComponents[activeTab];

  return (
    <div className="min-h-screen bg-background">
      {/* Scrollable content area with bottom padding for nav */}
      <div className="max-w-md mx-auto px-4 pt-2 pb-32 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "home"
              ? <HomeTab onNavigate={setActiveTab} />
              : activeTab === "mood"
                ? <MoodTab onNavigate={setActiveTab} />
                : activeTab === "legacy"
                  ? <LegacyTab onNavigate={setActiveTab} />
                  : <TabContent />
            }
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Fixed Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
