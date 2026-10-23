import { useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";

const ease = [0.16, 1, 0.3, 1] as const;

const steps = [
  {
    id: "01",
    title: "DISCOVER",
    meta: "RESEARCH",
    description:
      "Understand the problem before touching code — goals, users, constraints and what success actually looks like.",
    points: ["Goals & users", "Scope", "Tech choices"],
  },
  {
    id: "02",
    title: "DESIGN",
    meta: "FIGMA",
    description:
      "Wireframes to prototypes. Structure, motion and interaction are decided before pixels get polished.",
    points: ["Wireframes", "Prototypes", "Motion"],
  },
  {
    id: "03",
    title: "BUILD",
    meta: "REACT / NODE",
    description:
      "Component-driven and typed. Clean architecture on both ends, shipped in small, reviewable increments.",
    points: ["Components", "APIs", "Testing"],
  },
  {
    id: "04",
    title: "SHIP & ITERATE",
    meta: "CI / CD",
    description:
      "Deploy, measure real usage, refine. Performance and accessibility are part of done — not an afterthought.",
    points: ["Deploy", "Performance", "Iterate"],
  },
];

const StepCard = ({ step, swing }: { step: (typeof steps)[number]; swing?: MotionValue<number> }) => (
  <motion.article
    style={swing ? { rotateY: swing, transformPerspective: 1200 } : undefined}
    className="group relative flex shrink-0 flex-col justify-between border border-border bg-background p-8 md:p-12 w-full lg:w-[38vw] xl:w-[34vw] min-h-[420px] lg:h-[64vh] transition-colors duration-500 hover:bg-secondary hover:text-secondary-foreground"
  >
    <div className="flex items-start justify-between font-mono text-xs tracking-widest">
      <span className="text-primary">STEP {step.id}</span>
      <span className="text-muted-foreground group-hover:text-secondary-foreground/50">{step.meta}</span>
    </div>

    <span
      aria-hidden
      className="text-stroke font-heading text-[8rem] md:text-[11rem] font-black leading-none tracking-tighter transition-all duration-500 group-hover:[-webkit-text-stroke-color:hsl(var(--primary))] group-hover:translate-x-2"
    >
      {step.id}
    </span>

    <div>
      <h3 className="font-heading text-3xl md:text-5xl font-black uppercase leading-none tracking-tight">{step.title}</h3>
      <p className="mt-4 max-w-sm leading-relaxed text-muted-foreground group-hover:text-secondary-foreground/70">
        {step.description}
      </p>
      <ul className="mt-6 flex flex-wrap gap-2">
        {step.points.map((p) => (
          <li
            key={p}
            className="border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground group-hover:border-secondary-foreground/20 group-hover:text-secondary-foreground/70"
          >
            {p}
          </li>
        ))}
      </ul>
    </div>

    <span className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-700 ease-out group-hover:w-full" />
  </motion.article>
);

const Intro = () => (
  <div className="flex shrink-0 flex-col justify-center lg:w-[34vw] lg:pr-8">
    <div className="mb-4 flex items-center gap-4">
      <span className="h-[2px] w-12 bg-primary" />
      <p className="section-label text-primary">05 — PROCESS</p>
    </div>
    <h2 className="font-heading text-5xl sm:text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter">
      HOW
      <br />
      <span className="text-muted-foreground/30">I WORK</span>
      <span className="text-primary">.</span>
    </h2>
    <p className="mt-8 max-w-sm leading-relaxed text-muted-foreground">
      A simple, repeatable loop that keeps projects honest — from the first question to the hundredth deploy.
    </p>
    <p className="mt-8 hidden items-center gap-3 font-mono text-xs tracking-[0.3em] text-muted-foreground lg:flex">
      KEEP SCROLLING <span className="inline-block animate-nudge text-primary">→</span>
    </p>
  </div>
);

/** Desktop: pinned section whose track slides horizontally as you scroll down. */
const HorizontalProcess = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const distanceRef = useRef(0);
  distanceRef.current = distance;
  const [activeStep, setActiveStep] = useState(0);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setDistance(Math.max(track.scrollWidth - window.innerWidth, 0));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  // Read through a ref: the transformer closure is created once
  const x = useTransform(scrollYProgress, (p) => -p * distanceRef.current);
  const velocity = useVelocity(scrollYProgress);
  const swing = useSpring(useTransform(velocity, [-0.6, 0, 0.6], [10, 0, -10]), { stiffness: 120, damping: 20 });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setActiveStep(Math.min(steps.length - 1, Math.floor(p * steps.length * 0.999)));
  });

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative border-t border-border bg-background"
      style={{ height: `calc(100vh + ${distance}px)` }}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_60%,transparent_100%)]" />

        <motion.div ref={trackRef} style={{ x }} className="relative flex w-max items-stretch gap-6 px-24 will-change-transform">
          <Intro />
          {steps.map((step) => (
            <StepCard key={step.id} step={step} swing={swing} />
          ))}
        </motion.div>

        {/* Step progress */}
        <div className="absolute bottom-10 left-24 right-24 flex items-center gap-6 font-mono text-xs tracking-widest">
          <span className="text-primary">{steps[activeStep].id}</span>
          <div className="relative h-px flex-1 bg-border">
            <motion.div className="absolute inset-0 origin-left bg-primary" style={{ scaleX: progress }} />
          </div>
          <span className="text-muted-foreground">{steps[activeStep].title}</span>
        </div>
      </div>
    </section>
  );
};

/** Mobile / tablet: a simple vertical stack with scroll reveals. */
const StackedProcess = () => (
  <section id="process" className="relative border-t border-border bg-background px-6 py-24 md:px-12 md:py-40">
    <Intro />
    <div className="mt-16 flex flex-col gap-6">
      {steps.map((step) => (
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease }}
        >
          <StepCard step={step} />
        </motion.div>
      ))}
    </div>
  </section>
);

const Process = () => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  return isDesktop ? <HorizontalProcess /> : <StackedProcess />;
};

export default Process;
