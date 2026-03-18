"use client"

import { useState, useEffect, useRef } from "react"
import { dsaTopics } from "@/lib/dsa-topics"
import Result from "./Result"

/* ── Types ──────────────────────────────────────────────── */
type Question = {
  question: string
  options: string[]
  answer: string
}

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
  return <canvas ref={ref} style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", opacity:0.12 }} />
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

/* ── Spinner ────────────────────────────────────────────── */
function Spinner() {
  const f = ["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"]
  const [i, setI] = useState(0)
  useEffect(() => { const t = setInterval(() => setI(p => (p+1)%f.length), 80); return () => clearInterval(t) }, [])
  return <span style={{ color:"#39ff14", fontSize:18 }}>{f[i]}</span>
}

/* ── HUD Corners ────────────────────────────────────────── */
function HUD() {
  const s = (top: boolean, left: boolean): React.CSSProperties => ({
    position:"absolute", width:14, height:14,
    top: top ? 8 : "auto", bottom: !top ? 8 : "auto",
    left: left ? 8 : "auto", right: !left ? 8 : "auto",
    borderTop: top ? "1px solid #39ff1455" : "none",
    borderBottom: !top ? "1px solid #39ff1455" : "none",
    borderLeft: left ? "1px solid #39ff1455" : "none",
    borderRight: !left ? "1px solid #39ff1455" : "none",
  })
  return <><div style={s(true,true)}/><div style={s(true,false)}/><div style={s(false,true)}/><div style={s(false,false)}/></>
}

/* ── Panel ──────────────────────────────────────────────── */
function Panel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      position:"relative", background:"rgba(0,5,0,0.9)",
      border:"1px solid #1c3a1c", borderRadius:2,
      padding:"28px 28px 24px",
      boxShadow:"0 0 40px rgba(0,255,65,0.04), inset 0 0 60px rgba(0,255,65,0.01)",
      ...style,
    }}>
      <HUD />{children}
    </div>
  )
}

/* ── Progress Bar ───────────────────────────────────────── */
function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? Math.round(((current + 1) / total) * 100) : 0
  return (
    <div style={{ marginBottom:22 }}>
      <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"monospace", fontSize:11, color:"#007a1e", marginBottom:5, letterSpacing:2 }}>
        <span>PROGRESS__{current+1}/{total}</span>
        <span style={{ color: pct===100 ? "#39ff14" : "#007a1e" }}>{pct}%</span>
      </div>
      <div style={{ height:3, background:"#0a140a", border:"1px solid #1a3a1a", overflow:"hidden", borderRadius:1 }}>
        <div style={{ height:"100%", width:`${pct}%`, background:"linear-gradient(90deg,#005c12,#39ff14)", boxShadow:"0 0 10px #39ff14aa", transition:"width .55s cubic-bezier(.4,0,.2,1)" }} />
      </div>
    </div>
  )
}

/* ── Terminal Select ────────────────────────────────────── */
function TermSelect({ label, value, onChange, children }: {
  label: string; value: string
  onChange: (v: string) => void; children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ marginBottom:20, fontFamily:"monospace" }}>
      <div style={{ fontSize:11, color:"#007a1e", letterSpacing:3, marginBottom:7 }}>
        <span style={{ color:"#39ff14", marginRight:8 }}>$</span>{label}
      </div>
      <div style={{ position:"relative" }}>
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            width:"100%", padding:"10px 14px",
            background:"#000e00", border:"1px solid #1c3a1c",
            borderRadius:2, color:"#39ff14",
            fontFamily:"monospace", fontSize:13,
            appearance:"none", cursor:"pointer",
            outline:"none",
            boxShadow:"inset 0 0 20px rgba(0,255,65,0.015)",
          }}
        >
          {children}
        </select>
        <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", color:"#39ff14", pointerEvents:"none", fontSize:11 }}>▼</span>
      </div>
    </div>
  )
}

