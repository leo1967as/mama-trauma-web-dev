import { useRef, useState } from "react";

// Ports the Button Final.html design to React
// States: idle → loading (1.2s) → done (0.8s) → idle → onCheckIn()

export default function CheckInBtn({ label = "Complete today's check-in", onCheckIn }) {
  const [phase, setPhase] = useState("idle"); // idle | loading | done
  const btnRef = useRef(null);
  const checkRef = useRef(null);

  const spawnRipple = (e) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = ((e.clientX ?? e.touches?.[0]?.clientX) ?? rect.left + rect.width / 2) - rect.left;
    const y = ((e.clientY ?? e.touches?.[0]?.clientY) ?? rect.top + rect.height / 2) - rect.top;
    const size = Math.max(rect.width, rect.height) * 1.6;
    const el = document.createElement("span");
    el.className = "ci-ripple";
    el.style.cssText = `width:${size}px;height:${size}px;left:${x - size / 2}px;top:${y - size / 2}px`;
    btn.appendChild(el);
    setTimeout(() => el.remove(), 650);
  };

  const handlePointerDown = (e) => {
    if (phase !== "idle") return;
    btnRef.current?.classList.add("pressing");
    spawnRipple(e);
    try { navigator.vibrate?.(7); } catch {}
  };

  const handlePointerUp = (e) => {
    if (phase !== "idle") return;
    btnRef.current?.classList.remove("pressing");
    setPhase("loading");

    // loading → done
    setTimeout(() => {
      setPhase("done");
      checkRef.current?.classList.add("draw");
      try { navigator.vibrate?.([12, 60, 20]); } catch {}

      // done → idle → open checkin
      setTimeout(() => {
        setPhase("idle");
        checkRef.current?.classList.remove("draw");
        onCheckIn?.();
      }, 900);
    }, 1200);
  };

  const handlePointerLeave = () => {
    if (phase === "idle") btnRef.current?.classList.remove("pressing");
  };

  return (
    <button
      ref={btnRef}
      className={`ci-btn${phase === "loading" ? " loading" : ""}${phase === "done" ? " done-state" : ""}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
    >
      {/* idle */}
      <div className="ci-btn__content">
        <svg className="ico" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9"/>
          <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/>
        </svg>
        {label}
      </div>

      {/* loading */}
      <div className="ci-btn__loading">
        <div className="ci-spinner" />
        <span style={{ fontSize: 13.5, fontWeight: 600, color: "rgba(255,255,255,.9)" }}>
          Opening check-in…
        </span>
      </div>

      {/* done */}
      <div className="ci-btn__done">
        <svg ref={checkRef} className="ci-checkmark" viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Ready
      </div>
    </button>
  );
}
