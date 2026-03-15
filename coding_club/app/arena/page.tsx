"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"

/* ── Matrix Rain ────────────────────────────────────────── */
function MatrixRain() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current!
    const ctx = c.getContext("2d")!
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight }
    resize()
    window.addEventListener("resize", resize)
    const chars = "アイウエオカキクケコ0123456789ABCDEF<>{}[]|/\\"
    const cols = Math.floor(c.width / 18)
    const drops = Array(cols).fill(1)
    const tick = setInterval(() => {
      ctx.fillStyle = "rgba(0,0,0,0.052)"
      ctx.fillRect(0, 0, c.width, c.height)
      for (let i = 0; i < drops.length; i++) {
        const ch = chars[Math.floor(Math.random() * chars.length)]
        ctx.font = "13px monospace"
        ctx.fillStyle = Math.random() > 0.97 ? "#fff" : i % 5 === 0 ? "#39ff14" : "#007a1e"
        ctx.fillText(ch, i * 18, drops[i] * 18)
        if (drops[i] * 18 > c.height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      }
    }, 42)
    return () => { clearInterval(tick); window.removeEventListener("resize", resize) }
  }, [])
  return <canvas ref={ref} style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", opacity:0.13 }} />
}

/* ── CRT Scanlines ──────────────────────────────────────── */
function Scanlines() {
  return (
    <div style={{
      position:"fixed", inset:0, zIndex:9999, pointerEvents:"none",
      background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.07) 2px,rgba(0,0,0,0.07) 4px)",
    }} />
  )
}

/* ── Glitch Title ───────────────────────────────────────── */
function GlitchTitle({ text }: { text: string }) {
  return (
    <>
      <style>{`
        .gt{position:relative;display:inline-block;}
        .gt::before,.gt::after{content:attr(data-t);position:absolute;inset:0;overflow:hidden;}
        .gt::before{color:#ff003c;clip-path:polygon(0 18%,100% 18%,100% 36%,0 36%);animation:gtb 5s infinite;}
        .gt::after{color:#00f0ff;clip-path:polygon(0 62%,100% 62%,100% 78%,0 78%);animation:gta 5s infinite;}
        @keyframes gta{0%,90%,100%{transform:translate(0)}92%{transform:translate(-3px,1px)}95%{transform:translate(2px,-1px)}}
        @keyframes gtb{0%,90%,100%{transform:translate(0)}92%{transform:translate(3px,-1px)}95%{transform:translate(-2px,1px)}}
      `}</style>
      <span className="gt" data-t={text}>{text}</span>
    </>
  )
}

/* ── Blinking Cursor ────────────────────────────────────── */
function Cursor() {
  return (
    <>
      <style>{`.bc{animation:bca .9s step-end infinite}@keyframes bca{0%,100%{opacity:1}50%{opacity:0}}`}</style>
      <span className="bc" style={{ color:"#39ff14", textShadow:"0 0 6px #39ff14" }}>█</span>
    </>
  )
}

/* ── HUD Corners ────────────────────────────────────────── */
function HUD({ color = "#39ff1455" }: { color?: string }) {
  const s = (top: boolean, left: boolean): React.CSSProperties => ({
    position:"absolute", width:16, height:16,
    top: top ? 10 : "auto", bottom: !top ? 10 : "auto",
    left: left ? 10 : "auto", right: !left ? 10 : "auto",
    borderTop: top ? `1px solid ${color}` : "none",
    borderBottom: !top ? `1px solid ${color}` : "none",
    borderLeft: left ? `1px solid ${color}` : "none",
    borderRight: !left ? `1px solid ${color}` : "none",
    transition:"all .3s ease",
  })
  return <><div style={s(true,true)}/><div style={s(true,false)}/><div style={s(false,true)}/><div style={s(false,false)}/></>
}

/* ── Arena Card ─────────────────────────────────────────── */
type CardProps = {
  icon: string
  title: string
  desc: string
  tag: string
  accent: string
  index: number
  onClick: () => void
}

