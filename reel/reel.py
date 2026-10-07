"""Reel "A Seis por Um" — 60 s, 1080x1920, 30 fps. Ilustração vetorial + gravação do app + jingle (piloto Suno, música feita com IA).
Tempo do vídeo t = tempo da música - 7,0 s (cortamos a introdução). Cenas casadas com os tempos medidos da letra (audio/p1-palavras.json).
Regras: sem pessoa real, sem candidato, sem marca de empresa; rótulo de IA no início e marca d'água o vídeo todo."""
import sys, os, math, random
sys.path.insert(0, '/root/.claude/skills/motion/motor')
from motor import *
from PIL import Image

AQ = os.path.dirname(os.path.abspath(__file__))
W, H = 1080, 1920
BRI = lambda n, p='ExtraBold': fonte('', f'{AQ}/fontes/Bricolage.ttf', n, p)
DM = lambda n, p='Medium': fonte('', f'{AQ}/fontes/DMSans.ttf', n, p)
INK, PAPEL, CORAL, VIOLETA, MAR, VERDE, SOL, LARANJA = '#1B1B3A', '#FFF8EC', '#FF6B4A', '#7A4CE0', '#1497C4', '#1FB57A', '#FFC93C', '#FF9F1C'
CINZA_FUNDO = '#ECEDEF'
APP = sorted(os.listdir(f'{AQ}/quadros/app'))

def hexrgb(c): return tuple(int(c.lstrip('#')[i:i + 2], 16) for i in (0, 2, 4))
def cz(c, k):
    """Dessatura a cor c na fração k (0 = cor, 1 = cinza)."""
    r, g, b = hexrgb(c) if isinstance(c, str) else c; y = .3 * r + .59 * g + .11 * b
    return tuple(int(lerp(v, y * .92, cl(k))) for v in (r, g, b))

# ---------- peças de ilustração
def ceu(q, k, y0=0, y1=H):
    a, b = cz('#55B8F0', k), cz('#C8ECFF', k); n = 24
    for i in range(n):
        q.ret(0, y0 + (y1 - y0) * i / n, W, y0 + (y1 - y0) * (i + 1) / n + 1, tuple(int(lerp(a[j], b[j], i / n)) for j in range(3)))

def praia(q, k, t, mar_y=1080, sol=True, sol_dy=0, sol_xy=(820, 330), sol_r=130):
    ceu(q, k, 0, mar_y)
    if sol and sol_dy > -900:
        cx, cy = sol_xy[0], sol_xy[1] + sol_dy; f = sol_r / 130
        for i in range(12):  # raios girando
            a = t * .6 + i * math.pi / 6
            q.poligono([(cx + math.cos(a - .08) * 150 * f, cy + math.sin(a - .08) * 150 * f), (cx + math.cos(a) * 210 * f, cy + math.sin(a) * 210 * f), (cx + math.cos(a + .08) * 150 * f, cy + math.sin(a + .08) * 150 * f)], cz(SOL, k))
        q.circulo(cx, cy, sol_r, cz(SOL, k))
    q.ret(0, mar_y, W, mar_y + 240, cz(MAR, k))
    for i in range(9):  # ondas
        x = (i * 140 + t * 60) % (W + 140) - 70
        q.ret(x - 50, mar_y + 40 + (i % 3) * 60, x + 50, mar_y + 52 + (i % 3) * 60, cz('#3DBBE0', k), raio=6)
    q.ret(0, mar_y + 230, W, H, cz('#F6D9A6', k))

