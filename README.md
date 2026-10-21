# Método Acordes Exclusivos — app de violão

Web app (celular e computador) para aprender violão tocando hinos e louvores: os acordes descem
pela tela até a linha de execução, no ritmo, com diagrama da mão, letra, metrônomo e "violão guia".
Inclui afinador pelo microfone, treino de troca de acordes, dicionário de acordes, o Método Acordes
Exclusivos por tom e login com Supabase.

## O que funciona hoje

| Área | Estado |
|---|---|
| Login, cadastro, recuperar senha (Supabase Auth) | Pronto. Precisa do SQL e das URLs abaixo |
| Tocar (modo jogo e prática guiada) | Pronto: play/pausa, voltar/avançar linha, repetir trecho, velocidade, reinício, contagem 4-3-2-1 |
| Aprender passo a passo | Pronto: cada acorde, cada troca, link para o treino |
| Treino de troca de acordes | Pronto |
| Afinador (pitchy, MIT) | Pronto. Exige https e permissão de microfone |
| Dicionário de acordes | Pronto (formas padrão + formas do Método) |
| Método: Tom de Dó (grátis) | Transcrito completo (6 graus + 2 sequências) |
| Método: outros tons (pago) | Sequências dos 6 tons transcritas; graus pendentes. Lidos do Supabase (`premium_content`). A fonte fica fora do repositório público |
| Favoritos, progresso, histórico | Pronto (tabelas no Supabase) |
| Ofertas + painel admin | Pronto: botão abre o WhatsApp do fluxo "Acordes"; admin libera o acesso em `/admin` |

**Sincronia:** os PDFs não têm áudio nem tempo das trocas. As músicas seguem o **metrônomo**, e a
posição de cada troca é **estimada** pela cifra (`sync: 'estimated'`). A arquitetura aceita áudio
gravado (`sync: 'synced'`, campo `audio`), mas nenhuma música tem áudio ainda.

**Pontuação:** não há pontuação por acerto, porque o app ainda não ouve o violão. Ao final, ele mostra
a velocidade alcançada.

## Colocar no ar

### 1. Supabase (uma vez)
1. Dashboard → **SQL Editor** → cole `supabase/schema.sql` → **Run**.
2. Rode também `supabase/seed_premium.sql` (conteúdo pago do Método). Gere de novo com
   `npm run seed:premium` sempre que mudar `content-premium/`.
3. **Authentication → URL Configuration**:
   - Site URL: o endereço do app (ex.: `https://seu-app.netlify.app`)
   - Redirect URLs: `https://seu-app.netlify.app/**`
4. Crie sua conta no app e rode no SQL Editor (com seu e-mail):
   `update public.profiles set is_admin = true where email = 'seu-email';`

A confirmação de e-mail vem ligada por padrão. Para liberar o cadastro sem confirmação:
Authentication → Sign In / Providers → Email → desligue "Confirm email".

### 2. Netlify
- New site → Import from GitHub → este repositório. Build: `npm run build`, publish: `dist`
  (já está no `netlify.toml`).
- As variáveis já estão no arquivo `.env` do repositório (URL do Supabase, chave **publishable**,
  que é pública por design, e o número de WhatsApp). Para trocar algo, edite o `.env` ou defina
  a variável no Netlify (Site settings → Environment variables), que tem prioridade.
  **Nunca** coloque a chave service_role no app.

### 3. Venda
O cliente toca em "Quero liberar", e o WhatsApp abre com a mensagem e o e-mail do app. O fluxo
"Acordes" no Leona faz o Pix. Depois do comprovante, abra `/admin`, busque o e-mail e toque no
produto. O acesso é verificado no banco (RLS): o conteúdo pago não está no código do app.

## Desenvolvimento

```bash
npm install
cp .env.example .env.local
npm run dev        # http://localhost:5173
npm test           # testes do motor musical, cifras, acordes
npm run build
```

### Adicionar uma música
Crie um `defineSong(...)` em `src/content/songs/` com a cifra no formato "acorde em cima, letra
embaixo", seções entre colchetes (`[Refrão]`) e, se quiser, `arrangement` para a ordem de execução.
Linhas só de acordes viram compassos instrumentais (`C G Am F {4}` = 4 compassos). Os testes
garantem que todo acorde da música tem diagrama.

### Estrutura
```
src/music/      tipos, leitura de cifra, linha do tempo, teoria, banco de acordes
src/engine/     relógio musical (AudioContext), metrônomo, violão sintetizado, usePlayer
src/components/ Player, Highway (canvas), ChordDiagram (SVG)
src/content/    músicas e Método (Tom de Dó)
content-premium/ tons pagos do Método → supabase/seed_premium.sql
supabase/       schema.sql (tabelas + RLS)
```
