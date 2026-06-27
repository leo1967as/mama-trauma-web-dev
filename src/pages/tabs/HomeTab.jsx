import { lazy, Suspense, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal } from "lucide-react";
import { useLang } from "../../lib/i18n";
import { syncProfile } from "../../lib/firebase-sync";

const MoodTrendChart = lazy(() => import("../../components/afterbloom/MoodTrendChart"));
import { getMoodHistory, getMoodSummary, getMoodSupportSummary, getMoodChartData, hasMoodChartData, subscribeToMoodHistory } from "../../lib/mood-data";
import { getDisplayName, getDayLabel, consumeJustOnboarded, getOnboardingData, saveOnboarding, getPreferredCheckinTime, getCurrentStage, getHeaderMotion } from "../../lib/user-data";
import { isEpdsDue, getDaysUntilNextEpds } from "../../lib/epds-data";
import DatePicker from "../../components/afterbloom/DatePicker";
import CareTimeline from "../../components/afterbloom/CareTimeline";
import DailyGoal from "../../components/afterbloom/DailyGoal";
import CheckInBtn from "../../components/afterbloom/CheckInBtn";
import { FONT_BODY, FONT_SERIF, CardLabel } from "../../lib/theme.jsx";

function heroHeading(hasTodayCheckIn, todayMood, t) {
  if (!hasTodayCheckIn) return t.home.hero.noCheckin;
  if (todayMood === null || todayMood === undefined) return t.home.hero.checkinNoMood;
  if (todayMood <= 2) return t.home.hero.lowMood;
  if (todayMood === 3) return t.home.hero.neutralMood;
  return t.home.hero.highMood;
}

const HEADER_MOTION_OPTIONS = [
  { value: "blobs", label: "Two blooms", swatch: "radial-gradient(circle at 32% 32%, #D3979B, #E6B97B 70%)" },
  { value: "glow", label: "Breathing glow", swatch: "radial-gradient(circle, #F6E2E1, #FBF6F0 70%)" },
  { value: "sweep", label: "Light sweep", swatch: "linear-gradient(75deg, #FBF2EC 28%, #fff 50%, #FBF2EC 72%)" },
];

