import { HeartHandshake, Brain, Wind, Leaf } from "lucide-react";

const BOOKING_KEY = "afterbloom_therapy_booking";

export const THERAPISTS = [
  {
    id: "amara",
    name: "Amara Lee, perinatal therapist",
    nameTh: "อมรา ลี ผู้เชี่ยวชาญด้านการดูแลแม่หลังคลอด",
    specialty: "Postpartum & Perinatal",
    specialtyTh: "ช่วงหลังคลอดและการแม่",
    nextSlot: "Today, 3:00 PM",
    nextSlotTh: "วันนี้ 15:00 น.",
    tag: "Soonest support",
    tagTh: "ความช่วยเหลือทันทีที่สุด",
    color: "accent",
    icon: HeartHandshake,
    focuses: ["Baby blues", "Anxiety", "Identity"],
    focusesTh: ["ความเศร้าสาหัสหลังคลอด", "ความวิตกกังวล", "ตัวตน"],
    careFit: "Best when the day feels emotionally heavy and you need a steady first conversation.",
    careFitTh: "ช่วยดีที่สุดเมื่อวันนี้รู้สึกเศร้าหรือเครียดมากๆ และคุณแม่ต้องการการสนทนาที่มั่นคงและอบอุ่น",
    availability: "Soonest today",
    availabilityTh: "วันนี้ได้เร็วที่สุด",
  },
  {
    id: "sofia",
    name: "Sofia Reyes, maternal mental health",
    nameTh: "โซเฟีย เรเยส ผู้เชี่ยวชาญสุขภาพจิตแม่",
    specialty: "Maternal Mental Health",
    specialtyTh: "สุขภาพจิตของแม่",
    nextSlot: "Tomorrow, 10:00 AM",
    nextSlotTh: "พรุ่งนี้ 10:00 น.",
    tag: "Mood support",
    tagTh: "ช่วยเรื่องอารมณ์",
    color: "lavender",
    icon: Brain,
    focuses: ["PPD", "Bonding", "Sleep"],
    focusesTh: ["ภาวะซึมเศร้าหลังคลอด", "พันธะแม่-ลูก", "การนอนหลับ"],
    careFit: "Best for mood changes, bonding worries, and making sense of early postpartum feelings.",
    careFitTh: "ช่วยดีที่สุดเมื่อความรู้สึกอารมณ์เปลี่ยนแปลง กังวลเรื่องสัมพันธ์กับลูก หรืออยากเข้าใจความรู้สึกในช่วงแรกหลังคลอด",
    availability: "Tomorrow morning",
    availabilityTh: "เช้าพรุ่งนี้",
  },
  {
    id: "mia",
    name: "Mia Chen, anxiety support",
    nameTh: "เมีย เฉิน ผู้เชี่ยวชาญด้านความวิตกกังวล",
    specialty: "Anxiety & Mood Support",
    specialtyTh: "ความวิตกกังวลและการดูแลจิตใจ",
    nextSlot: "Wed, 2:30 PM",
    nextSlotTh: "วันพุธ 14:30 น.",
    tag: "Anxiety",
    tagTh: "วิตกกังวล",
    color: "amber",
    icon: Wind,
    focuses: ["Panic", "Mood swings", "Trauma"],
    focusesTh: ["ตื่นตระหนก", "อารมณ์ปั่นป่วน", "อาการหลังจากเหตุการณ์เครียด"],
    careFit: "Best when anxiety, panic, or sudden mood shifts are taking up most of the day.",
    careFitTh: "ช่วยดีที่สุดเมื่อความวิตกกังวล ความตื่นตระหนก หรือการเปลี่ยนแปลงอารมณ์ใช้เวลาส่วนใหญ่ของวัน",
    availability: "Midweek afternoon",
    availabilityTh: "บ่ายวันพุธ",
  },
  {
    id: "priya",
    name: "Priya Nair, transition support",
    nameTh: "ปริยา เนียร์ ผู้เชี่ยวชาญด้านการเปลี่ยนแปลงในชีวิต",
    specialty: "Grief & Life Transitions",
    specialtyTh: "การเศร้าโศกและการเปลี่ยนแปลงในชีวิต",
    nextSlot: "Thu, 11:00 AM",
    nextSlotTh: "วันพฤหัสบดี 11:00 น.",
    tag: "Transitions",
    tagTh: "การเปลี่ยนแปลง",
    color: "green",
    icon: Leaf,
    focuses: ["Loss", "Identity", "Self-worth"],
    focusesTh: ["การสูญเสีย", "ตัวตน", "คุณค่าของตนเอง"],
    careFit: "Best for grief, identity shifts, and feeling unlike yourself after birth.",
    careFitTh: "ช่วยดีที่สุดเมื่อคุณแม่รู้สึกเศร้าโศก เปลี่ยนแปลงตัวตน หรือรู้สึกไม่เหมือนตัวเองหลังคลอด",
    availability: "Later this week",
    availabilityTh: "หลังจากนี้ในสัปดาห์",
  },
  {
    id: "lina",
    name: "Lina Morgan, perinatal therapist",
    nameTh: "ลีนา มอร์แกน นักบำบัดช่วงหลังคลอด",
    specialty: "Perinatal Counselling",
    specialtyTh: "การให้คำปรึกษาช่วงหลังคลอด",
    nextSlot: "Fri, 1:00 PM",
    nextSlotTh: "วันศุกร์ 13:00 น.",
    tag: "Perinatal care",
    tagTh: "ดูแลใจหลังคลอด",
    color: "accent",
    icon: HeartHandshake,
    focuses: ["Adjustment", "Confidence", "Rest"],
    focusesTh: ["การปรับตัว", "ความมั่นใจ", "การพักผ่อน"],
    careFit: "A calm space for adjustment, confidence, and rest after birth.",
    careFitTh: "พื้นที่ปลอดภัยสำหรับการปรับตัว ความมั่นใจ และการพักผ่อนหลังคลอด",
    availability: "Friday afternoon",
    availabilityTh: "บ่ายวันศุกร์",
  },
];

