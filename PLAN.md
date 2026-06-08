# PLAN.md — Afterbloom (เดิม MaMa)

> แผนแม่บทสำหรับรีแบรนด์ `MaMa` -> `Afterbloom` และปรับ UX ให้ตรง `Afterbloom_DailyCheckin_Spec`
> วิธีใช้: ทำทีละ phase เท่านั้น, จบ phase แล้วหยุดให้ review diff, แล้วค่อยไป phase ถัดไป
> ถ้าจะอัปเดต GitHub ให้รวมเป็นชุดหลังจบ phase นั้น ๆ ไม่ push รายไฟล์
> รอบนี้เริ่มจากเข้าใจโครงสร้างจริงของ repo ก่อน แล้วค่อยไล่แก้ตามลำดับ
>
> หมายเหตุ: บรรทัดที่ขึ้นต้นด้วย `‹เติม›` คือช่องที่ต้องกรอกจากโค้ดจริง / สเปคจริงก่อนลงมือ

---

## 0. Context

- App shell จริงอยู่ที่ `src/App.jsx` -> `src/pages/Dashboard.jsx`
- Main flows อยู่ใน `src/components/afterbloom/*` และ `src/pages/tabs/*`
- Data / scoring / persistence อยู่ใน `src/lib/*`
- Branding hook หลักอยู่ที่ `index.html`, `src/index.css`, `src/main.jsx`
- (อัปเดตหลัง bulk rebrand) ชื่อเดิม `MaMa` / `calmmama` ถูกแทนหมดแล้ว — เหลือเฝ้าระวัง over-replacement (ดู Phase 0 Audit Results ท้ายไฟล์)
- รอบนี้ต้องคุม UX ให้เป็น postpartum support ที่ไม่ตัดสิน และต้องมี `I Need Help` เข้าถึงได้ทุก state

---

## 1. โครงสร้างจริงของโปรเจกต์

- Entry gate: `src/App.jsx` เปิด `Onboarding` ครั้งแรก แล้วส่งเข้า shell หลักที่ `src/pages/Dashboard.jsx`
- App shell: `src/pages/Dashboard.jsx` คุม tab, check-in flow, EPDS flow, safety overlay, และ legacy unlock
- Main surfaces:
  - `src/pages/tabs/HomeTab.jsx`
  - `src/pages/tabs/MoodTab.jsx`
  - `src/pages/tabs/CarePlansTab.jsx`
  - `src/pages/tabs/JournalTab.jsx`
  - `src/pages/tabs/TherapyTab.jsx`
  - `src/pages/tabs/CircleTab.jsx`
  - `src/pages/tabs/LegacyTab.jsx`
- Flow components:
  - `src/components/afterbloom/Onboarding.jsx`
  - `src/components/afterbloom/CheckInFlow.jsx`
  - `src/components/afterbloom/MoodCheckIn.jsx`
  - `src/components/afterbloom/EpdsFlow.jsx`
  - `src/components/afterbloom/SafetySection.jsx`
  - `src/components/afterbloom/DailyGoal.jsx`
  - `src/components/afterbloom/CareTimeline.jsx`
- Shared shell / UI:
  - `src/components/afterbloom/BottomNav.jsx`
  - `src/components/afterbloom/BottomSafeArea.jsx`
  - `src/components/afterbloom/Header.jsx`
  - `src/components/afterbloom/CheckInBtn.jsx`
  - `src/components/afterbloom/CTAButtons.jsx`
  - `src/components/afterbloom/DatePicker.jsx`
  - `src/components/afterbloom/TimePicker.jsx`
- State / scoring / profile:
  - `src/lib/AuthContext.jsx`
  - `src/lib/user-data.js`
  - `src/lib/mood-data.js`
  - `src/lib/epds-data.js`
- Global branding hooks:
  - `index.html`
  - `src/index.css`
  - `src/main.jsx`

---

## 2. หลักการที่ห้ามพลาด

