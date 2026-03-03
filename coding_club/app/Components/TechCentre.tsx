'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// ─── Text phases shown during scroll ─────────────────────────────────────────
const PHASES = [
  {
    range: [0, 0.25],
    heading: 'Code The Future',
    sub: 'Where innovation meets execution. Welcome to the epicentre of tech.',
  },
  {
    range: [0.25, 0.5],
    heading: 'Build Without Limits',
    sub: 'Modern tools. Real-world problems. Infinite possibilities waiting for you.',
  },
  {
    range: [0.5, 0.75],
    heading: 'Collaborate & Grow',
    sub: 'Work alongside the sharpest minds. Every line of code, a step forward.',
  },
  {
    range: [0.75, 1.01],
    heading: 'Your Journey Starts Here',
    sub: 'Join the elite community redefining what\'s possible in the digital age.',
  },
];

export default function ScrollSequence() {
  const canvasRef       = useRef<HTMLCanvasElement>(null);
  const containerRef    = useRef<HTMLDivElement>(null);
  const imagesRef       = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef          = useRef<number | null>(null);

  const [loadProgress, setLoadProgress] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [scrollFrac, setScrollFrac]     = useState(0);
  const [phaseVisible, setPhaseVisible] = useState(true);

  const frameCount = 240;

  // ── Draw a single frame ───────────────────────────────────────────────────
  const renderFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[index];
    if (!img || img.naturalWidth === 0) return;

    const dw = canvas.clientWidth;
    const dh = canvas.clientHeight;
    if (canvas.width !== dw || canvas.height !== dh) {
      canvas.width  = dw;
      canvas.height = dh;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
    const x = (canvas.width  - img.naturalWidth  * scale) / 2;
    const y = (canvas.height - img.naturalHeight * scale) / 2;
    ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
  }, []);

  const getPhase = (frac: number) =>
    PHASES.find(p => frac >= p.range[0] && frac < p.range[1]) ?? PHASES[PHASES.length - 1];

  // ── 1. Preload all images — render frame 0 as soon as it's ready ──────────
  useEffect(() => {
    let loadedCount = 0;
    const total = frameCount;
    const imgArray: HTMLImageElement[] = new Array(total);
    imagesRef.current = imgArray;

    for (let i = 0; i < total; i++) {
      const img = new Image();
      const idx = i;

      const onDone = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / total) * 100));

        // Render frame 0 as soon as the first image loads
        if (idx === 0 && img.naturalWidth > 0) {
          renderFrame(0);
        }

        if (loadedCount === total) {
          setImagesLoaded(true);
        }
      };

      img.onload  = onDone;
      img.onerror = onDone;
      img.src     = `/TechCentre/${i + 1}.jpg`;
      imgArray[i] = img;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── 2. Scroll lock: body scrolling disabled until all images are loaded ───
  useEffect(() => {
    if (!imagesLoaded) {
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = '';
      renderFrame(0);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [imagesLoaded, renderFrame]);

  // ── 3. Scroll & resize handlers ──────────────────────────────────────────
  useEffect(() => {
    if (!imagesLoaded) return;

    let lastPhaseIdx = 0;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const frac      = maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0;

      setScrollFrac(frac);

      // Cross-fade text when phase changes
      const newPhaseIdx = PHASES.findIndex(p => frac >= p.range[0] && frac < p.range[1]);
      if (newPhaseIdx !== -1 && newPhaseIdx !== lastPhaseIdx) {
        setPhaseVisible(false);
        setTimeout(() => setPhaseVisible(true), 180);
        lastPhaseIdx = newPhaseIdx;
      }

      const frameIndex = Math.min(frameCount - 1, Math.floor(frac * frameCount));
      if (frameIndex === currentFrameRef.current) return;
      currentFrameRef.current = frameIndex;

      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        renderFrame(frameIndex);
        rafRef.current = null;
      });
    };

    const handleResize = () => {
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

  // ── Derived values ────────────────────────────────────────────────────────
  const phase       = getPhase(scrollFrac);
  const arrowOpacity = Math.max(0, 1 - scrollFrac * 15);

  return (
    // 600vh = plenty of scroll room for 240 frames + comfortable pacing
    <div ref={containerRef} className="relative w-full bg-black" style={{ height: '600vh' }}>

      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position:   'absolute',
            inset:      0,
            width:      '100%',
            height:     '100%',
            willChange: 'contents',
          }}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.7) 100%)',
          }}
        />

        {/* ── Loading Screen ──────────────────────────────────────────────── */}
        {!imagesLoaded && (
          <div
            className="absolute inset-0 z-50 flex flex-col items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)' }}
          >
            <div className="text-center px-8 w-full max-w-xs">
              <div
                className="text-4xl font-black uppercase tracking-widest mb-1"
                style={{ color: '#00ff88' }}
              >
                Tech Centre
              </div>
              <p className="text-gray-500 text-xs mb-10 tracking-widest uppercase">
                Preparing your experience
              </p>

              {/* Progress bar */}
              <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full rounded-full"
                  style={{
                    width:      `${loadProgress}%`,
                    background: '#00ff88',
                    transition: 'width 0.15s linear',
                  }}
                />
              </div>
              <div className="text-white/30 text-xs tracking-widest">
                {loadProgress}% loaded
              </div>

              <div
                className="mt-10 w-7 h-7 rounded-full border-2 border-t-transparent animate-spin mx-auto"
                style={{ borderColor: '#00ff88', borderTopColor: 'transparent' }}
              />
            </div>
          </div>
        )}

        {/* ── Dynamic Text (shown while scrolling) ────────────────────────── */}
        {imagesLoaded && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center text-white text-center pointer-events-none z-10 px-6"
            style={{
              opacity:    phaseVisible ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          >
            {/* Badge */}
            <div
              className="mb-5 px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-[0.2em]"
              style={{
                background: 'rgba(0,255,136,0.12)',
                color:      '#00ff88',
                border:     '1px solid rgba(0,255,136,0.25)',
              }}
            >
              Tech Centre
            </div>

            {/* Heading */}
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-none tracking-tighter"
              style={{ textShadow: '0 2px 40px rgba(0,0,0,0.7)' }}
            >
              {phase.heading}
            </h1>

            {/* Subtitle */}
            <p className="mt-5 text-base md:text-xl font-light text-gray-300 max-w-xl leading-relaxed">
              {phase.sub}
            </p>

            {/* Phase indicator dots */}
            <div className="mt-8 flex items-center gap-2">
              {PHASES.map((p, i) => {
                const active = phase === p;
                return (
                  <div
                    key={i}
                    className="rounded-full transition-all duration-500"
                    style={{
                      width:      active ? 28 : 8,
                      height:     8,
                      background: active ? '#00ff88' : 'rgba(255,255,255,0.25)',
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* ── Scroll hint arrow ───────────────────────────────────────────── */}
        {imagesLoaded && (
          <div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none z-20"
            style={{ opacity: arrowOpacity, transition: 'opacity 0.4s' }}
          >
            <span className="text-white/40 text-[10px] tracking-[0.25em] uppercase">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
            <svg
              width="14" height="9" viewBox="0 0 14 9" fill="none"
              className="animate-bounce"
            >
              <path
                d="M1 1L7 7L13 1"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}

        {/* ── Scroll progress bar at very bottom ──────────────────────────── */}
        {imagesLoaded && (
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/[0.07] z-20">
            <div
              style={{
                height:     '100%',
                width:      `${scrollFrac * 100}%`,
                background: '#00ff88',
                transition: 'none',
              }}
            />
          </div>
        )}

      </div>
    </div>
  );
}