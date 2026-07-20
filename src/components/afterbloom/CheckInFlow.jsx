import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CANONICAL_PROBLEM_TAGS, getMoodEntryByDateKey, getMoodSupportSummary, getTodaysMoodEntry, upsertMoodEntry, saveCheckinDraft, getCheckinDraft, clearCheckinDraft, isPhase2Triggered } from "../../lib/mood-data";
import { getSuggestedGoals, setDailyGoal } from "../../lib/goals-data";
import { LAYERS, LAYOUT, EASE_OUT_QUINT, MoodFace } from "../../lib/theme.jsx";
import { useBodyScrollLock } from "../../hooks/use-body-scroll-lock";
import { useLang } from "../../lib/i18n";

import { ArrowLeft12Filled } from "@/components/ui/fluent-arrow-left-12-filled";

const F = "'Plus Jakarta Sans', system-ui, sans-serif";
const S = "'Newsreader', serif";

const CORE_QUESTIONS_BASE = [
  {
    key: "moodScore",
    step: 1,
    total: 4,
  },
  {
    key: "sleepScore",
    step: 2,
    total: 4,
  },
  {
    key: "energyScore",
    step: 3,
    total: 4,
  },
  {
    key: "worryScore",
    step: 4,
    total: 4,
    reverse: true, // option 1 ("none") is the calm/positive end, option 5 ("overwhelmed") the heavy end
  },
];

function Progress({ step, total }) {
  return (
    <div style={{ display: "flex", gap: 7, justifyContent: "center" }}>
      {Array.from({ length: total }, (_, i) => i + 1).map((i) => (
        <motion.div
          key={i}
          animate={{ width: i === step ? 22 : 6, background: i === step ? "#C77E83" : i < step ? "#E8C4C4" : "#E6DBCF" }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          style={{ height: 6, borderRadius: 18 }}
        />
      ))}
    </div>
  );
}

function Header({ step, total, onBack, onHelp, showBack = true, title, helpLabel = "Help" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px 8px", gap: 8 }}>
      {showBack ? (
        <motion.button
          onClick={onBack}
          whileTap={{ scale: 0.9 }}
          aria-label="Go back"
          style={{ width: 44, height: 44, borderRadius: "50%", background: "#fff", border: "1px solid #EFE6DC", display: "flex", alignItems: "center", justifyContent: "center", color: "#6C5F56", cursor: "pointer", fontSize: 16, fontWeight: 700, fontFamily: F }}
        >
          <ArrowLeft12Filled style={{ width: 16, height: 16 }} />
        </motion.button>
      ) : (
        <div style={{ width: 44 }} />
      )}

      <div style={{ flex: 1, minWidth: 0, textAlign: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#786A5C", marginBottom: 6 }}>
          {title}
        </div>
        <Progress step={step} total={total} />
      </div>

      <button
        onClick={onHelp}
        style={{ width: 44, height: 44, borderRadius: "50%", background: "#F6E2E1", border: 0, color: "#9A4C53", fontSize: 11, fontWeight: 800, cursor: "pointer", lineHeight: 1, padding: 0 }}
      >
        {helpLabel}
      </button>
    </div>
  );
}

/* Body only — title/subtitle/help fade up, then options rise together as one group.
   Keyed by step in the parent so it replays per question, never on each answer tap. */
function QuestionBody({ question, value, onSelect, selectedStr }) {
  const labels = Array.isArray(question?.labels) ? question.labels : [];
  const descriptions = Array.isArray(question?.descriptions) ? question.descriptions : [];
  const reverse = Boolean(question?.reverse);
  const selectedLabel = value ? labels[value - 1] : null;
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
          {question?.title ?? ""}
        </div>
        <div style={{ fontSize: 13.5, color: "#6C5F56", marginBottom: question.help ? 10 : 22, lineHeight: 1.6 }}>
          {question?.subtitle ?? ""}
        </div>
        {question?.help && (
          <div style={{ fontSize: 12, color: "#786A5C", marginBottom: 22, lineHeight: 1.5 }}>
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
        {labels.map((label, idx) => {
          const optionValue = idx + 1;
          const on = value === optionValue;
          const level = reverse ? labels.length - idx : idx + 1;
          const desc = descriptions[idx];
          return (
            <motion.button
              key={label}
              onClick={() => onSelect(optionValue)}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 420, damping: 22 }}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "13px 16px",
                background: on ? "#FBEDEC" : "#fff",
                border: `1.5px solid ${on ? "#C77E83" : "#EFE6DC"}`,
                borderRadius: 14, cursor: "pointer", textAlign: "left",
                fontFamily: F, width: "100%",
                boxShadow: on ? "0 4px 14px rgba(199,126,131,.14)" : "0 2px 6px rgba(80,56,42,.04)",
              }}
            >
              <MoodFace level={level} selected={on} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: on ? 700 : 600, color: on ? "#AF636A" : "#3E342C", lineHeight: 1.25 }}>{label}</div>
                {desc && (
                  <div style={{ fontSize: 12.5, color: on ? "#B07A7E" : "#8C7F74", marginTop: 2, lineHeight: 1.35 }}>{desc}</div>
                )}
              </div>
              <motion.div
                animate={{ scale: on ? 1 : 0, opacity: on ? 1 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 24 }}
                style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, background: "#C77E83", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <svg viewBox="0 0 24 24" width="11" fill="none" stroke="white" strokeWidth="2.8">
                  <path d="M5 13l4 4L19 7"/>
                </svg>
              </motion.div>
            </motion.button>
          );
        })}
      </motion.div>

      {selectedLabel && (
        <div style={{ marginTop: 16, fontSize: 12.5, color: "#6C5F56" }}>
          {selectedStr} <strong>{selectedLabel}</strong>
        </div>
      )}
    </motion.div>
  );
}