function ArenaCard({ icon, title, desc, tag, accent, index, onClick }: CardProps) {
  const [hover, setHover] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position:"relative",
        background: hover ? `rgba(0,8,0,0.97)` : "rgba(0,5,0,0.88)",
        border:`1px solid ${hover ? accent : "#1c3a1c"}`,
        borderRadius:3,
        padding:"32px 28px 28px",
        cursor:"pointer",
        boxShadow: hover
          ? `0 0 40px ${accent}22, inset 0 0 60px ${accent}08`
          : "0 0 20px rgba(0,255,65,0.02)",
        transform: hover ? "translateY(-4px)" : "translateY(0)",
        transition:"all .25s cubic-bezier(.4,0,.2,1)",
        animation:`fadeUp ${0.3 + index * 0.12}s ease both`,
        overflow:"hidden",
      }}
    >
      <HUD color={hover ? `${accent}99` : "#39ff1433"} />

      {/* scanline shimmer on hover */}
      {hover && (
        <div style={{
          position:"absolute", inset:0, pointerEvents:"none", zIndex:1,
          background:`linear-gradient(180deg, transparent 0%, ${accent}06 50%, transparent 100%)`,
          animation:"shimmer 1.8s ease infinite",
        }} />
      )}

      {/* status dot */}
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20, position:"relative", zIndex:2 }}>
        <span style={{
          width:7, height:7, borderRadius:"50%",
          background: accent,
          boxShadow:`0 0 8px ${accent}`,
          display:"inline-block",
          animation:"pulse 1.4s ease infinite",
        }} />
        <span style={{ fontFamily:"monospace", fontSize:10, color: hover ? accent : "#2a5a2a", letterSpacing:3, transition:"color .2s" }}>
          {tag}
        </span>
      </div>

      {/* icon */}
      <div style={{
        fontFamily:"'VT323',monospace",
        fontSize:52,
        lineHeight:1,
        marginBottom:14,
        filter: hover ? `drop-shadow(0 0 12px ${accent})` : "none",
        transition:"filter .25s ease",
        position:"relative", zIndex:2,
      }}>
        {icon}
      </div>

      {/* title */}
      <h2 style={{
        fontFamily:"'VT323',monospace",
        fontSize:34,
        color: hover ? accent : "#39ff14",
        textShadow: hover ? `0 0 16px ${accent}` : "none",
        letterSpacing:4,
        margin:"0 0 10px",
        transition:"all .2s ease",
        position:"relative", zIndex:2,
      }}>
        {title}
      </h2>

      {/* desc */}
      <p style={{
        fontFamily:"monospace",
        fontSize:12,
        color: hover ? "#a0dca0" : "#3a6a3a",
        lineHeight:1.7,
        margin:"0 0 20px",
        transition:"color .2s ease",
        position:"relative", zIndex:2,
      }}>
        {desc}
      </p>

      {/* launch line */}
      <div style={{
        display:"flex", alignItems:"center", gap:8,
        fontFamily:"monospace", fontSize:11, letterSpacing:2,
        color: hover ? accent : "#1c3c1c",
        transition:"color .2s ease",
        position:"relative", zIndex:2,
      }}>
        <span style={{ textShadow: hover ? `0 0 6px ${accent}` : "none" }}>▶</span>
        <span>{hover ? "ENTER_MODULE" : "STANDBY..."}</span>
        {hover && <Cursor />}
      </div>
    </div>
  )
}

/* ── Typing subtitle ────────────────────────────────────── */
function TypedSub({ text }: { text: string }) {
  const [out, setOut] = useState("")
  useEffect(() => {
    let i = 0
    const t = setInterval(() => {
      i++; setOut(text.slice(0, i))
      if (i >= text.length) clearInterval(t)
    }, 30)
    return () => clearInterval(t)
  }, [text])
  return <span>{out}</span>
}

