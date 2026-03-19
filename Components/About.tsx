'use client';
import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import * as THREE from 'three';

const G = '#00ff88';

const phases = [
  {
    tag: '01 / VISION',
    title: 'The Vision',
    desc: "At Birla Institute of Applied Sciences, we don't follow trends — we architect the standards that the next generation of engineers will build upon.",
    accent: '#00ff88',
    accentRgb: '0,255,136',
    code: `const vision = {\n  institute: "BIAS",\n  mission: "build the future",\n  status: "active 🟢"\n};`,
  },
  {
    tag: '02 / STACK',
    title: 'The Stack',
    desc: 'From raw VHDL silicon to high-level Next.js and AI systems — our members master the full vertical of modern computation, end to end.',
    accent: '#a78bfa',
    accentRgb: '167,139,250',
    code: `const stack = [\n  "VHDL", "C++", "Python",\n  "React", "Next.js", "AI/ML"\n];`,
  },
  {
    tag: '03 / LEGACY',
    title: 'The Legacy',
    desc: 'We shipped "Gyanam" — a live edtech platform serving the Indian market. That\'s not a side project; that\'s production-grade engineering.',
    accent: '#fb923c',
    accentRgb: '251,146,60',
    code: `git log --oneline\n> a3f9c12 deploy: Gyanam v2\n> 7bc401e feat: AI tutor\n> 9da88e1 init: coding club`,
  },
];

