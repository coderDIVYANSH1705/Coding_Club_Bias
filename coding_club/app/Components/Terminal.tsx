'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Terminal() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="w-full min-h-screen bg-[#050505] flex items-center justify-center p-6 md:p-20">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="w-full max-w-4xl aspect-video md:aspect-[16/9] flex flex-col rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-black/40 backdrop-blur-xl"
      >
        {/* MacOS Header */}
        <div className="h-10 w-full bg-[#1e1e1e]/80 flex items-center px-4 justify-between border-b border-white/5">
          <div className="flex gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] shadow-inner shadow-black/20" />
            <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] shadow-inner shadow-black/20" />
            <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f] shadow-inner shadow-black/20" />
          </div>
          <div className="text-xs font-medium text-gray-500 font-sans tracking-wide">
            divyansh — zsh — 80x24
          </div>
          <div className="w-12" /> {/* Spacer to center the title */}
        </div>

        {/* Terminal Body */}
        <div className="flex-1 p-5 md:p-8 font-mono text-sm md:text-base leading-relaxed overflow-y-auto custom-scrollbar">
          <div className="flex flex-col gap-2">
            <p className="text-gray-500">Last login: {new Date().toDateString()} on ttys001</p>
            
            <div className="flex flex-col gap-1 mt-2">
              <p className="text-emerald-400">
                <span className="text-blue-400">➜</span> <span className="text-cyan-400">~</span> <span className="text-gray-300">cd</span> bias-coding-club
              </p>
              
              <p className="text-emerald-400">
                <span className="text-blue-400">➜</span> <span className="text-cyan-400">bias-coding-club</span> <span className="text-purple-400">git</span>(<span className="text-red-400">main</span>) <span className="text-gray-300">ls -la</span>
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-blue-300 mt-1">
                <span>drwxr-xr-x algorithms</span>
                <span>drwxr-xr-x system-design</span>
                <span>drwxr-xr-x open-source</span>
                <span>-rw-r--r-- README.md</span>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <p className="text-yellow-400 font-bold">Initializing Club Protocol...</p>
              <p className="text-white animate-pulse">
                [########################################] 100%
              </p>
              <p className="text-white mt-4">
                Welcome to the <span className="text-emerald-400">BIAS Coding Club</span>. 
                Our mission is to bridge the gap between academic theory and industry 
                excellence through collaboration and engineering.
              </p>
            </div>

            <div className="flex items-center gap-2 mt-4 group">
              <span className="text-blue-400">➜</span> 
              <span className="text-cyan-400">~</span> 
              <span className="w-2.5 h-5 bg-white/80 animate-[blink_1s_infinite]" />
            </div>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </section>
  );
}