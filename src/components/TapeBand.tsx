import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { wrap } from "@motionone/utils";
import { cn } from "@/lib/utils";

const Star = () => (
  <svg viewBox="0 0 24 24" className="mx-6 h-[0.55em] w-[0.55em] shrink-0 md:mx-10" aria-hidden>
    <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" fill="currentColor" />
  </svg>
);

interface TapeProps {
  items: string[];
  baseVelocity: number;
  className?: string;
  outline?: boolean;
}

/** A strip that loops forever and speeds up / reverses with scroll velocity. Hover slows it down. */
const Tape = ({ items, baseVelocity, className, outline }: TapeProps) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const direction = useRef(1);
  const slow = useRef(false);

  useAnimationFrame((_, delta) => {
    let moveBy = direction.current * baseVelocity * (delta / 1000) * (slow.current ? 0.2 : 1);
    if (velocityFactor.get() < 0) direction.current = -1;
    else if (velocityFactor.get() > 0) direction.current = 1;
    moveBy += direction.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  const run = [...items, ...items, ...items];

  return (
    <div
      className={cn("relative -mx-[10%] w-[120%] overflow-hidden py-4 md:py-6 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.45)]", className)}
      onMouseEnter={() => (slow.current = true)}
      onMouseLeave={() => (slow.current = false)}
    >
      <motion.div className="flex w-max whitespace-nowrap" style={{ x }}>
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center" aria-hidden={half === 1}>
            {run.map((item, i) => (
              <span key={`${item}-${i}`} className="flex items-center">
                <span
                  className={cn(
                    "font-heading text-3xl md:text-6xl font-black uppercase tracking-tight",
                    outline && "text-transparent",
                  )}
                  style={outline ? { WebkitTextStroke: "1.5px hsl(var(--secondary-foreground))" } : undefined}
                >
                  {item}
                </span>
                <Star />
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const TapeBand = () => (
  <section aria-label="Availability" className="relative overflow-hidden bg-background py-20 md:py-28">
    <Tape
      className="relative z-10 -rotate-[4deg] bg-primary text-primary-foreground"
      baseVelocity={-2.2}
      items={["Open to work", "Full-time roles", "Internships", "Collaborations", "Let's build"]}
    />
    <Tape
      className="relative z-0 -mt-10 rotate-[3deg] bg-secondary text-secondary-foreground md:-mt-16"
      baseVelocity={2.2}
      outline
      items={["React", "Node.js", "Three.js", "TypeScript", "MongoDB", "Python"]}
    />
  </section>
);

export default TapeBand;
