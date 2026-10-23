
import { motion, useScroll, useTransform, useSpring, useMotionValue, useVelocity, useAnimationFrame } from "framer-motion";
import { wrap } from "@motionone/utils";
import { useMemo, useRef, useState } from "react";
import SkillSphere from "@/components/SkillSphere";

const skillData = [
  { category: "FRONTEND", items: ["React", "Three.js", "Tailwind", "Framer Motion", "Next.js", "TypeScript"] },
  { category: "BACKEND", items: ["Node.js", "PostgreSQL", "Redis", "GraphQL", "Python", "Django"] },
  { category: "DEVOPS", items: ["Docker", "AWS", "CI/CD", "Terraform", "Kubernetes", "Vercel"] },
  { category: "DESIGN", items: ["Figma", "Blender", "Adobe CC", "UI/UX", "Prototyping", "Wireframing"] }
];

const Skills = () => {
  const [hovered, setHovered] = useState<string | null>(null);
  const [locked, setLocked] = useState<string | null>(null);
  const highlight = hovered ?? locked;
  const sphereItems = useMemo(
    () => skillData.flatMap((row) => row.items.map((label) => ({ label, category: row.category }))),
    [],
  );

  return (
    <section id="skills" className="relative py-32 bg-background overflow-hidden border-t border-border">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="container px-6 md:px-12 mx-auto mb-20 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {/* <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span> */}
              <p className="font-mono text-sm tracking-widest text-primary/80 font-semibold">04 — SKILLS</p>
            </div>
            <h2 className="font-heading text-6xl md:text-9xl font-black tracking-tighter text-foreground">
              LIVE<span className="text-muted-foreground/30">STACK</span>
            </h2>
          </div>
          <p className="font-mono text-xs md:text-sm text-muted-foreground max-w-md leading-relaxed uppercase">
            The tools I reach for daily. Scroll faster — the streams keep up.
          </p>
        </div>
      </div>

      <div className="flex flex-col border-y border-border bg-background/50 backdrop-blur-sm">
        {skillData.map((row, index) => (
          <SkillStream
            key={row.category}
            category={row.category}
            skills={row.items}
            baseVelocity={index % 2 === 0 ? -1.5 : 1.5}
            index={index}
          />
        ))}
      </div>

      {/* Skill Orbit: draggable 3D sphere + discipline filter */}
      <div className="container px-6 md:px-12 mx-auto mt-24 md:mt-32 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <div className="lg:col-span-5">
          <p className="font-mono text-sm tracking-widest text-primary/80 font-semibold">SKILL ORBIT</p>
          <h3 className="font-heading text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] mt-3">
            EVERYTHING
            <br />
            <span className="text-muted-foreground/30">IN ORBIT</span>
          </h3>
          <p className="text-muted-foreground mt-6 max-w-sm leading-relaxed">
            Drag the sphere to spin it. Pick a discipline to light up its tools.
          </p>

          <div className="mt-10 border-t border-border" onMouseLeave={() => setHovered(null)}>
            {skillData.map((row, i) => {
              const active = highlight === row.category;
              return (
                <button
                  key={row.category}
                  type="button"
                  aria-pressed={locked === row.category}
                  onMouseEnter={() => setHovered(row.category)}
                  onFocus={() => setHovered(row.category)}
                  onBlur={() => setHovered(null)}
                  onClick={() => setLocked((l) => (l === row.category ? null : row.category))}
                  className="group relative flex w-full items-center justify-between overflow-hidden border-b border-border py-4 text-left"
                >
                  <span
                    aria-hidden
                    className={`absolute inset-0 origin-left bg-primary transition-transform duration-500 ease-in-out-expo ${active ? "scale-x-100" : "scale-x-0"}`}
                  />
                  <span
                    className={`relative flex items-baseline gap-4 ${active ? "text-primary-foreground pl-4" : "pl-0"}`}
                    style={{ transition: "padding 0.4s cubic-bezier(0.16,1,0.3,1), color 0.3s" }}
                  >
                    <span className="font-mono text-xs opacity-60">0{i + 1}</span>
                    <span className="font-heading text-xl md:text-2xl font-bold tracking-tight">{row.category}</span>
                  </span>
                  <span className={`relative pr-4 font-mono text-xs transition-colors duration-300 ${active ? "text-primary-foreground" : "text-muted-foreground"}`}>
                    {String(row.items.length).padStart(2, "0")} TOOLS
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-7 flex justify-center">
          <SkillSphere items={sphereItems} highlight={highlight} className="max-w-[560px]" />
        </div>
      </div>
    </section>
  );
};

const SkillStream = ({ category, skills, baseVelocity = 100, index }) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });

  // Adjusted wrap range to ensure seamless looping without gaps
  const x = useTransform(baseX, (v) => `${wrap(-0, -50, v)}%`);

  const directionFactor = useRef(1);

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="relative flex overflow-hidden border-b border-border last:border-b-0">
      {/* Label Overlay (Vertical Text) */}
      <div className="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-background z-20 border-r border-border flex items-center justify-center">
        <span className="font-mono text-[10px] md:text-xs font-bold tracking-widest -rotate-90 text-muted-foreground whitespace-nowrap">
           {category}
        </span>
      </div>

      {/* The Moving Stream */}
      <motion.div
        className="flex whitespace-nowrap pl-20"
        style={{ x }}
      >
        {/* Repeat enough times to fill large screens */}
        {[...Array(6)].map((_, loopI) => (
          <div key={loopI} className="flex">
            {skills.map((skill, i) => (
              <div
                key={`${skill}-${i}`}
                className="group relative flex items-center gap-4 px-6 md:px-10 py-6 md:py-8 border-r border-border/50 hover:bg-primary hover:text-primary-foreground transition-colors duration-300 cursor-crosshair"
              >
                {/* Technical decorative markers */}
                <span className="absolute top-2 left-2 text-[8px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                  +
                </span>
                <span className="absolute bottom-2 right-2 text-[8px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                  +
                </span>

                <span className="font-mono text-xs opacity-40 group-hover:opacity-80 transition-opacity">
                  {`<`}
                </span>
                <span className="font-heading text-2xl md:text-4xl font-bold uppercase tracking-tight">
                  {skill}
                </span>
                <span className="font-mono text-xs opacity-40 group-hover:opacity-80 transition-opacity">
                  {`/>`}
                </span>
              </div>
            ))}
          </div>
        ))}
      </motion.div>

      {/* Gradient Mask for right edge */}
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
    </div>
  );
};

export default Skills;