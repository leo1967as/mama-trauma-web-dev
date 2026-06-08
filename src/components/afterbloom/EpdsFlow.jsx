import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { saveEpdsEntry, computeEpdsScore, getEpdsSupportLevel, toDateKey } from "../../lib/epds-data";

const F = "'Plus Jakarta Sans', system-ui, sans-serif";
const S = "'Newsreader', serif";

const QUESTIONS = [
  { prompt: "Have you been able to find moments of joy or something to smile about?", options: ["Yes, often", "Not quite as often as usual", "Rarely lately", "Hardly at all"] },
  { prompt: "Have you been able to look forward to things you usually enjoy?", options: ["As much as ever", "A little less than usual", "Quite a bit less", "Hardly at all"] },
  { prompt: "Have you been blaming yourself for things that weren't really your fault?", options: ["No, not at all", "Not very often", "Yes, sometimes", "Yes, quite a lot"] },
  { prompt: "Have you felt anxious or worried without a clear reason?", options: ["No, not at all", "Hardly ever", "Yes, sometimes", "Yes, a lot"] },
  { prompt: "Have you felt scared or panicky for no clear reason?", options: ["No, not at all", "Not very often", "Yes, sometimes", "Yes, quite a bit"] },
  { prompt: "Has everything felt too much and hard to cope with?", options: ["No, I've been coping well", "Mostly okay, just a little effort", "Sometimes not coping as well", "No - I haven't been coping at all"] },
  { prompt: "Have you felt so unhappy that it's made sleeping harder?", options: ["No, not at all", "Not very often", "Yes, sometimes", "Yes, quite a lot"] },
  { prompt: "Have you felt sad or teary?", options: ["No, not at all", "Not very often", "Yes, quite a lot", "Yes, most of the time"] },
  { prompt: "Have you been crying more than usual?", options: ["No, never", "Only occasionally", "Yes, quite often", "Yes, almost all the time"] },
  { prompt: "Have thoughts of hurting yourself crossed your mind?", options: ["Never", "Hardly ever", "Sometimes", "Yes, quite often"], isSensitive: true },
];

