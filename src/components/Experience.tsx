
import { motion, useInView, useScroll, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

const experiences = [
  {
    id: "01",
    role: "Full Stack Developer | Team Lead",
    company: "APPZETO TECHNOLOGIES",
    period: "NOV 2025 — PRESENT",
    description: "Contributed to 10+ live client projects including food delivery, quick commerce, taxi booking and on-demand platforms. Built secure REST APIs with JWT auth, integrated Razorpay, Google Maps and Firebase FCM, and deployed to production on a Linux VPS with Nginx, PM2 and SSL.",
    tags: ["MERN Stack", "Razorpay", "Docker", "Nginx", "VPS Deployment"]
  },
];

type Exp = (typeof experiences)[number];

interface ExperienceItemProps {
  exp: Exp;
  index: number;
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
  canHover: boolean;
}

const ExperienceItem = ({ exp, index, hoveredIndex, setHoveredIndex, canHover }: ExperienceItemProps) => {
  const isHovered = hoveredIndex === index;
  const isDimmed = hoveredIndex !== null && hoveredIndex !== index;
  const isCurrent = exp.period.includes("PRESENT");
  const toggle = () => setHoveredIndex(isHovered ? null : index);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
    <motion.div
      role="button"
      tabIndex={0}
      aria-expanded={isHovered}
      onMouseEnter={() => canHover && setHoveredIndex(index)}
      onMouseLeave={() => canHover && setHoveredIndex(null)}
      onClick={() => !canHover && toggle()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      }}
      animate={{ opacity: isDimmed ? 0.3 : 1 }}
      transition={{ duration: 0.3 }}
      className="relative border-t border-secondary-foreground/20 py-10 cursor-pointer group outline-none focus-visible:bg-secondary-foreground/[0.03]"
    >
      {/* Timeline node */}
      <span className="absolute hidden md:flex -left-16 top-12 w-3 h-3 -translate-x-1/2 items-center justify-center">
        {isCurrent && <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-60" />}
        <span
          className={`relative h-3 w-3 rounded-full border border-primary transition-colors duration-300 ${
            isCurrent || isHovered ? "bg-primary" : "bg-secondary"
          }`}
        />
      </span>

      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-6 relative z-10">

        {/* Left Column: Period & ID */}
        <div className="md:w-1/4 flex flex-col justify-between h-full">
          <span className="font-mono text-sm text-primary mb-2">/{exp.id}</span>
          <h4 className="font-heading font-bold text-lg md:text-xl text-secondary-foreground/60 group-hover:text-primary transition-colors duration-300">
            {exp.period}
          </h4>
          {isCurrent && (
            <span className="mt-3 inline-flex w-fit items-center gap-2 border border-primary/40 px-2 py-0.5 font-mono text-[10px] tracking-widest text-primary">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              CURRENT
            </span>
          )}
        </div>

        {/* Center/Right: Role & Company */}
        <div className="md:w-3/4">
          {/* Role Label - Slides up on hover */}
          <motion.div
            className="overflow-hidden mb-1"
          >
            <motion.p
              animate={{ y: isHovered ? 0 : 5, opacity: isHovered ? 1 : 0.7 }}
              className="text-sm font-bold tracking-widest uppercase text-primary"
            >
              {exp.role}
            </motion.p>
          </motion.div>

          {/* Company Name - Massive */}
          <div className="flex items-start justify-between gap-6">
            <h3 className="font-heading text-4xl sm:text-5xl md:text-7xl font-black text-secondary-foreground leading-none mb-6 transition-transform duration-500 ease-out origin-left group-hover:scale-[1.02]">
              {exp.company}
            </h3>
            <motion.span
              aria-hidden
              animate={{ rotate: isHovered ? 45 : 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="mt-2 shrink-0 font-heading text-3xl md:text-5xl font-light text-primary"
            >
              +
            </motion.span>
          </div>

          {/* Expandable Details Section */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: isHovered ? "auto" : 0,
              opacity: isHovered ? 1 : 0,
              marginTop: isHovered ? 24 : 0
            }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <p className="text-secondary-foreground/80 text-base leading-relaxed md:max-w-md">
                {exp.description}
              </p>

              {/* Simulated Tags/Skills */}
              <div className="flex flex-wrap content-start gap-2">
                {exp.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full border border-secondary-foreground/20 text-xs font-mono text-secondary-foreground/60">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Loading Bar on Hover */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-primary"
        initial={{ width: "0%" }}
        animate={{ width: isHovered ? "100%" : "0%" }}
        transition={{ duration: 0.6, ease: "circOut" }}
      />
    </motion.div>
    </motion.div>
  );
};

const Experience = () => {
  const ref = useRef(null);
  const listRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const canHover = useMediaQuery("(hover: hover)");

  // The timeline line draws itself as the list scrolls through the viewport
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 55%"] });
  const lineScale = useSpring(scrollYProgress, { stiffness: 100, damping: 25 });

  return (
    <section id="experience" ref={ref} className="py-24 md:py-40 bg-secondary text-secondary-foreground">
      <div className="px-6 md:px-12 lg:px-24">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-20 md:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="font-mono text-sm tracking-widest text-primary/80 font-semibold">06 — CAREER</p>
            <h2 className="font-heading text-4xl sm:text-5xl md:text-8xl font-black leading-[0.85]">
              WORK<br />HISTORY<span className="text-primary">.</span>
            </h2>
            <p className="md:hidden mt-6 font-mono text-xs tracking-widest text-secondary-foreground/50">
              TAP A ROLE TO EXPAND ↓
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="hidden md:block max-w-xs text-right text-sm text-secondary-foreground/60"
          >
            <p>A timeline of professional milestones and technical leadership.</p>
            <p className="mt-2 text-primary">↓ Hover a role to expand</p>
          </motion.div>
        </div>

        {/* Experience List */}
        <div ref={listRef} className="relative md:pl-16">
          <div aria-hidden className="absolute left-0 top-0 bottom-0 hidden w-px bg-secondary-foreground/10 md:block">
            <motion.div className="absolute inset-0 origin-top bg-primary" style={{ scaleY: lineScale }} />
          </div>

          <div className="flex flex-col">
            {experiences.map((exp, index) => (
              <ExperienceItem
                key={exp.company}
                exp={exp}
                index={index}
                hoveredIndex={hoveredIndex}
                setHoveredIndex={setHoveredIndex}
                canHover={canHover}
              />
            ))}
          </div>

          {/* Bottom Line */}
          <div className="w-full h-px bg-secondary-foreground/20" />
        </div>
      </div>
    </section>
  );
};

export default Experience;
