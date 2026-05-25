# Recomeço em Movimento — versão Vercel (estrutura simplificada)

Esta versão tem só UMA pasta (`api`), pra não dar erro de estrutura no upload.

## Estrutura (é só isto)
```
/
├─ index.html      ← o app inteiro (visual + telas), já com tudo embutido
├─ package.json
└─ api/            ← o backend (login e dados)
   ├─ register.js
   ├─ login.js
   ├─ me.js
   └─ data.js
```
Ao abrir no GitHub você DEVE ver: `index.html`, `package.json` e a pasta `api`.
Se aparecerem `data.js`, `login.js` etc. soltos (sem a pasta `api`), está errado.

## Subir no GitHub (jeito mais à prova de erro: GitHub Desktop)
1. Instale o GitHub Desktop: https://desktop.github.com (login com sua conta).
2. File → Add local repository → selecione ESTA pasta (a que tem `index.html` e `api`).
3. Ele oferece "create a repository" → clique → Create repository.
4. Clique em "Publish repository". Pronto: sobe com a pasta `api` intacta.

## Publicar no Vercel
1. vercel.com → Add New → Project → importe o repositório.
2. Framework Preset: **Other**. Root Directory: **deixe vazio**. Não ligue Override.
3. Crie o banco: aba **Storage** → Create Database → **Upstash (Redis)** → conecta.
   (isso adiciona UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN sozinho)
4. Settings → Environment Variables → adicione **JWT_SECRET** = uma frase longa qualquer.
5. Deployments → Redeploy (pra pegar as variáveis).
6. Abra o link .vercel.app → Criar agora → use!

## Importante
- Rode os comandos/seleção SEMPRE nesta pasta (a que tem `index.html` e `api`),
  nunca na pasta antiga "fullstack".
- Sem as 3 variáveis (JWT_SECRET + as 2 do Upstash) o login dá erro: confira e Redeploy.

Conteúdo educativo. Não substitui acompanhamento médico, nutricional, físico,
psicológico ou financeiro. Resultados variam de pessoa para pessoa.
