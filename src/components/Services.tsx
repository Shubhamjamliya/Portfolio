import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Box, BrainCircuit, CodeXml, Server, type LucideIcon } from "lucide-react";
import TiltCard from "@/components/effects/TiltCard";

const ease = [0.16, 1, 0.3, 1] as const;

interface Service {
  id: string;
  title: [string, string];
  icon: LucideIcon;
  description: string;
  tags: string[];
}

const services: Service[] = [
  {
    id: "01",
    title: ["FRONTEND", "ENGINEERING"],
    icon: CodeXml,
    description:
      "Pixel-precise, accessible interfaces in React & Next.js — built to feel fast and look sharp on every screen.",
    tags: ["React", "TypeScript", "Tailwind", "Framer Motion"],
  },
  {
    id: "02",
    title: ["BACKEND", "& APIS"],
    icon: Server,
    description:
      "REST & GraphQL services on Node.js with clean data models, auth and the boring reliability that lets products scale.",
    tags: ["Node.js", "Express", "MongoDB", "PostgreSQL"],
  },
  {
    id: "03",
    title: ["CREATIVE", "& 3D WEB"],
    icon: Box,
    description:
      "Motion-driven, interactive experiences with Three.js and WebGL that turn a landing page into a moment.",
    tags: ["Three.js", "WebGL", "Blender", "Figma"],
  },
  {
    id: "04",
    title: ["MACHINE", "LEARNING"],
    icon: BrainCircuit,
    description:
      "Predictive models and data pipelines in Python, integrated into real products — not left in notebooks.",
    tags: ["Python", "Data Analysis", "ML Models"],
  },
];

const ServiceCard = ({ service, index, inView }: { service: Service; index: number; inView: boolean }) => {
  const Icon = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay: 0.15 + index * 0.1, ease }}
      className="h-full"
    >
      <TiltCard
        max={9}
        wrapperClassName="h-full"
        className="flex h-full min-h-[380px] md:min-h-[440px] flex-col border border-border bg-background p-8 md:p-10 xl:p-8 2xl:p-10 transition-shadow duration-500 hover:shadow-[10px_10px_0_0_hsl(var(--foreground))]"
      >
        {/* Red fill wipes up on hover */}
        <span
          aria-hidden
          className="absolute inset-0 origin-bottom scale-y-0 bg-primary transition-transform duration-500 ease-in-out-expo group-hover:scale-y-100"
        />

        <div className="relative z-10 flex items-start justify-between" style={{ transform: "translateZ(30px)" }}>
          <span className="font-mono text-sm text-primary transition-colors duration-300 group-hover:text-primary-foreground">
            /{service.id}
          </span>
          <Icon
            strokeWidth={1.25}
            className="h-9 w-9 text-foreground transition-all duration-500 group-hover:rotate-[360deg] group-hover:text-primary-foreground"
          />
        </div>

        <h3
          className="relative z-10 mt-auto pt-16 font-heading text-3xl md:text-4xl xl:text-[1.85rem] 2xl:text-4xl font-black uppercase leading-[0.9] tracking-tight transition-colors duration-300 group-hover:text-primary-foreground"
          style={{ transform: "translateZ(50px)" }}
        >
          {service.title[0]}
          <br />
          <span className="text-muted-foreground/40 transition-colors duration-300 group-hover:text-primary-foreground/60">
            {service.title[1]}
          </span>
        </h3>

        <p
          className="relative z-10 mt-5 text-sm leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-primary-foreground/85"
          style={{ transform: "translateZ(35px)" }}
        >
          {service.description}
        </p>

        <ul className="relative z-10 mt-6 flex flex-wrap gap-2" style={{ transform: "translateZ(25px)" }}>
          {service.tags.map((tag) => (
            <li
              key={tag}
              className="border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors duration-300 group-hover:border-primary-foreground/40 group-hover:text-primary-foreground"
            >
              {tag}
            </li>
          ))}
        </ul>

        <ArrowUpRight
          aria-hidden
          className="absolute bottom-8 right-8 z-10 h-6 w-6 -translate-x-2 translate-y-2 opacity-0 text-primary-foreground transition-all duration-500 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
        />
      </TiltCard>
    </motion.div>
  );
};

const Services = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section id="services" ref={ref} className="relative py-24 md:py-40 px-6 md:px-12 lg:px-24 bg-background border-t border-border overflow-hidden">
      {/* Background index number */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-6 top-10 select-none font-heading text-[28vw] font-black leading-none text-foreground/[0.03]"
      >
        02
      </span>

      <div className="relative mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease }}
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="w-12 h-[2px] bg-primary" />
            <p className="section-label text-primary">02 — CAPABILITIES</p>
          </div>
          <h2 className="font-heading text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
            WHAT<span className="text-muted-foreground/30">I DO</span>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-sm text-muted-foreground leading-relaxed"
        >
          Four disciplines, one mindset: build things that are fast, accessible — and a little bit unforgettable.
        </motion.p>
      </div>

      <div className="relative grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <ServiceCard key={service.id} service={service} index={index} inView={inView} />
        ))}
      </div>
    </section>
  );
};

export default Services;
