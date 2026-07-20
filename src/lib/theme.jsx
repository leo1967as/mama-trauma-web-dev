// Shared Afterbloom design tokens — warm palette + serif/body fonts used across
// Home, Mood, CheckIn, Onboarding, EPDS. New screens should import from here
// instead of redefining their own copies of these constants.

export const FONT_BODY = "'Plus Jakarta Sans', system-ui, sans-serif";
export const FONT_SERIF = "'Newsreader', serif";

export const COLORS = {
  heading: "#4A2F2C",
  subheading: "#7A453F",
  text: "#3E342C",
  muted: "#6C5F56",
  label: "#786A5C", // quiet caption tier — darkened from #9C8E83 to pass WCAG AA (≥4.5:1 on paper/white)
  border: "#EFE6DC",
  accent: "#AF636A", // brand rose — icons, fills, decorative
  accentSoft: "#F6E2E1",
  cta: "#C77E83",
  ctaShadow: "rgba(175,99,106,.28)",
  green: "#577A62",
  greenSoft: "#E7EFE8",
  blueGrey: "#7E8AA0",
  blueGreySoft: "#EDEFF3",
  lavender: "#8E7E90",
  lavenderSoft: "#EFE9EF",
  amber: "#9A7322",
  amberSoft: "#F7EDD8",
  // "ink" tiers — deep shade of each hue, only for TEXT so small labels/chips hit
  // ≥4.5:1 on their soft backgrounds (and white). Base hues above stay for icons/fills.
  accentInk: "#9A4C53",
  greenInk: "#46654F",
  blueGreyInk: "#5F6C82",
  lavenderInk: "#6E5E72",
  amberInk: "#836015",
};

// Category chips render text + icon on a soft tint. Use the ink tier for text so
// the labels stay legible (≥4.5:1); the soft bg keeps each chip gentle.
export const ACCENT_COLORS = {
  accent: { bg: COLORS.accentSoft, text: COLORS.accentInk },
  green: { bg: COLORS.greenSoft, text: COLORS.greenInk },
  blueGrey: { bg: COLORS.blueGreySoft, text: COLORS.blueGreyInk },
  lavender: { bg: COLORS.lavenderSoft, text: COLORS.lavenderInk },
  amber: { bg: COLORS.amberSoft, text: COLORS.amberInk },
};

export const LAYERS = {
  bottomNav: 50,
  floatingHelp: 70,
  toast: 80,
  modal: 90,
  flowOverlay: 100,
  urgentOverlay: 110,
};

export const LAYOUT = {
  bottomNavSpace: "calc(116px + env(safe-area-inset-bottom, 0px))",
  bottomNavPadding: "calc(16px + env(safe-area-inset-bottom, 0px))",
  flowFooterPadding: "calc(32px + env(safe-area-inset-bottom, 0px))",
  flowScrollPadding: "calc(72px + env(safe-area-inset-bottom, 0px))",
  toastBottom: "calc(104px + env(safe-area-inset-bottom, 0px))",
};

// Shared easing curves for framer-motion transitions — natural deceleration,
// no bounce/elastic. Exit transitions should run at ~75% of enter duration.
export const EASE_OUT_QUINT = [0.22, 1, 0.36, 1];
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

