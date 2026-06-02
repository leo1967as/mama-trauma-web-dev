const FONT_SERIF = "'Newsreader', serif";

const nodes = [
  { label: "Day 1", done: true },
  { label: "Day 3", done: true },
  { label: "Day 7", current: true },
  { label: "Week 2" },
  { label: "Week 4" },
];

function segStyle(i) {
  if (i <= 1) return { flex: 1, height: 3, borderRadius: 30, background: "#F6E2E1" };
  if (i === 2) return { flex: 1, height: 3, borderRadius: 30, background: "linear-gradient(90deg,#F6E2E1 50%,#E6DBCF 50%)" };
  return { flex: 1, height: 3, borderRadius: 30, background: "#E6DBCF" };
}

export default function CareTimeline() {
  return (
    <div
      className="rounded-[24px]"
      style={{
        background: "#fff",
        border: "1px solid #EFE6DC",
        padding: 18,
        boxShadow: "0 2px 12px rgba(80,56,42,.05)",
      }}
    >
      {/* rtop */}
      <div className="flex items-baseline justify-between" style={{ marginBottom: 16 }}>
        <div className="font-medium text-[19px]" style={{ fontFamily: FONT_SERIF }}>
          Day 7 · <b style={{ color: "#AF636A", fontStyle: "italic", fontWeight: 500 }}>Finding rhythm</b>
        </div>
        <div className="text-[11px] font-black" style={{ color: "#9C8E83" }}>25%</div>
      </div>

      {/* timeline */}
      <div className="flex items-center">
        {nodes.flatMap((node, i) => {
          const dotStyle = node.current
            ? { width: 22, height: 22, borderRadius: "50%", background: "#C77E83", boxShadow: "0 0 0 5px #F6E2E1", flexShrink: 0 }
            : node.done
            ? { width: 16, height: 16, borderRadius: "50%", background: "#F6E2E1", boxShadow: "0 0 0 1px #C77E83", flexShrink: 0 }
            : { width: 16, height: 16, borderRadius: "50%", background: "#E6DBCF", flexShrink: 0 };

          const items = [
            <div
              key={`node-${node.label}`}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0, width: 42 }}
            >
              <div style={dotStyle} />
              <span
                style={{
                  fontSize: 9.5,
                  fontWeight: 700,
                  color: node.current ? "#AF636A" : "#9C8E83",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}
              >
                {node.label}
              </span>
            </div>,
          ];

          if (i < nodes.length - 1) {
            items.push(<div key={`seg-${i}`} style={segStyle(i)} />);
          }

          return items;
        })}
      </div>
    </div>
  );
}
