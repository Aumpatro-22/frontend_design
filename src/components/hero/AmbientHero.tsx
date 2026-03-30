import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import HappyBlob from "@/components/hero/BreathingOrb";
import JoyfulInput from "@/components/hero/FrostedInput";

const JoyfulHero = () => {
  const [listening, setListening] = useState(false);
  const [textLength, setTextLength] = useState(0); // Track typing progress!

  /* ── Enhanced, punchy scroll parallax ── */
  const { scrollY } = useScroll();
  
  // Exaggerated parallax speeds for a 3D "pop" effect
  const blobY   = useTransform(scrollY, [0, 600], [0, 180]); // Blob falls behind quickly
  const textY   = useTransform(scrollY, [0, 600], [0, 80]);  // Text falls semi-slowly
  const inputY  = useTransform(scrollY, [0, 600], [0, -30]); // Input slightly floats UP towards the user!

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pb-24 pt-32 overflow-hidden"
      aria-label="Hero — start a session"
    >
      <motion.div
        className="relative z-10 flex flex-col items-center gap-12 w-full max-w-4xl mx-auto text-center perspective-1000"
      >
        {/* ── Happy Blob Character (parallax layer 1 - Farthest Back) ── */}
        <motion.div style={{ y: blobY, zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 12 }}
            className="mb-4"
          >
            {/* Pass textLength so the blob can react to typing */}
            <HappyBlob listening={listening} scale={0.7} textLength={textLength} />
          </motion.div>
        </motion.div>

        {/* ── Wordmark + headline (parallax layer 2 - Middle) ── */}
        <motion.div
          style={{ y: textY, zIndex: 2 }}
          className="flex flex-col items-center gap-6"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 }}
            className="text-[clamp(40px,7vw,72px)] font-extrabold tracking-tight text-slate-800 leading-[1.05]"
          >
            A friendly space <br />
            <span className="text-joy-orange">for your mind.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-[18px] sm:text-[22px] text-slate-500 font-semibold leading-relaxed max-w-2xl"
          >
            No pressure. No judgment. Just a quiet place to slow down, take a breath, and say what's on your mind.
          </motion.p>
        </motion.div>

        {/* ── Input (parallax layer 3 - Closest to user) ── */}
        <motion.div
          style={{ y: inputY, zIndex: 3 }}
          className="w-full relative mt-4 transform-gpu"
        >
          <JoyfulInput 
            onFocusChange={setListening} 
            onTextChange={setTextLength} // Receive typing progress
          />
        </motion.div>
      </motion.div>

      {/* ── Cheerful bouncing arrow indicator ── */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ delay: 1, duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M19 12l-7 7-7-7"/>
        </svg>
      </motion.div>
    </section>
  );
};

export default JoyfulHero;
