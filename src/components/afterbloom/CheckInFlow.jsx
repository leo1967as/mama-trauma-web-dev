import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getMoodEntryByDateKey, getMoodSupportSummary, getSupportLevelMeta, upsertMoodEntry, saveCheckinDraft, getCheckinDraft, clearCheckinDraft, isSupportNeedTriggered } from "../../lib/mood-data";
import { getSuggestedGoals, setDailyGoal } from "../../lib/goals-data";

const F = "'Plus Jakarta Sans', system-ui, sans-serif";
const S = "'Newsreader', serif";

const CORE_QUESTIONS = [
  {
    key: "moodScore",
    step: 1,
    total: 4,
    title: "How are you feeling today?",
    subtitle: "Choose the one that fits today best.",
    labels: ["Very low", "Low", "Neutral", "Good", "Very good"],
    help: "There's no wrong answer — just how today feels.",
  },
  {
    key: "sleepScore",
    step: 2,
    total: 4,
    title: "How did you sleep last night?",
    subtitle: "Even if you woke up often — answer for how it really felt.",
    labels: ["Almost none", "Very little", "Some", "Enough", "Slept well"],
    help: "Broken sleep is normal right now. No need for perfect sleep.",
  },
  {
    key: "energyScore",
    step: 3,
    total: 4,
    title: "How much energy do you have today?",
    subtitle: "At your own pace, not anyone else's.",
    labels: ["Drained", "Tired", "Managing", "Okay", "Energized"],
    help: "",
  },
  {
    key: "worryScore",
    step: 4,
    total: 4,
    title: "How much is on your mind today?",
    subtitle: "Whatever is there is okay to name.",
    labels: ["Not at all", "A little", "Somewhat", "A lot", "Overwhelmed"],
    help: "",
  },
];

// spec 3.5 — 13 options, max 2 selections
const PROBLEM_TAGS = [
  "Exhaustion", "Feeding", "Baby crying", "Body pain", "Sleep deprivation",
  "Feeling alone", "Family stress", "Partner support", "Recovery after birth",
  "Household responsibilities", "Feeling overwhelmed", "I'm not sure", "Something else",
];
// spec 3.7 — baby connection 1-5
const BABY_CONNECTION_LABELS = ["Hard", "A little distant", "Mixed", "Mostly okay", "Warm"];

function getComposite(values) {
  const scored = [values.moodScore, values.sleepScore, values.energyScore, 6 - values.worryScore].filter((value) => Number.isFinite(value));
  if (!scored.length) return null;
  return scored.reduce((sum, value) => sum + value, 0) / scored.length;
}

