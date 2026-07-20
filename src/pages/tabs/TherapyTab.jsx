import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CalendarHeart, CheckCircle2, ChevronRight, Clock } from "lucide-react";
import TherapistCard from "../../components/booking/TherapistCard";
import BookingFlow from "../../components/booking/BookingFlow";
import { FONT_BODY, COLORS, ACCENT_COLORS, PrimaryButton, TabHero, TabSheet } from "../../lib/theme.jsx";
import { useLang } from "../../lib/i18n";
import { CAREGIVERS, THERAPISTS, getBookingState } from "../../lib/therapy-data";

const FILTERS = ["All", "Nanny", "Midwife", "Lactation Consultant", "Postnatal Massage"];
const PROVIDERS = [...CAREGIVERS, ...THERAPISTS];
const THAI_LABELS = {
  All: "ทั้งหมด",
  Nanny: "พี่เลี้ยงเด็ก",
  Midwife: "ผดุงครรภ์",
  "Lactation Consultant": "ผู้เชี่ยวชาญการให้นม",
  "Postnatal Massage": "นวดหลังคลอด",
  "Caregiver Support": "การดูแลคุณแม่และลูก",
  "Therapist Support": "การดูแลด้านสุขภาพจิต",
  "Available today": "ว่างวันนี้",
  "Available tomorrow": "ว่างพรุ่งนี้",
  "Available this week": "ว่างภายในสัปดาห์นี้",
};

const COPY = {
  en: {
    eyebrow: "Care Circle",
    title: "Find the right support",
    subtitle: "Choose the kind of care that fits today.",
    caregiver: "Caregiver Support",
    caregiverHint: "Practical help for you and your baby.",
    therapist: "Therapist Support",
    therapistHint: "Psychologists and therapists for emotional care.",
    choose: "Choose a support type",
    providers: "Available providers",
    all: "All",
    viewDetails: "View details",
    detail: "Provider details",
    category: "Category",
    expertise: "Expertise",
    experience: "Experience",
    bio: "About",
    reviews: "reviews",
    perHour: "/ hour",
    appointment: "Book appointment",
    back: "Back to providers",
    sent: "Request sent successfully",
    sentTo: "Your request was sent to",
    awaiting: "Please wait for the provider to reply.",
    home: "Back to Care Circle",
    saved: "Your request is saved",
    savedDetails: "This mock request stays on this device.",
    today: "Available today",
  },
  th: {
    eyebrow: "Care Circle",
    title: "ค้นหาการดูแลที่เหมาะกับคุณ",
    subtitle: "เลือกความช่วยเหลือที่ตรงกับวันนี้",
    caregiver: "การดูแลคุณแม่และลูก",
    caregiverHint: "ความช่วยเหลือด้านการดูแลคุณแม่และลูก",
    therapist: "การดูแลด้านสุขภาพจิต",
    therapistHint: "นักจิตวิทยา/นักบำบัดสำหรับการดูแลด้านสุขภาพจิต",
    choose: "เลือกประเภทการดูแล",
    providers: "ผู้ให้บริการที่พร้อมช่วย",
    all: "ทั้งหมด",
    viewDetails: "ดูรายละเอียด",
    detail: "รายละเอียดผู้ให้บริการ",
    category: "หมวดบริการ",
    expertise: "ความเชี่ยวชาญ",
    experience: "ประสบการณ์",
    bio: "เกี่ยวกับผู้ให้บริการ",
    reviews: "รีวิว",
    perHour: "/ ชั่วโมง",
    appointment: "นัดหมาย",
    back: "กลับไปดูผู้ให้บริการ",
    sent: "ส่งคำขอนัดหมายเรียบร้อยแล้ว",
    sentTo: "คำขอของคุณถูกส่งไปยัง",
    awaiting: "กรุณารอการตอบกลับจากผู้ให้บริการ",
    home: "กลับหน้า Care Circle",
    saved: "บันทึกคำขอของคุณแล้ว",
    savedDetails: "คำขอจำลองนี้เก็บไว้ในอุปกรณ์นี้เท่านั้น",
    today: "ว่างวันนี้",
  },
};

function getProviderName(provider, lang) {
  return lang === "th" ? provider.nameTh || provider.name : provider.name;
}

function getProviderLabel(value, provider, lang) {
  if (lang !== "th") return value;
  return THAI_LABELS[value] || provider?.availabilityTh || value;
}

function getProviderList(category, filter) {
  const source = category === "caregiver" ? CAREGIVERS : THERAPISTS;
  return category === "caregiver" && filter !== "All"
    ? source.filter((provider) => provider.category === filter)
    : source;
}

