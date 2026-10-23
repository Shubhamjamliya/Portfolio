
// import { motion } from "framer-motion";
// import { useState } from "react";
// import project1 from "@/assets/project-1.jpg";
// import project2 from "@/assets/project-2.jpg";
// import project3 from "@/assets/project-3.jpg";
// import { ArrowUpRight } from "lucide-react"; // Optional icon

// const projects = [
//   {
//     id: "01",
//     title: "NEXUS ANALYTICS",
//     category: "Dashboard",
//     description: "Real-time analytics platform handling 10M+ requests with D3.js visualizations.",
//     tech: ["React", "Node.js", "D3.js"],
//     image: project1,
//   },
//   {
//     id: "02",
//     title: "NOIR COMMERCE",
//     category: "E-Commerce",
//     description: "Headless architecture with custom inventory management and Stripe integration.",
//     tech: ["Next.js", "AWS", "Stripe"],
//     image: project2,
//   },
//   {
//     id: "03",
//     title: "PULSE SOCIAL",
//     category: "Social App",
//     description: "AI-powered recommendation engine connecting creative professionals.",
//     tech: ["React Native", "Firebase", "AI"],
//     image: project3,
//   },
//   {
//     id: "04", // Added a 4th dummy project to make the layout look balanced
//     title: "AURA UI",
//     category: "Design System",
//     description: "Open-source component library used by 500+ developers.",
//     tech: ["TypeScript", "Storybook", "NPM"],
//     image: project1, // Reusing image for demo
//   },
// ];

// const Projects = () => {
//   const [active, setActive] = useState(0);

//   return (
//     <section id="work" className="py-24 bg-background">
//       <div className="container mx-auto px-4 md:px-8">

//         {/* Header */}
//         <div className="mb-12 flex items-end justify-between">
//           <div>
//             <p className="section-label mb-2 text-primary font-semibold">02 — PROJECTS</p>
//             <h2 className="font-heading text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter text-foreground">
//               SELECTED<span className="text-muted-foreground/30">WORK</span>
//             </h2>
//           </div>
//           <p className="hidden md:block text-muted-foreground text-sm font-mono">

//           </p>
//         </div>

//         {/* The Accordion Container */}
//         <div className="flex flex-col md:flex-row h-[80vh] min-h-[500px] w-full gap-2">
//           {projects.map((project, index) => (
//             <ProjectPanel
//               key={project.id}
//               project={project}
//               index={index}
//               active={active}
//               setActive={setActive}
//             />
//           ))}
//         </div>

//       </div>
//     </section>
//   );
// };

// const ProjectPanel = ({ project, index, active, setActive }) => {
//   const isActive = active === index;

//   return (
//     <motion.div
//       layout
//       onClick={() => setActive(index)}
//       onMouseEnter={() => setActive(index)}
//       initial={{ flex: 1 }}
//       animate={{ flex: isActive ? 3.5 : 1 }}
//       transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }} // "Ease-out-expo" feel
//       className={`
//                 relative cursor-pointer overflow-hidden rounded-2xl border border-border/50
//                 ${isActive ? "grayscale-0" : "grayscale hover:grayscale-0"}
//                 transition-all duration-500
//             `}
//     >
//       {/* Background Image */}
//       <div className="absolute inset-0 z-0">
//         <img
//           src={project.image}
//           alt={project.title}
//           className={`
//                         w-full h-full object-cover transition-transform duration-700
//                         ${isActive ? "scale-100" : "scale-150 opacity-40"}
//                     `}
//         />
//         {/* Gradient Overlay for Text Readability */}
//         <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-60"}`} />
//       </div>

//       {/* Content Container */}
//       <div className="relative z-10 h-full p-6 md:p-10 flex flex-col justify-between">

//         {/* Top: ID Number */}
//         <div className="flex justify-between items-start">
//           <span className={`
//                         font-mono text-xl font-bold transition-colors duration-300
//                         ${isActive ? "text-primary" : "text-white/50"}
//                     `}>
//             /{project.id}
//           </span>

//           {/* View Button (Only visible when active) */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0 }}
//             animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0 }}
//             className="w-10 h-10 bg-white rounded-full flex items-center justify-center"
//           >
//             <span className="text-black text-xl">↗</span>
//           </motion.div>
//         </div>

//         {/* Bottom: Title & Details */}
//         <div>
//           {/* The Title (Rotates on Desktop when inactive) */}
//           <h3 className={`
//                         font-heading font-black text-white uppercase leading-none transition-all duration-300
//                         ${isActive ? "text-4xl md:text-6xl mb-4" : "text-2xl md:text-3xl opacity-70"}
//                         ${!isActive && "md:hidden"} 
//                     `}>
//             {project.title}
//           </h3>

