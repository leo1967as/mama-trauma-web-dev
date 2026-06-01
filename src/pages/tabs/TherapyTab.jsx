import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarHeart, Clock, Shield, CheckCircle2 } from "lucide-react";
import TherapistCard from "../../components/booking/TherapistCard";
import BookingFlow from "../../components/booking/BookingFlow";
import SafetySection from "../../components/calmmama/SafetySection";

const therapists = [
  {
    name: "Dr. Amara Lee",
    specialty: "Postpartum & Perinatal",
    rating: 4.9,
    reviews: 128,
    nextSlot: "Today, 3:00 PM",
    avatar: "👩🏽⚕️",
    bg: "bg-rose-100",
    tag: "Top Rated",
    tagColor: "text-rose-600 bg-rose-50",
    focuses: ["Baby blues", "Anxiety", "Identity"],
  },
  {
    name: "Dr. Sofia Reyes",
    specialty: "Maternal Mental Health",
    rating: 4.8,
    reviews: 94,
    nextSlot: "Tomorrow, 10:00 AM",
    avatar: "👩🏻⚕️",
    bg: "bg-violet-100",
    tag: "New Moms",
    tagColor: "text-violet-600 bg-violet-50",
    focuses: ["PPD", "Bonding", "Sleep"],
  },
  {
    name: "Dr. Mia Chen",
    specialty: "Anxiety & Mood Support",
    rating: 4.7,
    reviews: 76,
    nextSlot: "Wed, 2:30 PM",
    avatar: "👩🏼⚕️",
    bg: "bg-amber-100",
    tag: "Anxiety",
    tagColor: "text-amber-600 bg-amber-50",
    focuses: ["Panic", "Mood swings", "Trauma"],
  },
  {
    name: "Dr. Priya Nair",
    specialty: "Grief & Life Transitions",
    rating: 4.8,
    reviews: 61,
    nextSlot: "Thu, 11:00 AM",
    avatar: "👩🏾⚕️",
    bg: "bg-teal-100",
    tag: "Transitions",
    tagColor: "text-teal-600 bg-teal-50",
    focuses: ["Loss", "Identity", "Self-worth"],
  },
];

const upcomingSession = {
  therapist: "Dr. Amara Lee",
  avatar: "👩🏽⚕️",
  bg: "bg-rose-100",
  date: "Wednesday, May 8",
  time: "3:00 PM",
  mode: "Video Call",
};

export default function TherapyTab() {
  const [bookingTherapist, setBookingTherapist] = useState(null);
  const [booked, setBooked] = useState(false);

  const handleDone = () => {
    setBookingTherapist(null);
    setBooked(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="space-y-4"
      >
        {/* Header */}
        <div className="pt-2 pb-1">
          <div className="flex items-center gap-2 mb-1">
            <CalendarHeart className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Therapy</h1>
          </div>
          <p className="text-xs text-muted-foreground">Safe, judgment-free support for you</p>
        </div>

        {/* Safety First */}
        <SafetySection />

        {/* Booked Success Banner */}
        <AnimatePresence>
          {booked && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-emerald-50 border border-emerald-200/60 rounded-3xl p-4 flex items-start gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-emerald-700">Session booked successfully!</p>
                <p className="text-xs text-emerald-600/80 mt-0.5">You'll receive a reminder before it starts 💛</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upcoming Session Banner */}
        <div className="bg-gradient-to-br from-primary/12 to-calm-lavender rounded-3xl p-5 border border-primary/15">
          <div className="flex items-center gap-1.5 mb-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
            <span className="text-xs font-bold text-primary uppercase tracking-wider">Upcoming Session</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-12 h-12 ${upcomingSession.bg} rounded-2xl flex items-center justify-center text-2xl`}>
              {upcomingSession.avatar}
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{upcomingSession.therapist}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1">
                  <CalendarHeart className="w-3 h-3" />{upcomingSession.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />{upcomingSession.time}
                </span>
              </div>
            </div>
          </div>
          <button className="w-full bg-primary text-primary-foreground rounded-2xl py-3 text-sm font-bold shadow-md shadow-primary/20">
            Join Session
          </button>
        </div>

        {/* Therapist List */}
        <div>
          <p className="text-sm font-bold text-foreground mb-3">Recommended for you</p>
          <div className="space-y-3">
            {therapists.map((t, i) => (
              <TherapistCard
                key={t.name}
                therapist={t}
                index={i}
                onSelect={setBookingTherapist}
              />
            ))}
          </div>
        </div>

        {/* Privacy Note */}
        <div className="flex items-start gap-3 bg-muted/40 rounded-2xl p-4">
          <Shield className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            All sessions are completely confidential. You deserve care without judgment. 🌸
          </p>
        </div>
      </motion.div>

      {/* Booking Flow Overlay */}
      <AnimatePresence>
        {bookingTherapist && (
          <BookingFlow
            therapist={bookingTherapist}
            onClose={() => setBookingTherapist(null)}
            onDone={handleDone}
          />
        )}
      </AnimatePresence>
    </>
  );
}