// ─── Three.js background scene ───────────────────────────────────────────────
function ThreeBackground({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 8);

    // Opt: powerPreference high-performance
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ── Lights ──────────────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
    scene.add(ambientLight);

    const greenLight = new THREE.PointLight(0x00ff88, 3, 30);
    greenLight.position.set(-4, 3, 4);
    scene.add(greenLight);

    const purpleLight = new THREE.PointLight(0xa78bfa, 2, 25);
    purpleLight.position.set(4, -2, 3);
    scene.add(purpleLight);

    const orangeLight = new THREE.PointLight(0xfb923c, 1.5, 20);
    orangeLight.position.set(0, -4, 2);
    scene.add(orangeLight);

    // ── Materials ────────────────────────────────────────────────────────────
    const wireMat = (color: number) => new THREE.MeshBasicMaterial({
      color, wireframe: true, transparent: true, opacity: 0.18,
    });

    // ── Objects ─────────────────────────────────────────────────────────────
    const torusKnotGeo = new THREE.TorusKnotGeometry(1.5, 0.38, 160, 24, 2, 3);
    const torusKnotSolid = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.5, 0.32, 120, 20, 2, 3),
      new THREE.MeshStandardMaterial({ color: 0x00ff88, emissive: 0x00ff88, emissiveIntensity: 0.25, transparent: true, opacity: 0.08, roughness: 0.2, metalness: 0.8 })
    );
    const torusKnot = new THREE.Mesh(torusKnotGeo, wireMat(0x00ff88));
    torusKnot.add(torusKnotSolid);
    torusKnot.position.set(3.5, 0.5, -2);
    torusKnot.scale.setScalar(0.85);
    scene.add(torusKnot);

    const icosahedron = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1, 1), wireMat(0xa78bfa));
    const icosaSolid = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.0, 1),
      new THREE.MeshStandardMaterial({ color: 0xa78bfa, emissive: 0xa78bfa, emissiveIntensity: 0.2, transparent: true, opacity: 0.07, roughness: 0.3, metalness: 0.7 })
    );
    icosahedron.add(icosaSolid);
    icosahedron.position.set(-4.5, 2.2, -1);
    scene.add(icosahedron);

    const octahedron = new THREE.Mesh(new THREE.OctahedronGeometry(0.9, 0), wireMat(0xfb923c));
    const octaSolid = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.8, 0),
      new THREE.MeshStandardMaterial({ color: 0xfb923c, emissive: 0xfb923c, emissiveIntensity: 0.25, transparent: true, opacity: 0.1, roughness: 0.2, metalness: 0.8 })
    );
    octahedron.add(octaSolid);
    octahedron.position.set(4.2, -2.5, -0.5);
    scene.add(octahedron);

    const cube = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), wireMat(0x00ff88));
    cube.position.set(-3.2, -2.0, -1.5);
    cube.rotation.set(0.4, 0.6, 0.2);
    scene.add(cube);

    const ringLeft = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.03, 12, 80), new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.25 }));
    ringLeft.position.set(-5, 0.5, -3);
    ringLeft.rotation.y = Math.PI / 4;
    scene.add(ringLeft);

    const ringRight = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.025, 12, 80), new THREE.MeshBasicMaterial({ color: 0xa78bfa, transparent: true, opacity: 0.2 }));
    ringRight.position.set(5, -0.8, -3);
    ringRight.rotation.x = Math.PI / 3;
    scene.add(ringRight);

    const binaryGroup = new THREE.Group();
    const bPositions = [[-2, 3.2, -4], [2.5, 3.5, -4.5], [-3, -3, -4], [3.5, -3.2, -5], [0.5, -3.8, -3], [-4, 1.5, -5], [4.5, 1.2, -4.5]];
    bPositions.forEach(([x, y, z]) => {
      const s = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.4 }));
      s.position.set(x, y, z);
      binaryGroup.add(s);
    });
    scene.add(binaryGroup);

    const starGeo = new THREE.BufferGeometry();
    const starCount = 600;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) starPos[i] = (Math.random() - 0.5) * 40;
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starField = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.025, transparent: true, opacity: 0.35 }));
    scene.add(starField);

    // Opt: Pre-allocate color objects to prevent GC stutters
    const cachedColors = [new THREE.Color(0x00ff88), new THREE.Color(0xa78bfa), new THREE.Color(0xfb923c)];
    let currentPhaseColorIdx = -1;

    let t = 0;
    let rafId = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      t += 0.005;

      // Opt: Read motion value directly in the RAF loop (Bypasses React renders)
      const p = scrollYProgress.get();

      camera.position.x = Math.sin(p * Math.PI * 0.5) * 1.2;
      camera.position.y = Math.cos(p * Math.PI * 0.5) * 0.6;

      const phaseIdx = Math.min(Math.floor(p * 3), 2);
      if (phaseIdx !== currentPhaseColorIdx) {
        currentPhaseColorIdx = phaseIdx;
        const targetColor = cachedColors[phaseIdx];
        if (torusKnot.material instanceof THREE.MeshBasicMaterial) {
          torusKnot.material.color.copy(targetColor);
        }
      }

      torusKnot.rotation.x += 0.004; torusKnot.rotation.y += 0.006;
      icosahedron.rotation.x += 0.006; icosahedron.rotation.z += 0.004;
      octahedron.rotation.y += 0.008; octahedron.rotation.x += 0.003;
      cube.rotation.x += 0.007; cube.rotation.y += 0.005;
      ringLeft.rotation.z  += 0.005; ringLeft.rotation.x  += 0.003;
      ringRight.rotation.z += 0.006; ringRight.rotation.y += 0.004;
      binaryGroup.rotation.y += 0.003;

      torusKnot.position.y    = 0.5  + Math.sin(t * 0.7) * 0.3;
      icosahedron.position.y  = 2.2  + Math.sin(t * 0.5 + 1) * 0.4;
      octahedron.position.y   = -2.5 + Math.sin(t * 0.6 + 2) * 0.3;
      cube.position.y         = -2.0 + Math.sin(t * 0.8 + 3) * 0.25;
      ringLeft.position.y     = 0.5  + Math.sin(t * 0.4 + 0.5) * 0.35;
      ringRight.position.y    = -0.8 + Math.sin(t * 0.55 + 1.5) * 0.3;

      starField.rotation.y += 0.0003;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafId);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [scrollYProgress]);

  return <div ref={mountRef} style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }} />;
}

