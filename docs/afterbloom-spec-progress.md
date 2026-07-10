# Afterbloom — Spec vs Code Progress Checklist

> เทียบ **"Afterbloom — Daily Check-in Feature Specification v1.0"** (Google Doc, มิ.ย. 2026)
> กับโค้ดจริงในโปรเจกต์ ณ วันที่ **2026-07-10**
> Doc ID: `18HwPRBkykc80WJv3CtZTtr_yIh_3ywsy6pYyHXBks68`
>
> Legend: ✅ ทำแล้ว · 🟡 ทำบางส่วน / ต่างจาก spec · ❌ ยังไม่ทำ

---

## 1. Onboarding / Basic Setup (Spec Step 1)

| Spec field | สถานะ | หมายเหตุ |
|---|---|---|
| `mother_name` | ✅ | `user-data.js` → `mother_name` / `preferred_name` (getDisplayName) |
| `baby_birth_date` | ✅ | ใช้คำนวณ postpartum day/stage (`getDaysSinceBirth`, `getCurrentStage`) |
| `is_first_time_mother` | ✅ | `getIsFirstTimeMother()` |
| `hospital_name` | 🟡 | มี field เก็บได้ แต่ไม่ได้ผูกกับ dashboard/HIS |
| `preferred_checkin_time` | ✅ | `getPreferredCheckinTime()` (ยังเป็น mock notification เท่านั้น ตาม spec) |
| `sharing_preference` | 🟡 | spec ระบุว่าทำเป็น mock ได้ — ยังไม่มี UI แชร์จริง (ตาม spec ถูกต้อง) |

**Postpartum stages** (`user-data.js STAGES`): ✅ ครบ 8+1 stage ตรง spec
(Day 0–3, 4–13, Week 2, 6 weeks, Month 2–3, 4–6, 7–9, 10–12, Year 1+)

---

## 2. Daily Check-in — Phase 1: Core (Spec §3.1–3.4)

| Indicator | สถานะ | หมายเหตุ |
|---|---|---|
| `mood_score` 1–5 | ✅ | `CheckInFlow` step 1 |
| `sleep_score` 1–5 | ✅ | step 2 |
| `energy_score` 1–5 | ✅ | step 3 |
| `worry_score` 1–5 **(reversed)** | ✅ | step 4 · เก็บ raw, invert ตอน scoring (`6 - worry`) ตรง spec |
| One-question-per-screen | ✅ | `QuestionBody`, 4-dot progress |
| Partial check-in resume ในวันเดียว | ✅ | `saveCheckinDraft`/`getCheckinDraft` (§4.1 addendum) |

---

## 3. Daily Check-in — Phase 2: Conditional Follow-up (Spec §3.5–3.7)

Trigger: `composite < 2.5` **หรือ** มี core indicator ใด = 1 → ✅ (`shouldFollowUp`)

| Screen | สถานะ | หมายเหตุ |
|---|---|---|
| 3.5 Problem tags (multi-select) | 🟡 | ทำแล้ว **แต่มี 13 tags** — spec มี 15 (ดู §wording ด้านล่าง) |
| — `problem_other_text` 150 ตัวอักษร | ✅ | เงื่อนไขโผล่เมื่อเลือก "อย่างอื่น" |
| — max select | 🟡 | app จำกัด **2** · spec ขัดกันเอง (บอกทั้ง "2" และ "up to 3") |
| 3.6 Journal (optional, 500 ตัวอักษร, ไม่บล็อก) | ✅ | `JournalScreen` |
| 3.7 Baby connection 1–5 | ✅ | `BabyConnectionScreen` (wording ต่าง — ดูล่าง) |

---

## 4. Daily Check-in — Phase 3: Support Need (Spec §3.9)

| รายการ | สถานะ | หมายเหตุ |
|---|---|---|
| Support Need question (Yes/Not now) | ✅ | `SupportNeedScreen` |
| Trigger A: composite < 2.5 ติดกัน 3 วัน | ✅ | `hasThreeConsecutiveLowComposite` |
| Trigger B: mood=1 AND worry=5 วันเดียว | ✅ | `shouldFlagSupportRequest` |
| suppression หลังตอบ (ไม่ถามซ้ำจนกว่าจะ resolve) | ✅ | `support-episode.js` + `isSupportEpisodeSuppressed` |
| `support_request` → sync dashboard | ✅ | `syncCheckin` → Firestore |

