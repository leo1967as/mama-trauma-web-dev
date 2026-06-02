# Handoff: MAMA — Mother App (Home redesign + Daily Mood Check-in)

> ส่งงานดีไซน์สำหรับนำไปสร้างต่อในโค้ดจริง (React + Vite + Tailwind + shadcn/ui)
> เอกสารนี้เขียนให้ AI/นักพัฒนาที่ **ไม่ได้อยู่ในห้องสนทนา** อ่านแล้วลงมือทำได้เลย

---

## 1. Overview

MAMA เป็นเว็บแอปดูแลคุณแม่หลังคลอด (postpartum care) มี 2 ฝั่งคือ **ฝั่งคุณแม่** และ **ฝั่งโรงพยาบาล** เอกสารชุดนี้ครอบคลุม **ฝั่งคุณแม่ (mobile-first)** เท่านั้น ประกอบด้วย:

1. **Home redesign** — หน้าแรกที่ปรับให้อบอุ่น โปร่ง อ่านง่ายขึ้น (3 ทิศทางให้เลือก/ผสม)
2. **Daily Mood Check-in** — หัวใจของแอป: หน้าที่คุณแม่กรอกว่าวันนี้รู้สึกอย่างไร (5 รูปแบบการกรอก + คลังคำถาม)

**เป้าหมายดีไซน์:** โทน *warm / soft / comforting* — ไม่ให้รู้สึกเหมือนรายงานแพทย์หรือคลินิก ลดความหนาแน่น เพิ่มคอนทราสต์เพื่อให้คุณแม่ที่อ่อนเพลีย/พักผ่อนน้อยใช้งานง่าย

---

## 2. About the Design Files

ไฟล์ในชุดนี้เป็น **design reference ที่สร้างด้วย HTML/CSS/JS ล้วน** — เป็น prototype แสดง "หน้าตาและพฤติกรรมที่ต้องการ" **ไม่ใช่โค้ด production ที่ก๊อปไปใช้ตรง ๆ**

งานคือ **สร้างดีไซน์เหล่านี้ขึ้นใหม่ในโค้ดเบสจริง** (React + Vite + Tailwind + shadcn/ui) โดยใช้ pattern/ไลบรารีที่โปรเจกต์มีอยู่แล้ว เช่น:
- แปลงเป็น React component + Tailwind classes (ไม่ใช่ใช้ CSS variables ดิบในไฟล์)
- ใช้ component ของ shadcn/ui ที่มีอยู่ (Button, Card, Slider, Toggle, Progress ฯลฯ) แทนการเขียนใหม่
- ดึงค่าสี/ฟอนต์/spacing ไปไว้ใน `tailwind.config` (ดู §6 Design Tokens)

| ไฟล์ | เนื้อหา |
|---|---|
| `MAMA Redesign.html` | วิเคราะห์ของเดิม + design system + Home 3 ทิศทาง + ฟีเจอร์ที่เสนอเพิ่ม |
| `MAMA Mood Check-in.html` | คลังคำถาม + 5 รูปแบบการกรอก mood (กดเล่นได้จริง) |

> เปิดไฟล์ในเบราว์เซอร์เพื่อดูภาพและทดลองกดได้ ตัว interaction (แตะหน้ายิ้ม/ลากสไลเดอร์/เลือกคำ) เขียนด้วย vanilla JS ไว้สาธิตเท่านั้น — ตอนสร้างจริงให้ใช้ state ของ React

---

## 3. Fidelity

**High-fidelity (hifi).** สี ฟอนต์ spacing และ interaction เป็นค่าจริงที่ตั้งใจให้ใช้ ให้สร้าง UI ให้ตรงตามนี้ (pixel-accurate) โดยใช้ไลบรารี/pattern ของโค้ดเบส คอนเทนต์/copy ในไฟล์เป็นภาษาอังกฤษตามที่ตั้งใจให้แสดงผลจริงบน UI (คำอธิบายภาษาไทยในไฟล์เป็น annotation สำหรับทีม ไม่ต้องแสดงผล)

---

## 4. Screens / Views

### 4.1 Home (เลือก 1 ทิศทาง หรือผสมกัน)

มี 3 ทิศทาง เรียงจาก "ใกล้ของเดิม" → "ตีความใหม่":

