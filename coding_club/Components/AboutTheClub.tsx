"use client";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useEffect, useState, useRef } from "react";

// The core "About" text we want to display
const CLUB_MISSION = 
  "We are a high-octane community of developers, problem-solvers, and tech enthusiasts at BIAS. Our mission is to bridge the gap between theory and deployment, mastering algorithmic challenges, scaling modern web architectures, and exploring the frontiers of AI and Web3. Step into the mainframe and start building.";

// A function to scramble text for the decryption effect
const scrambleText = (text: string, glyphs = "01#_/-=X%&?") => {
  return text
    .split("")
    .map(() => glyphs[Math.floor(Math.random() * glyphs.length)])
    .join("");
};

export default function AboutSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"], // Triggers animation as section enters and leaves viewport
  });

  // State for the scrambled text effect
  const [displayedText, setDisplayedText] = useState("");
  const [isDecrypted, setIsDecrypted] = useState(false);

  // Use scroll progress to drive the decryption animation
  // Text will be 100% scrambled at the start, and fully decrypted halfway through the section scroll
  const decryptionProgress = useTransform(scrollYProgress, [0.1, 0.5], [0, 1]);

  useEffect(() => {
    // Unsubscribe from decryptionProgress value changes
    const unsubscribe = decryptionProgress.on("change", (latest) => {
      if (latest < 1) {
        setIsDecrypted(false);
        // Calculate how much text should be revealed
        const revealCount = Math.floor(CLUB_MISSION.length * latest);
        const revealed = CLUB_MISSION.slice(0, revealCount);
        const scrambled = scrambleText(CLUB_MISSION.slice(revealCount));
        setDisplayedText(revealed + scrambled);
      } else {
        setIsDecrypted(true);
        setDisplayedText(CLUB_MISSION); // Ensure full text is shown
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [decryptionProgress]);

  // Framer Motion variants for text container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  };

  return (
    <section
      ref={containerRef}
      id="about"
      className="w-full min-h-screen bg-[#020202] text-white font-mono py-24 md:py-32 px-6 md:px-12 border-t border-[#00FF41]/10 flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Background Decryption Matrix Effect (optional) */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none select-none font-black text-4xl leading-none text-[#00FF41] tracking-tight whitespace-nowrap overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
            {scrambleText("BIRLA INSTITUTE OF APPLIED SCIENCES CODING CLUB ", "01#XY")}
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
        
        {/* Text Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }} // Animates when 50% of section is visible
          className="flex-1 space-y-8"
        >
          <motion.header variants={itemVariants} className="text-center md:text-left space-y-2">
            <h2 className="text-4xl md:text-5xl font-bold text-[#00FF41] tracking-tighter">
              ./Init_About
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto md:mx-0">
              Decrypting the club mission and objectives from the mainframe.
            </p>
          </motion.header>

          <motion.div
            variants={itemVariants}
            className={`p-6 md:p-8 bg-[#050505] border border-[#00FF41]/20 rounded-sm shadow-[0_0_15px_rgba(0,255,65,0.05)] font-mono text-sm md:text-base leading-relaxed ${
              isDecrypted ? "text-gray-200" : "text-[#00FF41]/70"
            }`}
          >
            {/* The actual decrypting text */}
            &gt; {displayedText}
            {!isDecrypted && <span className="animate-pulse">_</span>}
          </motion.div>
        </motion.div>

        {/* Tech Nodes Section */}
        <div className="flex-1 w-full max-w-lg md:max-w-none h-64 md:h-96 relative flex items-center justify-center">
          <TechNodes />
        </div>
      </div>
    </section>
  );
}

// ─── Tech Nodes Component ───────────────────────────────────────────────────
// A floating cluster of glowing nodes representing different tech domains

const NODES_DATA = [
  { name: "Next.js", x: "-20%", y: "-30%", delay: 0.1, size: 72 },
  { name: "AI/ML", x: "30%", y: "-15%", delay: 0.3, size: 84 },
  { name: "Web3", x: "-35%", y: "25%", delay: 0.5, size: 76 },
  { name: "DSA", x: "25%", y: "40%", delay: 0.2, size: 64 },
  { name: "Cloud", x: "0%", y: "10%", delay: 0.4, size: 80 },
];

function TechNodes() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Update mouse position for subtle movement effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position relative to the center of the viewport
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      setMousePosition({
        x: (clientX - innerWidth / 2) / (innerWidth / 2),
        y: (clientY - innerHeight / 2) / (innerHeight / 2),
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Spring animations for smoothness
  const springX = useSpring(0, { damping: 20, stiffness: 200 });
  const springY = useSpring(0, { damping: 20, stiffness: 200 });

  useEffect(() => {
    springX.set(mousePosition.x);
    springY.set(mousePosition.y);
  }, [mousePosition, springX, springY]);

  // Framer Motion transforms for smooth movement based on mouse position
  const nodesX = useTransform(springX, [-1, 1], [-30, 30]);
  const nodesY = useTransform(springY, [-1, 1], [-30, 30]);

  return (
    <motion.div
      style={{ x: nodesX, y: nodesY }} // Apply mouse-driven movement
      className="relative w-full h-full"
    >
      {/* Central Hub Node */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#00FF41]/10 rounded-full border-2 border-[#00FF41] shadow-[0_0_20px_#00FF41] animate-pulse"></div>

      {/* Floating Satellite Nodes */}
      {NODES_DATA.map((node, index) => (
        <motion.div
          key={index}
          className="absolute flex items-center justify-center p-3 rounded-xl border border-[#00FF41]/30 bg-black/40 backdrop-blur-sm shadow-[0_0_10px_rgba(0,255,65,0.1)] group hover:border-[#00FF41] hover:shadow-[0_0_20px_rgba(0,255,65,0.3)] transition-all duration-300"
          style={{
            left: `calc(50% + ${node.x})`,
            top: `calc(50% + ${node.y})`,
            width: `${node.size}px`,
            height: `${node.size}px`,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            delay: node.delay,
            type: "spring",
            stiffness: 100,
            damping: 20,
          }}
          animate={{
            y: ["-10px", "10px"], // Bobbing motion
          }}
          // Different bobbing speeds/delays for variety
          transition={{
            repeat: Infinity,
            repeatType: "mirror",
            duration: 3 + index,
            ease: "easeInOut",
          }}
        >
          {/* Connector Line to Hub */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-32 md:w-0.5 md:h-48 origin-bottom rotate-0 group-hover:rotate-180 transition-transform duration-1000">
             <div className="w-full h-full bg-gradient-to-t from-[#00FF41]/20 to-transparent"></div>
          </div>

          <span className="text-[10px] md:text-xs font-bold text-[#00FF41] tracking-widest uppercase group-hover:scale-110 transition-transform">
            {node.name}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}