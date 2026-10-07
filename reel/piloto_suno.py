# Piloto do jingle (SÓ PARA OUVIR, não publicar): Suno do estúdio, autorizado para piloto. O publicado sai da conta pessoal do Vini.
import sys, json, time; sys.path.insert(0, '/root/.claude/skills/motion/producao')
from suno import Suno, B; from rede import req, baixar
s = Suno(item='4our5zeyc3flp6wxnqyllno6je', vault='Studio Mosaiko'); antes = s.saldo()
corpo = {'customMode': True, 'instrumental': False, 'model': 'V5', 'title': 'A Seis por Um (piloto)',
 'prompt': open('letra.txt').read(),
 'style': 'Brazilian forró pé-de-serra meets carnival marchinha, comedic jingle, accordion (sanfona) lead riffs, zabumba, triangle, cheerful brass stabs, festive crowd chorus answering "ai ai ai", bright male Brazilian Portuguese lead vocal with playful comic delivery, 130 BPM, catchy hook, radio jingle energy, clear diction',
 'negativeTags': 'sad, slow, ballad, english lyrics, rap, trap, sertanejo romântico, autotune heavy, dark',
 'callBackUrl': 'https://example.com/suno-callback'}
st, r = req('POST', f'{B}/generate', corpo, s.cab); tid = (r.get('data') or {}).get('taskId'); print('task', tid, r if not tid else '')
for _ in range(60):
    time.sleep(10); d = req('GET', f'{B}/generate/record-info?taskId={tid}', cab=s.cab)[1].get('data') or {}
    if d.get('status') in ('SUCCESS', 'CREATE_TASK_FAILED', 'GENERATE_AUDIO_FAILED', 'SENSITIVE_WORD_ERROR'): break
for i, f in enumerate(((d.get('response') or {}).get('sunoData') or [])[:2]):
    baixar(f['audioUrl'], f'audio/piloto-{i+1}.mp3'); print(f'audio/piloto-{i+1}.mp3', f.get('duration'))
depois = s.saldo(); json.dump({'task': tid, 'status': d.get('status'), 'antes': antes, 'depois': depois, 'data': '2026-10-07', 'uso': 'piloto interno, não publicar'}, open('audio/piloto-creditos.json', 'w'), indent=1)
print(d.get('status'), antes, '->', depois)
