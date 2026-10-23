
// import { motion, useInView, AnimatePresence } from "framer-motion";
// import { useRef, useState, useEffect } from "react";

// // Helper component for the current time
// const TimeDisplay = () => {
//   const [time, setTime] = useState("");

//   useEffect(() => {
//     const updateTime = () => {
//       const now = new Date();
//       setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }));
//     };
//     updateTime();
//     const interval = setInterval(updateTime, 60000);
//     return () => clearInterval(interval);
//   }, []);

//   return <span className="font-mono text-primary">{time} EST</span>;
// };

// const SocialLink = ({ name, href, index }) => {
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <motion.a
//       href={href}
//       target="_blank"
//       rel="noopener noreferrer"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       initial={{ opacity: 0, y: 20 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       transition={{ delay: index * 0.1, duration: 0.5 }}
//       viewport={{ once: true }}
//       className="block border-t border-secondary-foreground/20 py-8 md:py-12 group relative overflow-hidden"
//     >
//       <div className="flex items-center justify-between px-2 md:px-0 relative z-10">
//         <h3 className="font-heading text-3xl md:text-6xl font-black uppercase text-secondary-foreground transition-colors duration-300 group-hover:text-secondary">
//           {name}
//         </h3>
//         <motion.div
//           animate={{ x: isHovered ? 0 : -20, opacity: isHovered ? 1 : 0 }}
//           className="text-3xl md:text-6xl text-secondary"
//         >
//           ↗
//         </motion.div>
//       </div>

//       {/* Background Fill Animation */}
//       <motion.div
//         initial={{ scaleY: 0 }}
//         animate={{ scaleY: isHovered ? 1 : 0 }}
//         transition={{ duration: 0.4, ease: "circOut" }}
//         style={{ originY: 1 }}
//         className="absolute inset-0 bg-primary z-0"
//       />
//     </motion.a>
//   );
// };

// const Contact = () => {
//   const ref = useRef(null);
//   const isInView = useInView(ref, { once: true, margin: "-10%" });
//   const [copied, setCopied] = useState(false);

//   const handleCopyEmail = () => {
//     navigator.clipboard.writeText("shubhamjamliya116@gmail.com");
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <section id="contact" ref={ref} className="pt-24 md:pt-40 pb-12 bg-secondary text-secondary-foreground overflow-hidden">
//       <div className="px-6 md:px-12 lg:px-24">

//         {/* Top Header Area */}
//         <div className="flex flex-col md:flex-row justify-between md:items-end mb-20 md:mb-32">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={isInView ? { opacity: 1, y: 0 } : {}}
//           >
//             <p className="section-label mb-2 text-primary font-semibold">05 — WHAT'S NEXT?</p>
//             <h2 className="font-heading text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black leading-[0.85] tracking-tight">
//               LET'S WORK<br />
//               <span className="text-stroke-primary text-transparent relative">
//                 TOGETHER
//                 {/* Decorative underline */}
//                 <motion.span
//                   initial={{ width: 0 }}
//                   animate={isInView ? { width: "100%" } : {}}
//                   transition={{ duration: 1, delay: 0.5 }}
//                   className="absolute bottom-2 left-0 h-2 md:h-4 bg-primary"
//                 />
//               </span>
//             </h2>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={isInView ? { opacity: 1 } : {}}
//             transition={{ delay: 0.4 }}
//             className="mt-8 md:mt-0 max-w-sm text-secondary-foreground/70"
//           >
//             <p className="leading-relaxed">
//               Currently seeking full-time opportunities and internships to kickstart my career. Have a question or just want to say hi?
//             </p>
//           </motion.div>
//         </div>

//         {/* Big Email Interaction */}
//         <div className="mb-24 md:mb-32 relative group">
//           <button
//             onClick={handleCopyEmail}
//             className="w-full text-left relative z-10"
//           >
//             <div className="flex items-center gap-4 mb-2">
//               <span className="section-label text-primary">DROP ME A LINE</span>
//               <AnimatePresence>
//                 {copied && (
//                   <motion.span
//                     initial={{ opacity: 0, x: -10 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     exit={{ opacity: 0 }}
//                     className="text-xs font-bold bg-primary text-secondary px-2 py-1 rounded"
//                   >
//                     COPIED TO CLIPBOARD!
//                   </motion.span>
//                 )}
//               </AnimatePresence>
//             </div>

//             <h3 className="font-heading text-[6vw] leading-none font-black hover:text-primary transition-colors duration-300 break-all md:break-normal">
//               shubhamjamliya116@gmail.com
//             </h3>
//           </button>
//         </div>

