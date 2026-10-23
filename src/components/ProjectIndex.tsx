import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useVelocity } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import { archiveYearRange, type ArchiveProject } from "@/data/archive";

const ease = [0.16, 1, 0.3, 1] as const;

interface ProjectIndexProps {
  projects: ArchiveProject[];
  active: number;
  onSelect: (index: number) => void;
}

/** Full-screen editorial table of the archive with a cursor-following preview. */
const ProjectIndex = ({ projects, active, onSelect }: ProjectIndexProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");

  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const springX = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });
  const rotate = useTransform(useVelocity(springX), [-2500, 0, 2500], [-14, 0, 14], { clamp: true });

  useEffect(() => {
    dialogRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <motion.div
      ref={dialogRef}
      id="project-index"
      role="dialog"
      aria-modal="true"
      aria-label="Project index"
      tabIndex={-1}
      onPointerMove={(e) => {
        x.set(e.clientX);
        y.set(e.clientY);
      }}
      initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
      animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
      exit={{ clipPath: "inset(100% 0% 0% 0%)" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[80] overflow-y-auto overscroll-contain bg-background text-foreground outline-none"
    >
      <div className="px-6 pb-24 pt-32 md:px-12 lg:px-24">
        <div className="mb-12 flex flex-col justify-between gap-6 md:mb-16 md:flex-row md:items-end">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="section-label mb-3 text-primary"
            >
              ARCHIVE — INDEX VIEW
            </motion.p>
            <h2 className="overflow-hidden pb-[0.08em] font-heading text-6xl font-black leading-[0.85] tracking-tighter sm:text-7xl md:text-[9rem]">
              <motion.span
                className="inline-block"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.9, delay: 0.3, ease }}
              >
                ALL<span className="text-stroke">WORK</span>
                <span className="text-primary">.</span>
              </motion.span>
            </h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="font-mono text-xs uppercase tracking-widest text-muted-foreground"
          >
            {String(projects.length).padStart(2, "0")} PROJECTS · {archiveYearRange}
            <span className="ml-3 hidden text-foreground/40 md:inline">[ESC] CLOSE</span>
          </motion.p>
        </div>

        <div className="hidden grid-cols-12 gap-4 border-b-2 border-foreground pb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground md:grid">
          <span className="col-span-1">No.</span>
          <span className="col-span-5">Project</span>
          <span className="col-span-2">Category</span>
          <span className="col-span-3">Stack</span>
          <span className="col-span-1 text-right">Year</span>
        </div>

        <ul onMouseLeave={() => setHovered(null)}>
          {projects.map((project, i) => (
            <motion.li
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 + i * 0.05, ease }}
            >
              <button
                type="button"
                onClick={() => onSelect(i)}
                onMouseEnter={() => setHovered(i)}
                onFocus={() => setHovered(i)}
                aria-label={`Open ${project.title}`}
                className="group relative grid w-full grid-cols-12 items-center gap-4 overflow-hidden border-b border-border py-5 text-left md:py-7"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 origin-left scale-x-0 bg-primary transition-transform duration-500 ease-in-out-expo group-hover:scale-x-100 group-focus-visible:scale-x-100"
                />
                <span className="relative col-span-2 font-mono text-xs text-primary transition-colors group-hover:text-primary-foreground md:col-span-1">
                  {project.id}
                  {active === i && <span className="ml-2 inline-block h-1.5 w-1.5 bg-current align-middle" title="Current" />}
                </span>
                <span className="relative col-span-10 md:col-span-5">
                  <span className="block font-heading text-3xl font-black uppercase leading-none tracking-tight transition-all duration-500 ease-out group-hover:translate-x-3 group-hover:text-primary-foreground md:text-5xl">
                    {project.title}
                  </span>
                  <span className="mt-2 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-primary-foreground/80 md:hidden">
                    {project.category} · {project.year}
                  </span>
                </span>
                <span className="relative col-span-2 hidden font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-primary-foreground md:block">
                  {project.category}
                </span>
                <span className="relative col-span-3 hidden font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-primary-foreground/80 md:block">
                  {project.tech.join(" · ")}
                </span>
                <span className="relative col-span-1 hidden text-right font-mono text-xs tabular-nums transition-colors group-hover:text-primary-foreground md:block">
                  {project.year}
                </span>
              </button>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Preview that chases the cursor and leans into the motion */}
      {finePointer && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-[85] h-[230px] w-[320px] overflow-hidden border border-foreground bg-secondary shadow-[10px_10px_0_0_hsl(var(--primary))]"
          style={{ x: springX, y: springY, rotate, translateX: "-50%", translateY: "-50%" }}
          animate={{ scale: hovered !== null ? 1 : 0, opacity: hovered !== null ? 1 : 0 }}
          transition={{ duration: 0.35, ease }}
        >
          {projects.map((project, i) => (
            <motion.img
              key={project.id}
              src={project.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              style={{ zIndex: hovered === i ? 2 : 1 }}
              initial={false}
              animate={{ clipPath: hovered === i ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)", scale: hovered === i ? 1 : 1.2 }}
              transition={{ duration: 0.6, ease }}
            />
          ))}
          {hovered !== null && (
            <span className="absolute bottom-2 left-2 bg-primary px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-primary-foreground">
              {projects[hovered].category}
            </span>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProjectIndex;