def pessoa(q, x, base, esc, c, k=0, pulo=0, braco=0, alfa=1.0, tracejado=False):
    """Figura geométrica genérica (sem rosto): corpo-pílula + cabeça. braco = ângulo do braço levantado."""
    w, h = 94 * esc, 250 * esc; b = base - pulo
    if tracejado:
        for i in range(14):
            a0, a1 = i / 14 * 2 * math.pi, (i + .5) / 14 * 2 * math.pi
            q.linha([(x + w / 2 + math.cos(a) * w * .42, b - h - w * .55 + math.sin(a) * w * .42) for a in [a0 + (a1 - a0) * j / 6 for j in range(7)]], '#8A8E93', 5)
        for yy in range(int(b - h), int(b), 34):
            q.linha([(x, yy), (x, yy + 18)], '#8A8E93', 5); q.linha([(x + w, yy), (x + w, yy + 18)], '#8A8E93', 5)
        return
    col = cz(c, k)
    if braco:
        ox, oy = x + w * .85, b - h * .78
        q.linha([(ox, oy), (ox + math.cos(-braco) * 120 * esc, oy + math.sin(-braco) * 120 * esc)], col, 26 * esc, alfa=alfa)
    q.ret(x, b - h, x + w, b, col, raio=w / 2, alfa=alfa)
    q.circulo(x + w / 2, b - h - w * .55, w * .42, col, alfa=alfa)

def familia(q, k, t, base=1300, x0=150, esc=1.0, pula=True):
    for i, (dx, s, c) in enumerate([(0, 1, CORAL), (150, 1.12, VIOLETA), (310, .72, LARANJA), (430, .62, VERDE)]):
        p = abs(math.sin(t * 5 + i)) * 26 * (1 - k) if pula else 0
        pessoa(q, x0 + dx * esc, base, s * esc, c, k, pulo=p)

def nuvem(q, cx, cy, esc=1.0, alfa=1.0):
    for dx, dy, r in [(-110, 20, 80), (0, -30, 110), (110, 10, 85)]:
        q.circulo(cx + dx * esc, cy + dy * esc, r * esc, '#5F656B', alfa=alfa)
    q.ret(cx - 190 * esc, cy, cx + 190 * esc, cy + 90 * esc, '#5F656B', raio=45 * esc, alfa=alfa)

def chuva(q, t, x0, x1, y0, y1, dens=40, alfa=1.0):
    random.seed(3)
    for i in range(dens):
        x = random.uniform(x0, x1); v = random.uniform(900, 1300); fase = random.random()
        y = y0 + ((t * v / (y1 - y0) + fase) % 1) * (y1 - y0)
        q.linha([(x, y), (x - 6, y + 36)], '#4A90B8', 5, alfa=alfa)

def coracao(q, x, y, r, c, alfa=1.0):
    q.circulo(x - r * .5, y, r * .6, c, alfa=alfa); q.circulo(x + r * .5, y, r * .6, c, alfa=alfa)
    q.poligono([(x - r * 1.08, y + r * .15), (x + r * 1.08, y + r * .15), (x, y + r * 1.3)], c, alfa=alfa)

def legenda(q, t):
    for a, b, txt in LETRA:
        if a <= t < b:
            e = e_back(prog(t, a, a + .3)); f = DM(50, 'Bold'); linhas = quebra(txt, f, 900)
            y = 1500 - (len(linhas) - 1) * 34; hh = len(linhas) * 66 + 36
            q.ret(70, y - 50 + 20 * (1 - e), W - 70, y - 50 + hh + 20 * (1 - e), INK, raio=34, alfa=.88 * min(1, e + .2))
            for i, l in enumerate(linhas): q.texto(l, W / 2, y + i * 66 + 20 * (1 - e) - 12, f, '#FFFFFF', alfa=min(1, e + .2), anchor='mt')
            return

def quebra(txt, f, larg):
    from PIL import ImageDraw
    d = ImageDraw.Draw(Image.new('L', (1, 1))); out, cur = [], ''
    for p in txt.split():
        n = (cur + ' ' + p).strip()
        if d.textlength(n, font=f) > larg and cur: out.append(cur); cur = p
        else: cur = n
    return out + [cur]

