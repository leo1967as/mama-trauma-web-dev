import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { saveOnboarding } from "../../lib/user-data";
import TimePicker from "./TimePicker";
import DatePicker from "./DatePicker";

const F = "'Plus Jakarta Sans', system-ui, sans-serif";
const S = "'Newsreader', serif";

const TODAY = new Date().toISOString().split("T")[0];

// ── shared ────────────────────────────────────────────────────────────────────

function ProgressDots({ current }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 4 }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{
          width: i === current ? 20 : 6, height: 6,
          borderRadius: 30,
          background: i === current ? "#C77E83" : i < current ? "#E8C4C4" : "#E6DBCF",
          transition: "all 0.3s ease",
        }} />
      ))}
    </div>
  );
}

function StepHeader({ onBack, onSkip, step, showBack = true }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 22px 4px" }}>
      {showBack ? (
        <button onClick={onBack} style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "#fff", border: "1px solid #EFE6DC",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#6C5F56", cursor: "pointer", fontSize: 15, fontWeight: 700, fontFamily: F,
        }}>←</button>
      ) : <div style={{ width: 36 }} />}
      <ProgressDots current={step} />
      {onSkip ? (
        <span onClick={onSkip} style={{ fontSize: 13, fontWeight: 700, color: "#AF636A", cursor: "pointer", fontFamily: F }}>
          Skip
        </span>
      ) : <div style={{ width: 36 }} />}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "14px 16px", fontSize: 16, fontFamily: F,
  background: "#fff", border: "1px solid #EFE6DC", borderRadius: 16,
  color: "#3E342C", outline: "none", transition: "border-color 0.2s",
};

const slideVariants = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -24 },
};

// ── step 0: welcome ───────────────────────────────────────────────────────────

