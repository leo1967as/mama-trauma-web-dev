import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { saveOnboarding, setJustOnboarded } from "../../lib/user-data";
import TimePicker from "./TimePicker";
import DatePicker from "./DatePicker";

const F = "'Plus Jakarta Sans', system-ui, sans-serif";
const S = "'Newsreader', serif";

// ── shared ────────────────────────────────────────────────────────────────────

function ProgressDots({ current }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
      {[1, 2, 3].map(i => (
        <motion.div
          key={i}
          animate={{ width: i === current ? 22 : 6, background: i === current ? "#C77E83" : i < current ? "#E8C4C4" : "#E6DBCF" }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          style={{ height: 6, borderRadius: 30 }}
        />
      ))}
    </div>
  );
}

function StepHeader({ onBack, onSkip, step, skipLabel = "Skip" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px 8px" }}>
      <motion.button
        onClick={onBack}
        whileTap={{ scale: 0.88 }}
        transition={{ type: "spring", stiffness: 500, damping: 20 }}
        style={{
          width: 38, height: 38, borderRadius: "50%",
          background: "#fff", border: "1px solid #EFE6DC",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#6C5F56", cursor: "pointer", fontSize: 16, fontWeight: 700, fontFamily: F,
        }}
      >←</motion.button>

      <ProgressDots current={step} />

      {onSkip ? (
        <span onClick={onSkip} style={{ fontSize: 13, fontWeight: 700, color: "#AF636A", cursor: "pointer", fontFamily: F, padding: "4px 2px" }}>
          {skipLabel}
        </span>
      ) : <div style={{ width: 38 }} />}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "16px 18px", fontSize: 16, fontFamily: F,
  background: "#fff", border: "1px solid #EFE6DC", borderRadius: 18,
  color: "#3E342C", outline: "none", transition: "border-color 0.2s",
};

// ── step 0: welcome ───────────────────────────────────────────────────────────

function StepWelcome({ onNext, onSkipAll }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#FAF0EC", position: "relative", overflow: "hidden" }}>

      {/* background blobs — ref: calmmama.html */}
      <div className="welcome-blob welcome-blob-1" style={{ width: 340, height: 280, top: -60,  right: -80,  background: "radial-gradient(circle,rgba(245,200,168,.82),transparent 70%)" }} />
      <div className="welcome-blob welcome-blob-2" style={{ width: 300, height: 260, top:  180, left: -90,  background: "radial-gradient(circle,rgba(240,192,176,.75),transparent 70%)" }} />
      <div className="welcome-blob welcome-blob-3" style={{ width: 320, height: 260, bottom: -60, left: "15%", background: "radial-gradient(circle,rgba(238,184,176,.72),transparent 70%)" }} />

      {/* breathing ring */}
      <svg style={{ position: "absolute", top: "38%", left: "50%", transform: "translate(-50%,-50%)", width: 280, height: 280, pointerEvents: "none", zIndex: 1 }} viewBox="0 0 260 260">
        {[0, 1, 2].map(i => (
          <circle key={i} cx="130" cy="130" r={60 + i * 28} style={{ fill: "none", stroke: "rgba(200,112,106,.1)", strokeWidth: 1, animation: `ring-pulse 4s ease-in-out ${1.5 + i * 0.7}s infinite`, transformOrigin: "130px 130px" }} />
        ))}
      </svg>

      {/* X exit */}
      <div style={{ position: "absolute", top: 16, right: 20, zIndex: 20 }}>
        <motion.button
          onClick={onSkipAll}
          whileTap={{ scale: 0.88 }}
          style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,.55)", border: "1px solid rgba(255,255,255,.75)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#9C8E83", fontSize: 14, fontFamily: F, fontWeight: 700 }}
        >✕</motion.button>
      </div>

      {/* centered text content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", padding: "0 30px", position: "relative", zIndex: 10 }}>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "#C8706A", marginBottom: 20 }}>
            CalmMama
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}>
          <div style={{ fontSize: 29, fontWeight: 700, color: "#2A1815", lineHeight: 1.15, letterSpacing: "-0.01em" }}>
            Welcome to
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95 }}>
          <div style={{ fontFamily: S, fontStyle: "italic", fontWeight: 500, fontSize: 38, color: "#C8706A", lineHeight: 1.1, letterSpacing: "-0.015em", marginBottom: 18 }}>
            CalmMama.
          </div>
        </motion.div>

        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
          style={{ fontSize: 15, fontWeight: 300, color: "#7A5A55", lineHeight: 1.65, maxWidth: 240, marginBottom: 28 }}>
          A gentle companion for your postpartum journey.
        </motion.p>

        {/* float dots */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.55 }}
          style={{ display: "flex", gap: 7 }}>
          {["#C8706A", "#D89088", "#EAD8D2", "#EAD8D2", "#EAD8D2"].map((c, i) => (
            <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: c }} />
          ))}
        </motion.div>
      </div>

      {/* CTA pinned to bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.45 }}
        style={{ position: "relative", zIndex: 10, padding: "0 24px 44px", display: "flex", flexDirection: "column", gap: 12 }}
      >
        <button className="ci-btn" onClick={onNext}>
          Get started
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
        </button>
        <button onClick={onSkipAll} style={{ background: "none", border: 0, cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "#A8908A", fontFamily: F, padding: "2px 0" }}>
          Already set up? Continue →
        </button>
      </motion.div>
    </div>
  );
}

// ── step 1: birth date ────────────────────────────────────────────────────────

function formatDate(ymd) {
  if (!ymd) return "";
  const d = new Date(ymd + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}
function daysSince(ymd) {
  if (!ymd) return 0;
  return Math.max(0, Math.floor((Date.now() - new Date(ymd + "T00:00:00")) / 86400000));
}

function StepBirthDate({ value, onChange, onNext, onBack, onSkip }) {
  const [confirming, setConfirming] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [warnSkip, setWarnSkip] = useState(false);

  useEffect(() => {
    if (!confirming) { setCountdown(3); return; }
    const t = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(t); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [confirming]);

  const handleContinue = () => {
    if (value) { setConfirming(true); }
    else { handleSkip(); }
  };

  const handleSkip = () => {
    if (!value) {
      setWarnSkip(true);
      setTimeout(() => setWarnSkip(false), 3500);
    } else {
      onSkip();
    }
  };

  const days = daysSince(value);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#FBF6F0", fontFamily: F }}>
      <StepHeader onBack={onBack} onSkip={handleSkip} step={1} />

      <div style={{ flex: 1, padding: "24px 26px 0", display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#B8C9B0", marginBottom: 16 }}>
          Step 1 of 3
        </div>
        <div style={{ fontFamily: S, fontWeight: 500, fontSize: 30, lineHeight: 1.12, letterSpacing: "-0.01em", color: "#3E342C", marginBottom: 10 }}>
          When did your
          <em style={{ display: "block", fontStyle: "italic", color: "#AF636A" }}>baby arrive?</em>
        </div>
        <div style={{ fontSize: 13.5, color: "#9C8E83", marginBottom: 28, lineHeight: 1.6 }}>
          Your Care Journey timeline is built from this date.
        </div>

        <DatePicker value={value} onChange={v => { onChange(v); setConfirming(false); }} />

        {/* soft skip warning */}
        <AnimatePresence>
          {warnSkip && (
            <motion.div
              initial={{ opacity: 0, y: 8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ marginTop: 14, background: "#FEF0E7", border: "1px solid #F5D5B8", borderRadius: 14, padding: "12px 16px" }}
            >
              <div style={{ fontSize: 12.5, color: "#C2460A", fontWeight: 600, lineHeight: 1.5, marginBottom: 10 }}>
                Without a birth date, your timeline won't be personalised.
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => { setWarnSkip(false); onSkip(); }} style={{ fontSize: 11.5, fontWeight: 700, color: "#C2460A", background: "none", border: 0, cursor: "pointer", fontFamily: F, textDecoration: "underline" }}>
                  Skip anyway
                </button>
                <button onClick={() => setWarnSkip(false)} style={{ fontSize: 11.5, fontWeight: 700, color: "#9C8E83", background: "none", border: 0, cursor: "pointer", fontFamily: F }}>
                  Add date
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ padding: "20px 26px 44px" }}>
        <button className="ci-btn" onClick={handleContinue}>Continue</button>
      </div>

      {/* ── Confirm date popup ── */}
      <AnimatePresence>
        {confirming && (
          <>
            {/* backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setConfirming(false)}
              style={{ position: "absolute", inset: 0, background: "rgba(62,52,44,.35)", zIndex: 10 }}
            />
            {/* sheet */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: "spring", stiffness: 380, damping: 34 }}
              style={{
                position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 11,
                background: "#FBF6F0", borderRadius: "28px 28px 0 0",
                padding: "28px 26px 44px",
                boxShadow: "0 -8px 32px rgba(80,56,42,.12)",
              }}
            >
              {/* handle */}
              <div style={{ width: 36, height: 4, borderRadius: 30, background: "#E6DBCF", margin: "0 auto 24px" }} />

              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9C8E83", marginBottom: 14 }}>
                Is this right?
              </div>

              {/* date display */}
              <div style={{ background: "#fff", border: "1px solid #EFE6DC", borderRadius: 18, padding: "18px 20px", marginBottom: 20, boxShadow: "0 2px 8px rgba(80,56,42,.05)" }}>
                <div style={{ fontFamily: S, fontSize: 26, fontWeight: 500, color: "#3E342C", marginBottom: 6 }}>
                  {formatDate(value)}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#C77E83", boxShadow: "0 0 0 3px #F6E2E1" }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#AF636A" }}>
                    {days === 0 ? "Day 1 · Today" : `Day ${days + 1} · ${days} day${days !== 1 ? "s" : ""} ago`}
                  </span>
                </div>
              </div>

              <motion.button
                className="ci-btn"
                onClick={countdown === 0 ? onNext : undefined}
                whileTap={countdown === 0 ? { scale: 0.96 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                animate={{ opacity: countdown > 0 ? 0.45 : 1 }}
                style={{ marginBottom: 12, cursor: countdown > 0 ? "default" : "pointer", pointerEvents: countdown > 0 ? "none" : "auto" }}
              >
                <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <AnimatePresence mode="wait">
                      {countdown > 0 ? (
                        <motion.span
                          key="ring"
                          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                          style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid rgba(255,255,255,.5)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                        >
                          <AnimatePresence mode="wait">
                            <motion.span key={countdown} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }} style={{ fontSize: 11, fontWeight: 800, lineHeight: 1 }}>
                              {countdown}
                            </motion.span>
                          </AnimatePresence>
                        </motion.span>
                      ) : (
                        <motion.span key="check" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 20 }}>
                          <svg viewBox="0 0 24 24" width="16" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg>
                        </motion.span>
                      )}
                    </AnimatePresence>
                    Yes, this is correct
                  </span>
                </span>
              </motion.button>
              <button
                onClick={() => setConfirming(false)}
                style={{ width: "100%", background: "none", border: 0, fontSize: 13, fontWeight: 600, color: "#9C8E83", cursor: "pointer", fontFamily: F, padding: "4px 0" }}
              >
                Change date
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── step 2: name ──────────────────────────────────────────────────────────────