//         {/* Full Width Social Rows */}
//         <div className="mb-24">
//           {/* Full Width Social Rows */}
//           <div className="mb-24">
//             {[
//               { name: "LINKEDIN", href: "https://linkedin.com/in/shubhamjamliya" },
//               { name: "GITHUB", href: "https://github.com/Shubhamjamliya" },
//               { name: "LEETCODE", href: "https://leetcode.com/u/shubhamjamliya" }
//             ].map((social, index) => (
//               <SocialLink
//                 key={social.name}
//                 name={social.name}
//                 href={social.href}
//                 index={index}
//               />
//             ))}
//             <div className="w-full h-px bg-secondary-foreground/20" />
//           </div>

//         </div>

//         {/* Footer Bottom Meta */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-end text-sm text-secondary-foreground/40 font-mono uppercase tracking-wider">
//           <div className="mb-4 md:mb-0">
//             <p>© 2026 SHUBHAM JAMLIYA.</p>
//             <p>ALL RIGHTS RESERVED.</p>
//           </div>

//           <div className="flex gap-8 md:gap-16">
//             <div>
//               <p className="text-secondary-foreground/20 mb-1">Location</p>
//               <p className="text-secondary-foreground">Indore, MP</p>
//             </div>
//             <div>
//               <p className="text-secondary-foreground/20 mb-1">Local Time</p>
//               <TimeDisplay />
//             </div>
//           </div>
//         </div>

//       </div>
//     </section>
//   );
// };

// export default Contact;

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import ContactForm from "@/components/ContactForm";
import { CONTACT_EMAIL } from "@/lib/site";
import Magnetic from "@/components/effects/Magnetic";
import { scrollToTarget } from "@/lib/scroll";

// Helper component for the current time
const TimeDisplay = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return <span className="font-mono text-primary">{time} IST</span>; // Updated to IST to match your location
};

const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for insecure contexts / older browsers
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    el.remove();
    return ok;
  }
};

const SocialLink = ({ name, href, index, handle }: { name: string; href: string; index: number; handle: string }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      className="block border-t border-secondary-foreground/20 py-8 md:py-12 group relative overflow-hidden"
    >
      <div className="flex items-center justify-between px-2 md:px-0 relative z-10">
        <div className="flex items-baseline gap-4 md:gap-8">
          <span className="font-mono text-xs text-primary transition-colors duration-300 group-hover:text-secondary">
            0{index + 1}
          </span>
          <h3 className="font-heading text-3xl md:text-6xl font-black uppercase text-secondary-foreground transition-all duration-300 group-hover:text-secondary md:group-hover:translate-x-4">
            {name}
          </h3>
        </div>
        <div className="flex items-center gap-6">
          <span className="hidden md:block font-mono text-xs uppercase tracking-widest text-secondary-foreground/40 transition-colors duration-300 group-hover:text-secondary">
            {handle}
          </span>
          <motion.div
            animate={{ x: isHovered ? 0 : -20, opacity: isHovered ? 1 : 0, rotate: isHovered ? 0 : -45 }}
            className="text-3xl md:text-6xl text-secondary"
          >
            ↗
          </motion.div>
        </div>
      </div>

      {/* Background Fill Animation */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: "circOut" }}
        style={{ originY: 1 }}
        className="absolute inset-0 bg-primary z-0"
      />
    </motion.a>
  );
};

