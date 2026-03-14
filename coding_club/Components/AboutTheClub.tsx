"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type FileKey = "MISSION" | "TECH_STACK" | "VISION";

const FILE_CONTENT: Record<FileKey, { fileName: string; code: string }> = {
  MISSION: {
    fileName: "about_club.md",
    code: `### BIAS Coding Club Mainframe

> **Status:** ACTIVE
> **Objective:** Bridge the gap between theory and deployment.

We are a high-octane community of developers, problem-solvers, and tech enthusiasts. 
We don't just write code; we build scalable architectures, solve complex 
algorithmic challenges, and explore the frontiers of AI and Web3.

\`\`\`bash
$ ./run-innovation.sh --all
\`\`\``,
  },
  TECH_STACK: {
    fileName: "stack.json",
    code: `{
  "core": ["Next.js", "TypeScript", "Tailwind"],
  "backend": ["Supabase", "PostgreSQL", "FastAPI"],
  "specializations": [
    "Machine Learning",
    "Smart Contracts",
    "Competitive Programming"
  ],
  "latency": "12ms",
  "uptime": "99.99%"
}`,
  },
  VISION: {
    fileName: "vision.ts",
    code: `interface ClubGoal {
  impact: "Global" | "Campus";
  innovation: boolean;
}

const 2026_Vision: ClubGoal = {
  impact: "Global",
  innovation: true
};

// Continuous improvement loop
while (innovation) {
  build();
  break();
  deploy();
}`,
  },
};

const TERMINAL_LOGS = [
  "[INFO] Initializing quantum mesh...",
  "[WARN] High brainpower density detected.",
  "[INFO] Compiling innovation.exe",
  "[DEBUG] Checking stack overflow protocols...",
  "[INFO] Deployment successful to Vercel.",
  "[SYSTEM] Syncing with Supabase DB...",
  "[INFO] New member authenticated: @root",
  "[WARN] Time-complexity anomaly at line 42",
];

export default function AboutIDE() {
  const [activeFile, setActiveFile] = useState<FileKey>("MISSION");
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Simulate a live terminal stream
  useEffect(() => {
    const interval = setInterval(() => {
      setLogs((prev) => {
        const newLogs = [...prev, TERMINAL_LOGS[Math.floor(Math.random() * TERMINAL_LOGS.length)]];
        if (newLogs.length > 20) return newLogs.slice(1);
        return newLogs;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll terminal
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <section id="about" className="w-full min-h-screen bg-black py-20 px-4 md:px-12 flex items-center justify-center font-mono overflow-hidden">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-0 border border-[#00FF41]/30 rounded-lg overflow-hidden shadow-[0_0_40px_rgba(0,255,65,0.1)] bg-[#050505]">
        
        {/* --- COLUMN 1: EXPLORER (3/12) --- */}
        <div className="lg:col-span-3 border-r border-[#00FF41]/20 bg-[#080808] p-4 hidden md:block">
          <h3 className="text-gray-500 text-[10px] uppercase tracking-widest mb-4">Explorer</h3>
          <div className="space-y-2">
            {(Object.keys(FILE_CONTENT) as FileKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setActiveFile(key)}
                className={`w-full text-left px-3 py-1.5 text-xs rounded transition-all flex items-center gap-2 ${
                  activeFile === key ? "bg-[#00FF41]/10 text-[#00FF41]" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                <span className="opacity-50">{activeFile === key ? "▼" : "▶"}</span>
                {FILE_CONTENT[key].fileName}
              </button>
            ))}
          </div>
        </div>

        {/* --- COLUMN 2: EDITOR (6/12) --- */}
        <div className="lg:col-span-6 bg-[#020202] p-6 relative flex flex-col min-h-[400px]">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#00FF41]/10"></div>
          
          {/* Editor Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/40"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/40"></div>
            </div>
            <span className="text-[10px] text-gray-500 uppercase tracking-tighter">
              main_editor -- {FILE_CONTENT[activeFile].fileName}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeFile}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex-1 whitespace-pre-wrap text-sm md:text-base leading-relaxed text-gray-300"
            >
              <span className="text-[#00FF41]/50 mr-4">1</span>
              {FILE_CONTENT[activeFile].code.split("\n").map((line, i) => (
                <div key={i} className="flex hover:bg-[#00FF41]/5 px-2 -mx-2 transition-colors">
                  <span className="text-[#00FF41]/20 w-8 inline-block select-none">{i + 2}</span>
                  <p className={line.startsWith(">") ? "text-[#00FF41]" : "text-gray-300"}>
                    {line}
                  </p>
                </div>
              ))}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-2 h-5 bg-[#00FF41] align-middle ml-1"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* --- COLUMN 3: LIVE TERMINAL (3/12) --- */}
        <div className="lg:col-span-3 border-l border-[#00FF41]/20 bg-[#080808] p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-500 text-[10px] uppercase tracking-widest">Live_Terminal</h3>
            <div className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse"></div>
          </div>
          
          <div 
            ref={scrollRef}
            className="flex-1 text-[10px] space-y-1.5 overflow-y-auto max-h-[300px] md:max-h-full custom-scrollbar"
          >
            {logs.map((log, i) => (
              <motion.p
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                key={i}
                className={log.includes("WARN") ? "text-yellow-500/80" : log.includes("INFO") ? "text-[#00FF41]/60" : "text-red-500/80"}
              >
                {log}
              </motion.p>
            ))}
            <p className="text-[#00FF41] animate-pulse">_</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 255, 65, 0.1);
        }
      `}</style>
    </section>
  );
}