LETRA = [(2.45, 5.96, 'Segunda, terça, quarta, quinta, sexta e sábado também'), (5.96, 9.6, 'Seis dias no batente, e a folga? Só uma, meu bem'),
         (9.6, 12.82, 'Ai, ai, ai, a seis por um'), (12.82, 16.94, 'Levou meu domingo, meu sol e meu pé na areia'),
         (16.94, 20.18, 'Cinquenta e dois dias por ano'), (20.18, 23.98, 'Faz a conta que a coisa fica feia!'),
         (23.98, 27.38, 'O churrasco foi sem mim'), (27.38, 30.84, 'O aniversário da vó também'), (30.84, 34.46, 'Minha praia virou foto'),
         (34.46, 37.82, 'No story de outro alguém'), (37.82, 41.12, 'Ai, ai, ai, a seis por um'), (41.12, 45.24, 'Levou meu domingo, meu sol e meu pé na areia'),
         (45.24, 48.48, 'Cinquenta e dois dias por ano'), (48.48, 52.16, 'Faz a conta que a coisa fica feia!'),
         (52.16, 55.52, 'Faz a conta, faz a conta'), (55.52, 59.0, 'Quanto a seis por um tira de você?')]

# ---------- cenas
def c_abre(q, t):  # 0–2,45: praia colorida + gancho + aviso de IA
    praia(q, 0, t, sol_xy=(900, 280), sol_r=90); familia(q, 0, t)
    q.texto_sobe(['A', '6x1', 'te', 'tira', '\n', '5', 'anos', 'de', '\n', 'vida', 'livre.'], 80, 420, BRI(112), INK, t, t0=.15, passo=.07)
    q.texto('* ex.: 30 anos de idade, aposentadoria aos 65', 84, 850, DM(32), INK, alfa=e_out(prog(t, .9, 1.3)), anchor='lm')

def c_semana(q, t):  # 2,45–9,6: a semana vira trabalho; só o domingo sobra
    q.fundo(PAPEL)
    q.texto('A semana na 6x1', W / 2, 330, BRI(76), INK, alfa=e_out(prog(t, 2.45, 2.8)))
    dias, acende = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'], [2.55, 3.0, 3.4, 4.0, 4.3, 4.7, 99]
    for i, (d, ta) in enumerate(zip(dias, acende)):
        x = 52 + i * 142; e = e_back(prog(t, ta, ta + .35)); y = 470
        if i < 6:
            c = tuple(int(lerp(a, b, cl(e))) for a, b in zip(hexrgb('#FFFFFF'), hexrgb('#3A3D41')))
            q.ret(x, y, x + 130, y + 170, c, raio=26, contorno=INK, esp=3)
            q.texto(d, x + 65, y + 60, BRI(42), '#FFFFFF' if e > .5 else INK)
            if e > .2: q.texto('trab.', x + 65, y + 120, DM(32, 'Bold'), '#FFFFFF', alfa=cl(e))
        else:
            pulso = 1 + .12 * e_out(prog(t, 8.0, 8.3)) * (1 - prog(t, 8.3, 9.0))
            cx, cy = x + 65, y + 85
            q.ret(cx - 65 * pulso, cy - 85 * pulso, cx + 65 * pulso, cy + 85 * pulso, SOL, raio=26, contorno=INK, esp=3)
            q.texto(d, cx, cy - 25, BRI(42), INK); q.texto('folga', cx, cy + 35, DM(32, 'Bold'), INK)
    # personagem no batente: anda sem sair do lugar, com linhas de movimento
    if t > 5.9:
        ap = e_out(prog(t, 5.9, 6.3)); bob = abs(math.sin(t * 9)) * 18
        pessoa(q, 470, 1250 - bob + 300 * (1 - ap), 1.1, '#5F656B', alfa=ap)
        q.ret(560, 1050 - bob + 300 * (1 - ap), 640, 1120 - bob + 300 * (1 - ap), '#8B5A2B', raio=10, alfa=ap)  # maleta
        for i in range(3):
            xx = 400 - ((t * 400 + i * 120) % 300)
            q.linha([(xx, 1000 + i * 70), (xx + 70, 1000 + i * 70)], '#8A8E93', 8, alfa=ap)
        q.texto('6 dias no batente', W / 2, 1330, BRI(56), INK, alfa=ap)

