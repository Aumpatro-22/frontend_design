import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef, useEffect, useCallback } from "react";

const pillars = [
  {
    eyebrow: "Always ready",
    heading: "A space that waits for you.",
    body: "No appointments. No commute. No small talk before you're ready. When a moment gets heavy, just open this and say what's there.",
    BgColor: "bg-sky-200",
    blobColor: "fill-sky-400",
    face: true,
  },
  {
    eyebrow: "No pressure",
    heading: "Say it in your own words.",
    body: "You don't need the right vocabulary. You don't need to know what's wrong. Starting with 'I don't even know where to begin' is enough.",
    BgColor: "bg-orange-200",
    blobColor: "fill-orange-400",
    face: false,
  },
  {
    eyebrow: "Over time",
    heading: "It remembers what matters.",
    body: "AI Saathi builds context from your sessions — noticing patterns so you don't have to explain yourself from scratch every single time.",
    BgColor: "bg-mint-200",
    blobColor: "fill-emerald-400",
    face: true,
  },
];

/** 
 * Wobbly SVG Shape — Performance Optimized & Interactive
 * 
 * - Morphing paths are removed to save GPU layout thrashing.
 * - Hardware accelerated CSS transforms (rotate, scaleX/Y) applied instead.
 * - Eyes follow the cursor actively using Framer Motion springs.
 */
const WobblyBlob = ({ color, face, index }: { color: string; face: boolean; index: number }) => {
  // Static paths (no morphing)
  const shapes = [
    // Soft triangle / cloud
    "M45,-52C58,-38,68,-19,65,-1C62,17,45,34,30,46C15,58,-3,65,-21,61C-39,57,-57,42,-64,23C-71,4,-67,-19,-54,-36C-41,-53,-20,-64,-1,-63C19,-62,32,-49,45,-52Z",
    // Round potato shape
    "M40,-48C53,-35,66,-21,69,-4C72,13,67,31,54,44C41,57,21,65,1,64C-19,63,-38,53,-51,39C-64,25,-71,6,-66,-10C-61,-26,-44,-39,-28,-51C-12,-63,4,-74,20,-66C36,-58,27,-61,40,-48Z",
    // Bean shape
    "M36,-41C48,-28,59,-16,61,-1C63,14,56,31,43,43C30,55,15,62,-2,64C-19,66,-38,63,-51,51C-64,39,-71,19,-69,1C-67,-17,-56,-34,-41,-45C-26,-56,-13,-61,-1,-60C11,-59,24,-54,36,-41Z"
  ];
  const currentShape = shapes[index % shapes.length];

  // ── Physics-Based Eye Tracking ──
  const mouseX = useMotionValue(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== "undefined" ? window.innerHeight / 2 : 0);
  
  const springConfig = { stiffness: 120, damping: 25 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Map absolute screen coords to tiny SVG local coords (-4 to +4)
  const pupilX = useTransform(smoothX, [0, typeof window !== "undefined" ? window.innerWidth : 1000], [-3, 3]);
  const pupilY = useTransform(smoothY, [0, typeof window !== "undefined" ? window.innerHeight : 1000], [-3, 3]);

  // Global mouse listener for the eyes
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  }, [mouseX, mouseY]);

  useEffect(() => {
    if (!face) return;
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [face, handleMouseMove]);

  return (
    <div className="relative flex items-center justify-center w-[250px] h-[250px] sm:w-[320px] sm:h-[320px]">
      {/* Container provides hardware-accelerated "wobble" (rotate/scale) */}
      <motion.div
        className="w-full h-full drop-shadow-xl"
        animate={{
          rotate: [0, 5, -5, 0],
          scaleX: [1, 1.05, 0.95, 1],
          scaleY: [1, 0.95, 1.05, 1],
        }}
        transition={{
          duration: 6 + index * 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ willChange: "transform" }}
      >
        <svg viewBox="-100 -100 200 200" className="w-full h-full overflow-visible">
          {/* Static Path */}
          <path d={currentShape} className={color} />
          
          {/* Friendly Face Overlay (Interactive) */}
          {face && (
            <g transform={`translate(${index === 0 ? 5 : -5}, ${index === 0 ? -10 : 5})`}>
              
              {/* White outer eyes */}
              <circle cx="-15" cy="-5" r="8" fill="#FFF" />
              <circle cx="25" cy="-5" r="8" fill="#FFF" />

              {/* Pupils (Track Mouse!) */}
              <motion.circle cx="-15" cy="-5" r="4" fill="#1E293B" style={{ x: pupilX, y: pupilY }} />
              <motion.circle cx="25" cy="-5" r="4" fill="#1E293B" style={{ x: pupilX, y: pupilY }} />

              {/* Smile */}
              <path d="M-5 15 Q 5 25 15 15" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" fill="none" />
              {/* Blush */}
              <circle cx="-30" cy="5" r="7" fill="#FFF" opacity="0.3" />
              <circle cx="40" cy="5" r="7" fill="#FFF" opacity="0.3" />
            </g>
          )}
        </svg>
      </motion.div>
    </div>
  );
};

const PillarRow = ({ pillar, index, reversed }: { pillar: typeof pillars[0]; index: number; reversed: boolean; }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start 90%", "start 45%"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      ref={rowRef}
      style={{ y, opacity }}
      className={`flex flex-col gap-10 items-center lg:flex-row bg-white p-8 sm:p-16 rounded-[3rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.06)] border-4 border-${pillar.BgColor.split('-')[1]}-50 ${
        reversed ? "lg:flex-row-reverse" : ""
      }`}
      whileHover={{ scale: 1.01 }} // Micro interaction on the whole card
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Abstract visual container */}
      <div className={`flex-1 flex items-center justify-center ${pillar.BgColor} rounded-[2.5rem] p-8 aspect-square relative overflow-hidden group`}>
        {/* Decorative background spots */}
        <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-white opacity-40 mix-blend-overlay blur-md" />
        <div className="absolute bottom-8 right-8 w-24 h-24 rounded-full bg-white opacity-30 mix-blend-overlay blur-xl" />
        
        {/* Interactive Blob */}
        <WobblyBlob color={pillar.blobColor} face={pillar.face} index={index} />
      </div>

      {/* Copy */}
      <div className="flex-[1.5] w-full flex flex-col gap-4 max-w-lg lg:px-12">
        <div className="inline-block px-4 py-2 bg-slate-100 rounded-full w-fit">
          <p className="text-sm tracking-widest uppercase font-extrabold text-slate-500">
            {pillar.eyebrow}
          </p>
        </div>
        <h2 className="text-[clamp(28px,4vw,42px)] font-black text-slate-800 tracking-tight leading-[1.15]">
          {pillar.heading}
        </h2>
        <p className="text-[17px] sm:text-[20px] text-slate-600 font-semibold leading-relaxed">
          {pillar.body}
        </p>
      </div>
    </motion.div>
  );
};

const ValueSection = () => (
  <section aria-label="What AI Saathi does" className="px-6 py-24 max-w-6xl mx-auto bg-joy-cream">
    {/* Section label */}
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 100 }}
      className="mb-16 text-center"
    >
      <span className="inline-block px-6 py-3 bg-white rounded-full shadow-sm text-sm tracking-[0.2em] font-black uppercase text-joy-sky border-2 border-joy-sky/20">
        How it helps
      </span>
    </motion.div>

    <div className="flex flex-col gap-16">
      {pillars.map((pillar, i) => (
        <PillarRow
          key={pillar.heading}
          pillar={pillar}
          index={i}
          reversed={i % 2 === 1}
        />
      ))}
    </div>
  </section>
);

export default ValueSection;