1. `worry_score` ต้องเก็บค่าดิบ แล้ว invert ตอนคำนวณ: `adjusted_worry = 6 - worry_score`
2. ห้ามใช้คำว่า `Support Level` ทุกที่ ใช้ `Today's Support Level`
3. `I Need Help` ต้อง visible ทุกหน้า / ทุก state
4. Conditional follow-up โผล่เฉพาะเมื่อ `composite < 2.5` หรือ core indicator ใดได้ `1`
5. Support Need trigger จาก pattern เท่านั้น ไม่ถามทุกวัน
6. โทนต้องไม่ตัดสิน และห้ามใช้คำที่ตีตราแม่
7. Phase จบแล้วต้องหยุด review ก่อนเสมอ

---

## Phase 0 — Audit and String Map

เป้าหมาย: หา footprint จริงของ `Afterbloom` / `Support Level` / copy ตัดสิน / brand key / storage key ก่อนเริ่มแก้

- [x] สแกนทุกไฟล์ที่เกี่ยวกับ onboarding, home, check-in, help, EPDS, journal, scoring
- [x] ระบุ string ที่ยังเป็นชื่อเดิมใน UI, state key, storage key, event name, empty state, modal copy
- [x] แยกไฟล์ที่เป็น shell / flow / data / tab / shared UI ให้ชัด
- [x] เช็คว่ามี `PLAN.md`, docs state, หรือ session log ที่ต้อง sync ก่อนเริ่ม phase
- [x] สรุปว่าไฟล์ไหนต้องแก้ก่อน, ไฟล์ไหนรอ structural cleanup ทีหลัง

ไฟล์ที่ต้องดูเป็นหลัก:
- `src/App.jsx`
- `src/pages/Dashboard.jsx`
- `src/pages/tabs/HomeTab.jsx`
- `src/pages/tabs/MoodTab.jsx`
- `src/pages/tabs/CarePlansTab.jsx`
- `src/pages/tabs/JournalTab.jsx`
- `src/pages/tabs/TherapyTab.jsx`
- `src/pages/tabs/LegacyTab.jsx`
- `src/components/afterbloom/Onboarding.jsx`
- `src/components/afterbloom/CheckInFlow.jsx`
- `src/components/afterbloom/MoodCheckIn.jsx`
- `src/components/afterbloom/EpdsFlow.jsx`
- `src/components/afterbloom/SafetySection.jsx`
- `src/lib/AuthContext.jsx`
- `src/lib/user-data.js`
- `src/lib/mood-data.js`
- `src/lib/epds-data.js`
- `index.html`
- `src/index.css`

Done when:
- [x] มี string map ของ `MaMa` / `Support Level` (ดู Phase 0 Audit Results ท้ายไฟล์)
- [x] มีรายชื่อ flow และไฟล์ที่ครอบ
- [x] มีรายการสิ่งที่แก้ได้ทันที vs ต้องรอ phase ถัดไป

---

## Phase 1 — Rebrand Surface: `MaMa` -> `Afterbloom`

เป้าหมาย: เปลี่ยนทุกอย่างที่ผู้ใช้เห็น และทุก reference ที่ผูกกับชื่อเดิม

- [ ] เปลี่ยน app title, header, welcome copy, CTA, empty state, modal copy
- [ ] เปลี่ยนชื่อที่โผล่ใน onboarding / home / journal / therapy / care plan / legacy tab
- [ ] เปลี่ยนชื่อ asset / logo / icon / label ที่อ้างชื่อเดิม
- [ ] เปลี่ยน mock data / seed data ที่แสดงชื่อเดิม
- [ ] เปลี่ยน storage key / brand key / event name ที่สะท้อน brand เดิม ถ้ามีผลต่อ UX
- [x] rename folder `calmmama` -> `afterbloom` เรียบร้อยแล้ว (import path อัปเดตครบ)

