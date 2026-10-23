import { prefersReducedMotion } from "@/hooks/use-media-query";

export const INTRO_STORAGE_KEY = "ak-intro-played";

/** The preloader plays once per browser session, never for reduced-motion users. */
export const shouldPlayIntro = () => {
  if (typeof window === "undefined" || prefersReducedMotion()) return false;
  try {
    return sessionStorage.getItem(INTRO_STORAGE_KEY) !== "1";
  } catch {
    return true;
  }
};