function StepName({ value, onChange, onNext, onBack }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#FBF6F0", fontFamily: F }}>
      <StepHeader onBack={onBack} step={2} />

      <div style={{ flex: 1, padding: "28px 26px 0", display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#B8C9B0", marginBottom: 16 }}>
          Step 2 of 3
        </div>
        <div style={{ fontFamily: S, fontWeight: 500, fontSize: 30, lineHeight: 1.12, letterSpacing: "-0.01em", color: "#3E342C", marginBottom: 10 }}>
          What should we
          <em style={{ display: "block", fontStyle: "italic", color: "#AF636A" }}>call you?</em>
        </div>
        <div style={{ fontSize: 13.5, color: "#9C8E83", marginBottom: 32, lineHeight: 1.6 }}>
          This is just between you and the app.
        </div>

        <input
          type="text"
          placeholder="Your name or nickname"
          maxLength={30}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={e => e.target.style.borderColor = "#C77E83"}
          onBlur={e => e.target.style.borderColor = "#EFE6DC"}
          style={{ ...inputStyle }}
          autoFocus
        />

        <div style={{ marginTop: 12, fontSize: 11.5, color: "#C8BEB8", lineHeight: 1.5 }}>
          Leave blank to use "Mama" — you can change this later.
        </div>
      </div>

      <div style={{ padding: "20px 26px 44px" }}>
        <button className="ci-btn" onClick={onNext}>Continue</button>
      </div>
    </div>
  );
}

// ── step 3: reminder ──────────────────────────────────────────────────────────

function StepReminder({ value, onChange, onSave, onBack, onSkip }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#FBF6F0", fontFamily: F }}>
      <StepHeader onBack={onBack} onSkip={onSkip} step={3} skipLabel="Skip" />

      <div style={{ flex: 1, padding: "28px 26px 0", display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#B8C9B0", marginBottom: 16 }}>
          Step 3 of 3 · Optional
        </div>
        <div style={{ fontFamily: S, fontWeight: 500, fontSize: 30, lineHeight: 1.12, letterSpacing: "-0.01em", color: "#3E342C", marginBottom: 10 }}>
          A gentle nudge
          <em style={{ display: "block", fontStyle: "italic", color: "#AF636A" }}>each day?</em>
        </div>
        <div style={{ fontSize: 13.5, color: "#9C8E83", marginBottom: 28, lineHeight: 1.6 }}>
          Daily check-ins take under 30 seconds. You can change this anytime.
        </div>

        <TimePicker value={value} onChange={onChange} />
      </div>

      <div style={{ padding: "20px 26px 44px", display: "flex", flexDirection: "column", gap: 12 }}>
        <button className="ci-btn" onClick={onSave}>Set reminder</button>
        <button
          onClick={onSkip}
          style={{ background: "none", border: 0, cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "#B0A8A4", fontFamily: F, padding: "2px 0" }}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}

// ── step 4: ready ─────────────────────────────────────────────────────────────

function StepReady({ name, hasBirthDate, onDone }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: F }}>
      <div style={{ background: "linear-gradient(160deg,#F4C9A8,#E2A0A4 50%,#D7A0AB)", padding: "0 28px 44px", position: "relative", overflow: "hidden", flexShrink: 0 }}>
        <div style={{ position: "absolute", width: 220, height: 220, borderRadius: "50%", right: -50, top: -70, background: "radial-gradient(circle,rgba(255,240,214,.8),transparent 70%)" }} />
        <div style={{ position: "relative", display: "inline-flex", margin: "24px 0 22px" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 9, fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#fff", background: "rgba(255,255,255,.25)", padding: "8px 16px", borderRadius: 30 }}>
            <svg viewBox="0 0 24 24" width="13" fill="none" stroke="currentColor" strokeWidth="2.8"><path d="M5 13l4 4L19 7"/></svg>
            All set
          </span>
        </div>
        <div style={{ fontFamily: S, fontWeight: 500, fontSize: 42, lineHeight: 1.0, letterSpacing: "-0.015em", color: "#4A2F2C", position: "relative" }}>
          You're ready,
          <em style={{ display: "block", fontStyle: "italic" }}>{name}.</em>
        </div>
      </div>

      <div style={{ flex: 1, background: "#FBF6F0", borderRadius: "28px 28px 0 0", marginTop: -16, padding: "28px 24px 40px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* journey start card */}
        <div style={{ background: "#fff", border: "1px solid #EFE6DC", borderRadius: 20, padding: "18px 20px", boxShadow: "0 2px 8px rgba(80,56,42,.05)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#C77E83", flexShrink: 0, marginTop: 4, boxShadow: "0 0 0 4px #F6E2E1" }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#AF636A", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
                {hasBirthDate ? "Your journey is personalised" : "Day 1 begins today"}
              </div>
              <div style={{ fontSize: 13, color: "#9C8E83", lineHeight: 1.55 }}>
                {hasBirthDate
                  ? "Your Care Timeline and insights are now tailored to where you actually are in your postpartum journey."
                  : "Check-ins will build a picture of how you're truly doing — mood, sleep, and energy — day by day."}
              </div>
            </div>
          </div>
        </div>

        {/* affirmation */}
        <div style={{ background: "linear-gradient(150deg,#E7EFE8,#fff)", border: "1px solid #D8E6DB", borderRadius: 20, padding: "18px 20px" }}>
          <div style={{ fontFamily: S, fontStyle: "italic", fontSize: 16, color: "#577A62", lineHeight: 1.55, marginBottom: 8 }}>
            "Showing up for yourself — even on a hard day — matters more than you know."
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#7A9E84" }}>— Your care team</div>
        </div>

        <motion.button
          className="ci-btn"
          onClick={onDone}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          style={{ marginTop: 4 }}
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
  const [dir, setDir] = useState(1);

  const go = (n) => { setDir(n > step ? 1 : -1); setStep(n); };

  const finish = () => {
    saveOnboarding({
      birthDate: birthDate || null,
      displayName: name.trim() || "Mama",
      reminderTime: reminderTime || null,
    });
    setJustOnboarded();
    onComplete();
  };

  const skipAll = () => {
    saveOnboarding({ birthDate: null, displayName: "Mama", reminderTime: null });
    setJustOnboarded();
    onComplete();
  };

  const variants = {
    initial: { opacity: 0, x: dir * 30 },
    animate: { opacity: 1, x: 0 },
    exit:    { opacity: 0, x: dir * -30 },
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 60, background: "#FBF2EC", display: "flex", flexDirection: "column", maxWidth: 448, margin: "0 auto", fontFamily: F }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}
        >
          {step === 0 && <StepWelcome onNext={() => go(1)} onSkipAll={skipAll} />}
          {step === 1 && <StepBirthDate value={birthDate} onChange={setBirthDate} onNext={() => go(2)} onBack={() => go(0)} onSkip={() => go(2)} />}
          {step === 2 && <StepName value={name} onChange={setName} onNext={() => go(3)} onBack={() => go(1)} />}
          {step === 3 && <StepReminder value={reminderTime} onChange={setReminderTime} onSave={() => go(4)} onBack={() => go(2)} onSkip={() => { setReminderTime(""); go(4); }} />}
          {step === 4 && <StepReady name={name.trim() || "Mama"} hasBirthDate={!!birthDate} onDone={finish} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
