export type Conta = { anos: number; dias: number; fds: number; vida: number; idadeApos: number };

const ANO = 365.2425 * 864e5;
export const fmt = (n: number) => n.toLocaleString("pt-BR");

// A conta: 1 folga a menos por semana × semanas até a aposentadoria (52 por ano).
export function calcula(nasc: Date, idadeApos: number, hoje = new Date()): Conta | { erro: string } {
  const apos = new Date(nasc);
  apos.setFullYear(nasc.getFullYear() + idadeApos);
  const anos = (+apos - +hoje) / ANO;
  if (anos <= 0) return { erro: "Pela data, você já chegou na idade de aposentadoria. Mostra a conta para alguém da família!" };
  if ((+hoje - +nasc) / ANO < 14) return { erro: "Ainda não tem idade para trabalhar. Faz a conta de alguém da família!" };
  const dias = Math.round(anos * 52);
  return { anos, dias, fds: Math.round(dias / 2), vida: dias / 365.2425, idadeApos };
}

// "5 anos" / "1 ano" / "8 meses"
export const anosTxt = (x: number) =>
  x >= 1 ? `${fmt(+x.toFixed(1))} ${+x.toFixed(1) === 1 ? "ano" : "anos"}` : `${fmt(Math.round(x * 12))} meses`;
