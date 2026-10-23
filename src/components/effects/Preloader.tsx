import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { INTRO_STORAGE_KEY } from "@/lib/intro";

const DURATION = 1700;
const ease = [0.76, 0, 0.24, 1] as const;

const steps = ["BOOTING 3D ENGINE", "LOADING ASSETS", "COMPOSING LAYOUT", "READY"];

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [count, setCount] = useState(0);
  const done = useRef(onComplete);
  done.current = onComplete;

  useEffect(() => {
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    let raf = 0;
    let timeout = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / DURATION, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        try {
          sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
        } catch {
          /* private mode – ignore */
        }
        timeout = window.setTimeout(() => done.current(), 250);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
      root.style.overflow = previousOverflow;
    };
  }, []);

  const step = steps[Math.min(Math.floor(count / 26), steps.length - 1)];

  return (
    <motion.div className="fixed inset-0 z-[100]" aria-live="polite" aria-label="Loading portfolio">
      {/* Red under-layer: leaves a beat after the dark one for a double curtain */}
      <motion.div
        className="absolute inset-0 bg-primary"
        initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
        exit={{ clipPath: "inset(0% 0% 100% 0%)", transition: { duration: 0.9, ease, delay: 0.12 } }}
      />

      <motion.div
        className="absolute inset-0 flex flex-col justify-between bg-secondary p-6 text-secondary-foreground md:p-12"
        initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
        exit={{ clipPath: "inset(0% 0% 100% 0%)", transition: { duration: 0.9, ease } }}
      >
        <div className="flex items-start justify-between">
          <span className="font-heading text-xl font-bold tracking-tight">
            SJ<span className="text-primary">.</span>
          </span>
          <span className="section-label text-secondary-foreground/50">PORTFOLIO — 2026</span>
        </div>

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2 font-mono text-xs uppercase tracking-widest text-secondary-foreground/50">
            <p className="flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 animate-pulse bg-primary" />
              {step}
            </p>
            <p>FULLSTACK DEVELOPER — INDORE, IN</p>
          </div>

          <p className="font-heading text-[28vw] font-black leading-[0.8] tracking-tighter md:text-[18vw]">
            {String(count).padStart(3, "0")}
            <span className="align-top text-[0.25em] text-primary">%</span>
          </p>
        </div>

        <div className="absolute bottom-0 left-0 h-1 w-full bg-secondary-foreground/10">
          <div className="h-full origin-left bg-primary" style={{ transform: `scaleX(${count / 100})` }} />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Preloader;
