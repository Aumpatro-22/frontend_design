import { motion } from "framer-motion";
import { useRef } from "react";

const quotes = [
  {
    text: "I didn't know where to turn. Typing it out here felt like putting a heavy backpack down for the first time in months.",
    initials: "M.A.",
    color: "bg-[#FFF4D2]", // Soft yellow
    rotation: -2,
  },
  {
    text: "Just the fact that it waits for me. No awkward silences, no judgment. It's becoming my favorite daily habit.",
    initials: "R.S.",
    color: "bg-[#E0F2FE]", // Soft blue
    rotation: 1.5,
  },
  {
    text: "I used it at 3am when I couldn't sleep. It didn't make me feel weird or broken. It just listened.",
    initials: "P.K.",
    color: "bg-[#FFEDD5]", // Soft orange
    rotation: -1,
  },
];

/** Flat sticky-note style card — Now Draggable! */
const PlayfulCard = ({
  text,
  initials,
  color,
  rotation,
  delay,
  containerRef,
}: {
  text: string;
  initials: string;
  color: string;
  rotation: number;
  delay: number;
  containerRef: React.RefObject<HTMLDivElement>;
}) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: rotation }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ type: "spring", stiffness: 90, damping: 14, delay }}
      
      // ── Make it Dragabble & Throw-able ──
      drag
      dragConstraints={containerRef} // Keep roughly in bounds
      dragElastic={0.5} // Rubber-band edge feel
      dragSnapToOrigin={true} // Spring back to grid when let go
      whileDrag={{ scale: 1.05, cursor: "grabbing", rotate: rotation * 2, zIndex: 10 }} // Pop up when held
      whileHover={{ y: -8, scale: 1.02, cursor: "grab" }}
      
      className={`relative flex flex-col gap-6 p-8 sm:p-10 rounded-[2.5rem] h-full ${color} shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)] transition-all duration-300 touch-none`}
    >
      {/* Playful push-pin/tape decoration */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/60 backdrop-blur-sm rounded-full shadow-sm -rotate-2 select-none pointer-events-none" />

      {/* Quote mark */}
      <span
        aria-hidden="true"
        className="text-[60px] leading-none font-black select-none -mb-8 text-black/10 pointer-events-none"
      >
        "
      </span>

      <p className="text-[16px] sm:text-[18px] text-slate-800 font-bold leading-[1.6] z-10 pointer-events-none select-none">
        {text}
      </p>

      <div className="flex items-center gap-4 mt-auto pt-6 border-t-2 border-black/5 pointer-events-none select-none">
        {/* Smiling Avatar */}
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
             <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#FFF"/>
             <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
             <line x1="9" y1="9" x2="9.01" y2="9"/>
             <line x1="15" y1="9" x2="15.01" y2="9"/>
           </svg>
        </div>
        
        <div className="flex flex-col">
          <span className="text-[14px] font-black text-slate-800">
             {initials}
          </span>
          <span className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">
            Anonymous
          </span>
        </div>
      </div>
    </motion.article>
  );
};

const SocialProof = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      aria-label="What people say"
      className="relative px-6 py-32 overflow-hidden bg-white"
    >
      {/* ── Soft wavy top border ── */}
      <div 
        className="absolute top-0 left-0 right-0 h-8 -mt-8 bg-white" 
        style={{
          maskImage: "radial-gradient(12px at top, transparent 96%, black 100%)",
          maskSize: "24px 24px", // Fixed warning by adding 'px' to 24px
          maskRepeat: "repeat-x"
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto" ref={containerRef}>
        <div className="flex flex-col items-center mb-16 gap-4 text-center">
           <span className="inline-block px-6 py-3 bg-joy-cream rounded-full text-sm font-black uppercase text-joy-orange border-2 border-joy-orange/20 tracking-widest">
              Community
           </span>
           <h2 className="text-[clamp(32px,5vw,48px)] font-black text-slate-800 tracking-tight leading-[1.1]">
              Real people.<br/>Real relief.
           </h2>
           <p className="text-slate-500 font-semibold uppercase tracking-widest text-xs mt-2 animate-pulse">
              (Psst... you can drag these cards around!)
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8 min-h-[400px]">
          {quotes.map((quote, i) => (
            <PlayfulCard key={quote.initials} {...quote} delay={i * 0.15} containerRef={containerRef} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
