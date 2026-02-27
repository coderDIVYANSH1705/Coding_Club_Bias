'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const terminalLines = [
  { text: "systemctl status bias-coding-club.service", color: "text-gray-300" },
  { text: "● active (running) since Sat 2026-02-28; 42ms ago", color: "text-emerald-500" },
  { text: "main --init --config ./bias_config.yaml", color: "text-gray-300" },
  { text: "[INFO] Initializing Birla Institute of Applied Sciences core...", color: "text-white" },
  { text: "[SUCCESS] Neural engine engaged.", color: "text-emerald-400" },
  { text: "Ready for input. _", color: "text-white" },
];

export default function Terminal() {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  // Typewriter Logic
  useEffect(() => {
    if (currentLineIndex < terminalLines.length) {
      const currentFullText = terminalLines[currentLineIndex].text;
      
      if (currentCharIndex < currentFullText.length) {
        const timeout = setTimeout(() => {
          setCurrentCharIndex((prev) => prev + 1);
        }, 30); // Speed of typing
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setDisplayedLines((prev) => [...prev, currentFullText]);
          setCurrentLineIndex((prev) => prev + 1);
          setCurrentCharIndex(0);
        }, 400); // Pause between lines
        return () => clearTimeout(timeout);
      }
    }
  }, [currentCharIndex, currentLineIndex]);

  return (
    <section className="w-full min-h-screen bg-[#050505] flex items-center justify-center p-4 md:p-10 font-mono">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="w-full max-w-5xl h-[70vh] flex flex-col rounded-lg overflow-hidden border border-white/5 bg-[#0a0a0a] shadow-[0_0_50px_rgba(0,0,0,0.5)]"
      >
        {/* Minimalist Top Bar */}
        <div className="h-8 w-full bg-[#111] flex items-center px-4 justify-start gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <span className="ml-4 text-[10px] text-gray-600 uppercase tracking-widest">bias_shell_v1.0.4</span>
        </div>

        {/* Typing Area */}
        <div className="flex-1 p-6 md:p-10 text-sm md:text-base overflow-y-auto leading-relaxed scroll-smooth">
          {displayedLines.map((line, idx) => (
            <div key={idx} className={`mb-2 ${terminalLines[idx].color}`}>
              <span className="text-gray-600 mr-3">❯</span>
              {line.replace("_", "")}
            </div>
          ))}

          {/* Current Typing Line */}
          {currentLineIndex < terminalLines.length && (
            <div className={`flex items-center ${terminalLines[currentLineIndex].color}`}>
              <span className="text-gray-600 mr-3">❯</span>
              {terminalLines[currentLineIndex].text.substring(0, currentCharIndex)}
              <span className="w-2 h-5 bg-white/80 animate-pulse ml-1" />
            </div>
          )}

          {/* Final Idle State */}
          {currentLineIndex === terminalLines.length && (
            <div className="flex items-center mt-4">
              <span className="text-emerald-500 mr-3">❯</span>
              <span className="text-white">_</span>
              <span className="w-2 h-5 bg-white animate-blink ml-1" />
            </div>
          )}
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
      `}</style>
    </section>
  );
}