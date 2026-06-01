import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const stages = [
  { day: 1, label: "Day 1", phase: "Baby Blues Zone", emotion: "Hormones shifting — tears are normal", color: "bg-calm-lavender" },
  { day: 3, label: "Day 3", phase: "Peak Adjustment", emotion: "Milk may come in — emotions intensify", color: "bg-calm-rose" },
  { day: 7, label: "Day 7", phase: "Finding Rhythm", emotion: "Building small routines, some relief", color: "bg-calm-peach", active: true },
  { day: 14, label: "Week 2", phase: "Settling In", emotion: "Baby blues should start to ease", color: "bg-calm-cream" },
  { day: 21, label: "Week 3", phase: "Growing Confidence", emotion: "Trust your instincts, mama", color: "bg-calm-lavender" },
  { day: 30, label: "Month 1", phase: "New Normal", emotion: "If sadness persists, reach out", color: "bg-calm-rose" },
];

const tabs = ["Day", "Week", "Month"];

export default function CareTimeline() {
  const [activeTab, setActiveTab] = useState("Day");
  const tabRefs = useRef({});
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });
  const currentStage = stages.find((s) => s.active);

  useEffect(() => {
    const activeButton = tabRefs.current[activeTab];
    if (!activeButton) return;

    setPillStyle({
      left: activeButton.offsetLeft,
      width: activeButton.offsetWidth,
    });
  }, [activeTab]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-card rounded-3xl p-5 border border-border/40 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Care Journey</p>
          <p className="text-xs text-muted-foreground">Your postpartum timeline</p>
        </div>
        <div className="flex bg-muted/60 rounded-xl p-0.5 relative">
          <motion.span
            animate={pillStyle}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
            className="absolute top-0.5 bottom-0.5 z-0 rounded-lg bg-primary shadow-sm"
          />
          {tabs.map((tab) => (
            <button
              key={tab}
              ref={(node) => {
                if (node) tabRefs.current[tab] = node;
              }}
              onClick={() => setActiveTab(tab)}
              className={`relative z-10 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === tab ? "text-white" : "text-muted-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Current Stage Highlight */}
      {currentStage && (
        <div className="bg-primary/8 border border-primary/15 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
            <span className="text-xs font-bold text-primary uppercase tracking-wider">
              Now — {currentStage.label}
            </span>
          </div>
          <p className="text-sm font-semibold text-foreground mb-0.5">{currentStage.phase}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{currentStage.emotion}</p>
        </div>
      )}

      {/* Timeline */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
        {stages.map((stage, i) => (
          <motion.div
            key={stage.day}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 * i }}
            className={`flex-shrink-0 w-20 rounded-2xl p-3 text-center transition-all cursor-pointer ${
              stage.active
                ? "bg-primary/12 border-2 border-primary/30 shadow-sm"
                : "bg-muted/40 border border-transparent hover:bg-muted/60"
            }`}
          >
            <div className={`w-8 h-8 mx-auto rounded-xl ${stage.color} flex items-center justify-center mb-2`}>
              <span className="text-xs font-bold text-foreground/70">{stage.day}</span>
            </div>
            <p className="text-[10px] font-semibold text-foreground truncate">{stage.label}</p>
            <p className="text-[9px] text-muted-foreground truncate">{stage.phase}</p>
          </motion.div>
        ))}
      </div>

      <button className="flex items-center gap-1 mt-3 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
        View full journey <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}
