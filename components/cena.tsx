"use client";

import { useEffect, useRef } from "react";
import * as m from "motion/react-m";
import { useReducedMotion, useScroll, useTransform } from "motion/react";

type P = { x: number; y: number; vx: number; vy: number; c: string; t: "gota" | "c"; r: number; vr: number; v: number };
const CORES = ["#FF6B4A", "#7A4CE0", "#FF9F1C", "#1FB57A", "#FFC93C", "#1497C4"];

// Céu, mar, areia e a família; com a 6x1 tudo fica cinza, entra a nuvem e chove. Ao desligar, confete.
// `pulso` muda a cada interação (toggle ou data) — é quando o clima é refeito.
export function Cena({ on, temConta, pulso }: { on: boolean; temConta: boolean; pulso: number }) {
  const reduz = useReducedMotion();
  const { scrollY } = useScroll();
  const yCeu = useTransform(scrollY, (v) => (reduz ? 0 : v * 0.35));
  const yNuvem = useTransform(scrollY, (v) => (reduz ? 0 : v * 0.2));
  const cv = useRef<HTMLCanvasElement>(null);
  const fx = useRef<{ chuva: boolean; confete: () => void; anima: () => void } | null>(null);

  useEffect(() => {
    const el = cv.current!, g = el.getContext("2d")!;
    let P: P[] = [], chuva = false, loop = 0;
    const tamanho = () => {
      const r = el.getBoundingClientRect(), k = Math.min(devicePixelRatio, 2);
      el.width = r.width * k; el.height = r.height * k; g.setTransform(k, 0, 0, k, 0, 0);
    };
    const quadro = () => {
      const W = el.clientWidth, H = el.clientHeight;
      g.clearRect(0, 0, W, H);
      if (chuva) for (let i = 0; i < 3; i++) P.push({ x: Math.random() * W, y: -10, vx: -0.6, vy: 9 + Math.random() * 4, c: "rgba(74,144,184,.75)", t: "gota", r: 0, vr: 0, v: 1 });
      P = P.filter((p) => p.y < H + 20 && p.v > 0);
      for (const p of P) {
        p.x += p.vx; p.y += p.vy;
        if (p.t === "gota") { g.strokeStyle = p.c; g.lineWidth = 2; g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(p.x + p.vx * 2, p.y + 10); g.stroke(); }
        else {
          p.vy += 0.22; p.vx *= 0.99; p.r += p.vr; p.v -= 0.008;
          g.save(); g.globalAlpha = Math.max(p.v, 0); g.translate(p.x, p.y); g.rotate(p.r); g.fillStyle = p.c; g.fillRect(-5, -3, 10, 6); g.restore();
        }
      }
      loop = P.length || chuva ? requestAnimationFrame(quadro) : 0;
    };
    fx.current = {
      set chuva(v: boolean) { chuva = v; },
      get chuva() { return chuva; },
      confete() {
        const W = el.clientWidth, H = el.clientHeight;
        for (let i = 0; i < 90; i++) {
          const a = Math.random() * Math.PI - Math.PI, v = 6 + Math.random() * 9;
          P.push({ x: W / 2, y: H * 0.75, vx: Math.cos(a) * v, vy: Math.sin(a) * v, c: CORES[i % 6], t: "c", r: 0, vr: (Math.random() - 0.5) * 0.4, v: 1 });
        }
      },
      anima() { if (!loop && !matchMedia("(prefers-reduced-motion: reduce)").matches) loop = requestAnimationFrame(quadro); },
    };
    addEventListener("resize", tamanho); tamanho();
    return () => { removeEventListener("resize", tamanho); cancelAnimationFrame(loop); };
  }, []);

  useEffect(() => {
    const f = fx.current;
    if (!pulso || !f) return;
    f.chuva = on;
    if (!on && temConta) f.confete();
    f.anima();
  }, [pulso]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative h-[min(24dvh,240px)] overflow-hidden" aria-hidden="true">
      <m.svg style={{ y: yCeu }} className="block h-full w-full transition-[filter] duration-1600 will-change-transform gray:brightness-92 gray:contrast-90 gray:grayscale" viewBox="0 0 390 420" preserveAspectRatio="xMidYMax slice">
        <defs><linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#55B8F0" /><stop offset="1" stopColor="#C8ECFF" /></linearGradient></defs>
        <rect width="390" height="420" fill="url(#ceu)" />
        <circle className="transition-opacity duration-1200 gray:opacity-0" cx="295" cy="115" r="55" fill="#FFC93C" />
        <rect y="260" width="390" height="68" fill="#1497C4" /><rect y="260" width="390" height="10" fill="#3DBBE0" />
        <rect y="319" width="390" height="101" fill="#F6D9A6" />
        <g>
          <rect x="60" y="246" width="34" height="90" rx="17" fill="#FF6B4A" /><circle cx="77" cy="229" r="14.3" fill="#FF6B4A" />
          <rect x="110" y="235" width="38" height="101" rx="19" fill="#7A4CE0" /><circle cx="129" cy="216" r="16" fill="#7A4CE0" />
          <rect x="165" y="273" width="24" height="63" rx="12" fill="#FF9F1C" /><circle cx="177" cy="261" r="10" fill="#FF9F1C" />
          <rect x="205" y="282" width="20" height="54" rx="10" fill="#1FB57A" /><circle cx="215" cy="272" r="8.6" fill="#1FB57A" />
        </g>
      </m.svg>
      <m.div style={{ y: yNuvem }} className="absolute top-[6%] left-1/2 w-[170px] -translate-x-1/2 will-change-transform">
        <m.svg
          viewBox="0 0 170 120"
          className="block w-full"
          initial={false}
          animate={{ y: on ? "0%" : "-160%", opacity: on ? 1 : 0 }}
          transition={{ y: { duration: 1.2, ease: [0.2, 0.8, 0.2, 1], delay: 0.5 }, opacity: { duration: 0.6, delay: 0.5 } }}
        >
          <g fill="#5F656B"><ellipse cx="35" cy="55" rx="35" ry="25" /><ellipse cx="80" cy="40" rx="40" ry="40" /><ellipse cx="125" cy="52" rx="30" ry="27" /><rect x="10" y="50" width="140" height="30" rx="15" /></g>
          <g fill="#4A90B8">
            {[[25, 88], [45, 92], [65, 86], [85, 94], [105, 88], [125, 92], [145, 86]].map(([x, y]) => (
              <rect key={x} className="drop" x={x} y={y} width="3" height="16" rx="1.5" />
            ))}
          </g>
        </m.svg>
      </m.div>
      <canvas ref={cv} id="fx" className="pointer-events-none absolute inset-0 h-full w-full" />
    </div>
  );
}
