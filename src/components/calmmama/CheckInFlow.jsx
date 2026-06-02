import { useState } from "react";
import { upsertMoodEntry } from "../../lib/mood-data";

const F = "'Plus Jakarta Sans', system-ui, sans-serif";
const S = "'Newsreader', serif";

// ── data ─────────────────────────────────────────────────────────────────────

const FACES = [
  {
    word: "Rough", desc: "A really hard day. That's okay to say.",
    score: 1,
    svg: (
      <svg viewBox="0 0 40 40" fill="none" width="40" height="40">
        <circle cx="20" cy="20" r="18" fill="#EDEFF3"/>
        <circle cx="14" cy="17" r="1.8" fill="#7E8AA0"/>
        <circle cx="26" cy="17" r="1.8" fill="#7E8AA0"/>
        <path d="M13 27c2-3 12-3 14 0" stroke="#7E8AA0" strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
    ),
    bg: "#EDEFF3", color: "#7E8AA0",
  },
  {
    word: "Low", desc: "Heavy and tired. We'll keep it light.",
    score: 2,
    svg: (
      <svg viewBox="0 0 40 40" fill="none" width="40" height="40">
        <circle cx="20" cy="20" r="18" fill="#EFE9EF"/>
        <circle cx="14" cy="18" r="1.8" fill="#8E7E90"/>
        <circle cx="26" cy="18" r="1.8" fill="#8E7E90"/>
        <path d="M14 26c2-1.5 10-1.5 12 0" stroke="#8E7E90" strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
    ),
    bg: "#EFE9EF", color: "#8E7E90",
  },
  {
    word: "Okay", desc: "Getting through it. That counts.",
    score: 3,
    svg: (
      <svg viewBox="0 0 40 40" fill="none" width="40" height="40">
        <circle cx="20" cy="20" r="18" fill="#F6EBD4"/>
        <circle cx="14" cy="18" r="1.9" fill="#B58B3C"/>
        <circle cx="26" cy="18" r="1.9" fill="#B58B3C"/>
        <path d="M14 25h12" stroke="#B58B3C" strokeWidth="2.4" strokeLinecap="round"/>
      </svg>
    ),
    bg: "#F6EBD4", color: "#B58B3C",
  },
  {
    word: "Good", desc: "A gentler, easier day.",
    score: 4,
    svg: (
      <svg viewBox="0 0 40 40" fill="none" width="40" height="40">
        <circle cx="20" cy="20" r="18" fill="#E5EEE6"/>
        <circle cx="14" cy="17" r="1.9" fill="#5E8169"/>
        <circle cx="26" cy="17" r="1.9" fill="#5E8169"/>
        <path d="M13 23c2 3 12 3 14 0" stroke="#5E8169" strokeWidth="2.3" strokeLinecap="round"/>
      </svg>
    ),
    bg: "#E5EEE6", color: "#5E8169",
  },
  {
    word: "Light", desc: "A bright day. Soak it in.",
    score: 5,
    svg: (
      <svg viewBox="0 0 40 40" fill="none" width="40" height="40">
        <circle cx="20" cy="20" r="18" fill="#F6E3E2"/>
        <circle cx="14" cy="16" r="1.9" fill="#B0666D"/>
        <circle cx="26" cy="16" r="1.9" fill="#B0666D"/>
        <path d="M12 22c2.5 4.5 13.5 4.5 16 0" stroke="#B0666D" strokeWidth="2.4" strokeLinecap="round"/>
      </svg>
    ),
    bg: "#F6E3E2", color: "#B0666D",
  },
];

const CHIPS = [
  { word: "Grateful", type: "light" }, { word: "Tired",       type: "heavy" },
  { word: "Overwhelmed", type: "heavy" }, { word: "Calm",    type: "light" },
  { word: "Anxious",  type: "heavy" }, { word: "Hopeful",    type: "light" },
  { word: "Numb",     type: "heavy" }, { word: "Lonely",     type: "heavy" },
  { word: "Proud",    type: "light" }, { word: "Foggy",      type: "heavy" },
  { word: "Loved",    type: "light" }, { word: "Irritable",  type: "heavy" },
];