---

## 5. I Need Help (Spec — Always Accessible)

| รายการ | สถานะ | หมายเหตุ |
|---|---|---|
| ปุ่มถาวรบน Home, 1 tap, ไม่ต้องทำ check-in | ✅ | FAB + `SafetySection` |
| Route: trusted / hospital / safe | ✅ | 3 triage paths |
| Urgent path (สายด่วน 1323, 1669) | ✅ | เพิ่มเติมจาก spec |
| Breathing + Grounding (5-4-3-2-1) tools | ✅ | เพิ่มเติมจาก spec |
| `safety_access_used` log ทุกครั้งที่เปิด | ✅ | `logSafetyAccess` → `syncSafetyAccess` |

---

## 6. Scoring & Support Levels (Spec §4)

| รายการ | สถานะ | หมายเหตุ |
|---|---|---|
| `composite = (mood+sleep+energy+adjusted_worry)/4` | ✅ | `mood-data.js normalizeEntry` |
| ไม่ใช้คำว่า "Risk Level" ใช้ "Support Level" | ✅ | ทั้งแอปใช้ supportLevel |
| Level 1 Steady: composite ≥ 3.5 | ✅ | |
| Level 2 Gentle: 2.5 ≤ c < 3.5 | ✅ | |
| Level 3 Extra: 1.5 ≤ c < 2.5 **OR** mood≤2 & worry สูง | ⚠️ | **ดู "ข้อควรรู้ scoring" ด้านล่าง** |
| Level 4 Immediate: `support_request = true` | ✅ | override เป็น immediate |
| Override: baby_connection = 1 → escalate | ✅ | `getMoodSupportLevel` |

### ⚠️ ข้อควรรู้ scoring (spec อาจพิมพ์ผิด)
- Spec §4.2 Level 3 OR เขียนว่า `mood ≤ 2 AND adjusted_worry ≥ 4`
- `adjusted_worry ≥ 4` = `6 - raw ≥ 4` = **raw worry ≤ 2** (คือ *กังวลน้อย*) → ไม่สมเหตุผลทางคลินิก
- **โค้ดทำถูกตามเจตนา**: `mood ≤ 2 AND worryScore(raw) ≥ 4` (mood ต่ำ + กังวลสูง) → escalate
- 👉 โค้ดถูก, spec ข้อนี้น่าจะพิมพ์ผิด — ควรแก้ spec ให้ตรงโค้ด

---

## 7. Tiny Goal (Spec Step 5)

| รายการ | สถานะ | หมายเหตุ |
|---|---|---|
| เลือก goal 1 อย่างหลัง result | ✅ | `TinyGoalSection` |
| Skip / defer ได้ | ✅ | `setDailyGoal("", "skipped")` |
| แสดงบน Home | ✅ | `DailyGoal.jsx` |

---

## 8. Care Journey (Spec Step 6 + Care Journey Content section)

| รายการ | สถานะ | หมายเหตุ |
|---|---|---|
| Care Journey card บน Home (ไม่ซ่อนใน tab) | ✅ | `CareTimeline.jsx` แสดง phase + progress + timeline |
| Stage mapping 0–12 เดือน | ✅ | ตรง spec |
| **เนื้อหา 4 ส่วนต่อ stage** (You feel / Your body / Watch out / Self-care) | ❌ | **ยังไม่มี** — spec มี content เต็ม (Day1-3, Week2-3, ...) ที่ "Pending Clinical Advisor approval" ยังไม่ถูกนำเข้าแอป |
| Week 2 / Week 6 checkpoint CTA → emotional check | 🟡 | มี CareTimeline แต่ CTA ตรงจุด checkpoint ยังไม่ได้ผูกกับ EPDS |

---

