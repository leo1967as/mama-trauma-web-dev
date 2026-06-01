import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function buildCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

// Mock slots per day-of-week (0=Sun, 1=Mon,...)
const SLOTS_BY_DOW = {
  1: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"],
  2: ["10:00 AM", "1:00 PM", "3:30 PM", "5:00 PM"],
  3: ["9:00 AM", "11:30 AM", "2:00 PM", "4:30 PM"],
  4: ["9:30 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"],
  5: ["10:00 AM", "12:00 PM", "2:30 PM"],
};

export default function StepSelectTime({ therapist, onNext, onBack }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const cells = buildCalendarDays(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const isToday = (d) =>
    d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  const isPast = (d) => {
    const cellDate = new Date(viewYear, viewMonth, d);
    const t = new Date(); t.setHours(0, 0, 0, 0);
    return cellDate < t;
  };

  const slots = selectedDate
    ? SLOTS_BY_DOW[new Date(viewYear, viewMonth, selectedDate).getDay()] || []
    : [];

  const canContinue = selectedDate && selectedSlot;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
      {/* Therapist mini banner */}
      <div className="flex items-center gap-3 bg-muted/40 rounded-2xl p-3.5">
        <div className={`w-10 h-10 ${therapist.bg} rounded-xl flex items-center justify-center text-xl`}>{therapist.avatar}</div>
        <div>
          <p className="text-sm font-bold text-foreground">{therapist.name}</p>
          <p className="text-xs text-muted-foreground">{therapist.specialty}</p>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-card rounded-3xl p-5 border border-border/40 shadow-sm">
        {/* Month nav */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="w-8 h-8 rounded-xl bg-muted/60 flex items-center justify-center hover:bg-muted transition-all">
            <ChevronLeft className="w-4 h-4 text-foreground" />
          </button>
          <span className="text-sm font-bold text-foreground">{MONTHS[viewMonth]} {viewYear}</span>
          <button onClick={nextMonth} className="w-8 h-8 rounded-xl bg-muted/60 flex items-center justify-center hover:bg-muted transition-all">
            <ChevronRight className="w-4 h-4 text-foreground" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map(d => (
            <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground py-1">{d}</div>
          ))}
        </div>

        {/* Date cells */}
        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((d, i) => {
            if (!d) return <div key={i} />;
            const past = isPast(d);
            const isSelected = selectedDate === d && viewMonth === viewMonth;
            const hasSlots = !!SLOTS_BY_DOW[new Date(viewYear, viewMonth, d).getDay()];
            return (
              <button
                key={i}
                disabled={past || !hasSlots}
                onClick={() => { setSelectedDate(d); setSelectedSlot(null); }}
                className={`relative mx-auto w-9 h-9 rounded-xl text-xs font-semibold transition-all flex items-center justify-center
                  ${isSelected ? "bg-primary text-primary-foreground shadow-md" : ""}
                  ${!isSelected && !past && hasSlots ? "hover:bg-muted text-foreground" : ""}
                  ${past || !hasSlots ? "text-muted-foreground/30 cursor-not-allowed" : ""}
                  ${isToday(d) && !isSelected ? "ring-2 ring-primary/40" : ""}
                `}
              >
                {d}
                {!past && hasSlots && !isSelected && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary/50" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-3xl p-5 border border-border/40 shadow-sm">
          <p className="text-sm font-semibold text-foreground mb-3">
            Available times — {MONTHS[viewMonth]} {selectedDate}
          </p>
          {slots.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">No slots available this day</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {slots.map((slot) => (
                <motion.button
                  key={slot}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                    selectedSlot === slot
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted/50 text-foreground hover:bg-muted"
                  }`}
                >
                  {slot}
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Next Button */}
      <button
        disabled={!canContinue}
        onClick={() => onNext({ date: `${MONTHS[viewMonth]} ${selectedDate}, ${viewYear}`, time: selectedSlot })}
        className={`w-full py-4 rounded-2xl text-sm font-bold transition-all ${
          canContinue
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        }`}
      >
        Continue
      </button>
    </motion.div>
  );
}