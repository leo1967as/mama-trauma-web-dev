**Afterbloom**

**Daily Check-in Feature Specification**

Version 1.0  |  Developer Brief  |  Postpartum Depression Monitoring App

 

**Flow input**  
   
**Step 0: Welcome Screen**  
**จุดประสงค์:** บอกแม่ว่าแอพนี้ไม่ใช่แอพวินิจฉัยโรค แต่เป็นเพื่อนช่วยติดตามหลังคลอด  
**Screen copy**  
**Welcome to AfterBloom**  
 A gentle space to check in with yourself after birth.  
**Button:**  
 Start my care journey  
หน้านี้ยังไม่ต้องเก็บ input

---

**Step 1: Basic Setup Input**  
อันนี้คือกรอกครั้งแรกเท่านั้น เพื่อให้ระบบรู้ว่าแม่อยู่ stage ไหน  
**1.1 Mother name / nickname**  
**คำถาม:**  
 อยากให้ AfterBloom เรียกคุณว่าอะไร?  
**Input type:** text field  
 **Example:** Sia / Moji / แม่เมย์  
**Developer field:**  
 mother\_name  
   
**เอาไปใช้:**  
 แสดง greeting บน Home เช่น  
 “Good morning, Sia”  
   
**จำเป็น\*\***

---

**1.2 Baby’s birth date**  
**คำถาม:**  
 ลูกเกิดวันที่เท่าไหร่?  
**Input type:** date picker  
**Developer field:**  
 baby\_birth\_date  
**เอาไปใช้:**  
 ระบบคำนวณเองว่าแม่อยู่ Day / Week / Month ไหน เช่น  
Today \- baby\_birth\_date \= postpartum\_day  
 postpartum\_day 14 \= Week 2  
 postpartum\_day 42 \= Week 6  
 postpartum\_day 90 \= Month 3  
**สำคัญมาก:**  
 อันนี้คือ input ที่สำคัญที่สุดใน onboarding เพราะมันทำให้ Home แสดง stage badge และ Care Journey ได้  
**ห้ามตัด**

---

**1.3 First-time mother?**  
**คำถาม:**  
 นี่เป็นลูกคนแรกของคุณไหม?  
**Choices:**

* ใช่ ลูกคนแรก  
* ไม่ใช่  
* ไม่อยากตอบ

**Developer field:**  
 is\_first\_time\_mother  
**เอาไปใช้:**  
 ปรับ tone ของคำแนะนำ เช่น แม่ลูกคนแรกอาจต้องการ guidance ที่อธิบายละเอียดกว่า  
**จำเป็นไหม:**  
 ควรมี แต่ถ้า prototype ด่วนมาก ตัดได้

---

**No use now**  
**1.4 Delivery hospital**  
**คำถาม:**  
 คุณคลอดที่โรงพยาบาลไหน?  
**Input type:** dropdown / text field  
**Developer field:\\**  
 hospital\_name  
**เอาไปใช้:**  
 ทำให้ model B2B ดูชัดขึ้น เช่น Home อาจขึ้นว่า  
 “Connected with KKU Hospital Care Journey”  
**จำเป็นไหม:**  
 ถ้า pitch เน้น hospital integration ควรมี

No use end

---

**1.5 Preferred check-in time**  
**คำถาม:**  
 อยากให้เราเตือน check-in เวลาไหน?  
**Choices:**

* Morning  
* Afternoon  
* Evening  
* Before bed  
* I’ll check in by myself

**Developer field:**  
 preferred\_checkin\_time  
**เอาไปใช้:**  
 notification setting / reminder mockup  
**สำคัญ:**  
 ใน research ที่โมจิใส่ไว้ แม่อยากควบคุมเวลาแจ้งเตือนเอง ไม่ใช่ให้แอพบังคับเวลา

---

**No use now 1.6 Privacy preference**  
**คำถาม:**  
 ถ้าวันไหนคุณต้องการ support เพิ่ม อยากให้ใครเห็นข้อมูลนี้ไหม?  
**Choices:**

* ยังไม่แชร์กับใคร  
* แชร์กับคนในครอบครัวที่ฉันเลือก  
* แชร์กับ care team เท่านั้น  
* ค่อยตั้งค่าทีหลัง

**Developer field:**  
 sharing\_preference  
**เอาไปใช้:**  
 Invite Your Circle / hospital dashboard phase 2  
**สำหรับ prototype:**  
 ทำเป็นหน้า mock ได้ ยังไม่ต้องทำระบบแชร์จริง

No use end

---

**สรุป Onboarding Input ที่ต้องมีจริง**  
   
1.mother\_name  
 2.baby\_birth\_date  
 3.First-time mother?  
 4.preferred\_checkin\_time  
   
ถ้าเวลาน้อยมาก ๆ เหลือแค่ 2:  
baby\_birth\_date  
 preferred\_checkin\_time

---

**Step 2: Home Screen Output**  
หน้า Home ไม่ควรเป็นหน้ากรอกข้อมูลเยอะ  
 Home คือหน้าที่ “ดึง input มาแสดง”  
**Home ควรขึ้นหลัง onboarding แบบนี้**  
   
**\*\*\*สีเหลืองคือข้อความ**  
 **\*\*\*สีเขียวคือปุ่ม**  
   