## 9. EPDS / Emotional Check (Spec Step 7)

| รายการ | สถานะ | หมายเหตุ |
|---|---|---|
| แบบประเมิน EPDS 10 ข้อ, reverse-scored | ✅ | `epds-data.js` (reverse idx 2,4-9) |
| เรียกว่า "Emotional Check" ไม่ใช่ "Depression Test" | ✅ | `t.epds.title = "ตรวจสอบความรู้สึก"` |
| Q10 (self-harm) → immediate | ✅ | `q10Flag` |
| **Trigger ตามจังหวะ** (Week 2/6, Month 3/6/9/12) | ❌ | โค้ดใช้ **cadence 14 วัน** (`isEpdsDue`) ไม่ใช่ stage-based ตาม spec |
| Trigger จาก support_level=extra | ❌ | ยังไม่ผูก |
| Trigger จาก mood≤2 หรือ anxiety≥4 ติด 3 วัน | ❌ | ยังไม่ผูก |

**สรุป EPDS**: เครื่องมือครบ ✅ แต่ **logic การ "เด้งขึ้นมาถามตอนไหน" ยังไม่ตรง spec** (ใช้เวลาแทน stage/risk)

---

## 10. Dashboard Alerts (Spec §4.3) — ฝั่ง Admin Dashboard

| Alert | สถานะ | หมายเหตุ |
|---|---|---|
| A: support_request → แจ้งเตือนทันที | ✅ | sync + AlertPanel |
| B: composite < 2.5 ติด 3 วัน → flag | ✅ | low_composite_trend |
| C: safety_access_used → log flag | ✅ | safety_log |
| ส่ง indicator-level (mood/sleep/energy/worry) | ✅ | sync ทั้ง entry |
| Resolution: staff mark resolved → re-enable | 🟡 | มี case status แต่ควร verify การ re-enable support_request |

---

## 📝 การปรับเปลี่ยนเนื้อหา / คำ (Wording changes จาก spec)

### 🔴 เรื่องใหญ่ที่สุด — สรรพนาม + วรรณยุกต์สุภาพ
Spec (Care Journey doc) ระบุชัด **"สรรพนาม: คุณแม่"** และใช้ particle **คะ/ค่ะ** ทุกประโยค
แต่แอปใช้ **"คุณ"** และ **ตัดคะ/ค่ะ ออกเกือบหมด** → โทนเป็นกลาง/สั้นลง ไม่ใช่โทนโรงพยาบาลอบอุ่นตาม spec

| จุด | Spec | แอปตอนนี้ |
|---|---|---|
| Q1 mood | "วันนี้**คุณแม่**รู้สึกอย่างไรบ้าง**คะ**?" | "วันนี้**คุณ**รู้สึกอย่างไรบ้าง?" |
| Q2 sleep | "เมื่อคืน**คุณแม่**นอนหลับเป็นอย่างไรบ้าง**คะ**? (แม้ทารกจะตื่นมาบ่อยครั้ง)" | "คืนที่แล้ว**คุณ**นอนหลับเป็นอย่างไร?" |
| Q3 energy | "วันนี้**คุณแม่**รู้สึกมีพลังแค่ไหน**คะ**?" | "วันนี้**คุณ**มีพลังงานแค่ไหน?" |
| Q4 worry | "วันนี้**คุณแม่**รู้สึกว่ามีเรื่องให้คิดเยอะแค่ไหน**คะ**?" | "วันนี้มีเรื่องในหัวมากแค่ไหน?" |

### 🟡 Problem tags — ขาด 2 ตัว
Spec มี 15 tags · แอปมี 13 · **ขาด**:
- #12 "Feeling irritable / angry" (หงุดหงิด/โกรธ)
- #13 "Feeling like I'm not doing enough as a mother" (รู้สึกว่าเป็นแม่ได้ไม่ดีพอ)

