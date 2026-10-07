# Quanto a 6x1 tira da sua vida?

Calculadora estática: data de nascimento + idade de aposentadoria → dias livres a menos na escala 6x1 em relação à 5x2 (52 por ano). A conta roda no navegador; sem cookies, sem analytics, sem requisição externa (fontes servidas localmente).

- Código: Next.js (App Router, export estático) + Tailwind + shadcn/ui + Motion. `npm install && npm run build` gera o export e copia para `docs/` (mantém `og.png` e `.nojekyll`).
- Site: `docs/` (GitHub Pages, servido em `/quanto-a-6x1-tira/`)
- Teste: `python3 tests/smoke.py <pasta>` — conta (30 anos, aposentadoria 65 → 1.820 dias), fluxo, card do story e zero requisição externa.
- Prévia de link: `python3 tests/og.py`

Projeto pessoal de eleitor voluntário (2º turno 2026). Nada de conta, hospedagem ou serviço de empresa.
