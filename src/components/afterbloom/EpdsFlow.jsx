import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { saveEpdsEntry, computeEpdsScore, getEpdsSupportLevel, toDateKey } from "../../lib/epds-data";
import { LAYERS, LAYOUT, EASE_OUT_QUINT } from "../../lib/theme.jsx";
import { useBodyScrollLock } from "../../hooks/use-body-scroll-lock";
import { useLang } from "../../lib/i18n";

import { ArrowLeft12Filled } from "@/components/ui/fluent-arrow-left-12-filled";
import { Dismiss12Filled } from "@/components/ui/fluent-dismiss-12-filled";

const F = "'Plus Jakarta Sans', system-ui, sans-serif";
const S = "'Newsreader', serif";

const QUESTIONS = [
  { isSensitive: false },
  { isSensitive: false },
  { isSensitive: false },
  { isSensitive: false },
  { isSensitive: false },
  { isSensitive: false },
  { isSensitive: false },
  { isSensitive: false },
  { isSensitive: false },
  { isSensitive: true },
];

function Top({ step, onBack, onClose, onHelp }) {
  const { t } = useLang();
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px 8px" }}>
      <motion.button
        onClick={step === 1 ? onClose : onBack}
        whileTap={{ scale: 0.9 }}
        aria-label={step === 1 ? "Close emotional check" : "Go back"}
        style={{ width: 44, height: 44, borderRadius: "50%", background: "#fff", border: "1px solid #EFE6DC", display: "flex", alignItems: "center", justifyContent: "center", color: "#6C5F56", cursor: "pointer", fontSize: 16, fontWeight: 700, fontFamily: F }}
      >
        {step === 1 ? <Dismiss12Filled style={{ width: 16, height: 16 }} /> : <ArrowLeft12Filled style={{ width: 16, height: 16 }} />}
      </motion.button>
      <div style={{ flex: 1, padding: "0 12px", textAlign: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#786A5C", marginBottom: 6 }}>{t.epds.title}</div>
        <div style={{ height: 5, background: "#EFE6DC", borderRadius: 18, overflow: "hidden" }}>
          <motion.div animate={{ width: `${(step / 10) * 100}%` }} transition={{ duration: 0.35 }} style={{ height: "100%", background: "linear-gradient(90deg,#C77E83,#DBA0A2)", borderRadius: 18 }} />
        </div>
      </div>
      <button onClick={onHelp} style={{ width: 44, height: 44, borderRadius: "50%", background: "#F6E2E1", border: 0, color: "#9A4C53", fontSize: 11, fontWeight: 800, cursor: "pointer", lineHeight: 1, padding: 0 }}>{t.checkin.help}</button>
    </div>
  );
}

function Question({ questionIndex, answer, onSelect, onNext }) {
  const { t } = useLang();
  const q = { ...QUESTIONS[questionIndex], ...t.epds.questions[questionIndex] };
  const step = questionIndex + 1;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#FBF6F0", fontFamily: F }}>
      <div style={{ flex: 1, padding: `22px 24px ${LAYOUT.flowScrollPadding}`, overflowY: "auto", overscrollBehavior: "contain" }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#B8C9B0", marginBottom: 16 }}>
          {t.epds.questionOf.replace("{{n}}", step)}
        </div>
        <div style={{ fontFamily: S, fontWeight: 500, fontSize: 24, lineHeight: 1.3, letterSpacing: "-0.01em", color: "#3E342C", marginBottom: 24 }}>
          {q.prompt}
        </div>
        {q.isSensitive && (
          <div style={{ background: "#E7EFE8", border: "1px solid #C8DFC9", borderRadius: 10, padding: "13px 16px", marginBottom: 18, display: "flex", gap: 12, alignItems: "flex-start" }}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#577A62" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            <span style={{ fontSize: 12.5, color: "#577A62", lineHeight: 1.55 }}>{t.epds.sensitiveNote}</span>
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {q.options.map((opt, idx) => {
            const on = answer === idx;
            return (
              <motion.button
                key={idx}
                onClick={() => onSelect(idx)}
                whileTap={{ scale: 0.97 }}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", background: on ? "#FBEDEC" : "#fff", border: `1.5px solid ${on ? "#C77E83" : "#EFE6DC"}`, borderRadius: 12, cursor: "pointer", textAlign: "left", width: "100%", boxShadow: on ? "0 4px 14px rgba(199,126,131,.14)" : "0 2px 6px rgba(80,56,42,.04)" }}
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
      <div style={{ padding: `16px 24px ${LAYOUT.flowFooterPadding}` }}>
        <motion.button
          className="ci-btn"
          onClick={answer !== null ? onNext : undefined}
          animate={{ opacity: answer !== null ? 1 : 0.4 }}
          transition={{ duration: 0.15 }}
          style={{ cursor: answer !== null ? "pointer" : "default", pointerEvents: answer !== null ? "auto" : "none" }}
        >
          {step < 10 ? t.epds.continue : t.epds.seeResults}
        </motion.button>
      </div>
    </div>
  );
}

const RISK_META_STYLES = {
  steady: { badgeBg: "#E7EFE8", badgeColor: "#577A62" },
  gentle: { badgeBg: "#F7EDD8", badgeColor: "#9A7322" },
  extra: { badgeBg: "#FEF0E7", badgeColor: "#C2460A" },
  immediate: { badgeBg: "#FEECEC", badgeColor: "#B91C1C" },
};

function CrisisCard({ title, body }) {
  return (
    <div style={{ background: "#F6E2E1", border: "1px solid #E8C4C0", borderRadius: 14, padding: "18px 20px" }}>
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#9A4C53", marginBottom: 10 }}>{title}</div>
      <p style={{ fontSize: 13, color: "#7A3A3A", lineHeight: 1.55 }}>{body}</p>
    </div>
  );
}

function Result({ answers, onClose, onNeedHelp }) {
  const { t } = useLang();
  const [scoreOpen, setScoreOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const totalScore = computeEpdsScore(answers);
  const supportLevel = getEpdsSupportLevel(totalScore, answers[9] > 0);
  const meta = t.epds.riskMeta[supportLevel];
  const styles = RISK_META_STYLES[supportLevel];
  const q10Flag = answers[9] > 0;
  const showTalkBtn = supportLevel !== "steady" || q10Flag;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: F }}>
      <div style={{ background: "#F2E4DE", padding: "0 28px 44px", position: "relative", overflow: "hidden", flexShrink: 0 }}>
        <div style={{ position: "relative", display: "inline-flex", margin: "24px 0 20px" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 9, fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#fff", background: "rgba(255,255,255,.25)", padding: "8px 16px", borderRadius: 18 }}>
            <svg viewBox="0 0 24 24" width="13" fill="none" stroke="currentColor" strokeWidth="2.8"><path d="M5 13l4 4L19 7"/></svg>
            {t.epds.completeBadge}
          </span>
        </div>
        <div style={{ fontFamily: S, fontWeight: 500, fontSize: 36, lineHeight: 1.05, letterSpacing: "-0.015em", color: "#4A2F2C", position: "relative", marginBottom: 4 }}>
          {t.epds.heroTitle}
          <em style={{ display: "block", fontStyle: "italic" }}>{t.epds.heroTitleItalic}</em>
        </div>
      </div>

      <div style={{ flex: 1, background: "#FBF6F0", borderRadius: "18px 18px 0 0", marginTop: -16, padding: `24px 22px ${LAYOUT.flowScrollPadding}`, overflowY: "auto", overscrollBehavior: "contain", display: "flex", flexDirection: "column", gap: 13 }}>
        <div style={{ background: "#fff", border: "1px solid #EFE6DC", borderRadius: 14, padding: "18px 20px", boxShadow: "0 2px 8px rgba(80,56,42,.05)" }}>
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "5px 12px", borderRadius: 18, background: styles.badgeBg, color: styles.badgeColor, marginBottom: 10 }}>{meta.badge}</span>
          <p style={{ fontSize: 13.5, color: "#6C5F56", lineHeight: 1.6, marginBottom: 10 }}>{meta.body}</p>
          <p style={{ fontSize: 12.5, color: "#3E342C", fontWeight: 700 }}>{t.epds.nextStepPrefix}{t.epdsNextSteps[supportLevel]}</p>
          {supportLevel === "immediate" && (
            <div style={{ marginTop: 16 }}>
              <CrisisCard title={t.epds.crisisCards.recommendSupport} body={t.epds.crisisCards.recommendSupportBody} />
            </div>
          )}
        </div>

        {q10Flag && supportLevel !== "immediate" && (
          <CrisisCard title={t.epds.crisisCards.noticedLastAnswer} body={t.epds.crisisCards.noticedLastAnswerBody} />
        )}

        <div style={{ background: "linear-gradient(150deg,#E7EFE8,#fff)", border: "1px solid #D8E6DB", borderRadius: 14, padding: "18px 20px" }}>
          <div style={{ fontFamily: S, fontStyle: "italic", fontSize: 17, color: "#577A62", lineHeight: 1.5, marginBottom: 8 }}>
            "{meta.quote}"
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#7A9E84" }}>{t.epds.careTeam}</div>
        </div>

        <button
          type="button"
          onClick={() => setScoreOpen((open) => !open)}
          aria-expanded={scoreOpen}
          aria-controls="epds-score-details"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, width: "100%", minHeight: 44, padding: "13px 16px", borderRadius: 12, border: "1px solid #EFE6DC", background: "#fff", color: "#7A453F", fontSize: 12.5, fontWeight: 800, cursor: "pointer", fontFamily: F }}
        >
          {scoreOpen ? t.epds.hideScore : t.epds.seeScore}
          <svg viewBox="0 0 24 24" width="13" fill="none" stroke="currentColor" strokeWidth="2.4" style={{ transform: scoreOpen ? "rotate(180deg)" : "none", transition: "transform 180ms ease" }}>
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>

        <AnimatePresence initial={false}>
          {scoreOpen && (
            <motion.div
              id="epds-score-details"
              initial={reduceMotion ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              style={{ background: "#fff", border: "1px solid #EFE6DC", borderRadius: 14, padding: "18px 20px", boxShadow: "0 2px 8px rgba(80,56,42,.05)" }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 }}>
                <span style={{ fontFamily: S, fontSize: 30, fontWeight: 500, color: "#4A2F2C", letterSpacing: "-0.02em" }}>{totalScore}</span>
                <span style={{ fontSize: 14, fontWeight: 500, color: "#786A5C" }}>/ 30</span>
              </div>
              <p style={{ fontSize: 12.5, color: "#786A5C", lineHeight: 1.55 }}>
                {t.epds.scoreExplain}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {showTalkBtn && (
          <button onClick={onNeedHelp} style={{ width: "100%", padding: 16, borderRadius: 12, background: supportLevel === "immediate" ? "#B91C1C" : "#C77E83", border: 0, fontSize: 15, fontWeight: 800, color: "#fff", cursor: "pointer", fontFamily: F, boxShadow: supportLevel === "immediate" ? "0 10px 18px rgba(185,28,28,.18)" : "0 12px 22px rgba(175,99,106,.22)" }}>
            {t.epds.iNeedHelp}
          </button>
        )}

        <motion.button
          className={showTalkBtn ? "" : "ci-btn"}
          onClick={onClose}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          style={showTalkBtn ? { width: "100%", padding: 15, borderRadius: 12, background: "#fff", border: "1px solid #EFE6DC", fontSize: 14, fontWeight: 700, color: "#6C5F56", cursor: "pointer", fontFamily: F } : undefined}
        >
          {t.epds.saveClose}
        </motion.button>
      </div>
    </div>
  );
}

export default function EpdsFlow({ onClose, onNeedHelp, trigger = "manual" }) {
  useBodyScrollLock();
  const reduceMotion = useReducedMotion();

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
    saveEpdsEntry(answers, dateKeyRef.current, trigger);
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

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.32, ease: EASE_OUT_QUINT } }}
      exit={reduceMotion ? { opacity: 0, transition: { duration: 0.15 } } : { opacity: 0, y: "100%", transition: { duration: 0.24, ease: EASE_OUT_QUINT } }}
      role="dialog"
      aria-modal="true"
      style={{ position: "fixed", inset: 0, zIndex: LAYERS.flowOverlay, background: "#FBF6F0", display: "flex", flexDirection: "column", maxWidth: 448, margin: "0 auto", fontFamily: F }}
    >
      {isQuestion && <Top step={step} onBack={handleBack} onClose={onClose} onHelp={onNeedHelp} />}
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div key={step} custom={dir} variants={variants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }} style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {isQuestion && (
            <Question
              questionIndex={step - 1}
              answer={answers[step - 1]}
              onSelect={(val) => setAnswer(step - 1, val)}
              onNext={handleNext}
            />
          )}
          {step === "result" && <Result answers={answers} onClose={onClose} onNeedHelp={onNeedHelp} />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
