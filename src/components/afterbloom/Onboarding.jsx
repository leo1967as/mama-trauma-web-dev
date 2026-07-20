import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { saveOnboarding, setJustOnboarded } from "../../lib/user-data";
import { syncProfile } from "../../lib/firebase-sync";
import { signInWithGoogle } from "../../lib/firebase";
import { authErrorKey, clearAuthIntent, isEmbeddedBrowser, setAuthIntent } from "../../lib/auth-flow";
import { EASE_OUT_QUINT } from "../../lib/theme.jsx";
import { useLang } from "../../lib/i18n";
import DatePicker from "./DatePicker";
import { useBodyScrollLock } from "../../hooks/use-body-scroll-lock";

import { ArrowLeft12Filled } from "@/components/ui/fluent-arrow-left-12-filled";

const F = "'Plus Jakarta Sans', system-ui, sans-serif";
const S = "'Newsreader', serif";

// ── shared ────────────────────────────────────────────────────────────────────

function ProgressDots({ current, total = 4 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
      {Array.from({ length: total }, (_, i) => i + 1).map(i => (
        <motion.div
          key={i}
          animate={{ width: i === current ? 22 : 6, background: i === current ? "#C77E83" : i < current ? "#E8C4C4" : "#E6DBCF" }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          style={{ height: 6, borderRadius: 18 }}
        />
      ))}
    </div>
  );
}

function StepHeader({ onBack, step, total = 4 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px 8px" }}>
      <motion.button
        onClick={onBack}
        whileTap={{ scale: 0.88 }}
        transition={{ type: "spring", stiffness: 500, damping: 20 }}
        style={{
          width: 44, height: 44, borderRadius: "50%",
          background: "#fff", border: "1px solid #EFE6DC",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#6C5F56", cursor: "pointer", fontSize: 16, fontWeight: 700, fontFamily: F,
        }}
      ><ArrowLeft12Filled style={{ width: 16, height: 16 }} /></motion.button>

      <ProgressDots current={step} total={total} />

      <div style={{ width: 44 }} />
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "16px 18px", fontSize: 16, fontFamily: F,
  background: "#fff", border: "1px solid #EFE6DC", borderRadius: 12,
  color: "#3E342C", outline: "none", transition: "border-color 0.2s",
};

// ── step 0: welcome ───────────────────────────────────────────────────────────

function WelcomeBtn({ initialErrorCode }) {
  const [phase, setPhase] = useState("idle");
  const [errorCode, setErrorCode] = useState(initialErrorCode);
  const { t } = useLang();

  useEffect(() => setErrorCode(initialErrorCode), [initialErrorCode]);

  const handleClick = async () => {
    if (phase !== "idle") return;
    if (isEmbeddedBrowser()) {
      setErrorCode("embedded-browser");
      return;
    }

    setErrorCode(null);
    setAuthIntent();
    setPhase("loading");

    try {
      await signInWithGoogle();
    } catch (err) {
      clearAuthIntent();
      console.warn("Google sign-in cancelled or failed", err.code);
      setErrorCode(err?.code || "auth/unknown");
      setPhase("idle");
    }
  };

  const errorText = errorCode && t.onboarding.welcome[authErrorKey(errorCode)];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <button type="button" className={`ci-btn${phase === "loading" ? " loading" : ""}`} onClick={handleClick}>
        <div className="ci-btn__content">
          {t.onboarding.welcome.cta}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
          </svg>
        </div>
        <div className="ci-btn__loading">
          <div className="ci-spinner" />
          <span style={{ fontSize: 13.5, fontWeight: 600, color: "rgba(255,255,255,.9)" }}>{t.onboarding.welcome.settingUp}</span>
        </div>
      </button>
      {errorText && <div role="alert" style={{ fontSize: 12, lineHeight: 1.5, textAlign: "center", color: "#8B5E57" }}>{errorText}</div>}
      {errorCode === "embedded-browser" && (
        <a
          href={globalThis.location?.href || "https://afterbloom-app.vercel.app/"}
          target="_blank"
          rel="noopener noreferrer"
          style={{ alignSelf: "center", fontSize: 12.5, fontWeight: 700, color: "#8B5E57", textDecoration: "underline" }}
        >
          {t.onboarding.welcome.openExternalBrowser}
        </a>
      )}
    </div>
  );
}

function StepWelcome({ initialErrorCode }) {
  const { t } = useLang();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#FAF0EC", position: "relative", overflow: "hidden" }}>

      {/* breathing ring */}
      <svg style={{ position: "absolute", top: "38%", left: "50%", transform: "translate(-50%,-50%)", width: 280, height: 280, pointerEvents: "none", zIndex: 1 }} viewBox="0 0 260 260">
        {[0, 1, 2].map(i => (
          <circle key={i} cx="130" cy="130" r={60 + i * 28} style={{ fill: "none", stroke: "rgba(200,112,106,.1)", strokeWidth: 1, animation: `ring-pulse 4s ease-in-out ${1.5 + i * 0.7}s infinite`, transformOrigin: "130px 130px" }} />
        ))}
      </svg>

      {/* centered text content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", padding: "0 30px", position: "relative", zIndex: 10 }}>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <img
            src="/logo-afterbloom.png"
            alt="Afterbloom"
            style={{ width: 58, height: 58, objectFit: "contain", marginBottom: 18 }}
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}>
          <div style={{ fontSize: 29, fontWeight: 700, color: "#2A1815", lineHeight: 1.15, letterSpacing: "-0.01em" }}>
            {t.onboarding.finishing.welcomeTo}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95 }}>
          <div style={{ fontFamily: S, fontStyle: "italic", fontWeight: 500, fontSize: 38, color: "#C8706A", lineHeight: 1.1, letterSpacing: "-0.015em", marginBottom: 18 }}>
            Afterbloom.
          </div>
        </motion.div>
        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
          style={{ fontSize: 15, fontWeight: 300, color: "#7A5A55", lineHeight: 1.65, maxWidth: 240, marginBottom: 28 }}>
          {t.onboarding.welcome.tagline}
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.55 }}
          style={{ display: "flex", gap: 7 }}>
          {["#C8706A","#D89088","#EAD8D2","#EAD8D2","#EAD8D2"].map((c, i) => (
            <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: c }} />
          ))}
        </motion.div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.45 }}
        style={{ position: "relative", zIndex: 10, padding: "0 24px 44px", display: "flex", flexDirection: "column", gap: 12 }}
      >
        <WelcomeBtn initialErrorCode={initialErrorCode} />
      </motion.div>
    </div>
  );
}

// ── consent gate: PDPA health-data sharing ──────────────────────────────────────

function StepConsent({ onAgree, onSkip, onBack }) {
  const { t } = useLang();
  const c = t.onboarding.consent;
  const items = Array.isArray(c?.items) ? c.items : [];
  const scrollRef = useRef(null);
  const [readEnd, setReadEnd] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    // Enable once the list is read to the bottom (or when it isn't scrollable at all).
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 24) setReadEnd(true);
  };

  useEffect(() => {
    // If everything already fits without scrolling, don't gate the button.
    const el = scrollRef.current;
    if (el && el.scrollHeight - el.clientHeight < 24) setReadEnd(true);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#FBF6F0", fontFamily: F }}>
      <StepHeader onBack={onBack} step={0} total={0} />

      <div style={{ padding: "8px 26px 4px" }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C8706A", marginBottom: 14 }}>
          {c?.eyebrow}
        </div>
        <div style={{ fontFamily: S, fontWeight: 500, fontSize: 30, lineHeight: 1.12, letterSpacing: "-0.01em", color: "#3E342C", marginBottom: 8 }}>
          {c?.title}
          <em style={{ display: "block", fontStyle: "italic", color: "#AF636A" }}>{c?.titleItalic}</em>
        </div>
        <div style={{ fontSize: 13.5, color: "#786A5C", marginBottom: 14, lineHeight: 1.6 }}>
          {c?.subtitle}
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        style={{ flex: 1, minHeight: 0, padding: "2px 26px 8px", overflowY: "auto", WebkitOverflowScrolling: "touch", overscrollBehavior: "contain", display: "flex", flexDirection: "column", gap: 10 }}
      >
        {items.map((text, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, background: "#fff", border: "1px solid #EFE6DC", borderRadius: 14, padding: "15px 16px", boxShadow: "0 2px 6px rgba(80,56,42,.04)" }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, background: "#F6E2E1", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1 }}>
              <svg viewBox="0 0 24 24" width="12" fill="none" stroke="#AF636A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
            </div>
            <div style={{ flex: 1, fontSize: 13, color: "#4A3F38", lineHeight: 1.55 }}>{text}</div>
          </div>
        ))}
        <div style={{ fontSize: 11.5, color: "#9E938B", lineHeight: 1.55, padding: "4px 2px 2px" }}>
          {c?.footer}
        </div>
      </div>

      <div style={{ padding: "14px 26px 40px", display: "flex", flexDirection: "column", gap: 10, background: "linear-gradient(to top, #FBF6F0 70%, rgba(251,246,240,0))" }}>
        <AnimatePresence>
          {!readEnd && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 11.5, fontWeight: 600, color: "#B0A093" }}
            >
              <svg viewBox="0 0 24 24" width="13" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 9l6 6 6-6" /></svg>
              {c?.readHint}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          className="ci-btn"
          onClick={readEnd ? onAgree : undefined}
          animate={{ opacity: readEnd ? 1 : 0.45 }}
          transition={{ duration: 0.15 }}
          style={{ cursor: readEnd ? "pointer" : "default", pointerEvents: readEnd ? "auto" : "none" }}
        >
          {c?.agreeAll}
        </motion.button>
        <button
          onClick={onSkip}
          style={{ background: "none", border: 0, cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "#B0A8A4", fontFamily: F, padding: "2px 0" }}
        >
          {c?.skip}
        </button>
      </div>
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

function StepBirthDate({ value, onChange, onNext, onBack }) {
  const [confirming, setConfirming] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const { t } = useLang();

  useEffect(() => {
    if (!confirming) { setCountdown(3); return; }
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(timer); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [confirming]);

  const handleContinue = () => {
    if (value) { setConfirming(true); }
    else return;
  };

  const days = daysSince(value);
  const getDayLabel = () => {
    if (days === 0) return t.onboarding.step1.dayToday;
    const dayNum = days + 1;
    const template = days === 1 ? t.onboarding.step1.daysAgo : t.onboarding.step1.daysAgoPlural;
    return template.replace('{{day}}', dayNum).replace('{{n}}', days);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#FBF6F0", fontFamily: F }}>
      <StepHeader onBack={onBack} step={1} total={5} />

      <div style={{ flex: 1, padding: "24px 26px 0", display: "flex", flexDirection: "column", overflowY: "auto", overscrollBehavior: "contain" }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#B8C9B0", marginBottom: 16 }}>
          {t.onboarding.step1.step}
        </div>
        <div style={{ fontFamily: S, fontWeight: 500, fontSize: 30, lineHeight: 1.12, letterSpacing: "-0.01em", color: "#3E342C", marginBottom: 10 }}>
          {t.onboarding.step1.title}
          <em style={{ display: "block", fontStyle: "italic", color: "#AF636A" }}>{t.onboarding.step1.titleItalic}</em>
        </div>
        <div style={{ fontSize: 13.5, color: "#786A5C", marginBottom: 28, lineHeight: 1.6 }}>
          {t.onboarding.step1.subtitle}
        </div>

        <DatePicker value={value} onChange={v => { onChange(v); setConfirming(false); }} />

      </div>

      <div style={{ padding: "20px 26px 44px" }}>
        <button className="ci-btn" onClick={handleContinue} disabled={!value} style={{ opacity: value ? 1 : 0.45, cursor: value ? "pointer" : "default" }}>{t.onboarding.step1.continue}</button>
      </div>

      {/* ── Confirm date popup ── */}
      <AnimatePresence>
        {confirming && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setConfirming(false)}
              style={{ position: "absolute", inset: 0, background: "rgba(62,52,44,.35)", zIndex: 10 }}
            />
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: "spring", stiffness: 380, damping: 34 }}
              style={{
                position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 11,
                background: "#FBF6F0", borderRadius: "18px 18px 0 0",
                padding: "28px 26px 44px",
                boxShadow: "0 -8px 32px rgba(80,56,42,.12)",
              }}
            >
              <div style={{ width: 36, height: 4, borderRadius: 18, background: "#E6DBCF", margin: "0 auto 24px" }} />
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#786A5C", marginBottom: 14 }}>
                {t.onboarding.step1.confirm}
              </div>
              <div style={{ background: "#fff", border: "1px solid #EFE6DC", borderRadius: 12, padding: "18px 20px", marginBottom: 20, boxShadow: "0 2px 8px rgba(80,56,42,.05)" }}>
                <div style={{ fontFamily: S, fontSize: 26, fontWeight: 500, color: "#3E342C", marginBottom: 6 }}>
                  {formatDate(value)}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#C77E83", boxShadow: "0 0 0 3px #F6E2E1" }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#9A4C53" }}>
                    {getDayLabel()}
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
                    {t.onboarding.step1.yesCorrect}
                  </span>
                </span>
              </motion.button>
              <button
                onClick={() => setConfirming(false)}
                style={{ width: "100%", background: "none", border: 0, fontSize: 13, fontWeight: 600, color: "#786A5C", cursor: "pointer", fontFamily: F, padding: "4px 0" }}
              >
                {t.onboarding.step1.changeDate}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── step 2: name ──────────────────────────────────────────────────────────────