/* ── Follow-up shell (header without the core 4-dot progress) ── */
function FollowUpShell({ title, onBack, onHelp, children, footer }) {
  const { t } = useLang();
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0, overflow: "hidden", background: "#FBF6F0", fontFamily: F }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px 8px", gap: 8 }}>
        <motion.button onClick={onBack} whileTap={{ scale: 0.9 }} aria-label="Go back"
          style={{ width: 44, height: 44, borderRadius: "50%", background: "#fff", border: "1px solid #EFE6DC", display: "flex", alignItems: "center", justifyContent: "center", color: "#6C5F56", cursor: "pointer", fontSize: 16, fontWeight: 700, fontFamily: F }}>
          <ArrowLeft12Filled style={{ width: 16, height: 16 }} />
        </motion.button>
        <div style={{ flex: 1, minWidth: 0, textAlign: "center", fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#786A5C" }}>{title}</div>
        <button onClick={onHelp} style={{ width: 44, height: 44, borderRadius: "50%", background: "#F6E2E1", border: 0, color: "#9A4C53", fontSize: 11, fontWeight: 800, cursor: "pointer", lineHeight: 1, padding: 0 }}>{t.checkin.help}</button>
      </div>
      <div style={{ flex: 1, minHeight: 0, padding: `22px 24px ${LAYOUT.flowScrollPadding}`, overflowY: "auto", WebkitOverflowScrolling: "touch", overscrollBehavior: "contain" }}>{children}</div>
      <div style={{ padding: `16px 24px ${LAYOUT.flowFooterPadding}` }}>{footer}</div>
    </div>
  );
}

function FollowH({ children }) {
  return <div style={{ fontFamily: S, fontWeight: 500, fontSize: 28, lineHeight: 1.15, letterSpacing: "-0.01em", color: "#3E342C", marginBottom: 10 }}>{children}</div>;
}
function FollowSub({ children }) {
  return <div style={{ fontSize: 13.5, color: "#6C5F56", marginBottom: 18, lineHeight: 1.6 }}>{children}</div>;
}
function ContinueBtn({ onClick, disabled, label }) {
  return (
    <motion.button className="ci-btn" onClick={disabled ? undefined : onClick}
      animate={{ opacity: disabled ? 0.45 : 1 }} transition={{ duration: 0.15 }}
      style={{ cursor: disabled ? "default" : "pointer", pointerEvents: disabled ? "none" : "auto" }}>
      {label}
    </motion.button>
  );
}