function Progress({ step, total }) {
  return (
    <div style={{ display: "flex", gap: 7, justifyContent: "center" }}>
      {Array.from({ length: total }, (_, i) => i + 1).map((i) => (
        <motion.div
          key={i}
          animate={{ width: i === step ? 22 : 6, background: i === step ? "#C77E83" : i < step ? "#E8C4C4" : "#E6DBCF" }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          style={{ height: 6, borderRadius: 30 }}
        />
      ))}
    </div>
  );
}

function Header({ step, total, onBack, onHelp, showBack = true, title = "Daily Check-in" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px 8px", gap: 8 }}>
      {showBack ? (
        <motion.button
          onClick={onBack}
          whileTap={{ scale: 0.9 }}
          style={{ width: 38, height: 38, borderRadius: "50%", background: "#fff", border: "1px solid #EFE6DC", display: "flex", alignItems: "center", justifyContent: "center", color: "#6C5F56", cursor: "pointer", fontSize: 16, fontWeight: 700, fontFamily: F }}
        >
          ←
        </motion.button>
      ) : (
        <div style={{ width: 38 }} />
      )}

      <div style={{ flex: 1, minWidth: 0, textAlign: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9C8E83", marginBottom: 6 }}>
          {title}
        </div>
        <Progress step={step} total={total} />
      </div>

      <button
        onClick={onHelp}
        style={{ width: 38, height: 38, borderRadius: "50%", background: "#F6E2E1", border: 0, color: "#AF636A", fontSize: 11, fontWeight: 800, cursor: "pointer", lineHeight: 1, padding: 0 }}
      >
        Help
      </button>
    </div>
  );
}

/* Body only — title/subtitle/help fade up, then options rise together as one group.
   Keyed by step in the parent so it replays per question, never on each answer tap. */
function QuestionBody({ question, value, onSelect }) {
  const selectedLabel = value ? question.labels[value - 1] : null;
  const ease = [0.22, 1, 0.36, 1];

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.22, ease }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease }}
      >
        <div style={{ fontFamily: S, fontWeight: 500, fontSize: 28, lineHeight: 1.15, letterSpacing: "-0.01em", color: "#3E342C", marginBottom: 10 }}>
          {question.title}
        </div>
        <div style={{ fontSize: 13.5, color: "#6C5F56", marginBottom: question.help ? 10 : 22, lineHeight: 1.6 }}>
          {question.subtitle}
        </div>
        {question.help && (
          <div style={{ fontSize: 12, color: "#9C8E83", marginBottom: 22, lineHeight: 1.5 }}>
            {question.help}
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, delay: 0.16, ease }}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        {question.labels.map((label, idx) => {
          const optionValue = idx + 1;
          const on = value === optionValue;
          return (
            <motion.button
              key={label}
              onClick={() => onSelect(optionValue)}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 420, damping: 22 }}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "16px 18px",
                background: on ? "#FBEDEC" : "#fff",
                border: `1.5px solid ${on ? "#C77E83" : "#EFE6DC"}`,
                borderRadius: 18, cursor: "pointer", textAlign: "left",
                fontFamily: F, width: "100%",
                boxShadow: on ? "0 4px 14px rgba(199,126,131,.14)" : "0 2px 6px rgba(80,56,42,.04)",
              }}
            >
              <motion.div
                animate={{ width: on ? 22 : 20, height: on ? 22 : 20, background: on ? "#C77E83" : "#fff", border: on ? "none" : "1.5px solid #D6CEC8" }}
                transition={{ type: "spring", stiffness: 420, damping: 22 }}
                style={{ borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                {on && (
                  <svg viewBox="0 0 24 24" width="11" fill="none" stroke="white" strokeWidth="2.8">
                    <path d="M5 13l4 4L19 7"/>
                  </svg>
                )}
              </motion.div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: on ? 700 : 500, color: on ? "#AF636A" : "#3E342C" }}>{label}</div>
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {selectedLabel && (
        <div style={{ marginTop: 16, fontSize: 12.5, color: "#6C5F56" }}>
          Selected: <strong>{selectedLabel}</strong>
        </div>
      )}
    </motion.div>
  );
}