// Care Circle keeps provider data local for this MVP; no API or booking backend is used.
THERAPISTS.forEach((provider, index) => Object.assign(provider, {
  provider_id: provider.id,
  profile_photo: null,
  category: "Therapist Support",
  sub_specialty: provider.specialty,
  bio: provider.careFit,
  experience: `${6 + index} years`,
  experienceTh: `ประสบการณ์ ${6 + index} ปี`,
  expertise: provider.focuses,
  expertiseTh: provider.focusesTh,
  hourly_rate: 1400 + index * 100,
  rating: Number((4.7 + (index % 3) * 0.1).toFixed(1)),
  review_count: 24 + index * 13,
}));

const CAREGIVER_THAI = {
  "caregiver-mali": { specialty: "ดูแลทารกแรกเกิด", careFit: "ดูแลทารกอย่างอ่อนโยนและช่วยจัดกิจวัตรช่วงกลางคืน", },
  "caregiver-noor": { specialty: "ดูแลคุณแม่และลูก", careFit: "ช่วยเรื่องการให้นม การนอน และการปลอบลูกอย่างเป็นกันเอง", },
  "caregiver-june": { specialty: "ช่วงสัปดาห์แรก", careFit: "ช่วยดูแลอย่างมั่นคงในช่วงสัปดาห์แรกที่บ้าน", },
  "caregiver-suda": { specialty: "ติดตามหลังคลอด", careFit: "ให้ความรู้หลังคลอดและคำแนะนำการฟื้นตัว", },
  "caregiver-anya": { specialty: "ฟื้นตัวหลังคลอด", careFit: "ดูแลการฟื้นตัวหลังคลอดด้วยข้อมูลที่เชื่อถือได้", },
  "caregiver-nina": { specialty: "ความมั่นใจพ่อแม่มือใหม่", careFit: "ตอบคำถามและช่วยให้พ่อแม่มือใหม่มั่นใจขึ้น", },
  "caregiver-pim": { specialty: "ช่วยเรื่องการให้นม", careFit: "ช่วยวางเป้าหมายการให้นมอย่างอ่อนโยนและทำได้จริง", },
  "caregiver-rose": { specialty: "การเข้าเต้าและปั๊มนม", careFit: "ช่วยเรื่องการเข้าเต้า การปั๊มนม และเพิ่มความมั่นใจ", },
  "caregiver-fern": { specialty: "แผนการให้นม", careFit: "ร่วมวางแผนการให้นมให้เข้ากับชีวิตประจำวัน", },
  "caregiver-mook": { specialty: "นวดฟื้นฟู", careFit: "นวดฟื้นฟูร่างกายหลังคลอดที่อ่อนล้า", },
  "caregiver-ella": { specialty: "ดูแลร่างกายอย่างอ่อนโยน", careFit: "ดูแลร่างกายตามความพร้อมของคุณแม่เพื่อการพักและฟื้นตัว", },
  "caregiver-bua": { specialty: "ผ่อนคลาย", careFit: "ช่วงเวลาสงบเพื่อคลายความตึงเครียดและพักใจ", },
};

const CAREGIVER_THAI_LABELS = {
  Nanny: "พี่เลี้ยงเด็ก",
  Midwife: "ผดุงครรภ์",
  "Lactation Consultant": "ผู้เชี่ยวชาญการให้นม",
  "Postnatal Massage": "นวดหลังคลอด",
  "Available today": "ว่างวันนี้",
  "Available tomorrow": "ว่างพรุ่งนี้",
  "Available this week": "ว่างภายในสัปดาห์นี้",
};