function Top({ step, onBack, onClose, onHelp }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px 8px" }}>
      <motion.button
        onClick={step === 1 ? onClose : onBack}
        whileTap={{ scale: 0.9 }}
        style={{ width: 38, height: 38, borderRadius: "50%", background: "#fff", border: "1px solid #EFE6DC", display: "flex", alignItems: "center", justifyContent: "center", color: "#6C5F56", cursor: "pointer", fontSize: 16, fontWeight: 700, fontFamily: F }}
      >
        {step === 1 ? "✕" : "←"}
      </motion.button>
      <div style={{ flex: 1, padding: "0 12px", textAlign: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9C8E83", marginBottom: 6 }}>Emotional Check</div>
        <div style={{ height: 5, background: "#EFE6DC", borderRadius: 30, overflow: "hidden" }}>
          <motion.div animate={{ width: `${(step / 10) * 100}%` }} transition={{ duration: 0.35 }} style={{ height: "100%", background: "linear-gradient(90deg,#C77E83,#DBA0A2)", borderRadius: 30 }} />
        </div>
      </div>
      <button onClick={onHelp} style={{ width: 38, height: 38, borderRadius: "50%", background: "#F6E2E1", border: 0, color: "#AF636A", fontSize: 11, fontWeight: 800, cursor: "pointer", lineHeight: 1, padding: 0 }}>Help</button>
    </div>
  );
}

function Question({ questionIndex, answer, onSelect, onNext, onBack, onClose, onHelp }) {
  const q = QUESTIONS[questionIndex];
  const step = questionIndex + 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#FBF6F0", fontFamily: F }}>
      <Top step={step} onBack={onBack} onClose={onClose} onHelp={onHelp} />
      <div style={{ flex: 1, padding: "22px 24px 0", overflowY: "auto" }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#B8C9B0", marginBottom: 16 }}>
          Question {step} of 10
        </div>
        <div style={{ fontFamily: S, fontWeight: 500, fontSize: 24, lineHeight: 1.3, letterSpacing: "-0.01em", color: "#3E342C", marginBottom: 24 }}>
          {q.prompt}
        </div>
        {q.isSensitive && (
          <div style={{ background: "#E7EFE8", border: "1px solid #C8DFC9", borderRadius: 16, padding: "13px 16px", marginBottom: 18, display: "flex", gap: 12, alignItems: "flex-start" }}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#577A62" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            <span style={{ fontSize: 12.5, color: "#577A62", lineHeight: 1.55 }}>If this feels urgent, use I Need Help right away. Answer honestly and keep going at your pace.</span>
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {q.options.map((opt, idx) => {
            const on = answer === idx;
            return (
              <motion.button
                key={opt}
                onClick={() => onSelect(idx)}
                whileTap={{ scale: 0.97 }}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", background: on ? "#FBEDEC" : "#fff", border: `1.5px solid ${on ? "#C77E83" : "#EFE6DC"}`, borderRadius: 18, cursor: "pointer", textAlign: "left", width: "100%", boxShadow: on ? "0 4px 14px rgba(199,126,131,.14)" : "0 2px 6px rgba(80,56,42,.04)" }}
              >
                <motion.div animate={{ width: on ? 22 : 20, height: on ? 22 : 20, background: on ? "#C77E83" : "#fff", border: on ? "none" : "1.5px solid #D6CEC8" }} transition={{ type: "spring", stiffness: 420, damping: 22 }} style={{ borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {on && <svg viewBox="0 0 24 24" width="11" fill="none" stroke="white" strokeWidth="2.8"><path d="M5 13l4 4L19 7"/></svg>}
                </motion.div>
                <span style={{ fontSize: 14, fontWeight: on ? 700 : 500, color: on ? "#AF636A" : "#3E342C" }}>{opt}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
      <div style={{ padding: "16px 24px 40px" }}>
        <motion.button
          className="ci-btn"
          onClick={answer !== null ? onNext : undefined}
          animate={{ opacity: answer !== null ? 1 : 0.4 }}
          transition={{ duration: 0.15 }}
          style={{ cursor: answer !== null ? "pointer" : "default", pointerEvents: answer !== null ? "auto" : "none" }}
        >
          {step < 10 ? "Continue" : "See results"}
        </motion.button>
      </div>
    </div>
  );
}

const RISK_META = {
  steady: { badge: "Steady", badgeBg: "#E7EFE8", badgeColor: "#577A62", body: "Your answers suggest you are steady right now. Keep the daily rhythm going so changes stay easier to spot.", quote: "Small, steady steps can carry a lot of weight." },
  gentle: { badge: "Gentle Support", badgeBg: "#F7EDD8", badgeColor: "#9A7322", body: "Your answers point to early strain. Gentle support and simple next steps can help keep this from building.", quote: "Noticing the pattern early is a strength." },
  extra: { badge: "Extra Support Recommended", badgeBg: "#FEF0E7", badgeColor: "#C2460A", body: "Your answers suggest you may benefit from extra support right now. Reaching out soon would be a good next step.", quote: "You do not have to carry this stretch alone." },
  immediate: { badge: "Immediate Support", badgeBg: "#FEECEC", badgeColor: "#B91C1C", body: "Your answers point to a high-need moment. Please open help right now and contact support immediately.", quote: "Your safety matters first." },
};

function CrisisCard({ title, body }) {
  return (
    <div style={{ background: "#F6E2E1", border: "1px solid #E8C4C0", borderRadius: 20, padding: "18px 20px" }}>
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#AF636A", marginBottom: 10 }}>{title}</div>
      <p style={{ fontSize: 13, color: "#7A3A3A", lineHeight: 1.55 }}>{body}</p>
    </div>
  );
}

function Result({ answers, onClose, onNeedHelp }) {
  const totalScore = computeEpdsScore(answers);
  const supportLevel = getEpdsSupportLevel(totalScore, answers[9] > 0);
  const meta = RISK_META[supportLevel];
  const q10Flag = answers[9] > 0;
  const showTalkBtn = supportLevel !== "steady" || q10Flag;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: F }}>
      <div style={{ background: "linear-gradient(160deg,#F4C9A8,#E2A0A4 50%,#D7A0AB)", padding: "0 28px 44px", position: "relative", overflow: "hidden", flexShrink: 0 }}>
        <div style={{ position: "absolute", width: 220, height: 220, borderRadius: "50%", right: -50, top: -70, background: "radial-gradient(circle,rgba(255,240,214,.8),transparent 70%)" }} />
        <div style={{ position: "relative", display: "inline-flex", margin: "24px 0 20px" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 9, fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#fff", background: "rgba(255,255,255,.25)", padding: "8px 16px", borderRadius: 30 }}>
            <svg viewBox="0 0 24 24" width="13" fill="none" stroke="currentColor" strokeWidth="2.8"><path d="M5 13l4 4L19 7"/></svg>
            Emotional Check complete
          </span>
        </div>
        <div style={{ fontFamily: S, fontWeight: 500, fontSize: 36, lineHeight: 1.05, letterSpacing: "-0.015em", color: "#4A2F2C", position: "relative", marginBottom: 12 }}>
          You showed up
          <em style={{ display: "block", fontStyle: "italic" }}>for yourself.</em>
        </div>
        <div style={{ position: "relative", display: "inline-flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontFamily: S, fontSize: 44, fontWeight: 500, color: "#4A2F2C", letterSpacing: "-0.02em" }}>{totalScore}</span>
          <span style={{ fontSize: 16, fontWeight: 500, color: "rgba(74,47,44,.5)" }}>/ 30</span>
        </div>
      </div>

      <div style={{ flex: 1, background: "#FBF6F0", borderRadius: "26px 26px 0 0", marginTop: -16, padding: "24px 22px 40px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 13 }}>
        <div style={{ background: "#fff", border: "1px solid #EFE6DC", borderRadius: 22, padding: "18px 20px", boxShadow: "0 2px 8px rgba(80,56,42,.05)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "5px 12px", borderRadius: 30, background: meta.badgeBg, color: meta.badgeColor }}>{meta.badge}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#9C8E83" }}>{totalScore} / 30</span>
          </div>
          <p style={{ fontSize: 13.5, color: "#6C5F56", lineHeight: 1.6 }}>{meta.body}</p>
          {supportLevel === "immediate" && (
            <div style={{ marginTop: 16 }}>
              <CrisisCard title="We recommend support" body="Please open help right now and reach out to a doctor, midwife, or crisis line." />
            </div>
          )}
        </div>

        {q10Flag && supportLevel !== "immediate" && (
          <CrisisCard title="We noticed your last answer" body="If those thoughts ever feel urgent, open help immediately. You matter deeply and support is available now." />
        )}

        <div style={{ background: "linear-gradient(150deg,#E7EFE8,#fff)", border: "1px solid #D8E6DB", borderRadius: 22, padding: "18px 20px" }}>
          <div style={{ fontFamily: S, fontStyle: "italic", fontSize: 17, color: "#577A62", lineHeight: 1.5, marginBottom: 8 }}>
            "{meta.quote}"
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#7A9E84" }}>— Your care team</div>
        </div>

        <motion.button className="ci-btn" onClick={onClose} whileTap={{ scale: 0.96 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
          Save & close
        </motion.button>

        {showTalkBtn && (
          <button onClick={onNeedHelp} style={{ width: "100%", padding: 15, borderRadius: 18, background: "#fff", border: "1px solid #EFE6DC", fontSize: 14, fontWeight: 700, color: "#6C5F56", cursor: "pointer", fontFamily: F }}>
            I Need Help
          </button>
        )}
      </div>
    </div>
  );
}

export default function EpdsFlow({ onClose, onNeedHelp }) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState(new Array(10).fill(null));
  const dateKeyRef = useRef(toDateKey());

  const setAnswer = (questionIndex, value) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[questionIndex] = value;
      return next;
    });
  };

  const handleNext = () => {
    if (step < 10) {
      setStep(step + 1);
      return;
    }
    saveEpdsEntry(answers, dateKeyRef.current);
    setStep("result");
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else onClose?.();
  };

  const variants = {
    initial: (d) => ({ opacity: 0, x: d * 28 }),
    animate: { opacity: 1, x: 0 },
    exit: (d) => ({ opacity: 0, x: d * -28 }),
  };

  const dir = 1;
  const isQuestion = typeof step === "number";
  const currentAnswer = isQuestion ? answers[step - 1] : null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "#FBF6F0", display: "flex", flexDirection: "column", maxWidth: 448, margin: "0 auto", fontFamily: F }}>
      {isQuestion && <Top step={step} onBack={handleBack} onClose={onClose} onHelp={onNeedHelp} />}
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div key={step} custom={dir} variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }} style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {isQuestion && (
            <Question
              questionIndex={step - 1}
              answer={answers[step - 1]}
              onSelect={(val) => setAnswer(step - 1, val)}
              onNext={handleNext}
              onBack={handleBack}
              onClose={onClose}
              onHelp={onNeedHelp}
            />
          )}
          {step === "result" && <Result answers={answers} onClose={onClose} onNeedHelp={onNeedHelp} />}
        </motion.div>
      </AnimatePresence>
      {isQuestion && (
        <div style={{ padding: "16px 24px 40px", flexShrink: 0 }}>
          <motion.button className="ci-btn" onClick={currentAnswer !== null ? handleNext : undefined} animate={{ opacity: currentAnswer !== null ? 1 : 0.4 }} transition={{ duration: 0.15 }} style={{ cursor: currentAnswer !== null ? "pointer" : "default", pointerEvents: currentAnswer !== null ? "auto" : "none" }}>
            {step < 10 ? "Continue" : "See results"}
          </motion.button>
        </div>
      )}
    </div>
  );
}

