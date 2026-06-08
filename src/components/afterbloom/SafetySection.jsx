import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Phone, Wind, Eye, Hand, Ear, Heart, X, ChevronRight } from "lucide-react";

const helplines = [
  {
    name: "Postpartum Support International",
    number: "1-800-944-4773",
    desc: "24/7 PPD & anxiety support",
    color: "bg-rose-100",
    textColor: "text-rose-700",
    dotColor: "bg-rose-400",
  },
  {
    name: "National Crisis Lifeline",
    number: "988",
    desc: "Call or text anytime",
    color: "bg-violet-100",
    textColor: "text-violet-700",
    dotColor: "bg-violet-400",
  },
  {
    name: "Crisis Text Line",
    number: "Text HOME to 741741",
    desc: "Free, confidential text support",
    color: "bg-blue-100",
    textColor: "text-blue-700",
    dotColor: "bg-blue-400",
    isText: true,
  },
  {
    name: "Local Emergency Services",
    number: "911",
    desc: "Immediate emergency help",
    color: "bg-red-100",
    textColor: "text-red-700",
    dotColor: "bg-red-400",
  },
];

// 4-7-8 breathing steps
const breathingSteps = [
  { label: "Breathe in", duration: 4, color: "text-blue-500", bg: "bg-blue-50", scale: 1.3 },
  { label: "Hold", duration: 7, color: "text-violet-500", bg: "bg-violet-50", scale: 1.3 },
  { label: "Breathe out", duration: 8, color: "text-emerald-500", bg: "bg-emerald-50", scale: 1.0 },
];

// 5-4-3-2-1 grounding
const groundingSteps = [
  { count: 5, sense: "See", icon: Eye, prompt: "Name 5 things you can see around you right now", color: "text-amber-500", bg: "bg-amber-50" },
  { count: 4, sense: "Touch", icon: Hand, prompt: "Notice 4 things you can physically touch", color: "text-rose-500", bg: "bg-rose-50" },
  { count: 3, sense: "Hear", icon: Ear, prompt: "Listen for 3 sounds in your environment", color: "text-blue-500", bg: "bg-blue-50" },
  { count: 2, sense: "Smell", icon: Heart, prompt: "Find 2 things you can smell nearby", color: "text-violet-500", bg: "bg-violet-50" },
  { count: 1, sense: "Taste", icon: Heart, prompt: "Notice 1 thing you can taste", color: "text-emerald-500", bg: "bg-emerald-50" },
];

