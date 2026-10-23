import type { ReactNode } from "react";
import { motion } from "framer-motion";

const ease = [0.76, 0, 0.24, 1] as const;

/**
 * Red curtain wipe between routes: on leave it rises from the bottom to cover the page,
 * on enter it keeps rising off the top to reveal the new one.
 */
const PageTransition = ({ children }: { children: ReactNode }) => (
  <>
    {children}
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[90] origin-top bg-primary"
      initial={{ scaleY: 1 }}
      animate={{ scaleY: 0, transition: { duration: 0.75, ease, delay: 0.05 } }}
      exit={{ scaleY: 0 }}
    />
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[90] origin-bottom bg-primary"
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 0 }}
      exit={{ scaleY: 1, transition: { duration: 0.55, ease } }}
    />
  </>
);

export default PageTransition;
