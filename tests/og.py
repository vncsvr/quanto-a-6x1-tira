# Gera docs/og.png (1200x630) reaproveitando a cena do app.
import base64
from servidor import sobe
from playwright.sync_api import sync_playwright
srv, URL = sobe()
with sync_playwright() as p:
    pg = p.chromium.launch().new_page(); pg.goto(URL); pg.wait_for_function('!!window.bloco')
    data = pg.evaluate("""async()=>{await document.fonts.ready;const c=document.createElement('canvas');c.width=1200;c.height=630;const g=c.getContext('2d');
      g.save();g.translate(600,0);g.scale(600/1080,630/960);cena(g,0,false);g.restore();
      g.save();g.scale(600/1080,630/960);cena(g,0,true);g.restore();
      await document.fonts.load(display(60)); await document.fonts.load('600 30px Montserrat');
      bloco(g,600,92,1080,120,-2,'#fd0000','#a20301',10,g=>{g.fillStyle='#fff';let t=96;g.font=display(t);while(g.measureText('QUANTO A 6X1 TIRA DA SUA VIDA?').width>1000)g.font=display(--t);g.textAlign='center';g.fillText('QUANTO A 6X1 TIRA DA SUA VIDA?',0,t*.36)});
      bloco(g,560,194,860,62,1.5,'#ffffff','#320d59',8,g=>{g.fillStyle='#320d59';g.font='700 30px Montserrat';g.textAlign='center';g.fillText('Faça a conta em 10 segundos. Nada é enviado.',0,11)});
      return c.toDataURL('image/png')}""")
    open('docs/og.png', 'wb').write(base64.b64decode(data.split(',')[1]))
srv.shutdown(); print('og ok')
