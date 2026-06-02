# Moji — แผนพัฒนา

**อัปเดต**: 2 มิถุนายน 2569  
**เป้าหมาย**: แอปโทรศัพท์ iOS + Android สำหรับ postpartum care

---

## เส้นทางหลัก

```
ตอนนี้          1-2 เดือน         3-6 เดือน
────────────────────────────────────────────
React Web  →  Capacitor MVP  →  Expo rewrite
             (App Store)       (ถ้า scale จริง)
                  ↓
             Supabase (Auth + DB)
             Push notification
             Onboarding
```

**ทำไมถึงเลือก Capacitor ก่อน**  
ห่อ React/Vite ที่มีอยู่ให้เป็น native app ได้เลย ไม่ต้องเขียน UI ใหม่ setup ~1-2 วัน ได้ทั้ง App Store และ Play Store

---

## สถานะปัจจุบัน

| Tab | สถานะ | หมายเหตุ |
|-----|--------|---------|
| Home | ✅ เสร็จ | Prototype-exact, CheckInFlow 4 steps |
| Mood | ✅ เสร็จ | Full analytics, recent history |
| CheckInFlow | ✅ เสร็จ | Face → Feelings → Sleep → Extras → Done |
| Legacy | 🟡 มีเนื้อหา | Theme เก่า ยังไม่ match |
| Therapy | 🟡 มีเนื้อหา | Disabled ใน nav |
| CarePlans | 🟡 มีเนื้อหา | Disabled ใน nav |
| Circle | 🟡 มีเนื้อหา | Disabled ใน nav |

---

## Phase 1 — Theme Consistency
> เร็ว, impact สูง — ไม่ต้องออกแบบใหม่

- [ ] Legacy tab — dawn header + sheet pattern เหมือน Home
- [ ] Enable + restyle Therapy tab
- [ ] Enable + restyle Circle tab
- [ ] Enable + restyle CarePlans tab

---

## Phase 2 — Data & Real Logic
> สำคัญที่สุดก่อน ship

- [ ] **Care Timeline dynamic** — คำนวณ day/week จากวันคลอดจริง (ตอนนี้ hardcode Day 7)
- [ ] **CarePlans ← mood data** — generate plan จาก risk level จริง ไม่ใช่ mock context
- [ ] **Daily Goal rotation** — เปลี่ยน goal ทุกวัน ไม่ใช่ "Rest 10 minutes" ตลอด
- [ ] **Journal save/load** — เขียนและอ่าน entry ได้จริง (ตอนนี้ไม่ได้ save)

---

## Phase 3 — Backend & Auth
> ต้องทำก่อน ship จริง — localStorage หายเมื่อ clear app

- [ ] **Supabase** — แทน localStorage, sync ข้าม device
- [ ] **Auth** — AuthContext มีอยู่แล้ว ต้อง wire กับ Supabase
- [ ] **Onboarding** — กรอกวันคลอด + ชื่อ → ระบบ calculate day/week
- [ ] **Push notification** — daily check-in reminder (PWA manifest มีแล้ว)

---

## Phase 4 — Mobile (Capacitor)

- [ ] `npm install @capacitor/core @capacitor/cli`
- [ ] `npx cap init` + configure `capacitor.config.ts`
- [ ] `npm run build` → `npx cap add ios` + `npx cap add android`
- [ ] Native plugins: push notification, haptics, status bar
- [ ] App Store + Play Store submission

---

## สิ่งที่ต้องทำก่อน Ship ไม่ว่าจะ phase ไหน

1. **Backend + Auth** — data ต้องอยู่รอดเมื่อ reinstall
2. **วันคลอดจริง** — Care timeline ต้อง dynamic
3. **Push notification** — daily check-in คือ core retention loop
4. **Onboarding** — ผู้ใช้ใหม่ต้องได้ context ก่อนเห็น home
