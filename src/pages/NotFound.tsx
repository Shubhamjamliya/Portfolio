import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center bg-black text-white overflow-hidden font-mono">
      
      {/* 1. Background Noise / Grain */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none z-0">
         <svg className="w-full h-full">
            <filter id="noise">
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* 2. The Glitch Container */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* The Glitchy 404 Title */}
        <div className="relative mb-8">
            <GlitchText text="404" size="text-[12rem] md:text-[20rem]" />
        </div>

        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center space-y-6 max-w-lg px-6"
        >
            <div className="bg-red-500/10 border border-red-500/50 px-4 py-2 rounded inline-block mb-4">
                <p className="text-red-500 text-xs tracking-[0.2em] font-bold uppercase">
                    Fatal Error: Signal Lost
                </p>
            </div>

            <p className="text-zinc-400 leading-relaxed">
                The requested path <span className="text-white bg-zinc-800 px-1 font-bold">{location.pathname}</span> could not be located in the neural network.
            </p>

            <div className="pt-8">
                <a 
                    href="/"
                    className="group relative inline-flex items-center justify-center px-8 py-4 bg-white text-black font-black uppercase tracking-widest hover:bg-zinc-200 transition-colors"
                >
                    {/* Button Glitch Effect on Hover */}
                    <span className="relative z-10">Initiate Reboot</span>
                    <div className="absolute inset-0 bg-red-500 translate-x-1 translate-y-1 -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform" />
                </a>
            </div>
        </motion.div>

      </div>

      {/* 3. Footer Scanlines */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
          <div className="w-full h-full bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]" />
      </div>

    </div>
  );
};

// Reusable Glitch Text Component
const GlitchText = ({ text, size }) => {
  return (
    <div className={`relative font-black leading-none ${size}`}>
      {/* Base Layer */}
      <span className="relative z-10">{text}</span>
      
      {/* Red Layer - Shifts Left */}
      <motion.span 
        className="absolute top-0 left-0 -z-10 text-red-500 opacity-70"
        animate={{ 
            x: [-2, 2, -1, 0], 
            y: [1, -1, 0],
            opacity: [0.7, 0.4, 0.7] 
        }}
        transition={{ 
            duration: 0.4, 
            repeat: Infinity, 
            repeatType: "mirror" 
        }}
      >
        {text}
      </motion.span>

      {/* Blue Layer - Shifts Right */}
      <motion.span 
        className="absolute top-0 left-0 -z-10 text-blue-500 opacity-70"
        animate={{ 
            x: [2, -2, 1, 0], 
            y: [-1, 1, 0],
            opacity: [0.7, 0.4, 0.7] 
        }}
        transition={{ 
            duration: 0.3, 
            repeat: Infinity, 
            repeatType: "mirror",
            delay: 0.1 
        }}
      >
        {text}
      </motion.span>
    </div>
  );
};

export default NotFound;