ไฟล์ที่ต้องแก้:
- `index.html`
- `src/index.css`
- `src/App.jsx`
- `src/main.jsx`
- `src/lib/AuthContext.jsx`
- `src/lib/user-data.js`
- `src/pages/Dashboard.jsx`
- `src/pages/tabs/HomeTab.jsx`
- `src/pages/tabs/MoodTab.jsx`
- `src/pages/tabs/CarePlansTab.jsx`
- `src/pages/tabs/JournalTab.jsx`
- `src/pages/tabs/LegacyTab.jsx`
- `src/pages/tabs/TherapyTab.jsx`
- `src/components/afterbloom/Onboarding.jsx`
- `src/components/afterbloom/CheckInBtn.jsx`
- `src/components/afterbloom/CheckInFlow.jsx`
- `src/components/afterbloom/BottomNav.jsx`
- `src/components/afterbloom/BottomSafeArea.jsx`
- `src/components/afterbloom/DailyReminder.jsx`
- `src/components/afterbloom/Header.jsx`
- `src/components/afterbloom/MoodCheckIn.jsx`
- `src/components/afterbloom/SafetySection.jsx`
- `src/components/afterbloom/EpdsFlow.jsx`
- `src/components/afterbloom/RiskIndicator.jsx`
- `src/components/afterbloom/CareTimeline.jsx`
- `src/components/afterbloom/MilestonesSection.jsx`
- `src/components/afterbloom/MoodInsights.jsx`
- `src/components/afterbloom/SelfCareTools.jsx`
- `src/components/afterbloom/SupportCircle.jsx`
- `src/components/afterbloom/JournalSection.jsx`
- `src/components/afterbloom/JournalPreview.jsx`
- `src/components/afterbloom/TimePicker.jsx`
- `src/lib/mood-data.js`
- `src/lib/epds-data.js`

Done when:
- [x] ไม่มี `MaMa` / `friend` ในข้อความที่ผู้ใช้เห็น (ยืนยันใน Phase 0 audit)
- [ ] title / header / CTA / empty state เปลี่ยนเป็น Afterbloom
- [ ] string เดิมที่เหลืออยู่มีแค่ internal path ที่ยังไม่พร้อม rename

---

## Phase 2 — Support Level Model and Result Copy

เป้าหมาย: เปลี่ยน `Support Level` เป็น `Today's Support Level` และทำ 4 ระดับให้ทำงานจริง

- [x] เปลี่ยนชื่อแสดงผลทุกที่เป็น `Today's Support Level` (HomeTab, MoodTab, SupportIndicator) — ตัดสินใจใช้คำตาม PLAN §2 ทับ spec ที่เขียน "Support Level"; ลบ label ที่โชว์ชื่อระดับซ้ำ 2 ที่ใน MoodTab
- [ ] ย้าย logic การจัดระดับให้อ่านจาก score เดิม และคำนวณระดับใหม่ตามสเปค
- [ ] ทำ 4 ระดับ:
  - [ ] `Steady`
  - [ ] `Gentle Support`
  - [ ] `Extra Support Recommended`
  - [ ] `Immediate Support`
- [ ] ผูก CTA และข้อความให้ต่างกันตามระดับ
- [ ] แยก copy สำหรับ result card, badge, summary, helper text, journal prompt
- [ ] ถ้ามี chart / indicator / ribbon / badge ให้แสดงระดับใหม่เหมือนกันทุกจุด

ไฟล์ที่ต้องแก้:
- `src/lib/mood-data.js`
- `src/lib/epds-data.js`
- `src/components/afterbloom/RiskIndicator.jsx`
- `src/components/afterbloom/CheckInFlow.jsx`
- `src/components/afterbloom/MoodCheckIn.jsx`
- `src/components/afterbloom/EpdsFlow.jsx`
- `src/pages/tabs/MoodTab.jsx`
- `src/pages/tabs/HomeTab.jsx`

Done when:
- [ ] ไม่มี `Support Level` ใน UI
- [ ] ผลลัพธ์ 4 ระดับแสดงถูกทุกหน้า
- [ ] CTA / tone เปลี่ยนตามระดับจริง

---

## Phase 3 — Onboarding (กรอกครั้งแรกครั้งเดียว)

เป้าหมาย: เก็บ input ขั้นต่ำที่ใช้ขับ UX ทั้งแอป

ต้องมีจริง: (field-name alignment เสร็จ 2026-06-09 — stored keys ตรง spec)
- [x] `baby_birth_date` - สำคัญสุด ใช้คำนวณ stage (getDaysSinceBirth อ่านแล้ว)
- [x] `mother_name` - ใช้ greeting (getDisplayName อ่านแล้ว)
- [x] `preferred_checkin_time` - เก็บแล้ว + accessor `getPreferredCheckinTime()` (ยังไม่ wire reminder — Phase 4)
- [x] `is_first_time_mother` - map "first"/"subsequent" -> true/false/null + accessor `getIsFirstTimeMother()`

