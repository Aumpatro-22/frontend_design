import { useState, useEffect } from "react";

export type DetectedMood = "heavy" | "anxious" | "neutral" | null;

interface SessionData {
  hasVisited: boolean;
  lastMood: DetectedMood;
  lastInputSnippet: string;
}

export const useEmotionalMemory = () => {
  const [sessionData, setSessionDataState] = useState<SessionData>({
    hasVisited: false,
    lastMood: null,
    lastInputSnippet: "",
  });

  const [ambientSound, setAmbientSound] = useState(false);
  const [calmMode, setCalmMode] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("aisaathi_emotional_memory");
      if (stored) {
        setSessionDataState(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse emotional memory", e);
    }
  }, []);

  const saveSessionEnd = (mood: DetectedMood, text: string) => {
    const newData = {
      hasVisited: true,
      lastMood: mood,
      // Save just a tiny snippet to not be creepy, or just a thematic summary
      lastInputSnippet: text.slice(0, 30) + (text.length > 30 ? "..." : ""),
    };
    setSessionDataState(newData);
    localStorage.setItem("aisaathi_emotional_memory", JSON.stringify(newData));
  };

  const clearMemory = () => {
    localStorage.removeItem("aisaathi_emotional_memory");
    setSessionDataState({ hasVisited: false, lastMood: null, lastInputSnippet: "" });
  };

  return {
    ...sessionData,
    saveSessionEnd,
    clearMemory,
    ambientSound,
    setAmbientSound,
    calmMode,
    setCalmMode
  };
};
