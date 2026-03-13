"use client";

import { useState, useEffect, useRef } from "react";
import Select from "@/Components/missing-line/Select";
import CodeBlock from "@/Components/missing-line/CodeBlock";
import Submitted from "@/Components/missing-line/Submitted";

/* ── Types ─────────────────────────────────────────────── */
type Question = {
  task: string;
  code: string;
  answer: string;
};

/* ── Typing Effect Hook ─────────────────────────────────── */
function useTypewriter(text: string, speed = 24) {
  const [out, setOut] = useState("");
  useEffect(() => {
    setOut("");
    if (!text) return;
    let i = 0;
    const t = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(t);
    }, speed);
    return () => clearInterval(t);
  }, [text, speed]);
  return out;
}

/* ── Spinner Frames ─────────────────────────────────────── */
function Spinner() {
  const frames = ["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI(p => (p + 1) % frames.length), 80);
    return () => clearInterval(t);
  }, []);
  return <span style={{ color: "#00ff41", fontSize: 18, lineHeight: 1 }}>{frames[i]}</span>;
}

/* ── Matrix Rain Canvas ─────────────────────────────────── */
function MatrixRain() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF<>{}[]|/\\";
    const cols = Math.floor(c.width / 18);
    const drops = Array(cols).fill(1);
    const tick = setInterval(() => {
      ctx.fillStyle = "rgba(0,0,0,0.055)";
      ctx.fillRect(0, 0, c.width, c.height);
      for (let i = 0; i < drops.length; i++) {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.font = "13px monospace";
        ctx.fillStyle = Math.random() > 0.97 ? "#ffffff" : i % 5 === 0 ? "#39ff14" : "#008f22";
        ctx.fillText(ch, i * 18, drops[i] * 18);
        if (drops[i] * 18 > c.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }, 42);
    return () => { clearInterval(tick); window.removeEventListener("resize", resize); };
  }, []);
  return (
    <canvas
      ref={ref}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.13 }}
    />
  );
}

/* ── CRT Scanlines ──────────────────────────────────────── */
function Scanlines() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none",
      background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.08) 2px,rgba(0,0,0,0.08) 4px)",
    }} />
  );
}

/* ── Glitch Heading ─────────────────────────────────────── */
function GlitchHeading({ text }: { text: string }) {
  return (
    <>
      <style>{`
        .glitch-wrap { position:relative; display:inline-block; }
        .glitch-wrap::before,.glitch-wrap::after {
          content: attr(data-t); position:absolute; inset:0; overflow:hidden;
        }
        .glitch-wrap::before {
          color:#ff003c; clip-path:polygon(0 15%,100% 15%,100% 35%,0 35%);
          animation: gb 4s infinite;
        }
        .glitch-wrap::after {
          color:#00f0ff; clip-path:polygon(0 60%,100% 60%,100% 78%,0 78%);
          animation: ga 4s infinite;
        }
        @keyframes ga {
          0%,88%,100%{transform:translate(0)} 90%{transform:translate(-3px,1px)} 93%{transform:translate(2px,-1px)} 96%{transform:translate(0)}
        }
        @keyframes gb {
          0%,88%,100%{transform:translate(0)} 90%{transform:translate(3px,-1px)} 93%{transform:translate(-2px,1px)} 96%{transform:translate(0)}
        }
      `}</style>
      <span className="glitch-wrap" data-t={text}>{text}</span>
    </>
  );
}

/* ── Progress Bar ───────────────────────────────────────── */
function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? Math.round(((current + 1) / total) * 100) : 0;
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display:"flex", justifyContent:"space-between", fontFamily:"monospace", fontSize:11, color:"#008f22", marginBottom:5, letterSpacing:2 }}>
        <span>PROGRESS__{current + 1}/{total}</span>
        <span style={{ color: pct === 100 ? "#39ff14" : "#008f22" }}>{pct}%</span>
      </div>
      <div style={{ height:3, background:"#0a140a", border:"1px solid #1a3a1a", borderRadius:1, overflow:"hidden" }}>
        <div style={{
          height:"100%", width:`${pct}%`,
          background:"linear-gradient(90deg,#006614,#39ff14)",
          boxShadow:"0 0 10px #39ff14aa",
          transition:"width 0.55s cubic-bezier(.4,0,.2,1)",
        }} />
      </div>
    </div>
  );
}

/* ── Blinking Cursor ────────────────────────────────────── */
function Cursor() {
  return (
    <>
      <style>{`.bcursor{animation:bc 0.9s step-end infinite} @keyframes bc{0%,100%{opacity:1}50%{opacity:0}}`}</style>
      <span className="bcursor" style={{ color:"#39ff14", textShadow:"0 0 6px #39ff14" }}>█</span>
    </>
  );
}