function ProviderDetail({ provider, lang, copy, onBack, onBook }) {
  const colors = ACCENT_COLORS[provider.color] || ACCENT_COLORS.accent;
  const Icon = provider.icon;
  const name = getProviderName(provider, lang);
  const specialty = lang === "th" ? provider.specialtyTh || provider.sub_specialty : provider.sub_specialty;
  const bio = lang === "th" ? provider.careFitTh || provider.bio : provider.bio;
  const expertise = lang === "th" ? provider.expertiseTh || provider.focusesTh || provider.expertise || provider.focuses || [] : provider.expertise || provider.focuses || [];
  const experience = lang === "th" ? provider.experienceTh || provider.experience : provider.experience;

  return (
    <motion.section initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} style={{ display: "flex", flexDirection: "column", gap: 14 }} aria-labelledby="provider-detail-title">
      <button type="button" onClick={onBack} style={{ alignSelf: "flex-start", border: 0, background: "transparent", color: COLORS.accentInk, fontFamily: FONT_BODY, fontWeight: 800, cursor: "pointer", padding: 0 }}>
        <ArrowLeft style={{ width: 15, height: 15, verticalAlign: "middle", marginRight: 5 }} />{copy.back}
      </button>
      <div style={{ background: colors.bg, borderRadius: 18, padding: 18, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 72, height: 72, borderRadius: 18, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {provider.profile_photo ? <img src={provider.profile_photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 18 }} /> : <Icon style={{ width: 32, height: 32, color: colors.text }} />}
        </div>
        <div>
          <p id="provider-detail-title" style={{ fontSize: 17, fontWeight: 800, color: COLORS.heading }}>{name}</p>
          <p style={{ color: COLORS.muted, fontSize: 12, marginTop: 4 }}>{specialty}</p>
          <p style={{ color: COLORS.muted, fontSize: 11, marginTop: 5 }}>★ {provider.rating} · {provider.review_count} {copy.reviews}</p>
        </div>
      </div>
      <div style={{ background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        <div><p style={{ fontSize: 11, color: COLORS.muted }}>{copy.category}</p><p style={{ fontSize: 13, fontWeight: 700, color: COLORS.heading }}>{getProviderLabel(provider.category, null, lang)}</p></div>
        <div><p style={{ fontSize: 11, color: COLORS.muted }}>{copy.expertise}</p><div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 5 }}>{expertise.map((item) => <span key={item} style={{ fontSize: 10, padding: "4px 8px", borderRadius: 999, background: colors.bg, color: colors.text, fontWeight: 700 }}>{item}</span>)}</div></div>
        <div><p style={{ fontSize: 11, color: COLORS.muted }}>{copy.experience}</p><p style={{ fontSize: 13, fontWeight: 700, color: COLORS.heading }}>{experience}</p></div>
        <div><p style={{ fontSize: 11, color: COLORS.muted }}>{copy.bio}</p><p style={{ fontSize: 13, lineHeight: 1.5, color: COLORS.text, marginTop: 3 }}>{bio}</p></div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 12, color: COLORS.muted }}><span><Clock style={{ width: 13, height: 13, verticalAlign: "middle", marginRight: 4 }} />{getProviderLabel(provider.availability, provider, lang)}</span><strong style={{ color: COLORS.heading }}>฿{provider.hourly_rate}{copy.perHour}</strong></div>
      </div>
      <PrimaryButton type="button" onClick={onBook} style={{ minHeight: 48, fontSize: 14 }}>{copy.appointment}</PrimaryButton>
    </motion.section>
  );
}