/* ── Follow-up shell (header without the core 4-dot progress) ── */
function FollowUpShell({ title, onBack, onHelp, children, footer }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#FBF6F0", fontFamily: F }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px 8px", gap: 8 }}>
        <motion.button onClick={onBack} whileTap={{ scale: 0.9 }}
          style={{ width: 38, height: 38, borderRadius: "50%", background: "#fff", border: "1px solid #EFE6DC", display: "flex", alignItems: "center", justifyContent: "center", color: "#6C5F56", cursor: "pointer", fontSize: 16, fontWeight: 700, fontFamily: F }}>
          ←
        </motion.button>
        <div style={{ flex: 1, minWidth: 0, textAlign: "center", fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9C8E83" }}>{title}</div>
        <button onClick={onHelp} style={{ width: 38, height: 38, borderRadius: "50%", background: "#F6E2E1", border: 0, color: "#AF636A", fontSize: 11, fontWeight: 800, cursor: "pointer", lineHeight: 1, padding: 0 }}>Help</button>
      </div>
      <div style={{ flex: 1, padding: "22px 24px 0", overflowY: "auto" }}>{children}</div>
      <div style={{ padding: "16px 24px 40px" }}>{footer}</div>
    </div>
  );
}

function FollowH({ children }) {
  return <div style={{ fontFamily: S, fontWeight: 500, fontSize: 28, lineHeight: 1.15, letterSpacing: "-0.01em", color: "#3E342C", marginBottom: 10 }}>{children}</div>;
}
function FollowSub({ children }) {
  return <div style={{ fontSize: 13.5, color: "#6C5F56", marginBottom: 18, lineHeight: 1.6 }}>{children}</div>;
}
function ContinueBtn({ onClick, disabled, label = "Continue" }) {
  return (
    <motion.button className="ci-btn" onClick={disabled ? undefined : onClick}
      animate={{ opacity: disabled ? 0.45 : 1 }} transition={{ duration: 0.15 }}
      style={{ cursor: disabled ? "default" : "pointer", pointerEvents: disabled ? "none" : "auto" }}>
      {label}
    </motion.button>
  );
}

/* 3.5 Problem Tag — pick up to 2 + optional "Something else" text */
function ProblemTagScreen({ selected, setSelected, otherText, setOtherText, onBack, onContinue, onHelp }) {
  const toggle = (tag) => setSelected((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : (prev.length >= 2 ? prev : [...prev, tag]));
  const showOther = selected.includes("Something else");
  return (
    <FollowUpShell title="Follow-up · 1 of 3" onBack={onBack} onHelp={onHelp}
      footer={<ContinueBtn onClick={onContinue} />}>
      <FollowH>What feels hardest today?</FollowH>
      <FollowSub>Pick up to 2. This only appears when your answers suggest extra care would help.</FollowSub>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 18 }}>
        {PROBLEM_TAGS.map((tag) => {
          const on = selected.includes(tag);
          return (
            <button key={tag} onClick={() => toggle(tag)}
              style={{ border: `1px solid ${on ? "#C77E83" : "#E6DBCF"}`, background: on ? "#FBEDEC" : "#fff", color: on ? "#AF636A" : "#6C5F56", fontFamily: F, fontSize: 13, fontWeight: 700, padding: "11px 15px", borderRadius: 30, cursor: "pointer" }}>
              {tag}
            </button>
          );
        })}
      </div>
      {showOther && (
        <div style={{ marginBottom: 18 }}>
          <textarea value={otherText} onChange={(e) => setOtherText(e.target.value.slice(0, 150))} maxLength={150}
            placeholder="Tell us what feels hardest today."
            style={{ width: "100%", minHeight: 72, background: "#fff", border: "1.5px solid #EFE6DC", borderRadius: 16, padding: "12px 16px", fontSize: 13, color: "#3E342C", fontFamily: F, resize: "none", outline: "none", lineHeight: 1.55 }} />
          <div style={{ fontSize: 11, color: "#B0A8A4", textAlign: "right", marginTop: 4 }}>{otherText.length}/150</div>
        </div>
      )}
    </FollowUpShell>
  );
}

/* 3.6 Optional Journal — never blocks */
function JournalScreen({ value, setValue, onBack, onContinue, onHelp }) {
  return (
    <FollowUpShell title="Follow-up · 2 of 3" onBack={onBack} onHelp={onHelp}
      footer={<ContinueBtn onClick={onContinue} />}>
      <FollowH>Would you like to write a little more about today?</FollowH>
      <FollowSub>This is optional. You can leave it blank.</FollowSub>
      <textarea value={value} onChange={(e) => setValue(e.target.value.slice(0, 500))} maxLength={500}
        placeholder="Write anything you want to remember, release, or explain about today."
        style={{ width: "100%", minHeight: 140, background: "#fff", border: "1.5px solid #EFE6DC", borderRadius: 16, padding: "12px 16px", fontSize: 13, color: "#3E342C", fontFamily: F, resize: "none", outline: "none", lineHeight: 1.55 }} />
      <div style={{ fontSize: 11, color: "#B0A8A4", textAlign: "right", marginTop: 4 }}>{value.length}/500</div>
    </FollowUpShell>
  );
}