/* ── Answer Button ──────────────────────────────────────── */
function AnswerBtn({ label, option, onClick, index }: { label: string; option: string; onClick: () => void; index: number }) {
  const [hover, setHover] = useState(false)
  const letters = ["A","B","C","D"]
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width:"100%", textAlign:"left",
        padding:"13px 16px",
        background: hover ? "rgba(57,255,20,0.06)" : "rgba(0,8,0,0.7)",
        border: `1px solid ${hover ? "#39ff14" : "#1c3a1c"}`,
        borderRadius:2,
        color: hover ? "#39ff14" : "#a0dca0",
        fontFamily:"monospace", fontSize:13,
        cursor:"pointer",
        display:"flex", alignItems:"center", gap:14,
        boxShadow: hover ? "0 0 16px rgba(57,255,20,0.12)" : "none",
        transform: hover ? "translateX(4px)" : "translateX(0)",
        transition:"all 0.16s ease",
        outline:"none",
        animation: `fadeUp ${0.15 + index * 0.07}s ease both`,
      }}
    >
      <span style={{
        fontFamily:"'VT323',monospace", fontSize:18,
        color: hover ? "#39ff14" : "#2a5a2a",
        textShadow: hover ? "0 0 8px #39ff14" : "none",
        minWidth:20, transition:"all .16s ease",
      }}>{letters[index]}</span>
      {option}
    </button>
  )
}

/* ── Start Button ───────────────────────────────────────── */
function StartBtn({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      disabled={loading}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontFamily:"monospace", fontSize:13, letterSpacing:2,
        color:"#39ff14",
        background: hover ? "rgba(57,255,20,0.08)" : "transparent",
        border:`1px solid ${hover ? "#39ff14" : "#39ff1466"}`,
        borderRadius:2, padding:"11px 28px",
        cursor: loading ? "not-allowed" : "pointer",
        display:"inline-flex", alignItems:"center", gap:10,
        boxShadow: hover ? "0 0 20px rgba(57,255,20,0.25)" : "none",
        textShadow: hover ? "0 0 8px #39ff14" : "none",
        transform: hover ? "translateY(-1px)" : "translateY(0)",
        transition:"all .18s ease", outline:"none",
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? <><Spinner /><span>LOADING...</span></> : <><span>▶</span><span>EXECUTE_QUIZ</span></>}
    </button>
  )
}

