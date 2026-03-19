'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const G = '#00ff88';

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '3px 10px', borderRadius: 100,
    border: `1px solid rgba(0,255,136,0.25)`,
    background: 'rgba(0,255,136,0.06)',
    color: G,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase' as const,
    whiteSpace: 'nowrap' as const,
  }}>
    {children}
  </span>
);

const Stat = ({ value, label }: { value: string; label: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
    <span style={{
      fontFamily: "'Orbitron', monospace",
      fontSize: 'clamp(1.1rem, 3vw, 2rem)', fontWeight: 900,
      background: `linear-gradient(135deg,#fff 30%,${G})`,
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      lineHeight: 1,
    }}>{value}</span>
    <span style={{
      fontFamily: "'JetBrains Mono', monospace", fontSize: '0.52rem',
      color: 'rgba(255,255,255,0.3)', letterSpacing: '0.18em', textTransform: 'uppercase' as const,
    }}>{label}</span>
  </div>
);

const EventCard = ({ icon, title, date, tag }: { icon: string; title: string; date: string; tag: string }) => (
  <div style={{
    padding: 'clamp(12px,2vw,18px) clamp(12px,2vw,20px)', borderRadius: 12,
    border: '1px solid rgba(0,255,136,0.1)',
    background: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(10px)',
    display: 'flex', flexDirection: 'column', gap: 6,
    transition: 'border-color 0.25s, transform 0.25s',
  }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,255,136,0.35)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,255,136,0.1)'; (e.currentTarget as HTMLElement).style.transform = ''; }}
  >
    <span style={{ fontSize: '1.1rem' }}>{icon}</span>
    <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 'clamp(0.65rem,1.5vw,0.85rem)', color: '#fff', fontWeight: 700, lineHeight: 1.3 }}>{title}</div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6, flexWrap: 'wrap' as const }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>{date}</span>
      <Pill>{tag}</Pill>
    </div>
  </div>
);