#### Option 1 — Soft Refine *(ปลอดภัยสุด, แนะนำเป็นค่าตั้งต้น)*
- **Purpose:** คงโครงเดิมทุกอย่าง แต่โปร่งขึ้น คอนทราสต์ชัดขึ้น
- **Layout (บนลงล่าง):**
  1. App bar — eyebrow `Jun 1 · Good morning` (11px, uppercase, สี ink-faint) + greeting `Hey, Mama ♥` (25px/800, หัวใจสี rose) + ปุ่มกระดิ่งวงกลม 38px ขวาบน
  2. **Care Journey card** — หัวข้อ + segmented control `Day / Week / Month` + timeline แนวนอน 5 จุด (วงกลม 44px: done = rose-tint, active = rose ทึบ + ring rose-tint, future = cream มีเส้น) + progress bar 6px + ลิงก์ `View full journey →`
  3. **Primary CTA card** — พื้นไล่ rose-tint, badge `Primary action`, หัวข้อ `Complete today's check-in`, ปุ่มลูกศรวงกลม 46px มุมขวาล่าง → **ลิงก์ไปหน้า Mood check-in**
  4. **Gentle note card** — พื้น amber-tint, ไอคอนสามเหลี่ยม, ข้อความให้กำลังใจ + sparkline แท่งเล็ก ๆ (สรุปการนอน)
  5. **Support card** — ปุ่มเต็มกว้าง `Talk to a professional` + subtext
  6. **Tiny goal row** — checkbox + `Today's tiny goal: Rest for 10 quiet minutes`
- **หลักการ:** การ์ดส่วนใหญ่เป็นเส้นบาง (border 1px line) ไม่ใช่เงาหนัก เพื่อลดความ "แข่งกันเอง" มีแค่ CTA หลักที่เด่นด้วยสีพื้น

#### Option 2 — Calm Focus
- **Purpose:** เน้นสิ่งเดียว — เช็คอินอารมณ์เป็นพระเอกใหญ่ ที่เหลือยุบเป็นแถวเรียบ เว้นที่ว่างเยอะ
- **Layout:**
  1. App bar — greeting แบบ serif `Good morning, Mama` (Newsreader 27px, "Mama" italic สี rose-deep) + ปุ่ม settings
  2. **Hero check-in card** — คำถาม serif `How are you feeling today?` + แถวหน้ายิ้ม 4 ระดับ (Rough/Low/Okay/Good) เลือกอันที่ active เป็น rose-tint
  3. **Duo tiles** — 2 การ์ดเล็ก: `Your journey · Day 7` (accent rose) + `Sleep 7.1h avg`
  4. **Quiet rows** — แถวเรียบ ๆ: `A small win for today` (ไอคอน sage) + `Need to talk?` (ไอคอน rose) แต่ละแถวมีลูกศร `>`

#### Option 3 — Editorial Warmth
- **Purpose:** อารมณ์ไดอารี — เฮดเดอร์ไล่สีอุ่นเต็มจอ พาดหัว serif ให้กำลังใจ
- **Layout:**
  1. **Header (ไล่สี rose)** — สูง ~140px พื้น `radial-gradient` โทนชมพูอุ่น + blob โปร่งแสง 2 ก้อน, eyebrow `Day 7 · Jun 1`, พาดหัว serif `You're finding your rhythm, Mama.` (rhythm italic), สีตัวอักษรขาว
  2. **Feed (ทับขึ้นมาบนเฮดเดอร์ -52px):**
     - `Today's check-in` lead card + ปุ่ม `Start check-in →` (rose)
     - section label `A word for today` → affirmation card (พื้น sage-tint, ข้อความ serif italic)
     - section label `One small thing` → goal card (checkbox + task)
- **หมายเหตุ:** เฮดเดอร์ไล่สีเป็นจุดที่เสี่ยง "AI slop" ถ้าใช้พร่ำเพรื่อ — ที่นี่จงใจใช้เป็น signature ของทิศทางนี้เท่านั้น

### 4.2 Daily Mood Check-in — 5 รูปแบบการกรอก

ทุกแบบใช้ shell เดียวกัน:
- **Top bar:** ปุ่มปิด `✕` (วงกลม 34px) + label กลาง (`Daily check-in` / `3 of 5`) + ปุ่ม `Skip` (สี rose-deep)
- **Progress bar:** 5px ไล่สี rose
- **Question header:** eyebrow (uppercase) + คำถาม (Newsreader serif ~25px) + subtitle
- **Footer (sticky):** ปุ่มหลักเต็มกว้าง `Continue` / `Next question` (rose, มีลูกศร) + ลิงก์ความปลอดภัย `Feeling unsafe? Get help now` (อยู่ทุกหน้าเสมอ)

