"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const DATA_POINTS = [
  { id: "01", title: "THE MISSION", desc: "Mastering the stack from low-level logic to cloud-scale deployment.", pos: "top-[-10%] left-[10%]" },
  { id: "02", title: "THE STACK", desc: "Next.js, Rust, Python, and the cutting edge of AI/Web3.", pos: "top-[20%] right-[-5%]" },
  { id: "03", title: "THE CREW", desc: "A collective of B.Tech visionaries at BIAS.", pos: "bottom-[10%] left-[-5%]" },
  { id: "04", title: "THE GOAL", desc: "Building projects that break the standard and set the pace.", pos: "bottom-[-10%] right-[10%]" },
];

export default function MainframeCore() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Sphere scales up as you scroll, and opacity fades in/out
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.5, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section 
      ref={containerRef} 
      className="relative h-[200vh] bg-black overflow-hidden font-mono"
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center">
        
        {/* Background Glitch Text */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 select-none pointer-events-none text-[20vw] font-black text-[#00FF41]">
          BIAS
        </div>

        <motion.div 
          style={{ scale, opacity }}
          className="relative w-full max-w-4xl aspect-square flex items-center justify-center"
        >
          {/* THE 3D SPHERE (Pure CSS & Motion) */}
          <motion.div 
            style={{ rotateY: rotate }}
            className="relative w-64 h-64 md:w-96 md:h-96 rounded-full border border-[#00FF41]/40 shadow-[0_0_100px_rgba(0,255,65,0.2)]"
          >
            {/* Inner Grid Lines for 3D feel */}
            <div className="absolute inset-0 rounded-full border border-[#00FF41]/20 rotate-45 scale-110"></div>
            <div className="absolute inset-0 rounded-full border border-[#00FF41]/20 -rotate-45 scale-110"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#00FF41]/10 to-transparent"></div>
            
            {/* The Central Pulse */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-[#00FF41] rounded-full animate-ping shadow-[0_0_30px_#00FF41]"></div>
            </div>
          </motion.div>

          {/* FLOATING DATA FRAGMENTS */}
          {DATA_POINTS.map((point, i) => (
            <motion.div
              key={point.id}
              className={`absolute ${point.pos} w-48 md:w-64 p-4 border border-[#00FF41]/30 bg-black/80 backdrop-blur-md group hover:border-[#00FF41] transition-all duration-500 cursor-crosshair z-20`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: i * 0.2 }}
            >
              {/* Corner Accents */}
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#00FF41]"></div>
              
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] text-[#00FF41]/60">[{point.id}]</span>
                <h4 className="text-xs font-bold text-[#00FF41] tracking-[0.2em]">{point.title}</h4>
              </div>
              <p className="text-[10px] md:text-xs text-gray-400 leading-relaxed group-hover:text-gray-200 transition-colors">
                {point.desc}
              </p>
              
              {/* Animated Scanline */}
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#00FF41] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
            </motion.div>
          ))}

          {/* Connection Lines (SVGs) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            <line x1="50%" y1="50%" x2="15%" y2="15%" stroke="#00FF41" strokeWidth="0.5" />
            <line x1="50%" y1="50%" x2="85%" y2="30%" stroke="#00FF41" strokeWidth="0.5" />
            <line x1="50%" y1="50%" x2="10%" y2="85%" stroke="#00FF41" strokeWidth="0.5" />
            <line x1="50%" y1="50%" x2="85%" y2="85%" stroke="#00FF41" strokeWidth="0.5" />
          </svg>
        </motion.div>
      </div>

      {/* Side HUD Elements */}
      <div className="fixed bottom-12 left-12 hidden lg:block z-30">
        <div className="text-[10px] text-[#00FF41]/40 space-y-1">
          <p>LAT: 29.0232</p>
          <p>LONG: 77.1231</p>
          <p>STATUS: OPTIMAL</p>
        </div>
      </div>
    </section>
  );
}