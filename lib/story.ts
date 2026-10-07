import { fmt, type Conta } from "./conta";

type G = CanvasRenderingContext2D;

// Cena da praia em 1080×960 a partir de y0: colorida (5x2) ou cinza com nuvem e chuva (6x1).
export function cena(g: G, y0: number, cinza: boolean) {
  const c = cinza
    ? { a: "#8E959C", b: "#C9CDD1", sea: "#7B8288", sea2: "#9AA0A6", sand: "#BFC2C5", f: ["#6E747A", "#5D6369", "#80868C", "#73797F"] }
    : { a: "#55B8F0", b: "#C8ECFF", sea: "#1497C4", sea2: "#3DBBE0", sand: "#F6D9A6", f: ["#FF6B4A", "#7A4CE0", "#FF9F1C", "#1FB57A"] };
  const gr = g.createLinearGradient(0, y0, 0, y0 + 960);
  gr.addColorStop(0, c.a); gr.addColorStop(1, c.b); g.fillStyle = gr; g.fillRect(0, y0, 1080, 960);
  if (!cinza) { g.fillStyle = "#FFC93C"; g.beginPath(); g.arc(890, y0 + 480, 90, 0, 7); g.fill(); }
  g.fillStyle = c.sea; g.fillRect(0, y0 + 595, 1080, 155); g.fillStyle = c.sea2; g.fillRect(0, y0 + 595, 1080, 22);
  g.fillStyle = c.sand; g.fillRect(0, y0 + 730, 1080, 230);
  ([[166, 1, 0], [305, 1.12, 1], [457, 0.7, 2], [568, 0.6, 3]] as const).forEach(([x, s, i]) => {
    const h = 250 * s, w = 94 * s, b = y0 + 770;
    g.fillStyle = c.f[i]; g.beginPath(); g.roundRect(x, b - h, w, h, w / 2); g.fill();
    g.beginPath(); g.arc(x + w / 2, b - h - w * 0.55, w * 0.42, 0, 7); g.fill();
  });
  if (cinza) {
    g.fillStyle = "#5F656B";
    [[800, 470, 80, 58], [870, 435, 95, 95], [955, 465, 70, 62]].forEach(([x, y, rx, ry]) => { g.beginPath(); g.ellipse(x, y0 + y, rx, ry, 0, 0, 7); g.fill(); });
    g.fillStyle = "#4A90B8";
    for (let i = 0; i < 9; i++) g.fillRect(765 + i * 28, y0 + 545 + (i % 3) * 18, 6, 30);
  }
}

function caixa(g: G, y: number, rotulo: string, cor: string, num: string, linha: string, fundo: string) {
  g.fillStyle = "rgba(255,255,255,.95)"; g.beginPath(); g.roundRect(60, y, 960, 330, 36); g.fill();
  g.fillStyle = cor; g.font = "700 32px 'DM Sans'"; g.fillText(rotulo, 104, y + 66);
  g.fillStyle = fundo; g.font = "800 112px 'Bricolage Grotesque'"; g.fillText(num, 100, y + 190);
  g.font = "700 44px 'Bricolage Grotesque'"; g.fillText(linha, 104, y + 280);
}

// Card do story 1080×1920: metade cinza (6x1) × metade colorida (5x2).
export async function story(R: Conta): Promise<Blob> {
  await document.fonts.ready;
  const cv = document.createElement("canvas"); cv.width = 1080; cv.height = 1920;
  const g = cv.getContext("2d")!;
  cena(g, 0, true); cena(g, 960, false);
  caixa(g, 70, "NA 6x1", "#6A6E73", `−${fmt(R.dias)} dias`, "livres na minha vida", "#2A2D31");
  caixa(g, 1030, "NA 5x2", "#E0502F", `+${fmt(R.dias)} dias`, `de volta: ${fmt(R.fds)} fins de semana`, "#1B1B3A");
  g.fillStyle = "#1B1B3A"; g.beginPath(); g.roundRect(120, 1690, 840, 116, 58); g.fill();
  const link = "Faça a sua conta: " + (location.host + location.pathname).replace(/\/$/, "");
  let tam = 38; g.font = `700 ${tam}px 'DM Sans'`; while (g.measureText(link).width > 780 && tam > 22) g.font = `700 ${--tam}px 'DM Sans'`; // link longo encolhe até caber na pílula
  g.fillStyle = "#fff"; g.textAlign = "center"; g.fillText(link, 540, 1762);
  g.fillStyle = "#1B1B3A"; g.font = "400 26px 'DM Sans'"; g.fillText("Conta feita no meu celular. Nenhum dado enviado.", 540, 1862);
  return new Promise((r) => cv.toBlob((b) => r(b!), "image/png"));
}
