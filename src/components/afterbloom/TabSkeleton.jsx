// Loading placeholders shown in Dashboard's Suspense fallback while a tab's
// lazy chunk loads. Shapes mirror each tab's real layout so the swap to
// live content doesn't jump around.
import { COLORS, Skeleton } from "../../lib/theme.jsx";

function TabHeaderSkeleton({ headingWidth = "60%" }) {
  return (
    <div style={{ paddingTop: 8 }}>
      <Skeleton width={70} height={11} radius={6} />
      <Skeleton width={headingWidth} height={30} radius={8} style={{ marginTop: 9 }} />
      <Skeleton width="88%" height={13} radius={6} style={{ marginTop: 11 }} />
    </div>
  );
}

function CardSkeleton({ children, style }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: 18, border: `1px solid ${COLORS.border}`, ...style }}>
      {children}
    </div>
  );
}

export function HomeTabSkeleton() {
  return (
    <div>
      {/* Dawn header */}
      <div className="px-6 pb-8" style={{ background: "#FBF2EC", borderRadius: "0 0 18px 18px" }}>
        <div className="flex items-center justify-between pt-3.5">
          <Skeleton width={64} height={11} radius={6} />
          <div style={{ display: "flex", gap: 8 }}>
            <Skeleton width={40} height={40} radius={999} />
            <Skeleton width={40} height={40} radius={999} />
          </div>
        </div>
        <div style={{ marginTop: 26 }}>
          <Skeleton width="68%" height={34} radius={8} />
          <Skeleton width="42%" height={34} radius={8} style={{ marginTop: 8 }} />
          <Skeleton width="52%" height={13} radius={6} style={{ marginTop: 18 }} />
          <Skeleton width="78%" height={13} radius={6} style={{ marginTop: 12 }} />
        </div>
      </div>

      {/* Sheet */}
      <div className="px-[22px] pt-6" style={{ background: "#FBF6F0", marginTop: -16, borderRadius: "18px 18px 0 0" }}>
        {/* Hero check-in card */}
        <div style={{ background: "#fff", borderRadius: 28, padding: "28px 22px", boxShadow: "0 12px 32px rgba(80,56,42,.09)" }}>
          <Skeleton width={120} height={22} radius={999} />
          <Skeleton width="82%" height={22} radius={8} style={{ marginTop: 18 }} />
          <Skeleton width="55%" height={22} radius={8} style={{ marginTop: 8 }} />
          <Skeleton width="100%" height={13} radius={6} style={{ marginTop: 16 }} />
          <Skeleton width="80%" height={13} radius={6} style={{ marginTop: 8 }} />
          <Skeleton width="100%" height={48} radius={28} style={{ marginTop: 20 }} />
        </div>

        <Skeleton width={150} height={13} radius={6} style={{ marginTop: 24, marginBottom: 11 }} />

        {/* Care journey ribbon */}
        <div style={{ display: "flex", gap: 10, overflow: "hidden" }}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} width={112} height={88} radius={14} style={{ flexShrink: 0 }} />
          ))}
        </div>

        {/* Support card */}
        <Skeleton width="100%" height={70} radius={14} style={{ marginTop: 13, marginBottom: 16 }} />
      </div>
    </div>
  );
}

