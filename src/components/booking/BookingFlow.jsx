import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import BookingStepIndicator from "./BookingStepIndicator";
import StepSelectTime from "./StepSelectTime";
import StepConfirm from "./StepConfirm";
import { FONT_BODY, COLORS, LAYERS, LAYOUT, EASE_OUT_QUINT } from "../../lib/theme.jsx";
import { useLang } from "../../lib/i18n";
import { useBodyScrollLock } from "../../hooks/use-body-scroll-lock";

// Step 0 = therapist list (handled by parent), steps 1-3 handled here
export default function BookingFlow({ therapist, onClose, onDone }) {
  useBodyScrollLock();
  const { t, lang } = useLang();
  const dialogRef = useRef(null);
  const [step, setStep] = useState(1); // 1=date/period, 2=confirmation
  const [dateTime, setDateTime] = useState(null);
  const reduceMotion = useReducedMotion();

  const stepTitles = {
    1: lang === "th" ? "เลือกวันที่และช่วงเวลา" : "Choose date and time",
    2: lang === "th" ? "ยืนยันคำขอนัดหมาย" : "Confirm request",
  };

  const handleBack = () => {
    if (step === 1) onClose();
    else setStep((s) => s - 1);
  };

  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  const navBtnStyle = {
    width: 44, height: 44, borderRadius: 12, background: COLORS.accentSoft,
    border: 0, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
  };

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.32, ease: EASE_OUT_QUINT } }}
      exit={reduceMotion ? { opacity: 0, transition: { duration: 0.15 } } : { opacity: 0, y: "100%", transition: { duration: 0.24, ease: EASE_OUT_QUINT } }}
      style={{ position: "fixed", inset: 0, background: "#FBF6F0", zIndex: LAYERS.flowOverlay, display: "flex", flexDirection: "column", fontFamily: FONT_BODY }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-flow-title"
      tabIndex={-1}
      ref={dialogRef}
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
      }}
    >
      {/* Top Bar */}
      <div style={{ maxWidth: 448, margin: "0 auto", width: "100%", padding: "16px 16px 12px", display: "flex", alignItems: "center", gap: 12, borderBottom: `1px solid ${COLORS.border}` }}>
        <button type="button" onClick={handleBack} style={navBtnStyle} aria-label={step === 1 ? t.therapy.booking.closeBooking : t.therapy.booking.backStep}>
          <ArrowLeft style={{ width: 16, height: 16, color: COLORS.heading }} />
        </button>
        <div style={{ flex: 1 }}>
          <p id="booking-flow-title" style={{ fontSize: 14, fontWeight: 800, color: COLORS.heading, fontFamily: FONT_BODY }}>{stepTitles[step]}</p>
          <p style={{ fontSize: 11.5, color: COLORS.muted, margin: "2px 0 6px" }}>{t.therapy.booking.with} {therapist.name}</p>
          <BookingStepIndicator currentStep={step} totalSteps={2} />
        </div>
        <button type="button" onClick={onClose} style={navBtnStyle} aria-label={t.therapy.booking.closeDialog}>
          <X style={{ width: 16, height: 16, color: COLORS.heading }} />
        </button>
      </div>

      {/* Step Content */}
      <div style={{ flex: 1, overflowY: "auto", overscrollBehavior: "contain", maxWidth: 448, margin: "0 auto", width: "100%", padding: `16px 16px ${LAYOUT.flowScrollPadding}` }}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <StepSelectTime
              key="time"
              therapist={therapist}
              onNext={(dt) => { setDateTime(dt); setStep(2); }}
              onBack={handleBack}
            />
          )}
          {step === 2 && (
            <StepConfirm
              key="confirm"
              therapist={therapist}
              dateTime={dateTime}
              onConfirm={onDone}
              onBack={() => setStep(1)}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