| Option | รูปแบบ | เหมาะกับ | กลไก |
|---|---|---|---|
| **A** | **Face scale** | ทำทุกวัน (เร็วสุด) | แตะ 1 ใน 5 หน้ายิ้ม (Rough/Low/Okay/Good/Light) → หน้าที่เลือกขยาย 1.12x + มีเงา, ข้อความใต้แถวอัปเดตตามที่เลือก |
| **B** | **Mood slider** | วันก้ำกึ่ง | ลาก range 0–100 ราง gradient (น้ำเงิน→ชมพู→เหลือง→เขียว) thumb วงกลมขาวขอบ rose 34px → คำ + คำอธิบายอัปเดตตามช่วงค่า |
| **C** | **Feeling words** | ความรู้สึกหลายชั้น | chips เลือกได้หลายอัน — คำบวก (light, ติ๊กเป็น sage) / คำลบ (heavy, ติ๊กเป็น rose) + ตัวนับ `n selected` |
| **D** | **Inner weather** | โทนปลอบโยนสุด | เลือก 1 ใน 5 การ์ดสภาพอากาศ (Sunny / Partly cloudy / Overcast / Rainy / Stormy) อันสุดท้ายเต็มกว้าง |
| **E** | **Guided / chat** | คำถามละเอียดอ่อน | บับเบิลแชตจาก MAMA ถามทีละข้อ + ตัวเลือกคำตอบเป็นปุ่มเต็มกว้าง (single-select) |

**แนะนำ flow จริง:** ใช้ **A เป็นข้อแรกทุกวัน** (แรงต้านต่ำสุด) แล้วหมุนคำถามเสริม **C/E** ตามวัน → จบหน้า thank-you/สรุปสั้น ๆ

---

## 5. Question Bank (คลังคำถาม)

หมุนวันละ 2–3 ข้อ ไม่ถามหมดทุกวัน · ให้จบใน 1 นาที · ข้ามได้เสมอ · ภาษาบน UI = อังกฤษ

> ⚠️ คำถามชุดนี้ได้แรงบันดาลใจจากแนวทางคัดกรองแม่หลังคลอด (เช่น EPDS) แต่ **เขียนใหม่ให้โทนอบอุ่น ไม่ใช่เครื่องมือวินิจฉัยทางการแพทย์** หากจะใช้คัดกรองจริงควรให้บุคลากรการแพทย์ของ รพ. รีวิว/อนุมัติก่อน

### Mood · อารมณ์ (ถามทุกวัน)
- `How does today feel?` → Rough · Low · Okay · Good · Light
- `Which words fit you right now?` → multi-select feeling tags
- `Were you able to enjoy small things today?` → Not really → Yes, a few

### Sleep & Rest · การพักผ่อน (สลับวัน)
- `How did you sleep last night?` → Hardly · Broken · Okay · Well
- `Did you get a moment just for you today?` → Yes / No

### Body · ร่างกาย
- `How is your body feeling today?` → Painful · Sore · Healing · Comfortable
- `Any new symptom you want to note?` → optional free text

### Bond · ความผูกพัน (เบา ไม่กดดัน)
- `How connected did you feel with your baby today?` → scale 1–5, no judgement
- `Feeding felt…` → Stressful → Calm

### Mind & Worry · จิตใจ
- `How much worry are you carrying today?` → None → A lot
- `Have you felt overwhelmed or close to tears?` → Rarely → Most of the time

### Support & Safety · ความปลอดภัย (สำคัญ — จัดการนุ่มนวล)
- `Did you feel supported by someone today?` → Yes / Not really
- `Have things felt too heavy to cope with?` → ถ้าตอบเชิงลบ → **พาเข้าหน้า Support ทันที ไม่ตัดสิน** และแสดงช่องทางขอความช่วยเหลือ

---

## 6. Design Tokens

แนะนำให้ map เข้า `tailwind.config.js` (theme.extend.colors / fontFamily / borderRadius / boxShadow)

