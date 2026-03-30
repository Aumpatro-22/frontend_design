import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";
import { Lock, Clock, ShieldCheck, BookOpen } from "lucide-react";

const points = [
  { icon: Lock,        label: "Private",           detail: "Your words stay yours.",        color: "bg-sky-100",  text: "text-sky-500" },
  { icon: Clock,       label: "24 / 7",             detail: "Whenever you need.",          color: "bg-orange-100",text: "text-orange-500" },
  { icon: ShieldCheck, label: "Encrypted",          detail: "Secure from end to end.",       color: "bg-mint-100", text: "text-emerald-500" },
  { icon: BookOpen,    label: "Science-backed",     detail: "Grounded in CBT practices.",    color: "bg-indigo-100",text: "text-indigo-500" },
];

/** Animated counter that counts up from 0 */
const useCountUp = (end: number, inView: boolean, duration = 2000) => {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = Math.sin((progress * Math.PI) / 2);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [inView, end, duration]);

  return count;
};

/** 
 * Magnetic Badge Component
 * Physically pulls towards the user's cursor when hovered nearby.
 */
const MagneticBadge = ({ 
  children, 
  color,
  delay
}: { 
  children: React.ReactNode, 
  color: string,
  delay: number
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Snappy spring physics for the magnetic effect
  const springX = useSpring(mouseX, { stiffness: 150, damping: 15, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15, mass: 0.5 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    // Magnetic radius of 120px
    if (distance < 120) {
      // Pull badge towards mouse (divided by 4 so it trails just a bit)
      mouseX.set(distanceX / 4);
      mouseY.set(distanceY / 4);
    } else {
      // Snap back to center
      mouseX.set(0);
      mouseY.set(0);
    }
  }, [mouseX, mouseY]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // Reset if mouse leaves window
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  useEffect(() => {
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 100, damping: 12, delay }}
      className="flex flex-col items-center text-center gap-4 group cursor-pointer"
    >
      <div ref={ref} className="relative z-10 w-24 h-24 flex items-center justify-center">
        {/* The magnetic pill */}
        <motion.div
          className={`relative w-20 h-20 rounded-full flex items-center justify-center ${color}`}
          style={{ x: springX, y: springY }} // Apply magnetic physics
          whileHover={{ scale: 1.15, rotate: 10 }} // Extra squish on direct hover
          whileTap={{ scale: 0.95, rotate: -5 }} // Satisfying tap
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
};

const TrustStrip = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section
      ref={ref}
      aria-label="Trust indicators"
      className="relative px-6 py-24 bg-white"
    >
      {/* ── Soft wavy top border ── */}
      <div 
        className="absolute top-0 left-0 right-0 h-8 -mt-8 bg-white" 
        style={{
          maskImage: "radial-gradient(12px at bottom, transparent 96%, black 100%)",
          maskSize: "24px 24px",
          maskRepeat: "repeat-x"
        }}
      />

      <div className="max-w-5xl mx-auto flex flex-col items-center gap-16">
        
        {/* ── Magnetic Icon Badges ── */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-8">
          {points.map(({ icon: Icon, label, detail, color, text }, i) => (
            <div key={label} className="flex flex-col items-center">
              <MagneticBadge color={color} delay={i * 0.1}>
                <Icon className={`w-8 h-8 ${text}`} strokeWidth={3} />
              </MagneticBadge>

              <div className="flex flex-col gap-1 text-center -mt-2">
                <span className="text-lg font-extrabold text-slate-800 tracking-tight">
                  {label}
                </span>
                <span className="text-sm font-semibold text-slate-500">
                  {detail}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Bouncy stat banner ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 80, delay: 0.4 }}
          className="bg-joy-cream px-12 py-10 rounded-[2rem] flex flex-wrap justify-center gap-x-20 gap-y-10 border-4 border-white shadow-[0_10px_30px_-5px_rgba(0,0,0,0.06)] cursor-default"
          whileHover={{ scale: 1.02 }} // Entire banner breathes
        >
          {[
            { end: 50, suffix: "k+", label: "People Talked", color: "text-joy-sky" },
            { end: 92, suffix: "%",  label: "Felt Lighter",  color: "text-joy-orange" },
            { end: 4,  suffix: ".9", label: "App Rating",    color: "text-joy-yellow" },
          ].map(({ end, suffix, label, color }) => {
            const count = useCountUp(end, inView, 2200);
            return (
              <div key={label} className="flex flex-col items-center gap-2">
                <span className={`text-[44px] font-black tracking-tighter tabular-nums ${color}`}>
                  {count}{suffix}
                </span>
                <span className="text-[14px] text-slate-600 font-bold uppercase tracking-widest">
                  {label}
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>

    </section>
  );
};

export default TrustStrip;
