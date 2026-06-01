import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Video, Phone, MessageCircle, CheckCircle2 } from "lucide-react";

const durations = [
  { mins: 25, label: "25 min", desc: "Quick check-in", price: "$45", popular: false },
  { mins: 50, label: "50 min", desc: "Standard session", price: "$85", popular: true },
  { mins: 80, label: "80 min", desc: "Deep-dive session", price: "$130", popular: false },
];

const modes = [
  { id: "video", icon: Video, label: "Video Call" },
  { id: "phone", icon: Phone, label: "Phone Call" },
  { id: "chat", icon: MessageCircle, label: "Live Chat" },
];

export default function StepSelectDuration({ onNext, onBack }) {
  const [selectedDuration, setSelectedDuration] = useState(durations[1]);
  const [selectedMode, setSelectedMode] = useState("video");

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">

      {/* Duration Picker */}
      <div className="bg-card rounded-3xl p-5 border border-border/40 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-primary" />
          <p className="text-sm font-bold text-foreground">Session length</p>
        </div>
        <div className="space-y-2.5">
          {durations.map((d) => {
            const active = selectedDuration.mins === d.mins;
            return (
              <motion.button
                key={d.mins}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedDuration(d)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border-2 transition-all ${
                  active
                    ? "border-primary/40 bg-primary/8"
                    : "border-border/40 bg-muted/20 hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${active ? "bg-primary/15" : "bg-muted/60"}`}>
                    <Clock className={`w-4 h-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${active ? "text-foreground" : "text-foreground"}`}>{d.label}</span>
                      {d.popular && (
                        <span className="text-[10px] font-bold bg-primary/15 text-primary px-1.5 py-0.5 rounded-md">
                          Most popular
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{d.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${active ? "text-primary" : "text-muted-foreground"}`}>{d.price}</span>
                  {active && <CheckCircle2 className="w-4 h-4 text-primary" />}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Mode Picker */}
      <div className="bg-card rounded-3xl p-5 border border-border/40 shadow-sm">
        <p className="text-sm font-bold text-foreground mb-3">How would you like to connect?</p>
        <div className="flex gap-2">
          {modes.map((m) => {
            const Icon = m.icon;
            const active = selectedMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMode(m.id)}
                className={`flex-1 flex flex-col items-center gap-2 py-3.5 rounded-2xl border-2 transition-all ${
                  active ? "border-primary/40 bg-primary/8" : "border-border/40 bg-muted/20 hover:bg-muted/40"
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? "text-primary" : "text-muted-foreground"}`} strokeWidth={active ? 2.5 : 1.8} />
                <span className={`text-[10px] font-bold ${active ? "text-primary" : "text-muted-foreground"}`}>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => onNext({ duration: selectedDuration, mode: modes.find(m => m.id === selectedMode) })}
        className="w-full py-4 rounded-2xl text-sm font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20"
      >
        Continue
      </button>
    </motion.div>
  );
}