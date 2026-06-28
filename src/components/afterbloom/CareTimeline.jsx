import { getCurrentStage, STAGES } from "../../lib/user-data";

const F = "'Plus Jakarta Sans', system-ui, sans-serif";
const S = "'Newsreader', serif";

function segBg(i, activeIndex) {
  if (i < activeIndex - 1) return "#F6E2E1";
  if (i === activeIndex - 1) return "linear-gradient(90deg,#F6E2E1 50%,#E6DBCF 50%)";
  return "#E6DBCF";
}

export default function CareTimeline() {
  const stage = getCurrentStage();
  const { phase, desc, pct, stageIndex, days } = stage;

  // Sliding window: prev (done) -> current -> next (upcoming), so the
  // timeline scales to any number of stages without a fixed node list.
  const prev = STAGES[stageIndex - 1] || null;
  const current = STAGES[stageIndex];
  const next = STAGES[stageIndex + 1] || null;

  const nodes = [prev, current, next].filter(Boolean).map((s) => ({
    label: s.label,
    done: s === prev,
    current: s === current,
  }));
  const activeIndex = nodes.findIndex((node) => node.current);

  return (
    <div style={{
      background: "#fff", border: "1px solid #EFE6DC", borderRadius: 16,
      padding: "22px 22px 20px", boxShadow: "0 2px 12px rgba(80,56,42,.05)",
      fontFamily: F,
    }}>
      {/* top: week label + progress */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12.5, fontWeight: 800, color: "#7A453F" }}>
          Day {days} postpartum
        </span>
        <span style={{ fontSize: 11, fontWeight: 800, color: "#786A5C" }}>{pct}%</span>
      </div>

      {/* phase name — Newsreader */}
      <div style={{ fontFamily: S, fontWeight: 500, fontSize: 28, lineHeight: 1.15, letterSpacing: "-0.01em", color: "#3E342C", marginBottom: 6 }}>
        <em style={{ fontStyle: "italic", color: "#9A4C53" }}>{phase}</em>
      </div>

      {/* description */}
      <div style={{ fontSize: 12.5, color: "#786A5C", lineHeight: 1.5, marginBottom: 22 }}>
        {desc}
      </div>

      {/* divider */}
      <div style={{ height: 1, background: "#F5EFE8", marginBottom: 18 }} />

      {/* dot timeline */}
      <div style={{ display: "flex", alignItems: "center" }}>
        {nodes.flatMap((node, i) => {
          const items = [
            <div key={`node-${node.label}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0, width: 42 }}>
              <div style={
                node.current
                  ? { width: 20, height: 20, borderRadius: "50%", background: "#C77E83", boxShadow: "0 0 0 5px #F6E2E1", flexShrink: 0 }
                  : node.done
                  ? { width: 14, height: 14, borderRadius: "50%", background: "#F6E2E1", boxShadow: "0 0 0 1.5px #C77E83", flexShrink: 0 }
                  : { width: 14, height: 14, borderRadius: "50%", background: "#E6DBCF", flexShrink: 0 }
              } />
              <span style={{ fontSize: 9.5, fontWeight: 700, color: node.current ? "#9A4C53" : "#786A5C", textAlign: "center", whiteSpace: "nowrap" }}>
                {node.label}
              </span>
            </div>,
          ];
          if (i < nodes.length - 1) {
            items.push(<div key={`seg-${i}`} style={{ flex: 1, height: 2.5, borderRadius: 18, background: segBg(i, activeIndex) }} />);
          }
          return items;
        })}
      </div>
    </div>
  );
}