### 🟡 Baby connection labels — คำต่าง
| ระดับ | Spec | แอป |
|---|---|---|
| 1 | ห่างเหิน | ยาก |
| 2 | ห่างเหินไปนิด | ห่างนิดหน่อย |
| 3 | มีความใกล้ชิดอยู่บ้าง | ปน ๆ กัน |
| 4 | ค่อนข้างใกล้ชิด | โอเคเป็นส่วนใหญ่ |
| 5 | อบอุ่นดี | อบอุ่น |

⚠️ spec §3.7 เตือนพิเศษว่า label ต้อง "ไม่สื่อการตัดสิน" — คำว่า "ยาก" (label 1) อาจสื่อว่าแม่ทำได้ไม่ดี ควรทบทวน

### 🟡 Support Level messages — สั้น/เป็นกลางกว่า spec
เช่น Level 3 Extra
- Spec: "วันนี้ดูเหนื่อยมากเลยนะคะ อยากให้คุณรู้ว่าไม่ได้อยู่คนเดียวค่ะ เราพร้อมอยู่ตรงนี้กับคุณเสมอนะคะ 💛"
- แอป: "ช่วงนี้รู้สึกตึงนิดหน่อย การสนับสนุนพิเศษวันนี้จะช่วยได้"

---

## 🎯 สรุป Gap ที่เหลือ (เรียงตามความสำคัญ)

1. **❌ Care Journey content 4 ส่วนต่อ stage** — ยังไม่มีเลย (รอ Clinical Advisor approve ก่อน implement)
2. **❌ EPDS trigger logic** — ใช้ 14-วัน แทน stage-based (Week 2/6…) + risk triggers ตาม spec
3. **🔴 โทนภาษา** — เปลี่ยน "คุณแม่ + คะ/ค่ะ" → "คุณ" ตัด particle (กระทบทั้งแอป, ต้องตัดสินใจว่าจะยึด spec หรือ direction ปัจจุบัน)
4. **🟡 Problem tags** ขาด 2 (irritable/angry, not doing enough)
5. **🟡 Baby connection label 1** "ยาก" เสี่ยงสื่อการตัดสิน (spec ห้าม)
6. **🟡 hospital_name / Contact Hospital (Call now / Request callback)** — ยังไม่ผูก HIS จริง (spec ระบุว่าต้อง confirm กับ pilot hospital)

**สิ่งที่ทำครบและตรง spec**: Core 4-indicator check-in, scoring, 4-tier support level, follow-up flow, support-need suppression, I Need Help, EPDS เครื่องมือ, dashboard alerts, stage mapping


---

## 🛠️ Changelog

### 2026-07-10 — แก้ #3 #4 #5 (i18n เท่านั้น, ไม่แตะโค้ด JSX)
- **#4 ✅** เพิ่ม Problem tags เป็น 15 ตัว (เพิ่ม "หงุดหงิด/โกรธง่าย" + "รู้สึกว่าเป็นแม่ได้ไม่ดีพอ") ทั้ง th + en, index ตรงกัน, "อย่างอื่น/Something else" ยังเป็นตัวสุดท้าย
- **#5 ✅** Baby connection label[0]: "ยาก"→"ห่างเหิน" (th), "Hard"→"Distant" (en)
- **#3 ✅ (Full warm — อัปเกรดจาก Hybrid)** เขียนทับ th.json ทั้งไฟล์ด้วยเวอร์ชัน Full warm: "คุณแม่ + คะ/ค่ะ" ทุกจุด (home hero, greeting, settings, cards, onboarding ทุก step, EPDS questions+options, safety, nav "ดูแลใจ/คนใกล้ตัว/วิธีดูแลตัวเอง", moodTags) + สำนวนรีไรต์อุ่นขึ้นทั้งชุด
- ลบ `.` ท้าย `supportLevelIs` ใน `CheckInFlow.jsx` บรรทัด 385
- **Verify**: `npm run build` ผ่าน · key parity th↔en สมบูรณ์ (ไม่มี key ขาดทั้ง 2 ทาง) · tags 15/15 · baby[0]="รู้สึกห่างเหิน" · `npm run lint` 0 errors
- **ยังเหลือ**: #1 (Care Journey content), #2 (EPDS stage-based trigger), #6 (hospital HIS) — รอ decision/clinical approval
