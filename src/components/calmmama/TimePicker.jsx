import { useState } from "react";
import { motion } from "framer-motion";

const F = "'Plus Jakarta Sans', system-ui, sans-serif";
const S = "'Newsreader', serif";

const MINUTES = ["00", "15", "30", "45"];
const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));

// Convert HH:MM (24h) ↔ { hour12, minute, ampm }
function to12(val) {
  if (!val) return { h: 8, m: "00", ampm: "AM" };
  const [hStr, mStr] = val.split(":");
  const h24 = parseInt(hStr, 10);
  const ampm = h24 < 12 ? "AM" : "PM";
  let h12 = h24 % 12;
  if (h12 === 0) h12 = 12;
  return { h: h12, m: mStr || "00", ampm };
}

function to24(h, m, ampm) {
  let h24 = h % 12;
  if (ampm === "PM") h24 += 12;
  return `${String(h24).padStart(2, "0")}:${m}`;
}

export default function TimePicker({ value, onChange }) {
  const init = to12(value);
  const [hour, setHour] = useState(init.h);
  const [minute, setMinute] = useState(init.m);
  const [ampm, setAmpm] = useState(init.ampm);

  const update = (h, m, ap) => {
    onChange(to24(h, m, ap));
  };

  const prevHour = () => {
    const h = hour === 1 ? 12 : hour - 1;
    setHour(h); update(h, minute, ampm);
  };
  const nextHour = () => {
    const h = hour === 12 ? 1 : hour + 1;
    setHour(h); update(h, minute, ampm);
  };

  const setMin = (m) => { setMinute(m); update(hour, m, ampm); };
  const setAp = (ap) => { setAmpm(ap); update(hour, minute, ap); };

  return (
    <div style={{
      background: "#fff", border: "1px solid #EFE6DC", borderRadius: 20,
      padding: "20px 18px 18px", fontFamily: F,
      boxShadow: "0 2px 12px rgba(80,56,42,.05)",
    }}>

      {/* big time display */}
      <div style={{
        fontFamily: S, fontStyle: "italic",
        fontSize: 44, fontWeight: 500, letterSpacing: "-0.02em",
        color: "#3E342C", textAlign: "center", marginBottom: 20,
        lineHeight: 1,
      }}>
        {String(hour).padStart(2, "0")}
        <span style={{ color: "#C77E83", margin: "0 2px" }}>:</span>
        {minute}
        <span style={{ fontFamily: F, fontStyle: "normal", fontSize: 16, fontWeight: 700, color: "#9C8E83", marginLeft: 8 }}>{ampm}</span>
      </div>

      {/* hour carousel */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 18 }}>
        <motion.button
          onClick={prevHour}
          whileTap={{ scale: 0.88 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          style={{
            width: 40, height: 40, borderRadius: 12,
            background: "#FBF6F0", border: "1px solid #EFE6DC",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#9C8E83", fontSize: 16, fontWeight: 700,
          }}
        >‹</motion.button>

        {/* ghost hours */}
        {[-1, 0, 1].map(offset => {
          let h = ((hour - 1 + offset + 12) % 12) + 1;
          const isCenter = offset === 0;
          return (
            <motion.div
              key={offset}
              animate={{ scale: isCenter ? 1 : 0.82, opacity: isCenter ? 1 : 0.35 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              style={{
                width: isCenter ? 64 : 44, height: isCenter ? 52 : 44,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: isCenter ? "#C77E83" : "transparent",
                borderRadius: 14,
                fontFamily: F, fontSize: isCenter ? 24 : 18,
                fontWeight: isCenter ? 800 : 600,
                color: isCenter ? "#fff" : "#9C8E83",
                margin: "0 4px",
                transition: "background 0.2s",
              }}
            >
              {String(h).padStart(2, "0")}
            </motion.div>
          );
        })}

        <motion.button
          onClick={nextHour}
          whileTap={{ scale: 0.88 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          style={{
            width: 40, height: 40, borderRadius: 12,
            background: "#FBF6F0", border: "1px solid #EFE6DC",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#9C8E83", fontSize: 16, fontWeight: 700,
          }}
        >›</motion.button>
      </div>

      {/* minute pills */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C8BEB8", marginBottom: 8 }}>
          Minutes
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {MINUTES.map(m => (
            <motion.button
              key={m}
              onClick={() => setMin(m)}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
              style={{
                flex: 1, padding: "10px 0", borderRadius: 12,
                background: minute === m ? "#C77E83" : "#FBF6F0",
                border: `1px solid ${minute === m ? "#C77E83" : "#EFE6DC"}`,
                color: minute === m ? "#fff" : "#9C8E83",
                fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: F,
                transition: "background 0.15s, color 0.15s",
              }}
            >
              :{m}
            </motion.button>
          ))}
        </div>
      </div>

      {/* AM / PM toggle */}
      <div style={{ display: "flex", background: "#FBF6F0", borderRadius: 14, padding: 4, position: "relative" }}>
        <motion.div
          animate={{ x: ampm === "AM" ? 0 : "100%" }}
          transition={{ type: "spring", stiffness: 450, damping: 32 }}
          style={{
            position: "absolute", top: 4, left: 4, bottom: 4,
            width: "calc(50% - 4px)", borderRadius: 10,
            background: "#C77E83", boxShadow: "0 4px 12px rgba(175,99,106,.25)",
          }}
        />
        {["AM", "PM"].map(ap => (
          <button
            key={ap}
            onClick={() => setAp(ap)}
            style={{
              flex: 1, padding: "10px 0", background: "none", border: 0,
              fontSize: 13, fontWeight: 700, fontFamily: F,
              color: ampm === ap ? "#fff" : "#9C8E83",
              cursor: "pointer", position: "relative", zIndex: 1,
              transition: "color 0.2s",
            }}
          >
            {ap}
          </button>
        ))}
      </div>
    </div>
  );
}