Good morning, Sia  
 You are in Week 2 after birth

 How are you feeling today?  
 \[Start 30-sec check-in\]

 Today’s care journey:  
 Week 2 is a sensitive emotional adjustment period.

 Your support level:  
 Not checked in yet today

 Tiny goal:  
 Take one deep breath before feeding

 \[ I Need Help \]  
   
**Home ใช้ข้อมูลจาก input ไหน**

| Home element | มาจาก input |
| :---- | :---- |
| Greeting | mother\_name |
| Stage badge | baby\_birth\_date |
| Check-in CTA | daily check-in status |
| Care Journey | postpartum stage |
| Support Level | daily check-in answers |
| Mood Trend | check-in history |
| I Need Help | always visible |

ในไฟล์ของโมจิเองก็วางไว้ว่า Home ควรมี Contextual greeting, Check-in CTA, Care Journey, Support Level, Help button, Tiny Goal และ Mood Trend โดยทุก element มีเหตุผลรองรับ ไม่ใช่เลือกตาม preference เฉย ๆ

#  

# **Section 3: Daily Check-in Input Specification**

The daily check-in is the core touchpoint of the Afterbloom app. It collects 4 validated clinical indicators every day, with conditional follow-up questions triggered by low scores. All questions use closed-ended 1–5 scales to minimize cognitive load for postpartum mothers.

 

*Design principle: One question per screen. Tap to answer. Target completion time under 60 seconds for the core 4 indicators.*

 

## **Phase 1: Core Daily Check-in (Always Asked)**

The following 4 indicators are asked every day, in this order. All use a 1–5 scale where 1 \= worst, 5 \= best, EXCEPT anxiety\_score which is reversed (1 \= not at all, 5 \= overwhelmed).

 

 

**ตัวเลือก (แต่ละช่องมี 2 บรรทัด: emoji+label เป็นหัว แล้วตามด้วยประโยคบรรยายตัวเล็กข้างใต้):**

**3.1  Mood**

| Question | How are you feeling today? |
| :---- | :---- |
| **UI format** | Emoji scale / card buttons — one per screen |
| **Developer field** | mood\_score |
| **Data type** | number  1–5  (1 \= worst, 5 \= best) |

 

**Choices:**

| 1 | 😢  Very low "Everything feels overwhelming."  |
| :---: | :---- |
| **2** | 🙁  Low "I feel a bit down and not very cheerful."  |
| **3** | 😐  Neutral "I'm doing okay and managing things."  |
| **4** | 🙂  Good "I'm feeling happy today."  |
| **5** | 😊  Very good "I feel light, calm, and at ease."  |

*⚑  Research basis: EPDS item 1 (able to laugh / see funny side) \+ PHQ-9 item 1 (depressed mood). EMA pilot PMC 2022 (n=26): self-reported mood has predictive validity against EPDS follow-up score.*

 

**Thai Ver**

| Question | วันนี้คุณแม่รู้สึกอย่างไรบ้างคะ? |
| :---- | :---- |
| **UI format** | Emoji scale / card buttons — one per screen |
| **Developer field** | mood\_score |
| **Data type** | number  1–5  (1 \= worst, 5 \= best) |

 

**Choices:**

| 1 | 😢 แย่มาก *“เหมือนทุกอย่างหนักไปหมด”* |
| :---: | :---- |
| **2** | 🙁 **แย่** *“รู้สึกหน่วงๆ ไม่ค่อยสดใส”* |
| **3** | 😐 **เฉยๆ** *“ก็เรื่อย ๆ ยังรับมือไหว”* |
| **4** | 🙂  **ดี** *“รู้สึกมีความสุขดี”* |
| **5** | 😊 **ดีมาก** *“รู้สึกเบาใจและสบายดี”* |

 

**3.2  Sleep**

| Question | How did you sleep last night? (even if you woke up often) |
| :---- | :---- |
| **UI format** | Card buttons — one per screen |
| **Developer field** | sleep\_score |
| **Data type** | number  1–5  (1 \= worst, 5 \= best) |

 

**Choices:**

| 1 | 😵Barely slept *"Feels like I didn't get any real rest. "* |
| :---: | :---- |
| **2** | 😪 **Very little sleep** *"I was awake on and off almost all night."*  |
| **3** | 😐 **Some sleep** *"I got some sleep, but woke up often."*  |
| **4** | 🙂 **Enough sleep** *"I got enough sleep to feel somewhat rested."*  |
| **5** | 😊 **Slept well** *"I slept soundly and woke up feeling refreshed."*  |

*⚑  Note: The phrase 'even if you woke up often' is intentional — postpartum mothers wake frequently for feeding. Framing removes guilt about broken sleep and improves response accuracy.*

*⚑  Research basis: EPDS item 7 (difficulty sleeping). Okun et al. 2018 (SLEEP): sleep disturbance is a prodromal symptom appearing weeks before full PPD onset. EMA pilot PMC 2022: sleep quality has predictive validity against EPDS score.*

 

**Thai Ver**

 

 

| Question | เมื่อคืนคุณแม่นอนหลับเป็นอย่างไรบ้างคะ?   (แม้ทารกจะตื่นมาบ่อยครั้ง) |
| :---- | :---- |
| **UI format** | Card buttons — one per screen |
| **Developer field** | sleep\_score |
| **Data type** | number  1–5  (1 \= worst, 5 \= best) |

 

