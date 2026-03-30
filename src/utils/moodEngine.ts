import { DetectedMood } from "@/hooks/useEmotionalMemory";

// Simple dictionaries for client-side prototype emotional detection
const HEAVY_WORDS = [
  "sad", "depressed", "heavy", "tired", "exhausted", "lonely", 
  "hopeless", "lost", "broken", "empty", "hard", "difficult", 
  "struggle", "cry", "crying", "pain", "hurt", "grief", "give up",
  "worthless", "meaningless"
];

const ANXIOUS_WORDS = [
  "anxious", "panic", "worry", "worried", "stressed", "stress", 
  "overwhelmed", "fast", "racing", "scared", "fear", "nervous", 
  "terrified", "pressure", "deadline", "can't breathe", "tight",
  "dread", "shaking"
];

export const analyzeMood = (text: string): DetectedMood => {
  if (!text.trim()) return "neutral";
  
  const lowerText = text.toLowerCase();
  
  let heavyScore = 0;
  let anxiousScore = 0;
  
  HEAVY_WORDS.forEach((word) => {
    // Regex matches whole words only to avoid false positives (e.g. "scared" inside "scarred")
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) heavyScore += matches.length;
  });

  ANXIOUS_WORDS.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) anxiousScore += matches.length;
  });

  // If there's enough signal, pick the dominant one
  if (heavyScore === 0 && anxiousScore === 0) return "neutral";
  if (heavyScore > anxiousScore) return "heavy";
  return "anxious";
};