//           {/* Desktop Vertical Text for Inactive State */}
//           {!isActive && (
//             <h3 className="hidden md:block absolute bottom-10 left-1/2 -translate-x-1/2 font-heading font-black text-white/50 text-4xl uppercase whitespace-nowrap [writing-mode:vertical-rl] rotate-180">
//               {project.title}
//             </h3>
//           )}

//           {/* Description Details (Reveals only when Active) */}
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: isActive ? 1 : 0, height: isActive ? "auto" : 0 }}
//             className="overflow-hidden"
//           >
//             <p className="text-white/80 text-sm md:text-lg mb-6 max-w-md leading-relaxed">
//               {project.description}
//             </p>

//             <div className="flex flex-wrap gap-2">
//               {project.tech.map((t) => (
//                 <span key={t} className="px-3 py-1 bg-white/10 backdrop-blur border border-white/20 text-white text-xs font-mono rounded-full">
//                   {t}
//                 </span>
//               ))}
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default Projects;

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import project1 from "@/assets/project-switcheats.jpg";
import project2 from "@/assets/project-homster.jpg";
import project3 from "@/assets/project-bhookingo.jpg";
import Magnetic from "@/components/effects/Magnetic";
import { useMediaQuery } from "@/hooks/use-media-query";

const ease = [0.16, 1, 0.3, 1] as const;

const projects = [
  {
    id: "01",
    title: "SWITCHEATS",
    category: "Food Delivery Platform",
    description: "Production-grade food delivery platform serving 6,000+ users, 80+ restaurants and 50+ delivery partners, with Customer, Restaurant, Delivery and Admin apps.",
    tech: ["MERN", "Socket.io", "Razorpay", "Google Maps"],
    image: project1,
  },
  {
    id: "02",
    title: "HOMSTER",
    category: "Home Services App",
    description: "Home services marketplace for plumbing, electrical, repair and installation, with live booking updates, provider tracking and dynamic billing.",
    tech: ["MERN", "Socket.io", "Maps API", "Billing"],
    image: project2,
  },
  {
    id: "03",
    title: "BHOOKINGO",
    category: "Highway Food Delivery",
    description: "Food delivery app for highway travellers. As you drive, it shows restaurants along the road ahead on your route.",
    tech: ["MERN", "Maps API", "Live Location"],
    image: project3,
  },
];

type Project = (typeof projects)[number];

