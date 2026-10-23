import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import heroAbstract from "@/assets/hero-abstract.jpg";
import Magnetic from "@/components/effects/Magnetic";

// Three.js is split into its own chunk so it never blocks first paint
const HeroScene = lazy(() => import("@/components/three/HeroScene"));

const ease = [0.16, 1, 0.3, 1] as const;
const roles = ["FULLSTACK APPS", "3D WEB EXPERIENCES", "SCALABLE APIS", "ML-POWERED PRODUCTS"];

/** Each letter flips up in 3D, then lifts and turns red on hover. */
const HeroWord = ({ text, ready, delay }: { text: string; ready: boolean; delay: number }) => (
  <span aria-hidden className="inline-block">
    {Array.from(text).map((char, i) => (
      <motion.span
        key={i}
        className="inline-block origin-bottom"
        style={{ transformPerspective: 800 }}
        initial={{ opacity: 0, y: "55%", rotateX: -85 }}
        animate={ready ? { opacity: 1, y: "0%", rotateX: 0 } : undefined}
        transition={{ duration: 1.1, delay: delay + i * 0.06, ease }}
      >
        <span className="pointer-events-auto inline-block cursor-default transition-[transform,color] duration-300 ease-out hover:-translate-y-[0.06em] hover:text-primary">
          {char}
        </span>
      </motion.span>
    ))}
  </span>
);

const RoleTicker = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % roles.length), 2400);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col gap-1">
      <span className="section-label">I BUILD</span>
      <div className="relative h-6 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={roles[index]}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.45, ease }}
            className="block whitespace-nowrap font-heading text-base font-bold tracking-tight text-primary"
          >
            {roles[index]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};

const Hero = ({ ready = true }: { ready?: boolean }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [sceneReady, setSceneReady] = useState(false);
  const [sceneFailed, setSceneFailed] = useState(false);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const watermarkX = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] md:min-h-screen flex items-end overflow-hidden pb-12 md:pb-20 pt-24 md:pt-0"
    >
      {/* Background text watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <motion.span
          style={{ x: watermarkX }}
          className="font-heading text-[20vw] font-black text-foreground/[0.03] leading-none whitespace-nowrap"
        >
          DEVELOPER
        </motion.span>
      </div>

      {/* Abstract image — shown until the 3D scene is live (or if WebGL is unavailable) */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={ready ? { opacity: sceneReady ? 0 : 1, scale: 1 } : undefined}
        transition={{ duration: 1.2, ease }}
        className="pt-10 absolute top-0 right-0 w-1/2 h-[70vh] hidden lg:block pointer-events-none"
      >
        <img src={heroAbstract} alt="Abstract geometric composition" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background" />
      </motion.div>

      {/* Interactive 3D sculpture */}
      {!sceneFailed && (
        <div className="absolute right-0 top-14 z-0 w-full h-[40%] sm:h-[44%] lg:top-16 lg:w-[58%] lg:h-[72%] lg:max-xl:[mask-image:linear-gradient(to_right,transparent_0%,black_55%)]">
          {/* On narrower laptops the name overlaps the stage, so its left edge fades out like the original image did */}
          <Suspense fallback={null}>
            <HeroScene
              ready={ready}
              className="h-full w-full"
              onReady={() => setSceneReady(true)}
              onError={() => setSceneFailed(true)}
            />
          </Suspense>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: ready && sceneReady ? 1 : 0 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            className="pointer-events-none absolute right-6 top-4 hidden font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:right-12 lg:block"
          >
            [ HOVER · CLICK · DRAG ]
          </motion.p>
        </div>
      )}

      {/* Vertical side label */}
      <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 hidden lg:block">
        <span className="section-label [writing-mode:vertical-lr] rotate-180">
          FULLSTACK DEVELOPER — PORTFOLIO 2026
        </span>
      </div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 px-6 md:px-12 lg:px-24 w-full lg:pt-12 md:pt-6 pointer-events-none"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8, delay: 0.1, ease }}
          className="mt-6 flex flex-wrap items-center gap-4"
        >
          <p className="section-label">HELLO, I'M</p>
          <span className="inline-flex items-center gap-2 border border-border bg-background/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            OPEN TO WORK
          </span>
        </motion.div>

        <h1 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-[6rem] xl:text-[7.5rem] 2xl:text-[9rem] font-black leading-[0.85] tracking-tight">
          <span className="sr-only">Shubham Jamliya</span>
          <HeroWord text="SHUBHAM" ready={ready} delay={0.2} />
          <br />
          <span className="lg:pl-32 md:pl-20 text-stroke inline-block">
            <HeroWord text="JAMLIYA" ready={ready} delay={0.45} />
          </span>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.8, delay: 0.9, ease }}
          className="mt-8 flex flex-col sm:flex-row items-start sm:items-end gap-6 sm:gap-12"
        >
          <p className="max-w-xs text-sm text-muted-foreground leading-relaxed">
            Building immersive digital experiences at the intersection of design and code. Based in Indore, India.
          </p>
          <div className="flex items-center gap-6 pointer-events-auto">
            <a
              href="#work"
              className="section-label whitespace-nowrap border-b border-foreground pb-1 hover:border-primary hover:text-primary transition-colors"
            >
              VIEW WORK →
            </a>
            <Magnetic strength={0.4}>
              <a
                href="#contact"
                className="group relative inline-flex items-center gap-2 overflow-hidden whitespace-nowrap bg-foreground px-5 py-3 font-mono text-xs font-bold uppercase tracking-widest text-background"
              >
                <span className="absolute inset-0 -translate-x-full bg-primary transition-transform duration-500 ease-out group-hover:translate-x-0" />
                <span className="relative">Let's talk</span>
                <span className="relative transition-transform duration-300 group-hover:rotate-45">↗</span>
              </a>
            </Magnetic>
          </div>
          <div className="sm:ml-auto">
            <RoleTicker />
          </div>
        </motion.div>

        {/* Horizontal rule at bottom */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={ready ? { scaleX: 1 } : undefined}
          transition={{ duration: 1.2, delay: 1.1, ease }}
          className="editorial-rule mt-12 origin-left"
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : undefined}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mt-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground"
        >
          <span>22.7196° N, 75.8577° E</span>
          <span className="flex items-center gap-3">
            SCROLL
            <span className="relative block h-px w-10 overflow-hidden bg-border">
              <span className="absolute inset-y-0 left-0 w-1/2 animate-scroll-line bg-primary" />
            </span>
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