const SLEEP_OPTS = [
  { val: "Hardly", em: "😶", title: "Hardly at all",  sub: "Barely managed to rest",       hours: 2 },
  { val: "Broken", em: "😪", title: "Broken sleep",   sub: "On and off through the night",  hours: 4 },
  { val: "Okay",   em: "🙂", title: "Okay sleep",     sub: "Not perfect, but manageable",   hours: 6 },
  { val: "Well",   em: "😌", title: "Slept well",     sub: "Felt rested this morning",      hours: 8 },
];

const AFFIRMATIONS = {
  Rough: '"Rest is not giving up. It\'s giving yourself what you need most."',
  Low:   '"Healing isn\'t linear. Even quiet days are part of the journey."',
  Okay:  '"Showing up for yourself — even on a hard day — matters more than you know."',
  Good:  '"A gentler day is something to hold on to. You\'re doing well."',
  Light: '"Light days are worth celebrating. You did something right."',
};

// ── shared layout pieces ──────────────────────────────────────────────────────

function CiTop({ step, total = 3, onBack, onSkip }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 22px 4px" }}>
      <button
        onClick={onBack}
        style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "#fff", border: "1px solid #EFE6DC",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#6C5F56", cursor: "pointer", fontSize: 15, fontWeight: 700,
          fontFamily: F,
        }}
      >
        {step === 1 ? "✕" : "←"}
      </button>
      <span style={{ fontSize: 12, fontWeight: 800, color: "#9C8E83", fontFamily: F }}>
        Check-in · {step} of {total}
      </span>
      <span
        onClick={onSkip}
        style={{ fontSize: 13, fontWeight: 700, color: "#AF636A", cursor: "pointer", fontFamily: F }}
      >
        Skip
      </span>
    </div>
  );
}

function ProgBar({ pct }) {
  return (
    <div style={{ height: 5, margin: "8px 22px 0", background: "#EFE6DC", borderRadius: 30, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#C77E83,#DBA0A2)", borderRadius: 30, transition: "0.4s" }} />
    </div>
  );
}

function CiFoot({ label, disabled, onClick, icon }) {
  return (
    <div style={{ padding: "16px 22px 24px" }}>
      <button
        onClick={!disabled ? onClick : undefined}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
          width: "100%", padding: 16, borderRadius: 18,
          background: disabled ? "#E6DBCF" : "#C77E83",
          color: disabled ? "#9C8E83" : "#fff",
          fontWeight: 700, fontSize: 15, border: 0,
          boxShadow: disabled ? "none" : "0 12px 22px rgba(175,99,106,.28)",
          cursor: disabled ? "default" : "pointer",
          fontFamily: F, transition: "0.15s",
        }}
      >
        {label}
        {icon}
      </button>
      <div style={{ textAlign: "center", marginTop: 11, fontSize: 12, fontWeight: 700, color: "#9C8E83", fontFamily: F }}>
        Feeling unsafe?{" "}
        <span style={{ color: "#AF636A", cursor: "pointer" }}>Get help now</span>
      </div>
    </div>
  );
}

// ── step 1: face scale ────────────────────────────────────────────────────────

