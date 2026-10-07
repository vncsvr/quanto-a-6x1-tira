# Smoke: conta certa, toggle liga/desliga, card do story, e ZERO requisição para fora do próprio site.
# Uso: python3 tests/smoke.py <pasta-saida>   (grava também toggle.webm na pasta)
import sys, os
from servidor import sobe
from playwright.sync_api import sync_playwright
out = sys.argv[1] if len(sys.argv) > 1 else '/tmp'
srv, URL = sobe(); BASE = URL.split('/quanto')[0]
num = lambda pg: pg.evaluate("document.getElementById('n').getAttribute('aria-label')")
with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, accept_downloads=True,
                        record_video_dir=out, record_video_size={'width': 780, 'height': 1688})
    pg = ctx.new_page(); externos = []; erros = []
    pg.on('request', lambda r: None if r.url.startswith((BASE, 'data:', 'blob:')) else externos.append(r.url))
    pg.on('pageerror', lambda e: erros.append(str(e)))
    pg.goto(URL); pg.wait_for_timeout(800); pg.screenshot(path=f'{out}/01-entrada.png')
    r = pg.evaluate("calcula(new Date(1996,9,7),65,new Date(2026,9,7))"); assert r['dias'] == 1820 and r['fds'] == 910, r
    assert 'erro' in pg.evaluate("calcula(new Date(1950,0,1),65)") and 'erro' in pg.evaluate("calcula(new Date(2020,0,1),65)")
    pg.click('#tg'); assert 'coloque sua data' in pg.inner_text('#delta'); pg.wait_for_timeout(600); pg.click('#tg')  # sem data: só a cor
    pg.fill('#nasc', ''); pg.type('#nasc', '07101996'); pg.wait_for_timeout(1800)
    assert num(pg) == '3.640', num(pg)
    pg.screenshot(path=f'{out}/02-desligado.png')
    for _ in range(2):  # vai e volta para o vídeo
        pg.click('#tg'); pg.wait_for_timeout(2600); pg.click('#tg'); pg.wait_for_timeout(2200)
    pg.click('#tg'); pg.wait_for_timeout(2800)
    assert num(pg) == '1.820', num(pg)
    assert pg.get_attribute('#tg', 'aria-checked') == 'true' and 'gray' in pg.evaluate('document.body.className')
    pg.screenshot(path=f'{out}/03-ligado.png'); pg.screenshot(path=f'{out}/04-resultado.png', full_page=True)
    with pg.expect_download() as d: pg.click('#story')
    d.value.save_as(f'{out}/05-story.png')
    pg.evaluate('scrollTo(0,0)'); pg.click('#tg'); pg.wait_for_timeout(2000); assert 'gray' not in pg.evaluate('document.body.className')
    assert not externos, externos
    assert not erros, erros
    v = pg.video.path(); ctx.close(); os.replace(v, f'{out}/toggle.webm'); b.close()
    print('OK | ligado 1.820 · desligado 3.640 · externos:', len(externos), '· erros JS:', len(erros))
srv.shutdown()
