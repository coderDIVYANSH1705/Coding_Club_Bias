"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function AboutBento() {
  // A typing effect for the "Terminal" card to keep the hacker vibe alive
  const [terminalText, setTerminalText] = useState("");
  const fullText = "Initializing BIAS club protocols...\nLoading developer modules...\nStatus: ACTIVE\nObjective: Dominate the tech landscape.";

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setTerminalText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 40);
    return () => clearInterval(typingInterval);
  }, []);

  // Smooth staggered animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <section id="about" className="w-full min-h-screen bg-[#020202] text-white font-mono py-24 px-6 md:px-12 flex flex-col items-center justify-center relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto w-full space-y-12 relative z-10">
        <header className="border-b border-[#00FF41]/20 pb-6 mb-8">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-[#00FF41] tracking-tighter"
          >
            &gt; cat about_club.md
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-2 text-gray-400"
          >
            System overview, core directives, and operational capacity.
          </motion.p>
        </header>

        {/* BENTO GRID LAYOUT */}
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]"
        >
          
          {/* Card 1: Main Mission (Large) */}
          <motion.div variants={item} className="md:col-span-2 lg:col-span-2 row-span-2 p-8 border border-[#00FF41]/30 bg-[#050505] shadow-[0_0_15px_rgba(0,255,65,0.05)] hover:border-[#00FF41] transition-colors duration-500 group flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#00FF41]/5 rounded-bl-full transform origin-top-right group-hover:scale-150 transition-transform duration-700"></div>
            <div>
              <h3 className="text-[#00FF41] text-xs uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#00FF41] inline-block animate-pulse"></span>
                Core_Mission
              </h3>
              <h4 className="text-2xl font-bold text-gray-100 mb-4 leading-tight">
                Bridging the gap between raw theory and real-world deployment.
              </h4>
              <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
                <p>
                  The BIAS Coding Club is not just a study group; it is a deployment facility. We exist to transform students into engineers capable of architecture, optimization, and scaling. 
                </p>
                <p>
                  Whether it is competing in global hackathons, contributing to high-impact open-source repositories, or mastering algorithmic complexities, our community pushes the boundaries of what college developers can build.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Domains/Tech Stack */}
          <motion.div variants={item} className="md:col-span-1 lg:col-span-2 p-8 border border-[#00FF41]/20 bg-[#080808] hover:border-[#00FF41]/60 transition-colors duration-500">
            <h3 className="text-[#00FF41] text-xs uppercase tracking-widest font-bold mb-4">Active_Domains</h3>
            <div className="flex flex-wrap gap-3">
              {['Data Structures', 'Algorithms', 'Full-Stack Dev', 'Machine Learning', 'Web3 / Blockchain', 'System Design', 'Cybersecurity'].map((tech) => (
                <span key={tech} className="px-3 py-1.5 border border-gray-700 text-gray-300 text-xs rounded-sm hover:border-[#00FF41] hover:text-[#00FF41] transition-all cursor-crosshair">
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Card 3: The Mini Terminal */}
          <motion.div variants={item} className="md:col-span-1 lg:col-span-1 row-span-2 p-6 border border-[#00FF41]/20 bg-[#030303] flex flex-col font-mono text-xs text-[#00FF41]/80 shadow-inner">
            <div className="flex justify-between items-center border-b border-[#00FF41]/20 pb-2 mb-4">
              <span>root@bias-club:~</span>
              <span className="w-2 h-2 rounded-full bg-[#00FF41]"></span>
            </div>
            <div className="flex-1 whitespace-pre-wrap leading-loose">
              {terminalText}
              <span className="animate-pulse inline-block w-2 h-3 bg-[#00FF41] ml-1"></span>
            </div>
          </motion.div>

          {/* Card 4: Quick Stats */}
          <motion.div variants={item} className="md:col-span-2 lg:col-span-1 p-8 border border-[#00FF41]/20 bg-[#050505] flex flex-col justify-center items-center text-center group hover:bg-[#00FF41]/5 transition-colors duration-500">
            <span className="text-4xl font-bold text-[#00FF41] mb-2 group-hover:scale-110 transition-transform">∞</span>
            <span className="text-gray-400 text-xs uppercase tracking-widest">Lines of Code</span>
          </motion.div>

          {/* Card 5: Join CTA / Focus */}
          <motion.div variants={item} className="md:col-span-1 lg:col-span-1 p-8 border border-[#00FF41]/20 bg-[#050505] flex flex-col justify-center">
            <h3 className="text-[#00FF41] text-xs uppercase tracking-widest font-bold mb-2">Current_Focus</h3>
            <p className="text-gray-300 text-sm mb-4">Preparing for upcoming competitive programming regionals.</p>
            <a href="#join" className="text-[#00FF41] text-xs uppercase tracking-wider hover:underline border-l-2 border-[#00FF41] pl-2">
              Apply for Access -&gt;
            </a>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}