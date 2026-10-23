import { useEffect } from "react";
import Lenis from "lenis";
import { safeQuery, scrollToTarget, setLenis } from "@/lib/scroll";
import { prefersReducedMotion } from "@/hooks/use-media-query";

/**
 * Buttery wheel scrolling via Lenis + smooth in-page "#hash" links.
 * Touch devices keep native scrolling; reduced-motion users get no smoothing.
 */
export const useSmoothScroll = () => {
  useEffect(() => {
    let lenis: Lenis | null = null;

    if (!prefersReducedMotion()) {
      lenis = new Lenis({ lerp: 0.1, autoRaf: true, allowNestedScroll: true });
      setLenis(lenis);
    }

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as Element | null)?.closest?.('a[href^="#"]');
      if (!anchor) return;

      const hash = anchor.getAttribute("href") ?? "#";
      if (hash !== "#" && !safeQuery(hash)) return;

      e.preventDefault();
      scrollToTarget(hash);
      if (hash !== "#") window.history.replaceState(window.history.state, "", hash);
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);
};
