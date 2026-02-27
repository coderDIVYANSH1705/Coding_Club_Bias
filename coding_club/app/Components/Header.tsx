import GlassSurface from "./GlassSurface";

const NAV_LINKS = ["About the Club", "Upcoming Events", "Gallery"];

export default function CodingClubHeader() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap');

        .header-wrap {
          position: relative;
          width: 100%;
          min-height: 100vh;
          background: #0a0f1e;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: 'JetBrains Mono', monospace;
          overflow: hidden;
        }

        .header-wrap::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,255,136,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,136,0.04) 1px, transparent 1px);
          background-size: 50px 50px;
          pointer-events: none;
        }

        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.15;
          pointer-events: none;
        }
        .blob-1 { width: 400px; height: 400px; background: #00ff88; top: -100px; left: -80px; }
        .blob-2 { width: 350px; height: 350px; background: #00cfff; bottom: -80px; right: -60px; }

        .glass-card {
          position: relative;
          z-index: 10;
          width: 90%;
          max-width: 860px;
          border-radius: 20px;
          overflow: hidden;
        }

        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          padding: 20px 32px;
          border-bottom: 1px solid rgba(0,255,136,0.12);
        }

        .logo-name {
          font-size: 1.1rem;
          font-weight: 700;
          color: #00ff88;
          letter-spacing: 0.05em;
        }
        .logo-sub {
          font-size: 0.55rem;
          color: rgba(200,255,230,0.45);
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .nav-links {
          display: flex;
          gap: 6px;
          list-style: none;
          flex-wrap: wrap;
        }
        .nav-links a {
          color: rgba(200,255,230,0.7);
          text-decoration: none;
          font-size: 0.75rem;
          padding: 6px 12px;
          border-radius: 6px;
          transition: all 0.2s;
          border: 1px solid transparent;
        }
        .nav-links a:hover {
          color: #00ff88;
          border-color: rgba(0,255,136,0.25);
          background: rgba(0,255,136,0.06);
        }

        .hero-body {
          padding: 52px 40px 48px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }

        .hero-tag {
          font-size: 0.62rem;
          color: #00ff88;
          letter-spacing: 0.25em;
          opacity: 0.7;
        }

        .hero-title {
          font-size: clamp(1.8rem, 5vw, 3rem);
          font-weight: 700;
          color: #fff;
          line-height: 1.15;
          margin: 0;
        }
        .hero-title span { color: #00ff88; }

        .hero-desc {
          font-size: clamp(0.7rem, 1.3vw, 0.82rem);
          color: rgba(200,255,230,0.5);
          max-width: 480px;
          line-height: 1.8;
        }

        .hero-cta {
          margin-top: 8px;
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .btn {
          padding: 11px 26px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          text-decoration: none;
          letter-spacing: 0.08em;
          transition: all 0.2s;
          border: none;
        }
        .btn-solid {
          background: #00ff88;
          color: #0a0f1e;
          box-shadow: 0 0 20px rgba(0,255,136,0.3);
        }
        .btn-solid:hover { transform: translateY(-2px); box-shadow: 0 0 30px rgba(0,255,136,0.5); }
        .btn-outline {
          background: transparent;
          color: rgba(200,255,230,0.75);
          border: 1px solid rgba(0,255,136,0.3);
        }
        .btn-outline:hover { border-color: #00ff88; color: #00ff88; background: rgba(0,255,136,0.05); }

        @media (max-width: 560px) {
          .navbar { flex-direction: column; align-items: flex-start; padding: 16px 20px; }
          .hero-body { padding: 36px 20px 36px; }
          .nav-links a { font-size: 0.68rem; padding: 5px 8px; }
        }
      `}</style>

      <div className="header-wrap">
        <div className="blob blob-1" />
        <div className="blob blob-2" />

        <div className="glass-card">
          <GlassSurface>
            <nav className="navbar">
              <div>
                <div className="logo-name">&lt;CodeClub /&gt;</div>
                <div className="logo-sub">Birla Institute of Applied Sciences</div>
              </div>
              <ul className="nav-links">
                {NAV_LINKS.map((link) => (
                  <li key={link}>
                    <a href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}>{link}</a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="hero-body">
              <span className="hero-tag"> BIRLA INSTITUTE OF APPLIED SCIENCES</span>
              <h1 className="hero-title">
                The Official<br /><span>Coding Club</span>
              </h1>
              <p className="hero-desc">
                Build. Compete. Collaborate. Join a community of developers pushing the limits at BIAS.
              </p>
              <div className="hero-cta">
                <a href="#upcoming-events" className="btn btn-solid">View Events</a>
                <a href="#about-the-club" className="btn btn-outline">About Us</a>
              </div>
            </div>
          </GlassSurface>
        </div>
      </div>
    </>
  );
}