### Colors
| Token | Hex | ใช้กับ |
|---|---|---|
| `page` | `#E8E4DE` | พื้นหลังนอกสุด (เอกสารรีวิว) |
| `cream` | `#FBF6F0` | พื้นหน้าจอแอป / surface อ่อน |
| `surface` | `#FFFFFF` | การ์ด |
| `surface-2` | `#FFFCF8` | surface รอง |
| `ink` | `#41372F` | ตัวอักษรหลัก |
| `ink-soft` | `#6C5F56` | ตัวอักษรรอง |
| `ink-faint` | `#9C8E83` | label/hint |
| `line` | `#EDE4DA` | เส้นขอบอ่อน |
| `line-2` | `#E4D9CD` | เส้นขอบเข้มขึ้น |
| `rose` | `#C77E83` | **primary** (ปุ่ม/active) |
| `rose-deep` | `#B0666D` | rose เข้ม (ตัวอักษร/hover) |
| `rose-tint` | `#F6E3E2` | fill อ่อน |
| `rose-tint-2` | `#FBEEED` | fill อ่อนสุด |
| `sage` | `#88A78F` | accent สงบ (calm/positive) |
| `sage-deep` | `#5E8169` | sage เข้ม |
| `sage-tint` | `#E5EEE6` | fill |
| `amber` | `#C79A52` | accent อ่อนโยน (notes) |
| `amber-tint` | `#F6EBD4` | fill |
| `blue` | `#8AA0BE` | accent การนอน |
| `blue-tint` | `#E6EBF2` | fill |

**Rose ramp (สำหรับ progress/gradient):** `#FBEEED → #F6E3E2 → #E9BFC0 → #D9989C → #C77E83 → #B0666D`

### Typography
- **Display/Serif:** `Newsreader` (Google Fonts) — น้ำหนัก 400/500, ใช้ตัวเอียงเป็นจุดเด่น (เช่น *Mama*, *rhythm*) สำหรับ greeting, คำถาม, affirmation
- **UI/Sans:** `Plus Jakarta Sans` (Google Fonts) — 400/500/600/700/800 สำหรับ body, ปุ่ม, label
- **Thai (ถ้าต้องรองรับไทย):** `Noto Sans Thai`
- **Scale (มือถือ):** greeting 25px/800 · serif greeting 27px · คำถาม serif 25px · title 15–18px/700 · body 12.5–14px · eyebrow/label 11px/800 uppercase letter-spacing .12–.14em
- **กฎ:** ตัวอักษรเล็กสุดบน UI ไม่ควรต่ำกว่า ~11px สำหรับ label และ ~13px สำหรับเนื้อหาที่ต้องอ่าน

### Spacing / Radius / Shadow
- **Radius:** card `20px` (`--r-md`) · large/hero `26–28px` · small `14px` · pill/button `30px` · วงกลมไอคอน 50%
- **Shadow:**
  - `card`: `0 2px 10px rgba(86,62,48,.05)`
  - `soft`: `0 6px 22px rgba(86,62,48,.07)`
  - `pop`: `0 12px 34px rgba(86,62,48,.13)`
  - ปุ่ม rose: `0 8px 18px rgba(176,102,109,.28)`
- **Hit target:** ปุ่ม/ช่องแตะขั้นต่ำ ~44px (face blob 46px, weather card สูง ~76px, ปุ่มหลัก 15px padding)
- **Phone canvas อ้างอิง:** หน้าจอกว้าง ~308px ภายใน (มือถือมาตรฐาน), padding ข้างเนื้อหา 18–20px

---

## 7. Interactions & Behavior

- **Home → Check-in:** กด CTA หลัก / `Start check-in` → เปิด flow check-in
- **Face scale (A):** single-select; เลือกแล้วขยาย scale(1.12) + เงา, ข้อความสรุปใต้แถวอัปเดต
- **Slider (B):** `input` event → map ค่า 0–100 เป็น 5 ช่วง (Rough<18 / Low<40 / Okay<64 / Good<84 / Light) เปลี่ยนคำ + สี + คำอธิบาย
- **Chips (C):** multi-select toggle; แยกสีบวก/ลบ; แสดงตัวนับ
- **Weather (D):** single-select การ์ด
- **Guided (E):** single-select ต่อข้อ; กด `Next question` ไปข้อถัดไป + progress เพิ่ม
- **Safety link:** `Feeling unsafe? Get help now` ต้องอยู่ทุกหน้า check-in และนำไปหน้า Support/สายด่วนทันที
- **Transitions:** ใช้ทรานสิชันนุ่ม ~0.15–0.2s บน selection states; หลีกเลี่ยงอนิเมชันวนไม่จบ
- **Reduced motion:** เคารพ `prefers-reduced-motion`