const caregiverSeeds = [
  ["caregiver-mali", "Mali Santos", "มะลิ ซานโตส", "Nanny", "Newborn care", "Gentle newborn care and overnight routines.", "Available today", 650, 4.9, 38, HeartHandshake],
  ["caregiver-noor", "Noor Rahman", "นูร์ ราห์มาน", "Nanny", "Mother and baby care", "Practical support for feeding, naps, and settling.", "Available tomorrow", 600, 4.8, 31, Leaf],
  ["caregiver-june", "June Park", "จูน พาร์ค", "Nanny", "Early weeks", "Steady help for the first weeks at home.", "Available today", 700, 4.7, 22, Wind],
  ["caregiver-suda", "Suda Chai", "สุดา ชัย", "Midwife", "Postpartum checks", "Postpartum education and recovery guidance.", "Available tomorrow", 900, 4.9, 44, Brain],
  ["caregiver-anya", "Anya Patel", "อัญญา พาเทล", "Midwife", "Birth recovery", "Evidence-informed care for recovery after birth.", "Available today", 950, 4.8, 29, HeartHandshake],
  ["caregiver-nina", "Nina Wells", "นีนา เวลส์", "Midwife", "New parent confidence", "Answers and reassurance for new parent questions.", "Available this week", 850, 4.6, 18, Leaf],
  ["caregiver-pim", "Pim Kanya", "พิม กัญญา", "Lactation Consultant", "Feeding support", "Kind, practical support for feeding goals.", "Available today", 800, 4.9, 52, Brain],
  ["caregiver-rose", "Rose Ellis", "โรส เอลลิส", "Lactation Consultant", "Latch and pumping", "Support with latch, pumping, and confidence.", "Available tomorrow", 780, 4.8, 35, Wind],
  ["caregiver-fern", "Fern Taylor", "เฟิร์น เทย์เลอร์", "Lactation Consultant", "Feeding plans", "Collaborative plans that fit your real day.", "Available this week", 820, 4.7, 26, HeartHandshake],
  ["caregiver-mook", "Mook Srisai", "มุก ศรีใส", "Postnatal Massage", "Recovery massage", "Restorative massage for a tired postpartum body.", "Available today", 750, 4.9, 41, Leaf],
  ["caregiver-ella", "Ella Brooks", "เอลล่า บรูคส์", "Postnatal Massage", "Gentle bodywork", "Gentle, mother-led care for recovery and rest.", "Available tomorrow", 720, 4.8, 33, Wind],
  ["caregiver-bua", "Bua Niran", "บัว นิรันดร์", "Postnatal Massage", "Relaxation", "A quiet hour to release tension and reset.", "Available this week", 700, 4.7, 20, HeartHandshake],
];

export const CAREGIVERS = caregiverSeeds.map(([id, name, nameTh, category, sub_specialty, bio, availability, hourly_rate, rating, review_count, icon], index) => {
  const thai = CAREGIVER_THAI[id];
  const categoryTh = CAREGIVER_THAI_LABELS[category];
  const availabilityTh = CAREGIVER_THAI_LABELS[availability];

  return {
  id,
  provider_id: id,
  name,
  nameTh,
  category,
  sub_specialty,
  specialty: sub_specialty,
  specialtyTh: thai.specialty,
  bio,
  careFit: bio,
  careFitTh: thai.careFit,
  experience: `${4 + (index % 6)} years`,
  experienceTh: `ประสบการณ์ ${4 + (index % 6)} ปี`,
  expertise: [sub_specialty, "Postpartum care"],
  expertiseTh: [thai.specialty, "การดูแลหลังคลอด"],
  focuses: [sub_specialty, "Postpartum care"],
  focusesTh: [thai.specialty, "การดูแลหลังคลอด"],
  hourly_rate,
  rating,
  review_count,
  availability,
  availabilityTh,
  profile_photo: null,
  tag: category,
  tagTh: categoryTh,
  color: ["accent", "lavender", "green", "amber"][index % 4],
  icon,
  nextSlot: availability,
  nextSlotTh: availabilityTh,
};
});

export function getBookingState() {
  if (typeof window === "undefined" || !window.localStorage) return null;
  try {
    return JSON.parse(window.localStorage.getItem(BOOKING_KEY) || "null");
  } catch {
    return null;
  }
}

export function saveBookingState(booking) {
  if (typeof window === "undefined" || !window.localStorage) return;
  window.localStorage.setItem(BOOKING_KEY, JSON.stringify(booking));
}

export function clearBookingState() {
  if (typeof window === "undefined" || !window.localStorage) return;
  window.localStorage.removeItem(BOOKING_KEY);
}
