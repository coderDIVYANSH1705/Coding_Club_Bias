"use client";
import { motion, useMotionValue } from "framer-motion";
import { useState, useEffect, useRef, ReactNode, CSSProperties, MouseEvent } from "react";

type TerminalLine = {
  text: string;
  delay: number;
  indent?: boolean;
  green?: boolean;
};

type GlowCardProps = {
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
};

const TERMINAL_LINES: TerminalLine[] = [
  { text: "root@bias-club:~$ ./init.sh", delay: 0 },
  { text: "Initializing BIAS club protocols...", delay: 600, indent: true },
  { text: "Loading developer modules...", delay: 1100, indent: true },
  { text: "", delay: 1600 },
  { text: "root@bias-club:~$ status --verbose", delay: 1900 },
  { text: "STATUS   : ACTIVE ✓", delay: 2500, indent: true },
  { text: "MEMBERS  : 200+", delay: 2900, indent: true },
  { text: "UPTIME   : 4 yrs", delay: 3200, indent: true },
  { text: "", delay: 3600 },
  { text: "root@bias-club:~$ cat objective.txt", delay: 3800 },
  { text: "Dominate the tech landscape.", delay: 4400, indent: true, green: true },
];

const DOMAINS = [
  "Data Structures", "Algorithms", "Full-Stack Dev",
  "Machine Learning", "Web3 / Blockchain", "System Design",
  "Cybersecurity", "Open Source",
];

const METRICS = [
  { value: "200+", label: "Members" },
  { value: "40+",  label: "Projects Shipped" },
  { value: "12",   label: "Hackathons Won" },
  { value: "∞",    label: "Lines of Code" },
];

/* ── Glow card wrapper ── */
function GlowCard({ className = "", children, style = {} }: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue("50%");
  const my = useMotionValue("50%");

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(((e.clientX - rect.left) / rect.width) * 100 + "%");
    my.set(((e.clientY - rect.top)  / rect.height) * 100 + "%");
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden border border-[rgba(0,255,65,0.18)] bg-[#070707] transition-[border-color,box-shadow] duration-500
        hover:border-[rgba(0,255,65,0.6)] hover:shadow-[0_0_30px_rgba(0,255,65,0.12),inset_0_0_40px_rgba(0,255,65,0.03)]
        group ${className}`}
      style={style}
    >
      {/* radial mouse glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${mx.get()} ${my.get()}, rgba(0,255,65,0.06) 0%, transparent 60%)`,
        }}
      />
      {/* corner bracket */}
      <div className="pointer-events-none absolute top-0 right-0 w-10 h-10 border-t border-r border-[#00FF41] opacity-0 group-hover:opacity-60 group-hover:w-12 group-hover:h-12 transition-all duration-500" />
      {children}
    </motion.div>
  );
}

/* ── Terminal card ── */
function TerminalCard() {
  const [lines, setLines] = useState<TerminalLine[]>([]);

  useEffect(() => {
    const timers = TERMINAL_LINES.map((line) =>
      setTimeout(() => setLines((prev) => [...prev, line]), line.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <GlowCard className="flex flex-col p-7 bg-[#030303]" style={{ gridColumn: "span 5", gridRow: "span 2" }}>
      {/* title bar */}
      <div className="flex items-center justify-between border-b border-[rgba(0,255,65,0.18)] pb-4 mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-[10px] text-[#505050] font-mono">bias-club — zsh</span>
        </div>
        <span className="text-[9px] text-[#404040] font-mono">127.0.0.1</span>
      </div>

      {/* output */}
      <div className="flex-1 overflow-hidden font-mono text-[11px] leading-loose">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={`${line.indent ? "pl-3" : ""} ${line.green ? "text-[#00FF41]" : "text-[rgba(0,255,65,0.72)]"}`}
          >
            {line.text || "\u00A0"}
          </motion.div>
        ))}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="inline-block w-2 h-3 bg-[#00FF41] align-middle ml-0.5"
        />
      </div>
    </GlowCard>
  );
}

/* ── Animated counter ── */
function AnimatedCounter({ target = 200, duration = 1800, suffix = "+" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    function step(ts: number) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    }
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return <>{count}{suffix}</>;
}

