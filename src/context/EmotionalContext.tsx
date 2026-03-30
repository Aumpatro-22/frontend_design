import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { DetectedMood } from "@/hooks/useEmotionalMemory";

interface SessionData {
  hasVisited: boolean;
  lastMood: DetectedMood;
  lastInputSnippet: string;
}

interface EmotionalContextType extends SessionData {
  saveSessionEnd: (mood: DetectedMood, text: string) => void;
  clearMemory: () => void;
  ambientSound: boolean;
  setAmbientSound: (v: boolean) => void;
  calmMode: boolean;
  setCalmMode: (v: boolean) => void;
}

const EmotionalContext = createContext<EmotionalContextType | undefined>(undefined);

export const EmotionalProvider = ({ children }: { children: ReactNode }) => {
  const [sessionData, setSessionDataState] = useState<SessionData>({
    hasVisited: false,
    lastMood: null,
    lastInputSnippet: "",
  });

  const [ambientSound, setAmbientSound] = useState(false);
  const [calmMode, setCalmMode] = useState(false);

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
      lastInputSnippet: text.slice(0, 30) + (text.length > 30 ? "..." : ""),
    };
    setSessionDataState(newData);
    localStorage.setItem("aisaathi_emotional_memory", JSON.stringify(newData));
  };

  const clearMemory = () => {
    localStorage.removeItem("aisaathi_emotional_memory");
    setSessionDataState({ hasVisited: false, lastMood: null, lastInputSnippet: "" });
  };

  return (
    <EmotionalContext.Provider
      value={{
        ...sessionData,
        saveSessionEnd,
        clearMemory,
        ambientSound,
        setAmbientSound,
        calmMode,
        setCalmMode,
      }}
    >
      {/* Global Background Audio Player */}
      <audio 
        src="https://upload.wikimedia.org/wikipedia/commons/1/1d/Rain_on_a_tin_roof.ogg" 
        loop
        autoPlay={false}
        muted={!ambientSound}
        ref={(audio) => {
           if (audio) {
             ambientSound ? audio.play().catch(()=>console.log("Audio play blocked")) : audio.pause();
           }
        }}
      />
      {children}
    </EmotionalContext.Provider>
  );
};

export const useEmotionalState = () => {
  const context = useContext(EmotionalContext);
  if (!context) throw new Error("useEmotionalState must be within an EmotionalProvider");
  return context;
};
