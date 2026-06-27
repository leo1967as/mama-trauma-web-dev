import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ShieldAlert, Phone, Wind, Eye, Hand, Ear, Heart, X, ChevronRight, HeartHandshake, Building2, Leaf } from "lucide-react";
import { EASE_OUT_QUINT } from "../../lib/theme.jsx";
import { useBodyScrollLock } from "../../hooks/use-body-scroll-lock";
import { useLang } from "../../lib/i18n";

const groundingStepsBase = [
  { count: 5, icon: Eye, color: "text-amber-500", bg: "bg-amber-50" },
  { count: 4, icon: Hand, color: "text-rose-500", bg: "bg-rose-50" },
  { count: 3, icon: Ear, color: "text-blue-500", bg: "bg-blue-50" },
  { count: 2, icon: Heart, color: "text-violet-500", bg: "bg-violet-50" },
  { count: 1, icon: Heart, color: "text-emerald-500", bg: "bg-emerald-50" },
];

function BreathingExercise({ onClose }) {
  const { t } = useLang();
  const breathingSteps = [
    { label: t.safety.breathing.steps.in, duration: 4, color: "text-blue-500", bg: "bg-blue-50", scale: 1.3 },
    { label: t.safety.breathing.steps.hold, duration: 7, color: "text-violet-500", bg: "bg-violet-50", scale: 1.3 },
    { label: t.safety.breathing.steps.out, duration: 8, color: "text-emerald-500", bg: "bg-emerald-50", scale: 1.0 },
  ];

  const [phase, setPhase] = useState(0);
  const [seconds, setSeconds] = useState(breathingSteps[0].duration);
  const [running, setRunning] = useState(false);
  const [timerId, setTimerId] = useState(null);
  const reduceMotion = useReducedMotion();

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

  useEffect(() => () => clearInterval(timerId), [timerId]);

  const current = breathingSteps[phase];

  return (
    <motion.div initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex flex-col items-center py-6">
        <motion.div
          animate={running && !reduceMotion ? { scale: current.scale } : { scale: 1 }}
          transition={{ duration: current.duration, ease: "easeInOut" }}
          className="w-32 h-32 rounded-full bg-primary/15 flex items-center justify-center mb-4 relative"
        >
          <motion.div
            animate={running && !reduceMotion ? { scale: current.scale * 0.85 } : { scale: 1 }}
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
          {running ? current.label : t.safety.breathing.title}
        </p>
        <p className="text-xs text-muted-foreground text-center px-4">
          {running ? `${current.duration} seconds` : t.safety.breathing.desc}
        </p>
      </div>

      <div className="flex gap-2">
        {!running ? (
          <button type="button" onClick={start} className="afterbloom-focus flex-1 py-3.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold">
            {t.safety.breathing.start}
          </button>
        ) : (
          <button type="button" onClick={stop} className="afterbloom-focus flex-1 py-3.5 bg-muted text-foreground rounded-xl text-sm font-bold">
            {t.safety.breathing.stop}
          </button>
        )}
      </div>

      {/* Step guide */}
      <div className="flex gap-2">
        {breathingSteps.map((s, i) => (
          <div key={i} className={`flex-1 rounded-lg p-2.5 text-center ${running && phase === i ? s.bg : "bg-muted/30"}`}>
            <p className={`text-xs font-bold ${running && phase === i ? s.color : "text-muted-foreground"}`}>{s.label}</p>
            <p className="text-[10px] text-muted-foreground">{s.duration}s</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function GroundingExercise() {
  const { t } = useLang();
  const groundingSteps = groundingStepsBase.map((base, i) => ({
    ...base,
    ...t.safety.grounding.steps[i]
  }));

  const [activeStep, setActiveStep] = useState(0);
  const [checked, setChecked] = useState([]);
  const reduceMotion = useReducedMotion();

  const toggle = (i) =>
    setChecked((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);

  const step = groundingSteps[activeStep];
  const Icon = step.icon;

  return (
    <motion.div initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
      <p className="text-xs text-muted-foreground text-center">{t.safety.grounding.desc}</p>

      {/* Step selector */}
      <div className="flex gap-1.5">
        {groundingSteps.map((s, i) => (
          <button
            type="button"
            key={i}
            onClick={() => setActiveStep(i)}
            aria-pressed={activeStep === i}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              activeStep === i ? `${s.bg} ${s.color}` : "bg-muted/40 text-muted-foreground"
            }`}
          >
            {s.count}
          </button>
        ))}
      </div>

      <div className={`${step.bg} rounded-xl p-4 text-center`}>
        <Icon className={`w-7 h-7 mx-auto mb-2 ${step.color}`} />
        <p className={`text-base font-bold ${step.color} mb-1`}>{t.safety.grounding.thingsTo.replace('{{n}}', step.count).replace('{{sense}}', step.sense)}</p>
        <p className="text-xs text-foreground/70 leading-relaxed">{step.prompt}</p>
      </div>

      <div className="space-y-2">
        {Array.from({ length: step.count }).map((_, i) => (
          <button
            type="button"
            key={i}
            onClick={() => toggle(`${activeStep}-${i}`)}
            aria-pressed={checked.includes(`${activeStep}-${i}`)}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg border-2 transition-all text-left ${
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
            <span className="text-xs text-muted-foreground">{t.safety.grounding.senseLabel.replace('{{sense}}', step.sense).replace('{{n}}', i + 1)}</span>
          </button>
        ))}
      </div>

      {activeStep < groundingSteps.length - 1 && (
        <button
          type="button"
          onClick={() => setActiveStep((s) => s + 1)}
          className="afterbloom-focus w-full py-3 bg-primary/10 text-primary rounded-xl text-sm font-bold"
        >
          {t.safety.grounding.nextSense}
        </button>
      )}
    </motion.div>
  );
}

function PanicModal({ onClose }) {
  const { t } = useLang();
  const [tool, setTool] = useState("breathing"); // "breathing" | "grounding"
  const reduceMotion = useReducedMotion();
  useBodyScrollLock();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2, ease: EASE_OUT_QUINT } }}
      exit={{ opacity: 0, transition: { duration: 0.15, ease: EASE_OUT_QUINT } }}
      className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-sm flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-labelledby="panic-modal-title"
    >
      {/* Header */}
      <div className="max-w-md mx-auto w-full px-4 pt-5 pb-3 flex items-center justify-between">
        <div>
          <p id="panic-modal-title" className="text-base font-bold text-foreground">{t.safety.panicModal.title}</p>
          <p className="text-xs text-muted-foreground">{t.safety.panicModal.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t.safety.panicModal.close}
          className="afterbloom-focus w-11 h-11 rounded-xl bg-muted/60 flex items-center justify-center"
        >
          <X className="w-4 h-4 text-foreground" />
        </button>
      </div>

      {/* Tool tabs */}
      <div className="max-w-md mx-auto w-full px-4 pb-3">
        <div className="flex bg-muted/60 rounded-xl p-1">
          <button
            type="button"
            onClick={() => setTool("breathing")}
            aria-pressed={tool === "breathing"}
            className={`afterbloom-focus flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
              tool === "breathing" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            <Wind className="w-3.5 h-3.5" /> {t.safety.panicModal.breathing}
          </button>
          <button
            type="button"
            onClick={() => setTool("grounding")}
            aria-pressed={tool === "grounding"}
            className={`afterbloom-focus flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
              tool === "grounding" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> {t.safety.panicModal.grounding}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto max-w-md mx-auto w-full px-4 pb-8" style={{ overscrollBehavior: "contain" }}>
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

function HelplineList({ lines }) {
  return (
    <div className="space-y-2">
      {lines.map((line) => {
        const content = (
          <>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-bold ${line.textColor}`}>{line.name}</p>
              <p className={`text-xs ${line.textColor} opacity-70`}>{line.desc}</p>
            </div>
            <div className={`flex items-center gap-1.5 ${line.color} rounded-lg px-3 py-1.5 border border-black/5`}>
              {line.href && <Phone className={`w-3 h-3 ${line.textColor}`} />}
              <span className={`text-xs font-bold ${line.textColor}`}>{line.number}</span>
            </div>
          </>
        );

        if (!line.href) {
          return (
            <div
              key={line.name}
              className={`w-full flex items-center gap-3 ${line.color} rounded-xl p-3.5 text-left`}
            >
              {content}
            </div>
          );
        }

        return (
          <a
            key={line.name}
            href={line.href}
            className={`afterbloom-focus w-full flex items-center gap-3 ${line.color} rounded-xl p-3.5 active:opacity-80 transition-opacity text-left`}
            aria-label={`Call ${line.name} at ${line.number}`}
          >
            {content}
          </a>
        );
      })}
    </div>
  );
}

export default function SafetySection({ onLog }) {
  const { t } = useLang();
  const [panicOpen, setPanicOpen] = useState(false);
  const [path, setPath] = useState(null); // null | trusted | hospital | safe | urgent
  const reduceMotion = useReducedMotion();

  const urgentLines = [
    {
      ...t.safety.hotlines.mentalHealth,
      number: "1323",
      href: "tel:1323",
      color: "bg-violet-100",
      textColor: "text-violet-700",
      dotColor: "bg-violet-400",
      available: true,
    },
    {
      ...t.safety.hotlines.emergency,
      number: "1669",
      href: "tel:1669",
      color: "bg-red-100",
      textColor: "text-red-700",
      dotColor: "bg-red-400",
      available: true,
    },
  ];

  const TRIAGE = [
    { key: "trusted", icon: HeartHandshake },
    { key: "hospital", icon: Building2 },
    { key: "safe", icon: Leaf },
  ].map((item) => ({
    ...item,
    ...t.safety.triage[item.key]
  }));

  const choose = (p) => { setPath(p); onLog?.(p); };

  return (
    <>
      <div className="space-y-3">
        <div className="px-1">
          <p className="text-sm font-bold text-foreground">{t.safety.title}</p>
          <p className="text-xs text-muted-foreground">{t.safety.subtitle}</p>
        </div>

        {/* Triage options */}
        <div className="space-y-2">
          {TRIAGE.map((opt) => {
            const on = path === opt.key;
            const Icon = opt.icon;
            return (
              <motion.button
                key={opt.key}
                type="button"
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                onClick={() => choose(opt.key)}
                aria-pressed={on}
                className={`afterbloom-focus w-full flex items-center gap-3 rounded-xl p-3.5 text-left border ${on ? "border-primary/40 bg-primary/8" : "border-border/50 bg-white"}`}
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <span className="flex-1">
                  <span className="block text-sm font-bold text-foreground">{opt.title}</span>
                  <span className="block text-xs text-muted-foreground">{opt.desc}</span>
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </motion.button>
            );
          })}
        </div>

        {/* Urgent path — always visible, one tap, separate from the rest */}
        <motion.button
          type="button"
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          onClick={() => choose("urgent")}
          aria-pressed={path === "urgent"}
          className="afterbloom-focus w-full flex items-center gap-3 rounded-xl p-3.5 bg-red-600 text-white shadow-lg shadow-red-200/70"
        >
          <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="text-left flex-1">
            <p className="text-sm font-bold">{t.safety.urgent.title}</p>
            <p className="text-xs text-white">{t.safety.urgent.desc}</p>
          </div>
        </motion.button>

        {/* Path content */}
        <AnimatePresence mode="wait">
          {path && (
            <motion.div
              key={path}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="pt-1"
            >
              {path === "trusted" && (
                <div className="rounded-xl border border-border/50 bg-white p-4 space-y-2">
                  <p className="text-sm font-bold text-foreground">{t.safety.paths.trusted.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{t.safety.paths.trusted.body}</p>
                  <a href="sms:" className="afterbloom-focus block w-full mt-1 py-3 rounded-lg bg-primary/10 text-primary text-sm font-bold text-center">{t.safety.paths.trusted.cta}</a>
                </div>
              )}
              {path === "hospital" && (
                <div className="rounded-xl border border-border/50 bg-white p-4 space-y-3">
                  <p className="text-sm font-bold text-foreground">{t.safety.paths.hospital.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{t.safety.paths.hospital.body}</p>
                  <div className="rounded-xl bg-rose-50 border border-rose-100 p-3.5 space-y-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-4 h-4 text-rose-700" />
                      </div>
                      <p className="text-xs text-rose-700/85 leading-relaxed min-w-0">
                        {t.safety.paths.hospital.note}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-white/70 border border-rose-100 px-3 py-2.5">
                      <Phone className="w-3.5 h-3.5 text-rose-700 flex-shrink-0" />
                      <span className="text-xs font-bold text-rose-700 leading-snug">
                        {t.safety.paths.hospital.callNote}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {path === "safe" && (
                <div className="rounded-xl border border-border/50 bg-white p-4 space-y-3">
                  <p className="text-sm font-bold text-foreground">{t.safety.paths.safe.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{t.safety.paths.safe.body}</p>
                  <button type="button" onClick={() => setPanicOpen(true)} className="afterbloom-focus w-full py-3 rounded-lg bg-primary text-primary-foreground text-sm font-bold">{t.safety.paths.safe.cta}</button>
                </div>
              )}
              {path === "urgent" && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-3">
                  <p className="text-sm font-bold text-red-700">{t.safety.paths.urgent.title}</p>
                  <p className="text-xs text-red-700/90 leading-relaxed">{t.safety.paths.urgent.body}</p>
                  <HelplineList lines={urgentLines} />
                  <button type="button" onClick={() => setPanicOpen(true)} className="afterbloom-focus w-full py-3 rounded-lg bg-red-600 text-white text-sm font-bold">{t.safety.paths.urgent.cta}</button>
                </div>
              )}
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
