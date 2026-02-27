'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const G = '#00ff88'; // terminal green

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '4px 12px', borderRadius: 100,
    border: `1px solid rgba(0,255,136,0.25)`,
    background: 'rgba(0,255,136,0.06)',
    color: G,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase' as const,
  }}>
    {children}
  </span>
);

const Stat = ({ value, label }: { value: string; label: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    <span style={{
      fontFamily: "'Orbitron', monospace",
      fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 900,
      background: `linear-gradient(135deg,#fff 30%,${G})`,
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      lineHeight: 1,
    }}>{value}</span>
    <span style={{
      fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem',
      color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', textTransform: 'uppercase' as const,
    }}>{label}</span>
  </div>
);

const EventCard = ({ icon, title, date, tag }: { icon: string; title: string; date: string; tag: string }) => (
  <div style={{
    padding: '18px 20px', borderRadius: 12,
    border: '1px solid rgba(0,255,136,0.1)',
    background: 'rgba(0,0,0,0.4)',
    backdropFilter: 'blur(10px)',
    display: 'flex', flexDirection: 'column', gap: 8,
    transition: 'border-color 0.25s, transform 0.25s',
  }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,255,136,0.35)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,255,136,0.1)'; (e.currentTarget as HTMLElement).style.transform = ''; }}
  >
    <span style={{ fontSize: '1.3rem' }}>{icon}</span>
    <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 'clamp(0.72rem,1.2vw,0.88rem)', color: '#fff', fontWeight: 700, lineHeight: 1.3 }}>{title}</div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>{date}</span>
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

      // frame scrub
      tl.to(sequence, { frame: frameCount, snap: 'frame', ease: 'none', onUpdate: render, duration: 10 }, 0);

      // panel 0 — fade out
      tl.to(panel0Ref.current, { opacity: 0, scale: 0.93, y: -50, duration: 1.5, ease: 'power2.inOut' }, 0);

      // decorative line
      tl.fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'power2.out' }, 1.2);

      // panel 1 — events, slide from left
      tl.fromTo(panel1Ref.current,
        { opacity: 0, x: -120 },
        { opacity: 1, x: 0, duration: 2, ease: 'power3.out' }, 1.5);
      tl.to(panel1Ref.current, { opacity: 0, x: -80, duration: 1.2, ease: 'power2.in' }, 4.2);

      // panel 2 — workshops, slide from right
      tl.fromTo(panel2Ref.current,
        { opacity: 0, x: 120 },
        { opacity: 1, x: 0, duration: 2, ease: 'power3.out' }, 5.5);
      tl.to(panel2Ref.current, { opacity: 0, y: 50, duration: 1.2, ease: 'power2.in' }, 7.8);

      // panel 3 — CTA, rise
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
    fontSize: '0.6rem', letterSpacing: '0.26em', textTransform: 'uppercase',
    color: 'rgba(0,255,136,0.55)', marginBottom: 14,
    display: 'flex', alignItems: 'center', gap: 8,
  };
  const headSt: React.CSSProperties = {
    fontFamily: "'Orbitron', monospace", fontWeight: 900, lineHeight: 1.05, color: '#fff',
  };
  const bodySt: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace",
    color: 'rgba(255,255,255,0.4)', lineHeight: 1.85,
    fontSize: 'clamp(0.7rem,1.2vw,0.83rem)',
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Orbitron:wght@700;900&display=swap');
        .panel-abs { position:absolute; pointer-events:none; will-change:transform,opacity; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .cursor { animation: blink 1s steps(1) infinite; }
        @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .float { animation: floatY 3.5s ease-in-out infinite; }
      `}</style>

      <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '700vh', background: '#050505' }}>
        <div style={{ position: 'sticky', top: 0, width: '100%', height: '100vh', overflow: 'hidden' }}>

          {/* Canvas */}
          <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }} />

          {/* Dark overlay — no grid */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.75) 100%)' }} />

          {/* Decorative grow-line */}
          <div ref={lineRef} style={{
            position: 'absolute', top: '50%', left: 0, width: '100%', height: 1,
            background: `linear-gradient(90deg, transparent, rgba(0,255,136,0.2), transparent)`,
            transform: 'scaleX(0)', transformOrigin: 'left', zIndex: 15, pointerEvents: 'none',
          }} />

          {/* Corner brackets */}
          {([
            { top:24, left:24,  borderTop:'1px solid rgba(0,255,136,0.2)', borderLeft:'1px solid rgba(0,255,136,0.2)' },
            { top:24, right:24, borderTop:'1px solid rgba(0,255,136,0.2)', borderRight:'1px solid rgba(0,255,136,0.2)' },
            { bottom:24, left:24,  borderBottom:'1px solid rgba(0,255,136,0.2)', borderLeft:'1px solid rgba(0,255,136,0.2)' },
            { bottom:24, right:24, borderBottom:'1px solid rgba(0,255,136,0.2)', borderRight:'1px solid rgba(0,255,136,0.2)' },
          ] as React.CSSProperties[]).map((s, i) => (
            <div key={i} style={{ position:'absolute', width:20, height:20, zIndex:20, pointerEvents:'none', ...s }} />
          ))}

          {/* Side dots progress */}
          <div style={{ position:'absolute', right:28, top:'50%', transform:'translateY(-50%)', zIndex:20, display:'flex', flexDirection:'column', gap:7, alignItems:'center', pointerEvents:'none' }}>
            {[1,0,0,0].map((active,i) => (
              <div key={i} style={{ width:3, height: active ? 20:6, borderRadius:10, background: active ? G : 'rgba(255,255,255,0.18)', boxShadow: active ? `0 0 8px ${G}`:'' }} />
            ))}
          </div>

          {/* ── PANEL 0 · INTRO ───────────────────────────────────────── */}
          <div ref={panel0Ref} className="panel-abs" style={{ inset:0, zIndex:20, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'0 24px' }}>
            <div style={{ ...labelSt, justifyContent:'center', marginBottom:20 }}>
              <span style={{ width:5, height:5, borderRadius:'50%', background:G, boxShadow:`0 0 8px ${G}`, display:'inline-block' }} />
              Birla Institute of Applied Sciences
              <span style={{ width:5, height:5, borderRadius:'50%', background:G, boxShadow:`0 0 8px ${G}`, display:'inline-block' }} />
            </div>

            <h1 style={{
              ...headSt,
              fontSize: 'clamp(3.5rem,12vw,9rem)',
              letterSpacing: '-0.02em', marginBottom: 8,
              background: `linear-gradient(170deg,#ffffff 40%,${G} 100%)`,
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
            }}>
              CODING<br />CLUB
            </h1>

            <div style={{ ...bodySt, marginTop:16, marginBottom:32, display:'flex', alignItems:'center', gap:4, justifyContent:'center' }}>
              <span style={{ color:G, opacity:0.7 }}>$</span>
              <span style={{ marginLeft:6 }}>scroll to initialize_sequence</span>
              <span className="cursor" style={{ width:2, height:'1em', background:G, display:'inline-block', marginLeft:2 }} />
            </div>

            {/* Stats */}
            <div style={{ display:'flex', gap:'clamp(20px,4vw,48px)', justifyContent:'center', flexWrap:'wrap', padding:'18px 28px', borderRadius:14, border:`1px solid rgba(0,255,136,0.12)`, background:'rgba(0,0,0,0.45)', backdropFilter:'blur(14px)' }}>
              <Stat value="200+" label="Members" />
              <div style={{ width:1, background:'rgba(255,255,255,0.07)', alignSelf:'stretch' }} />
              <Stat value="48" label="Events" />
              <div style={{ width:1, background:'rgba(255,255,255,0.07)', alignSelf:'stretch' }} />
              <Stat value="12" label="Projects" />
              <div style={{ width:1, background:'rgba(255,255,255,0.07)', alignSelf:'stretch' }} />
              <Stat value="5★" label="Rated" />
            </div>

            {/* Scroll mouse */}
            <div style={{ marginTop:38, display:'flex', flexDirection:'column', alignItems:'center', gap:7, opacity:0.35 }}>
              <svg width="20" height="32" viewBox="0 0 20 32" fill="none">
                <rect x="1" y="1" width="18" height="30" rx="9" stroke="white" strokeWidth="1.5"/>
                <rect className="float" x="8.5" y="6" width="3" height="7" rx="1.5" fill="white"/>
              </svg>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.52rem', letterSpacing:'0.28em', color:'white' }}>SCROLL</span>
            </div>
          </div>

          {/* ── PANEL 1 · EVENTS ──────────────────────────────────────── */}
          <div ref={panel1Ref} className="panel-abs" style={{ inset:0, zIndex:20, display:'flex', alignItems:'center', padding:'clamp(24px,5vw,80px)', opacity:0 }}>
            <div style={{ maxWidth:560, width:'100%' }}>
              <div style={labelSt}><span>// 01</span><span>Upcoming Events</span></div>
              <h2 style={{ ...headSt, fontSize:'clamp(2rem,5vw,3.6rem)', marginBottom:10 }}>
                What's<br />
                <span style={{ background:`linear-gradient(90deg,${G},#fff)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                  Dropping Next.
                </span>
              </h2>
              <p style={{ ...bodySt, marginBottom:26, maxWidth:400 }}>
                Hackathons, competitive coding sprints, open-source jams — the calendar never sleeps. Neither should you.
              </p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:12 }}>
                <EventCard icon="⚡" title="48-hr Hackathon"    date="Mar 15 — Mar 17" tag="Hackathon" />
                <EventCard icon="🏆" title="DSA Championship"   date="Apr 02"          tag="Competitive" />
                <EventCard icon="🌐" title="Open Source Sprint" date="Apr 18 — Apr 20" tag="Open Source" />
                <EventCard icon="🤖" title="AI/ML Buildathon"   date="May 05"          tag="AI · ML" />
              </div>
            </div>
          </div>

          {/* ── PANEL 2 · WORKSHOPS ───────────────────────────────────── */}
          <div ref={panel2Ref} className="panel-abs" style={{ inset:0, zIndex:20, display:'flex', alignItems:'center', justifyContent:'flex-end', padding:'clamp(24px,5vw,80px)', opacity:0 }}>
            <div style={{ maxWidth:520, width:'100%', textAlign:'right' }}>
              <div style={{ ...labelSt, justifyContent:'flex-end' }}><span>Workshops & Skills</span><span>02 //</span></div>
              <h2 style={{ ...headSt, fontSize:'clamp(2rem,5vw,3.6rem)', marginBottom:10 }}>
                Learn.<br />
                <span style={{ background:`linear-gradient(90deg,#fff,${G})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                  Build. Ship.
                </span>
              </h2>
              <p style={{ ...bodySt, marginBottom:26, marginLeft:'auto', maxWidth:400, textAlign:'right' }}>
                Hands-on sessions with industry engineers. Docker, Kubernetes, Full-Stack, System Design — no fluff, all depth.
              </p>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {[
                  { icon:'🐳', name:'Docker & DevOps Bootcamp',  level:'Intermediate' },
                  { icon:'⚛️', name:'React + Next.js Deep Dive',  level:'Beginner' },
                  { icon:'🔐', name:'Cybersecurity & CTF Prep',   level:'Advanced' },
                  { icon:'🧠', name:'LLM Engineering Workshop',   level:'Advanced' },
                ].map(w => (
                  <div key={w.name} style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:12, padding:'12px 16px', borderRadius:10, border:'1px solid rgba(0,255,136,0.08)', background:'rgba(0,0,0,0.4)', backdropFilter:'blur(8px)' }}>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.8rem', color:'#fff', fontWeight:600 }}>{w.name}</div>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.56rem', color:`rgba(0,255,136,0.45)`, letterSpacing:'0.15em', textTransform:'uppercase', marginTop:2 }}>{w.level}</div>
                    </div>
                    <span style={{ fontSize:'1.25rem', flexShrink:0 }}>{w.icon}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── PANEL 3 · CTA ─────────────────────────────────────────── */}
          <div ref={panel3Ref} className="panel-abs" style={{ inset:0, zIndex:20, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'0 24px', opacity:0 }}>
            {/* glow blob */}
            <div style={{ position:'absolute', width:420, height:420, borderRadius:'50%', background:`radial-gradient(circle,rgba(0,255,136,0.06) 0%,transparent 70%)`, pointerEvents:'none' }} />

            <div style={{ ...labelSt, justifyContent:'center', marginBottom:20 }}><span>// Ready to join?</span></div>

            <h2 style={{
              ...headSt,
              fontSize:'clamp(2.8rem,8vw,6rem)', marginBottom:16,
              background:`linear-gradient(135deg,#ffffff 0%,${G} 100%)`,
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
              letterSpacing:'-0.02em',
            }}>
              INNOVATE.<br />DEPLOY.<br />SCALE.
            </h2>

            <p style={{ ...bodySt, maxWidth:400, marginBottom:36 }}>
              Push your code to the limits. Whether containerizing environments or training ML models — the terminal is yours.
            </p>

            <div style={{ display:'flex', gap:14, flexWrap:'wrap', justifyContent:'center' }}>
              <button style={{
                padding:'13px 30px', borderRadius:8, background:G,
                color:'#050505', fontFamily:"'JetBrains Mono',monospace",
                fontSize:'0.78rem', fontWeight:700, letterSpacing:'0.1em',
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
                padding:'12px 30px', borderRadius:8, background:'transparent',
                color:'rgba(255,255,255,0.65)', fontFamily:"'JetBrains Mono',monospace",
                fontSize:'0.78rem', fontWeight:500, letterSpacing:'0.1em',
                border:'1px solid rgba(0,255,136,0.22)', cursor:'pointer',
                transition:'all 0.2s', pointerEvents:'auto',
              }}
                onMouseEnter={e=>{const t=e.currentTarget as HTMLElement;t.style.borderColor=`rgba(0,255,136,0.55)`;t.style.color=G;}}
                onMouseLeave={e=>{const t=e.currentTarget as HTMLElement;t.style.borderColor='rgba(0,255,136,0.22)';t.style.color='rgba(255,255,255,0.65)';}}
              >
                VIEW EVENTS
              </button>
            </div>

            <div style={{ position:'absolute', bottom:28, left:'50%', transform:'translateX(-50%)', fontFamily:"'JetBrains Mono',monospace", fontSize:'0.55rem', color:'rgba(255,255,255,0.18)', letterSpacing:'0.25em', textTransform:'uppercase', whiteSpace:'nowrap' }}>
              Birla Institute of Applied Sciences · Coding Club © 2025
            </div>
          </div>

        </div>
      </div>
    </>
  );
}