import { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

export interface SphereItem {
  label: string;
  category: string;
}

interface SkillSphereProps {
  items: SphereItem[];
  highlight: string | null;
  className?: string;
}

/**
 * A draggable 3D tag cloud. Points sit on a Fibonacci sphere and are projected in JS,
 * so text stays crisp. It auto-rotates, drags with inertia, and pauses when off-screen.
 */
const SkillSphere = ({ items, highlight, className }: SkillSphereProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tagRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const points = useMemo(() => {
    const n = items.length;
    const golden = Math.PI * (3 - Math.sqrt(5));
    return items.map((_, i) => {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      return [Math.cos(theta) * r, y, Math.sin(theta) * r] as const;
    });
  }, [items]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const autoSpin = reduced ? 0 : 0.0035;
    const state = { ax: -0.35, ay: 0, vx: 0, vy: autoSpin, dragging: false, lastX: 0, lastY: 0, hovering: false };

    let raf = 0;
    let running = false;

    const render = () => {
      const size = Math.min(container.clientWidth, container.clientHeight);
      const radius = size * 0.42;
      const cosX = Math.cos(state.ax);
      const sinX = Math.sin(state.ax);
      const cosY = Math.cos(state.ay);
      const sinY = Math.sin(state.ay);

      points.forEach(([x, y, z], i) => {
        const el = tagRefs.current[i];
        if (!el) return;
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;
        const y1 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;
        const depth = (z2 + 1) / 2; // 0 = back, 1 = front
        el.style.transform = `translate3d(${x1 * radius}px, ${y1 * radius}px, 0) translate(-50%, -50%) scale(${0.55 + depth * 0.6})`;
        el.style.opacity = String(0.2 + depth * 0.8);
        el.style.zIndex = String(Math.round(depth * 100));
        el.style.filter = depth < 0.35 ? `blur(${(0.35 - depth) * 4}px)` : "none";
      });
    };

    const frame = () => {
      if (!state.dragging) {
        const target = state.hovering ? autoSpin * 0.25 : autoSpin;
        state.vy += (target - state.vy) * 0.03;
        state.vx += (0 - state.vx) * 0.03;
      }
      state.ay += state.vy;
      state.ax = Math.max(-1.2, Math.min(1.2, state.ax + state.vx));
      render();
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    observer.observe(container);
    render();

    const onDown = (e: PointerEvent) => {
      state.dragging = true;
      state.lastX = e.clientX;
      state.lastY = e.clientY;
      container.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!state.dragging) return;
      state.vy = (e.clientX - state.lastX) * 0.005;
      state.vx = -(e.clientY - state.lastY) * 0.005;
      state.lastX = e.clientX;
      state.lastY = e.clientY;
    };
    const onUp = (e: PointerEvent) => {
      state.dragging = false;
      if (container.hasPointerCapture(e.pointerId)) container.releasePointerCapture(e.pointerId);
    };
    const onEnter = () => (state.hovering = true);
    const onLeave = () => (state.hovering = false);

    container.addEventListener("pointerdown", onDown);
    container.addEventListener("pointermove", onMove);
    container.addEventListener("pointerup", onUp);
    container.addEventListener("pointercancel", onUp);
    container.addEventListener("pointerenter", onEnter);
    container.addEventListener("pointerleave", onLeave);

    return () => {
      stop();
      observer.disconnect();
      container.removeEventListener("pointerdown", onDown);
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerup", onUp);
      container.removeEventListener("pointercancel", onUp);
      container.removeEventListener("pointerenter", onEnter);
      container.removeEventListener("pointerleave", onLeave);
    };
  }, [points]);

  return (
    <div
      ref={containerRef}
      data-cursor="DRAG"
      className={cn("relative aspect-square w-full select-none touch-pan-y", className)}
    >
      {/* Wire guides */}
      <div aria-hidden className="pointer-events-none absolute inset-[8%] rounded-full border border-dashed border-border" />
      <div aria-hidden className="pointer-events-none absolute inset-[8%] rounded-full border border-border [transform:rotateX(72deg)]" />
      <div aria-hidden className="pointer-events-none absolute inset-[8%] rounded-full border border-border/60 [transform:rotateY(72deg)]" />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        <span className="font-heading text-5xl md:text-7xl font-black leading-none text-foreground/[0.06]">
          {String(items.length).padStart(2, "0")}
        </span>
        <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground/60">TOOLS</span>
      </div>

      <ul className="absolute left-1/2 top-1/2 h-0 w-0">
        {items.map((item, i) => {
          const dimmed = highlight !== null && item.category !== highlight;
          const lit = highlight !== null && item.category === highlight;
          return (
            <li key={`${item.category}-${item.label}`} className="contents">
              <span
                ref={(el) => (tagRefs.current[i] = el)}
                className={cn(
                  "absolute left-0 top-0 whitespace-nowrap border px-2.5 py-1 font-heading text-sm md:text-lg font-bold uppercase tracking-tight will-change-transform transition-colors duration-300",
                  lit
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-transparent bg-background/0 text-foreground hover:border-primary hover:text-primary",
                  dimmed && "text-muted-foreground/40",
                )}
              >
                {item.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SkillSphere;
