import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarHeart, Clock, Video, Phone, MessageCircle, Shield, CheckCircle2, Sparkles } from "lucide-react";

const modeIcons = { video: Video, phone: Phone, chat: MessageCircle };

export default function StepConfirm({ therapist, dateTime, duration, mode, onConfirm, onBack }) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const ModeIcon = modeIcons[mode?.id] || Video;

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setConfirmed(true);
    setTimeout(() => onConfirm(), 2200);
  };

  if (confirmed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-10 text-center space-y-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
          className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center"
        >
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </motion.div>
        <div>
          <p className="text-lg font-bold text-foreground">You're booked! 🎉</p>
          <p className="text-sm text-muted-foreground mt-1">A confirmation has been sent to your phone</p>
        </div>
        <div className="bg-muted/40 rounded-2xl px-5 py-3 text-xs text-muted-foreground space-y-1">
          <p className="font-semibold text-foreground">{therapist.name}</p>
          <p>{dateTime.date} · {dateTime.time}</p>
          <p>{duration.label} · {mode?.label}</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>You took a step for yourself today 💛</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-primary/10 to-calm-lavender rounded-3xl p-5 border border-primary/15 space-y-3">
        <p className="text-xs font-bold text-primary uppercase tracking-wider">Booking Summary</p>

        {/* Therapist */}
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 ${therapist.bg} rounded-2xl flex items-center justify-center text-2xl`}>{therapist.avatar}</div>
          <div>
            <p className="text-sm font-bold text-foreground">{therapist.name}</p>
            <p className="text-xs text-muted-foreground">{therapist.specialty}</p>
          </div>
        </div>

        <div className="border-t border-border/30 pt-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarHeart className="w-3.5 h-3.5" />
              <span>Date & Time</span>
            </div>
            <span className="text-xs font-semibold text-foreground">{dateTime.date} · {dateTime.time}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>Duration</span>
            </div>
            <span className="text-xs font-semibold text-foreground">{duration.label} · {duration.desc}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ModeIcon className="w-3.5 h-3.5" />
              <span>Session type</span>
            </div>
            <span className="text-xs font-semibold text-foreground">{mode?.label}</span>
          </div>
          <div className="flex items-center justify-between border-t border-border/30 pt-2 mt-2">
            <span className="text-xs font-bold text-foreground">Total</span>
            <span className="text-sm font-bold text-primary">{duration.price}</span>
          </div>
        </div>
      </div>

      {/* Note for therapist */}
      <div className="bg-card rounded-3xl p-5 border border-border/40 shadow-sm">
        <p className="text-sm font-semibold text-foreground mb-1">Add a note <span className="text-muted-foreground font-normal">(optional)</span></p>
        <p className="text-xs text-muted-foreground mb-3">Let your therapist know what you'd like to focus on</p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. I've been struggling with sleep and anxiety since birth..."
          rows={3}
          className="w-full bg-muted/30 rounded-2xl p-3.5 text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none leading-relaxed border border-transparent focus:border-primary/30 transition-colors"
        />
      </div>

      {/* Privacy */}
      <div className="flex items-start gap-2.5 bg-muted/40 rounded-2xl p-3.5">
        <Shield className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          Fully confidential. Your note is only shared with your therapist. 🌸
        </p>
      </div>

      {/* Confirm Button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleConfirm}
        disabled={loading}
        className="w-full py-4 rounded-2xl text-sm font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/25 flex items-center justify-center gap-2 disabled:opacity-70"
      >
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Confirming your session...
            </motion.div>
          ) : (
            <motion.span key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              Confirm Booking · {duration.price}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}