/* 3.7 Baby Connection — 1-5, framing must not imply judgment */
function BabyConnectionScreen({ value, setValue, onBack, onContinue, onHelp }) {
  return (
    <FollowUpShell title="Follow-up · 3 of 3" onBack={onBack} onHelp={onHelp}
      footer={<ContinueBtn onClick={onContinue} disabled={!value} label="See results" />}>
      <FollowH>How did moments with your baby feel today?</FollowH>
      <FollowSub>However it felt is okay. There's no right answer here.</FollowSub>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {BABY_CONNECTION_LABELS.map((label, idx) => {
          const v = idx + 1;
          const on = value === v;
          return (
            <motion.button key={label} onClick={() => setValue(v)} whileTap={{ scale: 0.98 }}
              style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", background: on ? "#FBEDEC" : "#fff", border: `1.5px solid ${on ? "#C77E83" : "#EFE6DC"}`, borderRadius: 18, cursor: "pointer", textAlign: "left", fontFamily: F, width: "100%", boxShadow: on ? "0 4px 14px rgba(199,126,131,.14)" : "0 2px 6px rgba(80,56,42,.04)" }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0, background: on ? "#C77E83" : "#fff", border: on ? "none" : "1.5px solid #D6CEC8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {on && <svg viewBox="0 0 24 24" width="11" fill="none" stroke="white" strokeWidth="2.8"><path d="M5 13l4 4L19 7"/></svg>}
              </div>
              <div style={{ fontSize: 14, fontWeight: on ? 700 : 500, color: on ? "#AF636A" : "#3E342C" }}>{label}</div>
            </motion.button>
          );
        })}
      </div>
    </FollowUpShell>
  );
}

/* 3.9 Support Need — pattern-triggered only; mother answers Yes/No herself */
function SupportNeedScreen({ onAnswer, onBack, onHelp }) {
  return (
    <FollowUpShell title="Reaching out" onBack={onBack} onHelp={onHelp} footer={null}>
      <FollowH>Do you need our care team to reach out to you today?</FollowH>
      <FollowSub>Your recent check-ins suggest you should not have to carry this alone. It's completely your choice.</FollowSub>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
        <motion.button onClick={() => onAnswer(true)} whileTap={{ scale: 0.97 }}
          style={{ padding: 18, borderRadius: 18, background: "#C77E83", color: "#fff", fontWeight: 700, fontSize: 15, border: 0, boxShadow: "0 12px 22px rgba(175,99,106,.28)", cursor: "pointer", fontFamily: F }}>
          Yes, please reach out
        </motion.button>
        <motion.button onClick={() => onAnswer(false)} whileTap={{ scale: 0.97 }}
          style={{ padding: 17, borderRadius: 18, background: "#fff", color: "#6C5F56", fontWeight: 700, fontSize: 14, border: "1px solid #E6DBCF", cursor: "pointer", fontFamily: F }}>
          Not right now
        </motion.button>
      </div>
    </FollowUpShell>
  );
}

/* Phase 8 — offer one tiny goal after the result; selectable + skippable */
function TinyGoalSection({ level }) {
  const [options] = useState(() => getSuggestedGoals(level, 3));
  const [chosen, setChosen] = useState(null);
  const [skipped, setSkipped] = useState(false);

  if (skipped) {
    return (
      <div style={{ background: "#F6FAF7", border: "1px solid #E8F0EA", borderRadius: 22, padding: "18px 20px" }}>
        <div style={{ fontSize: 13.5, color: "#5A7A64", lineHeight: 1.55 }}>That's okay — rest is a goal too. We'll suggest another tomorrow. 💛</div>
      </div>
    );
  }
  if (chosen) {
    return (
      <div style={{ background: "#F6FAF7", border: "1px solid #E8F0EA", borderRadius: 22, padding: "18px 20px" }}>
        <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9ABBA3", marginBottom: 6 }}>Today's tiny goal</div>
        <div style={{ fontSize: 14.5, fontWeight: 600, color: "#5A7A64" }}>{chosen}</div>
        <div style={{ fontSize: 11.5, color: "#A8C0AD", marginTop: 4 }}>No pressure — it'll be waiting on your home screen.</div>
      </div>
    );
  }
  return (
    <div style={{ background: "#fff", border: "1px solid #EFE6DC", borderRadius: 22, padding: "18px 20px", boxShadow: "0 2px 8px rgba(80,56,42,.05)" }}>
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9C8E83", marginBottom: 4 }}>One tiny goal?</div>
      <div style={{ fontSize: 12.5, color: "#6C5F56", lineHeight: 1.5, marginBottom: 12 }}>Pick one small thing for today — or skip, no pressure.</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {options.map((g) => (
          <motion.button key={g} whileTap={{ scale: 0.98 }} onClick={() => { setDailyGoal(g); setChosen(g); }}
            style={{ textAlign: "left", padding: "12px 14px", borderRadius: 14, border: "1.5px solid #EFE6DC", background: "#FBF6F0", color: "#3E342C", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: F }}>
            {g}
          </motion.button>
        ))}
      </div>
      <button onClick={() => { setDailyGoal("", "skipped"); setSkipped(true); }}
        style={{ display: "block", margin: "12px auto 0", background: "none", border: 0, fontSize: 12.5, fontWeight: 600, color: "#B0A8A4", cursor: "pointer", fontFamily: F }}>
        Skip today
      </button>
    </div>
  );
}

