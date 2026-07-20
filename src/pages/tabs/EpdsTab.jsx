import { useEffect, useState } from "react";
import { CalendarClock, CheckCircle2, ClipboardCheck, Clock3 } from "lucide-react";
import { useLang } from "../../lib/i18n";
import {
  EPDS_CHECKPOINTS,
  getDaysUntilNextEpds,
  getEpdsCheckpoint,
  getEpdsHistory,
  getLatestEpdsEntry,
  isEpdsDue,
  subscribeToEpdsHistory,
} from "../../lib/epds-data";
import { getPostpartumDay } from "../../lib/user-data";
import { Card, COLORS, FONT_BODY, HeroAccent, PrimaryButton, TabHero, TabSheet } from "../../lib/theme.jsx";

const read = (value, ...keys) => keys.map((key) => value?.[key]).find((item) => item !== undefined);

function formatDate(value, lang) {
  if (!value) return "";
  return new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString(lang === "th" ? "th-TH" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function EpdsTab({ onStart, onNeedHelp }) {
  const { lang, t } = useLang();
  const [history, setHistory] = useState(() => getEpdsHistory());

  useEffect(() => subscribeToEpdsHistory(setHistory), []);

  const latest = history[0] || getLatestEpdsEntry();
  const due = isEpdsDue();
  const postpartumDay = getPostpartumDay();
  const daysUntilNext = getDaysUntilNextEpds();
  const currentCheckpoint = getEpdsCheckpoint(postpartumDay);
  const nextCheckpoint = EPDS_CHECKPOINTS.find((day) => postpartumDay !== null && day > postpartumDay);
  const latestLevel = read(latest, "supportLevel", "support_level") || "steady";
  const latestScore = read(latest, "totalScore", "total_score");
  const latestDate = read(latest, "screeningDate", "screening_date", "dateKey", "date_key");

  return (
    <div style={{ fontFamily: FONT_BODY }}>
      <TabHero
        eyebrow={t.nav.epds}
        title={<>{t.epdsTab.title}<HeroAccent>{t.epdsTab.titleAccent}</HeroAccent></>}
        subtitle={t.epdsTab.subtitle}
        theme="sage"
      />

      <TabSheet>
        <Card variant={due ? "tinted" : "flat"} style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: due ? "#D8E6DB" : COLORS.accentSoft, color: due ? COLORS.green : COLORS.accent }}>
              {due ? <ClipboardCheck size={20} aria-hidden="true" /> : <CalendarClock size={20} aria-hidden="true" />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: COLORS.subheading }}>{t.epdsTab.scheduleLabel}</div>
              <h2 style={{ margin: "5px 0 6px", fontFamily: "'Newsreader', serif", fontSize: 25, fontWeight: 500, lineHeight: 1.15, color: COLORS.heading }}>
                {due ? t.epdsTab.dueTitle : t.epdsTab.nextTitle}
              </h2>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: COLORS.muted }}>
                {due
                  ? t.epdsTab.dueBody.replace("{{day}}", String(currentCheckpoint || postpartumDay || ""))
                  : daysUntilNext
                    ? t.epdsTab.nextBody.replace("{{days}}", String(daysUntilNext)).replace("{{day}}", String(nextCheckpoint || ""))
                    : t.epdsTab.noNextBody}
              </p>
            </div>
          </div>
          <PrimaryButton onClick={onStart} style={{ marginTop: 18 }}>
            {due ? t.epdsTab.startDue : t.epdsTab.startManual}
          </PrimaryButton>
        </Card>

        <Card style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 13 }}>
            <CheckCircle2 size={18} color={COLORS.green} aria-hidden="true" />
            <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.subheading }}>{t.epdsTab.latestTitle}</div>
          </div>
          {latest ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontSize: 13, color: COLORS.muted }}>{formatDate(latestDate, lang)}</div>
                <div style={{ marginTop: 4, fontSize: 13, fontWeight: 800, color: COLORS.text }}>
                  {t.epdsTab.scoreLabel.replace("{{score}}", String(latestScore ?? "—"))}
                </div>
              </div>
              <span style={{ padding: "7px 10px", borderRadius: 999, background: COLORS.greenSoft, color: COLORS.greenInk, fontSize: 11, fontWeight: 800, textAlign: "right" }}>
                {t.epds.riskMeta[latestLevel]?.badge || latestLevel}
              </span>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 9, color: COLORS.muted, fontSize: 13 }}>
              <Clock3 size={16} aria-hidden="true" />
              {t.epdsTab.emptyHistory}
            </div>
          )}
        </Card>

        <button type="button" onClick={onNeedHelp} style={{ alignSelf: "center", minHeight: 44, padding: "8px 12px", border: 0, background: "transparent", color: COLORS.accentInk, fontFamily: FONT_BODY, fontSize: 12.5, fontWeight: 800, cursor: "pointer" }}>
          {t.epdsTab.help}
        </button>
      </TabSheet>
    </div>
  );
}
