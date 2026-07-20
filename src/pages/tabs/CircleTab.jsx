import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Heart, CheckCircle2, Send } from "lucide-react";
import { FONT_BODY, FONT_SERIF, COLORS, ACCENT_COLORS, Card, PrimaryButton, TabHero, TabSheet, HeroAccent } from "../../lib/theme.jsx";
import { useLang } from "../../lib/i18n";

const supporters = [
  {
    name: "David",
    nameTh: "ดาวิด",
    role: "Partner",
    roleTh: "คู่ชีวิต",
    accent: "blueGrey",
    task: "Night feeding shift",
    taskTh: "ดูแลน้องตอนกลางคืน",
    taskDone: false,
    lastActive: "Online now",
    lastActiveTh: "ออนไลน์อยู่",
    online: true,
  },
  {
    name: "Mom",
    nameTh: "แม่",
    role: "Family",
    roleTh: "ครอบครัว",
    accent: "accent",
    task: "Grocery run this week",
    taskTh: "ซื้อของในสัปดาห์นี้",
    taskDone: true,
    lastActive: "Active 2h ago",
    lastActiveTh: "ออนไลน์เมื่อ 2 ชั่วโมงที่แล้ว",
    online: false,
  },
  {
    name: "Sarah",
    nameTh: "ซาร่า",
    role: "Trusted person",
    roleTh: "คนที่ไว้ใจ",
    accent: "amber",
    task: "Just check in with me",
    taskTh: "แค่ส่งข้อความให้ฉัน",
    taskDone: false,
    lastActive: "Active 1h ago",
    lastActiveTh: "ออนไลน์เมื่อ 1 ชั่วโมงที่แล้ว",
    online: false,
  },
];

const TASK_SUGGESTIONS_EN = [
  "Pick up groceries",
  "Take baby for a walk",
  "Cook one meal",
  "Just text me",
  "Watch the baby for 1 hour",
];

const focusBorder = (e) => { e.target.style.borderColor = COLORS.cta; };
const blurBorder = (e) => { e.target.style.borderColor = "transparent"; };

