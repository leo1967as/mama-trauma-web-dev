import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { AlertCircle, MessageCircleHeart, Moon, Pencil, TrendingUp } from "lucide-react";
import {
  formatHistoryDate,
  getMoodChartData, getMoodHistory, getMoodInsights, getMoodSupportSummary,
  getMoodSummary, hasMoodChartData, subscribeToMoodHistory,
} from "../../lib/mood-data";
import { COLORS, FONT_BODY, FONT_SERIF, PrimaryButton, TabHero, TabSheet, HeroAccent } from "../../lib/theme.jsx";
import { useLang } from "../../lib/i18n";

const MoodTrendChart = lazy(() => import("../../components/afterbloom/MoodTrendChart"));

const F = FONT_BODY;
const S = FONT_SERIF;

const SCORE_FACE = {
  1: { word: "Rough", bg: "#EDEFF3", color: "#7E8AA0",
    svg: <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" fill="#EDEFF3"/><circle cx="14" cy="17" r="1.8" fill="#7E8AA0"/><circle cx="26" cy="17" r="1.8" fill="#7E8AA0"/><path d="M13 27c2-3 12-3 14 0" stroke="#7E8AA0" strokeWidth="2.2" strokeLinecap="round"/></svg> },
  2: { word: "Low",   bg: "#EFE9EF", color: "#8E7E90",
    svg: <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" fill="#EFE9EF"/><circle cx="14" cy="18" r="1.8" fill="#8E7E90"/><circle cx="26" cy="18" r="1.8" fill="#8E7E90"/><path d="M14 26c2-1.5 10-1.5 12 0" stroke="#8E7E90" strokeWidth="2.2" strokeLinecap="round"/></svg> },
  3: { word: "Okay",  bg: "#F6EBD4", color: "#9A7322",
    svg: <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" fill="#F6EBD4"/><circle cx="14" cy="18" r="1.9" fill="#9A7322"/><circle cx="26" cy="18" r="1.9" fill="#9A7322"/><path d="M14 25h12" stroke="#9A7322" strokeWidth="2.4" strokeLinecap="round"/></svg> },
  4: { word: "Good",  bg: "#E5EEE6", color: "#577A62",
    svg: <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" fill="#E5EEE6"/><circle cx="14" cy="17" r="1.9" fill="#577A62"/><circle cx="26" cy="17" r="1.9" fill="#577A62"/><path d="M13 23c2 3 12 3 14 0" stroke="#577A62" strokeWidth="2.3" strokeLinecap="round"/></svg> },
  5: { word: "Light", bg: "#F6E3E2", color: "#AF636A",
    svg: <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" fill="#F6E3E2"/><circle cx="14" cy="16" r="1.9" fill="#AF636A"/><circle cx="26" cy="16" r="1.9" fill="#AF636A"/><path d="M12 22c2.5 4.5 13.5 4.5 16 0" stroke="#AF636A" strokeWidth="2.4" strokeLinecap="round"/></svg> },
};

const SLEEP_LABEL = { 1: "Almost none", 2: "Very little", 3: "Some", 4: "Enough", 5: "Slept well" };

// Score words/labels are looked up from i18n (reusing the check-in scale
// text) at render time; these maps are only the English fallback.
function moodWord(score, t) {
  return t?.checkin?.questions?.[0]?.labels?.[score - 1] ?? SCORE_FACE[score]?.word;
}
function sleepWord(score, t) {
  return t?.checkin?.questions?.[1]?.labels?.[score - 1] ?? SLEEP_LABEL[score];
}

const insightIconMap = { sleep: Moon, support: MessageCircleHeart, tag: AlertCircle, trend: TrendingUp };

const insightColors = [
  { bg: COLORS.amberSoft, color: COLORS.amber },
  { bg: COLORS.greenSoft, color: COLORS.green },
  { bg: COLORS.accentSoft, color: COLORS.accent },
];

const supportStyle = {
  unassessed: { bg: "#F8F4EF", border: "#E6DBCF", text: "#6C5F56", tag: "#F2EAE2", action: "checkin" },
  immediate: { bg: "#FEECEC", border: "#F5C2C2", text: "#B91C1C", tag: "#FEE2E2", action: "help" },
  extra: { bg: "#FEF0E7", border: "#F5D5B8", text: "#C2460A", tag: "#FDE8D0", action: "epds" },
  gentle: { bg: COLORS.amberSoft, border: "#E8D3A0", text: COLORS.amber, tag: "#F2E2BE", action: "checkin" },
  steady: { bg: COLORS.greenSoft, border: "#C8DFC9", text: COLORS.green, tag: "#D8EDD9", action: "checkin" },
};

function Card({ children, style, ...props }) {
  return (
    <section
      style={{
        background: "#fff",
        border: `1px solid ${COLORS.border}`,
        borderRadius: 14,
        padding: 20,
        fontFamily: F,
        ...style,
      }}
      {...props}
    >
      {children}
    </section>
  );
}

function SectionLabel({ children, id, style }) {
  return (
    <div
      id={id}
      style={{
        fontSize: 13,
        fontWeight: 800,
        color: COLORS.subheading,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function MoodFace({ face, size = 44 }) {
  if (!face) return null;
  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: face.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg viewBox="0 0 40 40" fill="none" width={size} height={size}>{face.svg.props.children}</svg>
    </div>
  );
}

function TodaySummary({ todayEntry, onCheckIn }) {
  const { t } = useLang();
  const face = todayEntry?.moodScore ? SCORE_FACE[todayEntry.moodScore] : null;
  const sleepLabel = todayEntry?.sleepScore != null ? sleepWord(todayEntry.sleepScore, t) : null;

  if (!face) {
    return (
      <Card aria-labelledby="mood-today-title">
        <SectionLabel id="mood-today-title">{t.mood.todayHeading}</SectionLabel>
        <p style={{ fontSize: 14, color: COLORS.muted, lineHeight: 1.55, margin: "10px 0 16px" }}>
          {t.mood.noCheckinYet}
        </p>
        <PrimaryButton onClick={onCheckIn} aria-label={t.mood.aria.completeCheckin}>
          <Pencil size={16} aria-hidden="true" />
          {t.mood.completeCheckin}
        </PrimaryButton>
      </Card>
    );
  }

  return (
    <Card aria-labelledby="mood-today-title">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
        <SectionLabel id="mood-today-title">{t.mood.todayLog}</SectionLabel>
        <button
          type="button"
          onClick={onCheckIn}
          aria-label={t.mood.aria.editCheckin}
          className="afterbloom-focus mood-action"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            minHeight: 44,
            fontSize: 12.5,
            fontWeight: 800,
            color: COLORS.accentInk,
            background: COLORS.accentSoft,
            border: 0,
            padding: "8px 13px",
            borderRadius: 12,
            cursor: "pointer",
            fontFamily: F,
          }}
        >
          <Pencil size={12} aria-hidden="true" /> {t.mood.edit}
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: todayEntry.tags?.length ? 14 : 0 }}>
        <MoodFace face={face} size={48} />
        <div>
          <div style={{ fontFamily: S, fontSize: 22, fontWeight: 500, color: COLORS.text }}>{moodWord(todayEntry.moodScore, t)}</div>
          {sleepLabel && (
            <div style={{ fontSize: 12.5, color: COLORS.label, marginTop: 2 }}>{t.mood.sleepPrefix} · {sleepLabel}</div>
          )}
        </div>
      </div>

      {todayEntry.tags?.length > 0 && (
        <div role="list" aria-label={t.mood.aria.todayTags} style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {todayEntry.tags.map((tag) => (
            <span
              key={tag}
              role="listitem"
              style={{
                fontSize: 12,
                fontWeight: 700,
                padding: "6px 11px",
                borderRadius: 12,
                background: "#FBF6F0",
                border: "1px solid #E6DBCF",
                color: COLORS.muted,
                textTransform: "capitalize",
              }}
            >
              {t.moodTags[tag] ?? tag}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
}

function TrendCard({ chartData, showChart }) {
  const { t } = useLang();
  const trendValues = chartData.filter((row) => row.mood != null).map((row) => row.mood);
  const trendSummary = trendValues.length
    ? t.mood.trendRange.replace("{{min}}", Math.min(...trendValues)).replace("{{max}}", Math.max(...trendValues))
    : t.mood.trendEmpty;

  return (
    <Card aria-labelledby="mood-trend-title">
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
        <span
          aria-hidden="true"
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: COLORS.accentSoft,
            color: COLORS.accent,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <TrendingUp size={16} />
        </span>
        <div>
          <SectionLabel id="mood-trend-title">{t.mood.sevenDayTrend}</SectionLabel>
          <p style={{ fontSize: 12.5, color: COLORS.muted, marginTop: 3 }}>{trendSummary}</p>
        </div>
      </div>
      <div style={{ position: "relative", minHeight: 128 }}>
        <Suspense fallback={<div role="status" aria-live="polite" style={{ height: 128, borderRadius: 12, background: "#FBF6F0" }} />}>
          <MoodTrendChart data={chartData} height={128} ariaLabel={trendSummary} />
        </Suspense>
        {!showChart && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <p style={{ fontSize: 12, color: COLORS.muted, textAlign: "center", fontFamily: F, maxWidth: 220 }}>
              {t.mood.trendChartEmpty}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

function InsightCard({ insight, index }) {
  const { t } = useLang();
  const Icon = insightIconMap[insight.type] || TrendingUp;
  const ic = insightColors[index] || insightColors[0];
  return (
    <Card aria-labelledby={`mood-insight-${index}`}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div
          aria-hidden="true"
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: ic.bg,
            color: ic.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={16} />
        </div>
        <SectionLabel id={`mood-insight-${index}`}>
          {t.mood.insightLabels[index]}
        </SectionLabel>
      </div>
      <p style={{ fontSize: 14, color: COLORS.text, lineHeight: 1.55 }}>{insight.text}</p>
    </Card>
  );
}

function SupportCard({ supportSummary, onCheckIn, onEpds, onNeedHelp }) {
  const { t } = useLang();
  const ss = supportStyle[supportSummary.level] ?? supportStyle.steady;
  const level = t.supportLevels[supportSummary.level];
  const label = level?.label ?? supportSummary.label;
  const message = level?.message ?? supportSummary.message;
  const action = level?.action ?? supportSummary.action;
  const cta = t.mood.supportCta[supportSummary.level] ?? t.mood.supportCta.steady;
  const handleAction = ss.action === "help" ? onNeedHelp : ss.action === "epds" ? onEpds : onCheckIn;
  const ariaLabel = ss.action === "help" ? t.mood.aria.actionHelp : ss.action === "epds" ? t.mood.aria.actionEpds : t.mood.aria.actionCheckin;

  return (
    <section
      aria-labelledby="mood-support-title"
      style={{
        borderRadius: 14,
        padding: 20,
        background: ss.bg,
        border: `1px solid ${ss.border}`,
        fontFamily: F,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
        <span id="mood-support-title" style={{ fontSize: 15, fontWeight: 800, color: ss.text }}>{t.home.cards.todaysSupportLevel}</span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: ss.text,
            background: ss.tag,
            padding: "5px 10px",
            borderRadius: 12,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      </div>
      <p style={{ fontSize: 13, color: ss.text, lineHeight: 1.55, marginBottom: 10 }}>{message}</p>
      <p style={{ fontSize: 12.5, fontWeight: 800, color: ss.text, marginBottom: 14 }}>{t.checkin.result.nextStep.replace("{{action}}", action)}</p>
      <PrimaryButton
        variant="secondary"
        onClick={handleAction}
        aria-label={ariaLabel}
      >
        {cta}
      </PrimaryButton>
    </section>
  );
}

function RecentHistory({ history }) {
  const { t } = useLang();
  const recent = history.filter((entry) => entry.moodScore != null).slice(0, 7);
  if (!recent.length) return null;

  return (
    <Card style={{ padding: 0, overflow: "hidden" }} aria-labelledby="recent-mood-title">
      <div style={{ padding: "18px 20px 12px" }}>
        <SectionLabel id="recent-mood-title">{t.mood.recentDays}</SectionLabel>
      </div>
      <div role="list" aria-label={t.mood.aria.recentLogs}>
        {recent.map((entry) => {
          const face = SCORE_FACE[entry.moodScore];
          if (!face) return null;
          const sleepLabel = entry.sleepScore != null ? sleepWord(entry.sleepScore, t) : null;
          const tags = entry.tags?.slice(0, 2) || [];
          const dateLabel = formatHistoryDate(entry.dateKey, t);

          return (
            <div
              key={entry.dateKey}
              role="listitem"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                minHeight: 62,
                padding: "12px 20px",
                borderTop: "1px solid #F5EFE8",
              }}
            >
              <MoodFace face={face} size={38} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                  <span style={{ fontFamily: S, fontSize: 16, fontWeight: 500, color: COLORS.text }}>{moodWord(entry.moodScore, t)}</span>
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: COLORS.label,
                        background: "#FBF6F0",
                        border: `1px solid ${COLORS.border}`,
                        padding: "3px 8px",
                        borderRadius: 10,
                        textTransform: "capitalize",
                      }}
                    >
                      {t.moodTags[tag] ?? tag}
                    </span>
                  ))}
                </div>
                {sleepLabel && (
                  <div style={{ fontSize: 12, color: COLORS.label, marginTop: 2 }}>{t.mood.sleepPrefix} · {sleepLabel}</div>
                )}
              </div>
              <time dateTime={entry.dateKey} style={{ fontSize: 11.5, fontWeight: 800, color: COLORS.label, flexShrink: 0 }}>
                {dateLabel}
              </time>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default function MoodTab({ onCheckIn, onEpds, onNeedHelp }) {
  const { t, lang } = useLang();
  const [history, setHistory] = useState(() => getMoodHistory());
  useEffect(() => {
    const unsub = subscribeToMoodHistory(setHistory);
    return unsub;
  }, []);

  const summary = useMemo(() => getMoodSummary(history), [history]);
  const todayEntry = summary.todayEntry;
  const supportSummary = useMemo(() => getMoodSupportSummary(history), [history]);
  const insights = useMemo(() => getMoodInsights(history, t), [history, t]);
  const chartData = useMemo(() => getMoodChartData(history, 7, { locale: lang === "th" ? "th-TH" : "en-US" }), [history, lang]);
  const showChart = hasMoodChartData(chartData);
  const face = todayEntry?.moodScore ? SCORE_FACE[todayEntry.moodScore] : null;
  const faceWord = face ? moodWord(todayEntry.moodScore, t) : null;

  return (
    <div style={{ fontFamily: F }}>
      <TabHero
        theme="rose"
        eyebrow={t.mood.eyebrow}
        title={<>{t.mood.title}<HeroAccent>{t.mood.titleAccent}</HeroAccent></>}
        subtitle={summary.hasTodayCheckIn ? t.mood.subtitleDone : t.mood.subtitleNotDone}
        rightSlot={face && (
          <div
            aria-label={t.mood.aria.todayMoodIs.replace("{{word}}", faceWord)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: "rgba(255,255,255,.58)",
              border: "1px solid rgba(255,255,255,.74)",
              padding: "6px 12px 6px 8px",
              borderRadius: 14,
            }}
          >
            <MoodFace face={face} size={22} />
            <span style={{ fontSize: 12, fontWeight: 800, color: COLORS.text }}>{t.mood.todayBadge.replace("{{word}}", faceWord)}</span>
          </div>
        )}
      />

      <TabSheet gap={13}>
        <TodaySummary todayEntry={todayEntry} onCheckIn={onCheckIn} />
        <TrendCard chartData={chartData} showChart={showChart} />
        {insights.slice(0, 3).map((insight, index) => (
          <InsightCard key={insight.key || index} insight={insight} index={index} />
        ))}
        <SupportCard supportSummary={supportSummary} onCheckIn={onCheckIn} onEpds={onEpds} onNeedHelp={onNeedHelp} />
        <RecentHistory history={history} />
      </TabSheet>
    </div>
  );
}
