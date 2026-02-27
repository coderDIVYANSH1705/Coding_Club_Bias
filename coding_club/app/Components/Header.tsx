import { useState, useEffect, useRef } from "react";
import GlassSurface from "./GlassSurface";

const NAV_LINKS = ["About the Club", "Upcoming Events", "Gallery", "Join Us"];

const MATRIX_CHARS = "01アイウエオカキクケコ{}[]<>/\\;:@#$%^&*";

function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const fontSize = 13;
    let columns: number[];
    let drops: number[];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      columns = Array.from(
        { length: Math.floor(canvas.width / fontSize) },
        () => 0
      );
      drops = columns.map(() => Math.random() * -100);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.fillStyle = "rgba(2, 8, 20, 0.04)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drops.forEach((y, i) => {
        const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        const x = i * fontSize;

        // Head glow
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#00ff88";
        ctx.fillStyle = "#c8ffe8";
        ctx.font = `bold ${fontSize}px 'Courier New', monospace`;
        ctx.fillText(char, x, y * fontSize);

        // Trail
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(0,255,120,0.18)";
        ctx.fillText(char, x, (y - 1) * fontSize);

        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 0.6;
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity: 0.35,
        pointerEvents: "none",
      }}
    />
  );
}

function GlitchText({ text }: { text: string }) {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 3500 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        animation: glitch ? "glitch 0.2s steps(2) forwards" : "none",
      }}
    >
      {text}
      <style>{`
        @keyframes glitch {
          0%   { transform: translate(0); }
          20%  { transform: translate(-3px, 1px); clip-path: inset(10% 0 60% 0); }
          40%  { transform: translate(3px, -1px); clip-path: inset(50% 0 10% 0); }
          60%  { transform: translate(-1px, 2px); clip-path: inset(30% 0 40% 0); }
          80%  { transform: translate(1px, -2px); }
          100% { transform: translate(0); clip-path: none; }
        }
      `}</style>
    </span>
  );
}

function TerminalCursor() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setVisible((v) => !v), 530);
    return () => clearInterval(t);
  }, []);
  return (
    <span
      style={{
        display: "inline-block",
        width: "0.6em",
        height: "1.1em",
        background: "#00ff88",
        marginLeft: 2,
        verticalAlign: "text-bottom",
        opacity: visible ? 1 : 0,
        boxShadow: visible ? "0 0 8px #00ff88" : "none",
        transition: "opacity 0.1s",
        borderRadius: 1,
      }}
    />
  );
}

