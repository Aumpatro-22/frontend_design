import { motion, useMotionValue, useTransform, useSpring, useTime, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo, useRef } from "react";
import { DetectedMood } from "@/hooks/useEmotionalMemory";

export type BlobEmotion = "happy" | "overwhelmed" | "relieved";

interface HappyBlobProps {
  listening?: boolean;
  scale?: number;
  textLength?: number; 
  emotion?: BlobEmotion; 
  liveMood?: DetectedMood; 
  baseColor?: string; 
}

const CUTE_BUMPS = ["Whoa!", "Hey there!", "Wheee!", "Oof!"];
const CALM_SNAPS = ["Taking a breath...", "You're safe here.", "I'm right here.", "Steady..."];

const BreathingOrb = ({ 
  listening = false, 
  scale = 1, 
  textLength = 0, 
  emotion = "happy",
  liveMood = "neutral",
  baseColor = "var(--joy-yellow)"
}: HappyBlobProps) => {
  const baseSize = 250;
  
  // ── Interaction State ──
  const [isBlinking, setIsBlinking] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const messageTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (emotion === "overwhelmed" || isDragging) {
       setIsBlinking(false);
       return;
    }
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(blinkInterval);
  }, [emotion, isDragging]);

  const mouseX = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 0);
  const smoothX = useSpring(mouseX, { stiffness: 150, damping: 20, mass: 0.5 });
  const smoothY = useSpring(mouseY, { stiffness: 150, damping: 20, mass: 0.5 });
  const faceX = useTransform(smoothX, [0, typeof window !== "undefined" ? window.innerWidth : 1000], [-18, 18]);
  const faceY = useTransform(smoothY, [0, typeof window !== "undefined" ? window.innerHeight : 1000], [-18, 18]);

  // Track mouse for face-following
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mouseX, mouseY]);

  // ── Autonomous Drifting Physics ──
  const time = useTime();
  // If we are dragging or overwhelmed, disable the autonomous floating
  const driftActive = !isDragging && emotion !== "overwhelmed" && !listening;
  const floatingY = useTransform(time, (t) => driftActive ? Math.sin(t / 1500) * 12 : 0);
  const floatingX = useTransform(time, (t) => driftActive ? Math.cos(t / 2000) * 15 : 0);

  const dynamicSmilePath = useMemo(() => {
    if (isDragging) return "M 42 45 Q 50 55 58 45"; // Shocked 'O' mouth

    if (textLength > 0 || liveMood !== "neutral") {
        if (liveMood === "anxious")    return "M 30 40 Q 50 50 70 40"; 
        if (liveMood === "heavy")      return "M 32 45 Q 50 55 68 45"; 

        const maxChars = 15;
        const progress = Math.min(textLength / maxChars, 1);
        const startX = 34 - (14 * progress); 
        const startY = 32 - (4 * progress);  
        const controlY = 60 + (18 * progress); 
        const endX = 66 + (14 * progress);   
        const endY = startY; 
        return `M ${startX} ${startY} Q 50 ${controlY} ${endX} ${endY}`;
    }

    if (emotion === "overwhelmed") return "M 35 48 Q 50 48 65 48"; 
    if (emotion === "relieved")    return "M 25 35 Q 50 75 75 35"; 
    
    return "M 38 35 Q 50 45 62 35";
  }, [textLength, emotion, liveMood, isDragging]);

  let bounceIntensity = 1.03;
  let bounceDuration = 4;
  let blobColor = baseColor;
  let cheekOpacity = 0.35;

  if (textLength > 0 && liveMood === "anxious") {
    bounceIntensity = 1.05;
    bounceDuration = 1.2; 
    blobColor = "#FB923C"; 
    cheekOpacity = 0.6; 
  } else if (textLength > 0 && liveMood === "heavy") {
    bounceIntensity = 1.01;
    bounceDuration = 6.0; 
    blobColor = "#BAE6FD"; 
    cheekOpacity = 0.1; 
  } else if (emotion === "overwhelmed") {
    bounceIntensity = 1.0;
    bounceDuration = 0.2; 
  } else if (emotion === "relieved") {
    bounceIntensity = 1.08;
    bounceDuration = 2;
  } else if (textLength > 5) {
    bounceIntensity = 1.05;
    bounceDuration = 2; 
  }

  // Handle Interaction
  const handleDragStart = () => {
    setIsDragging(true);
    if (messageTimeout.current) clearTimeout(messageTimeout.current);
    const msg = CUTE_BUMPS[Math.floor(Math.random() * CUTE_BUMPS.length)];
    setMessage(msg);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    const msg = CALM_SNAPS[Math.floor(Math.random() * CALM_SNAPS.length)];
    setMessage(msg);
    messageTimeout.current = setTimeout(() => setMessage(null), 3000);
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: -5, right: 5, top: -5, bottom: 5 }}
      dragElastic={0.7}
      dragTransition={{ bounceStiffness: 400, bounceDamping: 10 }}
      whileDrag={{ scale: 0.92 }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      aria-label="Interactive Balloon Companion"
      role="button"
      tabIndex={0}
      className="relative flex items-center justify-center group z-50 touch-none outline-none"
      style={{ 
        width: baseSize * scale, 
        height: baseSize * scale,
        x: floatingX,
        y: floatingY,
        willChange: "transform",
      }}
    >
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 15, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 5 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white text-slate-800 px-5 py-2 rounded-2xl font-bold text-sm shadow-xl whitespace-nowrap pointer-events-none z-[60]"
          >
            {message}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white" />
          </motion.div>
        )}
      </AnimatePresence>

      {emotion === "overwhelmed" && (
        <motion.div 
          className="absolute inset-[-50%] pointer-events-none"
          style={{ perspective: "400px" }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          {[
            { id: 0, rx: 60, ry: 20, dur: 2.5,  dash: "20 30" },
            { id: 1, rx: -40, ry: 70, dur: 3.2, dash: "40 50" },
            { id: 2, rx: 15, ry: -60, dur: 2.8, dash: "15 40" },
            { id: 3, rx: 80, ry: 40, dur: 3.8,  dash: "10 20" }
          ].map((ring) => (
             <motion.svg 
               key={ring.id} 
               viewBox="0 0 200 200" 
               className="absolute inset-0 w-full h-full opacity-40 mix-blend-multiply"
               initial={{ rotateX: ring.rx, rotateY: ring.ry }}
               animate={{ rotateZ: 360, scale: [0.95, 1.05, 0.95] }}
               transition={{ 
                 rotateZ: { duration: ring.dur, repeat: Infinity, ease: "linear" },
                 scale: { duration: ring.dur / 2, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }
               }}
             >
                <path 
                  d="M100,20 C140,20 180,60 180,100 C180,140 140,180 100,180 C60,180 20,140 20,100 C20,60 60,20 100,20" 
                  stroke="#64748B"
                  strokeWidth={3 + ring.id % 2} 
                  fill="none" 
                  strokeDasharray={ring.dash}
                  strokeLinecap="round"
                />
             </motion.svg>
          ))}
        </motion.div>
      )}

      {/* Shadow */}
      <motion.div
        className="absolute bottom-0 rounded-[50%] bg-black/5"
        style={{ width: "60%", height: "20px", filter: "blur(6px)", willChange: "transform, opacity" }}
        animate={{ scaleX: listening ? 1.15 : [1, 1.15, 1], opacity: [0.6, 0.4, 0.6] }}
        transition={{ duration: bounceDuration, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Blob Body */}
      <motion.div
        className="relative flex items-center justify-center overflow-visible w-[80%] h-[80%]"
        style={{
          backgroundColor: blobColor,
          borderRadius: emotion === "overwhelmed" ? "40% 60% 45% 55%" : "45% 55% 50% 50%", 
          transition: "background-color 1s ease, border-radius 1s ease",
          boxShadow: `
            inset -15px -15px 30px rgba(0, 0, 0, 0.1),
            inset 10px 10px 20px rgba(255, 255, 255, 0.4)
          `,
          willChange: "transform, background-color",
        }}
        animate={{
          y: emotion === "overwhelmed" ? 0 : (listening ? -5 : [0, -10, 0]),
          scaleX: emotion === "overwhelmed" ? 1 : [1, bounceIntensity, 1],
          scaleY: emotion === "overwhelmed" ? 1 : [1, 2 - bounceIntensity, 1],
          rotate: emotion === "overwhelmed" ? [-1, 1, -1] : [0, 2, -2, 0], 
        }}
        transition={{ duration: bounceDuration, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }}
      >
        {/* Face */}
        <motion.div
          className="relative w-full h-full flex items-center justify-center p-4 will-change-transform"
          style={{ x: emotion === "overwhelmed" || isDragging ? 0 : faceX, y: emotion === "overwhelmed" || isDragging ? 0 : faceY }}
          animate={{ scale: listening || emotion === "relieved" ? 1.08 : 1 }}
        >
          <svg width="45%" viewBox="0 0 100 60" className="overflow-visible mt-2 pointer-events-none">
            <g stroke={liveMood === "heavy" ? "#334155" : "#1E293B"} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" className="transition-colors duration-1000">
              
              {/* Left Eye */}
              {isBlinking && !isDragging ? ( <path d="M 22 20 L 32 20" /> ) 
               : isDragging ? (
                 <g><circle cx="27" cy="20" r="7" fill="#FFF" stroke="#1E293B" strokeWidth="2" /><circle cx="27" cy="20" r="3" fill="#1E293B" stroke="none" /></g>
               ) : emotion === "overwhelmed" ? (
                 <g><circle cx="27" cy="20" r="10" fill="#FFF" stroke="#1E293B" strokeWidth="3" /><circle cx="27" cy="20" r="2" fill="#1E293B" stroke="none" /></g>
               ) : ( <circle cx="27" cy="20" r="5" fill="currentColor" stroke="none" /> )}
              
              {/* Right Eye */}
              {isBlinking && !isDragging ? ( <path d="M 68 20 L 78 20" /> ) 
               : isDragging ? (
                 <g><circle cx="73" cy="20" r="7" fill="#FFF" stroke="#1E293B" strokeWidth="2" /><circle cx="73" cy="20" r="3" fill="#1E293B" stroke="none" /></g>
               ) : emotion === "overwhelmed" ? (
                 <g><circle cx="73" cy="20" r="10" fill="#FFF" stroke="#1E293B" strokeWidth="3" /><circle cx="73" cy="20" r="2" fill="#1E293B" stroke="none" /></g>
               ) : (emotion === "relieved" || listening) ? (
                 <path d="M 68 20 Q 73 15 78 20" /> 
               ) : ( <circle cx="73" cy="20" r="5" fill="currentColor" stroke="none" /> )}
              
              <motion.path 
                animate={{ d: dynamicSmilePath }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }} 
              />
              
              {emotion !== "overwhelmed" && (
                <motion.g animate={{ opacity: cheekOpacity }} transition={{ duration: 1 }}>
                  <circle cx="15" cy="30" r="7" fill="#FF8C42" stroke="none" />
                  <circle cx="85" cy="30" r="7" fill="#FF8C42" stroke="none" />
                </motion.g>
              )}
            </g>
          </svg>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default BreathingOrb;