function Step1({ face, setFace, onBack, onNext }) {
  const sel = FACES.find(f => f.word === face);
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#FBF6F0", fontFamily: F }}>
      <CiTop step={1} total={4} onBack={onBack} onSkip={() => onNext()} />
      <ProgBar pct={25} />
      <div style={{ flex: 1, padding: "22px 22px 0", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9C8E83", marginBottom: 10 }}>
          How you're feeling
        </div>
        <div style={{ fontFamily: S, fontWeight: 500, fontSize: 27, lineHeight: 1.15, letterSpacing: "-0.01em", marginBottom: 6, color: "#3E342C" }}>
          How does<br />today feel?
        </div>
        <div style={{ fontSize: 13, color: "#6C5F56", marginBottom: 22 }}>
          Tap the face closest to your mood — no right or wrong.
        </div>

        {/* faces */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 6, marginBottom: 6 }}>
          {FACES.map(f => (
            <button
              key={f.word}
              onClick={() => setFace(f.word)}
              style={{
                flex: 1, border: 0, background: "transparent", cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "6px 0",
              }}
            >
              <div style={{
                width: 50, height: 50, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "#fff",
                border: face === f.word ? "1.5px solid transparent" : "1.5px solid #E6DBCF",
                transition: "0.18s",
                transform: face === f.word ? "scale(1.14)" : "scale(1)",
                boxShadow: face === f.word ? "0 8px 18px rgba(86,62,48,.18)" : "none",
              }}>
                {f.svg}
              </div>
              <span style={{ fontSize: 10, fontWeight: face === f.word ? 800 : 700, color: face === f.word ? "#3E342C" : "#9C8E83", transition: "0.18s" }}>
                {f.word}
              </span>
            </button>
          ))}
        </div>

        {/* fread */}
        <div style={{ textAlign: "center", marginTop: 16, minHeight: 48 }}>
          {sel ? (
            <>
              <div style={{ fontFamily: S, fontSize: 23, fontWeight: 500, color: "#3E342C" }}>{sel.word}</div>
              <div style={{ fontSize: 12.5, color: "#6C5F56", marginTop: 3 }}>{sel.desc}</div>
            </>
          ) : (
            <div style={{ fontSize: 12.5, color: "#9C8E83" }}>Tap a face above</div>
          )}
        </div>
      </div>
      <CiFoot
        label="Continue"
        disabled={!face}
        onClick={onNext}
        icon={<svg viewBox="0 0 24 24" width="16" fill="none" stroke="currentColor" strokeWidth="2.3"><path d="M5 12h14M13 6l6 6-6 6"/></svg>}
      />
    </div>
  );
}

// ── step 2: feeling chips ─────────────────────────────────────────────────────

function Step2({ feelings, setFeelings, onBack, onNext }) {
  const toggle = (word) => {
    setFeelings(prev => prev.includes(word) ? prev.filter(w => w !== word) : [...prev, word]);
  };
  const n = feelings.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#FBF6F0", fontFamily: F }}>
      <CiTop step={2} total={4} onBack={onBack} onSkip={onNext} />
      <ProgBar pct={50} />
      <div style={{ flex: 1, padding: "22px 22px 0", overflowY: "auto" }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9C8E83", marginBottom: 10 }}>
          Tap any that fit
        </div>
        <div style={{ fontFamily: S, fontWeight: 500, fontSize: 27, lineHeight: 1.15, letterSpacing: "-0.01em", marginBottom: 6, color: "#3E342C" }}>
          Which words<br />fit today?
        </div>
        <div style={{ fontSize: 13, color: "#6C5F56", marginBottom: 22 }}>
          Pick as many as feel right — you can feel more than one thing.
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
          {CHIPS.map(chip => {
            const on = feelings.includes(chip.word);
            return (
              <button
                key={chip.word}
                onClick={() => toggle(chip.word)}
                style={{
                  border: `1px solid ${on ? (chip.type === "heavy" ? "#C77E83" : "#83A48B") : "#E6DBCF"}`,
                  background: on ? (chip.type === "heavy" ? "#C77E83" : "#83A48B") : "#fff",
                  color: on ? "#fff" : "#6C5F56",
                  fontFamily: F, fontSize: 13, fontWeight: 600,
                  padding: "11px 15px", borderRadius: 30, cursor: "pointer", transition: "0.14s",
                }}
              >
                {chip.word}
              </button>
            );
          })}
        </div>
        <div style={{ fontSize: 12, color: "#9C8E83", marginTop: 14, fontWeight: 600 }}>
          {n === 0 ? "Tap the words that fit" : `${n} selected · tap to add more`}
        </div>
      </div>
      <CiFoot
        label="Continue"
        disabled={false}
        onClick={onNext}
        icon={<svg viewBox="0 0 24 24" width="16" fill="none" stroke="currentColor" strokeWidth="2.3"><path d="M5 12h14M13 6l6 6-6 6"/></svg>}
      />
    </div>
  );
}

