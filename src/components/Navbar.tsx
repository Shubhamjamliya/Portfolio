

import { useState, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import { CONTACT_EMAIL, OPEN_COMMAND_EVENT } from "@/lib/site";
import { scrollToTarget } from "@/lib/scroll";

const navItems = [
  { label: "ABOUT", href: "#about" },
  { label: "WORK", href: "#work" },
  { label: "SKILLS", href: "#skills" },
  { label: "EXPERIENCE", href: "#experience" },
  { label: "CONTACT", href: "#contact" },
];

const socials = [
  { label: "GitHub", href: "https://github.com/Shubhamjamliya" },
  { label: "LinkedIn", href: "https://linkedin.com/in/shubhamjamliya" },
  { label: "LeetCode", href: "https://leetcode.com/u/shubhamjamliya" },
];

/** Scroll-spy: which nav section currently crosses the middle of the viewport. */
const useActiveSection = (hrefs: string[]) => {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const elements = hrefs
      .map((href) => document.querySelector<HTMLElement>(href))
      .filter((el): el is HTMLElement => !!el);
    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = `#${entry.target.id}`;
          if (entry.isIntersecting) visible.add(id);
          else visible.delete(id);
        });
        setActive(hrefs.find((h) => visible.has(h)) ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [hrefs]);

  return active;
};

const hrefs = navItems.map((n) => n.href);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false); // New state for hiding
  const active = useActiveSection(hrefs);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
  }, []);

  // 1. Keep your existing logic for the background/padding change
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock page scroll + allow Esc while the mobile menu is open
  useEffect(() => {
    if (!isOpen) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  // 2. Add the smart scroll-direction logic
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();

    // Hide if scrolling down, past 100px, AND the mobile menu is NOT open
    if (latest > previous && latest > 100 && !isOpen) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const onMobileLink = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    // Wait for the menu to close and the scroll lock to lift
    window.setTimeout(() => scrollToTarget(href), 350);
  };

  return (
    <motion.nav
      // 3. Update the animation logic to use the hidden state
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      initial={{ y: -100 }} // Keeps your original initial slide-in
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      // Note: Removed 'transition-all' from Tailwind so it doesn't fight Framer Motion's Y transform
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,padding,border-color] duration-500 ${scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border py-4"
          : "bg-transparent py-6"
        }`}
    >
      <div className="flex items-center justify-between px-6 md:px-12">
        <a href="#" className="group relative z-50 font-heading text-xl font-bold tracking-tight" aria-label="Back to top">
          SJ<span className="inline-block text-primary transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-150">.</span>
        </a>

        {/* Desktop Nav with Flip Animation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <div key={item.label} className="relative">
              {active === item.href && (
                <motion.span
                  layoutId="nav-active-dot"
                  className="absolute -left-3 top-[calc(50%-3px)] h-1.5 w-1.5 bg-primary"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <FlipLink href={item.href} active={active === item.href}>
                {item.label}
              </FlipLink>
            </div>
          ))}

          <span className="h-5 w-px bg-border" aria-hidden />

          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_COMMAND_EVENT))}
            aria-label="Open command menu"
            className="hidden lg:flex items-center gap-1.5 border border-border px-2 py-1.5 font-mono text-[10px] tracking-widest text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <kbd className="font-mono">{isMac ? "⌘" : "CTRL"}</kbd>
            <kbd className="font-mono">K</kbd>
          </button>
          <ThemeToggle />
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-4 z-50">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="flex flex-col gap-1.5 group"
          >
            <motion.span
              animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className="block w-8 h-0.5 bg-foreground transition-transform duration-300"
            />
            <motion.span
              animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block w-8 h-0.5 bg-foreground transition-opacity duration-300"
            />
            <motion.span
              animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className="block w-8 h-0.5 bg-foreground transition-transform duration-300"
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="md:hidden fixed inset-0 h-[100dvh] bg-background flex flex-col justify-between px-6 pt-28 pb-10 overflow-hidden"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -right-8 bottom-24 font-heading text-[45vw] font-black leading-none text-foreground/[0.04]"
            >
              SJ
            </span>

            <nav className="relative flex flex-col gap-3">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => onMobileLink(e, item.href)}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.2 + i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex items-baseline gap-4 border-b border-border pb-3"
                >
                  <span className="font-mono text-xs text-primary">0{i + 1}</span>
                  <span
                    className={`font-heading text-5xl font-black tracking-tight transition-colors group-hover:text-primary ${
                      active === item.href ? "text-primary" : ""
                    }`}
                  >
                    {item.label}
                  </span>
                </motion.a>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.55 }}
              className="relative space-y-4 font-mono text-xs uppercase tracking-widest"
            >
              <a href={`mailto:${CONTACT_EMAIL}`} className="block text-muted-foreground normal-case tracking-normal text-sm">
                {CONTACT_EMAIL}
              </a>
              <div className="flex gap-6">
                {socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                    {s.label} ↗
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

// ----------------------------------------------------------------------
// The Flip Link Component
// ----------------------------------------------------------------------
const FlipLink = ({ children, href, active }: { children: ReactNode; href: string; active?: boolean }) => {
  return (
    <motion.a
      initial="initial"
      whileHover="hovered"
      href={href}
      aria-current={active ? "true" : undefined}
      className="relative block overflow-hidden whitespace-nowrap text-sm font-bold uppercase"
    >
      <div className="relative overflow-hidden">
        <motion.div
          variants={{
            initial: { y: 0 },
            hovered: { y: "-100%" },
          }}
          transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
        >
          {children}
        </motion.div>
        <motion.div
          className="absolute inset-0 text-primary"
          variants={{
            initial: { y: "100%" },
            hovered: { y: 0 },
          }}
          transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
        >
          {children}
        </motion.div>
      </div>
    </motion.a>
  );
};

export default Navbar;