ขั้นรอง / mock ได้:
- [ ] `hospital_name`
- [ ] `sharing_preference`

งานที่ต้องทำ:
- [ ] ผูก onboarding state กับ profile/state storage ให้จบในครั้งแรก
- [ ] หลัง submit ต้องส่งค่าที่เก็บแล้วไปใช้ใน home / check-in / help / result
- [ ] ทำ copy ให้ไม่กดดัน และไม่บังคับกรอกข้อมูลเกินจำเป็น
- [ ] หากมี default value ให้เป็นค่าที่ไม่ bias ผู้ใช้

ไฟล์ที่ต้องแก้:
- `src/components/afterbloom/Onboarding.jsx`
- `src/components/afterbloom/DatePicker.jsx`
- `src/components/afterbloom/TimePicker.jsx`
- `src/lib/AuthContext.jsx`
- `src/lib/user-data.js`
- `src/App.jsx`

Done when:
- [x] onboarding เก็บข้อมูลขั้นต่ำได้ครบ (verified: save keys = baby_birth_date/mother_name/is_first_time_mother/preferred_checkin_time)
- [x] ข้อมูลถูกใช้ต่อใน home (greeting "Good morning, Mali." + stage badge จาก baby_birth_date — verified headless)
- [x] ไม่มี copy ที่ทำให้ผู้ใช้รู้สึกถูกตัดสิน (คง copy เดิมที่ไม่ตัดสิน)

> หมายเหตุ: รอบนี้ทำแค่ field-name alignment (rename stored keys). `hospital_name` / `sharing_preference` (ขั้นรอง) ยังไม่เพิ่ม; reminder wiring จาก `preferred_checkin_time` รอ Phase 4. ไม่ได้แตะ local state var ใน Onboarding (เปลี่ยนเฉพาะ key ตอน save).

---

## Phase 4 — Home Screen

เป้าหมาย: home ต้องเป็น summary ของข้อมูลจริง ไม่ใช่หน้ากรอก

- [x] Greeting จาก `mother_name`
- [x] Stage badge จาก `baby_birth_date`
- [x] Daily check-in CTA แสดงสถานะว่าวันนี้ทำแล้วหรือยัง
- [x] Care journey card สร้างจาก postpartum stage อัตโนมัติ
- [x] Mood trend 7 วัน จาก history จริง (reuse `getMoodChartData`, recharts; empty state ครบ)
- [ ] Tiny goal แสดงหลัง result ล่าสุด → Phase 8
- [ ] ปุ่ม `I Need Help` ต้องอยู่บน home ตลอด → Phase 7
- [x] + reminder copy (mock) จาก `preferred_checkin_time` บน check-in CTA

งานที่ต้องทำ:
- [ ] สร้าง mapping `postpartum_day -> stage`
- [ ] แยกข้อมูลที่เป็น profile, history, และ state ปัจจุบันออกจากกัน
- [ ] ตรวจว่าการ์ดต่าง ๆ ใช้ข้อมูลจาก source เดียวกัน ไม่ hardcode ซ้ำ

ไฟล์ที่ต้องแก้:
- `src/pages/tabs/HomeTab.jsx`
- `src/lib/user-data.js`
- `src/components/afterbloom/CareTimeline.jsx`
- `src/components/afterbloom/DailyGoal.jsx`
- `src/components/afterbloom/CheckInBtn.jsx`
- `src/components/afterbloom/JournalPreview.jsx`
- `src/index.css`

Done when:
- [x] home ดึงข้อมูลจาก onboarding/history จริง (verified headless: greeting "Mali", trend วาดจริง)
- [x] stage badge และ journey card คำนวณได้ถูก (Week 2 จาก baby_birth_date 14 วัน)
- [ ] help button เห็นได้ตลอด → ทำใน Phase 7

---

## Phase 5 — Daily Check-in หลัก 4 ข้อ

เป้าหมาย: check-in ต้องสั้น, ทีละหน้า, จบได้ใน < 60 วินาที