function StepIdentity({ firstName, lastName, phone, onChange, onNext, onBack }) {
  const { t } = useLang();
  const canContinue = firstName.trim() && lastName.trim() && phone.trim();
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#FBF6F0", fontFamily: F }}>
      <StepHeader onBack={onBack} step={2} total={5} />

      <div style={{ flex: 1, padding: "28px 26px 0", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#B8C9B0", marginBottom: 16 }}>
          {t.onboarding.step2.step}
        </div>
        <div style={{ fontFamily: S, fontWeight: 500, fontSize: 30, lineHeight: 1.12, letterSpacing: "-0.01em", color: "#3E342C", marginBottom: 10 }}>
          {t.onboarding.step2.title}
          <em style={{ display: "block", fontStyle: "italic", color: "#AF636A" }}>{t.onboarding.step2.titleItalic}</em>
        </div>
        <div style={{ fontSize: 13.5, color: "#786A5C", marginBottom: 18, lineHeight: 1.6 }}>
          {t.onboarding.step2.subtitle}
        </div>

        <input
          type="text"
          placeholder={t.onboarding.step2.firstNamePlaceholder}
          maxLength={40}
          value={firstName}
          onChange={e => onChange("firstName", e.target.value)}
          onFocus={e => e.target.style.borderColor = "#C77E83"}
          onBlur={e => e.target.style.borderColor = "#EFE6DC"}
          style={{ ...inputStyle }}
          autoFocus
        />

        <input
          type="text"
          placeholder={t.onboarding.step2.lastNamePlaceholder}
          maxLength={40}
          value={lastName}
          onChange={e => onChange("lastName", e.target.value)}
          onFocus={e => e.target.style.borderColor = "#C77E83"}
          onBlur={e => e.target.style.borderColor = "#EFE6DC"}
          style={{ ...inputStyle }}
        />

        <input
          type="tel"
          placeholder={t.onboarding.step2.phonePlaceholder}
          maxLength={20}
          value={phone}
          onChange={e => onChange("phone", e.target.value)}
          onFocus={e => e.target.style.borderColor = "#C77E83"}
          onBlur={e => e.target.style.borderColor = "#EFE6DC"}
          style={{ ...inputStyle }}
        />

        <div style={{ marginTop: 12, fontSize: 11.5, color: "#C8BEB8", lineHeight: 1.5 }}>
          {t.onboarding.step2.hint}
        </div>
      </div>

      <div style={{ padding: "20px 26px 44px" }}>
        <motion.button
          className="ci-btn"
          onClick={canContinue ? onNext : undefined}
          animate={{ opacity: canContinue ? 1 : 0.45 }}
          style={{ cursor: canContinue ? "pointer" : "default", pointerEvents: canContinue ? "auto" : "none" }}
        >
          {t.onboarding.step2.continue}
        </motion.button>
      </div>
    </div>
  );
}

function StepPreferredName({ value, onChange, onNext, onBack }) {
  const { t } = useLang();
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#FBF6F0", fontFamily: F }}>
      <StepHeader onBack={onBack} step={3} total={5} />

      <div style={{ flex: 1, padding: "28px 26px 0", display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#B8C9B0", marginBottom: 16 }}>
          {t.onboarding.step3.step}
        </div>
        <div style={{ fontFamily: S, fontWeight: 500, fontSize: 30, lineHeight: 1.12, letterSpacing: "-0.01em", color: "#3E342C", marginBottom: 10 }}>
          {t.onboarding.step3.title}
          <em style={{ display: "block", fontStyle: "italic", color: "#AF636A" }}>{t.onboarding.step3.titleItalic}</em>
        </div>
        <div style={{ fontSize: 13.5, color: "#786A5C", marginBottom: 32, lineHeight: 1.6 }}>
          {t.onboarding.step3.subtitle}
        </div>

        <input
          type="text"
          placeholder={t.onboarding.step3.placeholder}
          maxLength={30}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={e => e.target.style.borderColor = "#C77E83"}
          onBlur={e => e.target.style.borderColor = "#EFE6DC"}
          style={{ ...inputStyle }}
          autoFocus
        />

        <div style={{ marginTop: 12, fontSize: 11.5, color: "#C8BEB8", lineHeight: 1.5 }}>
          {t.onboarding.step3.hint}
        </div>
      </div>

      <div style={{ padding: "20px 26px 44px" }}>
        <button className="ci-btn" onClick={value.trim() ? onNext : undefined} disabled={!value.trim()} style={{ opacity: value.trim() ? 1 : 0.45, cursor: value.trim() ? "pointer" : "default" }}>{t.onboarding.step3.continue}</button>
      </div>
    </div>
  );
}

// ── step 3: child number ──────────────────────────────────────────────────────

const CHILD_OPTIONS = [
  {
    val: "first",
    title: "My first baby",
    sub: "Everything is new — and that's okay.",
    svg: (
      <svg viewBox="0 0 36 36" fill="none" width="24" height="24">
        <circle cx="18" cy="12" r="5.5" fill="#C77E83" opacity=".9"/>
        <path d="M8 30c0-5.52 4.48-10 10-10s10 4.48 10 10" stroke="#C77E83" strokeWidth="2.2" strokeLinecap="round" opacity=".6"/>
        <circle cx="26" cy="10" r="3" fill="#F4A8A8" opacity=".7"/>
      </svg>
    ),
  },
  {
    val: "subsequent",
    title: "I've been here before",
    sub: "Each baby brings a new journey.",
    svg: (
      <svg viewBox="0 0 36 36" fill="none" width="24" height="24">
        <circle cx="13" cy="13" r="5" fill="#C77E83" opacity=".9"/>
        <circle cx="24" cy="11" r="3.5" fill="#C77E83" opacity=".5"/>
        <path d="M4 30c0-4.97 4.03-9 9-9s9 4.03 9 9" stroke="#C77E83" strokeWidth="2.2" strokeLinecap="round" opacity=".6"/>
        <path d="M22 28c0-3.31 2.69-6 6-6" stroke="#C77E83" strokeWidth="2" strokeLinecap="round" opacity=".4"/>
      </svg>
    ),
  },
  {
    val: "unsure",
    title: "I'd rather not say",
    sub: "That's okay too.",
    svg: (
      <svg viewBox="0 0 36 36" fill="none" width="24" height="24">
        <circle cx="18" cy="18" r="14" stroke="#C77E83" strokeWidth="2.2" opacity=".5"/>
        <path d="M18 13v6M18 24h.01" stroke="#C77E83" strokeWidth="2.4" strokeLinecap="round" opacity=".7"/>
      </svg>
    ),
  },
];

function StepChildNumber({ value, onChange, onNext, onBack }) {
  const { t } = useLang();
  const childOptions = CHILD_OPTIONS.map((opt, i) => ({ ...opt, ...t.onboarding.step4.options[i] }));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#FBF6F0", fontFamily: F }}>
      <StepHeader onBack={onBack} step={4} total={5} />

      <div style={{ flex: 1, padding: "28px 26px 0", display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#B8C9B0", marginBottom: 16 }}>
          {t.onboarding.step4.step}
        </div>
        <div style={{ fontFamily: S, fontWeight: 500, fontSize: 30, lineHeight: 1.12, letterSpacing: "-0.01em", color: "#3E342C", marginBottom: 10 }}>
          {t.onboarding.step4.title}
          <em style={{ display: "block", fontStyle: "italic", color: "#AF636A" }}>{t.onboarding.step4.titleItalic}</em>
        </div>
        <div style={{ fontSize: 13.5, color: "#786A5C", marginBottom: 32, lineHeight: 1.6 }}>
          {t.onboarding.step4.subtitle}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {childOptions.map(opt => {
            const on = value === opt.val;
            return (
              <motion.button
                key={opt.val}
                onClick={() => onChange(opt.val)}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 420, damping: 22 }}
                style={{
                  display: "flex", alignItems: "center", gap: 18,
                  padding: "20px 20px",
                  background: on ? "#FBEDEC" : "#fff",
                  border: `1.5px solid ${on ? "#C77E83" : "#EFE6DC"}`,
                  borderRadius: 14, cursor: "pointer", textAlign: "left",
                  fontFamily: F, width: "100%",
                  boxShadow: on ? "0 4px 16px rgba(199,126,131,.14)" : "0 2px 8px rgba(80,56,42,.04)",
                  transition: "border-color 0.15s, background 0.15s, box-shadow 0.15s",
                }}
              >
                <motion.div
                  animate={{ scale: on ? 1.08 : 1, background: on ? "#F6E2E1" : "#F4EEE8" }}
                  transition={{ type: "spring", stiffness: 420, damping: 22 }}
                  style={{
                    width: 48, height: 48, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {opt.svg}
                </motion.div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15.5, fontWeight: 700, color: on ? "#AF636A" : "#3E342C", marginBottom: 4, transition: "color 0.15s" }}>
                    {opt.title}
                  </div>
                  <div style={{ fontSize: 12.5, color: "#786A5C", lineHeight: 1.45 }}>
                    {opt.sub}
                  </div>
                </div>

                <AnimatePresence>
                  {on && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 22 }}
                      style={{
                        width: 24, height: 24, borderRadius: "50%",
                        background: "#C77E83",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="13" fill="none" stroke="white" strokeWidth="2.8">
                        <path d="M5 13l4 4L19 7"/>
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: "20px 26px 44px", display: "flex", flexDirection: "column", gap: 12 }}>
        <motion.button
          className="ci-btn"
          onClick={value ? onNext : undefined}
          animate={{ opacity: value ? 1 : 0.45 }}
          style={{ cursor: value ? "pointer" : "default", pointerEvents: value ? "auto" : "none" }}
        >
          {t.onboarding.step4.continue}
        </motion.button>
        <button
          onClick={onNext}
          style={{ background: "none", border: 0, cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "#B0A8A4", fontFamily: F, padding: "2px 0" }}
        >
          {t.onboarding.step4.skip}
        </button>
      </div>
    </div>
  );
}

// ── step 4: reminder ──────────────────────────────────────────────────────────

const REMINDER_OPTIONS = [
  { val: "morning", label: "Morning" },
  { val: "afternoon", label: "Afternoon" },
  { val: "evening", label: "Evening" },
  { val: "before_bed", label: "Before bed" },
  { val: "self", label: "I'll check in myself" },
];

function StepReminder({ value, onChange, onSave, onBack, onSkip }) {
  const { t } = useLang();
  const reminderOptions = REMINDER_OPTIONS.map((opt, i) => ({ ...opt, label: t.onboarding.step5.options[i]?.label ?? opt.label }));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#FBF6F0", fontFamily: F }}>
      <StepHeader onBack={onBack} step={5} total={5} />

      <div style={{ flex: 1, padding: "28px 26px 0", display: "flex", flexDirection: "column", overflowY: "auto", overscrollBehavior: "contain" }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#B8C9B0", marginBottom: 16 }}>
          {t.onboarding.step5.step}
        </div>
        <div style={{ fontFamily: S, fontWeight: 500, fontSize: 30, lineHeight: 1.12, letterSpacing: "-0.01em", color: "#3E342C", marginBottom: 10 }}>
          {t.onboarding.step5.title}
          <em style={{ display: "block", fontStyle: "italic", color: "#AF636A" }}>{t.onboarding.step5.titleItalic}</em>
        </div>
        <div style={{ fontSize: 13.5, color: "#786A5C", marginBottom: 28, lineHeight: 1.6 }}>
          {t.onboarding.step5.subtitle}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {reminderOptions.map((opt) => {
            const on = value === opt.val;
            return (
              <motion.button
                key={opt.val}
                onClick={() => onChange(opt.val)}
                whileTap={{ scale: 0.98 }}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", background: on ? "#FBEDEC" : "#fff", border: `1.5px solid ${on ? "#C77E83" : "#EFE6DC"}`, borderRadius: 12, cursor: "pointer", textAlign: "left", fontFamily: F, width: "100%", boxShadow: on ? "0 4px 14px rgba(199,126,131,.14)" : "0 2px 6px rgba(80,56,42,.04)" }}
              >
                <div style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0, background: on ? "#C77E83" : "#fff", border: on ? "none" : "1.5px solid #D6CEC8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {on && <svg viewBox="0 0 24 24" width="11" fill="none" stroke="white" strokeWidth="2.8"><path d="M5 13l4 4L19 7"/></svg>}
                </div>
                <div style={{ fontSize: 14, fontWeight: on ? 700 : 500, color: on ? "#AF636A" : "#3E342C" }}>{opt.label}</div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: "20px 26px 44px", display: "flex", flexDirection: "column", gap: 12 }}>
        <motion.button
          className="ci-btn"
          onClick={value ? onSave : undefined}
          animate={{ opacity: value ? 1 : 0.45 }}
          style={{ cursor: value ? "pointer" : "default", pointerEvents: value ? "auto" : "none" }}
        >
          {t.onboarding.step5.setReminder}
        </motion.button>
        <button
          onClick={onSkip}
          style={{ background: "none", border: 0, cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "#B0A8A4", fontFamily: F, padding: "2px 0" }}
        >
          {t.onboarding.step5.skip}
        </button>
      </div>
    </div>
  );
}

// ── step 5: ready ─────────────────────────────────────────────────────────────

function StepReady({ name, hasBirthDate, isFirstTimeMother, onDone }) {
  const { t } = useLang();
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: F }}>
      <div style={{ background: "#F2E4DE", padding: "0 28px 44px", position: "relative", overflow: "hidden", flexShrink: 0 }}>
        <div style={{ position: "relative", display: "inline-flex", margin: "24px 0 22px" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 9, fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#fff", background: "rgba(255,255,255,.25)", padding: "8px 16px", borderRadius: 18 }}>
            <svg viewBox="0 0 24 24" width="13" fill="none" stroke="currentColor" strokeWidth="2.8"><path d="M5 13l4 4L19 7"/></svg>
            {t.onboarding.step6.badge}
          </span>
        </div>
        <div style={{ fontFamily: S, fontWeight: 500, fontSize: 42, lineHeight: 1.0, letterSpacing: "-0.015em", color: "#4A2F2C", position: "relative" }}>
          {t.onboarding.step6.title}
          <em style={{ display: "block", fontStyle: "italic" }}>{name}.</em>
        </div>
      </div>

      <div style={{ flex: 1, background: "#FBF6F0", borderRadius: "18px 18px 0 0", marginTop: -16, padding: "28px 24px 40px", overflowY: "auto", overscrollBehavior: "contain", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ background: "#fff", border: "1px solid #EFE6DC", borderRadius: 14, padding: "18px 20px", boxShadow: "0 2px 8px rgba(80,56,42,.05)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#C77E83", flexShrink: 0, marginTop: 4, boxShadow: "0 0 0 4px #F6E2E1" }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#9A4C53", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
                {hasBirthDate ? t.onboarding.step6.personalised.label : t.onboarding.step6.day1.label}
              </div>
              <div style={{ fontSize: 13, color: "#786A5C", lineHeight: 1.55 }}>
                {isFirstTimeMother === true ? t.onboarding.step6.firstTimeBody : hasBirthDate ? t.onboarding.step6.personalised.body : t.onboarding.step6.day1.body}
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: "linear-gradient(150deg,#E7EFE8,#fff)", border: "1px solid #D8E6DB", borderRadius: 14, padding: "18px 20px" }}>
          <div style={{ fontFamily: S, fontStyle: "italic", fontSize: 16, color: "#577A62", lineHeight: 1.55, marginBottom: 8 }}>
            {t.onboarding.step6.quote}
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
          {t.onboarding.step6.cta}
          <svg viewBox="0 0 24 24" width="16" fill="none" stroke="currentColor" strokeWidth="2.3">
            <path d="M4 11l8-7 8 7"/><path d="M6 10v9h12v-9"/>
          </svg>
        </motion.button>
      </div>
    </div>
  );
}

// Brief completion bridge after the final CTA — gives a felt "setting up → arrived"
// moment before Home appears. Confirms the action; kept short. Reduced-motion shows
// everything done and moves on near-instantly.
function FinishingSetup({ name, reduceMotion, onWelcomeReady, onFadeOut }) {
  const { t } = useLang();
  const items = t.onboarding.finishing.items;
  const [done, setDone] = useState(reduceMotion ? items.length : 0);
  const [phase, setPhase] = useState("progress");

  useEffect(() => {
    let fadeT = null;
    const showWelcome = () => {
      setDone(items.length);
      setPhase("welcome");
      requestAnimationFrame(onWelcomeReady);
      fadeT = setTimeout(onFadeOut, reduceMotion ? 900 : 1850);
    };

    if (reduceMotion) {
      const welcomeT = setTimeout(showWelcome, 220);
      return () => { clearTimeout(welcomeT); clearTimeout(fadeT); };
    }
    const start = 360, step = 460;
    const ticks = items.map((_, i) => setTimeout(() => setDone(i + 1), start + i * step));
    const welcomeT = setTimeout(showWelcome, start + items.length * step + 720);
    return () => { ticks.forEach(clearTimeout); clearTimeout(welcomeT); clearTimeout(fadeT); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pct = Math.round((done / items.length) * 100);
  const complete = done === items.length;
  const welcome = phase === "welcome";

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: EASE_OUT_QUINT }}
      role="status"
      aria-live="polite"
      style={{ position: "absolute", inset: 0, zIndex: 5, background: "linear-gradient(160deg,#F2E4DE 0%,#FBF6F0 62%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 34px", fontFamily: F, textAlign: "center" }}
    >
      <AnimatePresence mode="wait">
        {welcome ? (
          <motion.div
            key="welcome"
            initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.12 : 0.55, ease: EASE_OUT_QUINT }}
            style={{ width: "100%", maxWidth: 300 }}
          >
            <div style={{ fontSize: 12, fontWeight: 800, color: "#9A4C53", marginBottom: 14 }}>
              {t.onboarding.finishing.everythingReady}
            </div>
            <div style={{ fontFamily: S, fontWeight: 500, fontSize: 39, lineHeight: 1.02, letterSpacing: "-0.015em", color: "#4A2F2C", textWrap: "balance" }}>
              {t.onboarding.finishing.welcomeTo}
              <em style={{ display: "block", fontStyle: "italic", color: "#AF636A" }}>Afterbloom.</em>
            </div>
            <div style={{ margin: "22px auto 0", width: 54, height: 3, borderRadius: 999, background: "#D9AAA9" }} />
          </motion.div>
        ) : (
          <motion.div
            key="progress"
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: EASE_OUT_QUINT }}
            style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            <motion.div
              initial={reduceMotion ? false : { scale: 0.82, opacity: 0 }}
              animate={{
                scale: complete && !reduceMotion ? 1.06 : 1,
                opacity: 1,
                color: complete ? "#577A62" : "#C77E83",
                boxShadow: complete ? "0 16px 34px rgba(87,122,98,.22)" : "0 12px 30px rgba(199,126,131,.26)",
              }}
              transition={{ duration: 0.5, ease: EASE_OUT_QUINT }}
              style={{ width: 64, height: 64, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 22, color: "#C77E83" }}
            >
              <AnimatePresence mode="wait">
                {complete ? (
                  <motion.svg
                    key="ready"
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.75 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.75 }}
                    transition={{ duration: 0.24, ease: EASE_OUT_QUINT }}
                    viewBox="0 0 24 24"
                    width="27"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </motion.svg>
                ) : (
                  <motion.svg
                    key="home"
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.75 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.75 }}
                    transition={{ duration: 0.24, ease: EASE_OUT_QUINT }}
                    viewBox="0 0 24 24"
                    width="26"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 11l8-7 8 7" />
                    <path d="M6 10v9h12v-9" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </motion.div>

            <div style={{ marginBottom: 26 }}>
              <div style={{ fontFamily: S, fontWeight: 500, fontSize: 25, lineHeight: 1.2, letterSpacing: "-0.01em", color: "#4A2F2C", marginBottom: 6 }}>
                {complete ? t.onboarding.finishing.dashboardReady : t.onboarding.finishing.gettingReady}
              </div>
              <div style={{ fontSize: 13.5, color: "#786A5C" }}>
                {complete ? t.onboarding.finishing.finalMoment.replace('{{name}}', name) : t.onboarding.finishing.almostHome.replace('{{name}}', name)}
              </div>
            </div>

            <div style={{ width: "100%", maxWidth: 264, height: 6, borderRadius: 999, background: "#ECDFD8", overflow: "hidden", marginBottom: 24 }}>
              <motion.div
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.45, ease: EASE_OUT_QUINT }}
                style={{ height: "100%", borderRadius: 999, background: "linear-gradient(90deg,#C77E83,#DBA0A2)" }}
              />
            </div>

            <div style={{ width: "100%", maxWidth: 264, display: "flex", flexDirection: "column", gap: 13 }}>
              {items.map((label, i) => {
                const itemComplete = i < done;
                return (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 11 }}>
                    <motion.div
                      animate={{ background: itemComplete ? "#577A62" : "#fff", borderColor: itemComplete ? "#577A62" : "#E0D5CC" }}
                      transition={{ duration: 0.25, ease: EASE_OUT_QUINT }}
                      style={{ width: 22, height: 22, borderRadius: "50%", border: "1.5px solid #E0D5CC", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                    >
                      {itemComplete && (
                        <motion.svg
                          initial={reduceMotion ? false : { scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 22 }}
                          viewBox="0 0 24 24" width="13" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </motion.svg>
                      )}
                    </motion.div>
                    <span style={{ fontSize: 13.5, fontWeight: itemComplete ? 700 : 500, color: itemComplete ? "#4A2F2C" : "#786A5C", transition: "color .2s" }}>{label}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── main ──────────────────────────────────────────────────────────────────────

export default function Onboarding({ onComplete, initialErrorCode, resumeOnboarding = false }) {
  useBodyScrollLock();
  const reduceMotion = useReducedMotion();

  const [step, setStep] = useState(resumeOnboarding ? 1 : 0);
  const [consent, setConsent] = useState(null); // health-data sharing consent (PDPA)
  const [birthDate, setBirthDate] = useState("");
  const [legalFirstName, setLegalFirstName] = useState("");
  const [legalLastName, setLegalLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [childNumber, setChildNumber] = useState("");
  const [reminderTime, setReminderTime] = useState(null);
  const [dir, setDir] = useState(1);
  const [finishing, setFinishing] = useState(false);
  const [dashboardReady, setDashboardReady] = useState(false);

  const go = (n) => { setDir(n > step ? 1 : -1); setStep(n); };

  // Map onboarding answers to the spec developer fields (Afterbloom_DailyCheckin_Spec §1).
  const toFirstTimeMother = (v) => (v === "first" ? true : v === "subsequent" ? false : null);

  const saveCompletion = () => {
    const data = {
      baby_birth_date: birthDate || null,
      legal_first_name: legalFirstName.trim(),
      legal_last_name: legalLastName.trim(),
      phone: phone.trim(),
      preferred_name: name.trim() || "",
      mother_name: name.trim() || "",
      is_first_time_mother: toFirstTimeMother(childNumber),
      preferred_checkin_time: reminderTime || null,
      health_data_consent: consent === true,
      consent_at: consent === true ? new Date().toISOString() : null,
    };
    saveOnboarding(data);
    syncProfile(data);
    setJustOnboarded();
  };

  const finish = () => {
    saveCompletion();
    onComplete();
  };

  const saveBehindWelcome = () => {
    saveCompletion();
  };

  const fadeToDashboard = () => {
    saveCompletion();
    setDashboardReady(true);
    requestAnimationFrame(onComplete);
  };

  const variants = {
    initial: { opacity: 0, x: dir * 30 },
    animate: { opacity: 1, x: 0 },
    exit:    { opacity: 0, x: dir * -30 },
  };

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.32, ease: EASE_OUT_QUINT } }}
      exit={
        dashboardReady
          ? { opacity: 0, transition: { duration: reduceMotion ? 0.18 : 2, ease: EASE_OUT_QUINT } }
          : reduceMotion
            ? { opacity: 0, transition: { duration: 0.15 } }
            : { opacity: 0, y: "100%", transition: { duration: 0.24, ease: EASE_OUT_QUINT } }
      }
      role="dialog"
      aria-modal="true"
      style={{ position: "fixed", inset: 0, zIndex: 60, background: "#FBF2EC", display: "flex", flexDirection: "column", maxWidth: 448, margin: "0 auto", fontFamily: F }}
    >
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
          {step === 0 && (
            <StepWelcome
              initialErrorCode={initialErrorCode}
            />
          )}
          {step === 1 && <StepConsent onAgree={() => { setConsent(true); go(2); }} onSkip={() => { setConsent(false); go(2); }} onBack={() => go(0)} />}
          {step === 2 && <StepBirthDate value={birthDate} onChange={setBirthDate} onNext={() => go(3)} onBack={() => go(1)} />}
          {step === 3 && (
            <StepIdentity
              firstName={legalFirstName}
              lastName={legalLastName}
              phone={phone}
              onChange={(field, value) => {
                if (field === "firstName") setLegalFirstName(value);
                if (field === "lastName") setLegalLastName(value);
                if (field === "phone") setPhone(value);
              }}
              onNext={() => go(4)}
              onBack={() => go(2)}
            />
          )}
          {step === 4 && <StepPreferredName value={name} onChange={setName} onNext={() => go(5)} onBack={() => go(3)} />}
          {step === 5 && <StepChildNumber value={childNumber} onChange={setChildNumber} onNext={() => go(6)} onBack={() => go(4)} />}
          {step === 6 && <StepReminder value={reminderTime} onChange={setReminderTime} onSave={() => go(7)} onBack={() => go(5)} onSkip={() => { setReminderTime(null); go(7); }} />}
          {step === 7 && <StepReady name={name.trim()} hasBirthDate={!!birthDate} isFirstTimeMother={toFirstTimeMother(childNumber)} onDone={() => setFinishing(true)} />}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {finishing && (
          <FinishingSetup
            key="finishing"
            name={name.trim() || legalFirstName.trim() || "there"}
            reduceMotion={reduceMotion}
            onWelcomeReady={saveBehindWelcome}
            onFadeOut={fadeToDashboard}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
