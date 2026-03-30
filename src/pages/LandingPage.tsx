import { motion, useScroll, useSpring } from "framer-motion";
import { EmotionalProvider, useEmotionalState } from "@/context/EmotionalContext";
import MeshBackground    from "@/components/layout/MeshBackground";
import { CustomCursor }  from "@/components/layout/CustomCursor";
import StorySection      from "@/components/hero/StorySection"; 
import TrustStrip        from "@/components/sections/TrustStrip";
import ValueSection      from "@/components/sections/ValueSection";
import SocialProof       from "@/components/sections/SocialProof";
import ArchitectureStack from "@/components/sections/ArchitectureStack";
import FinalCTA          from "@/components/sections/FinalCTA";
import { SensorialControls } from "@/components/sections/SensorialControls";

const LandingPageContent = () => {
  const { scrollYProgress } = useScroll();
  const { calmMode } = useEmotionalState();
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });



  return (
    <div className={`relative min-h-screen selection:bg-joy-yellow overflow-clip transition-colors duration-1000 ${
      calmMode ? "filter saturate-[0.8] brightness-[0.95]" : ""
    }`}>
      
      {/* ── Magnetic Physics Cursor ── */}
      <CustomCursor />

      {/* ── Lightweight Film Grain (CSS-only, no GPU filter) ── */}
      <div 
        className="fixed inset-0 pointer-events-none z-[9998] opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />

      {/* ── Thick, Playful Scroll Progress Bar ── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[6px] rounded-r-full z-50 origin-left"
        style={{
          scaleX,
          background: calmMode ? "#CBD5E1" : "linear-gradient(90deg, var(--joy-yellow), var(--joy-orange))",
          boxShadow: calmMode ? "none" : "0 2px 10px rgba(255, 140, 66, 0.4)",
        }}
      />

      <MeshBackground />
      <SensorialControls /> {/* Inject Sound & Calm UI */}

      <main className="pb-8">
        <StorySection />
        <TrustStrip />
        <ValueSection />
        <ArchitectureStack />
        <SocialProof />
        <FinalCTA />
      </main>
    </div>
  );
};

// Global Provider Wrapper
const LandingPage = () => {
  return (
    <EmotionalProvider>
      <LandingPageContent />
    </EmotionalProvider>
  );
};

export default LandingPage;
