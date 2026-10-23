import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import TapeBand from "@/components/TapeBand";
import Skills from "@/components/Skills";
import Process from "@/components/Process";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Preloader from "@/components/effects/Preloader";
import { shouldPlayIntro } from "@/lib/intro";
import ScrollProgress from "@/components/effects/ScrollProgress";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";
import { scrollToTarget } from "@/lib/scroll";

const Index = () => {
  const [showIntro, setShowIntro] = useState(shouldPlayIntro);
  const location = useLocation();
  useSmoothScroll();

  // Arriving with a #hash (e.g. from the command menu on another page) → glide there after the intro
  useEffect(() => {
    if (showIntro || !location.hash) return;
    const id = window.setTimeout(() => scrollToTarget(location.hash), 700);
    return () => window.clearTimeout(id);
  }, [showIntro, location.hash]);

  return (
    <div className="bg-background text-foreground overflow-x-clip">
      <a
        href="#main"
        onClick={() => document.getElementById("main")?.focus({ preventScroll: true })}
        className="fixed left-4 top-4 z-[300] -translate-y-24 bg-primary px-4 py-2 font-mono text-xs uppercase tracking-widest text-primary-foreground focus:translate-y-0"
      >
        Skip to content
      </a>

      <AnimatePresence>{showIntro && <Preloader onComplete={() => setShowIntro(false)} />}</AnimatePresence>
      <ScrollProgress />
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero ready={!showIntro} />
        <About />
        <Services />
        <Projects />
        <TapeBand />
        <Skills />
        <Process />
        <Experience />
        <Contact />
      </main>
      {/* <Footer /> */}
      <div aria-hidden className="grain" />
    </div>
  );
};

export default Index;
