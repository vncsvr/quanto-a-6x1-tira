"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as m from "motion/react-m";
import { LazyMotion, MotionConfig, domAnimation, useReducedMotion } from "motion/react";
import { anosTxt, calcula, fmt, type Conta } from "@/lib/conta";
import { cena, story } from "@/lib/story";
import { Cena } from "@/components/cena";
import { Odo } from "@/components/odometro";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const MOLA = { type: "spring", visualDuration: 0.7, bounce: 0.4 } as const;
const DIAS = ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"];

function le(nasc: string, apos: string): { R: Conta | null; err: string } {
  if (!nasc) return { R: null, err: "" };
  const ap = parseInt(apos, 10);
  if (!(ap >= 50 && ap <= 80)) return { R: null, err: "Idade de aposentadoria entre 50 e 80." };
  const [y, mes, d] = nasc.split("-").map(Number);
  const r = calcula(new Date(y, mes - 1, d), ap);
  return "erro" in r ? { R: null, err: r.erro } : { R: r, err: "" };
}

export function Calculadora() {
  const nascRef = useRef<HTMLInputElement>(null), aposRef = useRef<HTMLInputElement>(null);
  const [dados, setDados] = useState({ nasc: "", apos: "65" });
  const [on, setOn] = useState(false);
  const [pulso, setPulso] = useState(0);
  const [prev, setPrev] = useState("");
  const reduz = useReducedMotion();
  const { R, err } = useMemo(() => le(dados.nasc, dados.apos), [dados]);

  // Igual ao original: a conta refaz no "change" nativo (data completa, ou ao sair do campo de idade).
  useEffect(() => {
    const f = () => { setDados({ nasc: nascRef.current!.value, apos: aposRef.current!.value }); setPulso((p) => p + 1); };
    const els = [nascRef.current!, aposRef.current!];
    els.forEach((e) => e.addEventListener("change", f));
    Object.assign(window, { calcula, cena }); // para os testes (smoke e og)
    return () => els.forEach((e) => e.removeEventListener("change", f));
  }, []);

  useEffect(() => { document.body.classList.toggle("gray", on); }, [on]);

  const liga = (v: boolean) => {
    setOn(v);
    navigator.vibrate?.(v ? [25, 40, 25] : 15);
    setPulso((p) => p + 1);
  };

  const gera = async () => {
    if (!R) return;
    const blob = await story(R), file = new File([blob], "minha-conta-6x1.png", { type: "image/png" });
    const url = URL.createObjectURL(blob);
    setPrev(url);
    if (navigator.canShare?.({ files: [file] })) {
      try { await navigator.share({ files: [file], text: "Quanto a 6x1 tira da sua vida? Faça a sua conta: " + location.origin + location.pathname }); return; }
      catch (e) { if ((e as Error).name === "AbortError") return; }
    }
    const a = document.createElement("a"); a.href = url; a.download = file.name; a.click();
  };

  const sinal = on ? "−" : "+";
  const itens: [string, number, string, string][] = R ? [
    ["🏖️", R.dias, "dias de praia ou de descanso", "#1497C4"],
    ["👨‍👩‍👧", R.dias, "almoços de família no fim de semana", "#FF6B4A"],
    ["🍻", Math.round(R.dias / 2), "encontros com os amigos", "#7A4CE0"],
    ["⚽", Math.round(R.dias / 4), "peladas e jogos com a turma", "#1FB57A"],
    ["🎂", Math.round((R.anos * 10) / 7), "aniversários e festas a mais caindo no seu dia de trabalho", "#FF9F1C"],
    ["📚", R.dias * 4, "horas de estudo ou de curso", "#1497C4"],
    ["😴", R.dias * 16, "horas acordado(a) e livre", "#7A4CE0"],
    ["🗓️", R.fds, "fins de semana de dois dias, como sábado e domingo", "#FF6B4A"],
    ["🌞", Math.round(R.dias / 89), "verões inteiros, de dezembro a março", "#FF9F1C"],
    ["📅", Math.round(R.dias / 7), "semanas inteiras, de segunda a domingo", "#1FB57A"],
  ] : [];
  const vida = R ? anosTxt(R.vida) : "";
  const big = R ? fmt(on ? R.dias : R.dias * 2) : "—";
  const atraso = (k: number) => (reduz ? 0 : 0.5) + k * 0.11;

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <Cena on={on} temConta={!!R} pulso={pulso} />

        <section className="px-6 pt-[18px] pb-8">
          <h1 className="text-[clamp(28px,8vw,34px)] leading-[1.05] font-extrabold">Quanto da sua vida a escala 6x1 leva?</h1>
          <p className="mt-2 mb-[18px] text-[15px] text-ink2">Coloque sua data de nascimento e ligue a 6x1. A conta roda só no seu celular: nada é enviado nem guardado.</p>
          <div className="grid grid-cols-[1fr_104px] gap-2.5">
            <div><label className="rotulo" htmlFor="nasc">Data de nascimento</label><Input ref={nascRef} type="date" id="nasc" min="1940-01-01" /></div>
            <div><label className="rotulo" htmlFor="apos">Aposenta aos</label><Input ref={aposRef} type="number" id="apos" defaultValue={65} min={50} max={80} inputMode="numeric" className="text-center" /></div>
          </div>
          <p className="mt-1.5 text-[12.5px] text-mute">Regra geral: 65 anos para homens e 62 para mulheres (EC 103/2019).</p>

          <div className="mt-3.5 text-center" aria-live="polite">
            <div className="rotulo" id="rot">{R ? `Seus dias livres até os ${R.idadeApos}` : "Coloque sua data para ver seus dias livres"}</div>
            <div id="n" aria-label={big} className="font-display text-[clamp(72px,22vw,100px)] leading-none font-extrabold tracking-[-.02em] text-ink tabular-nums transition-colors duration-1000 gray:text-chumbo">
              {R ? <Odo txt={big} /> : "—"}
            </div>
            <div id="delta" className="mt-1 min-h-[28px] font-display text-[20px] leading-normal font-bold text-folga gray:text-alerta">
              {R ? (on ? `−${fmt(R.dias)} dias com a 6x1` : `${fmt(R.dias)} dias a mais sem a 6x1`) : on ? "Ligou a 6x1. Agora coloque sua data." : ""}
            </div>
            <m.div
              id="anos"
              className="mt-1.5 font-display text-[clamp(26px,8vw,34px)] leading-[1.1] font-extrabold text-alerta"
              initial={false}
              animate={on && R ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ opacity: { duration: 0.5, delay: 0.9 }, scale: { ...MOLA, delay: 0.9 } }}
            >
              {R && `= ${vida} inteiros da sua vida`}
            </m.div>
          </div>

          <Switch id="tg" checked={on} onCheckedChange={liga} label="Escala 6x1" estado={on ? "ligada" : "desligada"} />

          <div className="mt-3.5 text-center">
            <div className="mt-[18px] grid gap-2.5 text-left" aria-hidden="true">
              {[["sem 6x1", "100%", "#1FB57A", "104"], ["você", on ? "50%" : "100%", on ? "#5F656B" : "#FF6B4A", on ? "52" : "104"]].map(([rot, w, cor, v]) => (
                <div key={rot} className="grid grid-cols-[70px_1fr_54px] items-center gap-2.5 text-[13px] leading-normal font-bold text-ink2">
                  <span>{rot}</span>
                  <span className="block h-[18px] overflow-hidden rounded-[9px] bg-[rgba(27,27,58,.08)]">
                    <m.span className="block h-full rounded-[9px]" initial={{ width: 0, backgroundColor: cor }} animate={{ width: w, backgroundColor: cor }} transition={{ width: MOLA, backgroundColor: { duration: 0.8 } }} />
                  </span>
                  <span className="text-right tabular-nums">{v}</span>
                </div>
              ))}
            </div>

            <div className="mt-[18px] text-left" aria-hidden="true">
              <div className="rotulo">
                {R ? (on ? `Sua vida até os ${R.idadeApos}: o cinza é o tempo livre que a 6x1 leva (${vida})` : `Sua vida até os ${R.idadeApos}`) : "Sua vida até a aposentadoria"}
              </div>
              <span className="relative block h-[26px] overflow-hidden rounded-[13px] bg-[linear-gradient(90deg,#FFC93C,#FF6B4A_60%,#7A4CE0)]">
                <m.span
                  className="absolute inset-y-0 right-0 bg-[repeating-linear-gradient(-45deg,#5F656B_0_8px,#727880_8px_16px)]"
                  initial={{ width: 0 }}
                  animate={{ width: on && R ? `${(R.vida / R.idadeApos) * 100}%` : 0 }}
                  transition={{ ...MOLA, visualDuration: 1.2, delay: 0.3 }}
                />
                <span className="absolute -top-1 -bottom-1 w-[3px] rounded-sm bg-ink" style={R ? { left: `${((R.idadeApos - R.anos) / R.idadeApos) * 100}%` } : undefined} />
              </span>
              <div className="mt-1.5 flex justify-between text-xs leading-normal font-bold text-ink2">
                <span>nasceu</span><span>hoje</span><span>{R ? R.idadeApos : 65} anos</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-1.5" aria-hidden="true">
              {DIAS.map((d, i) => {
                const perdeu = i === 5 && on, folga = i >= 5 && !perdeu;
                return (
                  <m.div
                    key={d}
                    className={`grid aspect-square place-items-center rounded-xl border-[1.5px] font-display text-xs leading-normal font-extrabold transition-colors duration-500 ${perdeu ? "border-[rgba(27,27,58,.12)] bg-[#5F656B] text-white" : folga ? "border-transparent bg-[#FFC93C] text-ink" : "border-[rgba(27,27,58,.12)] bg-white text-ink2"}`}
                    initial={false}
                    animate={{ rotate: perdeu ? -8 : 0, scale: perdeu ? 0.92 : 1 }}
                    transition={MOLA}
                  >
                    {d}
                  </m.div>
                );
              })}
            </div>
            <div className="mt-1.5 min-h-[1.2em] text-center text-[12.5px] text-mute">
              {on ? "6x1: o sábado vira trabalho · 52 dias livres por ano" : "5x2: sábado e domingo livres · 104 dias livres por ano"}
            </div>
          </div>

          <p className="mt-2.5 min-h-[1em] text-center font-medium text-alerta" id="err" role="alert">{err}</p>

          {R && (
            <div id="res">
              <div id="perde" className="mt-[22px] text-center font-display text-[22px] leading-[1.15] font-extrabold transition-colors duration-600 gray:text-chumbo">
                {on ? `O que a 6x1 tira de você até os ${R.idadeApos}:` : "Sem a 6x1, isso tudo volta pra você:"}
              </div>
              <div id="cards" className="mt-3.5 grid grid-cols-2 gap-2.5">
                {[...itens, ["👶", -1, "é o tempo de uma criança nascer e chegar a essa idade", "#7A4CE0"] as const].map(([e, v, l, c], k) => (
                  <Card
                    key={k}
                    className={k === itens.length ? "col-span-2" : undefined}
                    style={{ "--c": c } as React.CSSProperties}
                    initial={{ opacity: 0, y: 14, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ opacity: { duration: 0.5, delay: atraso(k) }, default: { ...MOLA, delay: atraso(k) } }}
                  >
                    <div className="text-[22px] leading-none gray:grayscale">{e}</div>
                    <div className="mt-1.5 flex items-baseline gap-0.5 font-display text-[30px] leading-[1.05] font-extrabold tracking-[-.02em] text-(--c) transition-colors duration-600 gray:text-chumbo">
                      <span>{v < 0 ? "" : sinal}</span>
                      <span>{v < 0 ? vida : <Odo txt={fmt(v)} atraso={atraso(k)} />}</span>
                    </div>
                    <p className="mt-1 text-[13.5px] leading-[1.3] font-medium text-[#3A3D41]">{l}</p>
                  </Card>
                ))}
              </div>
              <div className="mt-4 text-center text-sm text-mute">
                Conta: 52 dias por ano × {fmt(+R.anos.toFixed(1))} anos até os {R.idadeApos} = {fmt(R.dias)} dias livres.
              </div>
              <Button id="story" className="mt-6" onClick={gera}>Gerar card para o story</Button>
              {prev && <img src={prev} alt="Card para o story com a sua conta" className="mt-[18px] w-full rounded-[14px]" />}
            </div>
          )}
        </section>
      </MotionConfig>
    </LazyMotion>
  );
}