**Choices:**

| 1 | 😵 แทบไม่ได้หลับเลย  *“รู้สึกเหมือนไม่ได้พักเลย”* |
| :---: | :---- |
| **2** | 😪 **น้อยมาก** *“หลับ ๆ ตื่น ๆ แทบทั้งคืน”* |
| **3** | 😐 **พอได้นอนบ้าง** *“หลับได้บ้าง แต่ตื่นบ่อย”* |
| **4** | 🙂**เพียงพอ** *“ได้นอนพอให้หายเหนื่อยบ้าง”* |
| **5** | 😊 **หลับสนิท** *“หลับได้เต็มอิ่ม รู้สึกสดชื่น”* |

 

**3.3  Energy**

| Question | How much energy do you have today? |
| :---- | :---- |
| **UI format** | Card buttons — one per screen |
| **Developer field** | energy\_score |
| **Data type** | number  1–5  (1 \= worst, 5 \= best) |

 

**Choices:**

| 1 | 😵 Exhausted *"I feel completely drained and worn out."*  |
| :---: | :---- |
| **2** | 😔 **Tired** *"I'm feeling tired and low on energy."*  |
| **3** | 😐 **Managing** *"I have enough energy to get through what I need to do."*  |
| **4** | 🙂 **Okay** *"I can go about my day as usual."*  |
| **5** | 😊 **Energetic** *"I feel full of energy and ready for the day."* |

*⚑  Research basis: DSM-5 criterion — fatigue or loss of energy as core MDD symptom. PubMed 2012 brief scales: 'slowed down' / psychomotor retardation is a top predictor of major depressive episode postpartum. Russell 1980 circumplex model: activation is the second axis after valence.*

**Thai Ver**

 

**3.3  Energy**

| Question | วันนี้คุณแม่รู้สึกมีพลังแค่ไหนคะ? |
| :---- | :---- |
| **UI format** | Card buttons — one per screen |
| **Developer field** | energy\_score |
| **Data type** | number  1–5  (1 \= worst, 5 \= best) |

 

**Choices:**

| 1 | 😵 หมดพลัง *“พลังงานหมดเกลี้ยง อ่อนเปลี้ยเพลียแรง”* |
| :---: | :---- |
| **2** | 😔 **เหนื่อยล้า** *“เหนื่อย ๆ ร่างกายไม่ค่อยมีแรง”* |
| **3** | 😐 **พอไหว** *“ยังพอทำสิ่งที่ต้องทำไหว”* |
| **4** | 🙂 **โอเค** *“ทำสิ่งต่าง ๆ  ได้ตามปกติ”* |
| **5** | 😊 **กระปรี้กระเปร่า** *“พลังงานเต็มเปี่ยม พร้อมทำกิจกรรม”* |

 

**3.4  Worry**

| Question | How much is on your mind today? |
| :---- | :---- |
| **UI format** | Card buttons — one per screen |
| **Developer field** | worry\_score |
| **Data type** | number  1–5  (REVERSED: 1 \= not at all, 5 \= overwhelmed) |

 

**Choices:**

| 1 | 😊 Clear-minded *"My mind feels clear and at ease."*  |
| :---: | :---- |
| **2** | 🙂 **A Little on My Mind** *"I have a few things on my mind, but I'm managing well."*  |
| **3** | 😐 **Somewhat Busy** *"My thoughts keep circling, but I can still manage."*  |
| **4** | 🙁 **A Lot on My Mind** *"My mind feels crowded with too many thoughts."*  |
| **5** | 😣 **Overwhelmed** *"My thoughts feel overwhelming, and I don't know where to begin."*  |

*⚑  IMPORTANT for developer: worry\_score is REVERSED. A score of 5 \= overwhelmed \= worst state. When computing composite score, invert this field: adjusted\_worry \= 6 \- worry\_score. Do not store the inverted value — store raw input, invert during scoring.*

*⚑  Research basis: Goodman 2009 (JOGNN): \~50% of mothers with PPD have comorbid anxiety disorder. EMA pilot 2022: anxiety has predictive validity against EPDS. Cognitive worry / rumination is the dominant anxiety presentation in PPD, not physiological panic.*

 

**Thai Ver**

**3.4  Worry**

| Question | วันนี้คุณแม่รู้สึกว่ามีเรื่องให้คิดเยอะแค่ไหนคะ? |
| :---- | :---- |
| **UI format** | Card buttons — one per screen |
| **Developer field** | worry\_score |
| **Data type** | number  1–5  (REVERSED: 1 \= not at all, 5 \= overwhelmed) |

 

**Choices:**

| 1 | 😊 ไม่เลย *“หัวโล่ง ไม่มีเรื่องให้คิดมาก”* |
| :---: | :---- |
| **2** | 🙂 **นิดหน่อย** *“มีเรื่องให้คิดบ้าง แต่ยังไม่มาก”* |
| **3** | 😐 **ปานกลาง** *“มีเรื่องวนในหัว แต่ยังรับมือไหว”* |
| **4** | 🙁 **เยอะมาก** *“คิดวนหลายเรื่อง จนหัวเริ่มแน่น”* |
| **5** | 😣 **ท่วมท้น** *“คิดเต็มหัว จนไม่รู้จะเริ่มตรงไหน”* |

 