/* ── HUD Corner Brackets ────────────────────────────────── */
function HUDBrackets() {
  const s = (top: boolean, left: boolean): React.CSSProperties => ({
    position:"absolute",
    width:14, height:14,
    top: top ? 8 : "auto", bottom: !top ? 8 : "auto",
    left: left ? 8 : "auto", right: !left ? 8 : "auto",
    borderTop: top ? "1px solid #39ff1455" : "none",
    borderBottom: !top ? "1px solid #39ff1455" : "none",
    borderLeft: left ? "1px solid #39ff1455" : "none",
    borderRight: !left ? "1px solid #39ff1455" : "none",
  });
  return <>
    <div style={s(true, true)} /> <div style={s(true, false)} />
    <div style={s(false, true)} /> <div style={s(false, false)} />
  </>;
}

/* ── Panel Card ─────────────────────────────────────────── */
function Panel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      position:"relative",
      background:"rgba(0,6,0,0.88)",
      border:"1px solid #1c3a1c",
      borderRadius:2,
      padding:"28px 28px 24px",
      boxShadow:"0 0 32px rgba(0,255,65,0.04), inset 0 0 60px rgba(0,255,65,0.012)",
      ...style,
    }}>
      <HUDBrackets />
      {children}
    </div>
  );
}

/* ── Prompt Line ────────────────────────────────────────── */
function PromptLine({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display:"flex", alignItems:"baseline", gap:10, fontFamily:"monospace", fontSize:13, marginBottom:6 }}>
      <span style={{ color:"#39ff14", textShadow:"0 0 6px #39ff14", userSelect:"none" }}>$</span>
      {children}
    </div>
  );
}

/* ── Divider ────────────────────────────────────────────── */
function Divider({ label }: { label: string }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, margin:"18px 0", fontFamily:"monospace", fontSize:10, letterSpacing:3 }}>
      <div style={{ flex:1, height:1, background:"#1c3a1c" }} />
      <span style={{ color:"#2a5a2a" }}>{label}</span>
      <div style={{ flex:1, height:1, background:"#1c3a1c" }} />
    </div>
  );
}

/* ── Terminal Button ────────────────────────────────────── */
function TermBtn({ onClick, children, accent = "#39ff14" }: { onClick: () => void; children: React.ReactNode; accent?: string }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontFamily:"monospace", fontSize:12, letterSpacing:2,
        color: accent,
        background: hover ? `${accent}12` : "transparent",
        border:`1px solid ${hover ? accent : accent + "55"}`,
        borderRadius:2,
        padding:"9px 22px",
        cursor:"pointer",
        display:"inline-flex", alignItems:"center", gap:8,
        boxShadow: hover ? `0 0 18px ${accent}33` : "none",
        textShadow: hover ? `0 0 8px ${accent}` : "none",
        transition:"all 0.18s ease",
        outline:"none",
        transform: hover ? "translateY(-1px)" : "translateY(0)",
      }}
    >
      {children}
    </button>
  );
}