/** Giant sign-off: letters rise in on scroll and jump when hovered. */
const Wordmark = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });
  const letters = Array.from("SHUBHAM JAMLIYA");

  return (
    <div ref={ref} aria-hidden className="mb-12 select-none overflow-hidden border-t border-secondary-foreground/10 pt-8 md:pt-12">
      <p className="flex justify-between whitespace-nowrap font-heading text-[7.5vw] font-black leading-[0.8] tracking-tighter lg:text-[7vw]">
        {letters.map((char, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={{ y: "100%" }}
            animate={inView ? { y: "0%" } : {}}
            transition={{ duration: 1, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-block cursor-default transition-[transform,color] duration-300 ease-out hover:-translate-y-[0.08em] hover:text-primary">
              {char === " " ? " " : char}
            </span>
          </motion.span>
        ))}
      </p>
    </div>
  );
};

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [copied, setCopied] = useState(false);
  const [isEmailHovered, setIsEmailHovered] = useState(false); // Added hover state for email

  const handleCopyEmail = async () => {
    const ok = await copyText(CONTACT_EMAIL);
    if (ok) {
      setCopied(true);
      toast.success("Email copied to clipboard", { description: CONTACT_EMAIL });
      setTimeout(() => setCopied(false), 2000);
    } else {
      window.location.href = `mailto:${CONTACT_EMAIL}`;
    }
  };

  return (
    <section id="contact" ref={ref} className="pt-24 md:pt-40 pb-12 bg-secondary text-secondary-foreground overflow-hidden">
      <div className="px-6 md:px-12 lg:px-24">

        {/* Top Header Area */}
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-20 md:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
          >
            <p className="section-label mb-2 text-primary font-semibold">07 — WHAT'S NEXT?</p>
            <h2 className="font-heading text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black leading-[0.85] tracking-tight">
              LET'S WORK<br />
              <span className="text-stroke-primary text-transparent relative">
                TOGETHER
                {/* Decorative underline */}
                <motion.span
                  initial={{ width: 0 }}
                  animate={isInView ? { width: "100%" } : {}}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="absolute bottom-2 left-0 h-2 md:h-4 bg-primary"
                />
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="mt-8 md:mt-0 max-w-sm text-secondary-foreground/70"
          >
            <p className="leading-relaxed">
              Currently seeking full-time opportunities and internships to kickstart my career. Have a question or just want to say hi?
            </p>
          </motion.div>
        </div>

        {/* Big Email Interaction */}
        <div className="mb-24 md:mb-32 relative group">
          <button
            onClick={handleCopyEmail}
            onMouseEnter={() => setIsEmailHovered(true)} // Handle mouse enter
            onMouseLeave={() => setIsEmailHovered(false)} // Handle mouse leave
            data-cursor={copied ? "COPIED" : "COPY"}
            className="w-full text-left relative z-10"
          >
            {/* Added a min-h to prevent layout jumping when the text appears */}
            <div className="flex items-center gap-4 mb-2 min-h-[28px]">
              <span className="section-label text-primary">DROP ME A LINE</span>

              {/* Added mode="wait" to swap elements smoothly */}
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span
                    key="copied"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs font-bold bg-primary text-secondary px-2 py-1 rounded"
                  >
                    COPIED!
                  </motion.span>
                ) : isEmailHovered ? (
                  <motion.span
                    key="hover"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs font-bold border border-primary text-primary px-2 py-1 rounded"
                  >
                    CLICK TO COPY
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </div>

            <h3 className="font-heading text-[6vw] leading-none font-black hover:text-primary transition-colors duration-300 break-all md:break-normal">
              {CONTACT_EMAIL}
            </h3>
          </button>
        </div>

        {/* Quick message form */}
        <div className="mb-24 md:mb-32 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-4"
          >
            <p className="section-label text-primary mb-4">OR SEND A NOTE</p>
            <h3 className="font-heading text-3xl md:text-5xl font-black leading-[0.9] tracking-tight">
              SKIP THE
              <br />
              <span className="text-secondary-foreground/30">SMALL TALK.</span>
            </h3>
            <p className="mt-6 max-w-xs text-secondary-foreground/60 leading-relaxed">
              Pick a topic, leave a few lines, and I'll get back to you within a day or two.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="lg:col-span-8"
          >
            <ContactForm />
          </motion.div>
        </div>

        {/* Full Width Social Rows */}
        <div className="mb-24">
          {/* Full Width Social Rows */}
          <div className="mb-24">
            {[
              { name: "LINKEDIN", href: "https://linkedin.com/in/shubhamjamliya", handle: "/in/shubhamjamliya" },
              { name: "GITHUB", href: "https://github.com/Shubhamjamliya", handle: "@Shubhamjamliya" },
              { name: "LEETCODE", href: "https://leetcode.com/u/shubhamjamliya", handle: "u/shubhamjamliya" }
            ].map((social, index) => (
              <SocialLink
                key={social.name}
                name={social.name}
                href={social.href}
                handle={social.handle}
                index={index}
              />
            ))}
            <div className="w-full h-px bg-secondary-foreground/20" />
          </div>

        </div>

        <Wordmark />

        {/* Footer Bottom Meta */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 text-sm text-secondary-foreground/40 font-mono uppercase tracking-wider">
          <div className="mb-4 md:mb-0">
            <p>© 2026 SHUBHAM JAMLIYA.</p>
            <p>ALL RIGHTS RESERVED.</p>
          </div>

          <div className="flex flex-wrap items-end gap-8 md:gap-16">
            <div>
              <p className="text-secondary-foreground/20 mb-1">Location</p>
              <p className="text-secondary-foreground">Indore, MP</p>
            </div>
            <div>
              <p className="text-secondary-foreground/20 mb-1">Local Time</p>
              <TimeDisplay />
            </div>
            <Magnetic strength={0.4}>
              <button
                type="button"
                onClick={() => scrollToTarget(0)}
                className="group flex items-center gap-3 border border-secondary-foreground/20 px-4 py-3 text-secondary-foreground transition-colors duration-300 hover:border-primary hover:bg-primary"
              >
                Back to top
                <span className="inline-block transition-transform duration-300 group-hover:-translate-y-1">↑</span>
              </button>
            </Magnetic>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Contact;