## **Phase 2: Conditional Follow-up (Triggered When Output Is Not Good)**

These questions appear only when the composite score from Phase 1 falls below threshold. They do not appear on every check-in.

 

| Trigger condition | composite\_score \< 2.5  OR  any single core indicator score \= 1 |
| :---- | :---- |
| **Phase 2 flow order** | 3.5 Problem Tag  →  3.6 Optional Journal  →  3.7 Baby Connection |

 

**3.5  Problem Tag**

| Question | What feels hardest today? วันนี้มีเรื่องไหนที่ทำให้คุณแม่รู้สึกหนักใจที่สุดคะ  |
| :---- | :---- |
| **UI format** | Multi-select tag chips |
| **Developer field** | problem\_tags |
| **Data type** | array of enum strings  |  maximum 2 selections |
| **Additional field** | problem\_other\_text  |  text / nullable  |  max 150 characters |
| **Required** | problem\_other\_text required only if 'Something else' is selected |

 

**Choices (select up to 3):**

| 1 | Fatigue and exhaustion  |
| :---: | :---- |
| **2** | Sleep deprivation / Not getting enough sleep  |
| **3** |  |
| **4** |  |
| **5** |  |
| **6** |  |
| **7** |  |
| **8** |  |
| **9** |  |
| **10** |  |
| **11** |  |
| **12** |  |
| **13** |  |
| **14** |  |
| **15** |  |
| **16** |  |
| **17** |  |
| **18** |  |
| **19** |  |
| **20** |  |
| **21** |  |
| **22** |  |
| **23** |  |

***⚑  If 'Something else' is selected: show short text field. Placeholder: 'Tell us what feels hardest today.'***

 

| 1 | ความเหนื่อยล้าหมดแรง |
| :---: | :---- |
| **2** | การอดนอน / นอนไม่พอ |
| **3** | ความกังวลภาพลักษณ์ร่างกายหลังคลอด |
| **4** | ความเจ็บปวดทางร่างกาย  |
| **5** | การฟื้นตัวหลังคลอด  |
| **6** |  ลูกร้องไห้  |
| **7** | การให้นม   |
| **8** | ความกังวลเกี่ยวกับสุขภาพของลูก  |
| **9** | ความรู้สึกโดดเดี่ยว  |
| **10** | ความรู้สึกท่วมท้น รับมือไม่ไหว  |
| **11** | ความรู้สึกหงุดหงิดหรือโมโห  |
| **12** | รู้สึกว่าตัวเองทำหน้าที่แม่ได้ไม่ดีพอ  |
| **13** |  การปรับตัวต่อบทบาทการเป็นแม่  |
| **14** | ความเศร้าหรือความสูญเสียที่ยังไม่ได้รับการจัดการ  |
| **15** | ความสัมพันธ์กับคู่ชีวิต  |
| **16** |  การสนับสนุนจากคู่ชีวิต |
| **17** | ความเครียดจากครอบครัว |
| **18** | ความเป็นส่วนตัวและพื้นที่ส่วนตัว  |
| **19** | ภาระงานบ้าน  |
| **20** | ความกังวลด้านการเงิน  |
| **21** | ความเครียดจากการกลับไปทำงาน  |
| **22** | ไม่แน่ใจ |
| **23** | อื่น ๆ |

***⚑ ถ้าเลือก "อื่น ๆ": แสดงช่องกรอกข้อความสั้น ๆ พร้อมข้อความตัวอย่าง (placeholder): "บอกเราหน่อยว่าวันนี้อะไรที่รู้สึกยากที่สุด"*** 

**3.6  Optional Journal**

| Question | Would you like to write a little more about today? วันนี้อยากเล่าอะไรเพิ่มเติมไหมคะ? |
| :---- | :---- |
| **Description shown** | This is optional. You can leave it blank. |
| **Input type** | Text area |
| **Placeholder** | Write anything you want to remember, release, or explain about today. |
| **Developer field** | journal\_entry |
| **Data type** | text / nullable |
| **Character limit** | 500 characters |
| **Required** | No — must never block check-in flow. Mother can skip anytime. |

 

**3.7  Baby Connection**

| Question | How did moments with your baby feel today?วันนี้ช่วงเวลาที่ได้อยู่กับลูก ทำให้คุณแม่รู้สึกอย่างไรบ้างคะ? |
| :---- | :---- |
| **UI format** | Card buttons — one per screen |
| **Developer field** | baby\_connection\_score |
| **Data type** | number  1–5  (1 \= worst, 5 \= best) |

 

**Choices:**

| 1 | Feel very distant  |
| :---: | :---- |
| **2** | Feel somewhat distant  |
| **3** | Feel close at times  |
| **4** | Feel fairly close  |
| **5** | Feel very bonded and warm  |

*⚑  Important: Framing must not imply judgment. 'A little distant' should not feel like a failure label. Avoid words like 'disconnected' or 'bad mother'. The goal is honest reporting, not guilt.*

