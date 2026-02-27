'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// --- THE NEW "WELCOME" TERMINAL SEQUENCE ---
const terminalLines = [
  { text: "ssh guest@bias-coding-club.local", color: "text-gray-400" },
  { text: "requesting access... [GRANTED]", color: "text-emerald-500" },
  { text: "Loading core modules: [DSA, Next.js, Docker, Machine Learning]...", color: "text-gray-400" },
  { text: "Mounting system design frameworks... [DONE]", color: "text-gray-400" },
  { text: "==================================================", color: "text-gray-500" },
  { text: "> WELCOME TO THE BIAS CODING CLUB.", color: "text-white font-bold" },
  { text: "> We don't just write code. We build the future.", color: "text-white" },
  { text: "==================================================", color: "text-gray-500" },
  { text: "Type 'help' to see available commands, or scroll to continue.", color: "text-gray-500 text-sm" },
];

export default function Terminal() {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  // Typewriter Engine
  useEffect(() => {
    if (currentLineIndex < terminalLines.length) {
      const currentFullText = terminalLines[currentLineIndex].text;
      
      if (currentCharIndex < currentFullText.length) {
        const timeout = setTimeout(() => {
          setCurrentCharIndex((prev) => prev + 1);
        }, 30); // Typing speed
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setDisplayedLines((prev) => [...prev, currentFullText]);
          setCurrentLineIndex((prev) => prev + 1);
          setCurrentCharIndex(0);
        }, 300); // Pause before next line
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
        className="w-full max-w-4xl h-[60vh] md:h-[70vh] flex flex-col rounded-lg overflow-hidden border border-white/5 bg-[#0a0a0a] shadow-[0_0_60px_rgba(0,0,0,0.6)]"
      >
        {/* Minimalist Stealth Top Bar */}
        <div className="h-8 w-full bg-[#111] flex items-center px-4 justify-start gap-1.5 border-b border-white/5">
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <span className="ml-4 text-[10px] text-gray-500 uppercase tracking-widest">root@bias-server:~</span>
        </div>

        {/* Typing Area */}
        <div className="flex-1 p-6 md:p-10 text-sm md:text-base overflow-y-auto leading-relaxed">
          {displayedLines.map((line, idx) => (
            <div key={idx} className={`mb-2 ${terminalLines[idx].color}`}>
              {/* Only show the arrow prompt on the first line or specific command lines if you want, but for a clean look we hide it on the banner */}
              {idx === 0 && <span className="text-gray-600 mr-3">❯</span>}
              {line}
            </div>
          ))}

          {/* Current Typing Line */}
          {currentLineIndex < terminalLines.length && (
            <div className={`flex items-center ${terminalLines[currentLineIndex].color}`}>
              {currentLineIndex === 0 && <span className="text-gray-600 mr-3">❯</span>}
              {terminalLines[currentLineIndex].text.substring(0, currentCharIndex)}
              <span className="w-2 h-5 bg-white/80 animate-pulse ml-1" />
            </div>
          )}

          {/* Final Idle State */}
          {currentLineIndex === terminalLines.length && (
            <div className="flex items-center mt-4">
              <span className="text-emerald-500 mr-3">❯</span>
              <span className="w-2 h-5 bg-white animate-blink" />
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