---

## 8. State Management (แนะนำ)

ตัวแปร state ที่น่าจะต้องมีสำหรับ check-in:
- `currentQuestionIndex` / `totalQuestions` — คุม progress + top bar
- `answers` — object เก็บคำตอบแต่ละคำถาม (เช่น `{ mood: 'okay', moodLevel: 55, feelings: ['tired','anxious'], weather: 'partly-cloudy', worry: 'some' }`)
- `todaysQuestionSet` — ชุดคำถามที่หมุนมาวันนี้ (logic เลือก 2–3 ข้อจาก question bank)
- `isComplete` — แสดงหน้า thank-you/สรุป
- **Persistence:** บันทึกคำตอบรายวัน (วันที่เป็น key) เพื่อโชว์ใน Journey/Weekly recap; ถ้ามีฝั่ง รพ. ให้คำนึงถึงการ sync/แชร์ตามที่ผู้ใช้ยินยอม
- **Branching:** ถ้าคำตอบด้านความปลอดภัย/ความกังวลอยู่ระดับสูง → trigger เส้นทางไปหน้า Support

---

## 9. Assets

- **ไอคอน:** เป็น inline SVG ทั้งหมด (stroke-based, stroke-width ~1.8). ตอนสร้างจริงแนะนำใช้ไลบรารีไอคอนที่โปรเจกต์ใช้อยู่ (เช่น `lucide-react`) แทน — ชื่อที่ใกล้เคียง: home, smile, activity/wave, message-circle, user, bell, settings, heart, moon, sun, cloud, cloud-rain, alert-triangle, phone, chevron-right, arrow-right, x, check
- **หน้ายิ้ม (Face scale):** วาดเป็น SVG เอง (วงกลมพื้นสีตามอารมณ์ + ตา + ปาก) — สามารถทำเป็น component เล็ก ๆ ที่รับ prop `mood`
- **ไม่มีไฟล์ภาพ/โลโก้ภายนอก** — ทุกอย่างเป็น CSS/SVG; ฟอนต์โหลดจาก Google Fonts
- **ไม่มี mascot** (ตามที่ตกลง: เน้นเรียบ)

---

## 10. Files

| ไฟล์ | ใช้อ้างอิงสำหรับ |
|---|---|
| `MAMA Redesign.html` | Home 3 ทิศทาง, design system panel (สี/ฟอนต์/component), ฟีเจอร์ที่เสนอเพิ่ม (check-in 1 หน้า, weekly recap, night mode, hospital bridge) |
| `MAMA Mood Check-in.html` | คลังคำถาม + 5 รูปแบบการกรอก mood (เปิดในเบราว์เซอร์เพื่อกดทดลอง interaction) |

---

## 11. คำสั่งสำหรับ AI (วางใน Claude Code / Cursor ได้เลย)

```
ฉันมีแอป MAMA (React + Vite + Tailwind + shadcn/ui) สำหรับดูแลคุณแม่หลังคลอด
ในโฟลเดอร์ design_handoff_mama_mother_app มีไฟล์ HTML ที่เป็น design reference
และ README.md ที่มีสเปคครบ (สี ฟอนต์ spacing คำถาม พฤติกรรม)

งาน:
1. อ่าน README.md ทั้งหมดก่อน
2. เพิ่ม design tokens ใน §6 เข้า tailwind.config (colors/fonts/radius/shadow)
   และโหลดฟอนต์ Newsreader + Plus Jakarta Sans
3. สร้างหน้า Home ตาม Option 1 (Soft Refine) เป็น React component
   โดยใช้ shadcn/ui component ที่มีอยู่ ให้ตรงสเปคใน §4.1
4. สร้าง flow Daily Mood Check-in โดยเริ่มจากรูปแบบ A (Face scale) เป็นข้อแรก
   แล้ววางโครงให้รองรับการหมุนคำถามจาก question bank ใน §5
   ตาม state model ใน §8
5. ใส่ลิงก์ "Feeling unsafe? Get help now" ในทุกหน้า check-in
อย่าก๊อป HTML มาตรง ๆ — ให้สร้างใหม่ด้วย pattern ของโปรเจกต์
ถามฉันถ้ามีจุดที่ต้องตัดสินใจเรื่อง routing หรือ data
```

---

*จัดทำจากเซสชันออกแบบ MAMA — ฝั่งคุณแม่ (mobile-first) · โทน warm / soft / comforting*