*⚑  Research basis: Postpartum Bonding Questionnaire (Brockington 2001). EPDS bonding construct. Poor bonding is associated with downstream child developmental risk (Murray 1992, Br J Psychiatry).*

 

| 1 |  รู้สึกห่างเหินมาก  |
| :---: | :---- |
| **2** |  รู้สึกค่อนข้างห่างเหิน |
| **3** |  รู้สึกใกล้ชิดเป็นบางครั้ง |
| **4** |  รู้สึกค่อนข้างใกล้ชิด  |
| **5** |  รู้สึกผูกพันและอบอุ่นมาก |

## **Phase 3: Support Need (Triggered by Pattern, Not Every Check-in)**

This question is shown only when a specific pattern is detected. It is NOT part of the daily conditional flow. It must not appear more than once per unresolved episode.

 

**3.9  Support Need**

| Question | Do you need our hospital team to reach out to you today? วันนี้คุณแม่ต้องการให้ทีมจากโรงพยาบาลติดต่อกลับหรือไม่คะ? |
| :---- | :---- |
| **UI format** | Two large tap buttons |
| **Developer field** | support\_request |
| **Data type** | boolean  |  true \= Yes please  |  false \= Not right now |

 

**Choices:**

| 1 | Yes, please  |
| :---: | :---- |
| **2** | Not right now |

 

| 1 | ต้องการให้ติดต่อกลับ  |
| :---: | :---- |
| **2** | **ยังไม่ใช่ตอนนี้** |

 

**Trigger logic:**

| Trigger A | composite\_score \< 2.5 for 3 consecutive days |
| :---- | :---- |
| **Trigger B** | mood\_score \= 1 AND worry\_score \= 5 on the same day  (single day crash) |
| **After 'Yes, please'** | support\_request \= true is sent to hospital dashboard. Question disappears until hospital marks episode as resolved. |
| **After 'Not right now'** | Wait 3 days. Re-trigger if scores remain low. |

*⚑  Rationale: Asking this question every day a mother feels low causes habituation (automatic 'no' responses) and increases burden. Triggering on pattern ensures the question is timely and meaningful. EMA pilot 2022 supports 3-day trend as a clinically significant threshold.*

 

## **Always Accessible: I Need Help Button**

The I Need Help button is always visible on the home screen and does not require a check-in to access. This replaces a daily Safety Check question in the check-in flow.

 

| Location | Home screen — persistent button, always visible |
| :---- | :---- |
| **Purpose** | Safety check  |  crisis access  |  EPDS item 10 equivalent |
| **Action on tap** | Route to: emergency contact  /  hospital contact  /  'I am with someone safe' |
| **Developer field** | safety\_access\_used |
| **Data type** | boolean / timestamp  |  log each use |

*⚑  Clinical basis: ACOG 2023 mandatory safety screening. npj Digital Medicine 2023: crisis access must be 1-tap, must not require completion of other steps. EPDS item 10 (thoughts of self-harm) is the only item requiring immediate action regardless of total score.*

*⚑  Rationale for not asking daily: Daily safety questions cause sensitization — mothers begin answering automatically without genuine reflection, reducing clinical validity (Shiffman et al. 2008).*

 

 

# 

# **Section 4: Check-in Result Output**

After completing the daily check-in, the app displays a result screen immediately. The result communicates the mother's Support Level for the day.

 

Language requirement: Do NOT use the term 'Risk Level'. Use 'Today's Support Level'. Diagnostic labels and clinical risk language increase stigma and reduce engagement. This is supported by the app's own survey data (n=320, 72% feared judgment).

 

## **4.1  Scoring Logic**

| mood\_score | Raw score  1–5  (1 \= worst) |
| :---- | :---- |
| **sleep\_score** | Raw score  1–5  (1 \= worst) |
| **energy\_score** | Raw score  1–5  (1 \= worst) |
| **worry\_score (inverted)** | adjusted\_worry \= 6 \- worry\_score  (so 1 \= best, 5 \= worst) |
| **composite\_score** | (moodx2\_score \+ sleep\_score \+ energy\_score \+ adjusted\_worry) / 5 |
| **composite range** | 1.0 \= all worst  |  5.0 \= all best |
| **Override rule** | If support\_request was triggered and baby\_connection\_score \= 1: escalate to Level 3 regardless of composite |

 

## **4.2  Support Level Definitions**

 

| Level 1  Steady |  |
| :---- | :---- |
| **Trigger condition** | composite\_score \>= 3.5 |
| **Message to mother** | ***You're doing a wonderful job taking care of both yourself and your baby today. ✨** We're proud of the care and dedication you've shown. Take things one step at a time, and move at a pace that feels right for you.*  |
| **CTA buttons** | →  View My Care Journey  →  See my tiny goal for today  |
| **Research basis** | Positive reinforcement increases sustained engagement (JMIR Human Factors, MBapp 2024). Steady days should feel rewarding, not neutral. |

 

**Thai ver**

