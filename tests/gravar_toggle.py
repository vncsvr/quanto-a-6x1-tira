# Grava o vai e volta do toggle em 780x1688 (screencast do Chrome em 2x) -> MP4 30 fps.
# Uso: python3 tests/gravar_toggle.py <saida.mp4> [reel]   (reel: liga, rola até os cartões, volta e desliga)
import sys, base64, os, subprocess, tempfile
from servidor import sobe
from playwright.sync_api import sync_playwright
saida = sys.argv[1]
srv, URL = sobe()
tmp = tempfile.mkdtemp(); quadros = []
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=2)
    pg.goto(URL); pg.wait_for_timeout(600)
    pg.fill('#nasc', '1996-10-07'); pg.dispatch_event('#nasc', 'change'); pg.wait_for_timeout(1600)
    cdp = pg.context.new_cdp_session(pg)
    def chega(e):
        quadros.append((e['metadata']['timestamp'], base64.b64decode(e['data'])))
        cdp.send('Page.screencastFrameAck', {'sessionId': e['sessionId']})
    cdp.on('Page.screencastFrame', chega)
    cdp.send('Page.startScreencast', {'format': 'jpeg', 'quality': 90, 'maxWidth': 780, 'maxHeight': 1688})
    pg.wait_for_timeout(1200)
    if len(sys.argv) > 2 and sys.argv[2] == 'reel':
        pg.click('#tg'); pg.wait_for_timeout(2600)
        alvo = pg.evaluate("document.getElementById('perde').getBoundingClientRect().top + scrollY - 60")
        for k in range(1, 46): pg.evaluate(f"scrollTo(0, {alvo} * (1 - Math.pow(1 - {k}/45, 3)))"); pg.wait_for_timeout(33)
        pg.wait_for_timeout(3200)
        for k in range(1, 31): pg.evaluate(f"scrollTo(0, {alvo} * (1 - {k}/30))"); pg.wait_for_timeout(33)
        pg.wait_for_timeout(500); pg.click('#tg'); pg.wait_for_timeout(2600); pg.click('#tg'); pg.wait_for_timeout(2400)
    else:
        for _ in range(3):
            pg.click('#tg'); pg.wait_for_timeout(3000); pg.click('#tg'); pg.wait_for_timeout(2600)
    cdp.send('Page.stopScreencast'); b.close()
srv.shutdown()
# o screencast só manda quadro quando a tela muda: repete o último até o próximo carimbo (30 fps constantes)
t0 = quadros[0][0]; n = 0
for i, (t, img) in enumerate(quadros):
    fim = quadros[i + 1][0] if i + 1 < len(quadros) else t + 0.5
    while t0 + n / 30 < fim:
        open(f'{tmp}/{n:05d}.jpg', 'wb').write(img); n += 1
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-framerate', '30', '-i', f'{tmp}/%05d.jpg', '-vf', 'scale=780:1688,format=yuv420p',
                '-c:v', 'libx264', '-crf', '20', '-movflags', '+faststart', saida], check=True)
print(saida, n, 'quadros', round(n / 30, 1), 's')