def c_aiai(q, t):  # 9,6–12,8: "ai, ai, ai, a seis por um"
    q.fundo(CORAL)
    for i, (ta, x, y, ang) in enumerate([(10.1, 260, 520, -8), (10.7, 560, 720, 6), (11.1, 820, 520, -4)]):
        e = e_elast(prog(t, ta, ta + .5))
        if e > 0: q.texto('AI,' if i < 2 else 'AI!', x, y, BRI(int(150 * max(e, .05))), '#FFFFFF')
    e = e_back(prog(t, 11.65, 12.1))
    if e > 0:
        q.texto('6x1', W / 2, 1080, BRI(int(330 * max(e, .05))), INK)
        q.texto('uma folga por semana', W / 2, 1270, DM(46, 'Bold'), INK, alfa=cl(e))

def c_rouba(q, t):  # 12,8–16,9: o domingo, o sol e o pé na areia vão embora
    k = e_io(prog(t, 13.6, 16.3))
    praia(q, k, t, sol=True, sol_dy=-900 * e_in(prog(t, 15.0, 15.7)))
    pas = 1 - prog(t, 15.7, 16.4)  # pegadas somem
    for i in range(6): q.circulo(150 + i * 140, 1420 + (i % 2) * 40, 22, cz('#E2BF85', k), alfa=pas)
    familia(q, k, t, base=1330)
    e = e_out(prog(t, 13.4, 14.0)); voa = e_in(prog(t, 14.0, 14.7))
    q.ret(300, 330 - 700 * voa, 780, 450 - 700 * voa, SOL, raio=60, alfa=e)
    q.texto('DOMINGO', W / 2, 390 - 700 * voa, BRI(64), INK, alfa=e)
    n = e_out(prog(t, 14.4, 15.2))
    if n > 0: nuvem(q, 560, -200 + 560 * n, 1.3); chuva(q, t, 300, 820, 470, 1300, 30, alfa=prog(t, 15.0, 15.6))

def c_conta(q, t):  # 16,9–24: 52 quadradinhos por ano, depois a conta
    q.fundo(CINZA_FUNDO)
    q.texto('52', W / 2, 390, BRI(220), '#2A2D31', alfa=e_out(prog(t, 16.9, 17.3)))
    q.texto('dias livres a menos por ano', W / 2, 540, DM(48, 'Bold'), '#2A2D31', alfa=e_out(prog(t, 17.1, 17.5)))
    for i in range(52):
        c, r = i % 13, i // 13; e = cascata(t, i, 17.0, .045, .3)
        x, y = 90 + c * 70, 640 + r * 70
        if e > 0:
            q.ret(x + 30 * (1 - e), y + 30 * (1 - e), x + 30 + 30 * e, y + 30 + 30 * e, '#5F656B' if t > 19.6 else SOL, raio=12)
    if t > 20.2:
        e = e_back(prog(t, 20.2, 20.6)); q.texto('52 × 35 anos', W / 2, 1050, BRI(int(96 * max(e, .05))), INK)
        k = e_out(prog(t, 20.9, 22.6)); n = int(round(1820 * k))
        q.texto(f'= {n:,}'.replace(',', '.') + ' dias', W / 2, 1190, BRI(110), '#C0392B', alfa=cl(prog(t, 20.9, 21.1)))
        q.texto('= 5 anos inteiros', W / 2, 1320, BRI(80), INK, alfa=e_out(prog(t, 22.7, 23.1)))