// ─── Particles ────────────────────────────────────────────────────────────────
const Particle = React.memo(({ left, top, dur, delay }: { left: number; top: number; dur: number; delay: number }) => (
  <motion.div
    style={{ position: 'absolute', left: `${left}%`, top: `${top}%`, width: 2, height: 2, borderRadius: '50%', background: G, opacity: 0, willChange: 'transform, opacity' }}
    animate={{ y: [0, -200, 0], opacity: [0, 0.5, 0] }}
    transition={{ duration: dur, repeat: Infinity, delay, ease: 'easeInOut' }}
  />
));
Particle.displayName = 'Particle';

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  left: (i * 37.1) % 100,
  top:  (i * 53.7) % 100,
  dur:  4 + (i % 5),
  delay: (i * 0.4) % 6,
}));

// ─── Phase card ───────────────────────────────────────────────────────────────
function PhaseCard({ phase, index, scrollYProgress }: {
  phase: typeof phases[0];
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const seg   = 1 / phases.length;
  const start = index * seg;
  const mid   = start + seg * 0.45;
  const end   = start + seg;

  const opacity = useTransform(scrollYProgress, [start, start + seg * 0.18, mid, end - seg * 0.12, end], [0, 1, 1, 1, 0]);
  const scale   = useTransform(scrollYProgress, [start, mid, end], [0.84, 1, 1.08]);
  const y       = useTransform(scrollYProgress, [start, mid, end], [55, 0, -35]);
  const blurV   = useTransform(scrollYProgress, [start, start + seg * 0.18, mid, end - seg * 0.12, end], [12, 0, 0, 0, 14]);
  const filter  = useTransform(blurV, v => `blur(${v}px)`);

  return (
    <motion.div style={{ 
      opacity, scale, y, filter, position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 clamp(16px,5vw,48px)', zIndex: 10 + index,
      willChange: 'transform, opacity, filter' // Opt: Forces GPU compositing
    }}>
      <div style={{
        position: 'relative', width: '100%', maxWidth: 860, borderRadius: 20,
        border: `1px solid rgba(${phase.accentRgb},0.18)`,
        background: 'rgba(0,0,0,0.62)',
        backdropFilter: 'blur(28px)',
        padding: 'clamp(28px,5vw,56px)',
        overflow: 'hidden',
        boxShadow: `0 0 100px rgba(${phase.accentRgb},0.07), 0 32px 80px rgba(0,0,0,0.6)`,
      }}>
        {/* Corner glow */}
        <div style={{ position:'absolute', top:-80, right:-80, width:280, height:280, borderRadius:'50%', background:`radial-gradient(circle,rgba(${phase.accentRgb},0.14) 0%,transparent 70%)`, pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-60, left:-60, width:200, height:200, borderRadius:'50%', background:`radial-gradient(circle,rgba(${phase.accentRgb},0.06) 0%,transparent 70%)`, pointerEvents:'none' }} />

        <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:'clamp(20px,4vw,48px)', alignItems:'center' }}>
          {/* Left */}
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'4px 12px', borderRadius:100, border:`1px solid rgba(${phase.accentRgb},0.25)`, background:`rgba(${phase.accentRgb},0.06)`, marginBottom:20 }}>
              <span style={{ width:5, height:5, borderRadius:'50%', background:phase.accent, boxShadow:`0 0 6px ${phase.accent}`, display:'inline-block' }} />
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.58rem', letterSpacing:'0.22em', textTransform:'uppercase', color:phase.accent }}>{phase.tag}</span>
            </div>
            <h3 style={{
              fontFamily:"'Orbitron',monospace", fontWeight:900,
              fontSize:'clamp(2rem,6vw,4.5rem)', lineHeight:1.0, letterSpacing:'-0.02em',
              background:`linear-gradient(135deg,#fff 40%,${phase.accent})`,
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
              marginBottom:18,
            }}>{phase.title}</h3>
            <div style={{ width:48, height:2, background:`linear-gradient(90deg,${phase.accent},transparent)`, borderRadius:2, marginBottom:18, boxShadow:`0 0 10px ${phase.accent}` }} />
            <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'clamp(0.72rem,1.5vw,0.9rem)', color:'rgba(255,255,255,0.5)', lineHeight:1.85, maxWidth:460 }}>{phase.desc}</p>
          </div>

          {/* Right — code block */}
          <div className="about-code-block" style={{ minWidth: 0 }}>
            <div style={{ background:'rgba(0,0,0,0.65)', border:`1px solid rgba(${phase.accentRgb},0.15)`, borderRadius:12, padding:'16px 20px', minWidth:220 }}>
              <div style={{ display:'flex', gap:6, marginBottom:12 }}>
                {['#ff5f57','#febc2e','#28c840'].map(c => <div key={c} style={{ width:9, height:9, borderRadius:'50%', background:c, opacity:0.7 }} />)}
              </div>
              <pre style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.72rem', color:`rgba(${phase.accentRgb},0.8)`, lineHeight:1.7, margin:0, whiteSpace:'pre' }}>{phase.code}</pre>
            </div>
          </div>
        </div>

        {/* Ghost number */}
        <div style={{ position:'absolute', bottom:20, right:28, fontFamily:"'Orbitron',monospace", fontSize:'clamp(2.5rem,6vw,5rem)', fontWeight:900, color:`rgba(${phase.accentRgb},0.05)`, lineHeight:1, userSelect:'none', pointerEvents:'none' }}>
          0{index + 1}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function About3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Opt: Removed local React state hook entirely.
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

  const labelOpacity = useTransform(scrollYProgress, [0, 0.05, 0.9, 1], [0, 1, 1, 0]);
  const labelY       = useTransform(scrollYProgress, [0, 0.05], [20, 0]);
  const barWidth     = useTransform(scrollYProgress, v => `${v * 100}%`);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Orbitron:wght@700;900&display=swap');
        @media (max-width:640px) { .about-code-block { display:none !important; } }
      `}</style>

      <div ref={containerRef} style={{ position:'relative', height:'400vh', background:'#050505', overflow:'clip' }}>
        <div style={{ position:'sticky', top:0, height:'100vh', width:'100%', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>

          {/* Opt: Passed the raw motion value, completely bypassing React renders */}
          <ThreeBackground scrollYProgress={scrollYProgress} />

          <div style={{ position:'absolute', inset:0, zIndex:1, pointerEvents:'none', background:'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,255,136,0.03) 0%, transparent 70%)' }} />

          <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:3 }}>
            {PARTICLES.map((p, i) => <Particle key={i} {...p} />)}
          </div>

          <motion.div style={{ position:'absolute', top:28, left:28, zIndex:30, opacity:labelOpacity, y:labelY, willChange: 'opacity, transform' }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.58rem', letterSpacing:'0.25em', textTransform:'uppercase', color:'rgba(0,255,136,0.45)' }}>
              // About the Club
            </div>
          </motion.div>

          <div style={{ position:'absolute', bottom:0, left:0, width:'100%', height:1, background:'rgba(255,255,255,0.06)', zIndex:30 }}>
            <motion.div style={{ height:'100%', background:`linear-gradient(90deg,${G},rgba(0,255,136,0.3))`, width:barWidth, boxShadow:`0 0 8px ${G}`, willChange: 'width' }} />
          </div>

          <div style={{ position:'absolute', bottom:20, left:'50%', transform:'translateX(-50%)', display:'flex', gap:12, zIndex:30, alignItems:'center' }}>
            {phases.map((p, i) => {
              const seg = 1 / phases.length;
              const dotOp  = useTransform(scrollYProgress, [i*seg, i*seg+seg*0.2, (i+1)*seg], [0.25, 1, 0.25]);
              const dotSc  = useTransform(scrollYProgress, [i*seg, i*seg+seg*0.5, (i+1)*seg], [0.7, 1.3, 0.7]);
              return (
                <motion.div key={i} style={{ opacity:dotOp, scale:dotSc, willChange: 'transform, opacity' }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:p.accent, boxShadow:`0 0 8px ${p.accent}` }} />
                </motion.div>
              );
            })}
          </div>

          {phases.map((phase, i) => (
            <PhaseCard key={i} phase={phase} index={i} scrollYProgress={scrollYProgress} />
          ))}

        </div>
      </div>
    </>
  );
}