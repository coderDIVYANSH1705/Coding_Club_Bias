'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export default function ScrollSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const frameCount = 240;

  // Draw a frame onto the canvas
  const renderFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const img = imagesRef.current[index];
    if (!img || img.width === 0 || img.height === 0) return;

    // FIX #1: Always sync canvas pixel dimensions to its display size
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);

    // object-fit: cover math
    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const x = (canvas.width - img.width * scale) / 2;
    const y = (canvas.height - img.height * scale) / 2;

    context.drawImage(img, x, y, img.width * scale, img.height * scale);
  }, []);

  // 1. Preload all images
  useEffect(() => {
    let loadedCount = 0;
    const imgArray: HTMLImageElement[] = new Array(frameCount);

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          imagesRef.current = imgArray;
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        console.error(`Failed to load image ${i + 1}`);
        if (loadedCount === frameCount) {
          imagesRef.current = imgArray;
          setImagesLoaded(true);
        }
      };
      img.src = `/TechCentre/${i + 1}.jpg`;
      imgArray[i] = img;
    }
  }, []);

  // Render first frame once images load
  useEffect(() => {
    if (imagesLoaded) {
      renderFrame(0);
    }
  }, [imagesLoaded, renderFrame]);

  // 2. Scroll & Resize handlers
  useEffect(() => {
    if (!imagesLoaded) return;

    const handleScroll = () => {
      // FIX #2: Use document scroll height, not containerRef.scrollHeight
      const scrollTop = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      const scrollFraction = maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0;

      // FIX #3: Correct frame index mapping
      const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(scrollFraction * frameCount)
      );

      if (frameIndex === currentFrameRef.current) return; // no change, skip
      currentFrameRef.current = frameIndex;

      // FIX #4: Cancel pending RAF before scheduling new one
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        renderFrame(frameIndex);
        rafRef.current = null;
      });
    };

    const handleResize = () => {
      // FIX #5: On resize, re-render current frame (not always frame 0)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        renderFrame(currentFrameRef.current);
        rafRef.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [imagesLoaded, renderFrame]);

  return (
    // h-[400vh] gives scroll room for 240 frames
    <div ref={containerRef} className="relative w-full h-[400vh] bg-black">

      {/* Sticky viewport */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">

        {/*
          FIX #6: Remove w-full h-full from canvas — these CSS classes override
          the canvas element size and cause blurry rendering / dimension mismatch.
          Use absolute positioning instead so it fills the container correctly.
        */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            willChange: 'transform', // GPU hint for smoother rendering
          }}
        />

        {/* Optional dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />

        {/* Loading indicator */}
        {!imagesLoaded && (
          <div className="absolute inset-0 flex items-center justify-center z-50">
            <div className="text-white text-center">
              <div className="mb-4 text-[#00ff88] text-lg font-semibold">Loading...</div>
              <div className="w-8 h-8 border-2 border-[#00ff88] border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          </div>
        )}

        {/* Overlay Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center pointer-events-none z-10">
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mix-blend-overlay">
            Code The Future
          </h1>
          <p className="mt-4 text-xl md:text-2xl font-light text-gray-300 max-w-2xl px-4 drop-shadow-lg">
            Join the elite minds shaping tomorrow&apos;s digital landscape.
          </p>
        </div>

      </div>
    </div>
  );
}