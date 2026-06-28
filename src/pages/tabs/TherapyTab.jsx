import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CalendarHeart, Clock, Shield, CheckCircle2 } from "lucide-react";
import TherapistCard from "../../components/booking/TherapistCard";
import BookingFlow from "../../components/booking/BookingFlow";
import SafetySection from "../../components/afterbloom/SafetySection";
import { FONT_BODY, COLORS, Card, CardLabel, ACCENT_COLORS, PrimaryButton, TabHero, TabSheet, HeroAccent } from "../../lib/theme.jsx";
import { THERAPISTS, getBookingState } from "../../lib/therapy-data";

function getUpcomingDisplay(bookingState) {
  if (!bookingState) return null;
  const therapist = THERAPISTS.find((t) => t.id === bookingState.therapistId);
  return {
    name: bookingState.name,
    icon: therapist?.icon || CalendarHeart,
    color: bookingState.color,
    date: bookingState.date,
    time: bookingState.time,
    mode: bookingState.mode,
    durationLabel: bookingState.durationLabel,
    note: bookingState.note,
  };
}

export default function TherapyTab() {
  const [bookingTherapist, setBookingTherapist] = useState(null);
  const [booked, setBooked] = useState(false);
  const [bookingState, setBookingState] = useState(null);
  const [supportOpen, setSupportOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setBookingState(getBookingState());
  }, []);

  const handleDone = () => {
    setBookingTherapist(null);
    setBooked(true);
    setBookingState(getBookingState());
  };

  const upcoming = getUpcomingDisplay(bookingState);
  const upcomingColors = upcoming ? (ACCENT_COLORS[upcoming.color] || ACCENT_COLORS.accent) : ACCENT_COLORS.green;
  const UpcomingIcon = upcoming?.icon || CalendarHeart;

  const scrollToTherapists = () => {
    document.getElementById("therapy-recommended")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  };

  return (
    <>
      <div style={{ fontFamily: FONT_BODY }}>
        <TabHero
          theme="sage"
          eyebrow="Support"
          title={<>Support that fits<HeroAccent>today.</HeroAccent></>}
          subtitle="Request private care when you're ready, or open immediate support if today feels unsafe."
        />
        <TabSheet gap={14}>
        {/* Care request saved banner */}
        <AnimatePresence>
          {booked && (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card style={{ background: COLORS.greenSoft, border: `1px solid ${COLORS.greenSoft}`, display: "flex", alignItems: "flex-start", gap: 12, padding: 16 }}>
                <CheckCircle2 style={{ width: 18, height: 18, color: COLORS.green, marginTop: 2, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.heading }}>Care request saved.</p>
                  <p style={{ fontSize: 11.5, color: COLORS.muted, marginTop: 2 }}>These details stay on this device until booking is connected.</p>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Saved care request */}
        <div style={{ background: upcoming ? upcomingColors.bg : "#fff", borderRadius: 16, padding: 18, border: `1px solid ${COLORS.border}`, boxShadow: upcoming ? "none" : "0 2px 12px rgba(80,56,42,.05)" }}>
          {upcoming ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: upcomingColors.text }} />
                <span style={{ fontSize: 12.5, fontWeight: 800, color: upcomingColors.text }}>
                  Saved care request
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <UpcomingIcon style={{ width: 22, height: 22, color: upcomingColors.text }} />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 800, color: COLORS.heading }}>{upcoming.name}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11.5, color: COLORS.muted, marginTop: 2, flexWrap: "wrap" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <CalendarHeart style={{ width: 12, height: 12 }} />{upcoming.date}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Clock style={{ width: 12, height: 12 }} />{upcoming.time}
                    </span>
                  </div>
                  <p style={{ fontSize: 11.5, color: COLORS.muted, marginTop: 4 }}>{upcoming.durationLabel} · {upcoming.mode}</p>
                </div>
              </div>
              <PrimaryButton
                onClick={scrollToTherapists}
                style={{ minHeight: 44, padding: 13, fontWeight: 700, fontSize: 13.5, boxShadow: `0 10px 20px ${COLORS.ctaShadow}` }}
              >
                Change request time
              </PrimaryButton>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 13 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: COLORS.greenSoft, color: COLORS.green, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <CalendarHeart style={{ width: 20, height: 20 }} />
              </div>
              <div style={{ flex: 1 }}>
                <CardLabel style={{ color: COLORS.green }}>No care request saved</CardLabel>
                <p style={{ fontSize: 15, fontWeight: 800, color: COLORS.heading, marginTop: 5 }}>You can choose support when it feels right.</p>
                <p style={{ fontSize: 12.5, color: COLORS.muted, lineHeight: 1.55, marginTop: 5 }}>
                  Start with support matched to what has been hardest lately. Nothing leaves this device in this version.
                </p>
                <PrimaryButton
                  onClick={scrollToTherapists}
                  style={{ marginTop: 13, minHeight: 44, padding: 12, background: COLORS.green, fontSize: 13 }}
                >
                  See recommended support
                </PrimaryButton>
              </div>
            </div>
          )}
        </div>

        {/* Therapist List */}
        <div id="therapy-recommended" style={{ scrollMarginTop: 12 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 800, color: COLORS.heading }}>Recommended support</p>
              <p style={{ fontSize: 11.5, color: COLORS.muted, marginTop: 2 }}>Choose by care fit, not pressure.</p>
            </div>
            <span style={{ fontSize: 10.5, fontWeight: 800, color: COLORS.label }}>{THERAPISTS.length} options</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {THERAPISTS.map((t, i) => (
              <TherapistCard key={t.id} therapist={t} index={i} onSelect={setBookingTherapist} />
            ))}
          </div>
        </div>

        {/* Immediate support is available without becoming the main booking flow. */}
        <div style={{ background: "#FFF4F2", border: "1px solid #F0C8C8", borderRadius: 14, padding: 14 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 11 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "#F9DEDC", color: "#B84C45", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Shield style={{ width: 18, height: 18 }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13.5, fontWeight: 800, color: COLORS.heading }}>Need support right now?</p>
              <p style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.45, marginTop: 3 }}>
                Open the safety options if you do not feel safe or need someone now.
              </p>
              <button
                type="button"
                onClick={() => setSupportOpen((open) => !open)}
                aria-expanded={supportOpen}
                aria-controls="therapy-safety-options"
                className="afterbloom-focus"
                style={{ marginTop: 10, width: "100%", minHeight: 44, padding: 11, borderRadius: 11, border: 0, background: supportOpen ? "#F9DEDC" : "#B84C45", color: supportOpen ? "#B84C45" : "#fff", fontSize: 12.5, fontWeight: 800, fontFamily: FONT_BODY, cursor: "pointer" }}
              >
                {supportOpen ? "Hide safety options" : "Open safety options"}
              </button>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {supportOpen && (
              <motion.div
                id="therapy-safety-options"
                initial={reduceMotion ? false : { opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #F0C8C8" }}
              >
                <SafetySection />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Privacy Note */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: COLORS.border + "55", borderRadius: 12, padding: 14 }}>
          <Shield style={{ width: 15, height: 15, color: COLORS.muted, marginTop: 2, flexShrink: 0 }} />
          <p style={{ fontSize: 11.5, color: COLORS.muted, lineHeight: 1.6 }}>
            Care conversations are confidential. You deserve care without judgment.
          </p>
        </div>
        </TabSheet>
      </div>

      {/* Care request flow overlay */}
      <AnimatePresence>
        {bookingTherapist && (
          <BookingFlow
            therapist={bookingTherapist}
            onClose={() => setBookingTherapist(null)}
            onDone={handleDone}
          />
        )}
      </AnimatePresence>
    </>
  );
}