| Level 1  Steady |  |
| :---- | :---- |
| **Trigger condition** | composite\_score \>= 3.5 |
| **Message to mother** | **วันนี้คุณแม่ดูแลตัวเองและลูกน้อยได้ดีมากเลยค่ะ ✨** ขอชื่นชมในความตั้งใจของคุณแม่นะคะ ค่อยๆ เดินไปในจังหวะที่เหมาะกับคุณแม่ได้เลยค่ะ |
| **CTA buttons** | →  ดูเป้าหมายเล็กๆ วันนี้ →  ดูเส้นทางดูแลของฉัน |
| **Research basis** | Positive reinforcement increases sustained engagement (JMIR Human Factors, MBapp 2024). Steady days should feel rewarding, not neutral. |

| Level 2  Gentle Support |  |
| :---- | :---- |
| **Trigger condition** | composite\_score \>= 2.5 AND \< 3.5 |
| **Message to mother** | ***It seems like you may be carrying a lot right now. 🤍**  Whenever you can, please remember to take a moment to rest and be kind to yourself. Every little bit of self-care matters.* |
| **CTA buttons** | →  Try a 5-minute breathing exercise  →  See my tiny goal for today  →  View My Care Journey   |
| **Research basis** | Behavioral activation (CBT micro-actions) for mild symptoms has evidence in MBapp 2024\. Small achievable actions reduce learned helplessness. |

 **Thai ver**

| Level 2  Gentle Support |  |
| :---- | :---- |
| **Trigger condition** | composite\_score \>= 2.5 AND \< 3.5 |
| **Message to mother** | **ดูเหมือนว่าคุณแม่อาจกำลังมีหลายเรื่องให้คิดหรือรับมืออยู่บ้างนะคะ 🤍** หากมีโอกาส อย่าลืมหาเวลาพักผ่อนและดูแลตัวเองบ้างนะคะ |
| **CTA buttons** | → ลองฝึกหายใจเข้า–ออกช้า ๆ และลึก ๆ ประมาณ 5–10 รอบ → เลือกเป้าหมายเล็ก ๆ ที่ทำได้วันนี้ ลองพักสายตาสัก 10 นาที หากิจกรรมที่คุณแม่ชอบทำเพื่อผ่อนคลาย  → ดูเส้นทางดูแลของฉัน  |
| **Research basis** | Behavioral activation (CBT micro-actions) for mild symptoms has evidence in MBapp 2024\. Small achievable actions reduce learned helplessness. |

| Level 3  Extra Support Recommended |  |
| :---- | :---- |
| **Trigger condition** | composite\_score \>= 1.5 AND \< 2.5  |  OR  |  mood\_score \<= 2 AND adjusted\_worry \>= 4 |
| **Message to mother** | ***Today seems to be especially challenging. 💗** Please remember, you're not alone. We're here to support you every step of the way.*  |
| **CTA buttons** | →  Complete the EPDS screening →  Contact your hospital team →  Talk to someone you trust →  View My Care Journey   |
| **Research basis** | EMA pilot 2022: 3-day low trend has predictive validity for EPDS high score. Level 3 triggers EPDS screening prompt. |

 **Thai ver**

| Level 3  Extra Support Recommended |  |
| :---- | :---- |
| **Trigger condition** | composite\_score \>= 1.5 AND \< 2.5  |  OR  |  mood\_score \<= 2 AND adjusted\_worry \>= 4 |
| **Message to mother** | **วันนี้ดูเหนื่อยมากเลยนะคะ อยากให้คุณรู้ว่าไม่ได้อยู่คนเดียวค่ะ** เราพร้อมอยู่ตรงนี้กับคุณเสมอนะคะ 💗  |
| **CTA buttons** | →  ทำแบบประเมินสุขภาพจิตหลังคลอด (EPDS) →  พูดคุยกับคนที่คุณไว้ใจ →  ติดต่อทีมพยาบาลหรือบุคลากรสุขภาw →  ดูเส้นทางดูแลของฉัน |
| **Research basis** | EMA pilot 2022: 3-day low trend has predictive validity for EPDS high score. Level 3 triggers EPDS screening prompt. |

**Tag Classification สำหรับ Backend Logic**

Tags แบ่งเป็น 3 กลุ่มตาม clinical weight ค่ะ

**Safety-Critical Tags (กลุ่ม 1\)**  
 Tags เหล่านี้ถ้าถูกเลือกร่วมกับ composite\_score \< 1.5 **ให้ escalate เป็น Level 4 ทันทีค่ะ**

```
- ความรู้สึกท่วมท้น รับมือไม่ไหว
- รู้สึกว่าตัวเองทำหน้าที่แม่ได้ไม่ดีพอ
- ความรู้สึกโดดเดี่ยว
- ความเศร้าหรือความสูญเสียที่ยังไม่ได้รับการจัดการ
```

**High-Risk Tags (กลุ่ม 2\)**  
 Tags เหล่านี้ให้ส่งข้อมูลไป hospital dashboard เพื่อให้พยาบาล flag และ follow up **แต่ไม่ trigger Level 4 ทันที**

| \- ความรู้สึกหงุดหงิดหรือโมโห \- ความสัมพันธ์กับคู่ชีวิต \- การสนับสนุนจากคู่ชีวิต \- ความกังวลด้านการเงิน \- การปรับตัวต่อบทบาทการเป็นแม่ |
| :---- |

**Monitoring Tags (กลุ่ม 3\)**

Tags เหล่านี้เก็บเป็น data สำหรับ trend analysis ใน dashboard  **ไม่ trigger อะไรทันที**

