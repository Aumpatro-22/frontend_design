import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, animate } from "framer-motion";

export const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);

  // Raw mouse coordinates — no state, pure motion values
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const opacity = useMotionValue(0);

  // Tuned spring: fast enough to feel live, slow enough to feel physical
  const smoothX = useSpring(mouseX, { damping: 28, stiffness: 250, mass: 0.4 });
  const smoothY = useSpring(mouseY, { damping: 28, stiffness: 250, mass: 0.4 });

  useEffect(() => {
    // Skip entirely on touch/mobile — no cursor there
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.body.style.cursor = "none";

    let hoverThrottle: ReturnType<typeof setTimeout> | null = null;
    let hasShown = false;

    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!hasShown) {
        hasShown = true;
        opacity.set(1);
      }
    };

    // Throttled hover detection — only runs every 80ms, not every pixel
    const checkHover = (e: MouseEvent) => {
      if (hoverThrottle) return;
      hoverThrottle = setTimeout(() => {
        hoverThrottle = null;
        if (!dotRef.current) return;
        const target = e.target as HTMLElement;
        const isInteractive =
          target.matches("a, button, input, textarea, [role='button'], label") ||
          !!target.closest("a, button, [role='button']");

        // Imperatively animate the DOM node — bypasses React reconciliation entirely
        animate(dotRef.current, {
          width: isInteractive ? 44 : 14,
          height: isInteractive ? 44 : 14,
          backgroundColor: isInteractive ? "rgba(30,41,59,0.08)" : "rgba(30,41,59,0.7)",
          border: isInteractive ? "1.5px solid rgba(30,41,59,0.3)" : "0px solid transparent",
        }, { type: "spring", stiffness: 350, damping: 22, mass: 0.3 });
      }, 80);
    };

    const hideCursor = () => opacity.set(0);
    const showCursor = () => opacity.set(1);

    window.addEventListener("mousemove", moveCursor, { passive: true });
    window.addEventListener("mousemove", checkHover, { passive: true });
    document.addEventListener("mouseleave", hideCursor);
    document.addEventListener("mouseenter", showCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousemove", checkHover);
      document.removeEventListener("mouseleave", hideCursor);
      document.removeEventListener("mouseenter", showCursor);
      document.body.style.cursor = "auto";
      if (hoverThrottle) clearTimeout(hoverThrottle);
    };
  }, [mouseX, mouseY, opacity]);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: "-50%",
        translateY: "-50%",
        opacity,
      }}
    >
      <div
        ref={dotRef}
        style={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          backgroundColor: "rgba(30,41,59,0.7)",
          border: "0px solid transparent",
        }}
      />
    </motion.div>
  );
};
