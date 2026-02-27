'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroScroller() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const frameCount = 240;
    // Maps index to your /public/Hero/1.jpg -> 240.jpg
    const currentFrame = (index: number) => `/Hero/${index}.jpg`;

    const images: HTMLImageElement[] = [];
    const sequence = { frame: 1 };

    // 1. Preload Images into memory
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);
    }

    // 2. Responsive Canvas Rendering Logic
    const render = () => {
      const img = images[sequence.frame - 1];
      if (!img || !img.complete) return;

      // Update canvas size to match the viewport dynamically
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Mathematical logic to simulate "object-fit: cover" for canvas
      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.max(hRatio, vRatio); // Use max to cover, min to contain
      const centerShift_x = (canvas.width - img.width * ratio) / 2;
      const centerShift_y = (canvas.height - img.height * ratio) / 2;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        centerShift_x,
        centerShift_y,
        img.width * ratio,
        img.height * ratio
      );
    };

    // Render the first frame immediately upon load
    images[0].onload = render;
    
    // Re-render if the user resizes their window
    window.addEventListener('resize', render);

    // 3. GSAP ScrollTrigger Setup
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1, // '1' adds a slight delay for ultra-smooth buttery scrolling
      },
    });

    tl.to(sequence, {
      frame: frameCount,
      snap: 'frame',
      ease: 'none',
      onUpdate: render,
    });

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', render);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-[500vh] bg-[#050505]">
      {/* The sticky container holds everything in view while the user scrolls down the 500vh container */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        
        {/* Canvas for the Image Sequence */}
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />

        {/* Dark Vignette Overlay: Ensures text is always readable over bright parts of the images */}
        <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none"></div>

        {/* Premium Typography Layer */}
        <div className="relative z-20 text-center flex flex-col items-center px-4 pointer-events-none">
          <p className="text-gray-400 uppercase tracking-[0.3em] text-xs md:text-sm font-semibold mb-4 drop-shadow-md">
            Birla Institute of Applied Sciences
          </p>
          <h1 className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 tracking-tight drop-shadow-2xl">
            CODING CLUB
          </h1>
          <p className="mt-6 text-gray-300 max-w-lg text-sm md:text-base font-medium leading-relaxed">
            Build the future. Scroll to deconstruct the boundaries of technology.
          </p>
        </div>
        
      </div>
    </div>
  );
}