- [ ] 1) `mood_score` 1-5
- [ ] 2) `sleep_score` 1-5 พร้อมคำถามที่ชัดเจนว่าแม้นอนไม่ต่อเนื่องก็ให้ตอบตามจริง
- [ ] 3) `energy_score` 1-5
- [ ] 4) `worry_score` 1-5 แบบ reversed แต่เก็บ raw value
- [ ] ทำ one question per screen
- [ ] ออกแบบ tap target ให้กดง่ายบนมือถือ
- [ ] คำนวณ `composite` เมื่อครบ 4 ข้อเท่านั้น
- [ ] ถ้าออกก่อนครบ 4 ข้อ ให้เก็บ draft และ resume ต่อได้ภายในวันเดียวกัน

งานที่ต้องทำ:
- [ ] แยก state ของคำตอบแต่ละข้อให้ชัด
- [ ] รักษา raw score ของ worry ไว้ แล้วค่อย invert ตอนคำนวณ
- [ ] ตรวจว่าผลลัพธ์และ progress bar สอดคล้องกับ step จริง

ไฟล์ที่ต้องแก้:
- `src/components/afterbloom/CheckInFlow.jsx`
- `src/components/afterbloom/MoodCheckIn.jsx`
- `src/lib/mood-data.js`
- `src/pages/tabs/MoodTab.jsx`
- `src/pages/tabs/HomeTab.jsx`
- `src/components/afterbloom/CTAButtons.jsx`

Done when:
- [ ] flow 4 ข้อทำงานครบ
- [ ] draft/resume ใช้งานได้
- [ ] composite คำนวณถูกจาก raw scores

---

## Phase 6 — Conditional Follow-up + Support Need

เป้าหมาย: follow-up ต้องโผล่เฉพาะเมื่อจำเป็น และ support need ต้องเป็น pattern-based

Follow-up trigger:
- [ ] `composite < 2.5`
- [ ] หรือ core indicator ใดได้ `1`

Follow-up fields:
- [ ] `problem_tags` แบบ multi-select สูงสุด 2
- [ ] `Something else` เป็น text จำกัดความยาว
- [ ] `optional_journal`
- [ ] `baby_connection_score` 1-5

Support Need trigger:
- [ ] `composite < 2.5` 3 วันต่อเนื่อง
- [ ] `mood = 1` และ `worry = 5` ในวันเดียวกัน
- [ ] ถ้า trigger แล้ว `support_request = true` ให้ route ไปขั้น help / dashboard flag
- [ ] ถ้าไม่ใช่ pattern ที่กำหนด ห้ามถาม support request ทุกวัน

งานที่ต้องทำ:
- [ ] ทำ logic trigger ให้แยกจาก daily check-in core
- [ ] ฟอร์ม follow-up ต้องไม่ block flow หลัก
- [ ] state ของ support_request ต้องถูกใช้ซ้ำใน home / help / result

ไฟล์ที่ต้องแก้:
- `src/components/afterbloom/CheckInFlow.jsx`
- `src/components/afterbloom/MoodCheckIn.jsx`
- `src/components/afterbloom/SafetySection.jsx`
- `src/lib/mood-data.js`
- `src/pages/tabs/MoodTab.jsx`

Done when:
- [ ] follow-up ปรากฏเฉพาะตอนเข้าเงื่อนไข
- [ ] support request ไม่ถูกถามพร่ำเพรื่อ
- [ ] pattern-based trigger ทำงานได้ตามสเปค

---

## Phase 7 — I Need Help / Emergency Flow

เป้าหมาย: ผู้ใช้เข้าถึงความช่วยเหลือได้ทันทีโดยไม่ต้องผ่าน check-in ก่อน

- [ ] ปุ่ม `I Need Help` visible ทุกหน้า / ทุก state
- [ ] เปิด flow ช่วยเหลือทันทีจาก home, tab, modal, result, และ onboarding state
- [ ] หน้าถามสั้น ๆ ว่าต้องการความช่วยเหลือแบบไหน
- [ ] มีทางเลือกไปยังคนที่ไว้ใจ, hospital, emergency, หรือ guidance
- [ ] ถ้าผู้ใช้ระบุว่าไม่ปลอดภัยกับตัวเอง ให้ไป urgent path ทันที
- [ ] log การใช้งาน help flow เป็น event เดียวกันทุกที่

งานที่ต้องทำ:
- [ ] แยก urgent help path ออกจาก general help path
- [ ] ให้ UI state, copy, และ CTA ใช้ชุดคำเดียวกัน
- [ ] ถ้า integration จริงยังไม่พร้อม ให้ mock action แต่คงโครง flow จริงไว้

