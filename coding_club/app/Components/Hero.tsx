'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroScroller() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Refs for our animated text elements
  const textCenterRef = useRef<HTMLDivElement>(null);
  const textLeftRef = useRef<HTMLDivElement>(null);
  const textRightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const frameCount = 240;
    const currentFrame = (index: number) => `/Hero/${index}.jpg`;
    const images: HTMLImageElement[] = [];
    const sequence = { frame: 1 };

    // 1. Preload Images
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);
    }

    // 2. Responsive Canvas Rendering
    const render = () => {
      const img = images[sequence.frame - 1];
      if (!img || !img.complete) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.max(hRatio, vRatio);
      const centerShift_x = (canvas.width - img.width * ratio) / 2;
      const centerShift_y = (canvas.height - img.height * ratio) / 2;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(
        img, 0, 0, img.width, img.height,
        centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
      );
    };

    images[0].onload = render;
    window.addEventListener('resize', render);

    // 3. GSAP Master Timeline using gsap.context for React cleanup
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1, // Buttery smooth scrubbing
        },
      });

      // We assign an arbitrary duration of 10 to the whole sequence to make math easy
      tl.to(sequence, {
        frame: frameCount,
        snap: 'frame',
        ease: 'none',
        onUpdate: render,
        duration: 10 
      }, 0); // The '0' means this starts at the very beginning of the scroll

      // --- TEXT ANIMATION SEQUENCE ---

      // Phase 1: Center Text fades out and moves up (Time 0 to 1.5)
      tl.to(textCenterRef.current, { 
        opacity: 0, 
        y: -100, 
        duration: 1.5, 
        ease: "power2.inOut" 
      }, 0);

      // Phase 2: Left Text slides in (Time 1.5 to 3), stays, then fades out (Time 4.5 to 6)
      tl.fromTo(textLeftRef.current, 
        { opacity: 0, x: -80 }, 
        { opacity: 1, x: 0, duration: 1.5, ease: "power2.out" }, 
        1.5
      );
      tl.to(textLeftRef.current, { 
        opacity: 0, 
        x: -80, 
        duration: 1.5, 
        ease: "power2.in" 
      }, 4.5);

      // Phase 3: Right Text slides in (Time 6 to 7.5), then changes color (Time 7.5 to 10)
      tl.fromTo(textRightRef.current, 
        { opacity: 0, x: 80, color: "#ffffff" }, 
        { opacity: 1, x: 0, duration: 1.5, ease: "power2.out" }, 
        6
      );
      // Change the text to a vibrant cyan/electric blue as you reach the end of the scroll
      tl.to(textRightRef.current, { 
        color: "#00E5FF", 
        duration: 2.5, 
        ease: "none" 
      }, 7.5);

    }, containerRef); // Scope the GSAP context to our container

    return () => {
      window.removeEventListener('resize', render);
      ctx.revert(); // Perfectly cleans up all animations when the component unmounts
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[600vh] bg-[#050505]">
      <div className="sticky top-0 w-full h-screen overflow-hidden font-sans">
        
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />
        <div className="absolute inset-0 bg-black/60 z-10 pointer-events-none"></div>

        {/* --- TEXT LAYER 1: CENTER --- */}
        <div 
          ref={textCenterRef} 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center w-full px-4 flex flex-col items-center pointer-events-none"
        >
          <p className="text-gray-400 uppercase tracking-[0.4em] text-xs md:text-sm font-semibold mb-6">
            Birla Institute of Applied Sciences
          </p>
          <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter drop-shadow-2xl">
            CODING CLUB
          </h1>
          <p className="mt-8 text-gray-300 max-w-md text-sm md:text-lg font-medium">
            Scroll to initialize the sequence.
          </p>
        </div>

        {/* --- TEXT LAYER 2: LEFT --- */}
        <div 
          ref={textLeftRef} 
          className="absolute left-6 md:left-24 top-1/2 -translate-y-1/2 z-20 max-w-xs md:max-w-md pointer-events-none opacity-0"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Architecture & <br/> Algorithms.
          </h2>
          <p className="text-gray-400 text-base md:text-xl font-light leading-relaxed">
            From intricate data structures to scalable system design, we forge developers who understand the architecture of tomorrow. We don't just write code; we build ecosystems.
          </p>
        </div>

        {/* --- TEXT LAYER 3: RIGHT --- */}
        <div 
          ref={textRightRef} 
          className="absolute right-6 md:right-24 top-1/2 -translate-y-1/2 z-20 max-w-xs md:max-w-md text-right pointer-events-none opacity-0"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Innovate.<br/> Deploy. Scale.
          </h2>
          <p className="text-gray-300 text-base md:text-xl font-light leading-relaxed">
            Push your code to the limits. Whether you are containerizing environments or training machine learning models, the terminal is yours. Join the revolution.
          </p>
        </div>
        
      </div>
    </div>
  );
}