export default function TherapyTab({ initialCategory = "caregiver" }) {
  const { lang } = useLang();
  const copy = COPY[lang] || COPY.en;
  const [category, setCategory] = useState(initialCategory);
  const [filter, setFilter] = useState("All");
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [bookingProvider, setBookingProvider] = useState(null);
  const [bookingState, setBookingState] = useState(null);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    setCategory(initialCategory);
    setSelectedProvider(null);
    setFilter("All");
  }, [initialCategory]);

  useEffect(() => setBookingState(getBookingState()), []);

  const providers = useMemo(() => getProviderList(category, filter), [category, filter]);
  const upcomingProvider = bookingState ? PROVIDERS.find((provider) => provider.id === bookingState.therapistId) : null;
  const upcomingName = upcomingProvider ? getProviderName(upcomingProvider, lang) : bookingState?.name;

  const chooseCategory = (next) => {
    setCategory(next);
    setFilter("All");
    setSelectedProvider(null);
  };

  const handleDone = () => {
    setBookingProvider(null);
    setBooked(true);
    setBookingState(getBookingState());
  };

  return (
    <>
      <div style={{ fontFamily: FONT_BODY }}>
        <TabHero theme="sage" eyebrow={copy.eyebrow} title={copy.title} subtitle={copy.subtitle} />
        <TabSheet gap={14}>
          {booked && (
            <div role="status" style={{ background: COLORS.greenSoft, borderRadius: 14, padding: 14, display: "flex", gap: 10, alignItems: "flex-start" }}>
              <CheckCircle2 style={{ width: 18, height: 18, color: COLORS.green, flexShrink: 0 }} />
              <div><p style={{ fontSize: 13, fontWeight: 800, color: COLORS.heading }}>{copy.saved}</p><p style={{ fontSize: 11.5, color: COLORS.muted, marginTop: 3 }}>{copy.savedDetails}</p></div>
            </div>
          )}

          {bookingState && (
            <div style={{ background: COLORS.accentSoft, borderRadius: 14, padding: 14, display: "flex", alignItems: "center", gap: 10 }}>
              <CalendarHeart style={{ width: 18, height: 18, color: COLORS.accent }} />
              <div style={{ flex: 1 }}><p style={{ fontSize: 12, fontWeight: 800, color: COLORS.heading }}>{copy.saved}</p><p style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>{upcomingName} · {bookingState.date} · {bookingState.time}</p></div>
            </div>
          )}

          {!selectedProvider && <>
            <p style={{ fontSize: 14, fontWeight: 800, color: COLORS.heading }}>{copy.choose}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[{ id: "caregiver", title: copy.caregiver, hint: copy.caregiverHint }, { id: "therapist", title: copy.therapist, hint: copy.therapistHint }].map((item) => (
                <button key={item.id} type="button" onClick={() => chooseCategory(item.id)} aria-pressed={category === item.id} style={{ textAlign: "left", minHeight: 112, padding: 14, borderRadius: 15, border: `2px solid ${category === item.id ? COLORS.accent : COLORS.border}`, background: category === item.id ? COLORS.accentSoft : "#fff", cursor: "pointer", fontFamily: FONT_BODY }}>
                  <p style={{ fontSize: 13, fontWeight: 800, color: COLORS.heading }}>{item.title}</p><p style={{ fontSize: 11, color: COLORS.muted, lineHeight: 1.45, marginTop: 7 }}>{item.hint}</p><ChevronRight style={{ width: 15, height: 15, color: COLORS.accent, marginTop: 8 }} />
                </button>
              ))}
            </div>
          </>}

          {selectedProvider ? (
            <ProviderDetail provider={selectedProvider} lang={lang} copy={copy} onBack={() => setSelectedProvider(null)} onBook={() => setBookingProvider(selectedProvider)} />
          ) : <>
            {category === "caregiver" && <div style={{ display: "flex", gap: 7, overflowX: "auto", scrollbarWidth: "thin", paddingBottom: 2 }} aria-label={lang === "th" ? "ตัวกรองผู้ดูแล" : "Caregiver filters"}>
              {FILTERS.map((item) => <button key={item} type="button" onClick={() => setFilter(item)} aria-pressed={filter === item} style={{ flexShrink: 0, border: `1px solid ${filter === item ? COLORS.accent : COLORS.border}`, background: filter === item ? COLORS.accent : "#fff", color: filter === item ? "#fff" : COLORS.text, borderRadius: 999, padding: "8px 11px", fontSize: 11, fontWeight: 800, cursor: "pointer", fontFamily: FONT_BODY }}>{lang === "th" ? THAI_LABELS[item] : item}</button>)}
            </div>}
            <div id="therapy-recommended" style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}><p style={{ fontSize: 14, fontWeight: 800, color: COLORS.heading }}>{category === "caregiver" ? copy.caregiver : copy.therapist}</p><span style={{ fontSize: 11, color: COLORS.muted }}>{providers.length}</span></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {providers.map((provider, index) => <TherapistCard key={provider.id} therapist={provider} index={index} onSelect={setSelectedProvider} requestLabel={copy.viewDetails} />)}
            </div>
          </>}
        </TabSheet>
      </div>

      <AnimatePresence>
        {bookingProvider && <BookingFlow therapist={bookingProvider} onClose={() => setBookingProvider(null)} onDone={handleDone} />}
      </AnimatePresence>
    </>
  );
}