function BreathingExercise({ onClose }) {
  const [phase, setPhase] = useState(0);
  const [seconds, setSeconds] = useState(breathingSteps[0].duration);
  const [running, setRunning] = useState(false);
  const [timerId, setTimerId] = useState(null);

  const start = () => {
    setRunning(true);
    setPhase(0);
    setSeconds(breathingSteps[0].duration);
    let currentPhase = 0;
    let currentSeconds = breathingSteps[0].duration;

    const tick = () => {
      currentSeconds -= 1;
      if (currentSeconds <= 0) {
        currentPhase = (currentPhase + 1) % breathingSteps.length;
        currentSeconds = breathingSteps[currentPhase].duration;
        setPhase(currentPhase);
      }
      setSeconds(currentSeconds);
    };

    const id = setInterval(tick, 1000);
    setTimerId(id);
  };

  const stop = () => {
    clearInterval(timerId);
    setRunning(false);
    setPhase(0);
    setSeconds(breathingSteps[0].duration);
  };

  const current = breathingSteps[phase];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex flex-col items-center py-6">
        <motion.div
          animate={running ? { scale: current.scale } : { scale: 1 }}
          transition={{ duration: current.duration, ease: "easeInOut" }}
          className="w-32 h-32 rounded-full bg-primary/15 flex items-center justify-center mb-4 relative"
        >
          <motion.div
            animate={running ? { scale: current.scale * 0.85 } : { scale: 1 }}
            transition={{ duration: current.duration, ease: "easeInOut" }}
            className="w-24 h-24 rounded-full bg-primary/25 flex items-center justify-center"
          >
            <div className="text-center">
              <Wind className="w-7 h-7 text-primary mx-auto mb-1" />
              {running && <span className="text-xl font-bold text-primary">{seconds}</span>}
            </div>
          </motion.div>
        </motion.div>

        <p className={`text-lg font-bold mb-1 ${running ? current.color : "text-foreground"}`}>
          {running ? current.label : "4-7-8 Breathing"}
        </p>
        <p className="text-xs text-muted-foreground text-center px-4">
          {running ? `${current.duration} seconds` : "A calming breath technique that activates your nervous system's rest response"}
        </p>
      </div>

      <div className="flex gap-2">
        {!running ? (
          <button onClick={start} className="flex-1 py-3.5 bg-primary text-primary-foreground rounded-2xl text-sm font-bold">
            Start breathing exercise
          </button>
        ) : (
          <button onClick={stop} className="flex-1 py-3.5 bg-muted text-foreground rounded-2xl text-sm font-bold">
            Stop
          </button>
        )}
      </div>

      {/* Step guide */}
      <div className="flex gap-2">
        {breathingSteps.map((s, i) => (
          <div key={i} className={`flex-1 rounded-xl p-2.5 text-center ${running && phase === i ? s.bg : "bg-muted/30"}`}>
            <p className={`text-xs font-bold ${running && phase === i ? s.color : "text-muted-foreground"}`}>{s.label}</p>
            <p className="text-[10px] text-muted-foreground">{s.duration}s</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function GroundingExercise() {
  const [activeStep, setActiveStep] = useState(0);
  const [checked, setChecked] = useState([]);

  const toggle = (i) =>
    setChecked((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);

  const step = groundingSteps[activeStep];
  const Icon = step.icon;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
      <p className="text-xs text-muted-foreground text-center">This 5-4-3-2-1 technique anchors you to the present moment</p>

      {/* Step selector */}
      <div className="flex gap-1.5">
        {groundingSteps.map((s, i) => (
          <button
            key={i}
            onClick={() => setActiveStep(i)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeStep === i ? `${s.bg} ${s.color}` : "bg-muted/40 text-muted-foreground"
            }`}
          >
            {s.count}
          </button>
        ))}
      </div>

      <div className={`${step.bg} rounded-2xl p-4 text-center`}>
        <Icon className={`w-7 h-7 mx-auto mb-2 ${step.color}`} />
        <p className={`text-base font-bold ${step.color} mb-1`}>{step.count} things to {step.sense}</p>
        <p className="text-xs text-foreground/70 leading-relaxed">{step.prompt}</p>
      </div>

      <div className="space-y-2">
        {Array.from({ length: step.count }).map((_, i) => (
          <button
            key={i}
            onClick={() => toggle(`${activeStep}-${i}`)}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border-2 transition-all text-left ${
              checked.includes(`${activeStep}-${i}`)
                ? "border-primary/30 bg-primary/8"
                : "border-border/40 bg-muted/20"
            }`}
          >
            <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all ${
              checked.includes(`${activeStep}-${i}`) ? "bg-primary" : "border-2 border-border/60"
            }`}>
              {checked.includes(`${activeStep}-${i}`) && <span className="text-white text-[10px] font-bold">✓</span>}
            </div>
            <span className="text-xs text-muted-foreground">{step.sense} #{i + 1}</span>
          </button>
        ))}
      </div>

      {activeStep < groundingSteps.length - 1 && (
        <button
          onClick={() => setActiveStep((s) => s + 1)}
          className="w-full py-3 bg-primary/10 text-primary rounded-2xl text-sm font-bold"
        >
          Next sense →
        </button>
      )}
    </motion.div>
  );
}

function PanicModal({ onClose }) {
  const [tool, setTool] = useState("breathing"); // "breathing" | "grounding"

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-sm flex flex-col"
    >
      {/* Header */}
      <div className="max-w-md mx-auto w-full px-4 pt-5 pb-3 flex items-center justify-between">
        <div>
          <p className="text-base font-bold text-foreground">You're safe. I'm here 💛</p>
          <p className="text-xs text-muted-foreground">Let's slow things down together</p>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-xl bg-muted/60 flex items-center justify-center"
        >
          <X className="w-4 h-4 text-foreground" />
        </button>
      </div>

      {/* Tool tabs */}
      <div className="max-w-md mx-auto w-full px-4 pb-3">
        <div className="flex bg-muted/60 rounded-2xl p-1">
          <button
            onClick={() => setTool("breathing")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
              tool === "breathing" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            <Wind className="w-3.5 h-3.5" /> Breathing
          </button>
          <button
            onClick={() => setTool("grounding")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
              tool === "grounding" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Grounding
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto max-w-md mx-auto w-full px-4 pb-8">
        <AnimatePresence mode="wait">
          {tool === "breathing" ? (
            <BreathingExercise key="breathing" onClose={onClose} />
          ) : (
            <GroundingExercise key="grounding" />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function SafetySection() {
  const [panicOpen, setPanicOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div className="bg-red-50 border border-red-200/60 rounded-3xl overflow-hidden">
        {/* Header — always visible */}
        <button
          onClick={() => setExpanded((e) => !e)}
          className="w-full flex items-center gap-3 p-4 text-left"
        >
          <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-red-700">Safety First</p>
            <p className="text-xs text-red-500/80">Crisis lines · Panic button · Grounding</p>
          </div>
          <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronRight className="w-4 h-4 text-red-400" />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-3">
                {/* Panic Button */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setPanicOpen(true)}
                  className="w-full bg-red-500 text-white rounded-2xl py-4 flex items-center justify-center gap-3 shadow-lg shadow-red-200"
                >
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold">I Need Help</p>
                    <p className="text-xs text-white/70">Breathing & grounding exercises</p>
                  </div>
                </motion.button>

                {/* Helplines */}
                <p className="text-xs font-bold text-red-700 pt-1">Emergency & Crisis Helplines</p>
                <div className="space-y-2">
                  {helplines.map((line) => (
                    <a
                      key={line.name}
                      href={line.isText ? undefined : `tel:${line.number.replace(/\D/g, "")}`}
                      className={`flex items-center gap-3 ${line.color} rounded-2xl p-3.5 active:opacity-80 transition-opacity`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold ${line.textColor}`}>{line.name}</p>
                        <p className={`text-xs ${line.textColor} opacity-70`}>{line.desc}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1.5 ${line.color} rounded-xl px-3 py-1.5 border border-black/5`}>
                          <Phone className={`w-3 h-3 ${line.textColor}`} />
                          <span className={`text-xs font-bold ${line.textColor}`}>{line.number}</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Panic Modal */}
      <AnimatePresence>
        {panicOpen && <PanicModal onClose={() => setPanicOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
