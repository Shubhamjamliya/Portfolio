
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import profileImage from "@/assets/profile-shubham.jpg";
import TiltCard from "@/components/effects/TiltCard";
import CountUp from "@/components/effects/CountUp";

const ease = [0.16, 1, 0.3, 1] as const;

const headingLines = [
  <>I TURN COMPLEX</>,
  <span className="text-muted-foreground/30">PROBLEMS INTO</span>,
  <>
    SIMPLE <span className="text-primary underline decoration-4 underline-offset-8">SOLUTIONS</span>.
  </>,
];

const About = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10%" });

  // Parallax effect for image
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <section id="about" ref={containerRef} className="py-24 md:py-40 px-6 md:px-12 lg:px-24 bg-background overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">

        {/* LEFT: Image Area */}
        <div className="lg:col-span-5 relative group">
          {/* Decorative "Frame" lines - Static and Clean */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.5, ease: "circOut" }}
            className="absolute -top-6 -left-6 w-2/3 h-px bg-primary z-10 origin-left"
          />
          <motion.div
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 1, delay: 0.5, ease: "circOut" }}
            className="absolute -top-6 -left-6 h-2/3 w-px bg-primary z-10 origin-top"
          />

          <motion.div style={{ y }} className="relative z-0">
            <TiltCard max={7} data-cursor="HELLO">
              {/* Image Mask/Reveal Animation */}
              <div className="relative overflow-hidden aspect-[3/4] bg-muted">
                <motion.div
                  initial={{ height: "100%" }}
                  animate={isInView ? { height: "0%" } : {}}
                  transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
                  className="absolute inset-0 bg-secondary z-20"
                />
                <motion.img
                  src={profileImage}
                  alt="Shubham Jamliya portrait"
                  loading="lazy"
                  initial={{ scale: 1.25 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 1.6, ease, delay: 0.2 }}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-[filter] duration-700"
                />

                {/* Viewfinder corners */}
                {["top-4 left-4 border-t border-l", "top-4 right-4 border-t border-r", "bottom-4 left-4 border-b border-l", "bottom-4 right-4 border-b border-r"].map((pos) => (
                  <span key={pos} className={`absolute ${pos} z-10 h-5 w-5 border-white/70 pointer-events-none`} />
                ))}
                <span className="absolute left-4 bottom-10 z-10 font-mono text-[10px] tracking-[0.25em] text-white/70 pointer-events-none">
                  SJ — IND / 2026
                </span>
              </div>
            </TiltCard>

            {/* Corner block with a rotating badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="absolute -bottom-6 -right-6 bg-primary border border-border p-4 z-30 hidden md:block shadow-xl"
            >
              <div className="relative w-28 h-28">
                <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow" aria-hidden>
                  <defs>
                    <path id="about-badge-circle" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
                  </defs>
                  <text className="fill-primary-foreground font-mono uppercase" style={{ fontSize: 9.5, letterSpacing: "0.2em" }}>
                    <textPath href="#about-badge-circle">OPEN TO WORK • FULLSTACK DEV • </textPath>
                  </text>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center font-heading text-2xl font-black text-primary-foreground">
                  SJ
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* RIGHT: Content Area */}
        <div className="lg:col-span-7 flex flex-col justify-center pt-8 lg:pt-0">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            className="flex items-center gap-4 mb-8"
          >
            <motion.span
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, ease }}
              className="w-12 h-[2px] bg-primary origin-left"
            />
            <p className="section-label text-primary">01 — ABOUT ME</p>
          </motion.div>

          <h2 className="font-heading text-4xl sm:text-5xl md:text-7xl font-black leading-[0.9] mb-8">
            {headingLines.map((line, i) => (
              <span key={i} className="block overflow-hidden pb-[0.18em] -mb-[0.18em]">
                <motion.span
                  className="block"
                  initial={{ y: "110%" }}
                  animate={isInView ? { y: "0%" } : {}}
                  transition={{ duration: 0.9, delay: 0.3 + i * 0.12, ease }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h2>

          {/* Kinetic Typography Strip */}
          <div className="w-full overflow-hidden border-y border-border py-3 mb-10 opacity-70 ">
            <div className="animate-marquee whitespace-nowrap flex gap-8">
              {[...Array(6)].map((_, i) => (
                <span key={i} className="text-sm font-mono tracking-widest uppercase text-muted-foreground">
                  FULLSTACK • CREATIVITY • ARCHITECTURE •
                </span>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col md:flex-row gap-8">
                <p className="text-muted-foreground leading-relaxed text-lg md:w-1/2">
                  I'm a fullstack developer with a passion for building dynamic, user-centric web applications.
                  I specialize in <strong className="text-foreground">React, Node.js, and the MERN stack</strong>.
                </p>
                <p className="text-muted-foreground leading-relaxed text-lg md:w-1/2">
                  With a strong technical foundation and a portfolio of practical projects, I bring a design-minded approach to engineering.
                  I am constantly learning to write code that is clean, efficient, and purposeful.
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border mt-8">
              {[
                { number: "10+", label: "PROJECTS" }, // Count small experiments, clones, & major projects
                { number: "200+", label: "DSA LEETCODE" }, // Shows dedication
                { number: "100+", label: "COMMITS" }, // GitHub activity is a great metric for freshers
                { number: "24/7", label: "LEARNING" }, // Emphasizes growth mindset
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 + (index * 0.1) }}
                  className="group/stat relative overflow-hidden bg-background p-6"
                >
                  <span className="absolute inset-0 origin-bottom scale-y-0 bg-secondary transition-transform duration-500 ease-in-out-expo group-hover/stat:scale-y-100" />
                  <p className="relative font-heading text-3xl md:text-4xl font-black text-foreground transition-colors duration-300 group-hover/stat:text-primary">
                    <CountUp value={stat.number} />
                  </p>
                  <p className="relative text-xs font-mono text-muted-foreground mt-2 tracking-widest transition-colors duration-300 group-hover/stat:text-secondary-foreground/70">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Education */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1 }}
              className="border border-border p-6 flex flex-col md:flex-row md:items-start justify-between gap-4"
            >
              <div>
                <p className="section-label text-primary mb-2">EDUCATION</p>
                <h3 className="font-heading text-xl md:text-2xl font-black leading-tight">
                  Bachelor of Technology — Computer Science Engineering
                </h3>
                <p className="mt-1 text-muted-foreground">
                  Institute of Engineering Science, IPS Academy, Indore, M.P.
                </p>
              </div>
              <div className="font-mono text-xs tracking-widest text-muted-foreground md:text-right shrink-0">
                <p>JULY 2021 — MAY 2025</p>
                <p className="mt-1 text-primary">CGPA 8.50 / 10</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
