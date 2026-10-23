import type Lenis from "lenis";

// Single Lenis instance shared across the app (only active on the home page).
let lenis: Lenis | null = null;

export const setLenis = (instance: Lenis | null) => {
  lenis = instance;
};

export const getLenis = () => lenis;

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

/**
 * Smooth-scrolls to a selector ("#about"), element or Y position.
 * Uses Lenis when it is running, native smooth scrolling otherwise.
 */
export const scrollToTarget = (target: string | number | HTMLElement) => {
  const resolved = target === "#" || target === "#top" ? 0 : target;

  if (lenis) {
    lenis.scrollTo(resolved, { duration: 1.4, easing: easeOutQuart, force: true });
    return;
  }

  if (typeof resolved === "number") {
    window.scrollTo({ top: resolved, behavior: "smooth" });
    return;
  }

  const el = typeof resolved === "string" ? safeQuery(resolved) : resolved;
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
};

export const safeQuery = (selector: string): HTMLElement | null => {
  try {
    return document.querySelector<HTMLElement>(selector);
  } catch {
    return null;
  }
};
