'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ── Pill badge used in multiple panels ───────────────────────────────────────
const Pill = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 12px',
      borderRadius: '100px',
      border: '1px solid rgba(0,229,255,0.25)',
      background: 'rgba(0,229,255,0.06)',
      color: '#00E5FF',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '0.62rem',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
    }}
  >
    {children}
  </span>
);

// ── Stat card ─────────────────────────────────────────────────────────────────
const Stat = ({ value, label }: { value: string; label: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
    <span
      style={{
        fontFamily: "'Orbitron', monospace",
        fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
        fontWeight: 900,
        background: 'linear-gradient(135deg,#fff 30%,#00E5FF)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        lineHeight: 1,
      }}
    >
      {value}
    </span>
    <span
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '0.6rem',
        color: 'rgba(255,255,255,0.35)',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </span>
  </div>
);

// ── Event card ────────────────────────────────────────────────────────────────
const EventCard = ({
  icon,
  title,
  date,
  tag,
}: {
  icon: string;
  title: string;
  date: string;
  tag: string;
}) => (
  <div
    style={{
      padding: '18px 20px',
      borderRadius: '12px',
      border: '1px solid rgba(0,229,255,0.12)',
      background: 'rgba(255,255,255,0.03)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      transition: 'border-color 0.2s',
    }}
  >
    <span style={{ fontSize: '1.4rem' }}>{icon}</span>
    <div
      style={{
        fontFamily: "'Orbitron', monospace",
        fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)',
        color: '#fff',
        fontWeight: 700,
        lineHeight: 1.3,
      }}
    >
      {title}
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.6rem',
          color: 'rgba(255,255,255,0.35)',
          letterSpacing: '0.1em',
        }}
      >
        {date}
      </span>
      <Pill>{tag}</Pill>
    </div>
  </div>
);

