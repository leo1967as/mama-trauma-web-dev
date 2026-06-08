import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const F = "'Plus Jakarta Sans', system-ui, sans-serif";
const S = "'Newsreader', serif";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function toYMD(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}

export default function DatePicker({ value, onChange }) {
  const today = new Date();
  today.setHours(0,0,0,0);

  const initDate = value ? new Date(value + "T00:00:00") : today;
  const [viewYear,  setViewYear]  = useState(initDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initDate.getMonth());
  const [dir, setDir] = useState(1);

  const prevMonth = () => {
    setDir(-1);
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y-1); }
    else setViewMonth(m => m-1);
  };
  const nextMonth = () => {
    setDir(1);
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y+1); }
    else setViewMonth(m => m+1);
  };

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth+1, 0).getDate();
  const daysInPrev  = new Date(viewYear, viewMonth, 0).getDate();

  const cells = [];
  // previous month filler
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrev - i, thisMonth: false, date: new Date(viewYear, viewMonth-1, daysInPrev-i) });
  }
  // this month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, thisMonth: true, date: new Date(viewYear, viewMonth, d) });
  }
  // next month filler
  let fill = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ day: fill++, thisMonth: false, date: new Date(viewYear, viewMonth+1, fill-1) });
  }

  const selectedYMD = value || "";
  const todayYMD    = toYMD(today);

  return (
    <div style={{
      background: "#fff", border: "1px solid #EFE6DC", borderRadius: 20,
      padding: "16px 16px 12px", fontFamily: F,
      boxShadow: "0 2px 12px rgba(80,56,42,.05)", overflow: "hidden",
    }}>
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ fontFamily: S, fontStyle: "italic", fontSize: 18, fontWeight: 500, color: "#3E342C" }}>
          {MONTHS[viewMonth]} {viewYear}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[
            { label: "‹", action: prevMonth },
            { label: "›", action: nextMonth, disabled: viewYear === today.getFullYear() && viewMonth >= today.getMonth() },
          ].map(({ label, action, disabled }) => (
            <motion.button
              key={label}
              onClick={!disabled ? action : undefined}
              whileTap={!disabled ? { scale: 0.88 } : {}}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
              style={{
                width: 32, height: 32, borderRadius: 10,
                background: disabled ? "#F8F4F0" : "#FBF6F0",
                border: "1px solid #EFE6DC",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: disabled ? "default" : "pointer",
                color: disabled ? "#D0C8C2" : "#9C8E83",
                fontSize: 16, fontWeight: 700,
              }}
            >
              {label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* weekday headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 6 }}>
        {DAYS.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 800, color: "#C8BEB8", letterSpacing: "0.06em", padding: "2px 0" }}>
            {d}
          </div>
        ))}
      </div>

      {/* calendar grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${viewYear}-${viewMonth}`}
          initial={{ opacity: 0, x: dir * 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: dir * -20 }}
          transition={{ duration: 0.18 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "2px 0" }}
        >
          {cells.map((cell, idx) => {
            const ymd = toYMD(cell.date);
            const isFuture = cell.date > today;
            const isSelected = ymd === selectedYMD;
            const isToday = ymd === todayYMD;
            const inactive = !cell.thisMonth || isFuture;

            return (
              <motion.button
                key={idx}
                onClick={!inactive ? () => onChange(ymd) : undefined}
                whileTap={!inactive ? { scale: 0.85 } : {}}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                style={{
                  width: "100%", aspectRatio: "1",
                  border: isToday && !isSelected ? "1px solid #EAC8C6" : "1px solid transparent",
                  borderRadius: 10,
                  background: isSelected ? "#C77E83" : "transparent",
                  color: isSelected ? "#fff" : inactive ? "#D0C8C2" : isToday ? "#AF636A" : "#3E342C",
                  fontSize: 13, fontWeight: isSelected || isToday ? 800 : 500,
                  cursor: inactive ? "default" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.15s",
                }}
              >
                {cell.day}
              </motion.button>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* selected display */}
      {selectedYMD && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #F5EFE8", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: "#9C8E83" }}>
            {new Date(selectedYMD + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" })}
          </span>
          <button onClick={() => onChange("")} style={{ background: "none", border: 0, fontSize: 11, fontWeight: 700, color: "#C8BEB8", cursor: "pointer", fontFamily: F }}>
            Clear
          </button>
        </div>
      )}
    </div>
  );
}