ไฟล์ที่ต้องแก้:
- `src/components/afterbloom/SafetySection.jsx`
- `src/components/afterbloom/CTAButtons.jsx`
- `src/components/afterbloom/CheckInFlow.jsx`
- `src/pages/Dashboard.jsx`
- `src/pages/tabs/HomeTab.jsx`
- `src/pages/tabs/MoodTab.jsx`
- `src/pages/tabs/TherapyTab.jsx`

Done when:
- [ ] help flow เรียกได้จากทุกหน้า
- [ ] urgent path แยกจาก help ปกติชัดเจน
- [ ] log ใช้งาน help ได้

---

## Phase 8 — Tiny Goal + Care Journey

เป้าหมาย: result ต้องพาไปสู่การกระทำเล็ก ๆ ที่ทำได้จริง

- [ ] หลัง result เลือก tiny goal ได้ 1 อย่าง
- [ ] มีตัวเลือก `skip today` / `defer`
- [ ] Care Journey card บน home ต้องสร้างจาก stage อัตโนมัติ
- [ ] Care Journey ต้องอยู่บน home ไม่ใช่ซ่อนใน tab ลึก

งานที่ต้องทำ:
- [ ] ใช้ข้อมูล stage เดียวกับ home badge
- [ ] tiny goal ต้องไม่บังคับและไม่ทำให้ result flow หนักขึ้น
- [ ] ถ้ามี preview card / summary card ให้ใช้ copy เดียวกัน

ไฟล์ที่ต้องแก้:
- `src/components/afterbloom/DailyGoal.jsx`
- `src/components/afterbloom/CareTimeline.jsx`
- `src/pages/tabs/HomeTab.jsx`
- `src/lib/user-data.js`
- `src/components/afterbloom/JournalPreview.jsx`

Done when:
- [ ] result มี tiny goal ที่เลือกได้จริง
- [ ] care journey คำนวณจาก stage อัตโนมัติ
- [ ] home แสดง journey อย่างถูกที่

---

## Phase 9 — EPDS Screening

เป้าหมาย: ทำ screening flow แยกจาก daily check-in และตั้งชื่อให้ไม่ตีตรา

- [ ] ใช้ wording เช่น `Emotional Check`
- [ ] Trigger จาก stage, support level, repeated low mood, repeated worry
- [ ] Prototype ทำเป็น mock flow ได้ก่อน
- [ ] เก็บ `epds_answers[]`, `epds_total_score`, `screening_date`, `screening_trigger`, `screening_result_level`, `recommended_next_step`
- [ ] ถ้า screening trigger จาก home หรือ mood flow ต้อง route ไป flow เดียวกัน

งานที่ต้องทำ:
- [ ] แยก flow นี้ออกจาก daily 4 questions
- [ ] ผูก result กับ support level และ next step ให้สอดคล้องกัน
- [ ] copy ต้องไม่ใช้คำว่า depression test

ไฟล์ที่ต้องแก้:
- `src/components/afterbloom/EpdsFlow.jsx`
- `src/lib/epds-data.js`
- `src/pages/Dashboard.jsx`
- `src/pages/tabs/HomeTab.jsx`
- `src/pages/tabs/MoodTab.jsx`
- `src/components/afterbloom/RiskIndicator.jsx`

Done when:
- [ ] screening มีชื่อและ trigger ที่ถูกต้อง
- [ ] result data ถูกเก็บครบ
- [ ] flow แยกจาก daily check-in ชัดเจน

---

## Phase 10 — Hospital Dashboard Alerts

เป้าหมาย: เตรียม alert path สำหรับ integration โดยคงข้อมูลขั้นต่ำตาม PDPA

- [ ] Alert A: `support_request = true` -> notify dashboard
- [ ] Alert B: `composite < 2.5` 3 วันต่อเนื่อง -> flag
- [ ] Alert C: `safety_access_used = true` -> log + flag
- [ ] payload ต้องมีข้อมูลขั้นต่ำที่จำเป็น
- [ ] resolution flow ต้องทำให้ staff mark resolved ได้

งานที่ต้องทำ:
- [ ] ทำ mock/stub integration ก่อน ถ้า HIS scope ยังไม่พร้อม
- [ ] ใช้ payload schema เดียวกันทั้ง alert path
- [ ] ตรวจว่า resolution ของ staff เปิด flow support request ใหม่ได้