function NavItem({ label }: { label: string }) {
  const [hovered, setHovered] = useState(false);
  const slug = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <a
      href={`#${slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        color: hovered ? "#00ff88" : "rgba(200,255,230,0.8)",
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
        fontSize: "clamp(0.7rem, 1.2vw, 0.88rem)",
        fontWeight: 500,
        textDecoration: "none",
        letterSpacing: "0.05em",
        padding: "8px 14px",
        borderRadius: 6,
        transition: "color 0.25s, background 0.25s, box-shadow 0.25s",
        background: hovered ? "rgba(0,255,136,0.08)" : "transparent",
        boxShadow: hovered ? "0 0 12px rgba(0,255,136,0.18), inset 0 0 12px rgba(0,255,136,0.05)" : "none",
      }}
    >
      <span style={{ color: "#00ff88", opacity: hovered ? 1 : 0.5, fontSize: "0.75em" }}>
        {hovered ? "▶" : "//"}
      </span>
      {label}
      {hovered && (
        <span
          style={{
            position: "absolute",
            bottom: 2,
            left: 14,
            right: 14,
            height: 1,
            background: "linear-gradient(90deg, transparent, #00ff88, transparent)",
            animation: "lineIn 0.25s ease forwards",
          }}
        />
      )}
      <style>{`@keyframes lineIn { from { transform: scaleX(0) } to { transform: scaleX(1) } }`}</style>
    </a>
  );
}

export default function CodingClubHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Orbitron:wght@700;900&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .header-root {
          position: relative;
          width: 100%;
          min-height: 100vh;
          background: #020814;
          overflow: hidden;
          font-family: 'JetBrains Mono', monospace;
        }

        /* Ambient gradient blobs */
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          opacity: 0.18;
          animation: blobFloat 8s ease-in-out infinite alternate;
        }
        .blob-1 { width: 500px; height: 500px; background: #00ff88; top: -100px; left: -100px; animation-delay: 0s; }
        .blob-2 { width: 400px; height: 400px; background: #00ccff; bottom: -80px; right: -80px; animation-delay: -3s; }
        .blob-3 { width: 300px; height: 300px; background: #7c3aed; top: 40%; left: 55%; animation-delay: -5s; }

        @keyframes blobFloat {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(30px, 20px) scale(1.08); }
        }

        /* Navbar */
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
          padding: clamp(10px, 2vw, 18px) clamp(16px, 4vw, 48px);
        }
        .navbar.scrolled {
          background: rgba(2,8,20,0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0,255,136,0.12);
          box-shadow: 0 4px 30px rgba(0,0,0,0.5);
        }
        .navbar-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        /* Logo */
        .logo {
          display: flex;
          flex-direction: column;
          gap: 2px;
          text-decoration: none;
        }
        .logo-tag {
          font-size: 0.6rem;
          color: rgba(0,255,136,0.6);
          letter-spacing: 0.15em;
          font-family: 'JetBrains Mono', monospace;
        }
        .logo-main {
          font-family: 'Orbitron', monospace;
          font-weight: 900;
          font-size: clamp(1rem, 2.5vw, 1.4rem);
          background: linear-gradient(135deg, #00ff88 0%, #00ccff 60%, #7c3aed 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 0.08em;
          text-shadow: none;
          white-space: nowrap;
        }
        .logo-sub {
          font-size: 0.55rem;
          color: rgba(0,204,255,0.5);
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        /* Nav links */
        .nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
          list-style: none;
        }

        /* Hamburger */
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          padding: 8px;
          background: none;
          border: none;
          z-index: 200;
        }
        .ham-bar {
          width: 24px;
          height: 2px;
          background: #00ff88;
          border-radius: 2px;
          transition: all 0.3s ease;
          box-shadow: 0 0 6px #00ff88;
        }
        .hamburger.open .ham-bar:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
        .hamburger.open .ham-bar:nth-child(2) { opacity: 0; }
        .hamburger.open .ham-bar:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

        /* Mobile menu */
        .mobile-menu {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(2,8,20,0.97);
          backdrop-filter: blur(30px);
          z-index: 90;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 24px;
          padding: 80px 24px 24px;
          border-bottom: 1px solid rgba(0,255,136,0.1);
          animation: menuSlideIn 0.35s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        .mobile-menu.open { display: flex; }
        @keyframes menuSlideIn {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Hero content */
        .hero {
          position: relative;
          z-index: 10;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: clamp(80px, 12vw, 140px) clamp(16px, 4vw, 48px) clamp(48px, 6vw, 80px);
          text-align: center;
        }

        /* Typewriter label */
        .hero-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(0,255,136,0.06);
          border: 1px solid rgba(0,255,136,0.2);
          border-radius: 4px;
          padding: 6px 16px;
          font-size: clamp(0.6rem, 1.3vw, 0.75rem);
          color: #00ff88;
          letter-spacing: 0.2em;
          margin-bottom: clamp(20px, 3vw, 32px);
          animation: fadeSlideUp 0.8s ease 0.2s both;
        }

        .hero-title {
          font-family: 'Orbitron', monospace;
          font-weight: 900;
          font-size: clamp(2.2rem, 7vw, 6rem);
          line-height: 1.05;
          margin-bottom: clamp(8px, 1.5vw, 16px);
          animation: fadeSlideUp 0.8s ease 0.4s both;
        }
        .title-line1 {
          display: block;
          background: linear-gradient(135deg, #ffffff 0%, #c8ffe8 60%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .title-line2 {
          display: block;
          background: linear-gradient(135deg, #00ff88 0%, #00ccff 50%, #7c3aed 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 30px rgba(0,255,136,0.3));
        }

        .hero-institute {
          font-size: clamp(0.65rem, 1.8vw, 0.95rem);
          color: rgba(0,204,255,0.7);
          letter-spacing: 0.25em;
          text-transform: uppercase;
          margin-bottom: clamp(16px, 2.5vw, 28px);
          animation: fadeSlideUp 0.8s ease 0.55s both;
        }

        .hero-desc {
          max-width: 540px;
          font-size: clamp(0.75rem, 1.5vw, 0.92rem);
          color: rgba(200,255,230,0.55);
          line-height: 1.8;
          margin-bottom: clamp(28px, 4vw, 48px);
          animation: fadeSlideUp 0.8s ease 0.7s both;
        }

        /* CTA Buttons */
        .cta-group {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          justify-content: center;
          animation: fadeSlideUp 0.8s ease 0.85s both;
        }
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 28px;
          background: linear-gradient(135deg, #00ff88, #00ccff);
          color: #020814;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
          font-size: clamp(0.7rem, 1.2vw, 0.82rem);
          letter-spacing: 0.1em;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 0 20px rgba(0,255,136,0.3), 0 0 40px rgba(0,255,136,0.1);
        }
        .btn-primary:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 0 30px rgba(0,255,136,0.5), 0 0 60px rgba(0,255,136,0.2);
        }
        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          background: transparent;
          color: rgba(200,255,230,0.8);
          font-family: 'JetBrains Mono', monospace;
          font-weight: 500;
          font-size: clamp(0.7rem, 1.2vw, 0.82rem);
          letter-spacing: 0.1em;
          border: 1px solid rgba(0,255,136,0.3);
          border-radius: 6px;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.25s;
        }
        .btn-secondary:hover {
          border-color: rgba(0,255,136,0.7);
          color: #00ff88;
          background: rgba(0,255,136,0.05);
          box-shadow: 0 0 20px rgba(0,255,136,0.15);
        }

        /* Stats bar */
        .stats-bar {
          display: flex;
          flex-wrap: wrap;
          gap: clamp(12px, 3vw, 32px);
          justify-content: center;
          margin-top: clamp(36px, 5vw, 64px);
          animation: fadeSlideUp 0.8s ease 1s both;
        }
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .stat-value {
          font-family: 'Orbitron', monospace;
          font-size: clamp(1.4rem, 3vw, 2.2rem);
          font-weight: 900;
          background: linear-gradient(135deg, #00ff88, #00ccff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .stat-label {
          font-size: 0.6rem;
          color: rgba(200,255,230,0.4);
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }
        .stat-divider {
          width: 1px;
          height: 40px;
          background: rgba(0,255,136,0.15);
          align-self: center;
        }

        /* Section cards (nav sections) */
        .sections-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: clamp(12px, 2vw, 20px);
          max-width: 1200px;
          width: 100%;
          margin: clamp(48px, 6vw, 80px) auto 0;
          padding: 0 clamp(16px, 4vw, 48px);
          animation: fadeSlideUp 0.8s ease 1.1s both;
        }

        .section-card {
          position: relative;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(0,255,136,0.1);
          border-radius: 10px;
          padding: clamp(18px, 2.5vw, 28px);
          cursor: pointer;
          text-decoration: none;
          overflow: hidden;
          transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .section-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0,255,136,0.06) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.35s;
        }
        .section-card:hover {
          border-color: rgba(0,255,136,0.35);
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.4), 0 0 20px rgba(0,255,136,0.08);
        }
        .section-card:hover::before { opacity: 1; }

        .card-icon {
          width: 40px; height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          background: rgba(0,255,136,0.08);
          border: 1px solid rgba(0,255,136,0.15);
        }
        .card-tag {
          font-size: 0.58rem;
          color: #00ff88;
          letter-spacing: 0.2em;
          opacity: 0.7;
        }
        .card-title {
          font-family: 'Orbitron', monospace;
          font-size: clamp(0.85rem, 1.5vw, 1rem);
          color: rgba(255,255,255,0.9);
          font-weight: 700;
          letter-spacing: 0.05em;
        }
        .card-desc {
          font-size: clamp(0.65rem, 1vw, 0.75rem);
          color: rgba(200,255,230,0.4);
          line-height: 1.7;
        }
        .card-arrow {
          align-self: flex-end;
          color: rgba(0,255,136,0.4);
          font-size: 0.9rem;
          transition: transform 0.2s, color 0.2s;
        }
        .section-card:hover .card-arrow {
          color: #00ff88;
          transform: translate(3px, -3px);
        }

        /* Scroll indicator */
        .scroll-hint {
          position: absolute;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          color: rgba(0,255,136,0.35);
          font-size: 0.55rem;
          letter-spacing: 0.2em;
          animation: scrollBounce 2s ease-in-out infinite;
        }
        .scroll-mouse {
          width: 20px; height: 32px;
          border: 1.5px solid rgba(0,255,136,0.3);
          border-radius: 10px;
          display: flex;
          justify-content: center;
          padding-top: 6px;
        }
        .scroll-dot {
          width: 3px; height: 6px;
          background: #00ff88;
          border-radius: 2px;
          animation: scrollDot 1.8s ease-in-out infinite;
          box-shadow: 0 0 4px #00ff88;
        }
        @keyframes scrollDot {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(8px); opacity: 0.3; }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(6px); }
        }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Grid lines decoration */
        .grid-lines {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,255,136,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,136,0.025) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        /* Scanline */
        .scanline {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.03) 2px,
            rgba(0,0,0,0.03) 4px
          );
          pointer-events: none;
          opacity: 0.5;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .nav-links { display: none; }
          .hamburger { display: flex; }
          .stat-divider { display: none; }
        }
        @media (max-width: 480px) {
          .sections-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="header-root">
        {/* Ambient blobs */}
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />

        {/* Matrix rain */}
        <MatrixRain />

        {/* Grid lines */}
        <div className="grid-lines" />
        <div className="scanline" />

        {/* GlassSurface as bg overlay */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }}>
          <GlassSurface
            width="100%"
            height="100%"
            style={{ opacity: 0.25 }}
          />
        </div>

        {/* NAVBAR */}
        <nav className={`navbar${scrolled ? " scrolled" : ""}`} style={{ zIndex: 100 }}>
          <div className="navbar-inner">
            <a href="#" className="logo">
              <span className="logo-tag">{"<ClubInit />"}</span>
              <span className="logo-main">CODE.BIAS</span>
              <span className="logo-sub">Birla Institute of Applied Sciences</span>
            </a>

            <ul className="nav-links">
              {NAV_LINKS.map((link) => (
                <li key={link}>
                  <NavItem label={link} />
                </li>
              ))}
            </ul>

            <a
              href="#join"
              className="btn-primary"
              style={{ display: "none", fontSize: "0.7rem", padding: "10px 20px" }}
            >
              &gt;_ JOIN
            </a>

            <button
              className={`hamburger${menuOpen ? " open" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <div className="ham-bar" />
              <div className="ham-bar" />
              <div className="ham-bar" />
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="mobile-menu open">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setMenuOpen(false)}
                style={{
                  color: "rgba(200,255,230,0.85)",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  letterSpacing: "0.1em",
                  padding: "12px 0",
                  borderBottom: "1px solid rgba(0,255,136,0.08)",
                  width: "100%",
                  textAlign: "center",
                  animation: `fadeSlideUp 0.3s ease ${i * 0.07}s both`,
                }}
              >
                <span style={{ color: "#00ff88", marginRight: 10 }}>0{i + 1}.</span>
                {link}
              </a>
            ))}
          </div>
        )}

        {/* HERO */}
        <div className="hero" style={{ position: "relative", zIndex: 10 }}>
          {/* Intro label */}
          <div className="hero-label">
            <span>●</span>
            <span>INITIALIZING CLUB PORTAL...</span>
            <span style={{ opacity: 0.5 }}>v2.0.26</span>
          </div>

          {/* Main title */}
          <h1 className="hero-title">
            <span className="title-line1">WHERE CODE</span>
            <span className="title-line2">
              <GlitchText text="MEETS CULTURE" />
            </span>
          </h1>

          <p className="hero-institute">
            Coding Club · Birla Institute of Applied Sciences
          </p>

          <p className="hero-desc">
            Building the next generation of problem-solvers, one commit at a time.
            Compete. Collaborate. Create.
            <TerminalCursor />
          </p>

          {/* CTA */}
          <div className="cta-group">
            <a href="#upcoming-events" className="btn-primary">
              <span>⚡</span> VIEW EVENTS
            </a>
            <a href="#about-the-club" className="btn-secondary">
              <span>{"</>"}</span> EXPLORE CLUB
            </a>
          </div>

          {/* Stats */}
          <div className="stats-bar">
            {[
              { value: "200+", label: "Members" },
              { value: "48", label: "Hackathons" },
              { value: "12", label: "Projects" },
              { value: "5★", label: "Rating" },
            ].map((stat, i) => (
              <div key={stat.label} style={{ display: "flex", alignItems: "center", gap: "inherit" }}>
                {i > 0 && <div className="stat-divider" />}
                <div className="stat-item">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Section Cards */}
          <div className="sections-grid" id="about-the-club">
            {[
              {
                icon: "🧠",
                tag: "01 / ABOUT",
                title: "About the Club",
                href: "#about-the-club",
                desc: "Meet the community behind BIAS's premier coding culture. Founded by engineers, for engineers.",
              },
              {
                icon: "🗓",
                tag: "02 / EVENTS",
                title: "Upcoming Events",
                href: "#upcoming-events",
                desc: "Hackathons, DSA sprints, open-source jams, and tech talks — never miss a session.",
              },
              {
                icon: "📸",
                tag: "03 / GALLERY",
                title: "Gallery",
                href: "#gallery",
                desc: "Snapshots from our build nights, competitions, and the moments in between.",
              },
            ].map((card) => (
              <a key={card.title} href={card.href} className="section-card">
                <div className="card-icon">{card.icon}</div>
                <span className="card-tag">{card.tag}</span>
                <div className="card-title">{card.title}</div>
                <div className="card-desc">{card.desc}</div>
                <span className="card-arrow">↗</span>
              </a>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="scroll-hint">
          <div className="scroll-mouse">
            <div className="scroll-dot" />
          </div>
          <span>SCROLL</span>
        </div>
      </div>
    </>
  );
}