import { LedMoodIndicator } from "@/components/chat/LedMoodIndicator";

const ALL_MOODS = [
  { mood: "calm",         label: "Rest",         confidence: 0.85 },
  { mood: "hopeful",      label: "Hope",         confidence: 0.85 },
  { mood: "sad",          label: "A Break",      confidence: 0.85 },
  { mood: "anxious",      label: "Reassurance",  confidence: 0.85 },
  { mood: "angry",        label: "Laughter",     confidence: 0.85 },
  { mood: "healing",      label: "Healing",      confidence: 0.85 },
  { mood: "lonely",       label: "Company",      confidence: 0.85 },
  { mood: "tired",        label: "Advice",       confidence: 0.85 },
  { mood: "loved",        label: "Forgiveness",  confidence: 0.85 },
  { mood: "grateful",     label: "Care",         confidence: 0.85 },
  { mood: "seeking help", label: "Help",         confidence: 0.85 },
  { mood: "patient",      label: "Patience",     confidence: 0.85 },
  { mood: "unknown",      label: "Offline",      confidence: 0.0  },
];

export default function LedTest() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#1a1a2e",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 40,
      fontFamily: "'Inter', sans-serif",
    }}>
      <h1 style={{ color: "#fff", fontSize: 24, marginBottom: 8 }}>
        LED Mood Indicator — All Colors
      </h1>
      <p style={{ color: "#888", fontSize: 14, marginBottom: 40 }}>
        Self-Care Check-In Palette · All 12 moods + Offline
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 32,
      }}>
        {ALL_MOODS.map(({ mood, label, confidence }) => (
          <div
            key={mood}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            {/* Enlarged LED for visibility */}
            <div style={{ transform: "scale(3)" }}>
              <LedMoodIndicator mood={mood} confidence={confidence} />
            </div>
            <span style={{
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              marginTop: 16,
            }}>
              {label}
            </span>
            <span style={{
              color: "#666",
              fontSize: 11,
              fontStyle: "italic",
            }}>
              {mood}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
