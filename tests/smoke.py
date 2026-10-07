# Smoke: conta certa, animação, card do story, e ZERO requisição para fora do próprio site.
import sys, http.server, threading, functools, os
from playwright.sync_api import sync_playwright
out = sys.argv[1] if len(sys.argv) > 1 else '/tmp'
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory='docs')
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), H); threading.Thread(target=srv.serve_forever, daemon=True).start(); BASE=f'http://127.0.0.1:{srv.server_address[1]}'
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 390, 'height': 844}, device_scale_factor=2, accept_downloads=True)
    externos = []; pg.on('request', lambda r: None if r.url.startswith((BASE, 'data:', 'blob:')) else externos.append(r.url))
    pg.goto(BASE+'/'); pg.wait_for_timeout(500); pg.screenshot(path=f'{out}/01-entrada.png')
    # conta pura: 30 anos exatos hoje, aposentadoria 65 -> 35 anos x 52 = 1820
    r = pg.evaluate("calcula(new Date(1996,9,7),65,new Date(2026,9,7))"); assert r['dias'] == 1820 and r['fds'] == 910, r
    assert 'erro' in pg.evaluate("calcula(new Date(1950,0,1),65)")
    assert 'erro' in pg.evaluate("calcula(new Date(2020,0,1),65)")
    pg.click('#b61'); assert 'nascimento' in pg.inner_text('#err')
    pg.fill('#nasc', '1996-10-07'); pg.click('#b61'); pg.wait_for_timeout(1400); pg.screenshot(path=f'{out}/02-transicao.png')
    pg.wait_for_timeout(3000); n = pg.inner_text('#n'); assert n in ('1.820', '1.819', '1.821'), n
    pg.screenshot(path=f'{out}/03-resultado.png', full_page=True)
    with pg.expect_download() as d: pg.click('#story')
    d.value.save_as(f'{out}/04-story.png')
    assert not externos, externos
    print('OK contador', n, '| externos:', len(externos))
    b.close()
srv.shutdown()
