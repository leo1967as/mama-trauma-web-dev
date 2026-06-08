import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Plus, X, Baby, Heart } from "lucide-react";

const PRESETS = [
  { label: "First smile 😊", category: "baby" },
  { label: "First full night of sleep 🌙", category: "mom" },
  { label: "First self-care day 🛁", category: "mom" },
  { label: "First giggle 😂", category: "baby" },
  { label: "First time holding head up 💪", category: "baby" },
  { label: "Asked for help 🤝", category: "mom" },
  { label: "First solo outing 🌸", category: "mom" },
  { label: "First solid food 🥣", category: "baby" },
];

const categoryStyle = {
  baby: { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-200", dot: "bg-violet-400", icon: Baby },
  mom: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-200", dot: "bg-rose-400", icon: Heart },
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function MilestonesSection() {
  const [milestones, setMilestones] = useState([
    { id: 1, label: "First smile 😊", category: "baby", date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 2, label: "First full night of sleep 🌙", category: "mom", date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [customLabel, setCustomLabel] = useState("");
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [category, setCategory] = useState("baby");

  const handleAdd = () => {
    const label = selectedPreset || customLabel.trim();
    if (!label) return;
    setMilestones((prev) => [
      { id: Date.now(), label, category, date: new Date().toISOString() },
      ...prev,
    ]);
    setShowForm(false);
    setCustomLabel("");
    setSelectedPreset(null);
    setCategory("baby");
  };

  const handleRemove = (id) => setMilestones((prev) => prev.filter((m) => m.id !== id));

  return (
    <div className="bg-card rounded-3xl border border-border/40 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <p className="text-sm font-bold text-foreground">Baby & Mom Milestones</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={() => setShowForm((s) => !s)}
          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${showForm ? "bg-muted" : "bg-primary/10"}`}
        >
          {showForm ? <X className="w-4 h-4 text-muted-foreground" /> : <Plus className="w-4 h-4 text-primary" />}
        </motion.button>
      </div>

      {/* Add Form */}
      <AnimatePresence initial={false}>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 space-y-3 border-b border-border/30">
              {/* Category toggle */}
              <div className="flex gap-2">
                {["baby", "mom"].map((cat) => {
                  const s = categoryStyle[cat];
                  const Icon = s.icon;
                  return (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                        category === cat ? `${s.bg} ${s.text} ${s.border}` : "bg-muted/40 text-muted-foreground border-transparent"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {cat === "baby" ? "Baby" : "Mom"}
                    </button>
                  );
                })}
              </div>

              {/* Presets */}
              <div className="flex flex-wrap gap-1.5">
                {PRESETS.filter((p) => p.category === category).map((p) => (
                  <button
                    key={p.label}
                    onClick={() => { setSelectedPreset(p.label); setCustomLabel(""); }}
                    className={`px-2.5 py-1.5 rounded-full text-[11px] font-medium transition-all border ${
                      selectedPreset === p.label
                        ? `${categoryStyle[category].bg} ${categoryStyle[category].text} ${categoryStyle[category].border}`
                        : "bg-muted/50 text-muted-foreground border-transparent"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* Custom input */}
              <input
                value={customLabel}
                onChange={(e) => { setCustomLabel(e.target.value); setSelectedPreset(null); }}
                placeholder="Or write your own milestone…"
                className="w-full bg-muted/30 rounded-xl px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground outline-none border border-border/30 focus:border-primary/40"
              />

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAdd}
                disabled={!selectedPreset && !customLabel.trim()}
                className={`w-full py-3 rounded-2xl text-xs font-bold transition-all ${
                  selectedPreset || customLabel.trim()
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                Log this milestone 🌟
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timeline */}
      <div className="px-5 py-4">
        {milestones.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">No milestones yet — log your first one! 🌱</p>
        ) : (
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-3.5 top-2 bottom-2 w-px bg-border/50" />

            <div className="space-y-4">
              <AnimatePresence>
                {milestones.map((m, i) => {
                  const s = categoryStyle[m.category];
                  const Icon = s.icon;
                  return (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-start gap-3 relative"
                    >
                      {/* Dot */}
                      <div className={`w-7 h-7 rounded-full ${s.bg} border-2 ${s.border} flex items-center justify-center flex-shrink-0 z-10`}>
                        <Icon className={`w-3.5 h-3.5 ${s.text}`} />
                      </div>

                      {/* Content */}
                      <div className={`flex-1 ${s.bg} rounded-2xl px-3.5 py-2.5 border ${s.border}`}>
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-foreground leading-snug">{m.label}</p>
                          <button onClick={() => handleRemove(m.id)} className="opacity-30 hover:opacity-70 transition-opacity flex-shrink-0 mt-0.5">
                            <X className="w-3 h-3 text-foreground" />
                          </button>
                        </div>
                        <p className={`text-[10px] mt-0.5 font-medium ${s.text}`}>{formatDate(m.date)}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