/* ════════════════════════════════════════════════════════ */
/*  PAGE — router.push untouched                            */
/* ════════════════════════════════════════════════════════ */
export default function ArenaPage() {

  const router = useRouter()  // ← untouched

  const [visible, setVisible] = useState(false)
  useEffect(() => { requestAnimationFrame(() => setVisible(true)) }, [])

  const cards = [
    {
      icon: "⌥",
      title: "MISSING LINE",
      desc: "Complete the missing line in the code snippet. Test your coding speed and accuracy.",
      tag: "MODULE_01 // ACTIVE",
      accent: "#39ff14",
      route: "/arena/missing-line",
    },
    {
      icon: "⬡",
      title: "DSA QUIZ",
      desc: "Solve multiple choice questions related to Data Structures and Algorithms.",
      tag: "MODULE_02 // ACTIVE",
      accent: "#00ffaa",
      route: "/arena/dsa-quiz",
    },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=VT323&display=swap');
        *,*::before,*::after{box-sizing:border-box;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.6)}}
        @keyframes shimmer{0%{opacity:0}50%{opacity:1}100%{opacity:0}}
        @keyframes scanX{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
      `}</style>
      <Scanlines />

      <div style={{
        minHeight:"100vh",
        background:"#000",
        color:"#00ff41",
        fontFamily:"'Share Tech Mono','Courier New',monospace",
        position:"relative",
        overflow:"hidden",
      }}>
        <MatrixRain />

        <div style={{
          position:"relative", zIndex:10,
          maxWidth:860, margin:"0 auto",
          padding:"40px 20px 64px",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transition:"opacity .7s ease, transform .7s ease",
        }}>

          {/* Window chrome */}
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:48 }}>
            <div style={{ display:"flex", gap:6 }}>
              {(["#ff5f56","#ffbd2e","#27c93f"] as const).map((c,i) => (
                <div key={i} style={{ width:12, height:12, borderRadius:"50%", background:c, boxShadow:`0 0 6px ${c}` }} />
              ))}
            </div>
            <span style={{ fontFamily:"'VT323',monospace", fontSize:17, color:"#39ff14", letterSpacing:3, textShadow:"0 0 8px #39ff14" }}>
              CODING_ARENA — root@matrix:~$
            </span>
          </div>

          {/* Hero */}
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <h1 style={{
              fontFamily:"'VT323',monospace",
              fontSize:"clamp(52px,10vw,96px)",
              color:"#39ff14",
              textShadow:"0 0 30px #39ff14, 0 0 80px #00b32c44",
              letterSpacing:10, lineHeight:1,
              margin:"0 0 12px",
              animation:"fadeUp .5s ease both",
            }}>
              <GlitchTitle text="CODING ARENA" />
            </h1>

            <p style={{
              fontFamily:"monospace", fontSize:12, color:"#2a5a2a",
              letterSpacing:4, margin:"0 0 20px",
              animation:"fadeUp .5s ease .1s both",
            }}>
              // SELECT A MODULE TO BEGIN YOUR SESSION
            </p>

            <div style={{
              display:"inline-block",
              fontFamily:"monospace", fontSize:13, color:"#007a1e",
              animation:"fadeUp .5s ease .2s both",
            }}>
              <span style={{ color:"#39ff14", marginRight:8 }}>$</span>
              <TypedSub text="ls ./modules --active --verbose" />
              <Cursor />
            </div>
          </div>

          {/* horizontal divider */}
          <div style={{
            display:"flex", alignItems:"center", gap:12,
            marginBottom:36,
            animation:"fadeUp .5s ease .3s both",
          }}>
            <div style={{ flex:1, height:1, background:"linear-gradient(90deg,transparent,#1c3a1c)" }} />
            <span style={{ fontFamily:"monospace", fontSize:10, color:"#2a5a2a", letterSpacing:4 }}>2 MODULES FOUND</span>
            <div style={{ flex:1, height:1, background:"linear-gradient(90deg,#1c3a1c,transparent)" }} />
          </div>

          {/* Cards grid */}
          <div style={{
            display:"grid",
            gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",
            gap:24,
            marginBottom:48,
          }}>
            {cards.map((card, i) => (
              <ArenaCard
                key={card.route}
                icon={card.icon}
                title={card.title}
                desc={card.desc}
                tag={card.tag}
                accent={card.accent}
                index={i}
                onClick={() => router.push(card.route)}  // ← untouched
              />
            ))}
          </div>

          {/* Footer */}
          <div style={{ textAlign:"center", fontFamily:"monospace", fontSize:10, color:"#1a3a1a", letterSpacing:3 }}>
            SYS.SECURE ░░ ENCRYPTION.ACTIVE ░░ PID:{Math.random().toString(36).slice(2,10).toUpperCase()}
          </div>

        </div>
      </div>
    </>
  )
}