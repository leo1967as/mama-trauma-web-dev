const F = "'Plus Jakarta Sans', system-ui, sans-serif";
const S = "'Newsreader', serif";

const nodes = [
  { label: "Day 1",  done: true },
  { label: "Day 3",  done: true },
  { label: "Day 7",  current: true },
  { label: "Week 2" },
  { label: "Week 4" },
];

function segBg(i) {
  if (i <= 1) return "#F6E2E1";
  if (i === 2) return "linear-gradient(90deg,#F6E2E1 50%,#E6DBCF 50%)";
  return "#E6DBCF";
}

export default function CareTimeline() {
  return (
    <div style={{
      background: "#fff", border: "1px solid #EFE6DC", borderRadius: 24,
      padding: "22px 22px 20px", boxShadow: "0 2px 12px rgba(80,56,42,.05)",
      fontFamily: F,
    }}>

      {/* top: day label + progress */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9C8E83" }}>
          Week 1 · Day 7
        </span>
        <span style={{ fontSize: 11, fontWeight: 800, color: "#9C8E83" }}>25%</span>
      </div>

      {/* phase name — Newsreader big */}
      <div style={{ fontFamily: S, fontWeight: 500, fontSize: 28, lineHeight: 1.15, letterSpacing: "-0.01em", color: "#3E342C", marginBottom: 6 }}>
        <em style={{ fontStyle: "italic", color: "#AF636A" }}>Finding rhythm</em>
      </div>

      {/* description */}
      <div style={{ fontSize: 12.5, color: "#9C8E83", lineHeight: 1.5, marginBottom: 22 }}>
        Building small routines, some relief
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
              }/>
              <span style={{ fontSize: 9.5, fontWeight: 700, color: node.current ? "#AF636A" : "#9C8E83", textAlign: "center", whiteSpace: "nowrap" }}>
                {node.label}
              </span>
            </div>,
          ];
          if (i < nodes.length - 1) {
            items.push(<div key={`seg-${i}`} style={{ flex: 1, height: 2.5, borderRadius: 30, background: segBg(i) }} />);
          }
          return items;
        })}
      </div>
    </div>
  );
}
