"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const SECTORS = [
  { id: "S-01", label: "ALGORITHMS", angle: 45, detail: "Mastering O(log n) efficiency." },
  { id: "S-02", label: "FULLSTACK", angle: 135, detail: "Deploying high-availability apps." },
  { id: "S-03", label: "NEURAL NET", angle: 225, detail: "Exploring deep learning models." },
  { id: "S-04", label: "CYBERSEC", angle: 315, detail: "Securing the BIAS mainframe." },
];

export default function RadarAbout() {
  const containerRef = useRef(null);
  const [rotation, setRotation] = useState(0);

  // Sync rotation with a simple animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360);
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      ref={containerRef}
      id="about" 
      className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden py-24 font-mono"
    >
      {/* Background Radar Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] border border-[#00FF41] rounded-full"></div>
        <div className="absolute w-[200px] h-[200px] md:w-[400px] md:h-[400px] border border-[#00FF41]/60 rounded-full"></div>
        <div className="absolute w-[100px] h-[100px] md:w-[200px] md:h-[200px] border border-[#00FF41]/40 rounded-full"></div>
        
        {/* Horizontal & Vertical Crosshairs */}
        <div className="absolute w-full h-[1px] bg-[#00FF41]/30"></div>
        <div className="absolute h-full w-[1px] bg-[#00FF41]/30"></div>
      </div>

      <div className="relative w-full max-w-4xl aspect-square flex items-center justify-center">
        
        {/* THE SCANNING BEAM */}
        <motion.div 
          style={{ rotate: rotation }}
          className="absolute w-[150px] h-[150px] md:w-[300px] md:h-[300px] origin-bottom-right top-[calc(50%-150px)] left-[calc(50%-150px)] md:top-[calc(50%-300px)] md:left-[calc(50%-300px)] z-10 pointer-events-none"
        >
          <div className="w-full h-full bg-gradient-to-br from-[#00FF41]/40 to-transparent rounded-tl-full blur-sm"></div>
        </motion.div>

        {/* RADAR NODES (Pings) */}
        {SECTORS.map((sector) => {
          // Check if the radar beam is currently "hitting" this sector
          const isHit = Math.abs(rotation - sector.angle) < 15;
          
          return (
            <div 
              key={sector.id}
              className="absolute transition-all duration-700"
              style={{
                transform: `rotate(${sector.angle}deg) translate(${typeof window !== 'undefined' && window.innerWidth < 768 ? '120px' : '250px'}) rotate(-${sector.angle}deg)`
              }}
            >
              <div className="relative group">
                {/* The Blip */}
                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${isHit ? 'bg-[#00FF41] scale-150 shadow-[0_0_20px_#00FF41]' : 'bg-[#00FF41]/20'}`}></div>
                
                {/* The Info Box (Appears on beam hit or hover) */}
                <div className={`absolute left-6 top-[-20px] w-48 p-3 border border-[#00FF41]/30 bg-black/80 backdrop-blur-md transition-all duration-500 ${isHit || 'group-hover:opacity-100' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] text-[#00FF41] font-bold">{sector.id}</span>
                    <span className="text-[8px] text-gray-500">AZIMUTH: {sector.angle}°</span>
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1 uppercase tracking-tighter">{sector.label}</h4>
                  <p className="text-[10px] text-gray-400 leading-tight">{sector.detail}</p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Center Core */}
        <div className="z-20 w-12 h-12 bg-black border-2 border-[#00FF41] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,255,65,0.2)]">
          <div className="w-2 h-2 bg-[#00FF41] rounded-full animate-ping"></div>
        </div>

        {/* Static HUD Text */}
        <div className="absolute top-10 left-0 text-[10px] text-[#00FF41]/60 flex flex-col gap-1">
          <p>&gt; SCANNING_SECTORS...</p>
          <p>&gt; FREQ: 2.4GHZ</p>
          <p>&gt; RANGE: 500KM</p>
        </div>
        
        <div className="absolute bottom-10 right-0 text-[10px] text-[#00FF41]/60 text-right">
          <p>OBJECT_TRACKING: ENABLED</p>
          <p>IDENT_MODE: FRIEND_OR_FOE</p>
          <p className="text-[#00FF41] font-bold">BIAS_MAIN_GRID</p>
        </div>
      </div>
    </section>
  );
}