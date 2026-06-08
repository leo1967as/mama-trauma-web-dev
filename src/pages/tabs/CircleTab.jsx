import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, UserPlus, Heart, CheckCircle2, Send } from "lucide-react";

const supporters = [
  {
    name: "David",
    role: "Partner",
    emoji: "👨",
    bg: "bg-blue-100",
    task: "Night feeding shift",
    taskDone: false,
    lastActive: "Online",
    activeColor: "bg-emerald-400",
  },
  {
    name: "Mom",
    role: "Family",
    emoji: "👩",
    bg: "bg-rose-100",
    task: "Grocery run this week",
    taskDone: true,
    lastActive: "2h ago",
    activeColor: "bg-muted-foreground",
  },
  {
    name: "Sarah",
    role: "Trusted person",
    emoji: "👩🦰",
    bg: "bg-amber-100",
    task: "Just check in with me",
    taskDone: false,
    lastActive: "1h ago",
    activeColor: "bg-amber-400",
  },
];

const taskSuggestions = [
  "Pick up groceries",
  "Take baby for a walk",
  "Cook one meal",
  "Just text me",
  "Watch the baby for 1 hour",
];

export default function CircleTab() {
  const [tasks, setTasks] = useState(supporters.map((s) => s.taskDone));
  const [showInvite, setShowInvite] = useState(false);

  const toggleTask = (i) => {
    setTasks((prev) => prev.map((t, idx) => (idx === i ? !t : t)));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="pt-2 pb-1">
        <div className="flex items-center gap-2 mb-1">
          <Users className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Support Circle</h1>
        </div>
        <p className="text-xs text-muted-foreground">You don't have to do this alone</p>
      </div>

      {/* Stats Banner */}
      <div className="bg-gradient-to-br from-calm-lavender to-calm-rose rounded-3xl p-5 border border-border/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/50 rounded-2xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{supporters.length} people in your corner</p>
            <p className="text-xs text-muted-foreground">{tasks.filter(Boolean).length} tasks done this week</p>
          </div>
        </div>
      </div>

      {/* Supporters List */}
      <div className="bg-card rounded-3xl p-5 border border-border/40 shadow-sm">
        <p className="text-sm font-semibold text-foreground mb-3">Your people</p>
        <div className="space-y-3">
          {supporters.map((person, i) => (
            <motion.div
              key={person.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3 bg-muted/30 rounded-2xl p-3.5"
            >
              <div className="relative">
                <div className={`w-12 h-12 ${person.bg} rounded-2xl flex items-center justify-center text-2xl`}>
                  {person.emoji}
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${person.activeColor} rounded-full border-2 border-card`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-sm font-semibold text-foreground">{person.name}</span>
                  <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-md font-medium">
                    {person.role}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleTask(i)}
                    className={`w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0 transition-all ${
                      tasks[i] ? "bg-primary" : "border-2 border-border/60"
                    }`}
                  >
                    {tasks[i] && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </button>
                  <p className={`text-xs transition-all ${tasks[i] ? "text-muted-foreground line-through" : "text-muted-foreground"}`}>
                    {person.task}
                  </p>
                </div>
              </div>
              <button className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                <Send className="w-3.5 h-3.5 text-primary" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Task Suggestions */}
      <div className="bg-card rounded-3xl p-5 border border-border/40 shadow-sm">
        <p className="text-sm font-semibold text-foreground mb-1">Ask for help with...</p>
        <p className="text-xs text-muted-foreground mb-3">Tap to assign to someone in your circle</p>
        <div className="flex flex-wrap gap-2">
          {taskSuggestions.map((task) => (
            <button
              key={task}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-muted/60 text-muted-foreground border border-transparent hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all"
            >
              {task}
            </button>
          ))}
        </div>
      </div>

      {/* Invite Button */}
      <button
        onClick={() => setShowInvite(!showInvite)}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-border hover:border-primary/30 hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary"
      >
        <UserPlus className="w-4 h-4" />
        <span className="text-sm font-semibold">Invite someone to your circle</span>
      </button>

      <AnimatePresence>
        {showInvite && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-card rounded-3xl p-5 border border-border/40 shadow-sm overflow-hidden"
          >
            <p className="text-sm font-semibold text-foreground mb-3">Send an invite</p>
            <input
              type="text"
              placeholder="Name"
              className="w-full bg-muted/40 rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none mb-2 border border-transparent focus:border-primary/30"
            />
            <input
              type="tel"
              placeholder="Phone number or email"
              className="w-full bg-muted/40 rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none mb-3 border border-transparent focus:border-primary/30"
            />
            <button className="w-full bg-primary text-primary-foreground rounded-xl py-2.5 text-sm font-semibold">
              Send invite link
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}