const Projects = () => {
  const [active, setActive] = useState(0);
  const headerRef = useRef(null);
  const inView = useInView(headerRef, { once: true, margin: "-10%" });

  return (
    <section id="work" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">

        {/* Header */}
        <div ref={headerRef} className="mb-12 flex items-end justify-between">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              className="section-label mb-2 text-primary font-semibold"
            >
              03 — PROJECTS
            </motion.p>
            <h2 className="font-heading text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter text-foreground overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <motion.span
                className="inline-block"
                initial={{ y: "110%" }}
                animate={inView ? { y: "0%" } : {}}
                transition={{ duration: 0.9, ease }}
              >
                SELECTED<span className="text-muted-foreground/30">WORK</span>
              </motion.span>
            </h2>
          </div>

          {/* Optional Header Link (Hidden on mobile) */}
          <Link
            to="/projects"
            className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-mono text-sm uppercase tracking-widest pb-4 group"
          >
            Explore Archive
            <span className="text-lg leading-none transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">↗</span>
          </Link>
        </div>

        {/* The Accordion Container */}
        <div className="flex flex-col md:flex-row h-[80vh] min-h-[500px] w-full gap-2">
          {projects.map((project, index) => (
            <ProjectPanel
              key={project.id}
              project={project}
              index={index}
              active={active}
              setActive={setActive}
            />
          ))}
        </div>

        {/* Progress rail */}
        <div className="mt-6 flex items-center gap-4 font-mono text-xs tracking-widest text-muted-foreground">
          <span className="text-primary tabular-nums">{projects[active].id}</span>
          <div className="flex flex-1 gap-1">
            {projects.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show ${p.title}`}
                className="group relative h-4 flex-1"
              >
                <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-border transition-colors group-hover:bg-muted-foreground/40" />
                <motion.span
                  className="absolute inset-x-0 top-1/2 h-[3px] -mt-[1.5px] origin-left bg-primary"
                  initial={false}
                  animate={{ scaleX: i === active ? 1 : 0 }}
                  transition={{ duration: 0.6, ease }}
                />
              </button>
            ))}
          </div>
          <span className="tabular-nums">0{projects.length}</span>
        </div>

        {/* Bottom CTA Button */}
        <div className="mt-16 flex justify-center">
          <Magnetic strength={0.25}>
            <Link
              to="/projects"
              className="group relative inline-flex items-center gap-4 px-8 py-4 bg-foreground text-background overflow-hidden rounded-sm"
            >
              {/* Background Hover Effect */}
              <span className="absolute inset-0 w-full h-full bg-primary -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />

              <span className="relative z-10 font-heading text-xl md:text-2xl font-black uppercase tracking-wider group-hover:text-primary-foreground transition-colors duration-300">
                View Full Archive
              </span>

              <span className="relative z-10 text-2xl group-hover:translate-x-2 group-hover:text-primary-foreground transition-all duration-300">
                →
              </span>
            </Link>
          </Magnetic>
        </div>

      </div>
    </section>
  );
};

interface ProjectPanelProps {
  project: Project;
  index: number;
  active: number;
  setActive: (index: number) => void;
}

const ProjectPanel = ({ project, index, active, setActive }: ProjectPanelProps) => {
  const isActive = active === index;
  const navigate = useNavigate();
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");

  // Desktop: hover opens a panel, clicking the open one goes to the archive.
  // Touch: tap opens a panel (the ↗ button links to the archive).
  const activate = () => {
    if (isActive && canHover) navigate("/projects");
    else setActive(index);
  };

  // Subtle depth: the image drifts against the pointer while the panel is open
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const imgX = useSpring(mx, { stiffness: 120, damping: 20 });
  const imgY = useSpring(my, { stiffness: 120, damping: 20 });

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !isActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - rect.left) / rect.width - 0.5) * -30);
    my.set(((e.clientY - rect.top) / rect.height - 0.5) * -30);
  };

  const onPointerLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      layout
      role="button"
      tabIndex={0}
      aria-expanded={isActive}
      aria-label={`${project.title} — ${project.category}`}
      data-cursor={isActive && canHover ? "VIEW" : undefined}
      onClick={activate}
      onMouseEnter={() => setActive(index)}
      onFocus={() => setActive(index)}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (isActive) navigate("/projects");
          else setActive(index);
        }
      }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      initial={{ flex: 1 }}
      animate={{ flex: isActive ? 3.5 : 1 }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      className={`
                relative cursor-pointer overflow-hidden rounded-2xl border border-border/50
                ${isActive ? "grayscale-0" : "grayscale hover:grayscale-0"}
                transition-all duration-500
            `}
    >
      {/* Background Image */}
      <motion.div className="absolute -inset-6 z-0" style={{ x: imgX, y: imgY }}>
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          className={`
                        w-full h-full object-cover transition-transform duration-700
                        ${isActive ? "scale-100" : "scale-150 opacity-40"}
                    `}
        />
        {/* Gradient Overlay for Text Readability */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-60"}`} />
      </motion.div>

      {/* Content Container */}
      <div className="relative z-10 h-full p-6 md:p-10 flex flex-col justify-between">

        {/* Top: ID Number */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <span className={`
                          font-mono text-xl font-bold transition-colors duration-300
                          ${isActive ? "text-primary" : "text-white/50"}
                      `}>
              /{project.id}
            </span>
            <motion.span
              initial={false}
              animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -10 }}
              className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/60"
            >
              {project.category}
            </motion.span>
          </div>

          {/* View Button (Only visible when active) → opens the archive */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <Link
              to="/projects"
              tabIndex={isActive ? 0 : -1}
              aria-label={`Open ${project.title} in the archive`}
              onClick={(e) => e.stopPropagation()}
              className="group/btn w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-primary transition-colors duration-300"
            >
              <span className="text-black text-xl transition-transform duration-300 group-hover/btn:rotate-45 group-hover/btn:text-white">↗</span>
            </Link>
          </motion.div>
        </div>

        {/* Bottom: Title & Details */}
        <div>
          {/* The Title (Rotates on Desktop when inactive) */}
          <h3 className={`
                        font-heading font-black text-white uppercase leading-none transition-all duration-300
                        ${isActive ? "text-4xl md:text-6xl mb-4" : "text-2xl md:text-3xl opacity-70"}
                        ${!isActive && "md:hidden"}
                    `}>
            {project.title}
          </h3>

          {/* Desktop Vertical Text for Inactive State */}
          {!isActive && (
            <h3 className="hidden md:block absolute bottom-10 left-1/2 -translate-x-1/2 font-heading font-black text-white/50 text-4xl uppercase whitespace-nowrap [writing-mode:vertical-rl] rotate-180">
              {project.title}
            </h3>
          )}

          {/* Description Details (Reveals only when Active) */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: isActive ? 1 : 0, height: isActive ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <p className="text-white/80 text-sm md:text-lg mb-6 max-w-md leading-relaxed">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {project.tech.map((t, i) => (
                <motion.span
                  key={t}
                  initial={false}
                  animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 10 }}
                  transition={{ delay: isActive ? 0.25 + i * 0.06 : 0, duration: 0.4 }}
                  className="px-3 py-1 bg-white/10 backdrop-blur border border-white/20 text-white text-xs font-mono rounded-full"
                >
                  {t}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Projects;
