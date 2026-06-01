import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import BookingStepIndicator from "./BookingStepIndicator";
import StepSelectTime from "./StepSelectTime";
import StepSelectDuration from "./StepSelectDuration";
import StepConfirm from "./StepConfirm";

// Step 0 = therapist list (handled by parent), steps 1-3 handled here
export default function BookingFlow({ therapist, onClose, onDone }) {
  const [step, setStep] = useState(1); // 1=time, 2=duration, 3=confirm
  const [dateTime, setDateTime] = useState(null);
  const [duration, setDuration] = useState(null);
  const [mode, setMode] = useState(null);

  const stepTitles = {
    1: "Pick a date & time",
    2: "Choose duration",
    3: "Review & confirm",
  };

  const handleBack = () => {
    if (step === 1) onClose();
    else setStep((s) => s - 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
      className="fixed inset-0 bg-background z-50 flex flex-col"
    >
      {/* Top Bar */}
      <div className="max-w-md mx-auto w-full px-4 pt-4 pb-3 flex items-center gap-3 border-b border-border/30">
        <button
          onClick={handleBack}
          className="w-9 h-9 rounded-xl bg-muted/60 flex items-center justify-center hover:bg-muted transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <div className="flex-1">
          <p className="text-sm font-bold text-foreground">{stepTitles[step]}</p>
          <BookingStepIndicator currentStep={step} totalSteps={3} />
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-xl bg-muted/60 flex items-center justify-center hover:bg-muted transition-all"
        >
          <X className="w-4 h-4 text-foreground" />
        </button>
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-y-auto max-w-md mx-auto w-full px-4 py-4 pb-10">
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
            <StepSelectDuration
              key="duration"
              onNext={(d) => { setDuration(d.duration); setMode(d.mode); setStep(3); }}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <StepConfirm
              key="confirm"
              therapist={therapist}
              dateTime={dateTime}
              duration={duration}
              mode={mode}
              onConfirm={onDone}
              onBack={() => setStep(2)}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}