/* ════════════════════════════════════════════════════════ */
/*  PAGE — all original logic preserved exactly             */
/* ════════════════════════════════════════════════════════ */
export default function MissingLinePage() {
  /* ── original state ── */
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userCodes, setUserCodes] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ── visual extras ── */
  const taskText = useTypewriter(
    started && !submitted && questions[currentIndex] ? questions[currentIndex].task : "",
    20
  );
  const [visible, setVisible] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

  /* ── original startGame — untouched ── */
  async function startGame(data: { language: string; difficulty: string; count: number }) {
    setLoading(true);
    const res = await fetch("/api/missing-line/generate-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!result.data) {
      console.error("No questions returned");
      return;
    }
    setQuestions(result.data);
    setStarted(true);
    if (!result.success) {
      setError(result.message);
      setLoading(false);
      return;
    }
    let text = result.data;
    console.log(result);
    if (typeof text === "string") {
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    }
    setStarted(true);
    setLoading(false);
  }

  /* ── original handlers — untouched ── */
  function handleCodeChange(value: string) {
    const updated = [...userCodes];
    updated[currentIndex] = value;
    setUserCodes(updated);
  }
  function nextQuestion() { setCurrentIndex((prev) => prev + 1); }
  function submitGame()   { setSubmitted(true); }

  /* ── shell ── */
  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=VT323&display=swap');`}</style>
      <Scanlines />

      <div style={{ minHeight:"100vh", background:"#000", color:"#00ff41", fontFamily:"'Share Tech Mono','Courier New',monospace", position:"relative", overflow:"hidden" }}>
        <MatrixRain />

        <div style={{
          position:"relative", zIndex:10,
          maxWidth:860, margin:"0 auto",
          padding:"32px 20px 56px",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(14px)",
          transition:"opacity 0.65s ease, transform 0.65s ease",
        }}>

          {/* Window chrome */}
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:32 }}>
            <div style={{ display:"flex", gap:6 }}>
              {(["#ff5f56","#ffbd2e","#27c93f"] as const).map((c,i) => (
                <div key={i} style={{ width:12, height:12, borderRadius:"50%", background:c, boxShadow:`0 0 6px ${c}` }} />
              ))}
            </div>
            <span style={{ fontFamily:"'VT323',monospace", fontSize:17, color:"#39ff14", letterSpacing:3, textShadow:"0 0 8px #39ff14" }}>
              MISSING_LINE — root@matrix:~$
            </span>
          </div>

          {/* Hero */}
          <div style={{ marginBottom:36 }}>
            <h1 style={{
              fontFamily:"'VT323',monospace",
              fontSize:"clamp(44px,9vw,80px)",
              color:"#39ff14",
              textShadow:"0 0 24px #39ff14, 0 0 70px #00b32c44",
              letterSpacing:8, lineHeight:1, margin:"0 0 8px",
            }}>
              <GlitchHeading text="MISSING LINE" />
            </h1>
            <p style={{ color:"#008f22", fontSize:12, letterSpacing:5, margin:0 }}>
              // DECODE. FILL THE GAP. BREACH THE SYSTEM.
            </p>
          </div>

          {/* ═══ NOT STARTED ═══ */}
          {!started && (
            <Panel>
              <PromptLine>
                <span style={{ color:"#008f22", letterSpacing:2 }}>INITIALISE CHALLENGE PARAMETERS</span>
              </PromptLine>
              <Divider label="CONFIG" />

              <Select onStart={startGame} />

              {loading && (
                <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:20, fontFamily:"monospace", fontSize:13, color:"#39ff14" }}>
                  <Spinner />
                  <span>GENERATING QUESTIONS... ACCESSING MAINFRAME</span>
                  <Cursor />
                </div>
              )}
              {error && (
                <div style={{
                  display:"flex", alignItems:"center", gap:10,
                  marginTop:16, padding:"11px 16px",
                  background:"#140000", border:"1px solid #550000",
                  borderRadius:2, color:"#ff5555", fontFamily:"monospace", fontSize:13,
                }}>
                  <span style={{ fontSize:16 }}>✗</span>
                  <span>ERROR: {error}</span>
                </div>
              )}
            </Panel>
          )}

          {/* ═══ SUBMITTED ═══ */}
          {submitted && (
            <Panel>
              <PromptLine>
                <span style={{ color:"#00ffaa", letterSpacing:2 }}>DECRYPTION COMPLETE — EVALUATING OUTPUT</span>
              </PromptLine>
              <Divider label="RESULTS" />
              <Submitted questions={questions} userCodes={userCodes} />
            </Panel>
          )}

          {/* ═══ ACTIVE GAME ═══ */}
          {started && !submitted && questions.length > 0 && (() => {
            const q = questions[currentIndex];
            return (
              <Panel key={currentIndex}>
                <style>{`
                  @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
                  @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.65)}}
                `}</style>

                <ProgressBar current={currentIndex} total={questions.length} />

                {/* Q badge */}
                <div style={{
                  display:"inline-flex", alignItems:"center", gap:7,
                  background:"#001400", border:"1px solid #1c3a1c", borderRadius:2,
                  padding:"4px 12px", fontFamily:"monospace", fontSize:11, color:"#39ff14", letterSpacing:2, marginBottom:16,
                }}>
                  <span style={{ width:6, height:6, borderRadius:"50%", background:"#39ff14", boxShadow:"0 0 6px #39ff14", display:"inline-block", animation:"pulse 1.3s ease infinite" }} />
                  QUERY_{String(currentIndex + 1).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}
                </div>

                {/* Task */}
                <PromptLine><span style={{ color:"#008f22", letterSpacing:1 }}>TASK</span></PromptLine>
                <div style={{
                  fontFamily:"monospace", fontSize:14, lineHeight:1.65,
                  color:"#a0e8a0", marginBottom:22, minHeight:24,
                  padding:"10px 14px", background:"#000e00",
                  border:"1px solid #1c3a1c", borderRadius:2,
                  animation:"fadeUp 0.4s ease both",
                }}>
                  {taskText}<Cursor />
                </div>

                <Divider label="CODE" />

                <PromptLine><span style={{ color:"#008f22", letterSpacing:1 }}>FILL THE MISSING LINE:</span></PromptLine>

                {/* CodeBlock — untouched */}
                <div style={{ marginBottom:22 }}>
                  <CodeBlock
                    code={userCodes[currentIndex] ?? q.code}
                    language="javascript"
                    onChange={handleCodeChange}
                  />
                </div>

                {/* Nav */}
                <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                  {currentIndex < questions.length - 1 ? (
                    <TermBtn onClick={nextQuestion} accent="#39ff14">
                      <span>▶</span> NEXT_QUERY
                    </TermBtn>
                  ) : (
                    <TermBtn onClick={submitGame} accent="#00ffaa">
                      <span>⬡</span> SUBMIT_SESSION
                    </TermBtn>
                  )}
                  <span style={{ fontFamily:"monospace", fontSize:11, color:"#2a5a2a", letterSpacing:2 }}>
                    {questions.length - currentIndex - 1} REMAINING
                  </span>
                </div>
              </Panel>
            );
          })()}

          {/* Footer */}
          <div style={{ marginTop:44, textAlign:"center", fontFamily:"monospace", fontSize:10, color:"#1a3a1a", letterSpacing:3 }}>
            SYS.SECURE ░░ ENCRYPTION.ACTIVE ░░ PID:{Math.random().toString(36).slice(2, 10).toUpperCase()}
          </div>

        </div>
      </div>
    </>
  );
}