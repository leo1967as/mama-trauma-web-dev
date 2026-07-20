import { createPortal } from "react-dom";
import { useState } from "react";
import { ChevronDown, LoaderCircle, LogOut, Share2 } from "lucide-react";
import { useLang } from "../../lib/i18n";
import { syncProfile } from "../../lib/firebase-sync";
import { getOnboardingData, saveOnboarding } from "../../lib/user-data";
import DatePicker from "../../components/afterbloom/DatePicker";
import { Card, COLORS, FONT_BODY, PrimaryButton, TabHero, TabSheet } from "../../lib/theme.jsx";

function shouldShowIosInstallGuide() {
  if (typeof window === "undefined") return false;
  const { navigator } = window;
  const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent)
    || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isStandalone = navigator.standalone || window.matchMedia?.("(display-mode: standalone)").matches;
  return isIos && !isStandalone;
}

function Field({ label, value, onChange, placeholder, type = "text", maxLength = 40 }) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "block", marginBottom: 5, fontSize: 11, fontWeight: 800, color: COLORS.subheading }}>{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        style={{ width: "100%", boxSizing: "border-box", padding: "11px 12px", border: `1px solid ${COLORS.border}`, borderRadius: 9, background: "#fff", color: COLORS.text, fontFamily: FONT_BODY, fontSize: 13.5, outline: "none" }}
      />
    </label>
  );
}

