import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { Link } from "react-router-dom";
import Magnetic from "@/components/effects/Magnetic";
import ProjectIndex from "@/components/ProjectIndex";
import { allProjects, archiveYearRange, type ArchiveProject } from "@/data/archive";

const ease = [0.16, 1, 0.3, 1] as const;
const easeIn = [0.7, 0, 0.84, 0] as const;
const pad = (n: number) => String(n).padStart(2, "0");
const total = allProjects.length;
const clampIndex = (i: number) => Math.max(0, Math.min(total - 1, i));

/** Horizontal distance between card centres, as a fraction of the card width. */
const SPACING = 0.82;

const ProjectsPage = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const indexToggleRef = useRef<HTMLButtonElement>(null);

  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  indexRef.current = index;
  const [direction, setDirection] = useState(1);

  const [indexOpen, setIndexOpen] = useState(false);
  const indexOpenRef = useRef(false);
  indexOpenRef.current = indexOpen;

  // Continuous carousel position (0 … total-1). Cards derive their 3D transforms from it.
  const pos = useMotionValue(2.4);
  const [card, setCard] = useState({ w: 720, h: 446 });
  const cardRef = useRef(card);
  cardRef.current = card;
  const cardW = useMotionValue(720); // read by useTransform, which keeps its first closure

  // Whole stage leans gently toward the mouse
  const tiltX = useSpring(0, { stiffness: 120, damping: 20 });
  const tiltY = useSpring(0, { stiffness: 120, damping: 20 });

  const goTo = useCallback(
    (i: number) => {
      const next = clampIndex(i);
      setDirection(next >= indexRef.current ? 1 : -1);
      setIndex(next);
      animate(pos, next, { type: "spring", stiffness: 170, damping: 26, mass: 0.9 });
    },
    [pos],
  );

  // Entrance: the deck sweeps in from the right once the page curtain lifts
  useEffect(() => {
    const id = window.setTimeout(() => animate(pos, 0, { type: "spring", stiffness: 60, damping: 18 }), 350);
    return () => window.clearTimeout(id);
  }, [pos]);

  // Size cards to the stage
  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => {
      const mobile = window.innerWidth < 768;
      const ratio = mobile ? 0.75 : 0.62;
      const w = Math.min(stage.clientWidth * (mobile ? 0.8 : 0.52), (stage.clientHeight * 0.9) / ratio, 960);
      setCard({ w, h: w * ratio });
      cardW.set(w);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    return () => ro.disconnect();
  }, [cardW]);

  const closeIndex = useCallback(() => {
    setIndexOpen(false);
    window.setTimeout(() => indexToggleRef.current?.focus({ preventScroll: true }), 50);
  }, []);

  const selectFromIndex = useCallback(
    (i: number) => {
      closeIndex();
      window.setTimeout(() => goTo(i), 250);
    },
    [closeIndex, goTo],
  );

  // Keyboard: ←/→ ↑/↓, J/K, Home/End · I = index · Esc = close index
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, [contenteditable='true']")) return;

      if (e.key === "Escape" && indexOpenRef.current) {
        e.preventDefault();
        closeIndex();
        return;
      }
      if (e.key.toLowerCase() === "i" && !target?.closest("[role='dialog']:not(#project-index)")) {
        e.preventDefault();
        if (indexOpenRef.current) closeIndex();
        else setIndexOpen(true);
        return;
      }
      if (indexOpenRef.current || target?.closest("[role='dialog']")) return;

      const i = indexRef.current;
      const next: Record<string, number> = {
        ArrowRight: i + 1,
        ArrowDown: i + 1,
        PageDown: i + 1,
        j: i + 1,
        ArrowLeft: i - 1,
        ArrowUp: i - 1,
        PageUp: i - 1,
        k: i - 1,
        Home: 0,
        End: total - 1,
      };
      if (!(e.key in next)) return;
      e.preventDefault();
      goTo(next[e.key]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, closeIndex]);

  // Wheel / trackpad: one gesture = one step
  useEffect(() => {
    let acc = 0;
    let lockedUntil = 0;
    const onWheel = (e: WheelEvent) => {
      if (indexOpenRef.current || window.innerWidth < 768) return;
      e.preventDefault();
      const now = performance.now();
      if (now < lockedUntil) return;
      acc += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(acc) >= 40) {
        goTo(indexRef.current + Math.sign(acc));
        acc = 0;
        lockedUntil = now + 550;
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [goTo]);

  // Drag / swipe with inertia
  const drag = useRef({ active: false, pending: false, startX: 0, startPos: 0, lastX: 0, lastT: 0, v: 0, id: -1 });
  const suppressClick = useRef(false);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = {
      active: false,
      pending: true,
      startX: e.clientX,
      startPos: pos.get(),
      lastX: e.clientX,
      lastT: performance.now(),
      v: 0,
      id: e.pointerId,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const stage = stageRef.current;
    if (e.pointerType === "mouse" && stage) {
      const rect = stage.getBoundingClientRect();
      tiltY.set(((e.clientX - rect.left) / rect.width - 0.5) * 6);
      tiltX.set(-((e.clientY - rect.top) / rect.height - 0.5) * 4);
    }

    const d = drag.current;
    if (!d.pending) return;
    const dx = e.clientX - d.startX;
    if (!d.active && Math.abs(dx) > 6) {
      d.active = true;
      stage?.setPointerCapture(e.pointerId);
    }
    if (!d.active) return;

    const step = cardRef.current.w * SPACING;
    const next = d.startPos - dx / step;
    pos.set(Math.max(-0.35, Math.min(total - 1 + 0.35, next))); // soft rubber-band at the ends

    const now = performance.now();
    const dt = (now - d.lastT) / 1000;
    if (dt > 0) d.v = -((e.clientX - d.lastX) / step) / dt; // slides per second
    d.lastX = e.clientX;
    d.lastT = now;
  };

  const endDrag = (e: React.PointerEvent) => {
    const d = drag.current;
    if (d.active) {
      suppressClick.current = true;
      window.setTimeout(() => (suppressClick.current = false), 0);
      stageRef.current?.releasePointerCapture(e.pointerId);
      goTo(Math.round(pos.get() + d.v * 0.18));
    }
    d.active = false;
    d.pending = false;
  };

  const onCardClick = (i: number) => {
    if (suppressClick.current) return;
    if (i !== indexRef.current) {
      goTo(i);
      return;
    }
    const url = allProjects[i].liveUrl;
    if (url && url !== "#") window.open(url, "_blank", "noopener,noreferrer");
  };

  const project = allProjects[index];

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background text-foreground md:h-screen md:overflow-hidden selection:bg-primary selection:text-primary-foreground">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-[90] flex items-center justify-between px-6 py-6 md:px-12 md:py-8">
        <Link
          to="/"
          className="group flex items-center gap-2 font-mono text-xs uppercase tracking-widest transition-colors hover:text-primary"
        >
          <span className="text-primary transition-transform duration-300 group-hover:-translate-x-1">←</span>
          ABORT_SEQUENCE
        </Link>

        <div className="hidden items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground md:flex">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          SYSTEM_ARCHIVE // {pad(total)}_RECORDS · {archiveYearRange}
        </div>

        <button
          ref={indexToggleRef}
          type="button"
          onClick={() => (indexOpen ? closeIndex() : setIndexOpen(true))}
          aria-expanded={indexOpen}
          aria-controls="project-index"
          className="flex items-center gap-3 border border-foreground bg-background px-3 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors [@media(hover:hover)]:hover:bg-foreground [@media(hover:hover)]:hover:text-background"
        >
          <span aria-hidden className="grid h-3 w-3 grid-cols-2 gap-[2px]">
            {[0, 1, 2, 3].map((i) => (
              <motion.span
                key={i}
                className="block bg-current"
                animate={indexOpen ? { rotate: 45, scale: i % 3 === 0 ? 1 : 0 } : { rotate: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </span>
          {indexOpen ? "Close" : "Index"}
        </button>
      </header>

      {/* 3D carousel */}
      <div
        ref={stageRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Project archive"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={() => {
          tiltX.set(0);
          tiltY.set(0);
        }}
        className="relative mt-20 h-[72vw] max-h-[52vh] w-full shrink-0 touch-pan-y select-none md:mt-24 md:h-auto md:max-h-none md:min-h-0 md:flex-1 [perspective:1600px]"
      >
        {/* pointer-events-none: this plane sits at z=0 and would otherwise swallow clicks on the cards set back in Z */}
        <motion.div className="pointer-events-none absolute inset-0 [transform-style:preserve-3d]" style={{ rotateX: tiltX, rotateY: tiltY }}>
          {allProjects.map((p, i) => (
            <Card
              key={p.id}
              project={p}
              i={i}
              pos={pos}
              cardW={cardW}
              card={card}
              isActive={i === index}
              onClick={() => onCardClick(i)}
            />
          ))}
        </motion.div>
      </div>

      <p className="sr-only" aria-live="polite">
        Project {index + 1} of {total}: {project.title}
      </p>

      {/* Details for the focused project */}
      <div className="relative mx-auto grid w-full max-w-[1400px] shrink-0 grid-cols-1 gap-6 px-6 pt-8 md:grid-cols-12 md:gap-10 md:px-12 md:pt-6">
        <div className="md:col-span-7">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div key={project.id} custom={direction} initial="enter" animate="center" exit="exit">
              <motion.p
                variants={fade}
                custom={direction}
                className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-widest text-muted-foreground"
              >
                <span className="text-primary">{project.id}</span>
                <span className="h-px w-8 bg-border" />
                <span>{project.category}</span>
                <span className="text-muted-foreground/50">/ {project.year}</span>
              </motion.p>
              <h1 className="overflow-hidden pb-[0.08em] font-heading text-5xl font-black uppercase leading-[0.9] tracking-tighter sm:text-6xl lg:text-7xl xl:text-8xl">
                <motion.span className="block" variants={rise} custom={direction}>
                  {project.title}
                  <span className="text-primary">.</span>
                </motion.span>
              </h1>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="md:col-span-5 md:pt-6">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div key={project.id} custom={direction} initial="enter" animate="center" exit="exit">
              <motion.p variants={fade} custom={direction} className="max-w-md leading-relaxed text-muted-foreground">
                {project.desc}
              </motion.p>
              <motion.ul variants={fade} custom={direction} className="mt-4 flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <li key={t} className="border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {t}
                  </li>
                ))}
              </motion.ul>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex flex-wrap items-center gap-6">
            <Magnetic strength={0.25}>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-3 overflow-hidden bg-foreground px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-background"
              >
                <span className="absolute inset-0 -translate-x-full bg-primary transition-transform duration-500 ease-out group-hover:translate-x-0" />
                <span className="relative">Initialize App</span>
                <span className="relative transition-transform duration-300 group-hover:rotate-45">↗</span>
              </a>
            </Magnetic>
            <a
              href={project.githubUrl}
              className="group inline-flex items-center gap-2 border-b border-foreground pb-1 font-mono text-xs font-bold uppercase tracking-widest transition-colors hover:border-primary hover:text-primary"
            >
              Source Code <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
        </div>
      </div>

      {/* Progress ticks */}
      <div className="mx-auto flex w-full max-w-[1400px] shrink-0 items-center gap-4 px-6 pb-6 pt-8 font-mono text-xs md:px-12 md:pb-8">
        <span className="tabular-nums text-primary">{pad(index + 1)}</span>
        <div className="flex flex-1 gap-1.5">
          {allProjects.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to ${p.title}`}
              aria-current={i === index ? "true" : undefined}
              className="group relative h-6 flex-1"
            >
              <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-border transition-colors group-hover:bg-muted-foreground/60" />
              <motion.span
                className="absolute inset-x-0 top-1/2 -mt-px h-[2px] origin-left bg-primary"
                initial={false}
                animate={{ scaleX: i <= index ? 1 : 0 }}
                transition={{ duration: 0.5, ease }}
              />
            </button>
          ))}
        </div>
        <span className="tabular-nums text-muted-foreground">{pad(total)}</span>
        <span className="hidden text-[10px] uppercase tracking-[0.25em] text-muted-foreground lg:block">
          Drag · Scroll · ← → · [I] Index
        </span>
      </div>

      <AnimatePresence>
        {indexOpen && <ProjectIndex projects={allProjects} active={index} onSelect={selectFromIndex} />}
      </AnimatePresence>
    </div>
  );
};

// Text transitions follow the direction of travel
const rise: Variants = {
  enter: (d: number) => ({ y: d > 0 ? "105%" : "-105%" }),
  center: { y: "0%", transition: { duration: 0.6, ease } },
  exit: (d: number) => ({ y: d > 0 ? "-105%" : "105%", transition: { duration: 0.3, ease: easeIn } }),
};
const fade: Variants = {
  enter: (d: number) => ({ opacity: 0, x: d > 0 ? 24 : -24 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.5, ease, delay: 0.08 } },
  exit: (d: number) => ({ opacity: 0, x: d > 0 ? -24 : 24, transition: { duration: 0.25 } }),
};

interface CardProps {
  project: ArchiveProject;
  i: number;
  pos: MotionValue<number>;
  cardW: MotionValue<number>;
  card: { w: number; h: number };
  isActive: boolean;
  onClick: () => void;
}

/** One card of the coverflow. Everything is derived from its offset to the current position. */
const Card = ({ project, i, pos, cardW, card, isActive, onClick }: CardProps) => {
  const offset = useTransform(pos, (p) => i - p);
  const x = useTransform([offset, cardW], ([o, w]: number[]) => o * w * SPACING);
  const z = useTransform(offset, (o) => -Math.min(Math.abs(o), 3) * 220);
  const rotateY = useTransform(offset, (o) => Math.max(-1, Math.min(1, o)) * -32);
  const opacity = useTransform(offset, (o) => Math.max(0, Math.min(1, 2.7 - Math.abs(o))));
  const zIndex = useTransform(offset, (o) => 100 - Math.round(Math.abs(o) * 10));
  const shade = useTransform(offset, (o) => Math.min(Math.abs(o), 1) * 0.55);
  // Window effect: the picture slides inside its frame as the deck moves
  const imageX = useTransform(offset, (o) => `${Math.max(-1.5, Math.min(1.5, o)) * -9}%`);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      tabIndex={isActive ? 0 : -1}
      aria-label={isActive ? `${project.title} (current)` : `Show ${project.title}`}
      data-cursor={isActive ? "DRAG" : "VIEW"}
      className="group pointer-events-auto absolute left-1/2 top-1/2 overflow-hidden bg-muted outline-offset-4"
      style={{
        width: card.w,
        height: card.h,
        marginLeft: -card.w / 2,
        marginTop: -card.h / 2,
        x,
        z,
        rotateY,
        opacity,
        zIndex,
      }}
    >
      <motion.div className="absolute inset-y-0 -left-[12%] w-[124%]" style={{ x: imageX }}>
        <img
          src={project.image}
          alt={project.title}
          draggable={false}
          className={`h-full w-full object-cover transition-[filter,transform] duration-700 ease-out ${
            isActive ? "grayscale-0 group-hover:scale-[1.04]" : "grayscale"
          }`}
        />
      </motion.div>

      {/* Cards fade into the page as they move away from the centre */}
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-background" style={{ opacity: shade }} />

      <span className="absolute left-0 top-0 bg-foreground px-2.5 py-1.5 font-mono text-[10px] tracking-widest text-background">
        /{project.id}
      </span>
      <motion.span
        aria-hidden
        className="absolute bottom-0 left-0 h-1 w-full origin-left bg-primary"
        initial={false}
        animate={{ scaleX: isActive ? 1 : 0 }}
        transition={{ duration: 0.7, ease, delay: isActive ? 0.2 : 0 }}
      />
    </motion.button>
  );
};

export default ProjectsPage;