// ── step 3: sleep ─────────────────────────────────────────────────────────────

function Step3({ sleep, setSleep, onBack, onSave }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#FBF6F0", fontFamily: F }}>
      <CiTop step={3} total={4} onBack={onBack} onSkip={onSave} />
      <ProgBar pct={75} />
      <div style={{ flex: 1, padding: "22px 22px 0", overflowY: "auto" }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9C8E83", marginBottom: 10 }}>
          Last night
        </div>
        <div style={{ fontFamily: S, fontWeight: 500, fontSize: 27, lineHeight: 1.15, letterSpacing: "-0.01em", marginBottom: 6, color: "#3E342C" }}>
          How did you<br />sleep?
        </div>
        <div style={{ fontSize: 13, color: "#6C5F56", marginBottom: 22 }}>
          However it was, it's okay to say.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {SLEEP_OPTS.map(opt => {
            const on = sleep === opt.val;
            return (
              <button
                key={opt.val}
                onClick={() => setSleep(opt.val)}
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "16px 18px",
                  background: on ? "#FBEDEC" : "#fff",
                  border: `1.5px solid ${on ? "#C77E83" : "#EFE6DC"}`,
                  borderRadius: 18, cursor: "pointer", textAlign: "left",
                  fontFamily: F, width: "100%", transition: "0.15s",
                }}
              >
                <span style={{
                  width: 36, height: 36, borderRadius: 12,
                  background: on ? "#F6E2E1" : "#FBF6F0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, fontSize: 16, transition: "0.15s",
                }}>
                  {opt.em}
                </span>
                <span>
                  <span style={{ display: "block", fontSize: 14.5, fontWeight: 700, color: "#3E342C" }}>{opt.title}</span>
                  <span style={{ display: "block", fontSize: 11.5, color: "#6C5F56", marginTop: 2 }}>{opt.sub}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <CiFoot
        label="Continue"
        disabled={false}
        onClick={onSave}
        icon={<svg viewBox="0 0 24 24" width="16" fill="none" stroke="currentColor" strokeWidth="2.3"><path d="M5 12h14M13 6l6 6-6 6"/></svg>}
      />
    </div>
  );
}

// ── step 4: extra details ─────────────────────────────────────────────────────

