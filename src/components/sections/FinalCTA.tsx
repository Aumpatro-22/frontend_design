import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useRef, useState } from "react";
import JoyfulInput from "@/components/hero/FrostedInput";
import HappyBlob from "@/components/hero/BreathingOrb";

const FinalCTA = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [sideEmotion, setSideEmotion] = useState<"overwhelmed" | "happy">("overwhelmed");

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  
  // Track scroll progress to flip the emotion when they "meet" the center blob
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.65) {
      if (sideEmotion !== "happy") setSideEmotion("happy");
    } else {
      if (sideEmotion !== "overwhelmed") setSideEmotion("overwhelmed");
    }
  });

  // ── Scroll Mapping Physics ──
  // Side balloons travel inwards from off-screen
  const leftX  = useTransform(scrollYProgress, [0.1, 0.65], ["-50vw", "-110px"]);
  const leftY  = useTransform(scrollYProgress, [0.1, 0.65], [100, 20]);
  
  const rightX = useTransform(scrollYProgress, [0.1, 0.65], ["50vw", "110px"]);
  const rightY = useTransform(scrollYProgress, [0.1, 0.65], [100, -10]);

  // The center balloon breathes and waits
  const centerScale = useTransform(scrollYProgress, [0.5, 0.7], [0.8, 1.1]);

  // Text fades in when they meet
  const titleOpacity = useTransform(scrollYProgress, [0.65, 0.75], [0, 1]);
  const titleY = useTransform(scrollYProgress, [0.65, 0.75], [20, 0]);

  const inputOpacity = useTransform(scrollYProgress, [0.75, 0.85], [0, 1]);
  const inputY = useTransform(scrollYProgress, [0.75, 0.85], [20, 0]);

  return (
    // 250vh allows enough vertical runway for the user to scroll through the animation
    <section ref={sectionRef} className="relative h-[250vh] w-full" aria-label="Begin a session">
      
      {/* ── Sticky Stage ── */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-joy-yellow rounded-t-[4rem] shadow-[0_-20px_50px_rgba(255,200,0,0.3)] mt-12 px-6">
        
        {/* Playful Background Dots */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(#1E293B 2px, transparent 2px)", backgroundSize: "32px 32px" }}
        />

        <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-2xl mx-auto text-center h-full pt-16">
          
          {/* ── Balloon Interaction Scene ── */}
          <div className="relative w-full h-48 flex justify-center items-center pointer-events-none mb-4">
            
            {/* Left Balloon (Sad -> Happy) */}
            <motion.div
              style={{ x: leftX, y: leftY }}
              className="absolute z-20"
            >
              <HappyBlob scale={0.6} baseColor="#38BDF8" emotion={sideEmotion} />
            </motion.div>

            {/* Right Balloon (Sad -> Happy) */}
            <motion.div
              style={{ x: rightX, y: rightY }}
              className="absolute z-20"
            >
              <HappyBlob scale={0.5} baseColor="#FF8C42" emotion={sideEmotion} />
            </motion.div>

            {/* Center Balloon (The Anchoring Safe Space) */}
            <motion.div
              style={{ scale: centerScale }}
              className="absolute z-10"
            >
              <HappyBlob scale={0.8} baseColor="var(--joy-yellow)" emotion="happy" />
            </motion.div>

          </div>

          {/* ── Text Payload ── */}
          <motion.div 
            style={{ opacity: titleOpacity, y: titleY }}
            className="flex flex-col items-center gap-6 mt-6"
          >
            <h2 className="text-[clamp(36px,6vw,64px)] font-black text-slate-800 tracking-tight leading-[1.05]">
              Whenever you're <br/>
              <span className="text-white drop-shadow-md">ready.</span>
            </h2>
            <p className="text-[18px] sm:text-[22px] text-slate-800/80 font-extrabold max-w-md">
              The space is here. No rush.
            </p>
          </motion.div>

          {/* ── Input Payload ── */}
          <motion.div 
            style={{ opacity: inputOpacity, y: inputY }}
            className="w-full mt-10 filter drop-shadow-2xl pointer-events-auto"
          >
            <JoyfulInput />
          </motion.div>

        </div>
        
        {/* ── Absolute Footer ── */}
        <div className="absolute bottom-6 w-full flex flex-col sm:flex-row items-center justify-between max-w-4xl px-8 z-10">
           <p className="text-[14px] font-black tracking-widest uppercase text-slate-800/60">
             AI Saathi © 2026
           </p>
           <div className="flex items-center gap-8 mt-4 sm:mt-0">
             {["Privacy", "Terms", "Support"].map((link) => (
               <a key={link} href={`/${link.toLowerCase()}`} className="text-[14px] font-bold text-slate-800/60 hover:text-slate-800 transition-colors uppercase tracking-wider">
                 {link}
               </a>
             ))}
           </div>
        </div>

      </div>
    </section>
  );
};

export default FinalCTA;
