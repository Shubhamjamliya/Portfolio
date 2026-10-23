import { flushSync } from "react-dom";

type Theme = "light" | "dark";

type DocumentWithTransition = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> };
};

/** Applies the theme synchronously so a View Transition can snapshot the new state. */
const applyTheme = (next: Theme, setTheme: (t: string) => void) => {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(next);
  root.style.colorScheme = next;
  flushSync(() => setTheme(next));
};

/** Circular ink-spill reveal from the given point (falls back to an instant swap). */
export const switchTheme = (next: Theme, setTheme: (t: string) => void, origin?: { x: number; y: number }) => {
  const doc = document as DocumentWithTransition;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!doc.startViewTransition || reduce) {
    applyTheme(next, setTheme);
    return;
  }

  const x = origin?.x ?? window.innerWidth / 2;
  const y = origin?.y ?? window.innerHeight / 2;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

  const transition = doc.startViewTransition(() => applyTheme(next, setTheme));
  transition.ready
    .then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 750, easing: "cubic-bezier(0.76, 0, 0.24, 1)", pseudoElement: "::view-transition-new(root)" },
      );
    })
    .catch(() => {});
};