/* ── Main export ── */
export default function AboutBento() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 24 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring" as const, stiffness: 90, damping: 18 } 
    },
  };

  return (
    <section
      id="about"
      className="relative w-full min-h-screen bg-[#020202] text-white font-mono py-24 px-6 md:px-12 overflow-hidden"
    >
      {/* scanlines */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,65,0.012) 2px,rgba(0,255,65,0.012) 4px)",
        }}
      />
      {/* noise */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full">

        {/* ── HEADER ── */}
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-3 text-[10px] tracking-[0.3em] uppercase text-[#505050]">
            <span className="inline-block w-8 h-px bg-[#00FF41] opacity-50" />
            BIAS Coding Club — System Overview
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#00FF41] tracking-tighter leading-none">
            <span className="text-[#404040] font-normal">&gt;&nbsp;</span>
            cat about_club.md
          </h2>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-[#505050] tracking-widest">
            <motion.span
              animate={{ opacity: [1, 0.2] }}
              transition={{ duration: 1.8, repeat: Infinity, repeatType: "reverse" }}
              className="inline-block w-1.5 h-1.5 rounded-full bg-[#00FF41]"
            />
            Core directives &amp; operational capacity — last updated 2026
          </div>
        </motion.header>

        {/* ── BENTO GRID ── */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-fr"
        >

          {/* MISSION — col-span-7 row-span-2 */}
          <motion.div variants={item} className="md:col-span-7 md:row-span-2">
            <GlowCard className="h-full p-8 flex flex-col justify-between">
              <div>
                <p className="flex items-center gap-2 text-[9px] tracking-[0.25em] uppercase text-[#00FF41] mb-5">
                  <span className="inline-block w-1.5 h-1.5 border border-[#00FF41] rotate-45" />
                  Core_Mission
                </p>
                <h4 className="text-2xl md:text-3xl font-semibold leading-snug text-[#e8e8e8] mb-5 tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Bridging the gap between raw theory and{" "}
                  <em className="not-italic text-[#00FF41]">real-world deployment.</em>
                </h4>
                <div className="space-y-3 text-[12px] text-[#707070] leading-relaxed max-w-xl">
                  <p>The BIAS Coding Club is not just a study group — it is a deployment facility. We exist to transform students into engineers capable of architecture, optimization, and scaling.</p>
                  <p>Whether competing in global hackathons, contributing to high-impact open-source repositories, or mastering algorithmic complexities, our community pushes the boundaries of what college developers can build.</p>
                </div>
              </div>
              {/* metrics row */}
              <div className="mt-8 pt-6 border-t border-[rgba(0,255,65,0.15)] grid grid-cols-4 gap-4">
                {METRICS.map((m) => (
                  <div key={m.label}>
                    <div className="text-2xl font-bold text-[#00FF41] leading-none">{m.value}</div>
                    <div className="mt-1 text-[9px] uppercase tracking-widest text-[#505050]">{m.label}</div>
                  </div>
                ))}
              </div>
              {/* bottom bar */}
              <div className="absolute bottom-0 left-0 h-0.5 w-3/5 bg-linear-to-r from-[#00FF41] to-transparent opacity-30 pointer-events-none" />
            </GlowCard>
          </motion.div>

          {/* TERMINAL — col-span-5 row-span-2 */}
          <motion.div variants={item} className="md:col-span-5 md:row-span-2">
            <TerminalCard />
          </motion.div>

          {/* DOMAINS — col-span-5 */}
          <motion.div variants={item} className="md:col-span-5">
            <GlowCard className="h-full p-7">
              <p className="flex items-center gap-2 text-[9px] tracking-[0.25em] uppercase text-[#00FF41] mb-5">
                <span className="inline-block w-1.5 h-1.5 border border-[#00FF41] rotate-45" />
                Active_Domains
              </p>
              <div className="flex flex-wrap gap-2">
                {DOMAINS.map((d) => (
                  <span
                    key={d}
                    className="relative overflow-hidden px-3 py-1.5 border border-[rgba(0,255,65,0.2)] text-[10px] text-[#707070] uppercase tracking-wider
                      hover:border-[#00FF41] hover:text-[#00FF41] cursor-crosshair transition-all duration-300
                      before:absolute before:inset-0 before:bg-[rgba(0,255,65,0.05)] before:-translate-x-full hover:before:translate-x-0 before:transition-transform before:duration-300"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </GlowCard>
          </motion.div>

          {/* STAT — col-span-3 */}
          <motion.div variants={item} className="md:col-span-3">
            <GlowCard className="h-full p-7 bg-[#0c0c0c] flex flex-col items-center justify-center text-center">
              <div
                className="text-6xl font-bold text-[#00FF41] leading-none tracking-tighter"
                style={{ textShadow: "0 0 40px rgba(0,255,65,0.3)" }}
              >
                <AnimatedCounter target={200} />
              </div>
              <div className="mt-3 text-[8px] uppercase tracking-[0.3em] text-[#505050]">Active Members</div>
            </GlowCard>
          </motion.div>

          {/* CTA — col-span-4 */}
          <motion.div variants={item} className="md:col-span-4">
            <GlowCard className="h-full p-7 flex flex-col justify-between">
              <div>
                <p className="flex items-center gap-2 text-[9px] tracking-[0.25em] uppercase text-[#00FF41] mb-3">
                  <span className="inline-block w-1.5 h-1.5 border border-[#00FF41] rotate-45" />
                  Current_Focus
                </p>
                <div className="text-[15px] font-semibold text-[#e8e8e8] leading-snug mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Competitive Programming Regionals 2025
                </div>
                <div className="text-[11px] text-[#606060] leading-relaxed">
                  Sharpening algorithms, optimizing runtimes, and preparing the next generation of competitive engineers.
                </div>
              </div>
             
             
            </GlowCard>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}