/* ════════════════════════════════════════════════════════ */
/*  PAGE                                                     */
/* ════════════════════════════════════════════════════════ */
export default function DSAQuizPage() {

  /* ── original state — untouched ── */
  const [topic, setTopic] = useState("arrays")
  const [difficulty, setDifficulty] = useState("easy")
  const [questions, setQuestions] = useState<Question[]>([])
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  const [userAnswers, setUserAnswers] = useState<string[]>([])

  /* ── visual extras ── */
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  useEffect(() => { requestAnimationFrame(() => setVisible(true)) }, [])

  /* ── original startQuiz — untouched ── */
  async function startQuiz() {
    setLoading(true)
    const res = await fetch("/api/dsa-quiz/generate-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, difficulty }),
    })
    const data = await res.json()
    setQuestions(data.questions)
    setStarted(true)
    setLoading(false)
  }

  /* ── original selectAnswer — untouched ── */
  function selectAnswer(option: string) {
    const updated = [...userAnswers]
    updated[current] = option
    setUserAnswers(updated)
    if (option === questions[current].answer) {
      setScore((prev) => prev + 1)
    }
    if (current + 1 < questions.length) {
      setCurrent((prev) => prev + 1)
    } else {
      setFinished(true)
    }
  }

  /* ── shared shell ── */
  const shell = (children: React.ReactNode) => (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=VT323&display=swap');
        *,*::before,*::after{box-sizing:border-box;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.65)}}
        option{background:#000e00;color:#39ff14;}
      `}</style>
      <Scanlines />
      <div style={{ minHeight:"100vh", background:"#000", color:"#00ff41", fontFamily:"'Share Tech Mono','Courier New',monospace", position:"relative", overflow:"hidden" }}>
        <MatrixRain />
        <div style={{
          position:"relative", zIndex:10,
          maxWidth:700, margin:"0 auto",
          padding:"32px 20px 56px",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(14px)",
          transition:"opacity .65s ease, transform .65s ease",
        }}>

          {/* window chrome */}
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:32 }}>
            <div style={{ display:"flex", gap:6 }}>
              {(["#ff5f56","#ffbd2e","#27c93f"] as const).map((c,i) => (
                <div key={i} style={{ width:12, height:12, borderRadius:"50%", background:c, boxShadow:`0 0 6px ${c}` }} />
              ))}
            </div>
            <span style={{ fontFamily:"'VT323',monospace", fontSize:17, color:"#39ff14", letterSpacing:3, textShadow:"0 0 8px #39ff14" }}>
              DSA_QUIZ — root@matrix:~$
            </span>
          </div>

          {/* hero */}
          <div style={{ marginBottom:36 }}>
            <h1 style={{ fontFamily:"'VT323',monospace", fontSize:"clamp(44px,9vw,76px)", color:"#39ff14", textShadow:"0 0 24px #39ff14, 0 0 70px #00b32c44", letterSpacing:8, lineHeight:1, margin:"0 0 8px" }}>
              <GlitchTitle text="DSA QUIZ" />
            </h1>
            <p style={{ color:"#007a1e", fontSize:12, letterSpacing:5, margin:0 }}>
              // TEST YOUR DATA STRUCTURES & ALGORITHMS
            </p>
          </div>

          {children}

          <div style={{ marginTop:44, textAlign:"center", fontFamily:"monospace", fontSize:10, color:"#1a3a1a", letterSpacing:3 }}>
            SYS.SECURE ░░ ENCRYPTION.ACTIVE ░░ PID:{Math.random().toString(36).slice(2,10).toUpperCase()}
          </div>
        </div>
      </div>
    </>
  )

  /* ═══ NOT STARTED ═══ */
  if (!started) {
    return shell(
      <Panel style={{ animation:"fadeUp .5s ease both" }}>
        <div style={{ fontFamily:"monospace", fontSize:11, color:"#007a1e", letterSpacing:3, marginBottom:20 }}>
          <span style={{ color:"#39ff14", marginRight:8 }}>$</span>
          CONFIGURE SESSION PARAMETERS
        </div>

        <div style={{ height:1, background:"#1c3a1c", margin:"0 0 22px" }} />

        <TermSelect label="SELECT TOPIC" value={topic} onChange={setTopic}>
          {dsaTopics.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </TermSelect>

        <TermSelect label="DIFFICULTY LEVEL" value={difficulty} onChange={setDifficulty}>
          <option value="easy">EASY</option>
          <option value="medium">MEDIUM</option>
          <option value="hard">HARD</option>
        </TermSelect>

        <div style={{ height:1, background:"#1c3a1c", margin:"4px 0 22px" }} />

        <StartBtn onClick={startQuiz} loading={loading} />
      </Panel>
    )
  }

  /* ═══ FINISHED ═══ */
  if (finished) {
    return shell(
      <Panel style={{ animation:"fadeUp .4s ease both" }}>
        <div style={{ fontFamily:"monospace", fontSize:11, color:"#00ffaa", letterSpacing:3, marginBottom:20 }}>
          <span style={{ color:"#00ffaa", marginRight:8, textShadow:"0 0 6px #00ffaa" }}>$</span>
          SESSION COMPLETE — EVALUATING RESULTS
        </div>
        <div style={{ height:1, background:"#1c3a1c", margin:"0 0 22px" }} />
        {/* original Result component — untouched */}
        <Result questions={questions} userAnswers={userAnswers} />
      </Panel>
    )
  }

  /* ═══ ACTIVE QUIZ ═══ */
  const q = questions[current]

  return shell(
    <Panel key={current} style={{ animation:"fadeUp .35s ease both" }}>

      <ProgressBar current={current} total={questions.length} />

      {/* Q badge */}
      <div style={{
        display:"inline-flex", alignItems:"center", gap:7,
        background:"#001400", border:"1px solid #1c3a1c", borderRadius:2,
        padding:"4px 12px", fontFamily:"monospace", fontSize:11, color:"#39ff14", letterSpacing:2, marginBottom:18,
      }}>
        <span style={{ width:6, height:6, borderRadius:"50%", background:"#39ff14", boxShadow:"0 0 6px #39ff14", display:"inline-block", animation:"pulse 1.3s ease infinite" }} />
        QUERY_{String(current+1).padStart(2,"0")} / {String(questions.length).padStart(2,"0")}
        <span style={{ color:"#2a5a2a", marginLeft:6 }}>SCORE: {score}</span>
      </div>

      {/* question text */}
      <div style={{
        fontFamily:"monospace", fontSize:14, lineHeight:1.7,
        color:"#b0eeb0", marginBottom:24,
        padding:"14px 16px",
        background:"#000e00", border:"1px solid #1c3a1c", borderRadius:2,
      }}>
        <span style={{ color:"#39ff14", marginRight:8, textShadow:"0 0 6px #39ff14" }}>?</span>
        {q.question}
      </div>

      {/* options */}
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {q.options.map((opt, i) => (
          <AnswerBtn
            key={i}
            index={i}
            label={opt}
            option={opt}
            onClick={() => selectAnswer(opt)}
          />
        ))}
      </div>

    </Panel>
  )
}