export default function CircleTab() {
  const { t, lang } = useLang();
  const taskSuggestions = t?.circle?.taskSuggestions ?? TASK_SUGGESTIONS_EN;
  const [tasks, setTasks] = useState(supporters.map((s) => s.taskDone));
  const [sentTo, setSentTo] = useState(supporters.map(() => false));
  const [requested, setRequested] = useState(taskSuggestions.map(() => false));
  const [showInvite, setShowInvite] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteContact, setInviteContact] = useState("");

  const toggleTask = (i) => setTasks((prev) => prev.map((t, idx) => (idx === i ? !t : t)));
  const toggleSent = (i) => setSentTo((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  const toggleRequested = (i) => setRequested((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  const handleInviteSubmit = () => {
    if (!inviteName.trim() || !inviteContact.trim()) {
      setInviteError(t.circle.inviteForm.errorMessage);
      return;
    }
    setInviteError("");
    setInviteSent(true);
  };

  const resetInvite = () => {
    setInviteSent(false);
    setInviteName("");
    setInviteContact("");
    setInviteError("");
  };

  const inputStyle = {
    width: "100%",
    background: COLORS.border + "33",
    borderRadius: 10,
    padding: "11px 14px",
    fontSize: 13.5,
    color: COLORS.text,
    border: "1px solid transparent",
    outline: "none",
    fontFamily: FONT_BODY,
  };

  const labelStyle = { fontSize: 12, fontWeight: 700, color: COLORS.heading, display: "block", marginBottom: 6 };

  return (
    <div style={{ fontFamily: FONT_BODY }}>
      <TabHero
        theme="lavender"
        eyebrow={t.circle.eyebrow}
        title={<>{t.circle.title}<HeroAccent>{t.circle.titleAccent}</HeroAccent></>}
        subtitle={t.circle.subtitle}
      />
      <TabSheet gap={14}>
      {/* Stats Banner */}
      <div style={{ background: COLORS.accentSoft, borderRadius: 16, padding: 18, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Heart style={{ width: 22, height: 22, color: COLORS.accent }} />
        </div>
        <div>
          <p style={{ fontSize: 15.5, fontWeight: 700, color: COLORS.heading }}>{t.circle.peopleCount.replace("{{count}}", supporters.length)}</p>
          <p style={{ fontSize: 12.5, color: COLORS.muted, marginTop: 2 }}>
            {t.circle.tasksLabel.replace("{{count}}", tasks.filter(Boolean).length).replace("{{plural}}", tasks.filter(Boolean).length === 1 ? t.circle.taskSingular : t.circle.taskPlural)} {t.circle.tasksDoneLabel}
          </p>
        </div>
      </div>

      {/* Your people */}
      <Card>
        <p style={{ fontSize: 12.5, fontWeight: 800, color: COLORS.subheading, marginBottom: 14 }}>{t.circle.yourPeople}</p>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {supporters.map((person, i) => {
            const accentColors = ACCENT_COLORS[person.accent] || ACCENT_COLORS.accent;
            return (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderTop: i > 0 ? `1px solid ${COLORS.border}` : "none" }}
              >
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div
                    aria-hidden="true"
                    style={{ width: 48, height: 48, borderRadius: 12, background: accentColors.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_SERIF, fontSize: 20, fontWeight: 500, color: accentColors.text }}
                  >
                    {person.name.charAt(0)}
                  </div>
                  <div
                    aria-hidden="true"
                    style={{ position: "absolute", bottom: -2, right: -2, width: 12, height: 12, borderRadius: "50%", background: person.online ? COLORS.green : COLORS.label, border: "2px solid #fff" }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.heading }}>{lang === "th" ? person.nameTh : person.name}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: accentColors.text, background: accentColors.bg, padding: "2px 7px", borderRadius: 6 }}>
                      {lang === "th" ? person.roleTh : person.role}
                    </span>
                  </div>
                  <p style={{ fontSize: 11.5, color: COLORS.label, marginTop: 2 }}>{lang === "th" ? person.lastActiveTh : person.lastActive}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                    <button
                      onClick={() => toggleTask(i)}
                      aria-pressed={tasks[i]}
                      aria-label={t.circle.ariaLabels.taskCheckbox.replace("{{task}}", lang === "th" ? person.taskTh : person.task).replace("{{state}}", tasks[i] ? t.circle.ariaLabels.taskNotDone : t.circle.ariaLabels.taskDone)}
                      className="afterbloom-focus"
                      style={{ width: 24, height: 24, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: tasks[i] ? "none" : `2px solid ${COLORS.border}`, background: tasks[i] ? COLORS.green : "transparent", cursor: "pointer" }}
                    >
                      {tasks[i] && <CheckCircle2 style={{ width: 14, height: 14, color: "#fff" }} />}
                    </button>
                    <p style={{ fontSize: 12.5, color: COLORS.muted, textDecoration: tasks[i] ? "line-through" : "none" }}>{lang === "th" ? person.taskTh : person.task}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSent(i)}
                  aria-pressed={sentTo[i]}
                  aria-label={sentTo[i] ? `Reminder sent to ${person.name}` : `Send a reminder to ${person.name} about "${person.task}"`}
                  className="afterbloom-focus afterbloom-action"
                  style={{ width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: sentTo[i] ? COLORS.greenSoft : COLORS.accentSoft, border: "none", cursor: "pointer" }}
                >
                  {sentTo[i] ? <CheckCircle2 style={{ width: 17, height: 17, color: COLORS.green }} /> : <Send style={{ width: 16, height: 16, color: COLORS.accent }} />}
                </button>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Task Suggestions */}
      <Card>
        <p style={{ fontSize: 12.5, fontWeight: 800, color: COLORS.subheading, marginBottom: 2 }}>{t.circle.askForHelp}</p>
        <p style={{ fontSize: 12.5, color: COLORS.muted, marginBottom: 14, lineHeight: 1.5 }}>
          {t.circle.askHint}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {taskSuggestions.map((task, i) => (
            <button
              key={task}
              onClick={() => toggleRequested(i)}
              aria-pressed={requested[i]}
              aria-label={requested[i] ? t.circle.ariaLabels.requestSent.replace("{{task}}", task) : t.circle.ariaLabels.askCircle.replace("{{task}}", task)}
              className="afterbloom-focus afterbloom-action"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 999,
                fontSize: 12.5,
                fontWeight: 600,
                background: requested[i] ? COLORS.accentSoft : COLORS.border + "40",
                color: requested[i] ? COLORS.accent : COLORS.muted,
                border: `1px solid ${requested[i] ? COLORS.accent + "40" : "transparent"}`,
                cursor: "pointer",
              }}
            >
              {requested[i] && <CheckCircle2 style={{ width: 13, height: 13 }} />}
              {task}
            </button>
          ))}
        </div>
      </Card>

      {/* Invite Button + Form */}
      <button
        onClick={() => setShowInvite(!showInvite)}
        aria-expanded={showInvite}
        className="afterbloom-focus afterbloom-action"
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "14px 16px",
          borderRadius: 14,
          border: `2px dashed ${COLORS.border}`,
          background: "transparent",
          color: COLORS.muted,
          fontSize: 13.5,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        <UserPlus style={{ width: 16, height: 16 }} />
        {t.circle.inviteButton}
      </button>

      <AnimatePresence>
        {showInvite && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ overflow: "hidden" }}>
            <Card>
              {inviteSent ? (
                <div style={{ textAlign: "center", padding: "8px 0" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: COLORS.greenSoft, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                    <CheckCircle2 style={{ width: 22, height: 22, color: COLORS.green }} />
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: COLORS.heading }}>{t.circle.inviteSuccess.message.replace("{{name}}", inviteName)}</p>
                  <p style={{ fontSize: 12.5, color: COLORS.muted, marginTop: 4 }}>{t.circle.inviteSuccess.details}</p>
                  <button onClick={resetInvite} className="afterbloom-focus" style={{ marginTop: 14, fontSize: 12.5, fontWeight: 700, color: COLORS.accentInk, background: "none", border: "none", cursor: "pointer" }}>
                    {t.circle.inviteSuccess.resetButton}
                  </button>
                </div>
              ) : (
                <>
                  <p style={{ fontSize: 13, fontWeight: 800, color: COLORS.subheading, marginBottom: 14 }}>{t.circle.inviteForm.title}</p>
                  <label htmlFor="invite-name" style={labelStyle}>{t.circle.inviteForm.nameLabel}</label>
                  <input
                    id="invite-name"
                    type="text"
                    placeholder={t.circle.inviteForm.namePlaceholder}
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    onFocus={focusBorder}
                    onBlur={blurBorder}
                    style={{ ...inputStyle, marginBottom: 12 }}
                  />
                  <label htmlFor="invite-contact" style={labelStyle}>{t.circle.inviteForm.contactLabel}</label>
                  <input
                    id="invite-contact"
                    type="text"
                    placeholder={t.circle.inviteForm.contactPlaceholder}
                    value={inviteContact}
                    onChange={(e) => setInviteContact(e.target.value)}
                    onFocus={focusBorder}
                    onBlur={blurBorder}
                    style={{ ...inputStyle, marginBottom: inviteError ? 8 : 14 }}
                  />
                  {inviteError && (
                    <p role="alert" style={{ fontSize: 12, color: COLORS.accentInk, marginBottom: 12 }}>{inviteError}</p>
                  )}
                  <PrimaryButton onClick={handleInviteSubmit}>{t.circle.inviteForm.submitButton}</PrimaryButton>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clearance so the floating "I Need Help" button doesn't overlap the invite CTA */}
      <div aria-hidden="true" style={{ height: 36 }} />
      </TabSheet>
    </div>
  );
}