function Step4({ energy, setEnergy, support, setSupport, note, setNote, onBack, onSave, onSkip }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#FBF6F0", fontFamily: F }}>
      <CiTop step={4} total={4} onBack={onBack} onSkip={onSkip} />
      <ProgBar pct={100} />
      <div style={{ flex: 1, padding: "22px 22px 0", overflowY: "auto" }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", color: "#9C8E83", marginBottom: 10 }}>
          Optional extras
        </div>
        <div style={{ fontFamily: S, fontWeight: 500, fontSize: 27, lineHeight: 1.15, letterSpacing: "-0.01em", marginBottom: 6, color: "#3E342C" }}>
          A little more<br />detail?
        </div>
        <div style={{ fontSize: 13, color: "#6C5F56", marginBottom: 24 }}>
          These help build a richer picture over time.
        </div>

        {/* energy */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#3E342C" }}>Energy level</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#C77E83" }}>{energy}%</span>
          </div>
          <input type="range" min="0" max="100" value={energy}
            onChange={e => setEnergy(Number(e.target.value))}
            style={{
              width: "100%", height: 6, borderRadius: 30, appearance: "none", cursor: "pointer", outline: "none",
              background: `linear-gradient(to right,#C77E83 0%,#C77E83 ${energy}%,#EFE6DC ${energy}%,#EFE6DC 100%)`,
            }}
          />
          <style>{`input[type='range']::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:#fff;border:2.5px solid #C77E83;box-shadow:0 2px 8px rgba(175,99,106,.2);cursor:pointer;}`}</style>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            <span style={{ fontSize: 10, color: "#9C8E83" }}>Exhausted</span>
            <span style={{ fontSize: 10, color: "#9C8E83" }}>Energized</span>
          </div>
        </div>

        {/* support toggle */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#3E342C", marginBottom: 10 }}>
            Did you reach out to someone today?
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {["Yes", "No"].map(opt => {
              const on = (opt === "Yes") === (support === "yes");
              return (
                <button key={opt} onClick={() => setSupport(opt === "Yes" ? "yes" : "no")}
                  style={{
                    flex: 1, padding: "14px 0",
                    background: on ? "#FBEDEC" : "#fff",
                    border: `1.5px solid ${on ? "#C77E83" : "#EFE6DC"}`,
                    borderRadius: 16, cursor: "pointer",
                    fontSize: 14, fontWeight: 700, fontFamily: F,
                    color: on ? "#AF636A" : "#9C8E83", transition: "0.15s",
                  }}>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* note */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#3E342C", marginBottom: 10 }}>
            Anything else on your mind?
          </div>
          <textarea value={note} onChange={e => setNote(e.target.value)}
            placeholder="Just a word or two is enough."
            style={{
              width: "100%", minHeight: 80,
              background: "#fff", border: "1.5px solid #EFE6DC",
              borderRadius: 16, padding: "12px 16px",
              fontSize: 13, color: "#3E342C", fontFamily: F,
              resize: "none", outline: "none", lineHeight: 1.55,
            }}
          />
        </div>
      </div>
      <CiFoot
        label="Save & finish"
        disabled={false}
        onClick={onSave}
        icon={<svg viewBox="0 0 24 24" width="16" fill="none" stroke="currentColor" strokeWidth="2.3"><path d="M5 13l4 4L19 7"/></svg>}
      />
    </div>
  );
}

// ── step done ─────────────────────────────────────────────────────────────────

function StepDone({ face, feelings, onClose }) {
  const faceData = FACES.find(f => f.word === face) || FACES[2];
  const affirmation = AFFIRMATIONS[face] || AFFIRMATIONS.Okay;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: F }}>
      {/* done-top */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg,#F4C9A8,#E2A0A4 50%,#D7A0AB)",
          padding: "0 24px 36px",
          position: "relative", overflow: "hidden",
        }}
      >
        {/* glow */}
        <div style={{
          position: "absolute", width: 200, height: 200, borderRadius: "50%",
          right: -50, top: -70,
          background: "radial-gradient(circle,rgba(255,240,214,.8),transparent 70%)",
        }} />
        {/* done-check badge */}
        <div style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 9, margin: "18px 0 20px" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 9,
            fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase",
            color: "#fff", background: "rgba(255,255,255,.25)",
            padding: "8px 16px", borderRadius: 30,
          }}>
            <svg viewBox="0 0 24 24" width="14" fill="none" stroke="currentColor" strokeWidth="2.8">
              <path d="M5 13l4 4L19 7"/>
            </svg>
            Check-in saved
          </span>
        </div>
        {/* done-h */}
        <div style={{ fontFamily: S, fontWeight: 500, fontSize: 40, lineHeight: 1.0, letterSpacing: "-0.015em", color: "#4A2F2C", position: "relative" }}>
          Done for
          <em style={{ display: "block", fontStyle: "italic" }}>today.</em>
        </div>
      </div>

      {/* done-sheet */}
      <div style={{
        flex: 1, background: "#FBF6F0",
        borderRadius: "26px 26px 0 0", marginTop: -16,
        padding: "24px 22px", overflowY: "auto",
      }}>
        {/* summary-card */}
        <div style={{
          background: "#fff", border: "1px solid #EFE6DC", borderRadius: 24,
          padding: 20, boxShadow: "0 2px 12px rgba(80,56,42,.05)", marginBottom: 14,
        }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9C8E83", marginBottom: 14 }}>
            You logged
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              background: faceData.bg,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              {faceData.svg}
            </div>
            <div>
              <div style={{ fontFamily: S, fontSize: 22, fontWeight: 500, letterSpacing: "-0.01em", color: "#3E342C" }}>{faceData.word}</div>
              <div style={{ fontSize: 12, color: "#6C5F56", marginTop: 2 }}>{faceData.desc}</div>
            </div>
          </div>
          {feelings.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
              {feelings.map(tag => (
                <span key={tag} style={{
                  fontSize: 12, fontWeight: 700,
                  padding: "7px 13px", borderRadius: 30,
                  background: "#FBF6F0", border: "1px solid #E6DBCF", color: "#6C5F56",
                }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* affirmation */}
        <div style={{
          background: "linear-gradient(150deg,#E7EFE8,#fff)",
          border: "1px solid #D8E6DB", borderRadius: 24, padding: 20, marginBottom: 14,
        }}>
          <div style={{ fontFamily: S, fontStyle: "italic", fontSize: 18, color: "#577A62", lineHeight: 1.45, marginBottom: 8 }}>
            {affirmation}
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#7A9E84" }}>— Your care team</div>
        </div>

        {/* actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingBottom: 24 }}>
          <button
            onClick={onClose}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
              width: "100%", padding: 16, borderRadius: 18,
              background: "#C77E83", color: "#fff",
              fontWeight: 700, fontSize: 15, border: 0,
              boxShadow: "0 12px 22px rgba(175,99,106,.28)",
              cursor: "pointer", fontFamily: F,
            }}
          >
            Back home
            <svg viewBox="0 0 24 24" width="16" fill="none" stroke="currentColor" strokeWidth="2.3">
              <path d="M4 11l8-7 8 7"/><path d="M6 10v9h12v-9"/>
            </svg>
          </button>
          <button
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
              width: "100%", padding: 15, borderRadius: 18,
              background: "#fff", color: "#6C5F56",
              fontWeight: 700, fontSize: 14,
              border: "1px solid #E6DBCF",
              cursor: "pointer", fontFamily: F,
            }}
          >
            Talk to someone
          </button>
        </div>
      </div>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────

export default function CheckInFlow({ onClose }) {
  const [step, setStep] = useState(1);
  const [face, setFace] = useState(null);
  const [feelings, setFeelings] = useState([]);
  const [sleep, setSleep] = useState("Broken");
  const [energy, setEnergy] = useState(50);
  const [support, setSupport] = useState("no");
  const [note, setNote] = useState("");

  const completeCi = ({ energy: e, support: s, note: n }) => {
    const faceData = FACES.find(f => f.word === face) || FACES[2];
    const sleepOpt = SLEEP_OPTS.find(o => o.val === sleep) || SLEEP_OPTS[1];
    upsertMoodEntry({
      moodScore: faceData.score,
      sleepHours: sleepOpt.hours,
      tags: feelings.map(w => w.toLowerCase()),
      supportContacted: s,
      energyLevel: e,
      note: n,
    });
    setStep("done");
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      background: "#FBF6F0",
      display: "flex", flexDirection: "column",
      maxWidth: 448, margin: "0 auto",
      fontFamily: F,
    }}>
      {step === 1 && (
        <Step1
          face={face} setFace={setFace}
          onBack={onClose}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <Step2
          feelings={feelings} setFeelings={setFeelings}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}
      {step === 3 && (
        <Step3
          sleep={sleep} setSleep={setSleep}
          onBack={() => setStep(2)}
          onSave={() => setStep(4)}
        />
      )}
      {step === 4 && (
        <Step4
          energy={energy} setEnergy={setEnergy}
          support={support} setSupport={setSupport}
          note={note} setNote={setNote}
          onBack={() => setStep(3)}
          onSave={() => completeCi({ energy, support, note })}
          onSkip={() => completeCi({ energy: 50, support: "no", note: "" })}
        />
      )}
      {step === "done" && (
        <StepDone face={face || "Okay"} feelings={feelings} onClose={onClose} />
      )}
    </div>
  );
}