| \- ความเหนื่อยล้าหมดแรง \- การอดนอน / นอนไม่พอ \- ความเจ็บปวดทางร่างกาย \- การฟื้นตัวหลังคลอด \- ความกังวลภาพลักษณ์ร่างกายหลังคลอด \- ลูกร้องไห้ \- การให้นม \- ความกังวลเกี่ยวกับสุขภาพของลูก \- ความเครียดจากครอบครัว \- ความเป็นส่วนตัวและพื้นที่ส่วนตัว \- ภาระงานบ้าน \- ความเครียดจากการกลับไปทำงาน \- ไม่แน่ใจ \- อื่น ๆ   |
| :---- |

| Level 4  Immediate Support |  |
| :---- | :---- |
| **Trigger condition** | A. User-Triggered    → Mother taps "I want to be contacted"       on the Support Need screen (3.9) B. Safety-Triggered    B1: baby\_connection\_score \= 1        AND composite\_score \< 2.5        → Escalate to Level 4    B2: Mother selects at least 1 Safety-Critical Tag        AND composite\_score \< 1.5        → Escalate to Level 4    B3: EPDS Item 10 score ≥ 1        → Escalate to Level 4 immediately           (regardless of composite score) |
| **Message to mother** | ***You don't have to face this by yourself. 💗** Caring support is here whenever you're ready to reach out.*  |
| **CTA buttons** | →  Contact hospital team →  Call emergency line →  I'm with someone safe |
| **Research basis** | Triggered by mother's explicit request for help. Hospital dashboard receives alert. ACOG 2023: hospital follow-up is mandatory when support need is flagged. |

  **Thai ver**

| Level 4  Immediate Support |  |
| :---- | :---- |
| **Trigger condition** | A. User-triggered    → แม่กดปุ่ม "ต้องการให้ติดต่อกลับ" ใน Support Need (3.9) B. Safety-triggered    B1: baby\_connection\_score \= 1         AND composite\_score \< 2.5        → escalate Level 4    B2: เลือก Safety-Critical Tag อย่างน้อย 1 ตัว        AND composite\_score \< 1.5        → escalate Level 4    B3: EPDS Item 10 score ≥ 1        → escalate Level 4 ทันที        (ไม่ต้องรอ composite score) |
| **Message to mother** | **ตอนนี้คุณไม่จำเป็นต้องรับมือกับสิ่งนี้เพียงลำพังนะคะ 💗** มีคนพร้อมช่วยคุณอยู่เสมอค่ะ  |
| **CTA buttons** | → ติดต่อทีมพยาบาล →  โทรสายด่วนฉุกเฉิน →  ฉันอยู่กับคนที่ไว้ใจแล้ว |
| **Research basis** | Triggered by mother's explicit request for help. Hospital dashboard receives alert. ACOG 2023: hospital follow-up is mandatory when support need is flagged. |

## **4.3  Hospital Dashboard Alerts**

| Alert A | support\_request \= true  →  immediate notification to hospital staff dashboard |
| :---- | :---- |
| **Alert B** | composite\_score \< 2.5 for 3 consecutive days  →  flag on hospital dashboard (no immediate notification required) |
| **Alert C** | safety\_access\_used \= true  →  log and flag on hospital dashboard |
| **Resolution** | Hospital staff marks episode as resolved in dashboard. support\_request question re-enables after resolution. |

 

*⚑  Integration note: Hospital dashboard integration is required for Alert A to function. Confirm HIS integration scope and data format with pilot hospital before development.*

 

 

 

No use 

**4.1 Addendum — Scoring Logic (Edge Cases)**

**Partial check-in:** If the mother exits before completing all 4 core indicators, composite\_score is not calculated for that day. Previously entered responses are saved and remain visible when the mother reopens the app. The check-in session remains resumable until 11:59 PM of the same day.

**Score weighting:** All four core indicators carry equal weight (25% each). Formula: composite\_score \= (mood\_score \+ sleep\_score \+ energy\_score \+ adjusted\_worry) / 4\. Weighting will be reviewed and calibrated during the pilot phase based on clinical outcomes data.

No use End

---

**4.3 Addendum — Hospital Dashboard Data**

When support\_request \= true or composite\_score \< 2.5 for 3 consecutive days, the hospital dashboard receives: mother ID, alert type, composite\_score, and all four individual scores (mood, sleep, energy, worry). Rationale: clinical staff require indicator-level context to conduct a meaningful follow-up call. Sending a flag only increases time-to-support.

Data transmitted follows minimum necessary principle per PDPA Thailand requirements.

---

**4.4 Contact Hospital — Available Options (Level 3 & Level 4\)**

When the mother taps "Contact your hospital team", two options are presented:

Option 1 — Call now: Displays the hospital's direct phone number. Tapping dials immediately. App logs the action as hospital\_contact\_initiated.

Option 2 — Request callback: App sends a notification to the hospital dashboard indicating the mother has requested contact. Hospital staff follow up by phone. App displays confirmation: "Your hospital team has been notified and will reach out to you soon."

Note: Option 2 requires hospital dashboard integration to function. Confirm availability with pilot hospital before development. Option 1 is available as a fallback regardless of integration status.

 

*Document prepared for Afterbloom developer brief  |  Concept validation stage  |  June 2026*

