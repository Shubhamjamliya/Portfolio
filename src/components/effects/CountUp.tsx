import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";
import { prefersReducedMotion } from "@/hooks/use-media-query";

/** Counts up the leading number of a stat like "200+" or "24/7" once it scrolls into view. */
const CountUp = ({ value, className }: { value: string; className?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const match = value.match(/^(\d+)(.*)$/);

  useEffect(() => {
    const el = ref.current;
    if (!el || !match || !inView) return;
    if (prefersReducedMotion()) {
      el.textContent = value;
      return;
    }
    const [, num, suffix] = match;
    const controls = animate(0, parseInt(num, 10), {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {match ? `0${match[2]}` : value}
    </span>
  );
};

export default CountUp;
