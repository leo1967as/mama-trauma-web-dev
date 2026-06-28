import { HeartHandshake, Brain, Wind, Leaf } from "lucide-react";

const BOOKING_KEY = "afterbloom_therapy_booking";

export const THERAPISTS = [
  {
    id: "amara",
    name: "Amara Lee, perinatal therapist",
    specialty: "Postpartum & Perinatal",
    nextSlot: "Today, 3:00 PM",
    tag: "Soonest support",
    color: "accent",
    icon: HeartHandshake,
    focuses: ["Baby blues", "Anxiety", "Identity"],
    careFit: "Best when the day feels emotionally heavy and you need a steady first conversation.",
    availability: "Soonest today",
  },
  {
    id: "sofia",
    name: "Sofia Reyes, maternal mental health",
    specialty: "Maternal Mental Health",
    nextSlot: "Tomorrow, 10:00 AM",
    tag: "Mood support",
    color: "lavender",
    icon: Brain,
    focuses: ["PPD", "Bonding", "Sleep"],
    careFit: "Best for mood changes, bonding worries, and making sense of early postpartum feelings.",
    availability: "Tomorrow morning",
  },
  {
    id: "mia",
    name: "Mia Chen, anxiety support",
    specialty: "Anxiety & Mood Support",
    nextSlot: "Wed, 2:30 PM",
    tag: "Anxiety",
    color: "amber",
    icon: Wind,
    focuses: ["Panic", "Mood swings", "Trauma"],
    careFit: "Best when anxiety, panic, or sudden mood shifts are taking up most of the day.",
    availability: "Midweek afternoon",
  },
  {
    id: "priya",
    name: "Priya Nair, transition support",
    specialty: "Grief & Life Transitions",
    nextSlot: "Thu, 11:00 AM",
    tag: "Transitions",
    color: "green",
    icon: Leaf,
    focuses: ["Loss", "Identity", "Self-worth"],
    careFit: "Best for grief, identity shifts, and feeling unlike yourself after birth.",
    availability: "Later this week",
  },
];

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