function StepWelcome({ onNext }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#FBF2EC" }}>
      {/* dawn blob header */}
      <div className="relative overflow-hidden" style={{ flex: "0 0 auto", paddingBottom: 48, minHeight: 280 }}>
        <div className="dawn-blob dawn-blob-1" style={{ width: 300, height: 300, top: -80, right: -60, background: "radial-gradient(circle,rgba(244,201,168,.88),transparent 68%)", filter: "blur(60px)" }} />
        <div className="dawn-blob dawn-blob-2" style={{ width: 260, height: 260, top: 20, left: -70, background: "radial-gradient(circle,rgba(226,160,164,.82),transparent 68%)", filter: "blur(55px)" }} />
        <div className="dawn-blob dawn-blob-3" style={{ width: 220, height: 220, bottom: -30, left: "30%", background: "radial-gradient(circle,rgba(215,160,171,.75),transparent 68%)", filter: "blur(52px)" }} />
        <div style={{ position: "relative", padding: "52px 28px 0", zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#AF636A", marginBottom: 12 }}>
              CalmMama
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ fontFamily: S, fontWeight: 500, fontSize: 42, lineHeight: 1.0, letterSpacing: "-0.015em", color: "#4A2F2C" }}
          >
            Welcome to
            <em style={{ display: "block", fontStyle: "italic", color: "#C77E83" }}>CalmMama.</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ marginTop: 14, fontSize: 15, fontWeight: 500, color: "#7A453F", maxWidth: "80%", lineHeight: 1.5 }}
          >
            A gentle companion for your postpartum journey.
          </motion.p>
        </div>
      </div>

      {/* sheet */}
      <div style={{ flex: 1, background: "#FBF6F0", borderRadius: "26px 26px 0 0", marginTop: -20, padding: "28px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
        <motion.button
          className="ci-btn"
          onClick={onNext}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        >
          Get started
        </motion.button>
        <motion.button
          onClick={onNext}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
          style={{ background: "none", border: 0, cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#9C8E83", fontFamily: F, padding: "4px 0" }}
        >
          Already set up? Continue →
        </motion.button>
      </div>
    </div>
  );
}

// ── step 1: birth date ────────────────────────────────────────────────────────

function StepBirthDate({ value, onChange, onNext, onBack, onSkip }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#FBF6F0", fontFamily: F }}>
      <StepHeader onBack={onBack} onSkip={onSkip} step={1} />
      <div style={{ flex: 1, padding: "20px 22px 0", display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9C8E83", marginBottom: 12 }}>
          Week 0 · Day 0
        </div>
        <div style={{ fontFamily: S, fontWeight: 500, fontSize: 28, lineHeight: 1.15, letterSpacing: "-0.01em", color: "#3E342C", marginBottom: 6 }}>
          When did your
          <em style={{ display: "block", fontStyle: "italic", color: "#AF636A" }}>baby arrive?</em>
        </div>
        <div style={{ fontSize: 13, color: "#9C8E83", marginBottom: 28, lineHeight: 1.5 }}>
          Your journey starts from this day.
        </div>

        <DatePicker value={value} onChange={onChange} />
      </div>
      <div style={{ padding: "0 22px 32px", display: "flex", flexDirection: "column", gap: 10 }}>
        <button className="ci-btn" onClick={onNext}>Continue</button>
        <button onClick={onSkip} style={{ background: "none", border: 0, cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#9C8E83", fontFamily: F, padding: "4px 0" }}>
          Skip for now
        </button>
      </div>
    </div>
  );
}

// ── step 2: name ──────────────────────────────────────────────────────────────

function StepName({ value, onChange, onNext, onBack }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#FBF6F0", fontFamily: F }}>
      <StepHeader onBack={onBack} step={2} />
      <div style={{ flex: 1, padding: "20px 22px 0", display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9C8E83", marginBottom: 12 }}>
          Just for you
        </div>
        <div style={{ fontFamily: S, fontWeight: 500, fontSize: 28, lineHeight: 1.15, letterSpacing: "-0.01em", color: "#3E342C", marginBottom: 6 }}>
          What should we
          <em style={{ display: "block", fontStyle: "italic", color: "#AF636A" }}>call you?</em>
        </div>
        <div style={{ fontSize: 13, color: "#9C8E83", marginBottom: 28, lineHeight: 1.5 }}>
          This is just for you — no account needed yet.
        </div>

        <input
          type="text" placeholder="Mama" maxLength={30} value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={e => e.target.style.borderColor = "#C77E83"}
          onBlur={e => e.target.style.borderColor = "#EFE6DC"}
          style={{ ...inputStyle }}
        />
      </div>
      <div style={{ padding: "0 22px 32px" }}>
        <button className="ci-btn" onClick={onNext}>Continue</button>
      </div>
    </div>
  );
}

// ── step 3: reminder ──────────────────────────────────────────────────────────

function StepReminder({ value, onChange, onSave, onBack, onSkip }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#FBF6F0", fontFamily: F }}>
      <StepHeader onBack={onBack} onSkip={onSkip} step={3} />
      <div style={{ flex: 1, padding: "20px 22px 0", display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9C8E83", marginBottom: 12 }}>
          Optional
        </div>
        <div style={{ fontFamily: S, fontWeight: 500, fontSize: 28, lineHeight: 1.15, letterSpacing: "-0.01em", color: "#3E342C", marginBottom: 6 }}>
          A gentle nudge
          <em style={{ display: "block", fontStyle: "italic", color: "#AF636A" }}>each day?</em>
        </div>
        <div style={{ fontSize: 13, color: "#9C8E83", marginBottom: 28, lineHeight: 1.5 }}>
          Daily check-ins take under 30 seconds.
        </div>

        <TimePicker value={value} onChange={onChange} />
      </div>
      <div style={{ padding: "0 22px 32px", display: "flex", flexDirection: "column", gap: 10 }}>
        <button className="ci-btn" onClick={onSave}>Set reminder</button>
        <button onClick={onSkip} style={{ background: "none", border: 0, cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#9C8E83", fontFamily: F, padding: "4px 0" }}>
          Skip for now
        </button>
      </div>
    </div>
  );
}

// ── step 4: ready ─────────────────────────────────────────────────────────────

function StepReady({ name, onDone }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: F }}>
      {/* done-top gradient */}
      <div style={{ background: "linear-gradient(160deg,#F4C9A8,#E2A0A4 50%,#D7A0AB)", padding: "0 24px 40px", position: "relative", overflow: "hidden", flexShrink: 0 }}>
        <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", right: -50, top: -70, background: "radial-gradient(circle,rgba(255,240,214,.8),transparent 70%)" }} />
        <div style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 9, margin: "22px 0 20px" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 9, fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#fff", background: "rgba(255,255,255,.25)", padding: "8px 16px", borderRadius: 30 }}>
            <svg viewBox="0 0 24 24" width="13" fill="none" stroke="currentColor" strokeWidth="2.8"><path d="M5 13l4 4L19 7"/></svg>
            All set
          </span>
        </div>
        <div style={{ fontFamily: S, fontWeight: 500, fontSize: 40, lineHeight: 1.0, letterSpacing: "-0.015em", color: "#4A2F2C", position: "relative" }}>
          You're ready,
          <em style={{ display: "block", fontStyle: "italic" }}>{name || "Mama"}.</em>
        </div>
      </div>

      {/* sheet */}
      <div style={{ flex: 1, background: "#FBF6F0", borderRadius: "26px 26px 0 0", marginTop: -16, padding: "24px 22px", overflowY: "auto" }}>
        {/* milestone card */}
        <div style={{ background: "#fff", border: "1px solid #EFE6DC", borderRadius: 20, padding: 18, marginBottom: 16, boxShadow: "0 2px 8px rgba(80,56,42,.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#C77E83", flexShrink: 0, boxShadow: "0 0 0 4px #F6E2E1" }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#AF636A", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>
                Day 1 of your journey begins today
              </div>
              <div style={{ fontSize: 12.5, color: "#9C8E83", lineHeight: 1.45 }}>
                Your check-ins will track your mood, sleep, and energy — building a picture of how you're truly doing.
              </div>
            </div>
          </div>
        </div>

        {/* affirmation */}
        <div style={{ background: "linear-gradient(150deg,#E7EFE8,#fff)", border: "1px solid #D8E6DB", borderRadius: 20, padding: 18, marginBottom: 20 }}>
          <div style={{ fontFamily: S, fontStyle: "italic", fontSize: 16, color: "#577A62", lineHeight: 1.5, marginBottom: 6 }}>
            "Showing up for yourself — even on a hard day — matters more than you know."
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#7A9E84" }}>— Your care team</div>
        </div>

        <motion.button
          className="ci-btn"
          onClick={onDone}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          Go to my dashboard
          <svg viewBox="0 0 24 24" width="16" fill="none" stroke="currentColor" strokeWidth="2.3">
            <path d="M4 11l8-7 8 7"/><path d="M6 10v9h12v-9"/>
          </svg>
        </motion.button>
      </div>
    </div>
  );
}

// ── main ──────────────────────────────────────────────────────────────────────

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [birthDate, setBirthDate] = useState("");
  const [name, setName] = useState("");
  const [reminderTime, setReminderTime] = useState("08:00");
  const [dir, setDir] = useState(1); // 1=forward -1=back

  const go = (n) => { setDir(n > step ? 1 : -1); setStep(n); };

  const finish = (skipReminder = false) => {
    saveOnboarding({
      birthDate: birthDate || null,
      displayName: name.trim() || "Mama",
      reminderTime: skipReminder ? null : reminderTime,
    });
    onComplete();
  };

  const variants = {
    initial: { opacity: 0, x: dir * 28 },
    animate: { opacity: 1, x: 0 },
    exit:    { opacity: 0, x: dir * -28 },
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 60, background: "#FBF2EC", display: "flex", flexDirection: "column", maxWidth: 448, margin: "0 auto", fontFamily: F }}>
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={step}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}
        >
          {step === 0 && <StepWelcome onNext={() => go(1)} />}
          {step === 1 && <StepBirthDate value={birthDate} onChange={setBirthDate} onNext={() => go(2)} onBack={() => go(0)} onSkip={() => go(2)} />}
          {step === 2 && <StepName value={name} onChange={setName} onNext={() => go(3)} onBack={() => go(1)} />}
          {step === 3 && <StepReminder value={reminderTime} onChange={setReminderTime} onSave={() => go(4)} onBack={() => go(2)} onSkip={() => { setReminderTime(""); go(4); }} />}
          {step === 4 && <StepReady name={name.trim() || "Mama"} onDone={() => finish(reminderTime === "")} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
