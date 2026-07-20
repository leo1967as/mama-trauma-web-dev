import { COLORS } from "../../lib/theme.jsx";
import { useLang } from "../../lib/i18n";

export default function BookingStepIndicator({ currentStep, totalSteps = 3 }) {
  const { lang } = useLang();
  const labels = lang === "th" ? ["วันและเวลา", "การนัดหมาย", "ยืนยัน"] : ["Date & Time", "Session", "Confirm"];
  const stepIndex = Math.max(0, currentStep - 1);
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 6 }}
      role="status"
      aria-live="polite"
      aria-label={lang === "th" ? `ขั้นตอนการนัดหมาย ${currentStep} จาก ${totalSteps}: ${labels[stepIndex]}` : `Booking step ${currentStep} of ${totalSteps}: ${labels[stepIndex]}`}
    >
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            height: 6,
            borderRadius: 999,
            transition: "transform .2s ease, background .2s ease",
            width: 40,
            transform: `scaleX(${i < stepIndex ? 0.6 : i === stepIndex ? 1 : 0.4})`,
            transformOrigin: "left center",
            background: i <= stepIndex ? COLORS.accent : COLORS.border,
          }}
        />
      ))}
      <span style={{ fontSize: 10, color: COLORS.muted, fontWeight: 600, marginLeft: 4 }} aria-hidden="true">
        {labels[stepIndex]}
      </span>
    </div>
  );
}