export default function ProfileTab({ onLogout }) {
  const { lang, toggle, t } = useLang();
  const data = getOnboardingData();
  const [preferredName, setPreferredName] = useState(data.preferred_name || data.mother_name || "");
  const [legalFirstName, setLegalFirstName] = useState(data.legal_first_name || "");
  const [legalLastName, setLegalLastName] = useState(data.legal_last_name || "");
  const [phone, setPhone] = useState(data.phone || "");
  const [birthDate, setBirthDate] = useState(data.baby_birth_date || "");
  const [showDate, setShowDate] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [logoutPending, setLogoutPending] = useState(false);
  const [logoutError, setLogoutError] = useState(false);

  const handleSave = () => {
    const profile = {
      preferred_name: preferredName || "",
      mother_name: preferredName || "",
      legal_first_name: legalFirstName || "",
      legal_last_name: legalLastName || "",
      phone: phone || "",
      baby_birth_date: birthDate || null,
    };
    saveOnboarding(profile);
    syncProfile(profile);
    setSaved(true);
    setShowDate(false);
    window.setTimeout(() => setSaved(false), 1600);
  };

  return (
    <div style={{ fontFamily: FONT_BODY }}>
      <TabHero eyebrow={t.nav.profile} title={t.profile.title} subtitle={t.profile.subtitle} theme="rose" />
      <TabSheet>
        <Card style={{ display: "flex", flexDirection: "column", gap: 14, padding: 20 }}>
          <Field label={t.home.settings.preferredName} value={preferredName} onChange={setPreferredName} placeholder={t.home.settings.preferredNamePlaceholder} maxLength={30} />
          <Field label={t.home.settings.legalFirstName} value={legalFirstName} onChange={setLegalFirstName} placeholder={t.home.settings.legalFirstNamePlaceholder} />
          <Field label={t.home.settings.legalLastName} value={legalLastName} onChange={setLegalLastName} placeholder={t.home.settings.legalLastNamePlaceholder} />
          <Field label={t.home.settings.phone} value={phone} onChange={setPhone} placeholder={t.home.settings.phonePlaceholder} type="tel" maxLength={20} />

          <div>
            <div style={{ marginBottom: 5, fontSize: 11, fontWeight: 800, color: COLORS.subheading }}>{t.home.settings.babyArrivalDate}</div>
            <button type="button" onClick={() => setShowDate((value) => !value)} style={{ width: "100%", minHeight: 44, padding: "10px 12px", border: `1px solid ${COLORS.border}`, borderRadius: 9, background: "#fff", color: birthDate ? COLORS.text : COLORS.muted, textAlign: "left", fontFamily: FONT_BODY, fontSize: 13.5, cursor: "pointer" }}>
              <span>{birthDate ? new Date(`${birthDate}T00:00:00`).toLocaleDateString(lang === "th" ? "th-TH" : "en-US", { month: "long", day: "numeric", year: "numeric" }) : t.home.settings.notSet}</span>
              <span style={{ float: "right", color: COLORS.accentInk, fontSize: 11, fontWeight: 800 }}>{showDate ? t.home.settings.close : t.home.settings.change}</span>
            </button>
            {showDate && <div style={{ marginTop: 8 }}><DatePicker value={birthDate} onChange={setBirthDate} /></div>}
          </div>

          <PrimaryButton onClick={handleSave} style={{ background: saved ? COLORS.green : COLORS.cta }}>
            {saved ? t.home.settings.saved : t.home.settings.saveChanges}
          </PrimaryButton>
        </Card>

        <Card style={{ padding: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: COLORS.subheading }}>{t.profile.languageTitle}</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 7 }}>
            <span style={{ fontSize: 13, color: COLORS.muted }}>{t.profile.languageCurrent.replace("{{language}}", lang === "th" ? "ไทย" : "English")}</span>
            <button type="button" onClick={toggle} className="afterbloom-focus" style={{ minHeight: 42, padding: "9px 13px", border: `1px solid ${COLORS.border}`, borderRadius: 9, background: "#fff", color: COLORS.accentInk, fontFamily: FONT_BODY, fontSize: 12, fontWeight: 800, cursor: "pointer" }}>
              {t.profile.switchLanguage}
            </button>
          </div>
        </Card>

        {shouldShowIosInstallGuide() && (
          <Card style={{ padding: 16 }}>
            <button type="button" aria-expanded={showIosGuide} aria-controls="ios-install-guide" onClick={() => setShowIosGuide((value) => !value)} className="afterbloom-focus" style={{ width: "100%", minHeight: 44, display: "flex", alignItems: "center", gap: 9, padding: "8px 4px", border: 0, background: "transparent", color: COLORS.subheading, textAlign: "left", fontFamily: FONT_BODY, cursor: "pointer" }}>
              <Share2 size={17} aria-hidden="true" />
              <span style={{ flex: 1, fontSize: 12.5, fontWeight: 800 }}>{t.profile.installTitle}</span>
              <ChevronDown size={15} aria-hidden="true" style={{ transform: showIosGuide ? "rotate(180deg)" : undefined }} />
            </button>
            {showIosGuide && (
              <div id="ios-install-guide" role="region" aria-label={t.profile.installTitle} style={{ marginTop: 7, padding: "10px 12px", borderRadius: 9, background: COLORS.accentSoft, color: COLORS.muted, fontSize: 11.5, lineHeight: 1.6 }}>
                <div>1. {t.profile.installStepOne}</div>
                <div>2. {t.profile.installStepTwo}</div>
              </div>
            )}
          </Card>
        )}

        <Card style={{ padding: 18, borderColor: "#E8C4C0" }}>
          <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 800, color: COLORS.subheading }}>{t.home.settings.account}</div>
          <button type="button" onClick={() => { setShowLogoutConfirm(true); setLogoutError(false); }} className="afterbloom-focus" style={{ width: "100%", minHeight: 48, display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: "1px solid #E8C4C0", borderRadius: 9, background: "#fff", color: "#A34F56", textAlign: "left", fontFamily: FONT_BODY, cursor: "pointer" }}>
            <LogOut size={17} aria-hidden="true" />
            <span><span style={{ display: "block", fontSize: 13, fontWeight: 800 }}>{t.home.settings.signOut}</span><span style={{ display: "block", marginTop: 1, fontSize: 11.5, color: COLORS.muted }}>{t.home.settings.signOutDescription}</span></span>
          </button>
        </Card>
        <div aria-hidden="true" style={{ height: 8 }} />
      </TabSheet>

      {showLogoutConfirm && createPortal(
        <div role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !logoutPending) setShowLogoutConfirm(false); }} style={{ position: "fixed", inset: 0, zIndex: 130, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "rgba(54,37,34,.46)", fontFamily: FONT_BODY }}>
          <div role="alertdialog" aria-modal="true" aria-labelledby="profile-logout-title" aria-describedby="profile-logout-body" style={{ width: "100%", maxWidth: 340, borderRadius: 12, background: "#FFFDFC", padding: 20, boxShadow: "0 20px 60px rgba(58,35,32,.24)" }}>
            <div id="profile-logout-title" style={{ fontSize: 17, fontWeight: 800, color: COLORS.heading }}>{t.home.settings.signOutConfirmTitle}</div>
            <p id="profile-logout-body" style={{ marginTop: 7, fontSize: 13, lineHeight: 1.6, color: COLORS.muted }}>{t.home.settings.signOutConfirmBody}</p>
            {logoutError && <p role="alert" style={{ marginTop: 9, fontSize: 12, color: "#A33E47" }}>{t.home.settings.signOutError}</p>}
            <div style={{ display: "flex", gap: 9, marginTop: 18 }}>
              <button type="button" disabled={logoutPending} onClick={() => setShowLogoutConfirm(false)} className="afterbloom-focus" style={{ flex: 1, minHeight: 44, border: `1px solid ${COLORS.border}`, borderRadius: 8, background: "#fff", color: COLORS.muted, fontFamily: FONT_BODY, fontSize: 13, fontWeight: 700 }}>{t.home.settings.cancel}</button>
              <button type="button" disabled={logoutPending} onClick={async () => { setLogoutPending(true); setLogoutError(false); try { await onLogout?.(); } catch { setLogoutPending(false); setLogoutError(true); } }} className="afterbloom-focus" style={{ flex: 1, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, border: 0, borderRadius: 8, background: "#A9535A", color: "#fff", fontFamily: FONT_BODY, fontSize: 13, fontWeight: 800 }}>
                {logoutPending && <LoaderCircle size={15} className="animate-spin" aria-hidden="true" />}
                {logoutPending ? t.home.settings.signingOut : t.home.settings.confirmSignOut}
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
