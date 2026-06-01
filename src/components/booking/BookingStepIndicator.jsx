export default function BookingStepIndicator({ currentStep, totalSteps = 4 }) {
  const labels = ["Therapist", "Date & Time", "Duration", "Confirm"];
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <div
            className={`h-1.5 rounded-full transition-all duration-400 ${
              i < currentStep
                ? "bg-primary w-6"
                : i === currentStep
                ? "bg-primary w-10"
                : "bg-border w-4"
            }`}
          />
        </div>
      ))}
      <span className="text-[10px] text-muted-foreground font-medium ml-1">
        {labels[currentStep]}
      </span>
    </div>
  );
}