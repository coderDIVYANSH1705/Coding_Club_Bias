'use client';

import { useEffect, useRef } from 'react';

const G = '#00ff88';

const TEAM = [
  {
    name: 'Divyansh Mishra',
    role: 'Developer',
    handle: 'divyansh',
    github: 'https://github.com/coderDIVYANSH1705',       // ← replace with real username
    linkedin: 'https:linkedin.com/in/divyansh-mishra-7b5064322', // ← replace with real profile
    avatar: '/team/divyansh.jpg',                 // ← place photo in /public/team/
    index: '01',
    tags: ['Full Stack', 'System Design'],
  },
  {
    name: 'Jayendra Nayal',
    role: 'Developer',
    handle: 'jayendra',
    github: 'https://github.com/Jayendra25',
    linkedin: 'https://linkedin.com/in/jayendra-singh-nayal-904191328',
    avatar: '/team/jayendra.jpg',
    index: '02',
    tags: ['Backend', 'Frontend'],
  },
];

// ── GitHub icon SVG
const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

// ── LinkedIn icon SVG
const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

function MemberCard({ member, delay }: { member: typeof TEAM[0]; delay: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    // Staggered entrance
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    const timer = setTimeout(() => {
      el.style.transition = 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, delay);

    // Tilt-on-hover
    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      el.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
    };
    const handleMouseLeave = () => {
      el.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
      el.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateY(0)';
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      clearTimeout(timer);
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [delay]);

  return (
    <div ref={cardRef} style={{ willChange: 'transform, opacity' }}>
      <div style={{
        position: 'relative',
        borderRadius: 20,
        border: '1px solid rgba(0,255,136,0.12)',
        background: 'rgba(5,5,5,0.85)',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
        cursor: 'default',
        transition: 'border-color 0.3s ease',
      }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,255,136,0.35)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,255,136,0.12)')}
      >
        {/* ── scanline shimmer overlay */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,136,0.015) 2px,rgba(0,255,136,0.015) 4px)',
        }} />

        {/* ── corner index tag */}
        <div style={{
          position: 'absolute', top: 16, right: 16, zIndex: 10,
          fontFamily: "'JetBrains Mono', monospace", fontSize: '0.55rem',
          letterSpacing: '0.2em', color: 'rgba(0,255,136,0.4)',
        }}>[{member.index}]</div>

        {/* ── photo area */}
        <div style={{ position: 'relative', width: '100%', paddingTop: '85%', overflow: 'hidden' }}>
          {/* glow backdrop */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `radial-gradient(ellipse at 50% 70%, rgba(0,255,136,0.08) 0%, transparent 65%)`,
          }} />
          {/* avatar — uses next/image in a real Next.js project; using <img> here for portability */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={member.avatar}
            alt={member.name}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center top',
              filter: 'grayscale(20%) contrast(1.05)',
              mixBlendMode: 'luminosity',
            }}
            onError={e => {
              // fallback: show initials if photo missing
              const img = e.currentTarget;
              img.style.display = 'none';
              const parent = img.parentElement!;
              const fb = parent.querySelector('.avatar-fallback') as HTMLElement | null;
              if (fb) fb.style.display = 'flex';
            }}
          />
          {/* fallback initials */}
          <div className="avatar-fallback" style={{
            display: 'none',
            position: 'absolute', inset: 0,
            alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Orbitron', monospace", fontSize: 'clamp(2.5rem, 8vw, 4rem)',
            fontWeight: 900, color: 'rgba(0,255,136,0.2)',
            background: `linear-gradient(160deg, #0a0a0a 0%, #0f1a14 100%)`,
          }}>
            {member.name.split(' ').map(n => n[0]).join('')}
          </div>
          {/* bottom gradient fade */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
            background: 'linear-gradient(to bottom, transparent, rgba(5,5,5,0.95))',
          }} />
        </div>

        {/* ── text body */}
        <div style={{ padding: 'clamp(16px,3vw,28px)', paddingTop: 16, position: 'relative', zIndex: 5 }}>
          {/* role label */}
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase',
            color: G, opacity: 0.6, marginBottom: 6,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: G, display: 'inline-block', boxShadow: `0 0 6px ${G}` }} />
            {member.role}
          </div>

          {/* name */}
          <h3 style={{
            fontFamily: "'Orbitron', monospace", fontWeight: 900,
            fontSize: 'clamp(1.1rem, 3.5vw, 1.5rem)', color: '#fff',
            margin: '0 0 4px',
            background: `linear-gradient(135deg, #fff 40%, ${G})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            lineHeight: 1.15,
          }}>{member.name}</h3>

          {/* handle */}
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem',
            color: 'rgba(255,255,255,0.25)', marginBottom: 16,
            letterSpacing: '0.08em',
          }}>@{member.handle}</div>

          {/* tags */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
            {member.tags.map(tag => (
              <span key={tag} style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.5rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                padding: '3px 9px', borderRadius: 100,
                border: '1px solid rgba(0,255,136,0.2)',
                background: 'rgba(0,255,136,0.05)',
                color: 'rgba(0,255,136,0.7)',
              }}>{tag}</span>
            ))}
          </div>

          {/* divider */}
          <div style={{ height: 1, background: 'rgba(0,255,136,0.08)', marginBottom: 18 }} />

          {/* social links */}
          <div style={{ display: 'flex', gap: 10 }}>
            <a
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} GitHub`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                padding: '8px 14px', borderRadius: 8,
                border: '1px solid rgba(0,255,136,0.15)',
                background: 'rgba(0,255,136,0.04)',
                color: 'rgba(255,255,255,0.55)',
                fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem',
                letterSpacing: '0.08em', textDecoration: 'none',
                transition: 'all 0.2s ease',
                flex: 1, justifyContent: 'center',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = 'rgba(0,255,136,0.4)';
                el.style.color = G;
                el.style.background = 'rgba(0,255,136,0.08)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = 'rgba(0,255,136,0.15)';
                el.style.color = 'rgba(255,255,255,0.55)';
                el.style.background = 'rgba(0,255,136,0.04)';
              }}
            >
              <GithubIcon /> GitHub
            </a>
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} LinkedIn`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                padding: '8px 14px', borderRadius: 8,
                border: '1px solid rgba(0,255,136,0.15)',
                background: 'rgba(0,255,136,0.04)',
                color: 'rgba(255,255,255,0.55)',
                fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem',
                letterSpacing: '0.08em', textDecoration: 'none',
                transition: 'all 0.2s ease',
                flex: 1, justifyContent: 'center',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = 'rgba(0,255,136,0.4)';
                el.style.color = G;
                el.style.background = 'rgba(0,255,136,0.08)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = 'rgba(0,255,136,0.15)';
                el.style.color = 'rgba(255,255,255,0.55)';
                el.style.background = 'rgba(0,255,136,0.04)';
              }}
            >
              <LinkedInIcon /> LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TeamPage() {
  const headRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Orbitron:wght@700;900&display=swap');

        .team-page-root {
          min-height: 100vh;
          background: #050505;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: clamp(60px, 10vw, 120px) clamp(20px, 6vw, 80px);
          position: relative;
          overflow: hidden;
        }

        /* subtle grid pattern */
        .team-page-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,255,136,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,136,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }

        /* radial glow blob center */
        .team-page-root::after {
          content: '';
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: min(800px, 120vw);
          height: min(600px, 80vw);
          background: radial-gradient(ellipse, rgba(0,255,136,0.04) 0%, transparent 65%);
          pointer-events: none;
        }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 400px));
          gap: clamp(16px, 3vw, 40px);
          width: 100%;
          max-width: 860px;
          position: relative;
          z-index: 2;
        }

        @media (max-width: 640px) {
          .team-grid {
            grid-template-columns: 1fr;
            max-width: 400px;
          }
        }

        .made-by-strip {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(0,255,136,0.4);
          text-align: center;
          margin-top: clamp(32px, 5vw, 56px);
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
        }

        .made-by-strip::before,
        .made-by-strip::after {
          content: '';
          flex: 1;
          max-width: 120px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,255,136,0.2));
        }
        .made-by-strip::after {
          background: linear-gradient(90deg, rgba(0,255,136,0.2), transparent);
        }
      `}</style>

      <div className="team-page-root">
        {/* ── heading block */}
        <div ref={headRef} style={{ textAlign: 'center', marginBottom: 'clamp(32px,6vw,64px)', position: 'relative', zIndex: 2, willChange: 'transform, opacity' }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.58rem', letterSpacing: '0.25em', textTransform: 'uppercase',
            color: 'rgba(0,255,136,0.55)', marginBottom: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: G, boxShadow: `0 0 8px ${G}`, display: 'inline-block' }} />
            Behind the Terminal
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: G, boxShadow: `0 0 8px ${G}`, display: 'inline-block' }} />
          </div>

          <h1 style={{
            fontFamily: "'Orbitron', monospace", fontWeight: 900,
            fontSize: 'clamp(2rem, 8vw, 5rem)',
            background: `linear-gradient(160deg, #ffffff 30%, ${G} 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            letterSpacing: '-0.02em', lineHeight: 1.05, margin: '0 0 16px',
          }}>
            THE BUILDERS
          </h1>

          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: 'rgba(255,255,255,0.3)', lineHeight: 1.8,
            fontSize: 'clamp(0.65rem, 1.5vw, 0.8rem)',
            maxWidth: 480, margin: '0 auto',
          }}>
            This platform was designed & engineered by two members of the Coding Club, Birla Institute of Applied Sciences.
          </p>
        </div>

        {/* ── cards */}
        <div className="team-grid">
          {TEAM.map((member, i) => (
            <MemberCard key={member.name} member={member} delay={200 + i * 150} />
          ))}
        </div>

        {/* ── footer strip */}
        <div className="made-by-strip">
          crafted with code · BIAS Coding Club · 2026
        </div>
      </div>
    </>
  );
}