ไฟล์ที่ต้องแก้:
- `src/lib/epds-data.js`
- `src/lib/mood-data.js`
- `src/pages/tabs/HomeTab.jsx`
- `src/pages/tabs/MoodTab.jsx`
- `src/components/afterbloom/SafetySection.jsx`
- `src/pages/Dashboard.jsx`

Done when:
- [ ] alert path มี schema ชัด
- [ ] mock integration ทำงานตาม flow
- [ ] resolution เปิด support request ใหม่ได้

---

## Phase 11 — Structural Cleanup

เป้าหมาย: ทำให้โค้ดพัฒนาต่อได้ง่ายขึ้นหลังฟีเจอร์หลักเสร็จ

- [ ] รวม string ซ้ำไปไว้ที่เดียวเท่าที่โครงสร้างปัจจุบันเอื้อ
- [ ] ลด component ที่รับผิดชอบหลายหน้าที่เกินไป
- [ ] แยก state / scoring / presentation ให้ชัด
- [x] rename folder `calmmama` -> `afterbloom` แล้ว (ทำไปพร้อม bulk rebrand)
- [ ] ตรวจว่าบาง screen ที่เป็น legacy ยังจำเป็นอยู่หรือควรถอด

ไฟล์ที่ต้องดู:
- `src/components/afterbloom/*`
- `src/pages/tabs/*`
- `src/lib/*`
- `src/index.css`
- `src/App.jsx`
- `src/pages/Dashboard.jsx`

Done when:
- [ ] dependency ระหว่าง flow ลดลง
- [ ] ขอบเขตแต่ละ component ชัดขึ้น
- [ ] พร้อมรับ phase ใหม่โดยไม่ต้องรื้อใหญ่

---

## Checkpoint Rule

หลังจบแต่ละ phase:

- [ ] อัปเดต `docs/CURRENT_STATE.md`
- [ ] append `docs/SESSION_LOGS/YYYY-MM-DD.md`
- [ ] refresh `tasks/TODO.md`
- [ ] ถ้ามี decision ใหม่ให้บันทึกใน `docs/DECISIONS.md`
- [ ] ถ้ามี issue ใหม่ให้บันทึกใน `docs/KNOWN_ISSUES.md`
- [ ] review diff ก่อนเริ่ม phase ถัดไป
- [ ] ถ้าจะ sync GitHub ให้ทำเป็น batch หลังจบ phase เท่านั้น

---

## Verification

- [ ] รันแอปและไล่ flow จริง: onboarding -> home -> daily check-in -> result -> help -> EPDS
- [ ] ทดสอบ 4 support levels ให้ครบ
- [ ] ทดสอบ conditional follow-up และ support need trigger
- [ ] ทดสอบ `I Need Help` จากทุก entry point
- [ ] ตรวจซ้ำว่าไม่มี `Afterbloom` / `Support Level` เหลือในข้อความผู้ใช้
- [ ] ตรวจว่า `worry_score` ยังเก็บ raw score
- [ ] รัน test / lint ที่เกี่ยวข้องถ้ามี

---

## Progress log

- `2026-06-08 | Plan aligned to real app structure; next step is phase-by-phase execution with review gate after each phase.`
- `2026-06-08 | Phase 0 audit complete. Bulk rebrand verified spec-compliant; only 1 over-replacement fixed (AuthContext name). Deviations logged as backlog below.`
- `2026-06-09 | Check-in UX pass: persistent header/footer (no per-answer replay), fade-up question body, options rise as one group, hid per-option Score. Phase 2 done: "Today's Support Level" heading + removed duplicate level label.`
- `2026-06-09 | Phase 3 done: onboarding stored keys aligned to spec (mother_name/baby_birth_date/is_first_time_mother/preferred_checkin_time). Verified writer+reader via headless Chrome (greeting "Good morning, Mali.").`
- `2026-06-09 | Phase 4 done: 7-day mood trend on Home (recharts + getMoodChartData, empty state) + mock reminder copy from preferred_checkin_time. Verified headless. (Tiny goal→P8, Help button→P7.)`

---

## Phase 0 — Audit Results (2026-06-08)

