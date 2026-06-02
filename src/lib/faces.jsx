// Shared soft SVG face components — used everywhere instead of emoji

export const MOOD_FACES = [
  {
    score: 1, word: "Rough", label: "Sad",
    bg: "#EDEFF3", color: "#7E8AA0",
    svg: (size = 40) => (
      <svg viewBox="0 0 40 40" fill="none" width={size} height={size}>
        <circle cx="20" cy="20" r="18" fill="#EDEFF3"/>
        <circle cx="14" cy="17" r="1.8" fill="#7E8AA0"/>
        <circle cx="26" cy="17" r="1.8" fill="#7E8AA0"/>
        <path d="M13 27c2-3 12-3 14 0" stroke="#7E8AA0" strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    score: 2, word: "Low", label: "Low",
    bg: "#EFE9EF", color: "#8E7E90",
    svg: (size = 40) => (
      <svg viewBox="0 0 40 40" fill="none" width={size} height={size}>
        <circle cx="20" cy="20" r="18" fill="#EFE9EF"/>
        <circle cx="14" cy="18" r="1.8" fill="#8E7E90"/>
        <circle cx="26" cy="18" r="1.8" fill="#8E7E90"/>
        <path d="M14 26c2-1.5 10-1.5 12 0" stroke="#8E7E90" strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    score: 3, word: "Okay", label: "Okay",
    bg: "#F6EBD4", color: "#B58B3C",
    svg: (size = 40) => (
      <svg viewBox="0 0 40 40" fill="none" width={size} height={size}>
        <circle cx="20" cy="20" r="18" fill="#F6EBD4"/>
        <circle cx="14" cy="18" r="1.9" fill="#B58B3C"/>
        <circle cx="26" cy="18" r="1.9" fill="#B58B3C"/>
        <path d="M14 25h12" stroke="#B58B3C" strokeWidth="2.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    score: 4, word: "Good", label: "Good",
    bg: "#E5EEE6", color: "#5E8169",
    svg: (size = 40) => (
      <svg viewBox="0 0 40 40" fill="none" width={size} height={size}>
        <circle cx="20" cy="20" r="18" fill="#E5EEE6"/>
        <circle cx="14" cy="17" r="1.9" fill="#5E8169"/>
        <circle cx="26" cy="17" r="1.9" fill="#5E8169"/>
        <path d="M13 23c2 3 12 3 14 0" stroke="#5E8169" strokeWidth="2.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    score: 5, word: "Light", label: "Great",
    bg: "#F6E3E2", color: "#B0666D",
    svg: (size = 40) => (
      <svg viewBox="0 0 40 40" fill="none" width={size} height={size}>
        <circle cx="20" cy="20" r="18" fill="#F6E3E2"/>
        <circle cx="14" cy="16" r="1.9" fill="#B0666D"/>
        <circle cx="26" cy="16" r="1.9" fill="#B0666D"/>
        <path d="M12 22c2.5 4.5 13.5 4.5 16 0" stroke="#B0666D" strokeWidth="2.4" strokeLinecap="round"/>
      </svg>
    ),
  },
];

// Sleep faces — softer, sleepier expressions
export const SLEEP_FACES = [
  {
    val: "Hardly", title: "Hardly at all", sub: "Barely managed to rest", hours: 2,
    bg: "#E8E8EE", color: "#888CA0",
    svg: (size = 36) => (
      <svg viewBox="0 0 40 40" fill="none" width={size} height={size}>
        <circle cx="20" cy="20" r="18" fill="#E8E8EE"/>
        {/* heavy-lidded closed eyes */}
        <path d="M12 17.5c0.8-1 2.4-1 3.2 0" stroke="#888CA0" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M24.8 17.5c0.8-1 2.4-1 3.2 0" stroke="#888CA0" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M14 26c2-3 10-3 12 0" stroke="#888CA0" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    val: "Broken", title: "Broken sleep", sub: "On and off through the night", hours: 4,
    bg: "#EDE8F0", color: "#9080A0",
    svg: (size = 36) => (
      <svg viewBox="0 0 40 40" fill="none" width={size} height={size}>
        <circle cx="20" cy="20" r="18" fill="#EDE8F0"/>
        {/* droopy half-open eyes */}
        <path d="M12 18c0.5-0.8 2-1.2 3.2-0.5" stroke="#9080A0" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M24.8 18c0.5-0.8 2-1.2 3.2-0.5" stroke="#9080A0" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M14 25.5c2-1.5 10-1.5 12 0" stroke="#9080A0" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    val: "Okay", title: "Okay sleep", sub: "Not perfect, but manageable", hours: 6,
    bg: "#F4EBD8", color: "#B08840",
    svg: (size = 36) => (
      <svg viewBox="0 0 40 40" fill="none" width={size} height={size}>
        <circle cx="20" cy="20" r="18" fill="#F4EBD8"/>
        <circle cx="14" cy="18" r="1.9" fill="#B08840"/>
        <circle cx="26" cy="18" r="1.9" fill="#B08840"/>
        <path d="M14 25h12" stroke="#B08840" strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    val: "Well", title: "Slept well", sub: "Felt rested this morning", hours: 8,
    bg: "#E2EEE4", color: "#507060",
    svg: (size = 36) => (
      <svg viewBox="0 0 40 40" fill="none" width={size} height={size}>
        <circle cx="20" cy="20" r="18" fill="#E2EEE4"/>
        {/* happy rested eyes — slight crescent */}
        <path d="M12 17c1-1.2 2.4-1.2 3.2 0" stroke="#507060" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M24.8 17c1-1.2 2.4-1.2 3.2 0" stroke="#507060" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M13 23c2 3.5 12 3.5 14 0" stroke="#507060" strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
    ),
  },
];

// Person avatar SVG (for Circle, Therapy)
export function PersonSvg({ size = 36, bg = "#F0EBF4", color = "#9080A0" }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" width={size} height={size}>
      <circle cx="20" cy="20" r="18" fill={bg}/>
      <circle cx="20" cy="15" r="5.5" fill={color} opacity="0.9"/>
      <path d="M8 34c0-7 5.4-11 12-11s12 4 12 11" fill={color} opacity="0.7"/>
    </svg>
  );
}

// Heart SVG (replaces 💛)
export function HeartSvg({ size = 14, color = "#C77E83" }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
      <path d="M12 21s-8-5.5-8-11a5 5 0 0110 0 5 5 0 0110 0c0 5.5-8 11-8 11z"/>
    </svg>
  );
}

// Flower SVG (replaces 🌸)
export function FlowerSvg({ size = 14, color = "#C77E83" }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
      <circle cx="12" cy="12" r="2.5" fill={color}/>
      <ellipse cx="12" cy="6" rx="2" ry="3" fill={color} opacity="0.6"/>
      <ellipse cx="12" cy="18" rx="2" ry="3" fill={color} opacity="0.6"/>
      <ellipse cx="6" cy="12" rx="3" ry="2" fill={color} opacity="0.6"/>
      <ellipse cx="18" cy="12" rx="3" ry="2" fill={color} opacity="0.6"/>
      <ellipse cx="7.8" cy="7.8" rx="2" ry="3" fill={color} opacity="0.45" transform="rotate(-45 7.8 7.8)"/>
      <ellipse cx="16.2" cy="7.8" rx="2" ry="3" fill={color} opacity="0.45" transform="rotate(45 16.2 7.8)"/>
      <ellipse cx="7.8" cy="16.2" rx="2" ry="3" fill={color} opacity="0.45" transform="rotate(45 7.8 16.2)"/>
      <ellipse cx="16.2" cy="16.2" rx="2" ry="3" fill={color} opacity="0.45" transform="rotate(-45 16.2 16.2)"/>
    </svg>
  );
}

// Utility: get face by score
export function getFaceByScore(score) {
  return MOOD_FACES.find(f => f.score === score) ?? MOOD_FACES[2];
}
