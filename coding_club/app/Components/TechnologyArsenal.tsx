'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';

const ALL_TECHS = [
  { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', invert: false },
  { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', invert: true },
  { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', invert: false },
  { name: 'Tailwind', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg', invert: false },
  { name: 'VHDL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ieee/ieee-original.svg', invert: true },
  { name: 'Vite', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg', invert: false },
  { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', invert: false },
  { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', invert: false },
  { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', invert: false },
  { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', invert: false },
  { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', invert: false },
  { name: 'GraphQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg', invert: false },
  { name: 'C++', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg', invert: false },
  { name: 'AWS', icon: 'https://cdn.worldvectorlogo.com/logos/aws-2.svg', invert: true },
  { name: 'Redis', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg', invert: false },
  { name: 'Framer', icon: 'https://cdn.worldvectorlogo.com/logos/framer-motion.svg', invert: false },
  { name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg', invert: false },
  { name: 'Android', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg', invert: false },
  { name: 'DSA', icon: 'https://cdn-icons-png.flaticon.com/512/2103/2103633.png', invert: true },
  { name: 'Linux', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg', invert: false },
  { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', invert: false },
  { name: 'Three.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg', invert: true },
  { name: 'System Design', icon: 'https://cdn-icons-png.flaticon.com/512/3665/3665925.png', invert: true },
  { name: 'Figma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg', invert: false },
  { name: 'PyTorch', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg', invert: false },
  { name: 'TensorFlow', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg', invert: false },
  { name: 'Blender', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blender/blender-original.svg', invert: false },
  { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg', invert: false },
  { name: 'Bash', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg', invert: false },
  { name: 'Kubernetes', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg', invert: false }
];

const LEFT_TECHS = ALL_TECHS.slice(0, 15);
const RIGHT_TECHS = ALL_TECHS.slice(15);

const TechNode = ({ tech, index, total, wheelRotation }: { tech: any, index: number, total: number, wheelRotation: MotionValue<number> }) => {
  const angle = (index / total) * 360;
  const counterRotation = useTransform(wheelRotation, (r) => -r - angle);

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ transform: `rotate(${angle}deg)` }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
        <motion.div style={{ rotate: counterRotation }}>
          <div className="group relative w-12 h-12 md:w-20 md:h-20 bg-zinc-950 border border-white/10 hover:border-red-600 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 cursor-pointer">
            <img src={tech.icon} alt={tech.name} className={`w-6 h-6 md:w-10 md:h-10 object-contain ${tech.invert ? 'invert opacity-70' : ''}`} />
            <div className="absolute top-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
              <span className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded tracking-wider whitespace-nowrap uppercase">
                {tech.name}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const ScrollWheel = ({ side, techs, progress }: { side: 'left' | 'right', techs: any[], progress: MotionValue<number> }) => {
  const isLeft = side === 'left';
  const rawRotation = useTransform(progress, [0, 1], [0, isLeft ? 360 : -360]);
  
  // ULTRA SMOOTH PHYSICS: Lower stiffness and higher damping for that "liquid" feel
  const smoothRotation = useSpring(rawRotation, { 
    stiffness: 25, 
    damping: 15, 
    mass: 0.5,
    restDelta: 0.001 
  });

  const sizeClasses = "w-[650px] h-[650px] md:w-[1100px] md:h-[1100px]";
  const positionClasses = isLeft ? "-left-[280px] md:-left-[450px]" : "-right-[280px] md:-right-[450px]";

  return (
    <div className={`absolute top-1/2 -translate-y-1/2 ${sizeClasses} ${positionClasses} z-20`}>
      <div className="absolute inset-0 rounded-full border border-white/5 bg-black/40 backdrop-blur-3xl" />
      <div className="absolute inset-10 rounded-full border border-dashed border-red-500/10" />
      <motion.div style={{ rotate: smoothRotation }} className="w-full h-full relative">
        {techs.map((tech, i) => (
          <TechNode key={tech.name} tech={tech} index={i} total={techs.length} wheelRotation={smoothRotation} />
        ))}
      </motion.div>
    </div>
  );
};

export default function SmoothTechArsenal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const textOpacity = useTransform(scrollYProgress, [0.85, 1], [1, 0]);

  return (
    <div ref={containerRef} className="relative w-full h-[400vh] bg-[#030303]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* REVERTED TO RED GRADIENT MASK */}
        <div className="absolute inset-0 z-10 pointer-events-none" style={{ maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)' }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[700px] md:h-[700px] bg-red-600/15 blur-[140px] rounded-full" />
          <ScrollWheel side="left" techs={LEFT_TECHS} progress={scrollYProgress} />
          <ScrollWheel side="right" techs={RIGHT_TECHS} progress={scrollYProgress} />
        </div>

        {/* Center Content */}
        <motion.div style={{ opacity: textOpacity }} className="relative z-30 text-center max-w-2xl px-6 pointer-events-none">
          <div className="inline-flex items-center gap-3 px-5 py-2 mb-8 rounded-full border border-red-500/20 bg-zinc-950/90 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="text-zinc-400 text-xs font-bold tracking-[0.2em] uppercase">The Tech Ecosystem</span>
          </div>

          <h2 className="text-6xl md:text-9xl font-black text-white uppercase tracking-tighter leading-none mb-8">
            Digital <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-700 to-red-900">
              Arsenal
            </span>
          </h2>

          <p className="text-zinc-500 text-lg md:text-xl font-light leading-relaxed max-w-sm mx-auto">
            Engineered with high-performance frameworks and low-level precision.
          </p>
        </motion.div>

        {/* Side Masks */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#030303] to-transparent z-40" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#030303] to-transparent z-40" />
      </div>
    </div>
  );
}