export default function HomeTab({ onNavigate, onCheckIn, onEpds, onSecretTap }) {
  const { lang, toggle, t } = useLang();
  const [moodEntries, setMoodEntries] = useState([]);
  const [justOnboarded] = useState(() => consumeJustOnboarded());
  // settings panel
  const [showSettings, setShowSettings] = useState(false);
  const [settingsPreferredName, setSettingsPreferredName] = useState(() => getOnboardingData().preferred_name || getOnboardingData().mother_name || "");
  const [settingsLegalFirstName, setSettingsLegalFirstName] = useState(() => getOnboardingData().legal_first_name || "");
  const [settingsLegalLastName, setSettingsLegalLastName] = useState(() => getOnboardingData().legal_last_name || "");
  const [settingsPhone, setSettingsPhone] = useState(() => getOnboardingData().phone || "");
  const [settingsBirthDate, setSettingsBirthDate] = useState(() => getOnboardingData().baby_birth_date || "");
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [settingsShowDate, setSettingsShowDate] = useState(false);
  const [headerMotion, setHeaderMotion] = useState(() => getHeaderMotion());

  useEffect(() => {
    setMoodEntries(getMoodHistory());
    const unsub = subscribeToMoodHistory(setMoodEntries);
    return unsub;
  }, []);

  const moodSummary = getMoodSummary(moodEntries);
  const todayMood = moodSummary.todayEntry?.moodScore ?? null;
  const supportSummary = getMoodSupportSummary(moodEntries);
  const trendData = getMoodChartData(moodEntries, 7);
  const showTrend = hasMoodChartData(trendData);
  const reminderCopy = t.home.checkinTimeCopy[getPreferredCheckinTime()] || null;
  const stage = getCurrentStage();

  return (
    <div style={{ fontFamily: FONT_BODY }}>

      {/* ── Dawn header — restrained task surface ── */}
      <div
        className="relative px-[22px] pb-8 overflow-hidden"
        style={{
          background: "linear-gradient(180deg,#FBF2EC 0%,#FBF6F0 100%)",
        }}
      >
        {/* ambient drift — chosen in Settings, kept subtle behind the content */}
        {headerMotion === "blobs" && (
          <>
            <div aria-hidden="true" className="dawn-blob dawn-blob-2" style={{ top: -90, right: -60, width: 260, height: 260, background: "radial-gradient(circle, rgba(211,151,155,0.95), transparent 70%)", filter: "blur(75px)" }} />
            <div aria-hidden="true" className="dawn-blob dawn-blob-1" style={{ top: 50, left: -80, width: 220, height: 220, background: "radial-gradient(circle, rgba(230,185,123,0.95), transparent 70%)", filter: "blur(75px)" }} />
          </>
        )}
        {headerMotion === "glow" && (
          <div aria-hidden="true" className="dawn-glow" style={{ top: -60, left: "50%", marginLeft: -170, width: 340, height: 340, background: "radial-gradient(circle, rgba(246,226,225,0.9), transparent 70%)", filter: "blur(70px)" }} />
        )}
        {headerMotion === "sweep" && (
          <div aria-hidden="true" className="dawn-sweep" />
        )}

        {/* dbar */}
        <div className="relative flex items-center justify-between pt-3.5">
          <span
            className="text-[12px] font-bold cursor-default select-none"
            style={{ color: "#8A4F4C" }}
            onClick={onSecretTap}
          >
            {getDayLabel()}
          </span>
          <div className="flex gap-2">
            <button
              className="relative w-11 h-11 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,.42)", border: "1px solid rgba(255,255,255,.6)", color: "#7A453F" }}
            >
              <span className="absolute rounded-full" style={{ top: 8, right: 9, width: 7, height: 7, background: "#AF636A", border: "1.5px solid #fff" }} />
              <svg viewBox="0 0 24 24" width="17" fill="none" stroke="currentColor" strokeWidth="1.9">
                <path d="M6 8a6 6 0 0112 0c0 7 3 7 3 9H3c0-2 3-2 3-9"/><path d="M10 21a2 2 0 004 0"/>
              </svg>
            </button>
            <button
              onClick={toggle}
              className="w-11 h-11 rounded-full flex items-center justify-center afterbloom-focus"
              style={{ background: "rgba(255,255,255,.42)", border: "1px solid rgba(255,255,255,.6)", color: "#7A453F", fontSize: 11, fontWeight: 800, letterSpacing: "0.04em", fontFamily: FONT_BODY }}
              aria-label={lang === 'th' ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'}
            >
              {lang.toUpperCase()}
            </button>
            <button
              onClick={() => {
                setShowSettings((s) => !s);
                setSettingsShowDate(false);
                setSettingsSaved(false);
              }}
              className="w-11 h-11 rounded-full flex items-center justify-center"
              style={{ background: showSettings ? "rgba(255,255,255,.7)" : "rgba(255,255,255,.42)", border: "1px solid rgba(255,255,255,.6)", color: "#7A453F" }}
            >
              <SlidersHorizontal size={16} strokeWidth={1.9} />
            </button>
          </div>
        </div>

        {/* settings panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="overflow-hidden"
            >
              <div className="mt-3 rounded-xl flex flex-col gap-3" style={{ background: "rgba(255,255,255,.62)", backdropFilter: "blur(12px)", padding: "16px 16px 14px" }}>
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8A4F4C" }}>{t.home.settings.title}</div>

                {/* profile fields */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#7A453F", marginBottom: 5 }}>{t.home.settings.preferredName}</div>
                  <input
                    type="text" placeholder={t.home.settings.preferredNamePlaceholder} maxLength={30}
                    value={settingsPreferredName}
                    onChange={e => { setSettingsPreferredName(e.target.value); setSettingsSaved(false); }}
                    style={{ width: "100%", padding: "10px 12px", fontSize: 13.5, fontFamily: FONT_BODY, background: "rgba(255,255,255,.8)", border: "1px solid rgba(239,230,220,.8)", borderRadius: 8, color: "#3E342C", outline: "none" }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#7A453F", marginBottom: 5 }}>{t.home.settings.legalFirstName}</div>
                  <input
                    type="text" placeholder={t.home.settings.legalFirstNamePlaceholder} maxLength={40}
                    value={settingsLegalFirstName}
                    onChange={e => { setSettingsLegalFirstName(e.target.value); setSettingsSaved(false); }}
                    style={{ width: "100%", padding: "10px 12px", fontSize: 13.5, fontFamily: FONT_BODY, background: "rgba(255,255,255,.8)", border: "1px solid rgba(239,230,220,.8)", borderRadius: 8, color: "#3E342C", outline: "none" }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#7A453F", marginBottom: 5 }}>{t.home.settings.legalLastName}</div>
                  <input
                    type="text" placeholder={t.home.settings.legalLastNamePlaceholder} maxLength={40}
                    value={settingsLegalLastName}
                    onChange={e => { setSettingsLegalLastName(e.target.value); setSettingsSaved(false); }}
                    style={{ width: "100%", padding: "10px 12px", fontSize: 13.5, fontFamily: FONT_BODY, background: "rgba(255,255,255,.8)", border: "1px solid rgba(239,230,220,.8)", borderRadius: 8, color: "#3E342C", outline: "none" }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#7A453F", marginBottom: 5 }}>{t.home.settings.phone}</div>
                  <input
                    type="tel" placeholder={t.home.settings.phonePlaceholder} maxLength={20}
                    value={settingsPhone}
                    onChange={e => { setSettingsPhone(e.target.value); setSettingsSaved(false); }}
                    style={{ width: "100%", padding: "10px 12px", fontSize: 13.5, fontFamily: FONT_BODY, background: "rgba(255,255,255,.8)", border: "1px solid rgba(239,230,220,.8)", borderRadius: 8, color: "#3E342C", outline: "none" }}
                  />
                </div>

                {/* birth date field */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#7A453F", marginBottom: 5 }}>{t.home.settings.babyArrivalDate}</div>
                  <button
                    onClick={() => setSettingsShowDate(s => !s)}
                    style={{ width: "100%", padding: "10px 12px", fontSize: 13.5, fontFamily: FONT_BODY, background: "rgba(255,255,255,.8)", border: "1px solid rgba(239,230,220,.8)", borderRadius: 8, color: settingsBirthDate ? "#3E342C" : "#786A5C", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                  >
                    <span>{settingsBirthDate ? new Date(settingsBirthDate + "T00:00:00").toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-US', { month: "long", day: "numeric", year: "numeric" }) : t.home.settings.notSet}</span>
                    <span style={{ fontSize: 11, color: "#9A4C53", fontWeight: 700 }}>{settingsShowDate ? t.home.settings.close : t.home.settings.change}</span>
                  </button>
                  <AnimatePresence>
                    {settingsShowDate && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden" style={{ marginTop: 8 }}>
                        <DatePicker value={settingsBirthDate} onChange={v => { setSettingsBirthDate(v); setSettingsSaved(false); }} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* background motion */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#7A453F", marginBottom: 8 }}>{t.home.settings.backgroundMotion}</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {HEADER_MOTION_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setHeaderMotion(opt.value);
                          saveOnboarding({ header_motion: opt.value });
                        }}
                        aria-pressed={headerMotion === opt.value}
                        className="afterbloom-focus"
                        style={{
                          flex: 1,
                          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                          padding: "10px 6px 9px",
                          borderRadius: 10,
                          border: headerMotion === opt.value ? "1.5px solid #C77E83" : "1px solid rgba(239,230,220,.8)",
                          background: headerMotion === opt.value ? "rgba(247,226,225,.5)" : "rgba(255,255,255,.8)",
                          cursor: "pointer",
                          fontFamily: FONT_BODY,
                        }}
                      >
                        <span aria-hidden="true" style={{ width: 26, height: 26, borderRadius: "50%", background: opt.swatch, border: "1px solid rgba(239,230,220,.8)" }} />
                        <span style={{ fontSize: 10.5, fontWeight: 700, color: "#7A453F", textAlign: "center" }}>{t.home.headerMotion[opt.value]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* save button */}
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  onClick={() => {
                    const profile = {
                      preferred_name: settingsPreferredName || "",
                      mother_name: settingsPreferredName || "",
                      legal_first_name: settingsLegalFirstName || "",
                      legal_last_name: settingsLegalLastName || "",
                      phone: settingsPhone || "",
                      baby_birth_date: settingsBirthDate || null,
                    };
                    saveOnboarding(profile);
                    syncProfile(profile);
                    setSettingsSaved(true);
                    setSettingsShowDate(false);
                    setTimeout(() => { setSettingsSaved(false); setShowSettings(false); }, 1200);
                  }}
                  style={{ padding: "11px 0", borderRadius: 8, background: settingsSaved ? "#83A48B" : "#C77E83", color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: FONT_BODY, border: 0, cursor: "pointer", transition: "background 0.2s" }}
                >
                  {settingsSaved ? t.home.settings.saved : t.home.settings.saveChanges}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* hello */}
        <div className="relative mt-[26px]">
          <h1 className="font-medium leading-none tracking-[-0.015em]" style={{ fontFamily: FONT_SERIF, fontSize: 42, color: "#4A2F2C" }}>
            {t.home.greeting.goodMorning}
            <em className="block" style={{ fontStyle: "italic" }}>{getDisplayName()}.</em>
          </h1>
          <p className="mt-3 text-[13.5px] font-extrabold" style={{ color: "#9A4C53" }}>
            {t.home.greeting.inWeekAfterBirth.replace('{{stage}}', t.stages[stage.stageIndex]?.weekLabel ?? stage.weekLabel)}
          </p>
          <p className="mt-3.5 text-[14px] font-semibold max-w-[78%]" style={{ color: "#7A453F" }}>
            {t.home.greeting.findingRhythm}
          </p>
        </div>

        {/* bottom fade — always blends into sheet no matter where gradient animates */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: 64,
            background: "linear-gradient(to bottom, transparent 0%, #FBF6F0 100%)",
          }}
        />
      </div>

      {/* ── Sheet ── */}
      <div
        className="px-[22px] pt-6"
        style={{ background: "#FBF6F0", borderRadius: "18px 18px 0 0", marginTop: -16 }}
      >

        {/* Hero check-in card */}
        <div
          className="relative rounded-[28px] px-[22px] py-7 overflow-hidden"
          style={{ background: "#fff", boxShadow: "0 12px 32px rgba(80,56,42,.09)" }}
        >
          <div className="absolute pointer-events-none" style={{ right: -40, bottom: -40, width: 150, height: 150, borderRadius: "50%", background: "radial-gradient(circle,#FBEDEC,transparent 70%)" }} />

          {justOnboarded ? (
            /* ── Welcome state (first open after onboarding) ── */
            <>
              <span className="inline-flex items-center gap-[7px] text-[11px] font-extrabold uppercase tracking-[0.12em] rounded-full relative" style={{ padding: "7px 13px", background: "#E7EFE8", color: "#577A62", marginBottom: 16 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" style={{ width: 13, height: 13 }}><path d="M5 13l4 4L19 7"/></svg>
                {t.home.badges.journeyStarted}
              </span>
              <h2 className="relative font-medium leading-[1.15] tracking-[-0.01em]" style={{ fontFamily: FONT_SERIF, fontSize: 28, color: "#3E342C", marginBottom: 10, marginTop: 12 }}>
                {t.home.firstCheckin.title.split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
              </h2>
              <p className="relative text-[13.5px] leading-[1.6] max-w-[90%]" style={{ color: "#6C5F56", marginBottom: 22 }}>
                {t.home.firstCheckin.body}
              </p>
              <CheckInBtn label={t.home.firstCheckin.cta} onCheckIn={onCheckIn} />
            </>
          ) : (
            /* ── Normal check-in state ── */
            <>
              <div className="flex items-center justify-between relative" style={{ marginBottom: 16 }}>
                {moodSummary.hasTodayCheckIn ? (
                  <span className="inline-flex items-center gap-[7px] text-[11px] font-extrabold uppercase tracking-[0.12em] rounded-full" style={{ padding: "7px 13px", background: "#E7EFE8", color: "#577A62" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" style={{ width: 13, height: 13 }}><path d="M5 13l4 4L19 7"/></svg>
                    {t.home.badges.checkinSaved}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-[7px] text-[11px] font-extrabold uppercase tracking-[0.12em] rounded-full" style={{ padding: "7px 13px", background: "#F6E2E1", color: "#9A4C53" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}><circle cx="12" cy="12" r="8"/><path d="M9 14s1 1.5 3 1.5 3-1.5 3-1.5M9 9h.01M15 9h.01"/></svg>
                    {t.home.badges.checkinNow}
                  </span>
                )}
                {moodSummary.hasTodayCheckIn && <span className="text-[12px] font-bold" style={{ color: "#786A5C" }}>{t.home.badges.loggedToday}</span>}
              </div>
              <h2 className="relative font-medium leading-[1.15] tracking-[-0.01em]" style={{ fontFamily: FONT_SERIF, fontSize: 28, color: "#3E342C", marginBottom: 10 }}>
                {heroHeading(moodSummary.hasTodayCheckIn, todayMood, t)}
              </h2>
              <p className="relative text-[13.5px] leading-[1.6] max-w-[90%]" style={{ color: "#6C5F56", marginBottom: 22 }}>
                {moodSummary.hasTodayCheckIn ? t.home.normalCheckin.checkinDoneBody : t.home.normalCheckin.noCheckinBody}
              </p>
              <CheckInBtn
                label={moodSummary.hasTodayCheckIn ? t.home.normalCheckin.ctaEdit : t.home.normalCheckin.ctaComplete}
                onCheckIn={onCheckIn}
              />
              {!moodSummary.hasTodayCheckIn && reminderCopy && (
                <p className="relative text-[12px] mt-3 flex items-center gap-1.5" style={{ color: "#786A5C" }}>
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
                  {t.home.normalCheckin.nudge.replace('{{time}}', reminderCopy)}
                </p>
              )}
            </>
          )}
        </div>

        {/* label: Today's care journey */}
        <div className="mx-1" style={{ marginTop: 24, marginBottom: 11 }}>
          <CardLabel>{t.home.cards.todaysCareJourney}</CardLabel>
        </div>

        {/* ribbon */}
        <CareTimeline />

        {/* Support card */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          style={{
            marginTop: 13,
            display: "flex", alignItems: "center", gap: 14,
            width: "100%", padding: "16px 18px",
            background: "#fff", border: "1px solid #EFE6DC",
            borderRadius: 14, cursor: "pointer", textAlign: "left",
            fontFamily: FONT_BODY,
            boxShadow: "0 2px 10px rgba(80,56,42,.05)",
          }}
        >
          {/* blush icon tile */}
          <span style={{
            width: 42, height: 42, borderRadius: 10,
            background: "#F6E2E1", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg viewBox="0 0 24 24" width="18" fill="none" stroke="#C77E83" strokeWidth="1.9">
              <path d="M5 4h4l2 5-3 2a12 12 0 005 5l2-3 5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/>
            </svg>
          </span>
          <span style={{ flex: 1 }}>
            <CardLabel style={{ marginBottom: 4 }}>{t.home.cards.todaysSupportLevel}</CardLabel>
            <span style={{ display: "block", fontSize: 14, fontWeight: 700, color: "#3E342C" }}>{t.supportLevels[supportSummary.level]?.label ?? supportSummary.label}</span>
            <span style={{ display: "block", fontSize: 12, color: "#786A5C", marginTop: 2 }}>{t.supportLevels[supportSummary.level]?.message ?? supportSummary.message}</span>
          </span>
          <svg viewBox="0 0 24 24" width="15" fill="none" stroke="#C8BEB8" strokeWidth="2">
            <path d="M9 6l6 6-6 6"/>
          </svg>
        </motion.button>

        {/* 7-day mood trend */}
        <div style={{ marginTop: 13, background: "#fff", border: "1px solid #EFE6DC", borderRadius: 14, padding: "18px 18px 12px", boxShadow: "0 2px 10px rgba(80,56,42,.05)", fontFamily: FONT_BODY }}>
          <CardLabel style={{ marginBottom: 10 }}>{t.home.cards.moodTrend}</CardLabel>
          {showTrend ? (
            <Suspense fallback={<div style={{ height: 96 }} />}>
              <MoodTrendChart data={trendData} height={96} />
            </Suspense>
          ) : (
            <p style={{ fontSize: 12.5, color: "#786A5C", lineHeight: 1.55, padding: "8px 2px 12px" }}>
              {t.home.cards.moodTrendEmpty}
            </p>
          )}
        </div>

        {/* Emotional Check (EPDS) entry */}
        <motion.button
          onClick={() => onEpds?.()}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          style={{ marginTop: 13, display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "16px 18px", background: "#fff", border: "1px solid #EFE6DC", borderRadius: 14, cursor: "pointer", textAlign: "left", fontFamily: FONT_BODY, boxShadow: "0 2px 10px rgba(80,56,42,.05)" }}
        >
          <span style={{ width: 42, height: 42, borderRadius: 10, background: "#EAF1EC", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 24 24" width="18" fill="none" stroke="#5E8169" strokeWidth="1.9"><path d="M12 21s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 11c0 5.5-7 10-7 10z"/></svg>
          </span>
          <span style={{ flex: 1 }}>
            <CardLabel style={{ marginBottom: 4 }}>{t.home.cards.emotionalCheck}</CardLabel>
            <span style={{ display: "block", fontSize: 14, fontWeight: 700, color: "#3E342C" }}>{isEpdsDue() ? t.home.cards.emotionalCheckDueTitle : t.home.cards.emotionalCheckDoneTitle}</span>
            <span style={{ display: "block", fontSize: 12, color: "#786A5C", marginTop: 2 }}>{isEpdsDue() ? t.home.cards.emotionalCheckDueBody : t.home.cards.emotionalCheckDoneBody.replace('{{days}}', getDaysUntilNextEpds())}</span>
          </span>
          <svg viewBox="0 0 24 24" width="15" fill="none" stroke="#C8BEB8" strokeWidth="2"><path d="M9 6l6 6-6 6"/></svg>
        </motion.button>

        {/* Daily goal — main warm element */}
        <div style={{ marginTop: 13 }}>
          <DailyGoal level={supportSummary.level} />
        </div>

        {/* vspace */}
        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}