export function MoodTabSkeleton() {
  return (
    <div>
      {/* Gradient header */}
      <div className="relative px-6 pb-8 overflow-hidden" style={{ background: "linear-gradient(160deg, #F1E6ED 0%, #F5EEF2 45%, #FBF6F0 100%)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, paddingTop: 14 }}>
          <Skeleton width={50} height={11} radius={6} />
          <Skeleton width={120} height={34} radius={14} />
        </div>
        <div style={{ marginTop: 26 }}>
          <Skeleton width="78%" height={34} radius={8} />
          <Skeleton width="58%" height={34} radius={8} style={{ marginTop: 8 }} />
          <Skeleton width="80%" height={13} radius={6} style={{ marginTop: 18 }} />
          <Skeleton width="55%" height={13} radius={6} style={{ marginTop: 10 }} />
        </div>
      </div>

      {/* Sheet */}
      <div style={{ background: "#FBF6F0", borderRadius: "18px 18px 0 0", marginTop: -16, padding: "24px 22px 8px", display: "flex", flexDirection: "column", gap: 13 }}>
        {/* Today summary */}
        <CardSkeleton>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Skeleton width={56} height={56} radius={999} />
            <div style={{ flex: 1 }}>
              <Skeleton width="65%" height={18} radius={6} />
              <Skeleton width="45%" height={13} radius={6} style={{ marginTop: 8 }} />
            </div>
          </div>
          <Skeleton width="100%" height={48} radius={12} style={{ marginTop: 18 }} />
        </CardSkeleton>

        {/* Trend chart */}
        <CardSkeleton>
          <Skeleton width="40%" height={14} radius={6} style={{ marginBottom: 14 }} />
          <Skeleton width="100%" height={140} radius={12} />
        </CardSkeleton>

        {/* Insight cards */}
        {[0, 1].map((i) => (
          <CardSkeleton key={i}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <Skeleton width={36} height={36} radius={10} />
              <div style={{ flex: 1 }}>
                <Skeleton width="40%" height={12} radius={6} />
                <Skeleton width="92%" height={13} radius={6} style={{ marginTop: 8 }} />
                <Skeleton width="70%" height={13} radius={6} style={{ marginTop: 6 }} />
              </div>
            </div>
          </CardSkeleton>
        ))}

        {/* Support card */}
        <CardSkeleton>
          <Skeleton width="75%" height={15} radius={6} />
          <Skeleton width="100%" height={13} radius={6} style={{ marginTop: 10 }} />
          <Skeleton width="100%" height={44} radius={12} style={{ marginTop: 14 }} />
        </CardSkeleton>
      </div>
    </div>
  );
}

export function TherapyTabSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <TabHeaderSkeleton headingWidth="65%" />

      {/* Upcoming session */}
      <CardSkeleton>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <Skeleton width={48} height={48} radius={12} />
          <div style={{ flex: 1 }}>
            <Skeleton width="55%" height={16} radius={6} />
            <Skeleton width="40%" height={12} radius={6} style={{ marginTop: 8 }} />
          </div>
        </div>
        <Skeleton width="100%" height={44} radius={12} />
      </CardSkeleton>

      {/* Therapist cards */}
      {[0, 1, 2].map((i) => (
        <CardSkeleton key={i}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Skeleton width={48} height={48} radius={12} />
            <div style={{ flex: 1 }}>
              <Skeleton width="50%" height={15} radius={6} />
              <Skeleton width="35%" height={12} radius={6} style={{ marginTop: 8 }} />
            </div>
          </div>
          <Skeleton width="100%" height={13} radius={6} style={{ marginTop: 12 }} />
          <Skeleton width="78%" height={13} radius={6} style={{ marginTop: 6 }} />
          <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
            <Skeleton width={56} height={22} radius={999} />
            <Skeleton width={64} height={22} radius={999} />
            <Skeleton width={48} height={22} radius={999} />
          </div>
        </CardSkeleton>
      ))}
    </div>
  );
}

export function CarePlansTabSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <TabHeaderSkeleton headingWidth="55%" />

      <CardSkeleton>
        <Skeleton width="100%" height={13} radius={6} />
        <Skeleton width="85%" height={13} radius={6} style={{ marginTop: 8 }} />
      </CardSkeleton>

      {[0, 1, 2, 3].map((i) => (
        <CardSkeleton key={i}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Skeleton width={40} height={40} radius={12} />
            <div style={{ flex: 1 }}>
              <Skeleton width="55%" height={15} radius={6} />
              <Skeleton width="35%" height={12} radius={6} style={{ marginTop: 8 }} />
            </div>
            <Skeleton width={36} height={36} radius={999} />
          </div>
        </CardSkeleton>
      ))}
    </div>
  );
}

export function CircleTabSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ paddingTop: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <Skeleton width={20} height={20} radius={6} />
          <Skeleton width={140} height={20} radius={6} />
        </div>
        <Skeleton width="55%" height={12} radius={6} />
      </div>

      {/* Stats banner */}
      <div style={{ borderRadius: 16, padding: 20, background: COLORS.border + "55", display: "flex", alignItems: "center", gap: 12 }}>
        <Skeleton width={48} height={48} radius={12} />
        <div style={{ flex: 1 }}>
          <Skeleton width="65%" height={16} radius={6} />
          <Skeleton width="45%" height={12} radius={6} style={{ marginTop: 8 }} />
        </div>
      </div>

      {/* Your people */}
      <CardSkeleton style={{ padding: 20 }}>
        <Skeleton width="35%" height={14} radius={6} style={{ marginBottom: 14 }} />
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0" }}>
            <Skeleton width={48} height={48} radius={12} />
            <div style={{ flex: 1 }}>
              <Skeleton width="45%" height={14} radius={6} />
              <Skeleton width="65%" height={12} radius={6} style={{ marginTop: 8 }} />
            </div>
            <Skeleton width={32} height={32} radius={10} />
          </div>
        ))}
      </CardSkeleton>

      {/* Ask for help */}
      <CardSkeleton style={{ padding: 20 }}>
        <Skeleton width="48%" height={14} radius={6} />
        <Skeleton width="65%" height={12} radius={6} style={{ marginTop: 8, marginBottom: 14 }} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[80, 112, 92, 68, 122].map((w, i) => (
            <Skeleton key={i} width={w} height={28} radius={999} />
          ))}
        </div>
      </CardSkeleton>

      <Skeleton width="100%" height={52} radius={12} />
    </div>
  );
}

const TAB_SKELETONS = {
  home: HomeTabSkeleton,
  mood: MoodTabSkeleton,
  therapy: TherapyTabSkeleton,
  careplans: CarePlansTabSkeleton,
  circle: CircleTabSkeleton,
};

export default function TabSkeleton({ tab }) {
  const Layout = TAB_SKELETONS[tab] || MoodTabSkeleton;
  return <Layout />;
}