export default function HeroScroller() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Panel refs
  const panel0Ref = useRef<HTMLDivElement>(null); // intro
  const panel1Ref = useRef<HTMLDivElement>(null); // events
  const panel2Ref = useRef<HTMLDivElement>(null); // workshops
  const panel3Ref = useRef<HTMLDivElement>(null); // final CTA

  // Decorative line ref
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const frameCount = 240;
    const currentFrame = (index: number) => `/Hero/${index}.jpg`;
    const images: HTMLImageElement[] = [];
    const sequence = { frame: 1 };

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);
    }

    const render = () => {
      const img = images[sequence.frame - 1];
      if (!img || !img.complete) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.max(hRatio, vRatio);
      const cx = (canvas.width - img.width * ratio) / 2;
      const cy = (canvas.height - img.height * ratio) / 2;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, img.width, img.height, cx, cy, img.width * ratio, img.height * ratio);
    };

    images[0].onload = render;
    window.addEventListener('resize', render);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
        },
      });

      // Canvas frame scrub
      tl.to(sequence, { frame: frameCount, snap: 'frame', ease: 'none', onUpdate: render, duration: 10 }, 0);

      // ── Panel 0 (Intro): fade out + scale ──────────────────────────────
      tl.to(panel0Ref.current, { opacity: 0, scale: 0.92, y: -60, duration: 1.5, ease: 'power2.inOut' }, 0);

      // ── Decorative line grows across screen ────────────────────────────
      tl.fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'power2.out' }, 1.2);

      // ── Panel 1 (Events): slide in from left ───────────────────────────
      tl.fromTo(panel1Ref.current,
        { opacity: 0, x: -100, rotateY: 8 },
        { opacity: 1, x: 0, rotateY: 0, duration: 2, ease: 'power3.out' },
        1.5
      );
      tl.to(panel1Ref.current, { opacity: 0, x: -60, duration: 1.2, ease: 'power2.in' }, 4.2);

      // ── Panel 2 (Workshops): slide in from right ───────────────────────
      tl.fromTo(panel2Ref.current,
        { opacity: 0, x: 100, rotateY: -8 },
        { opacity: 1, x: 0, rotateY: 0, duration: 2, ease: 'power3.out' },
        5.5
      );
      tl.to(panel2Ref.current, { opacity: 0, y: 40, duration: 1.2, ease: 'power2.in' }, 7.8);

      // ── Panel 3 (CTA): rises from below ───────────────────────────────
      tl.fromTo(panel3Ref.current,
        { opacity: 0, y: 80, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 2, ease: 'expo.out' },
        8.5
      );

    }, containerRef);

    return () => {
      window.removeEventListener('resize', render);
      ctx.revert();
    };
  }, []);

  // shared label style
  const labelStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.62rem',
    letterSpacing: '0.28em',
    textTransform: 'uppercase',
    color: 'rgba(0,229,255,0.6)',
    marginBottom: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const headingStyle: React.CSSProperties = {
    fontFamily: "'Orbitron', monospace",
    fontWeight: 900,
    lineHeight: 1.05,
    color: '#fff',
  };

  const bodyStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    color: 'rgba(255,255,255,0.45)',
    lineHeight: 1.8,
    fontSize: 'clamp(0.72rem, 1.2vw, 0.85rem)',
  };

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Orbitron:wght@700;900&display=swap');

        .panel-absolute {
          position: absolute;
          pointer-events: none;
          will-change: transform, opacity;
        }

        @keyframes blink {
          0%,100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .cursor { animation: blink 1s steps(1) infinite; }

        @keyframes floatY {
          0%,100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .float { animation: floatY 4s ease-in-out infinite; }

        .grid-bg {
          background-image:
            linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .event-card-hover:hover {
          border-color: rgba(0,229,255,0.35) !important;
          transform: translateY(-2px);
        }
      `}</style>

      <div ref={containerRef} className="relative w-full bg-[#050505]" style={{ height: '700vh' }}>
        <div className="sticky top-0 w-full h-screen overflow-hidden">

          {/* Canvas bg */}
          <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />

          {/* Overlay layers */}
          <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(5,5,5,0.55) 0%, rgba(5,5,5,0.3) 50%, rgba(5,5,5,0.7) 100%)' }} />
          <div className="absolute inset-0 z-10 pointer-events-none grid-bg" />

          {/* Decorative horizontal line (grows on scroll) */}
          <div
            ref={lineRef}
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              width: '100%',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.18), transparent)',
              transform: 'scaleX(0)',
              transformOrigin: 'left',
              zIndex: 15,
              pointerEvents: 'none',
            }}
          />

          {/* Corner decorations */}
          {[
            { top: 24, left: 24, borderTop: true, borderLeft: true },
            { top: 24, right: 24, borderTop: true, borderRight: true },
            { bottom: 24, left: 24, borderBottom: true, borderLeft: true },
            { bottom: 24, right: 24, borderBottom: true, borderRight: true },
          ].map((corner, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: 20,
                height: 20,
                zIndex: 20,
                pointerEvents: 'none',
                borderTop: corner.borderTop ? '1px solid rgba(0,229,255,0.25)' : undefined,
                borderBottom: corner.borderBottom ? '1px solid rgba(0,229,255,0.25)' : undefined,
                borderLeft: corner.borderLeft ? '1px solid rgba(0,229,255,0.25)' : undefined,
                borderRight: corner.borderRight ? '1px solid rgba(0,229,255,0.25)' : undefined,
                top: corner.top,
                bottom: corner.bottom,
                left: corner.left,
                right: corner.right,
              }}
            />
          ))}

          {/* Scroll progress indicator */}
          <div style={{ position: 'absolute', right: 28, top: '50%', transform: 'translateY(-50%)', zIndex: 20, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', pointerEvents: 'none' }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ width: 3, height: i === 0 ? 20 : 6, borderRadius: 10, background: i === 0 ? '#00E5FF' : 'rgba(255,255,255,0.2)', boxShadow: i === 0 ? '0 0 8px #00E5FF' : 'none' }} />
            ))}
          </div>

          {/* ── PANEL 0 · INTRO ─────────────────────────────────────────────── */}
          <div
            ref={panel0Ref}
            className="panel-absolute"
            style={{ inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 20, textAlign: 'center', padding: '0 24px' }}
          >
            {/* Top label */}
            <div style={{ ...labelStyle, justifyContent: 'center', marginBottom: 20 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00E5FF', boxShadow: '0 0 8px #00E5FF', display: 'inline-block' }} />
              Birla Institute of Applied Sciences
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00E5FF', boxShadow: '0 0 8px #00E5FF', display: 'inline-block' }} />
            </div>

            {/* Main heading */}
            <h1
              style={{
                ...headingStyle,
                fontSize: 'clamp(3.5rem, 12vw, 9rem)',
                letterSpacing: '-0.02em',
                marginBottom: 8,
                background: 'linear-gradient(170deg, #ffffff 40%, rgba(0,229,255,0.6) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              CODING
              <br />
              CLUB
            </h1>

            {/* Typewriter line */}
            <div style={{ ...bodyStyle, marginTop: 16, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
              <span style={{ color: '#00E5FF', opacity: 0.7 }}>$</span>
              <span style={{ marginLeft: 8 }}>scroll to initialize_sequence</span>
              <span className="cursor" style={{ width: 2, height: '1em', background: '#00E5FF', display: 'inline-block', marginLeft: 3 }} />
            </div>

            {/* Stat strip */}
            <div style={{ display: 'flex', gap: 'clamp(24px, 5vw, 56px)', justifyContent: 'center', flexWrap: 'wrap', padding: '20px 32px', borderRadius: 16, border: '1px solid rgba(0,229,255,0.1)', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(12px)' }}>
              <Stat value="200+" label="Members" />
              <div style={{ width: 1, background: 'rgba(255,255,255,0.08)', alignSelf: 'stretch' }} />
              <Stat value="48" label="Events" />
              <div style={{ width: 1, background: 'rgba(255,255,255,0.08)', alignSelf: 'stretch' }} />
              <Stat value="12" label="Projects" />
              <div style={{ width: 1, background: 'rgba(255,255,255,0.08)', alignSelf: 'stretch' }} />
              <Stat value="5★" label="Rated" />
            </div>

            {/* Scroll hint */}
            <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: 0.4 }}>
              <svg width="20" height="32" viewBox="0 0 20 32" fill="none">
                <rect x="1" y="1" width="18" height="30" rx="9" stroke="white" strokeWidth="1.5" />
                <rect className="float" x="8.5" y="6" width="3" height="7" rx="1.5" fill="white" />
              </svg>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.55rem', letterSpacing: '0.25em', color: 'white' }}>SCROLL</span>
            </div>
          </div>

          {/* ── PANEL 1 · UPCOMING EVENTS ────────────────────────────────────── */}
          <div
            ref={panel1Ref}
            className="panel-absolute"
            style={{ inset: 0, display: 'flex', alignItems: 'center', zIndex: 20, padding: 'clamp(24px,5vw,80px)', opacity: 0 }}
          >
            <div style={{ maxWidth: 560, width: '100%' }}>
              <div style={labelStyle}>
                <span>// 01</span>
                <span>Upcoming Events</span>
              </div>
              <h2 style={{ ...headingStyle, fontSize: 'clamp(2rem, 5vw, 3.8rem)', marginBottom: 8 }}>
                What's<br />
                <span style={{ WebkitTextFillColor: 'transparent', background: 'linear-gradient(90deg,#00E5FF,#fff)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>
                  Dropping Next.
                </span>
              </h2>
              <p style={{ ...bodyStyle, marginBottom: 28, maxWidth: 400 }}>
                Hackathons, competitive coding sprints, open-source jams — the calendar never sleeps. Neither should you.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                <EventCard icon="⚡" title="48-hr Hackathon" date="Mar 15 — Mar 17" tag="Hackathon" />
                <EventCard icon="🏆" title="DSA Championship" date="Apr 02" tag="Competitive" />
                <EventCard icon="🌐" title="Open Source Sprint" date="Apr 18 — Apr 20" tag="Open Source" />
                <EventCard icon="🤖" title="AI/ML Buildathon" date="May 05" tag="AI · ML" />
              </div>
            </div>
          </div>

          {/* ── PANEL 2 · WORKSHOPS ──────────────────────────────────────────── */}
          <div
            ref={panel2Ref}
            className="panel-absolute"
            style={{ inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', zIndex: 20, padding: 'clamp(24px,5vw,80px)', opacity: 0 }}
          >
            <div style={{ maxWidth: 520, width: '100%', textAlign: 'right' }}>
              <div style={{ ...labelStyle, justifyContent: 'flex-end' }}>
                <span>Workshops & Skills</span>
                <span>02 //</span>
              </div>
              <h2 style={{ ...headingStyle, fontSize: 'clamp(2rem, 5vw, 3.8rem)', marginBottom: 8 }}>
                Learn.<br />
                <span style={{ WebkitTextFillColor: 'transparent', background: 'linear-gradient(90deg,#fff,#00E5FF)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>
                  Build. Ship.
                </span>
              </h2>
              <p style={{ ...bodyStyle, marginBottom: 28, marginLeft: 'auto', maxWidth: 400, textAlign: 'right' }}>
                Hands-on sessions with industry engineers. From Docker & Kubernetes to Full-Stack and System Design — no fluff, all depth.
              </p>

              {/* Workshop list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { icon: '🐳', name: 'Docker & DevOps Bootcamp', level: 'Intermediate' },
                  { icon: '⚛️', name: 'React + Next.js Deep Dive', level: 'Beginner' },
                  { icon: '🔐', name: 'Cybersecurity & CTF Prep', level: 'Advanced' },
                  { icon: '🧠', name: 'LLM Engineering Workshop', level: 'Advanced' },
                ].map(w => (
                  <div key={w.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, padding: '12px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(8px)' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.82rem', color: '#fff', fontWeight: 600 }}>{w.name}</div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', color: 'rgba(0,229,255,0.5)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 2 }}>{w.level}</div>
                    </div>
                    <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{w.icon}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── PANEL 3 · FINAL CTA ──────────────────────────────────────────── */}
          <div
            ref={panel3Ref}
            className="panel-absolute"
            style={{ inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 20, textAlign: 'center', padding: '0 24px', opacity: 0 }}
          >
            {/* Glow ring */}
            <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,229,255,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ ...labelStyle, justifyContent: 'center', marginBottom: 20 }}>
              <span>Ready to join?</span>
            </div>

            <h2
              style={{
                ...headingStyle,
                fontSize: 'clamp(2.8rem, 8vw, 6.5rem)',
                marginBottom: 16,
                background: 'linear-gradient(135deg, #ffffff 0%, #00E5FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.02em',
              }}
            >
              INNOVATE.<br />DEPLOY.<br />SCALE.
            </h2>

            <p style={{ ...bodyStyle, maxWidth: 420, marginBottom: 36 }}>
              Push your code to the limits. Whether containerizing environments or training ML models — the terminal is yours. Join the revolution.
            </p>

            {/* CTA buttons */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                style={{
                  padding: '14px 32px',
                  borderRadius: 8,
                  background: '#00E5FF',
                  color: '#050505',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 0 24px rgba(0,229,255,0.4)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  pointerEvents: 'auto',
                }}
                onMouseEnter={e => { (e.target as HTMLElement).style.transform = 'translateY(-2px)'; (e.target as HTMLElement).style.boxShadow = '0 0 36px rgba(0,229,255,0.6)'; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.transform = ''; (e.target as HTMLElement).style.boxShadow = '0 0 24px rgba(0,229,255,0.4)'; }}
              >
                &gt;_ JOIN THE CLUB
              </button>
              <button
                style={{
                  padding: '13px 32px',
                  borderRadius: 8,
                  background: 'transparent',
                  color: 'rgba(255,255,255,0.7)',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  border: '1px solid rgba(0,229,255,0.25)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  pointerEvents: 'auto',
                }}
                onMouseEnter={e => { const t = e.target as HTMLElement; t.style.borderColor = 'rgba(0,229,255,0.6)'; t.style.color = '#00E5FF'; }}
                onMouseLeave={e => { const t = e.target as HTMLElement; t.style.borderColor = 'rgba(0,229,255,0.25)'; t.style.color = 'rgba(255,255,255,0.7)'; }}
              >
                VIEW EVENTS
              </button>
            </div>

            {/* Bottom tag line */}
            <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.25em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              Birla Institute of Applied Sciences · Coding Club © 2025
            </div>
          </div>

        </div>
      </div>
    </>
  );
}