export function Card({ children, style, variant = "flat" }) {
  const variants = {
    flat: {
      background: "#fff",
      border: `1px solid ${COLORS.border}`,
      boxShadow: "none",
    },
    raised: {
      background: "#fff",
      border: "1px solid transparent",
      boxShadow: "0 6px 16px rgba(80,56,42,.07)",
    },
    tinted: {
      background: COLORS.greenSoft,
      border: "1px solid #D8E6DB",
      boxShadow: "none",
    },
  };
  return (
    <div
      style={{
        ...variants[variant],
        borderRadius: 16,
        padding: 20,
        fontFamily: FONT_BODY,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function SectionLabel({ children, style }) {
  return (
    <div
      style={{
        fontSize: 12.5,
        fontWeight: 800,
        letterSpacing: 0,
        textTransform: "none",
        color: COLORS.subheading,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// Plain sentence-case label for in-card section headers.
export function CardLabel({ children, style }) {
  return (
    <div
      style={{
        fontSize: 12.5,
        fontWeight: 800,
        color: COLORS.subheading,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// Pulsing placeholder block for loading states. Sizes/radii should mirror the
// real content it stands in for (text lines, icon tiles, card bodies).
export function Skeleton({ width = "100%", height = 14, radius = 8, style }) {
  return (
    <div
      className="afterbloom-skeleton"
      aria-hidden="true"
      style={{ width, height, borderRadius: radius, ...style }}
    />
  );
}

// Shared full-width CTA button. variant="primary" is the filled brand action
// (Continue / Confirm / Generate); variant="secondary" is the outlined/quiet
// counterpart (Edit / change-of-mind actions). Pass `style` to override sizing
// or color for one-off cases (e.g. a green or red action).
export function PrimaryButton({ children, onClick, variant = "primary", type = "button", disabled, style, className = "", ...rest }) {
  const primary = variant === "primary";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`afterbloom-focus afterbloom-action ${className}`.trim()}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 9,
        minHeight: 48,
        width: "100%",
        padding: "13px 16px",
        borderRadius: 12,
        background: primary ? COLORS.cta : "#fff",
        color: primary ? "#fff" : COLORS.text,
        border: primary ? 0 : `1px solid ${COLORS.border}`,
        fontWeight: 800,
        fontSize: 14,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.7 : 1,
        fontFamily: FONT_BODY,
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

// Per-tab hero themes — each tab opens with the same structure but its own soft
// wash, so the color is a wayfinding cue (which tab am I on?) drawn from the
// existing palette. All gradients fade to the paper bg (#FBF6F0) so the content
// sheet tucks under seamlessly. Eyebrow colors are the deep shade of each hue,
// verified ≥4.5:1 on the light wash; the serif title + subtitle keep the shared
// ink so reading stays consistent.
export const HERO_THEMES = {
  rose:     { gradient: "linear-gradient(160deg, #F1E6ED 0%, #F5EEF2 45%, #FBF6F0 100%)", eyebrow: "#7A453F" },
  sage:     { gradient: "linear-gradient(160deg, #E6EFE7 0%, #F0F4ED 45%, #FBF6F0 100%)", eyebrow: "#3E5E4C" },
  honey:    { gradient: "linear-gradient(160deg, #F4E7CB 0%, #F8F0DD 45%, #FBF6F0 100%)", eyebrow: "#7B5810" },
  lavender: { gradient: "linear-gradient(160deg, #EBE3F0 0%, #F3ECF3 45%, #FBF6F0 100%)", eyebrow: "#69566E" },
};

// Shared tab hero — the full-bleed gradient header used at the top of Mood,
// Therapy, Care plan, and Circle so every tab opens with the same look.
// `theme` keys into HERO_THEMES for the per-tab wash + eyebrow color.
// `title` is a node so each tab can split its second clause onto an italic line
// (e.g. <>Mood patterns,<HeroAccent>without pressure.</HeroAccent></>).
// `rightSlot` renders opposite the eyebrow (Mood uses it for the mood-face chip).
export function HeroAccent({ children }) {
  return <em style={{ display: "block", fontStyle: "italic" }}>{children}</em>;
}

// Mood face SVGs (level 1 = heaviest … 5 = lightest). Muted diverging scale:
// cool/blue when heavy → warm coral-rose when good. `level` is the sentiment 1–5
// (already un-reversed by the caller). Shared by CheckIn options + Home snapshot.
const FACE_THEME = {
  1: { face: "#94ABCB", ink: "#3B4557" },
  2: { face: "#B3AFCB", ink: "#45445A" },
  3: { face: "#E4D4B6", ink: "#5B4E39" },
  4: { face: "#F1BA95", ink: "#5C4130" },
  5: { face: "#ED9F8B", ink: "#5C382D" },
};

export function MoodFace({ level = 3, size = 40, selected = false }) {
  const lv = Math.min(5, Math.max(1, Math.round(level)));
  const { face, ink } = FACE_THEME[lv];
  const eye = (cx) => <circle cx={cx} cy="18" r="1.7" fill={ink} />;
  const happyEye = (cx) => (
    <path d={`M${cx - 2.4},18.6 Q${cx},${16.4} ${cx + 2.4},18.6`} stroke={ink} strokeWidth="2" strokeLinecap="round" fill="none" />
  );
  const brow = (path) => <path d={path} stroke={ink} strokeWidth="1.8" strokeLinecap="round" fill="none" />;
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true"
      style={{ flexShrink: 0, display: "block", transform: `scale(${selected ? 1.06 : 1})`, transition: "transform .2s ease" }}>
      <circle cx="20" cy="20" r="18" fill={face} />
      {lv === 1 && (<>
        {brow("M11.2,15 Q13.9,12.7 16.6,14.6")}
        {brow("M23.4,14.6 Q26.1,12.7 28.8,15")}
        {eye(14.5)}{eye(25.5)}
        <path d="M25.5,21.5 q2.4,3.3 0,5.7 q-2.4,-2.4 0,-5.7 Z" fill="#5E86BE" />
        <path d="M13.5,29.5 Q20,24.5 26.5,29.5" stroke={ink} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      </>)}
      {lv === 2 && (<>
        {brow("M11.8,15 Q14.3,13.5 16.8,14.9")}
        {brow("M23.2,14.9 Q25.7,13.5 28.2,15")}
        {eye(14.5)}{eye(25.5)}
        <path d="M14,28.5 Q20,25.5 26,28.5" stroke={ink} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      </>)}
      {lv === 3 && (<>
        {eye(14.5)}{eye(25.5)}
        <path d="M14.5,27 L25.5,27" stroke={ink} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      </>)}
      {lv === 4 && (<>
        {eye(14.5)}{eye(25.5)}
        <path d="M14,26 Q20,31 26,26" stroke={ink} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      </>)}
      {lv === 5 && (<>
        <ellipse cx="11.5" cy="24.5" rx="2.8" ry="2" fill="#F1BFA8" opacity="0.75" />
        <ellipse cx="28.5" cy="24.5" rx="2.8" ry="2" fill="#F1BFA8" opacity="0.75" />
        {happyEye(14.5)}{happyEye(25.5)}
        <path d="M13.5,25 Q20,32 26.5,25" stroke={ink} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      </>)}
    </svg>
  );
}

export function TabHero({ eyebrow, title, subtitle, rightSlot, theme = "rose" }) {
  const tone = HERO_THEMES[theme] || HERO_THEMES.rose;
  return (
    <div
      className="relative px-[22px] pb-8 overflow-hidden"
      style={{ background: tone.gradient }}
    >
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, paddingTop: 14, minHeight: 34 }}>
        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: tone.eyebrow }}>
          {eyebrow}
        </span>
        {rightSlot}
      </div>

      <div style={{ position: "relative", marginTop: 26 }}>
        <h1 style={{ fontFamily: FONT_SERIF, fontWeight: 500, fontSize: 40, lineHeight: 1.04, letterSpacing: "-0.015em", color: COLORS.heading, textWrap: "balance" }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ marginTop: 14, fontSize: 15, fontWeight: 650, color: COLORS.subheading, maxWidth: "86%", lineHeight: 1.45, textWrap: "pretty" }}>
            {subtitle}
          </p>
        )}
      </div>
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: 64, background: "linear-gradient(to bottom, transparent 0%, #FBF6F0 100%)" }}
      />
    </div>
  );
}

// Content sheet that sits below a TabHero — rounded top corners tucked under the
// hero's fade, with the shared 22px side padding. Trailing spacer keeps the last
// card clear of the bottom nav.
export function TabSheet({ children, gap = 14, style }) {
  return (
    <div
      style={{
        background: "#FBF6F0",
        borderRadius: "18px 18px 0 0",
        marginTop: -16,
        padding: "24px 22px 0",
        display: "flex",
        flexDirection: "column",
        gap,
        ...style,
      }}
    >
      {children}
      <div aria-hidden="true" style={{ height: 8 }} />
    </div>
  );
}