def c_churrasco(q, t):  # 24–27,4
    q.fundo(PAPEL)
    q.texto('O churrasco foi sem mim', W / 2, 330, BRI(68), INK, alfa=e_out(prog(t, 24.0, 24.4)))
    q.ret(380, 820, 700, 880, '#3A3D41', raio=14); q.linha([(420, 880), (380, 1080)], '#3A3D41', 14); q.linha([(660, 880), (700, 1080)], '#3A3D41', 14)
    for i in range(4):  # brasa e espetinhos
        q.ret(410 + i * 75, 790, 460 + i * 75, 815, CORAL, raio=8)
    for i in range(3):  # fumaça ondulando
        pts = [(470 + i * 70 + math.sin(t * 4 + j * .6 + i) * 18, 770 - j * 30) for j in range(10)]
        q.linha(pts, '#BFC2C5', 12, alfa=.8)
    for i, (x, s, c) in enumerate([(130, 1, CORAL), (760, 1.05, VIOLETA), (900, .7, LARANJA)]):
        pessoa(q, x, 1300, s, c, pulo=abs(math.sin(t * 4 + i)) * 14, braco=.9 if i == 0 else 0)
    pessoa(q, 480, 1300, 1, None, tracejado=True)
    q.texto('eu?', 527, 1360, DM(42, 'Bold'), '#8A8E93', alfa=e_out(prog(t, 25.0, 25.4)))

def c_vo(q, t):  # 27,4–30,8
    q.fundo(PAPEL)
    q.texto('O aniversário da vó também', W / 2, 330, BRI(64), INK, alfa=e_out(prog(t, 27.4, 27.8)))
    q.ret(330, 760, 750, 960, '#F7C6D9', raio=30); q.ret(360, 640, 720, 770, '#FFFFFF', raio=26)
    for i in range(5):  # velas com chama tremendo
        x = 400 + i * 70; q.ret(x, 560, x + 18, 640, VIOLETA, raio=6)
        q.circulo(x + 9, 540 + math.sin(t * 20 + i) * 4, 14, LARANJA)
    for i in range(30):  # confete caindo
        random.seed(i); x = random.uniform(60, 1020); y = (random.uniform(0, 1) * 1200 + (t - 27.4) * 260) % 1200 + 400
        q.ret(x, y, x + 18, y + 10, [CORAL, VIOLETA, VERDE, SOL, MAR][i % 5], raio=3)
    pessoa(q, 120, 1300, .9, '#A07CD8', braco=1.2); pessoa(q, 820, 1300, 1, VERDE, braco=1.0)
    pessoa(q, 470, 1300, 1, None, tracejado=True)

def c_story(q, t):  # 30,8–37,8: a praia virou foto no story de outro alguém
    q.fundo('#C9CDD1')
    px, py, pw, ph = 250, 300, 580, 1060
    q.ret(px - 18, py - 18, px + pw + 18, py + ph + 18, '#1B1B1F', raio=70)
    cam = Quadro(pw, ph, 1)
    praia(cam, 0, t, mar_y=620); familia(cam, 0, t, base=820, x0=60, esc=.75)
    k = prog(t, 31.0, 37.8)
    cam.ret(30, 40, pw - 30, 48, '#FFFFFF', raio=4, alfa=.4); cam.ret(30, 40, 30 + (pw - 60) * k, 48, '#FFFFFF', raio=4)
    cam.circulo(62, 92, 26, VIOLETA); cam.texto('outro_alguem', 100, 92, DM(30, 'Bold'), '#FFFFFF', anchor='lm')
    q.imagem(cam.img.convert('RGB'), px + pw / 2, py + ph / 2, escala=1)
    for i in range(6):  # corações subindo depois de "outro alguém"
        tt = t - 34.5 - i * .35
        if tt > 0: coracao(q, 720 + (i % 3) * 60, 1250 - tt * 300, 26, CORAL, alfa=cl(1 - tt / 2.5))
    pessoa(q, 900, 1400, .62, '#5F656B'); q.ret(965, 1260, 1015, 1300, '#8B5A2B', raio=6)

