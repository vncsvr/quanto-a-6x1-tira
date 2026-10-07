# Serve docs/ em /quanto-a-6x1-tira/ (o basePath do export), como no GitHub Pages. Devolve (srv, URL da página).
# Build da Vercel (raiz): PASTA=out BASE= python3 tests/smoke.py
import http.server, threading, functools, os, tempfile
BASE = os.environ.get('BASE', 'quanto-a-6x1-tira'); PASTA = os.environ.get('PASTA', 'docs')
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
def sobe():
    raiz = tempfile.mkdtemp()
    if BASE: os.symlink(os.path.abspath(PASTA), os.path.join(raiz, BASE))
    else: raiz = os.path.abspath(PASTA)
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Q, directory=raiz))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv, f'http://127.0.0.1:{srv.server_address[1]}/{BASE + "/" if BASE else ""}'
