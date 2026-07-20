import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown, Eye, AlertCircle, Lightbulb, Sparkles, HeartPulse, ChevronRight, X } from "lucide-react";
import { CARE_JOURNEY_EN, CARE_JOURNEY_HOTLINE, CARE_JOURNEY_TH } from "../../lib/care-journey-data";
import { thShort, enShort } from "../../lib/care-journey-short-data";
import { isEpdsDue } from "../../lib/epds-data";
import { getCurrentStage, STAGES } from "../../lib/user-data";
import { useLang } from "../../lib/i18n";
import { EASE_OUT_QUINT, LAYERS } from "../../lib/theme.jsx";

const F = "'Plus Jakarta Sans', system-ui, sans-serif";
const S = "'Newsreader', serif";

function Collapse({ open, children }) {
  const reduceMotion = useReducedMotion();
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          key="content"
          initial={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1, transition: { duration: 0.32, ease: EASE_OUT_QUINT } }}
          exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0, transition: { duration: 0.22, ease: EASE_OUT_QUINT } }}
          style={{ overflow: "hidden" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Convert "• line" to a nice list
function BulletList({ text, isAlert = false }) {
  if (!text) return null;
  const parts = text.split("\n").filter(Boolean);
  const intro = parts[0].startsWith("•") ? null : parts[0];
  const bullets = parts.filter(p => p.startsWith("•")).map(p => p.replace("•", "").trim());

  return (
    <div style={{ color: "#51463D", fontSize: 13, lineHeight: 1.6 }}>
      {intro && <p style={{ margin: "0 0 10px" }}>{intro}</p>}
      {bullets.length > 0 && (
        <ul style={{ 
          margin: 0, 
          padding: 0, 
          listStyle: "none", 
          borderLeft: isAlert ? "2px solid #D9A7A7" : "none",
          paddingLeft: isAlert ? 14 : 0,
          marginLeft: isAlert ? 4 : 0,
          display: "flex",
          flexDirection: "column",
          gap: 10
        }}>
          {bullets.map((b, i) => (
            <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <span style={{ color: isAlert ? "#D9A7A7" : "#C77E83", fontSize: 18, lineHeight: "16px" }}>•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function CareTimeline({ mode = "full", onEpds, onNeedHelp, onNavigate }) {
  const { lang, t } = useLang();
  const cj = t.careJourney;
  const stage = getCurrentStage();
  const { pct, stageIndex, days } = stage;
  const journey = lang === "th" ? CARE_JOURNEY_TH : CARE_JOURNEY_EN;
  const shortJourney = lang === "th" ? thShort : enShort;
  const due = isEpdsDue();
  const rangeLabel = (item) => cj.ranges?.[item.range] ?? item.range;
  const hotlineText = lang === "th" ? CARE_JOURNEY_HOTLINE : cj.hotlineText;
  
  // Set initial open phase to the current stage index in full mode
  const [openPhaseIndex, setOpenPhaseIndex] = useState(mode === "full" ? stageIndex : null);
  const openPhaseButtonRef = useRef(null);
  
  const [fullPhaseIndex, setFullPhaseIndex] = useState(null);

  useEffect(() => {
    if (openPhaseIndex === null || !openPhaseButtonRef.current) return;
    const timer = window.setTimeout(() => {
      openPhaseButtonRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 320);
    return () => window.clearTimeout(timer);
  }, [openPhaseIndex]);

  const summary = (
    <div style={{ background: "#fff", border: "1px solid #EFE6DC", borderRadius: 16, padding: "22px 22px 20px", boxShadow: "0 2px 12px rgba(80,56,42,.05)", fontFamily: F }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12.5, fontWeight: 800, color: "#7A453F" }}>
          {t.home.cards.dayPostpartum.replace("{{day}}", days)}
        </span>
        <span style={{ fontSize: 11, fontWeight: 800, color: "#786A5C" }}>{pct}%</span>
      </div>
      <div style={{ fontFamily: S, fontWeight: 500, fontSize: 28, lineHeight: 1.15, color: "#3E342C", marginBottom: 6 }}>
        <em style={{ color: "#9A4C53" }}>{journey[stageIndex].title}</em>
      </div>
      <div style={{ fontSize: 12.5, color: "#786A5C", lineHeight: 1.5, marginBottom: 18 }}>{journey[stageIndex].feel}</div>
      {due && onEpds && (
        <button
          type="button"
          onClick={onEpds}
          style={{ width: "100%", marginBottom: 14, padding: 10, border: 0, borderRadius: 10, background: "#C77E83", color: "#fff", font: `700 13px ${F}`, cursor: "pointer" }}
        >
          {cj.startEpds}
        </button>
      )}
      <div aria-label={cj.progressAriaLabel} style={{ display: "flex", gap: 4, marginBottom: onNavigate ? 14 : 0 }}>
        {STAGES.map((item, index) => (
          <span key={item.maxDay} title={rangeLabel(CARE_JOURNEY_TH[index])} style={{ height: 4, flex: 1, borderRadius: 4, background: index <= stageIndex ? "#C77E83" : "#E6DBCF" }} />
        ))}
      </div>
      {onNavigate && (
        <button
          type="button"
          onClick={() => onNavigate("journey")}
          style={{ width: "100%", padding: "10px 0", borderRadius: 12, border: "1px solid #D9A7A7", background: "#FFF", color: "#8A4E51", font: `700 13px ${F}`, cursor: "pointer" }}
        >
          {cj.viewAll}
        </button>
      )}
    </div>
  );

  if (mode !== "full") return summary;

  const renderFullSheet = () => {
    if (fullPhaseIndex === null) return null;
    const item = journey[fullPhaseIndex];
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.2 } }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
        style={{ 
          position: "fixed", inset: 0, zIndex: LAYERS?.urgentOverlay || 1000, 
          background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", 
          justifyContent: "center", padding: "20px" 
        }}
        onClick={() => setFullPhaseIndex(null)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 26, stiffness: 260 } }}
          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
          onClick={(e) => e.stopPropagation()}
          className="mx-auto w-full max-w-md"
          style={{
            background: "#FBF6F0", borderRadius: 24,
            maxHeight: "85vh", display: "flex", flexDirection: "column",
            fontFamily: F, boxShadow: "0 10px 40px rgba(0,0,0,0.15)"
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px 12px", flexShrink: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <h2 style={{ fontSize: 24, fontFamily: S, fontWeight: 500, color: "#3E342C", margin: 0, lineHeight: 1.15, letterSpacing: "-0.01em" }}>
                  {rangeLabel(item)}
                </h2>
                <span style={{ background: "#EFE6DC", color: "#786A5C", fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 10 }}>
                  {lang === 'th' ? "ฉบับเต็ม" : "Full guide"}
                </span>
              </div>
              <div style={{ fontSize: 13.5, color: "#7A453F", fontWeight: 600 }}>
                {item.title}
              </div>
            </div>
            <button
              onClick={() => setFullPhaseIndex(null)}
              style={{ width: 36, height: 36, borderRadius: "50%", background: "#EFE6DC", border: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#6C5F56", cursor: "pointer", flexShrink: 0 }}
            >
              <X size={18} />
            </button>
          </div>
          
          {/* Content */}
          <div style={{ padding: "12px 24px 32px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 24, overscrollBehavior: "contain" }}>
            <section>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#3E342C", marginBottom: 12, fontSize: 13, fontWeight: 800, letterSpacing: "-0.01em" }}>
                <Eye size={16} color="#C77E83" /> What you might feel
              </div>
              <div style={{ color: "#51463D", fontSize: 13.5, lineHeight: 1.6 }}>
                {item.feel}
              </div>
            </section>
            <section>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#3E342C", marginBottom: 12, fontSize: 13, fontWeight: 800, letterSpacing: "-0.01em" }}>
                <Lightbulb size={16} color="#C77E83" /> Advice
              </div>
              <div style={{ color: "#51463D", fontSize: 13.5, lineHeight: 1.6 }}>
                {item.body}
              </div>
            </section>
            <section>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#3E342C", marginBottom: 12, fontSize: 13, fontWeight: 800, letterSpacing: "-0.01em" }}>
                <AlertCircle size={16} color="#D9A7A7" /> Watch out for
              </div>
              <BulletList text={item.watchOut} isAlert={true} />
            </section>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const sheetPortal = typeof document !== "undefined" ? createPortal(<AnimatePresence>{renderFullSheet()}</AnimatePresence>, document.body) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, fontFamily: F, paddingBottom: 24 }}>
      {journey.map((item, index) => {
        const isCurrent = index === stageIndex;
        const isOpen = openPhaseIndex === index;
        const shortItem = shortJourney[index];
        
        // Styling based on mockup
        const bgColor = isCurrent ? "#FFF7F5" : "#FFFFFF";
        const borderColor = isCurrent ? "#D9A7A7" : "#F0E8DF";
        const badgeColor = isCurrent ? "#D9A7A7" : "#F0E8DF";
        const badgeTextColor = isCurrent ? "#FFFFFF" : "#7A453F";

        return (
          <div key={item.range} style={{ background: bgColor, border: `1px solid ${borderColor}`, borderRadius: 20, padding: 16, transition: "all 0.3s ease" }}>
            {/* Header */}
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenPhaseIndex(isOpen ? null : index)}
              ref={isOpen ? openPhaseButtonRef : undefined}
              style={{ width: "100%", display: "flex", alignItems: "flex-start", gap: 12, border: 0, background: "transparent", cursor: "pointer", textAlign: "left", scrollMarginTop: "5vh", padding: 0 }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 12, background: badgeColor, color: badgeTextColor, fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                {index + 1}
              </div>
              <div style={{ flex: 1, paddingTop: 2 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 800, fontSize: 14, color: "#3E342C" }}>{rangeLabel(item)}</span>
                  {isCurrent && (
                    <span style={{ background: "#FFEDEF", color: "#C77E83", fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 10 }}>Now</span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: "#786A5C", marginTop: 2 }}>{item.title}</div>
              </div>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.22, ease: EASE_OUT_QUINT }}
                style={{ display: "flex", flexShrink: 0, color: "#C77E83", marginTop: 8 }}
              >
                <ChevronDown style={{ width: 16, height: 16 }} />
              </motion.div>
            </button>

            {/* Content */}
            <Collapse open={isOpen}>
              <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 20 }}>
                
                {/* WHAT YOU MIGHT FEEL (Pills) */}
                <section>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#3E342C", marginBottom: 12, fontSize: 13, fontWeight: 800, letterSpacing: "-0.01em" }}>
                    <Eye size={16} color="#C77E83" /> What you might feel
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {shortItem.feel.map((f, i) => (
                      <span key={i} style={{ background: isCurrent ? "#fff" : "#F9F5F1", padding: "6px 12px", borderRadius: 100, fontSize: 13, color: "#51463D", border: `1px solid ${isCurrent ? "#F0E8DF" : "transparent"}` }}>
                        {f}
                      </span>
                    ))}
                  </div>
                </section>
                
                {/* YOUR BODY (Pills) */}
                <section>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#3E342C", marginBottom: 12, fontSize: 13, fontWeight: 800, letterSpacing: "-0.01em" }}>
                    <Lightbulb size={16} color="#C77E83" /> Your body
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {shortItem.body.map((b, i) => (
                      <span key={i} style={{ background: isCurrent ? "#fff" : "#F9F5F1", padding: "6px 12px", borderRadius: 100, fontSize: 13, color: "#51463D", border: `1px solid ${isCurrent ? "#F0E8DF" : "transparent"}` }}>
                        {b}
                      </span>
                    ))}
                  </div>
                </section>

                {/* WATCH OUT FOR (List) */}
                <section>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#3E342C", marginBottom: 12, fontSize: 13, fontWeight: 800, letterSpacing: "-0.01em" }}>
                    <AlertCircle size={16} color="#D9A7A7" /> Watch out for
                  </div>
                  <BulletList text={shortItem.watchOut.map(w => "• " + w).join('\n')} isAlert={true} />
                </section>

                {/* TRY THIS TODAY (List) */}
                <section>
                  <div style={{ background: "#FFEDEF", borderRadius: 14, padding: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#9A4C53", marginBottom: 12, fontSize: 13, fontWeight: 800, letterSpacing: "-0.01em" }}>
                      <Sparkles size={16} /> Tips / Self-care
                    </div>
                    <BulletList text={shortItem.tips.map(t => "• " + t).join('\n')} />
                  </div>
                </section>

                {/* READ FULL VERSION BUTTON */}
                <button
                  type="button"
                  onClick={() => setFullPhaseIndex(index)}
                  style={{ width: "100%", padding: 14, borderRadius: 12, background: isCurrent ? "#fff" : "#FBF6F0", border: `1px solid ${isCurrent ? "#D9A7A7" : "#EFE6DC"}`, color: "#C77E83", font: `700 13px ${F}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> 
                  {lang === 'th' ? "อ่านเวอร์ชันเต็ม" : "Read full version"} <ChevronRight size={14} />
                </button>

                {/* EPDS PROMPT */}
                {item.epdsPrompt && (
                  <div style={{ borderRadius: 14, padding: 16, background: "#F8F0E8", color: "#51463D", fontSize: 12.5, lineHeight: 1.55 }}>
                    📋 {item.epdsPrompt}
                    {due && onEpds && (
                      <button
                        type="button"
                        onClick={onEpds}
                        style={{ width: "100%", marginTop: 12, padding: 10, border: 0, borderRadius: 10, background: "#C77E83", color: "#fff", font: `700 13px ${F}`, cursor: "pointer" }}
                      >
                        {cj.startEpds}
                      </button>
                    )}
                  </div>
                )}
                
                {/* MOOD PROMPT */}
                {cj.moodPrompt && (
                  <div style={{ borderRadius: 14, padding: 16, background: "#fff", border: "1px solid #F0E8DF" }}>
                    <strong style={{ display: "block", color: "#7A453F", fontSize: 13, marginBottom: 4 }}>{cj.moodPrompt.title}</strong>
                    <p style={{ margin: "0 0 12px", color: "#51463D", fontSize: 12.5, lineHeight: 1.5 }}>
                      {cj.moodPrompt.body}
                    </p>
                    <button
                      type="button"
                      onClick={() => onNavigate && onNavigate("mood")}
                      style={{ width: "100%", padding: 10, border: 0, borderRadius: 10, background: "#C77E83", color: "#fff", font: `700 12px ${F}`, cursor: "pointer" }}
                    >
                      {cj.moodPrompt.cta}
                    </button>
                  </div>
                )}

                {/* ACTIONS */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
                  <button
                    type="button"
                    onClick={onNeedHelp}
                    style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: 14, borderRadius: 12, background: isCurrent ? "#fff" : "#FFF7F5", border: "1px solid #F0E8DF", color: "#8A4E51", font: `700 13px ${F}`, cursor: "pointer" }}
                  >
                    <HeartPulse size={16} /> I need help
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenPhaseIndex(null)}
                    style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: 14, borderRadius: 12, background: "transparent", color: "#C77E83", font: `700 13px ${F}`, cursor: "pointer" }}
                  >
                    Close <ChevronDown size={14} style={{ transform: "rotate(180deg)" }} />
                  </button>
                </div>

              </div>
            </Collapse>
          </div>
        );
      })}

      <footer style={{ marginTop: 12, borderRadius: 16, padding: 20, background: "#7A453F", color: "#fff", fontSize: 13, lineHeight: 1.6 }}>
        <strong style={{ display: "block", fontSize: 15 }}>{cj.hotlineTitle}</strong>
        {hotlineText}
        <button type="button" onClick={onNeedHelp} style={{ display: "block", marginTop: 12, border: "1px solid #fff", borderRadius: 10, padding: "10px 14px", background: "transparent", color: "#fff", font: `700 12px ${F}`, cursor: "pointer" }}>
          {cj.needHelp}
        </button>
      </footer>
      
      {sheetPortal}
    </div>
  );
}
