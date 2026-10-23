import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";

type Variant = "default" | "hover" | "label" | "text";

/**
 * Two-part cursor: a precise dot + a lagging ring.
 * - Links/buttons grow the ring.
 * - Any element with data-cursor="LABEL" turns the ring into a red label bubble.
 * - Links/buttons nested inside a labelled area still get the normal hover ring.
 * Only mounts on devices with a fine pointer (mouse / trackpad).
 */
const Cursor = () => {
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 32, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 350, damping: 32, mass: 0.6 });

  const [variant, setVariant] = useState<Variant>("default");
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!finePointer) return;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (!target?.closest) return;
      const labelled = target.closest<HTMLElement>("[data-cursor]");
      const interactive = target.closest("a, button, [role='button'], label, summary");
      const nestedInteractive = !!(labelled && interactive && interactive !== labelled && labelled.contains(interactive));
      if (labelled && !nestedInteractive) {
        setLabel(labelled.dataset.cursor ?? "");
        setVariant("label");
        return;
      }
      if (target.closest("input, textarea, select, [contenteditable='true']")) {
        setVariant("text");
        return;
      }
      if (interactive) {
        setVariant("hover");
        return;
      }
      setVariant("default");
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    root.addEventListener("mouseleave", onLeave);

    return () => {
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      root.removeEventListener("mouseleave", onLeave);
    };
  }, [finePointer, x, y]);

  if (!finePointer) return null;

  const ring = {
    default: { width: 36, height: 36, backgroundColor: "hsl(var(--primary) / 0)", borderWidth: 1.5 },
    hover: { width: 64, height: 64, backgroundColor: "hsl(var(--primary) / 0.12)", borderWidth: 1.5 },
    label: { width: 92, height: 92, backgroundColor: "hsl(var(--primary) / 1)", borderWidth: 0 },
    text: { width: 8, height: 8, backgroundColor: "hsl(var(--primary) / 0)", borderWidth: 0 },
  }[variant];

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[200]">
      <motion.div
        className="fixed left-0 top-0"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
      >
        <motion.div
          className="flex items-center justify-center rounded-full border-primary"
          style={{ borderStyle: "solid" }}
          animate={{ ...ring, opacity: visible ? 1 : 0, scale: pressed ? 0.85 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {variant === "label" && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground"
            >
              {label}
            </motion.span>
          )}
        </motion.div>
      </motion.div>

      <motion.div
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-white mix-blend-difference"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: visible && variant !== "label" && variant !== "text" ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      />
    </div>
  );
};

export default Cursor;
