"use client";

import * as m from "motion/react-m";

const FITA = "0123456789".split("");

// Odômetro: cada dígito é uma fita 0-9 que rola com mola, da direita para a esquerda.
// Muda a quantidade de dígitos → remonta e rola a partir do zero.
export function Odo({ txt, atraso = 0 }: { txt: string; atraso?: number }) {
  const n = [...txt].filter((c) => /\d/.test(c)).length;
  let i = -1;
  return (
    <span key={txt.length} className="inline-flex h-[1em] justify-center overflow-hidden leading-none tabular-nums">
      {[...txt].map((c, k) => {
        if (!/\d/.test(c)) return <span key={k} className="inline-block">{c}</span>;
        i++;
        return (
          <span key={k} className="inline-block h-[1em] w-[.5em] overflow-hidden text-center">
            <m.span
              className="flex flex-col"
              initial={{ y: "0%" }}
              animate={{ y: `${-Number(c) * 10}%` }}
              transition={{ type: "spring", visualDuration: 0.9, bounce: 0.3, delay: atraso + (n - 1 - i) * 0.07 }}
            >
              {FITA.map((d) => <span key={d} className="block h-[1em]">{d}</span>)}
            </m.span>
          </span>
        );
      })}
    </span>
  );
}
