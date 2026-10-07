import { fmt, type Conta } from "./conta";

type G = CanvasRenderingContext2D;

// Cena da praia em 1080×960 a partir de y0: colorida (5x2, paleta oficial) ou cinza com nuvem e chuva (6x1).
export function cena(g: G, y0: number, cinza: boolean) {
  const c = cinza
    ? { a: "#8E959C", b: "#C9CDD1", sea: "#7B8288", sea2: "#9AA0A6", sand: "#BFC2C5", f: ["#6E747A", "#5D6369", "#80868C", "#73797F"] }
    : { a: "#0034d2", b: "#ccd6f6", sea: "#0034d2", sea2: "#f3f2f3", sand: "#ffd400", f: ["#fd0000", "#a237fb", "#00b923", "#f3f2f3"] };
  const gr = g.createLinearGradient(0, y0, 0, y0 + 960);
  gr.addColorStop(0, c.a); gr.addColorStop(1, c.b); g.fillStyle = gr; g.fillRect(0, y0, 1080, 960);
  if (!cinza) { g.fillStyle = "#ffd400"; g.beginPath(); g.arc(890, y0 + 480, 90, 0, 7); g.fill(); }
  g.fillStyle = c.sea; g.fillRect(0, y0 + 595, 1080, 155); g.fillStyle = c.sea2; g.fillRect(0, y0 + 595, 1080, 18);
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

// Gramática do kit: caixa retangular inclinada com extrusão sólida (lado escuro), texto em caixa alta condensada.
export const display = (px: number) => `900 condensed ${px}px Archivo`; // stretch vai no shorthand: atribuir g.font zera g.fontStretch
// escreve encolhendo a fonte até caber em `max` px
function cabe(g: G, txt: string, px: number, max: number, x: number, y: number) {
  g.font = display(px); while (g.measureText(txt).width > max && px > 20) g.font = display(--px);
  g.fillText(txt, x, y);
}
export function bloco(g: G, cx: number, cy: number, w: number, h: number, graus: number, face: string, lado: string, prof: number, dentro?: (g: G) => void) {
  g.save(); g.translate(cx, cy); g.rotate((graus * Math.PI) / 180);
  g.fillStyle = lado; for (let i = prof; i > 0; i--) g.fillRect(-w / 2 + i, -h / 2 + i, w, h);
  g.fillStyle = face; g.fillRect(-w / 2, -h / 2, w, h);
  if (dentro) dentro(g);
  g.restore();
}

function caixa(g: G, cy: number, graus: number, rotulo: string, tagCor: string, num: string, linha: string, cor: string, lado: string) {
  bloco(g, 540, cy, 940, 330, graus, "#ffffff", lado, 16, (g) => {
    g.fillStyle = cor; cabe(g, num.toUpperCase(), 170, 850, -420, 50);
    cabe(g, linha.toUpperCase(), 64, 850, -416, 128);
  });
  bloco(g, 250, cy - 170, 230, 76, graus - 3, tagCor, lado, 8, (g) => {
    g.fillStyle = "#ffffff"; g.font = display(52); g.textAlign = "center"; g.fillText(rotulo.toUpperCase(), 0, 19);
  });
}

// Card do story 1080×1920: metade cinza (6x1) × metade colorida (5x2).
export async function story(R: Conta): Promise<Blob> {
  await Promise.all([document.fonts.load(display(100)), document.fonts.load("600 26px Montserrat"), document.fonts.ready]);
  const cv = document.createElement("canvas"); cv.width = 1080; cv.height = 1920;
  const g = cv.getContext("2d")!;
  cena(g, 0, true); cena(g, 960, false);
  caixa(g, 300, -3, "NA 6x1", "#5F656B", `−${fmt(R.dias)} dias`, "livres na minha vida", "#2A2D31", "#5F656B");
  caixa(g, 1250, 2, "NA 5x2", "#fd0000", `+${fmt(R.dias)} dias`, `de volta: ${fmt(R.fds)} fins de semana`, "#320d59", "#320d59");
  const link = ("Faça a sua conta: " + (location.host + location.pathname).replace(/\/$/, "")).toUpperCase();
  bloco(g, 540, 1712, 900, 112, -2, "#fd0000", "#a20301", 12, (g) => {
    let tam = 52; g.font = display(tam); while (g.measureText(link).width > 840 && tam > 26) g.font = display(--tam); // link longo encolhe até caber
    g.fillStyle = "#ffffff"; g.textAlign = "center"; g.fillText(link, 0, tam * 0.36);
  });
  g.textAlign = "center"; g.fillStyle = "#320d59";
  g.font = "700 28px Montserrat"; g.fillText("Conta feita no meu celular. Nenhum dado enviado.", 540, 1832);
  g.font = "600 22px Montserrat"; g.fillText("Feito por um eleitor voluntário. Não é material oficial da campanha.", 540, 1880);
  return new Promise((r) => cv.toBlob((b) => r(b!), "image/png"));
}
