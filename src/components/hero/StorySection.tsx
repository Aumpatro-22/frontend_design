import { useState, useRef, useMemo } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import HappyBlob from "@/components/hero/BreathingOrb";
import JoyfulInput from "@/components/hero/FrostedInput";
import { useEmotionalState } from "@/context/EmotionalContext";
import { BlobEmotion } from "@/components/hero/BreathingOrb";
import { DetectedMood } from "@/hooks/useEmotionalMemory";

const StorySection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { hasVisited, lastMood, calmMode } = useEmotionalState();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [emotion, setEmotion] = useState<BlobEmotion>("happy");
  const [listening, setListening] = useState(false);
  const [textLength, setTextLength] = useState(0);
  
  // Real-Time Tone Adaptation
  const [liveMood, setLiveMood] = useState<DetectedMood>("neutral");

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (calmMode) {
       if (emotion !== "happy" && latest < 0.65) setEmotion("happy");
       if (emotion !== "relieved" && latest >= 0.65) setEmotion("relieved");
       return;
    }

    if (latest < 0.3) {
      if (emotion !== "happy") setEmotion("happy");
    } else if (latest >= 0.3 && latest < 0.65) {
      if (emotion !== "overwhelmed") setEmotion("overwhelmed");
    } else {
      if (emotion !== "relieved") setEmotion("relieved");
    }
  });

  const op1 = useTransform(scrollYProgress, [0, 0.1, 0.25, 0.35], [0, 1, 1, 0]);
  const y1  = useTransform(scrollYProgress, [0, 0.1, 0.25, 0.35], [20, 0, 0, -20]);

  const op2 = useTransform(scrollYProgress, [0.25, 0.35, 0.55, 0.65], [0, 1, 1, 0]);
  const y2  = useTransform(scrollYProgress, [0.25, 0.35, 0.55, 0.65], [20, 0, 0, -20]);

  const op3 = useTransform(scrollYProgress, [0.6, 0.7, 1, 1], [0, 1, 1, 1]);
  const y3  = useTransform(scrollYProgress, [0.6, 0.7, 1, 1], [20, 0, 0, 0]);

  const inputOp = useTransform(scrollYProgress, [0.75, 0.85], [0, 1]);
  const inputY  = useTransform(scrollYProgress, [0.75, 0.85], [20, 0]);

  const greeting = useMemo(() => {
    if (!hasVisited) return (
      <>
        First, the mind is quiet. <br />
        <span className="text-joy-sky">Until it isn't.</span>
      </>
    );

    switch(lastMood) {
      case "heavy":
        return (
          <>
            Last time felt heavy. <br />
            <span className="text-joy-sky">How is today?</span>
          </>
        );
      case "anxious":
        return (
          <>
            You were moving fast recently. <br />
            <span className="text-joy-orange">We can slow down now.</span>
          </>
        );
      default:
        return (
          <>
            This space remembers you. <br />
            <span className="text-joy-sky">The quiet is still here.</span>
          </>
        );
    }
  }, [hasVisited, lastMood]);

  return (
    <section 
      ref={containerRef} 
      className="relative h-[400vh] w-full bg-transparent"
      aria-label="Story Introduction"
    >
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center px-6 overflow-hidden">
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl mx-auto h-full">
          
          <div className="relative h-32 w-full flex justify-center mb-8">
            <motion.h1
              style={{ opacity: op1, y: y1 }}
              className="absolute text-[clamp(36px,6vw,64px)] font-extrabold tracking-tight text-slate-800 text-center leading-[1.05] drop-shadow-sm"
            >
              {greeting}
            </motion.h1>

            <motion.h1
              style={{ opacity: op2, y: y2 }}
              className="absolute text-[clamp(36px,6vw,64px)] font-extrabold tracking-tight text-slate-800 text-center leading-[1.05] drop-shadow-sm"
            >
              {calmMode ? (
                <>
                  Take all the time <br />
                  <span className="text-slate-500">you need today.</span>
                </>
              ) : (
                <>
                  Sometimes, it just gets <br />
                  <span className="text-slate-500">too crowded in there.</span>
                </>
              )}
            </motion.h1>

            <motion.h1
              style={{ opacity: op3, y: y3 }}
              className="absolute text-[clamp(36px,6vw,64px)] font-extrabold tracking-tight text-slate-800 text-center leading-[1.05] drop-shadow-sm"
            >
              It helps to just... <br />
              {/* Dynamic word coloring based on Live Mood */}
              <motion.span 
                 className="transition-colors duration-1000"
                 style={{ 
                    color: liveMood === "heavy" ? "#38BDF8" : liveMood === "anxious" ? "#FB923C" : "var(--joy-orange)"
                 }}
              >
                let it out.
              </motion.span>
            </motion.h1>
          </div>

          <motion.div className="flex-shrink-0 z-10 relative">
            <HappyBlob 
              emotion={emotion} 
              listening={listening} 
              textLength={textLength} 
              scale={0.7} 
              liveMood={liveMood} // Pass live mood down!
            />
          </motion.div>

          <motion.div
            style={{ opacity: inputOp, y: inputY }}
            className="w-full relative mt-8 pointer-events-auto"
          >
            <JoyfulInput 
              onFocusChange={setListening} 
              onTextChange={setTextLength}
              onMoodDetect={setLiveMood} // Receive live mood
            />
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};

export default StorySection;