*Key references: DSM-5, EPDS (Cox et al. 1987), EMA Pilot PMC 2022, Okun et al. 2018 (SLEEP), Goodman 2009 (JOGNN), ACOG 2023, npj Digital Medicine 2023, MBapp 2024 (JMIR Human Factors), PubMed 2012 brief scales, Russell 1980 circumplex model, Brockington 2001 (PBQ)*

 

 

 

**Need Update**

**Step 5: Tiny Goal Input / Output**  
หลัง result ให้แม่เลือก goal ได้ 1 อย่าง ไม่ต้องเยอะ  
**คำถาม**  
วันนี้อยากลองทำสิ่งเล็ก ๆ อะไรหนึ่งอย่าง?  
**Choices:**

* ดื่มน้ำหนึ่งแก้ว  
* ส่งข้อความหาคนที่ไว้ใจ  
* หลับตาหายใจลึก 30 วินาที  
* วางมือบนอกแล้วบอกตัวเองว่า “ฉันกำลังพยายามอยู่”  
* ข้ามวันนี้ก่อน

**Developer field:**  
 selected\_tiny\_goal  
**Data type:** enum/string  
**สำคัญ:**  
 ต้องมี “ข้ามวันนี้ก่อน” เพราะแม่บางวันไม่ไหวจริง ๆ และในไฟล์โมจิก็มี research support เรื่อง defer/snooze option ว่าช่วยเรื่อง acceptability

---

**Step 6: Care Journey Input**  
Care Journey จริง ๆ ไม่ต้องให้แม่กรอกเพิ่มเยอะ  
 มันควรใช้ baby\_birth\_date เพื่อ generate stage อัตโนมัติ  
**Stage mapping**  
Day 0–3 \= First Days  
 Day 4–13 \= Early Adjustment  
 Day 14–21 \= Week 2 Checkpoint  
 Day 22–42 \= First 6 Weeks  
 Month 2–3 \= Settling Phase  
 Month 4–6 \= Returning Rhythm  
 Month 7–9 \= Late Emotional Check  
 Month 10–12 \= First Year Reflection  
**Care Journey card บน Home**  
ถ้าแม่อยู่ Week 2:  
Week 2 Checkpoint  
 Many mothers feel emotionally sensitive during this period.  
 If sadness, numbness, or anxiety continues, a short emotional check can help you understand what support you may need.  
**CTA:**  
 Start Week 2 emotional check  
ในไฟล์โมจิ support ว่า Care Journey ไม่ควรถูกซ่อนใน tab เพราะแม่ต้องการ emotional change info บน Home และช่วง Week 2 / Week 6 เป็นช่วงสำคัญของ PPD

---

**Step 7: EPDS-based Screening Input**  
อันนี้ไม่ใช่ daily input  
 ให้ขึ้นเฉพาะบางจังหวะ เช่น Week 2 / Week 6 / Month 3 / Month 6 / Month 9 / Month 12  
**Trigger**  
EPDS-based screening ควรขึ้นเมื่อ:  
postpartum\_stage \= Week 2  
 or postpartum\_stage \= Week 6  
 or support\_level \= Extra Support Recommended  
 or safety\_status \= some  
 or mood\_score \<= 2 for 3 days  
 or anxiety\_score \>= 4 for 3 days  
**Wording หน้าแรก**  
ไม่ใช้คำว่า:  
Depression Test  
ใช้ว่า:  
Emotional Check  
 คำถามสั้น ๆ เพื่อดูว่าช่วงนี้คุณต้องการ support แบบไหน  
**Input type**  
ใช้คำถามแบบ EPDS-based แต่ใน prototype ไม่ต้องใส่ครบทุก clinical scoring ก็ได้ ถ้ากลัวผิด ให้ทำเป็น mock flow ก่อน  
**Developer field:**  
epds\_answers\[\]  
 epds\_total\_score  
 screening\_date  
 screening\_trigger  
**Output:**  
screening\_result\_level  
 recommended\_next\_step

---

**Step 8: Help Input / Emergency Flow**  
ปุ่ม **I Need Help** ต้องอยู่ทุกหน้า ไม่ใช่แค่หน้า result  
**เมื่อกด I Need Help**  
ให้ถามแค่ 1 ข้อ:  
**ตอนนี้คุณต้องการความช่วยเหลือแบบไหน?**  
**Choices:**

* อยากคุยกับคนที่ไว้ใจ  
* อยากติดต่อโรงพยาบาล  
* อยากอ่านวิธีรับมือเบื้องต้น  
* รู้สึกไม่ปลอดภัยกับตัวเอง

**ถ้าเลือก “รู้สึกไม่ปลอดภัยกับตัวเอง”**  
ไปหน้า urgent support ทันที  
You deserve immediate support.  
 Please contact emergency help or stay with someone you trust now.  
**Prototype ยังไม่ต้องโทรจริง** แต่ควรมีปุ่ม mock:

* Call emergency support  
* Contact hospital  
* Message trusted person

ในไฟล์โมจิระบุว่า Help access ต้อง visible ทุก state เพราะ distress ไม่ได้เกิดเฉพาะเวลาทำการ และแม่อาจใช้แอพตอนกลางคืน/ตี 4

 

