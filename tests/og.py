# Gera docs/og.png (1200x630) reaproveitando a cena do app.
import http.server, threading, functools, base64
from playwright.sync_api import sync_playwright
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(http.server.SimpleHTTPRequestHandler, directory='docs'))
threading.Thread(target=srv.serve_forever, daemon=True).start()
with sync_playwright() as p:
    pg = p.chromium.launch().new_page(); pg.goto(f'http://127.0.0.1:{srv.server_address[1]}/')
    data = pg.evaluate("""async()=>{await document.fonts.ready;const c=document.createElement('canvas');c.width=1200;c.height=630;const g=c.getContext('2d');
      g.save();g.translate(600,0);g.scale(600/1080,630/960);cena(g,0,false);g.restore();
      g.save();g.scale(600/1080,630/960);cena(g,0,true);g.restore();
      g.fillStyle='rgba(255,255,255,.95)';g.beginPath();g.roundRect(40,28,1120,180,32);g.fill();
      g.fillStyle='#1B1B3A';g.font="800 66px 'Bricolage Grotesque'";g.fillText('Quanto a 6x1 tira da sua vida?',80,112);
      g.font="500 30px 'DM Sans'";g.fillStyle='#4A4A63';g.fillText('Faça a conta em 10 segundos. Nada é enviado.',82,168);
      return c.toDataURL('image/png')}""")
    open('docs/og.png', 'wb').write(base64.b64decode(data.split(',')[1]))
srv.shutdown(); print('og ok')