export default function HeroScroller() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const panel0Ref    = useRef<HTMLDivElement>(null);
  const panel1Ref    = useRef<HTMLDivElement>(null);
  const panel2Ref    = useRef<HTMLDivElement>(null);
  const panel3Ref    = useRef<HTMLDivElement>(null);
  const lineRef      = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const frameCount = 240;
    const images: HTMLImageElement[] = [];
    const sequence = { frame: 1 };

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = `/Hero/${i}.jpg`;
      images.push(img);
    }

    const render = () => {
      const img = images[sequence.frame - 1];
      if (!img || !img.complete) return;
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      const hRatio = canvas.width  / img.width;
      const vRatio = canvas.height / img.height;
      const ratio  = Math.max(hRatio, vRatio);
      const cx = (canvas.width  - img.width  * ratio) / 2;
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

      tl.to(sequence, { frame: frameCount, snap: 'frame', ease: 'none', onUpdate: render, duration: 10 }, 0);
      tl.to(panel0Ref.current, { opacity: 0, scale: 0.93, y: -50, duration: 1.5, ease: 'power2.inOut' }, 0);
      tl.fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'power2.out' }, 1.2);

      tl.fromTo(panel1Ref.current,
        { opacity: 0, x: -120 },
        { opacity: 1, x: 0, duration: 2, ease: 'power3.out' }, 1.5);
      tl.to(panel1Ref.current, { opacity: 0, x: -80, duration: 1.2, ease: 'power2.in' }, 4.2);

      tl.fromTo(panel2Ref.current,
        { opacity: 0, x: 120 },
        { opacity: 1, x: 0, duration: 2, ease: 'power3.out' }, 5.5);
      tl.to(panel2Ref.current, { opacity: 0, y: 50, duration: 1.2, ease: 'power2.in' }, 7.8);

      tl.fromTo(panel3Ref.current,
        { opacity: 0, y: 80, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 2, ease: 'expo.out' }, 8.5);

    }, containerRef);

    return () => {
      window.removeEventListener('resize', render);
      ctx.revert();
    };
  }, []);

  const labelSt: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase',
    color: 'rgba(0,255,136,0.55)', marginBottom: 12,
    display: 'flex', alignItems: 'center', gap: 8,
  };
  const headSt: React.CSSProperties = {
    fontFamily: "'Orbitron', monospace", fontWeight: 900, lineHeight: 1.05, color: '#fff',
  };
  const bodySt: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    color: 'rgba(255,255,255,0.4)', lineHeight: 1.8,
    fontSize: 'clamp(0.65rem, 1.5vw, 0.82rem)',
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Orbitron:wght@700;900&display=swap');

        /* Animated gradient background for mobile */
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .gradient-bg-mobile {
          background: linear-gradient(-45deg, #0a0a0a, #1a0a15, #0d1410, #0a0f18);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
        }

        .panel-abs {
          position: absolute;
          pointer-events: none;
          will-change: transform, opacity;
          /* Push content below fixed navbar on all screens */
          padding-top: env(safe-area-inset-top);
        }

        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .cursor { animation: blink 1s steps(1) infinite; }
        @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .float { animation: floatY 3.5s ease-in-out infinite; }

        /* ── Responsive panel content ─────────────────────────────── */

        /* PANEL 0 — intro */
        .p0-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          /* top padding = navbar height so title never hides under it */
          padding: clamp(80px, 14vw, 120px) 20px clamp(20px, 4vw, 48px);
          width: 100%;
          height: 100%;
          box-sizing: border-box;
        }

        .stats-strip {
          display: flex;
          gap: clamp(14px, 3.5vw, 48px);
          justify-content: center;
          flex-wrap: wrap;
          padding: clamp(12px,2vw,18px) clamp(16px,3vw,28px);
          border-radius: 14px;
          border: 1px solid rgba(0,255,136,0.12);
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(14px);
          max-width: 100%;
        }

        /* PANEL 1 — events (left-aligned desktop, centred mobile) */
        .p1-inner {
          display: flex;
          align-items: center;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          /* top pad clears navbar, sides breathe */
          padding: clamp(80px,14vw,120px) clamp(16px,5vw,80px) clamp(24px,4vw,60px);
        }
        .p1-content {
          max-width: 560px;
          width: 100%;
        }
        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(clamp(130px,35vw,200px), 1fr));
          gap: 10px;
        }

        /* PANEL 2 — workshops (right-aligned desktop, centred mobile) */
        .p2-inner {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          padding: clamp(80px,14vw,120px) clamp(16px,5vw,80px) clamp(24px,4vw,60px);
        }
        .p2-content {
          max-width: 520px;
          width: 100%;
          text-align: right;
        }

        /* PANEL 3 — CTA (centred) */
        .p3-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          padding: clamp(80px,14vw,120px) 20px clamp(48px,6vw,80px);
        }

        /* ── Mobile overrides (<= 640px) ──────────────────────────── */
        @media (max-width: 640px) {
          .gradient-bg-mobile {
            background: linear-gradient(-45deg, #0a0a0a, #1a0a15, #0d1410, #0a0f18) !important;
            background-size: 400% 400% !important;
            animation: gradientShift 15s ease infinite !important;
          }

          .p1-inner { justify-content: center; }
          .p2-inner { justify-content: center; }
          .p2-content { text-align: left; }
          .p2-label  { justify-content: flex-start !important; }
          .workshop-row { flex-direction: row-reverse !important; justify-content: flex-start !important; }
          .workshop-text { text-align: left !important; }
          /* hide side progress dots on tiny screens */
          .side-dots { display: none !important; }
          /* corner brackets shrink */
          .corner { width: 14px !important; height: 14px !important; }
        }

        /* ── Tablet & up (> 640px) ──────────────────────────────── */
        @media (min-width: 641px) {
          .gradient-bg-mobile {
            display: none !important;
          }
        }
      `}</style>

      <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '700vh', background: '#050505' }}>
        <div style={{ 
          position: 'sticky', 
          top: 0, 
          width: '100%', 
          height: '100vh', 
          overflow: 'hidden',
          background: window.innerWidth < 768 ? undefined : 'linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0d1410 100%)'
        }}
        className={window.innerWidth < 768 ? 'gradient-bg-mobile' : ''}
        >

          {/* Canvas */}
          <canvas ref={canvasRef} style={{ 
            position: 'absolute', 
            inset: 0, 
            width: '100%', 
            height: '100%', 
            zIndex: 0,
            opacity: window.innerWidth >= 768 ? 1 : 0.6,
            filter: window.innerWidth < 768 ? 'blur(0px) brightness(0.85)' : 'none'
          }} />

          {/* Dark overlay */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: window.innerWidth >= 768 ? 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.8) 100%)' : 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 50%, rgba(10,10,20,0.6) 100%)' }} />

          {/* Grow line */}
          <div ref={lineRef} style={{
            position: 'absolute', top: '50%', left: 0, width: '100%', height: 1,
            background: `linear-gradient(90deg, transparent, rgba(0,255,136,0.2), transparent)`,
            transform: 'scaleX(0)', transformOrigin: 'left', zIndex: 15, pointerEvents: 'none',
          }} />

          {/* Corner brackets */}
          {([
            { top:20, left:20,  borderTop:'1px solid rgba(0,255,136,0.2)', borderLeft:'1px solid rgba(0,255,136,0.2)' },
            { top:20, right:20, borderTop:'1px solid rgba(0,255,136,0.2)', borderRight:'1px solid rgba(0,255,136,0.2)' },
            { bottom:20, left:20,  borderBottom:'1px solid rgba(0,255,136,0.2)', borderLeft:'1px solid rgba(0,255,136,0.2)' },
            { bottom:20, right:20, borderBottom:'1px solid rgba(0,255,136,0.2)', borderRight:'1px solid rgba(0,255,136,0.2)' },
          ] as React.CSSProperties[]).map((s, i) => (
            <div className="corner" key={i} style={{ position:'absolute', width:20, height:20, zIndex:20, pointerEvents:'none', ...s }} />
          ))}

          {/* Side progress dots */}
          <div className="side-dots" style={{ position:'absolute', right:20, top:'50%', transform:'translateY(-50%)', zIndex:20, display:'flex', flexDirection:'column', gap:7, alignItems:'center', pointerEvents:'none' }}>
            {[1,0,0,0].map((active,i) => (
              <div key={i} style={{ width:3, height: active ? 20:6, borderRadius:10, background: active ? G : 'rgba(255,255,255,0.18)', boxShadow: active ? `0 0 8px ${G}`:'' }} />
            ))}
          </div>

          {/* ── PANEL 0 · INTRO ─────────────────────────────────── */}
          <div ref={panel0Ref} className="panel-abs" style={{ inset:0, zIndex:20 }}>
            <div className="p0-inner">
              <div style={{ ...labelSt, justifyContent:'center', marginBottom:16 }}>
                <span style={{ width:5, height:5, borderRadius:'50%', background:G, boxShadow:`0 0 8px ${G}`, display:'inline-block', flexShrink:0 }} />
                <span style={{ fontSize:'clamp(0.5rem,1.5vw,0.6rem)' }}>Birla Institute of Applied Sciences</span>
                <span style={{ width:5, height:5, borderRadius:'50%', background:G, boxShadow:`0 0 8px ${G}`, display:'inline-block', flexShrink:0 }} />
              </div>

              <h1 style={{
                ...headSt,
                fontSize: 'clamp(2.8rem, 12vw, 9rem)',
                letterSpacing: '-0.02em', marginBottom: 0,
                background: `linear-gradient(170deg,#ffffff 40%,${G} 100%)`,
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
              }}>
                CODING<br />CLUB
              </h1>

              <div style={{ ...bodySt, marginTop:14, marginBottom:24, display:'flex', alignItems:'center', gap:4, justifyContent:'center', flexWrap:'wrap' }}>
                <span style={{ color:G, opacity:0.7 }}>$</span>
                <span style={{ marginLeft:4 }}>scroll to initialize_sequence</span>
                <span className="cursor" style={{ width:2, height:'1em', background:G, display:'inline-block', marginLeft:2 }} />
              </div>

              <div className="stats-strip">
                <Stat value="200+" label="Members" />
                <div style={{ width:1, background:'rgba(255,255,255,0.07)', alignSelf:'stretch' }} />
                <Stat value="48" label="Events" />
                <div style={{ width:1, background:'rgba(255,255,255,0.07)', alignSelf:'stretch' }} />
                <Stat value="12" label="Projects" />
                <div style={{ width:1, background:'rgba(255,255,255,0.07)', alignSelf:'stretch' }} />
                <Stat value="5★" label="Rated" />
              </div>

              <div style={{ marginTop:28, display:'flex', flexDirection:'column', alignItems:'center', gap:6, opacity:0.35 }}>
                <svg width="18" height="28" viewBox="0 0 20 32" fill="none">
                  <rect x="1" y="1" width="18" height="30" rx="9" stroke="white" strokeWidth="1.5"/>
                  <rect className="float" x="8.5" y="6" width="3" height="7" rx="1.5" fill="white"/>
                </svg>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.5rem', letterSpacing:'0.28em', color:'white' }}>SCROLL</span>
              </div>
            </div>
          </div>

          {/* ── PANEL 1 · EVENTS ────────────────────────────────── */}
          <div ref={panel1Ref} className="panel-abs" style={{ inset:0, zIndex:20, opacity:0 }}>
            <div className="p1-inner">
              <div className="p1-content">
                <div style={labelSt}><span>// 01</span><span>Upcoming Events</span></div>
                <h2 style={{ ...headSt, fontSize:'clamp(1.7rem,5vw,3.6rem)', marginBottom:10 }}>
                  What's<br />
                  <span style={{ background:`linear-gradient(90deg,${G},#fff)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                    Dropping Next.
                  </span>
                </h2>
                <p style={{ ...bodySt, marginBottom:20, maxWidth:400 }}>
                  Hackathons, competitive coding sprints, open-source jams — the calendar never sleeps.
                </p>
                <div className="events-grid">
                  <EventCard icon="⚡" title="48-hr Hackathon"    date="Mar 15 — Mar 17" tag="Hackathon" />
                  <EventCard icon="🏆" title="DSA Championship"   date="Apr 02"          tag="Competitive" />
                  <EventCard icon="🌐" title="Open Source Sprint" date="Apr 18 — Apr 20" tag="Open Source" />
                  <EventCard icon="🤖" title="AI/ML Buildathon"   date="May 05"          tag="AI · ML" />
                </div>
              </div>
            </div>
          </div>

          {/* ── PANEL 2 · WORKSHOPS ─────────────────────────────── */}
          <div ref={panel2Ref} className="panel-abs" style={{ inset:0, zIndex:20, opacity:0 }}>
            <div className="p2-inner">
              <div className="p2-content">
                <div className="p2-label" style={{ ...labelSt, justifyContent:'flex-end' }}>
                  <span>Workshops & Skills</span><span>02 //</span>
                </div>
                <h2 style={{ ...headSt, fontSize:'clamp(1.7rem,5vw,3.6rem)', marginBottom:10 }}>
                  Learn.<br />
                  <span style={{ background:`linear-gradient(90deg,#fff,${G})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                    Build. Ship.
                  </span>
                </h2>
                <p style={{ ...bodySt, marginBottom:20, marginLeft:'auto', maxWidth:400 }}>
                  Hands-on sessions with industry engineers. Docker, Kubernetes, Full-Stack, System Design — no fluff.
                </p>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {[
                    { icon:'🐳', name:'Docker & DevOps Bootcamp',  level:'Intermediate' },
                    { icon:'⚛️', name:'React + Next.js Deep Dive',  level:'Beginner' },
                    { icon:'🔐', name:'Cybersecurity & CTF Prep',   level:'Advanced' },
                    { icon:'🧠', name:'LLM Engineering Workshop',   level:'Advanced' },
                  ].map(w => (
                    <div className="workshop-row" key={w.name} style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:10, padding:'10px 14px', borderRadius:10, border:'1px solid rgba(0,255,136,0.08)', background:'rgba(0,0,0,0.45)', backdropFilter:'blur(8px)' }}>
                      <div className="workshop-text" style={{ textAlign:'right' }}>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'clamp(0.7rem,1.5vw,0.8rem)', color:'#fff', fontWeight:600 }}>{w.name}</div>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.54rem', color:`rgba(0,255,136,0.45)`, letterSpacing:'0.13em', textTransform:'uppercase', marginTop:2 }}>{w.level}</div>
                      </div>
                      <span style={{ fontSize:'1.2rem', flexShrink:0 }}>{w.icon}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── PANEL 3 · CTA ───────────────────────────────────── */}
          <div ref={panel3Ref} className="panel-abs" style={{ inset:0, zIndex:20, opacity:0 }}>
            <div className="p3-inner">
              <div style={{ position:'absolute', width:'min(420px,80vw)', height:'min(420px,80vw)', borderRadius:'50%', background:`radial-gradient(circle,rgba(0,255,136,0.06) 0%,transparent 70%)`, pointerEvents:'none' }} />

              <div style={{ ...labelSt, justifyContent:'center', marginBottom:16 }}><span>// Ready to join?</span></div>

              <h2 style={{
                ...headSt,
                fontSize:'clamp(2.2rem,8vw,6rem)', marginBottom:14,
                background:`linear-gradient(135deg,#ffffff 0%,${G} 100%)`,
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
                letterSpacing:'-0.02em',
              }}>
                INNOVATE.<br />DEPLOY.<br />SCALE.
              </h2>

              <p style={{ ...bodySt, maxWidth:'min(400px,85vw)', marginBottom:28 }}>
                Push your code to the limits. The terminal is yours — join the revolution.
              </p>

              <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
                <button style={{
                  padding:'12px clamp(20px,4vw,30px)', borderRadius:8, background:G,
                  color:'#050505', fontFamily:"'JetBrains Mono',monospace",
                  fontSize:'clamp(0.68rem,1.5vw,0.78rem)', fontWeight:700, letterSpacing:'0.1em',
                  border:'none', cursor:'pointer',
                  boxShadow:`0 0 22px rgba(0,255,136,0.4)`,
                  transition:'transform 0.2s, box-shadow 0.2s', pointerEvents:'auto',
                }}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-2px)';(e.currentTarget as HTMLElement).style.boxShadow=`0 0 36px rgba(0,255,136,0.6)`;}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform='';(e.currentTarget as HTMLElement).style.boxShadow=`0 0 22px rgba(0,255,136,0.4)`;}}
                >
                  &gt;_ JOIN THE CLUB
                </button>
                <button style={{
                  padding:'11px clamp(20px,4vw,30px)', borderRadius:8, background:'transparent',
                  color:'rgba(255,255,255,0.65)', fontFamily:"'JetBrains Mono',monospace",
                  fontSize:'clamp(0.68rem,1.5vw,0.78rem)', fontWeight:500, letterSpacing:'0.1em',
                  border:'1px solid rgba(0,255,136,0.22)', cursor:'pointer',
                  transition:'all 0.2s', pointerEvents:'auto',
                }}
                  onMouseEnter={e=>{const t=e.currentTarget as HTMLElement;t.style.borderColor=`rgba(0,255,136,0.55)`;t.style.color=G;}}
                  onMouseLeave={e=>{const t=e.currentTarget as HTMLElement;t.style.borderColor='rgba(0,255,136,0.22)';t.style.color='rgba(255,255,255,0.65)';}}
                >
                  VIEW EVENTS
                </button>
              </div>

              <div style={{ position:'absolute', bottom:20, left:'50%', transform:'translateX(-50%)', fontFamily:"'JetBrains Mono',monospace", fontSize:'0.5rem', color:'rgba(255,255,255,0.15)', letterSpacing:'0.22em', textTransform:'uppercase', whiteSpace:'nowrap' }}>
                Birla Institute of Applied Sciences · Coding Club © 2025
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}