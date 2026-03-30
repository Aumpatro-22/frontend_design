import { useState, useRef, KeyboardEvent, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEmotionalState } from "@/context/EmotionalContext";
import { analyzeMood } from "@/utils/moodEngine";
import { DetectedMood } from "@/hooks/useEmotionalMemory";

interface JoyfulInputProps {
  onFocusChange?: (focused: boolean) => void;
  onTextChange?: (length: number) => void; 
  onMoodDetect?: (mood: DetectedMood) => void;
}

const JoyfulInput = ({ onFocusChange, onTextChange, onMoodDetect }: JoyfulInputProps) => {
  const [value, setValue]         = useState("");
  const [focused, setFocused]     = useState(false);
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Typing Comfort System
  const [typingStatus, setTypingStatus] = useState<"idle" | "typing" | "paused">("idle");
  const typingTimer = useRef<NodeJS.Timeout | null>(null);

  const { saveSessionEnd, calmMode } = useEmotionalState();
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFocus = () => {
    setFocused(true);
    onFocusChange?.(true);
  };
  
  const handleBlur = () => {
    setFocused(false);
    onFocusChange?.(false);
  };

  const handleTextChange = (val: string) => {
    setValue(val);
    onTextChange?.(val.length);
    
    // Live Emotional Detection
    const detected = analyzeMood(val);
    onMoodDetect?.(detected);

    // Typing Comfort System (Debouncer)
    setTypingStatus("typing");
    if (typingTimer.current) clearTimeout(typingTimer.current);
    
    if (val.trim()) {
      typingTimer.current = setTimeout(() => {
        setTypingStatus("paused");
      }, 3000);
    } else {
      setTypingStatus("idle");
    }
  };

  // Clean up timer
  useEffect(() => {
    return () => { if (typingTimer.current) clearTimeout(typingTimer.current); }
  }, []);

  const handleSubmit = async () => {
    if (!value.trim() || loading) return;
    setLoading(true);
    setSubmitted(true);
    
    // Save to Emotional Memory Layer
    saveSessionEnd(analyzeMood(value), value);

    // Emotional Non-Verbal Feedback Wait (simulating absorbing/listening)
    await new Promise((r) => setTimeout(r, 3500));
    navigate("/onboarding");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-4">
      <motion.div
        className="relative w-full"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 15 }}
      >
        <motion.div
          className="relative flex items-center gap-3 p-2 bg-white rounded-full transition-all duration-500 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.06)]"
          style={{
            border: focused 
              ? calmMode ? "3px solid #94A3B8" : "3px solid var(--joy-sky)" 
              : "3px solid #E2E8F0",
            boxShadow: focused && !calmMode 
              ? "0 10px 40px -10px rgba(56,189,248,0.2)" 
              : "0 8px 30px -10px rgba(0,0,0,0.05)",
          }}
          whileHover={{ y: -2 }}
        >
          {/* Friendly Icon / Decoration */}
          <motion.div 
            className="pl-4 pr-1 hidden sm:block origin-center"
            animate={typingStatus === "typing" && !calmMode ? { rotate: [0, 15, -5, 0] } : { rotate: 0 }}
            transition={{ duration: 0.5 }}
          >
             <div className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500" 
                  style={{ 
                    backgroundColor: typingStatus === "paused" ? "#E0F2FE" : "#FFEDD5",
                    color: typingStatus === "paused" ? "#0EA5E9" : "#FB923C" 
                  }}>
               <Sparkles className="w-5 h-5" />
             </div>
          </motion.div>

          {/* Input field */}
          <input
            ref={inputRef}
            id="hero-input"
            type="text"
            value={value}
            onChange={(e) => handleTextChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder="How are you feeling today?"
            disabled={loading}
            autoComplete="off"
            className="relative z-10 flex-1 bg-transparent text-slate-800 placeholder-slate-400 text-lg sm:text-lg font-bold px-4 outline-none disabled:opacity-50 transition-all duration-300"
            aria-label="Start a conversation with AI Saathi"
          />

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                className="relative z-10 h-14 w-14 sm:h-16 sm:w-16 rounded-full flex items-center justify-center shrink-0 border-[3px] transition-colors duration-1000"
                style={{
                   backgroundColor: calmMode ? "#CBD5E1" : "var(--joy-yellow)",
                   borderColor: calmMode ? "#CBD5E1" : "var(--joy-yellow)",
                }}
              >
                {/* Absorbing/Listening Pulse Feedback */}
                <motion.div
                   className="absolute inset-0 rounded-full bg-white opacity-40 mix-blend-overlay"
                   animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
                   transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            ) : (
              <motion.button
                key="arrow"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                onClick={handleSubmit}
                disabled={!value.trim()}
                
                whileHover={{ 
                  scaleX: value.trim() ? 1.08 : 1, 
                  scaleY: value.trim() ? 0.92 : 1, 
                }}
                whileTap={{ 
                  scaleX: value.trim() ? 0.9 : 1, 
                  scaleY: value.trim() ? 1.1 : 1, 
                }}
                transition={{ type: "spring", stiffness: 400, damping: 12, mass: 0.8 }}
                
                className="relative z-10 h-14 w-14 sm:h-16 sm:w-16 rounded-full flex items-center justify-center shrink-0 transition-colors duration-500 focus:outline-none origin-center"
                style={{
                  backgroundColor: value.trim() ? (calmMode ? "#94A3B8" : "var(--joy-yellow)") : "#F1F5F9",
                  border: value.trim() ? `3px solid ${calmMode ? "#94A3B8" : "var(--joy-yellow)"}` : "3px solid #F1F5F9",
                  cursor: value.trim() ? "pointer" : "default",
                }}
                aria-label="Begin session"
              >
                <ArrowRight className={`w-6 h-6 sm:w-8 sm:h-8 transition-colors ${value.trim() ? "text-slate-800" : "text-white"}`} strokeWidth={3} />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* ── Typing Comfort & Radical Privacy Messages ── */}
      <div className="h-8 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.p
              key="holding"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="text-sm font-bold text-sky-500"
            >
              Listening...
            </motion.p>
          ) : typingStatus === "paused" && value.length > 5 ? (
            <motion.p
              key="comfort"
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.8 }}
              className="text-sm font-medium text-slate-500 tracking-wide"
            >
              Take your time. You don't need perfect words.
            </motion.p>
          ) : (
            <motion.p
              key="private"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs sm:text-[13px] font-bold text-slate-400 tracking-wider flex items-center gap-2"
            >
              <span>This space is yours.</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span>No one is watching.</span>
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default JoyfulInput;