def c_app(q, t):  # 37,8–52,2: o app de verdade dentro do celular
    k = 1 - abs(math.sin((t - 37.8) * .4))
    q.fundo(INK)
    i = min(len(APP) - 1, 36 + int((t - 37.8) * 30))
    im = Image.open(f'{AQ}/quadros/app/{APP[i]}')
    e = e_back(prog(t, 37.8, 38.4)); esc = .70 * (.9 + .1 * e); cy = 930
    q.ret(W / 2 - 780 * esc / 2 - 18, cy - 1688 * esc / 2 - 18, W / 2 + 780 * esc / 2 + 18, cy + 1688 * esc / 2 + 18, '#000000', raio=64)
    q.imagem(im, W / 2, cy, escala=esc)
    q.texto('Faça a sua conta: liga e desliga a 6x1', W / 2, 262, DM(40, 'Bold'), '#FFFFFF', alfa=e_out(prog(t, 38.2, 38.6)))

def c_fim(q, t):  # 52,2–60: a cor volta — "faz a conta"
    praia(q, 0, t); familia(q, 0, t)
    e = e_back(prog(t, 52.3, 52.8))
    q.ret(70, 300, W - 70, 760, '#FFFFFF', raio=40, alfa=.95 * cl(e))
    q.texto('Faz a conta.', W / 2, 410, BRI(int(110 * max(e, .05))), INK)
    q.texto('Quanto a 6x1 tira de você?', W / 2, 540, BRI(60), INK, alfa=e_out(prog(t, 55.5, 56.0)))
    q.texto('Calculadora no link · nada é enviado', W / 2, 650, DM(38, 'Bold'), CORAL, alfa=e_out(prog(t, 53.2, 53.6)))
    q.texto('Fim da 6x1: PEC 221/2019, 40 h e 2 folgas por semana,', W / 2, 1590, DM(30, 'Bold'), INK, alfa=e_out(prog(t, 53.6, 54.0)))
    q.texto('em discussão no plenário do Senado (out/2026)', W / 2, 1630, DM(30, 'Bold'), INK, alfa=e_out(prog(t, 53.6, 54.0)))

CENAS = [(0, 2.45, c_abre), (2.45, 9.6, c_semana), (9.6, 12.8, c_aiai), (12.8, 16.94, c_rouba), (16.94, 24.0, c_conta),
         (24.0, 27.4, c_churrasco), (27.4, 30.84, c_vo), (30.84, 37.82, c_story), (37.82, 52.16, c_app), (52.16, 61, c_fim)]

def cena(q, t):
    for a, b, f in CENAS:
        if a <= t < b: f(q, t); break
    if not (37.82 <= t < 52.16): legenda(q, t)
    else: legenda(q, t) if t > 48.4 else None
    # rótulo de IA: aviso grande no início + marca d'água o vídeo todo (Res. TSE 23.610, art. 9º-B, § 1º)
    a = 1 - prog(t, 2.0, 2.4)
    if a > 0:
        q.ret(70, 1180, W - 70, 1340, INK, raio=30, alfa=.92 * a)
        q.texto('Aviso: a música deste vídeo foi criada', W / 2, 1235, DM(40, 'Bold'), '#FFFFFF', alfa=a)
        q.texto('com inteligência artificial (Suno).', W / 2, 1290, DM(40, 'Bold'), '#FFFFFF', alfa=a)
    q.ret(40, 1748, 600, 1800, '#000000', raio=26, alfa=.55)
    q.texto('Música feita com IA (Suno) · vídeo de eleitor', 320, 1774, DM(26, 'Bold'), '#FFFFFF')

if __name__ == '__main__':
    import json
    sai = f'{AQ}/quadros/reel'; V = Video(W, H, dur=60, saida=sai)
    qs = [int(float(x) * 30) for x in sys.argv[1].split(',')] if len(sys.argv) > 1 else None
    V.render(__file__, quadros=qs, procs=8)
    if not qs:
        V.montar(f'{AQ}/audio/reel-sem-audio.mp4')
