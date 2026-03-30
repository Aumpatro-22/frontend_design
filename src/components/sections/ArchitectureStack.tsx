import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";

const ARCH_LAYERS = [
  {
    id: 1,
    title: "Layer 1 — The Ear",
    headline: "Before it thinks, it listens — perfectly.",
    body: "When you type 'im sooo anxious rn' — AI Saathi doesn't stumble. The Ingestion Layer cleans, normalizes, and standardizes your words so the emotional math underneath never misses a beat.",
    bgColor: "bg-blue-50",
    accent: "text-blue-600",
    border: "border-blue-200"
  },
  {
    id: 2,
    title: "Layer 2 — The Perception Engine",
    headline: "Your words become coordinates in emotional space.",
    body: "A proprietary ML model trained on 2.18 million rows of clinical data. It doesn't read your text — it maps it across 150,000 dimensions. In milliseconds, it outputs a precise psychological signature: { state: anxiety, confidence: 0.87, secondary: [stress, burnout] }",
    bgColor: "bg-indigo-50",
    accent: "text-indigo-600",
    border: "border-indigo-200"
  },
  {
    id: 3,
    title: "Layer 3 — The Guardrail",
    headline: "It knows when to step aside and get you real help.",
    body: "Safety is hardcoded into the math — not bolted on after. If the system detects a crisis signal above threshold, it doesn't guess. It stops. It escalates. A human enters the conversation. Every time.",
    bgColor: "bg-rose-50",
    accent: "text-rose-600",
    border: "border-rose-200"
  },
  {
    id: 4,
    title: "Layer 4 — The Memory",
    headline: "It remembers your worst days — so your best days matter more.",
    body: "Every session is written into a longitudinal emotional graph. AI Saathi tracks your emotional drift over weeks and months. It knows your baseline. It notices when something shifts. It was paying attention, even when you weren't.",
    bgColor: "bg-emerald-50",
    accent: "text-emerald-600",
    border: "border-emerald-200"
  },
  {
    id: 5,
    title: "Layer 5 — The Voice",
    headline: "Only after understanding everything — does it speak.",
    body: "The response you receive isn't generic. It's generated with full knowledge of your psychological state right now, and your complete history with the system. It feels like talking to someone who has known you for years. Because, in a way, it has.",
    bgColor: "bg-amber-50",
    accent: "text-amber-600",
    border: "border-amber-200"
  }
];

const StackCard = ({ 
  layer, 
  index,
}: { 
  layer: typeof ARCH_LAYERS[0]; 
  index: number; 
}) => {
  return (
    <motion.div
      className={`sticky w-full rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 md:p-12 flex flex-col justify-between border-2 ${layer.border} shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.12)] ${layer.bgColor} overflow-hidden`}
      style={{
        top: `calc(15vh + ${index * 30}px)`, // Native sticky catch-point
        height: "55vh", 
        minHeight: "420px", // Safely fits optimized text without overflow
      }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex flex-col h-full justify-between">
        <div className="flex justify-between items-start w-full mb-6">
           <div className={`px-4 py-2 sm:px-5 sm:py-2.5 bg-white/90 rounded-full shadow-sm border border-black/5`}>
             <span className={`text-[11px] sm:text-sm tracking-[0.2em] font-black uppercase ${layer.accent}`}>
               {layer.title}
             </span>
           </div>
           
           <div className="hidden sm:block">
              <span className={`text-[120px] font-black leading-none opacity-10 ${layer.accent}`}>
                 0{layer.id}
              </span>
           </div>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4 mt-auto max-w-3xl pb-2">
          <h2 className="text-[clamp(22px,3vw,40px)] font-black text-slate-800 tracking-tight leading-[1.05]">
            {layer.headline}
          </h2>
          <p className="text-[15px] sm:text-[17px] text-slate-600 font-medium sm:font-semibold leading-relaxed">
            {layer.body}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const ArchitectureStack = () => {
  return (
    <section 
      className="relative w-full bg-joy-cream mt-10 pb-[20vh]"
      aria-label="The 5 Layers of AI Saathi Architecture"
    >
      {/* Introduction text when entering section */}
      <div className="w-full flex justify-center z-0 px-6 pt-24 pb-16">
        <div className="text-center">
           <span className="text-slate-400 font-extrabold tracking-widest uppercase text-sm mb-4 block">The System Architecture</span>
           <h2 className="text-[clamp(40px,5vw,56px)] font-black text-slate-900/10 tracking-tight leading-none">
             The Anatomy of Empathy
           </h2>
        </div>
      </div>

      {/* Container for the sticky cards */}
      <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-12 flex flex-col gap-[30vh]">
        {ARCH_LAYERS.map((layer, i) => (
          <StackCard 
            key={layer.id} 
            layer={layer} 
            index={i} 
          />
        ))}
      </div>
    </section>
  );
};

export default ArchitectureStack;