### String Map (จำแนกตามกลุ่ม A/B/C)

| ตำแหน่ง | คำ | กลุ่ม | สถานะ |
|--------|-----|------|--------|
| `src/**` (ทั้งหมด) | `MaMa` / `friend` | — | ✅ ไม่มีหลงเหลือ — ถูกแทนเป็น `Afterbloom` หมดแล้ว |
| `src/lib/AuthContext.jsx:6,21` | `name: "Afterbloom"` | **B** (ชื่อ user default) | ✅ **แก้แล้ว** → คืนเป็น `"Mama"` (เป็น dead/cosmetic, ไม่ถูกแสดง user-facing) |
| `src/components/afterbloom/Onboarding.jsx:126,136,183` | `Afterbloom` | A (brand) | ✅ ถูกต้อง — Welcome copy |
| `src/pages/tabs/CarePlansTab.jsx:217` | `Afterbloom` | A (brand) | ✅ ถูกต้อง |
| `src/lib/*` storage keys | `afterbloom_onboarding` / `afterbloom_mood_history` / `afterbloom_epds_history` / `afterbloom_just_onboarded` | C | ✅ consistent, ไม่มี `mama_*` ค้าง |
| `.vercel/project.json` | `mama-trauma-web-dev` | C (deploy config) | ⏸️ ไม่แตะ — เป็นชื่อ Vercel project, ไม่กระทบ UX |
| `Ref/*.html` | `Mama` / `CalmMama` | — | ⏸️ ไม่แตะ — ไฟล์ design reference, ไม่ได้ ship |
| `docs/*` | `MaMa -> Afterbloom` | — | ✅ ถูกต้อง — ประวัติการ rebrand |

### Spec-compliance ที่ verify แล้ว (ผ่าน)
- `worry_score` reversed: เก็บ raw (`worryScoreRaw`) แล้ว invert `6 - worryScore` ตอนคำนวณ composite — `mood-data.js:138-139` ✅
- Composite thresholds 4 ระดับ: steady ≥4.25 / gentle ≥3.5 / extra ≥2.5 / immediate <2.5 — `mood-data.js:80-87` ✅
- Follow-up trigger: `composite < 2.5` หรือ core indicator = 1 — `mood-data.js:262-264` ✅
- Support Need pattern: `mood=1 AND worry=5` หรือ composite<2.5 3 วันต่อเนื่อง — `mood-data.js:200,204-205` ✅
- Home greeting อ่าน `displayName` จาก onboarding, fallback `"there"` — `user-data.js:15-16` ✅ (ไม่หลุดเป็นชื่อแบรนด์)

### Backlog — deviation จาก spec (ไม่แก้ใน Phase 0, ส่งต่อ phase ระบุ)
- **[Phase 2 — DONE 2026-06-09]** Support Level label: เพิ่ม heading "Today's Support Level" + ลบ label ชื่อระดับที่ซ้ำ ทำใน HomeTab:294, MoodTab:364, SupportIndicator (dead comp). หมายเหตุ: `SupportIndicator.jsx` ยังเป็น dead code (ไม่ถูก render) → ลบทิ้งใน Phase 11 cleanup
- **[Phase 3 — DONE 2026-06-09]** Onboarding stored keys aligned to spec (`mother_name`, `baby_birth_date`, `is_first_time_mother`, `preferred_checkin_time`). อัปเดต readers: user-data.js (getDisplayName, getDaysSinceBirth) + accessors ใหม่ 2 ตัว, HomeTab settings. Verified writer+reader ใน headless Chrome
- **[Phase 5]** worry field internal เป็น `worryScore`/`worryScoreRaw` ต่างจาก spec `worry_score` — internal เท่านั้น
- **[Phase 9/EPDS]** ยังไม่ได้ verify EPDS data fields (`epds_answers[]`, `screening_trigger`, ฯลฯ) ครบตาม spec ในรอบนี้

### สรุป
รอบ bulk rebrand ทำได้สะอาดกว่าที่กลัวไว้ — logic หลัก (scoring/trigger) ตรง spec อยู่แล้ว, over-replacement มีจุดเดียวและแก้แล้ว. งานที่เหลือเป็น copy/label (Phase 2) และ field-naming alignment (Phase 3) — ไม่ใช่ Phase 0