/* 3.5 Problem Tag — pick up to 2 + optional "Something else" text */
function ProblemTagScreen({ selected, setSelected, otherText, setOtherText, onBack, onContinue, onHelp, problemTags, lang, continueLabel = "Continue", tagScreenStrings, headerTitle = "Follow-up · 1 of 3" }) {
  const toggle = (tag) => setSelected((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : (prev.length >= 2 ? prev : [...prev, tag]));
  const showOther = selected.includes("other");
  return (
    <FollowUpShell title={headerTitle} onBack={onBack} onHelp={onHelp}
      footer={<ContinueBtn onClick={onContinue} disabled={showOther && !otherText.trim()} label={continueLabel} />}>
      <FollowH>{tagScreenStrings?.title ?? ""}</FollowH>
      <FollowSub>{tagScreenStrings?.subtitle ?? ""}</FollowSub>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 18 }}>
        {problemTags.map((tag) => {
          const on = selected.includes(tag.id);
          return (
            <button key={tag.id} onClick={() => toggle(tag.id)}
              style={{ border: `1px solid ${on ? "#C77E83" : "#E6DBCF"}`, background: on ? "#FBEDEC" : "#fff", color: on ? "#AF636A" : "#6C5F56", fontFamily: F, fontSize: 13, fontWeight: 700, padding: "11px 15px", borderRadius: 18, cursor: "pointer" }}>
              {lang === "en" ? tag.en : tag.th}
            </button>
          );
        })}
      </div>
      {showOther && (
        <div style={{ marginBottom: 18 }}>
          <textarea value={otherText} onChange={(e) => setOtherText(e.target.value.slice(0, 150))} maxLength={150}
            placeholder={tagScreenStrings?.otherPlaceholder ?? ""}
            style={{ width: "100%", minHeight: 72, background: "#fff", border: "1.5px solid #EFE6DC", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#3E342C", fontFamily: F, resize: "none", outline: "none", lineHeight: 1.55 }} />
          <div style={{ fontSize: 11, color: "#B0A8A4", textAlign: "right", marginTop: 4 }}>{otherText.length}/150</div>
        </div>
      )}
    </FollowUpShell>
  );
}

/* 3.6 Optional Journal — never blocks */
function JournalScreen({ value, setValue, onBack, onContinue, onHelp, continueLabel = "Continue", journalStrings, headerTitle = "Follow-up · 2 of 3" }) {
  return (
    <FollowUpShell title={headerTitle} onBack={onBack} onHelp={onHelp}
      footer={<ContinueBtn onClick={onContinue} label={continueLabel} />}>
      <FollowH>{journalStrings?.title ?? ""}</FollowH>
      <FollowSub>{journalStrings?.subtitle ?? ""}</FollowSub>
      <textarea value={value} onChange={(e) => setValue(e.target.value.slice(0, 500))} maxLength={500}
        placeholder={journalStrings?.placeholder ?? ""}
        style={{ width: "100%", minHeight: 140, background: "#fff", border: "1.5px solid #EFE6DC", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#3E342C", fontFamily: F, resize: "none", outline: "none", lineHeight: 1.55 }} />
      <div style={{ fontSize: 11, color: "#B0A8A4", textAlign: "right", marginTop: 4 }}>{value.length}/500</div>
    </FollowUpShell>
  );
}

/* 3.7 Baby Connection — 1-5, framing must not imply judgment */
function BabyConnectionScreen({ value, setValue, onBack, onContinue, onHelp, babyLabels, seeResultsLabel = "See results", babyScreenStrings, headerTitle = "Follow-up · 3 of 3" }) {
  return (
    <FollowUpShell title={headerTitle} onBack={onBack} onHelp={onHelp}
      footer={<ContinueBtn onClick={onContinue} disabled={!value} label={seeResultsLabel} />}>
      <FollowH>{babyScreenStrings?.title ?? ""}</FollowH>
      <FollowSub>{babyScreenStrings?.subtitle ?? ""}</FollowSub>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {babyLabels.map((label, idx) => {
          const v = idx + 1;
          const on = value === v;
          return (
            <motion.button key={label} onClick={() => setValue(v)} whileTap={{ scale: 0.98 }}
              style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", background: on ? "#FBEDEC" : "#fff", border: `1.5px solid ${on ? "#C77E83" : "#EFE6DC"}`, borderRadius: 12, cursor: "pointer", textAlign: "left", fontFamily: F, width: "100%", boxShadow: on ? "0 4px 14px rgba(199,126,131,.14)" : "0 2px 6px rgba(80,56,42,.04)" }}>
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

/* Phase 8 — offer one tiny goal after the result; selectable + skippable */
function TinyGoalSection({ level, goalStrings }) {
  const strings = goalStrings ?? {
    promptTitle: "",
    promptBody: "",
    skip: "",
    todayLabel: "",
    noPressure: "",
    skipMsg: "",
  };
  const options = Array.isArray(strings.options) ? strings.options : getSuggestedGoals(level);
  const [chosen, setChosen] = useState(null);
  const [skipped, setSkipped] = useState(false);

  if (skipped) {
    return (
      <div style={{ background: "#F6FAF7", border: "1px solid #E8F0EA", borderRadius: 14, padding: "18px 20px" }}>
        <div style={{ fontSize: 13.5, color: "#5A7A64", lineHeight: 1.55 }}>{strings.skipMsg}</div>
      </div>
    );
  }
  if (chosen) {
    return (
      <div style={{ background: "#F6FAF7", border: "1px solid #E8F0EA", borderRadius: 14, padding: "18px 20px" }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "#9ABBA3", marginBottom: 6 }}>{strings.todayLabel}</div>
        <div style={{ fontSize: 14.5, fontWeight: 600, color: "#5A7A64" }}>{chosen}</div>
        <div style={{ fontSize: 11.5, color: "#A8C0AD", marginTop: 4 }}>{strings.noPressure}</div>
      </div>
    );
  }
  return (
    <div style={{ background: "#fff", border: "1px solid #EFE6DC", borderRadius: 14, padding: "18px 20px", boxShadow: "0 2px 8px rgba(80,56,42,.05)" }}>
      <div style={{ fontSize: 12.5, fontWeight: 800, color: "#7A453F", marginBottom: 4 }}>{strings.promptTitle}</div>
      <div style={{ fontSize: 12.5, color: "#6C5F56", lineHeight: 1.5, marginBottom: 12 }}>{strings.promptBody}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {options.map((g) => (
          <motion.button key={g} whileTap={{ scale: 0.98 }} onClick={() => { setDailyGoal(g); setChosen(g); }}
            style={{ textAlign: "left", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #EFE6DC", background: "#FBF6F0", color: "#3E342C", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: F }}>
            {g}
          </motion.button>
        ))}
      </div>
      <button onClick={() => { setDailyGoal("", "skipped"); setSkipped(true); }}
        style={{ display: "block", margin: "12px auto 0", background: "none", border: 0, fontSize: 12.5, fontWeight: 600, color: "#B0A8A4", cursor: "pointer", fontFamily: F }}>
        {strings.skip}
      </button>
    </div>
  );
}

function ResultScreen({ entry, onClose, onNeedHelp, onNavigate, onEpds, onAcknowledgeSafe, resultStrings, summaryLabels, goalStrings }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const { t } = useLang();
  const support = getMoodSupportSummary([entry]);
  const needsSupportNow = support.level === "immediate" || support.level === "extra";
  const badgeColor = {
    steady: { bg: "#E7EFE8", color: "#577A62" },
    gentle: { bg: "#F7EDD8", color: "#9A7322" },
    extra: { bg: "#FEF0E7", color: "#C2460A" },
    immediate: { bg: "#FEECEC", color: "#B91C1C" },
  }[support.level] || { bg: "#E7EFE8", color: "#577A62" };

  const summaryRows = [
    [summaryLabels.mood, entry.moodScore],
    [summaryLabels.sleep, entry.sleepScore],
    [summaryLabels.energy, entry.energyScore],
    [summaryLabels.worry, entry.worryScore],
  ];
  const actions = Array.isArray(resultStrings.actions?.[support.level]) ? resultStrings.actions[support.level] : [];
  const supportLabel = t.supportLevels[support.level]?.label ?? support.label;
  const [supportLevelBefore, supportLevelAfter] = (resultStrings.supportLevelIs ?? "{{level}}").split("{{level}}");
  const runAction = (key) => {
    if (key === "journey") onNavigate?.("journey");
    if (key === "tiny_goal") setDetailsOpen(true);
    if (key === "breathing") onNeedHelp?.("safe");
    if (key === "epds") onEpds?.();
    if (key === "trusted") onNeedHelp?.("trusted");
    if (key === "safe_person") onAcknowledgeSafe?.();
    if (key === "care_circle") onNavigate?.("therapy");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0, overflow: "hidden", fontFamily: F }}>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", WebkitOverflowScrolling: "touch", overscrollBehavior: "contain" }}>
      <div style={{ background: "#F2E4DE", padding: "0 28px 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "relative", display: "inline-flex", margin: "24px 0 20px" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 9, fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#fff", background: "rgba(255,255,255,.25)", padding: "8px 16px", borderRadius: 18 }}>
            <svg viewBox="0 0 24 24" width="13" fill="none" stroke="currentColor" strokeWidth="2.8"><path d="M5 13l4 4L19 7"/></svg>
            {resultStrings.savedBadge}
          </span>
        </div>
        <div style={{ fontFamily: S, fontWeight: 500, fontSize: 36, lineHeight: 1.05, letterSpacing: "-0.015em", color: "#4A2F2C", position: "relative", marginBottom: 12 }}>
          <span style={{ display: "block" }}>{resultStrings.supportLevelTitle}</span>
          <span style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, marginTop: 10, fontFamily: F, fontSize: 15, fontWeight: 700, lineHeight: 1.45, letterSpacing: 0, color: "#6B4641" }}>
            {supportLevelBefore}
            <strong style={{ display: "inline-block", padding: "7px 13px", borderRadius: 18, background: badgeColor.bg, color: badgeColor.color, fontSize: 19, fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.01em" }}>
              {supportLabel}
            </strong>
            {supportLevelAfter}
          </span>
        </div>
        <div style={{ position: "relative", fontSize: 13.5, fontWeight: 700, color: "rgba(74,47,44,.68)", lineHeight: 1.5, maxWidth: 280 }}>
          {resultStrings.numbersNote}
        </div>
        <div aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 64, background: "linear-gradient(to bottom, transparent, #FBF6F0)", pointerEvents: "none" }} />
      </div>

      <div style={{ background: "#FBF6F0", borderRadius: "18px 18px 0 0", marginTop: -16, padding: "24px 22px", display: "flex", flexDirection: "column", gap: 13 }}>
        <div style={{ background: "#fff", border: "1px solid #EFE6DC", borderRadius: 14, padding: "18px 20px", boxShadow: "0 2px 8px rgba(80,56,42,.05)" }}>
          <span style={{ display: "inline-block", fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "5px 12px", borderRadius: 18, background: badgeColor.bg, color: badgeColor.color, marginBottom: 10 }}>
            {supportLabel}
          </span>
          <p style={{ fontFamily: S, fontSize: 18, fontWeight: 500, color: "#3E342C", lineHeight: 1.45, whiteSpace: "pre-line", marginBottom: 12 }}>{t.supportLevels[support.level]?.message ?? support.message}</p>
          <p style={{ fontSize: 12.5, color: "#3E342C", fontWeight: 700 }}>{(resultStrings.nextStep ?? "{{action}}").replace("{{action}}", t.supportLevels[support.level]?.action ?? support.action)}</p>
        </div>

        <div style={{ display: "grid", gap: 9 }}>
          {actions.map((action) => action.key === "emergency" ? (
            <a key={action.key} href="tel:1323" style={{ minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 12, background: "#B91C1C", color: "#fff", fontSize: 13, fontWeight: 800, textDecoration: "none" }}>
              {action.label}
            </a>
          ) : (
            <button key={action.key} type="button" onClick={() => runAction(action.key)} style={{ minHeight: 44, padding: "11px 14px", borderRadius: 12, border: "1px solid #E6DBCF", background: action.key === "epds" ? "#C77E83" : "#fff", color: action.key === "epds" ? "#fff" : "#6C5F56", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: F }}>
              {action.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setDetailsOpen((open) => !open)}
          aria-expanded={detailsOpen}
          aria-controls="checkin-details"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, width: "100%", minHeight: 44, padding: "13px 16px", borderRadius: 12, border: "1px solid #EFE6DC", background: "#fff", color: "#7A453F", fontSize: 12.5, fontWeight: 800, cursor: "pointer", fontFamily: F }}
        >
          {detailsOpen ? resultStrings.hideNumbers : resultStrings.seeNumbers}
          <svg viewBox="0 0 24 24" width="13" fill="none" stroke="currentColor" strokeWidth="2.4" style={{ transform: detailsOpen ? "rotate(180deg)" : "none", transition: "transform 180ms ease" }}>
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>

        <AnimatePresence initial={false}>
          {detailsOpen && (
            <motion.div
              id="checkin-details"
              initial={reduceMotion ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              style={{ display: "flex", flexDirection: "column", gap: 13 }}
            >
              <div style={{ background: "#fff", border: "1px solid #EFE6DC", borderRadius: 14, padding: "18px 20px", boxShadow: "0 2px 8px rgba(80,56,42,.05)" }}>
                <div style={{ fontSize: 12.5, fontWeight: 800, color: "#7A453F", marginBottom: 12 }}>
                  {resultStrings.todayAtAGlance}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
                  {summaryRows.map(([label, value]) => (
                    <div key={label} style={{ background: "#FBF6F0", border: "1px solid #EFE6DC", borderRadius: 10, padding: "12px 14px" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#786A5C", marginBottom: 4 }}>{label}</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "#3E342C" }}>{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <TinyGoalSection level={support.level} goalStrings={goalStrings} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      </div>

      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 10, flexShrink: 0, padding: `14px 22px ${LAYOUT.flowFooterPadding}`, background: "#FBF6F0" }}>
        <div aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, top: -20, height: 20, background: "linear-gradient(to top, #FBF6F0, transparent)", pointerEvents: "none" }} />
        {needsSupportNow && (
          <button
            onClick={onNeedHelp}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, width: "100%", padding: 16, borderRadius: 12, background: "#B91C1C", color: "#fff", fontWeight: 800, fontSize: 15, border: 0, boxShadow: "0 10px 18px rgba(185,28,28,.18)", cursor: "pointer", fontFamily: F }}
          >
            {resultStrings.iNeedHelp}
          </button>
        )}
        <button
          onClick={onClose}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, width: "100%", padding: needsSupportNow ? 15 : 16, borderRadius: 12, background: needsSupportNow ? "#fff" : "#C77E83", color: needsSupportNow ? "#6C5F56" : "#fff", fontWeight: needsSupportNow ? 700 : 800, fontSize: needsSupportNow ? 14 : 15, border: needsSupportNow ? "1px solid #E6DBCF" : 0, boxShadow: needsSupportNow ? "none" : "0 12px 22px rgba(175,99,106,.28)", cursor: "pointer", fontFamily: F }}
        >
          {resultStrings.backHome}
        </button>
        {!needsSupportNow && (
          <button
            onClick={onNeedHelp}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, width: "100%", padding: 15, borderRadius: 12, background: "#fff", color: "#6C5F56", fontWeight: 700, fontSize: 14, border: "1px solid #E6DBCF", cursor: "pointer", fontFamily: F }}
          >
            {resultStrings.iNeedHelp}
          </button>
        )}
      </div>
    </div>
  );
}

export default function CheckInFlow({ onClose, onNeedHelp, onNavigate, onEpds, onAcknowledgeSafe }) {
  useBodyScrollLock();
  const reduceMotion = useReducedMotion();
  const { t, lang } = useLang();

  // Build questions with merged translations
  const questions = useMemo(() =>
    CORE_QUESTIONS_BASE.map((q, i) => {
      const localized = t.checkin?.questions?.[i] ?? {};
      return {
        ...q,
        ...localized,
        title: localized.title ?? "",
        subtitle: localized.subtitle ?? "",
        help: localized.help ?? "",
        labels: Array.isArray(localized.labels) ? localized.labels : [],
      };
    }),
    [t.checkin?.questions]
  );

  // Get translated data
  const problemTagsList = CANONICAL_PROBLEM_TAGS;
  const babyConnectionLabels = useMemo(() => (Array.isArray(t.checkin?.babyConnection?.labels) ? t.checkin.babyConnection.labels : []), [t.checkin?.babyConnection?.labels]);
  const summaryLabels = useMemo(() => (t.checkin?.result?.summaryLabels ?? { mood: "Mood", sleep: "Sleep", energy: "Energy", worry: "Worry" }), [t.checkin?.result?.summaryLabels]);
  const resultStrings = useMemo(() => (t.checkin?.result ?? {}), [t.checkin?.result]);
  const goalStrings = useMemo(() => (t.checkin?.tinyGoal ?? {}), [t.checkin?.tinyGoal]);
  const followUpStrings = useMemo(() => (t.checkin?.followUp ?? {}), [t.checkin?.followUp]);

  const draft = useMemo(() => getCheckinDraft(), []);
  const savedEntry = useMemo(() => getTodaysMoodEntry(), []);
  const [step, setStep] = useState(() => (draft?.step && draft.step >= 1 && draft.step <= 4 ? draft.step : 1));
  const [answers, setAnswers] = useState(() => draft?.answers ?? {
    moodScore: savedEntry?.moodScore ?? null,
    sleepScore: savedEntry?.sleepScore ?? null,
    energyScore: savedEntry?.energyScore ?? null,
    worryScore: savedEntry?.worryScore ?? null,
  });
  // follow-up state (spec 3.5–3.7) + support need answer (3.9)
  const [problemTags, setProblemTags] = useState(() => savedEntry?.problemTags ?? []);
  const [problemOther, setProblemOther] = useState(() => savedEntry?.problemOtherText ?? "");
  const [journalEntry, setJournalEntry] = useState(() => savedEntry?.journalEntry ?? "");
  const [babyConnection, setBabyConnection] = useState(() => savedEntry?.babyConnectionScore ?? null);
  const [resultEntry, setResultEntry] = useState(null);

  // Persist an in-progress draft (core steps only) so the day's check-in can resume after closing.
  useEffect(() => {
    if (step >= 1 && step <= 4) saveCheckinDraft({ step, answers });
  }, [step, answers]);

  const currentQuestion = useMemo(() => questions.find((item) => item.step === step), [step, questions]);
  const shouldFollowUp = isPhase2Triggered(answers);

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
      finish(); return;
    }
    if (step === 5) { setStep(6); return; }
    if (step === 6) { setStep(7); return; }
    if (step === 7) {
      finish(); return;
    }
  };

  const finish = () => {
    const followUp = shouldFollowUp;
    const patch = {
      moodScore: answers.moodScore,
      sleepScore: answers.sleepScore,
      energyScore: answers.energyScore,
      worryScore: answers.worryScore,
      followUpTriggered: followUp,
      problemTags: followUp ? problemTags : [],
      problemOtherText: followUp && problemTags.includes("other") ? problemOther.trim() : "",
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

  const handleBack = () => {
    if (step === 1 || step === 9) { onClose?.(); return; }
    if (step === 5) { setStep(4); return; }
    setStep((prev) => Math.max(1, prev - 1));
  };

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.32, ease: EASE_OUT_QUINT } }}
      exit={reduceMotion ? { opacity: 0, transition: { duration: 0.15 } } : { opacity: 0, y: "100%", transition: { duration: 0.24, ease: EASE_OUT_QUINT } }}
      role="dialog"
      aria-modal="true"
      style={{ position: "fixed", inset: 0, zIndex: LAYERS.flowOverlay, background: "#FBF6F0", display: "flex", flexDirection: "column", maxWidth: 448, margin: "0 auto", minHeight: 0, overflow: "hidden", fontFamily: F }}
    >
      <AnimatePresence mode="wait">
        {step >= 1 && step <= 4 && currentQuestion && (
          <motion.div key="core" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }} style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", minHeight: 0, overflow: "hidden", background: "#FBF6F0" }}>
            {/* Persistent chrome — header (back / Daily Check-in / Help) stays mounted across questions */}
            <Header step={currentQuestion.step} total={currentQuestion.total} onBack={handleBack} onHelp={onNeedHelp} title={t.checkin.title} helpLabel={t.checkin.help} />

            {/* Only the question body animates per step */}
            <div style={{ flex: 1, minHeight: 0, padding: `22px 24px ${LAYOUT.flowScrollPadding}`, overflowY: "auto", WebkitOverflowScrolling: "touch", overscrollBehavior: "contain" }}>
              <AnimatePresence mode="wait">
                <QuestionBody
                  key={step}
                  question={currentQuestion}
                  value={answers[currentQuestion.key]}
                  onSelect={(value) => setAnswer(currentQuestion.key, value)}
                  selectedStr={t.checkin.selected}
                />
              </AnimatePresence>
            </div>

            {/* Persistent footer — Continue stays mounted, only its enabled state changes */}
            <div style={{ padding: `16px 24px ${LAYOUT.flowFooterPadding}` }}>
              <motion.button
                className="ci-btn"
                onClick={answers[currentQuestion.key] ? handleNext : undefined}
                animate={{ opacity: answers[currentQuestion.key] ? 1 : 0.45 }}
                transition={{ duration: 0.15 }}
                style={{ cursor: answers[currentQuestion.key] ? "pointer" : "default", pointerEvents: answers[currentQuestion.key] ? "auto" : "none" }}
              >
                {currentQuestion.step < currentQuestion.total ? t.checkin.continue : (shouldFollowUp ? t.checkin.continue : t.checkin.seeResults)}
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div key="ptag" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }} style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <ProblemTagScreen selected={problemTags} setSelected={setProblemTags} otherText={problemOther} setOtherText={setProblemOther} onBack={handleBack} onContinue={handleNext} onHelp={onNeedHelp} problemTags={problemTagsList} lang={lang} continueLabel={t.checkin.continue} tagScreenStrings={t.checkin.problemTags} headerTitle={followUpStrings.header1} />
          </motion.div>
        )}

        {step === 6 && (
          <motion.div key="journal" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }} style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <JournalScreen value={journalEntry} setValue={setJournalEntry} onBack={handleBack} onContinue={handleNext} onHelp={onNeedHelp} continueLabel={t.checkin.continue} journalStrings={t.checkin.journal} headerTitle={followUpStrings.header2} />
          </motion.div>
        )}

        {step === 7 && (
          <motion.div key="babyconn" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }} style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <BabyConnectionScreen value={babyConnection} setValue={setBabyConnection} onBack={handleBack} onContinue={handleNext} onHelp={onNeedHelp} babyLabels={babyConnectionLabels} seeResultsLabel={t.checkin.seeResults} babyScreenStrings={t.checkin.babyConnection} headerTitle={followUpStrings.header3} />
          </motion.div>
        )}

        {step === 9 && resultEntry && (
          <motion.div key="result" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }} style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <ResultScreen entry={resultEntry} onClose={onClose} onNeedHelp={onNeedHelp} onNavigate={onNavigate} onEpds={onEpds} onAcknowledgeSafe={onAcknowledgeSafe} resultStrings={resultStrings} summaryLabels={summaryLabels} goalStrings={goalStrings} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
