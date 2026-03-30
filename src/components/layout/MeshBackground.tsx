import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

/**
 * Joyful Background (Headspace-inspired) — Hyper-Interactive
 *
 * Warm cream base with very large, soft pastel gradients drifting slowly.
 * The "Shy Cloud" (Green decorative shape) actively runs away from the user's mouse!
 */
const MeshBackground = () => {
  // ── Shy Cloud Physics ──
  const cloudRef = useRef<HTMLDivElement>(null);
  
  // Base offset
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);

  // Spring to make the float-away and snap-back smooth
  const springX = useSpring(offsetX, { stiffness: 80, damping: 20 });
  const springY = useSpring(offsetY, { stiffness: 80, damping: 20 });

  useEffect(() => {
    let rafPending = false;
    let lastE: MouseEvent | null = null;

    const processMove = () => {
      rafPending = false;
      if (!lastE || !cloudRef.current) return;
      
      const rect = cloudRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const dx = lastE.clientX - centerX;
      const dy = lastE.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 250) {
        const repulsionStrength = (250 - distance) * 0.5;
        const angle = Math.atan2(dy, dx);
        offsetX.set(-Math.cos(angle) * repulsionStrength);
        offsetY.set(-Math.sin(angle) * repulsionStrength);
      } else {
        offsetX.set(0);
        offsetY.set(0);
      }
    };

    const onMove = (e: MouseEvent) => {
      lastE = e;
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(processMove);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [offsetX, offsetY]);


  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{ backgroundColor: "var(--joy-cream)" }}
    >
      {/* ── High-Performance Blob 1: Sunny Yellow ── */}
      <motion.div
        className="absolute"
        style={{
          width: "50vw",
          height: "50vw",
          top: "-15%",
          right: "-10%",
          background: "radial-gradient(circle at 50% 50%, rgba(255, 200, 0, 0.28) 0%, rgba(255, 200, 0, 0) 65%)",
          borderRadius: "50%",
          willChange: "transform",
        }}
        animate={{
          x: ["0%", "-10%", "5%", "0%"],
          y: ["0%", "8%", "-4%", "0%"],
          scale: [1, 1.05, 0.98, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* ── High-Performance Blob 2: Soft Orange ── */}
      <motion.div
        className="absolute"
        style={{
          width: "60vw",
          height: "60vw",
          top: "25%",
          left: "-25%",
          background: "radial-gradient(circle at 50% 50%, rgba(255, 140, 66, 0.18) 0%, rgba(255, 140, 66, 0) 65%)",
          borderRadius: "50%",
          willChange: "transform",
        }}
        animate={{
          x: ["0%", "15%", "-5%", "0%"],
          y: ["0%", "-12%", "6%", "0%"],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* ── High-Performance Blob 3: Sky Blue ── */}
      <motion.div
        className="absolute"
        style={{
          width: "70vw",
          height: "70vw",
          bottom: "-25%",
          right: "-15%",
          background: "radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.18) 0%, rgba(56, 189, 248, 0) 65%)",
          borderRadius: "50%",
          willChange: "transform",
        }}
        animate={{
          x: ["0%", "-12%", "8%", "0%"],
          y: ["0%", "-10%", "15%", "0%"],
        }}
        transition={{
          duration: 45,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* ── Shy Cloud (Runs away from cursor!) ── */}
      <motion.div 
        ref={cloudRef}
        className="absolute hidden lg:block opacity-30 z-0 origin-center"
        style={{ 
          top: "15%", 
          left: "12%", 
          willChange: "transform",
          x: springX, // Repulsion physics x
          y: springY, // Repulsion physics y
        }}
        whileHover={{ scale: 0.9, rotate: -15 }} // Extra squish if you catch it
      >
        {/* Passive floating animation via a nested div so it stacks with physics x/y */}
        <motion.div
           animate={{ y: ["0%", "-15%", "0%"], rotate: [0, 4, 0] }}
           transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
           <svg width="140" height="140" viewBox="0 0 200 200">
             <path 
               fill="#34D399" 
               d="M48.4,-51.9C60.2,-37.2,65.6,-18.6,63.1,-2.5C60.6,13.6,50.2,27.3,38.4,41.9C26.7,56.4,13.4,71.8,-3.5,75.3C-20.3,78.8,-40.7,70.5,-54.2,55.9C-67.7,41.4,-74.4,20.7,-72.1,2.3C-69.8,-16.1,-58.5,-32.2,-45,-46.9C-31.5,-61.6,-15.8,-74.9,1.4,-76.3C18.6,-77.7,37.1,-66.6,48.4,-51.9Z" 
               transform="translate(100 100)" 
             />
           </svg>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MeshBackground;