function ResultScreen({ entry, onClose, onNeedHelp }) {
  const support = getMoodSupportSummary([entry]);
  const meta = getSupportLevelMeta(support.level);
  const badgeColor = {
    steady: { bg: "#E7EFE8", color: "#577A62" },
    gentle: { bg: "#F7EDD8", color: "#9A7322" },
    extra: { bg: "#FEF0E7", color: "#C2460A" },
    immediate: { bg: "#FEECEC", color: "#B91C1C" },
  }[support.level] || { bg: "#E7EFE8", color: "#577A62" };

  const summaryRows = [
    ["Mood", entry.moodScore],
    ["Sleep", entry.sleepScore],
    ["Energy", entry.energyScore],
    ["Worry", entry.worryScore],
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: F }}>
      <div style={{ background: "linear-gradient(160deg,#F4C9A8,#E2A0A4 50%,#D7A0AB)", padding: "0 28px 44px", position: "relative", overflow: "hidden", flexShrink: 0 }}>
        <div style={{ position: "absolute", width: 220, height: 220, borderRadius: "50%", right: -50, top: -70, background: "radial-gradient(circle,rgba(255,240,214,.8),transparent 70%)" }} />
        <div style={{ position: "relative", display: "inline-flex", margin: "24px 0 20px" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 9, fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#fff", background: "rgba(255,255,255,.25)", padding: "8px 16px", borderRadius: 30 }}>
            <svg viewBox="0 0 24 24" width="13" fill="none" stroke="currentColor" strokeWidth="2.8"><path d="M5 13l4 4L19 7"/></svg>
            Check-in saved
          </span>
        </div>
        <div style={{ fontFamily: S, fontWeight: 500, fontSize: 36, lineHeight: 1.05, letterSpacing: "-0.015em", color: "#4A2F2C", position: "relative", marginBottom: 12 }}>
          Your support level
          <em style={{ display: "block", fontStyle: "italic" }}>is {support.label}.</em>
        </div>
        <div style={{ position: "relative", display: "inline-flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontFamily: S, fontSize: 44, fontWeight: 500, color: "#4A2F2C", letterSpacing: "-0.02em" }}>{entry.composite?.toFixed(1) ?? "-"}</span>
          <span style={{ fontSize: 16, fontWeight: 500, color: "rgba(74,47,44,.5)" }}>/ 5</span>
        </div>
      </div>

      <div style={{ flex: 1, background: "#FBF6F0", borderRadius: "26px 26px 0 0", marginTop: -16, padding: "24px 22px 40px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 13 }}>
        <div style={{ background: "#fff", border: "1px solid #EFE6DC", borderRadius: 22, padding: "18px 20px", boxShadow: "0 2px 8px rgba(80,56,42,.05)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "5px 12px", borderRadius: 30, background: badgeColor.bg, color: badgeColor.color }}>
              {support.label}
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#9C8E83" }}>Daily Check-in</span>
          </div>
          <p style={{ fontSize: 13.5, color: "#6C5F56", lineHeight: 1.6, marginBottom: 10 }}>{support.message}</p>
          <p style={{ fontSize: 12.5, color: "#3E342C", fontWeight: 700 }}>Next step: {support.action}</p>
        </div>

        <div style={{ background: "#fff", border: "1px solid #EFE6DC", borderRadius: 22, padding: "18px 20px", boxShadow: "0 2px 8px rgba(80,56,42,.05)" }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9C8E83", marginBottom: 12 }}>
            Today at a glance
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
            {summaryRows.map(([label, value]) => (
              <div key={label} style={{ background: "#FBF6F0", border: "1px solid #EFE6DC", borderRadius: 16, padding: "12px 14px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#9C8E83", marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#3E342C" }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {entry.supportRequest && (
          <div style={{ background: "#FEECEC", border: "1px solid #F5C2C2", borderRadius: 20, padding: "18px 20px" }}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#B91C1C", marginBottom: 8 }}>
              Support request flagged
            </div>
            <p style={{ fontSize: 13, color: "#7F1D1D", lineHeight: 1.55 }}>
              Your pattern suggests you should not carry this alone. Open help if you want a guided next step.
            </p>
          </div>
        )}

        <TinyGoalSection level={support.level} />

        <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingBottom: 24 }}>
          <button
            onClick={onClose}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, width: "100%", padding: 16, borderRadius: 18, background: "#C77E83", color: "#fff", fontWeight: 700, fontSize: 15, border: 0, boxShadow: "0 12px 22px rgba(175,99,106,.28)", cursor: "pointer", fontFamily: F }}
          >
            Back home
          </button>
          <button
            onClick={onNeedHelp}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, width: "100%", padding: 15, borderRadius: 18, background: "#fff", color: "#6C5F56", fontWeight: 700, fontSize: 14, border: "1px solid #E6DBCF", cursor: "pointer", fontFamily: F }}
          >
            I Need Help
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CheckInFlow({ onClose, onNeedHelp }) {
  const draft = useMemo(() => getCheckinDraft(), []);
  const [step, setStep] = useState(() => (draft?.step && draft.step >= 1 && draft.step <= 4 ? draft.step : 1));
  const [answers, setAnswers] = useState(() => draft?.answers ?? { moodScore: null, sleepScore: null, energyScore: null, worryScore: null });
  // follow-up state (spec 3.5–3.7) + support need answer (3.9)
  const [problemTags, setProblemTags] = useState([]);
  const [problemOther, setProblemOther] = useState("");
  const [journalEntry, setJournalEntry] = useState("");
  const [babyConnection, setBabyConnection] = useState(null);
  const [supportRequest, setSupportRequest] = useState(null);
  const [resultEntry, setResultEntry] = useState(null);

  // Persist an in-progress draft (core steps only) so the day's check-in can resume after closing.
  useEffect(() => {
    if (step >= 1 && step <= 4) saveCheckinDraft({ step, answers });
  }, [step, answers]);

  const currentQuestion = useMemo(() => CORE_QUESTIONS.find((item) => item.step === step), [step]);
  const composite = getComposite(answers);
  // "any core indicator = 1" uses worry's adjusted value (6 - raw), since worry is reversed.
  const shouldFollowUp = Boolean(composite !== null && (composite < 2.5 || [answers.moodScore, answers.sleepScore, answers.energyScore, 6 - answers.worryScore].includes(1)));

  const localDateKey = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const setAnswer = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step < 4) { setStep(step + 1); return; }
    if (step === 4) {
      if (shouldFollowUp) { setStep(5); return; }
      if (isSupportNeedTriggered(answers)) { setStep(8); return; }
      finish(); return;
    }
    if (step === 5) { setStep(6); return; }
    if (step === 6) { setStep(7); return; }
    if (step === 7) {
      if (isSupportNeedTriggered(answers)) { setStep(8); return; }
      finish(); return;
    }
  };

  const finish = (supportRequestValue = supportRequest) => {
    const followUp = shouldFollowUp;
    const patch = {
      moodScore: answers.moodScore,
      sleepScore: answers.sleepScore,
      energyScore: answers.energyScore,
      worryScore: answers.worryScore,
      followUpTriggered: followUp,
      supportRequest: supportRequestValue === true,
      problemTags: followUp ? problemTags : [],
      problemOtherText: followUp && problemTags.includes("Something else") ? problemOther.trim() : "",
      journalEntry: followUp ? journalEntry.trim() : "",
      babyConnectionScore: followUp ? babyConnection : null,
      dateKey: localDateKey(),
    };

    const nextHistory = upsertMoodEntry(patch);
    const saved = nextHistory.find((entry) => entry.dateKey === patch.dateKey) || getMoodEntryByDateKey(patch.dateKey);
    clearCheckinDraft();
    setResultEntry(saved || null);
    setStep(9);
  };

  const handleSupportAnswer = (value) => {
    setSupportRequest(value);
    finish(value);
  };

  const handleBack = () => {
    if (step === 1 || step === 9) { onClose?.(); return; }
    if (step === 8) { setStep(shouldFollowUp ? 7 : 4); return; }
    if (step === 5) { setStep(4); return; }
    setStep((prev) => Math.max(1, prev - 1));
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "#FBF6F0", display: "flex", flexDirection: "column", maxWidth: 448, margin: "0 auto", fontFamily: F }}>
      <AnimatePresence mode="wait">
        {step >= 1 && step <= 4 && currentQuestion && (
          <motion.div key="core" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }} style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", background: "#FBF6F0" }}>
            {/* Persistent chrome — header (back / Daily Check-in / Help) stays mounted across questions */}
            <Header step={currentQuestion.step} total={currentQuestion.total} onBack={handleBack} onHelp={onNeedHelp} />

            {/* Only the question body animates per step */}
            <div style={{ flex: 1, padding: "22px 24px 0", overflowY: "auto" }}>
              <AnimatePresence mode="wait">
                <QuestionBody
                  key={step}
                  question={currentQuestion}
                  value={answers[currentQuestion.key]}
                  onSelect={(value) => setAnswer(currentQuestion.key, value)}
                />
              </AnimatePresence>
            </div>

            {/* Persistent footer — Continue stays mounted, only its enabled state changes */}
            <div style={{ padding: "16px 24px 40px" }}>
              <motion.button
                className="ci-btn"
                onClick={answers[currentQuestion.key] ? handleNext : undefined}
                animate={{ opacity: answers[currentQuestion.key] ? 1 : 0.45 }}
                transition={{ duration: 0.15 }}
                style={{ cursor: answers[currentQuestion.key] ? "pointer" : "default", pointerEvents: answers[currentQuestion.key] ? "auto" : "none" }}
              >
                {currentQuestion.step < currentQuestion.total ? "Continue" : (shouldFollowUp ? "Continue" : "See results")}
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div key="ptag" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }} style={{ flex: 1 }}>
            <ProblemTagScreen selected={problemTags} setSelected={setProblemTags} otherText={problemOther} setOtherText={setProblemOther} onBack={handleBack} onContinue={handleNext} onHelp={onNeedHelp} />
          </motion.div>
        )}

        {step === 6 && (
          <motion.div key="journal" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }} style={{ flex: 1 }}>
            <JournalScreen value={journalEntry} setValue={setJournalEntry} onBack={handleBack} onContinue={handleNext} onHelp={onNeedHelp} />
          </motion.div>
        )}

        {step === 7 && (
          <motion.div key="babyconn" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }} style={{ flex: 1 }}>
            <BabyConnectionScreen value={babyConnection} setValue={setBabyConnection} onBack={handleBack} onContinue={handleNext} onHelp={onNeedHelp} />
          </motion.div>
        )}

        {step === 8 && (
          <motion.div key="support" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }} style={{ flex: 1 }}>
            <SupportNeedScreen onAnswer={handleSupportAnswer} onBack={handleBack} onHelp={onNeedHelp} />
          </motion.div>
        )}

        {step === 9 && resultEntry && (
          <motion.div key="result" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }} style={{ flex: 1 }}>
            <ResultScreen entry={resultEntry} onClose={onClose} onNeedHelp={onNeedHelp} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

