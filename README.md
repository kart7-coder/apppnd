# Método Acordes Exclusivos — app de violão

Web app (celular e computador) para aprender violão tocando hinos e louvores: os acordes descem
pela tela até a linha de execução, no ritmo, com diagrama da mão, letra, metrônomo e "violão guia".
Inclui afinador pelo microfone, treino de troca de acordes, dicionário de acordes, o Método Acordes
Exclusivos por tom e login com Supabase.

## O que funciona hoje

Todo o conteúdo é gratuito para quem tem conta.

| Área | Estado |
|---|---|
| Login, cadastro, recuperar senha (Supabase Auth) | Pronto. Precisa do `supabase/schema.sql` e das URLs abaixo |
| Tocar (tocar junto e treinar devagar) | Pronto: play/pausa, voltar/avançar linha, repetir parte, velocidade, reinício, contagem 4-3-2-1 |
| Aprender do zero | Pronto: cada acorde, cada troca, legenda do desenho e link para o treino |
| Treino de troca de acordes | Pronto |
| Afinador (pitchy, MIT) | Pronto. Exige https e permissão de microfone |
| Dicionário de acordes | Pronto (formas padrão + formas do Método) |
| Músicas | 10 hinos da Harpa (A·D·E) + 20 louvores/corinhos de "cifras 1.pdf" |
| Método Acordes Exclusivos | 7 tons: Tom de Dó completo; nos outros 6, as sequências prontas (acordes do tom ainda pendentes) |
| Favoritos, progresso, histórico | Pronto (tabelas no Supabase) |

**Sincronia:** os PDFs não têm áudio nem tempo das trocas. As músicas seguem o **metrônomo**, e a
posição de cada troca é **estimada** pela cifra (`sync: 'estimated'`). A arquitetura aceita áudio
gravado (`sync: 'synced'`, campo `audio`), mas nenhuma música tem áudio ainda.

**Pontuação:** não há pontuação por acerto, porque o app ainda não ouve o violão. Ao final, ele mostra
a velocidade alcançada.

## Colocar no ar

### 1. Supabase (uma vez)
1. Dashboard → **SQL Editor** → cole `supabase/schema.sql` → **Run**.
2. **Authentication → URL Configuration**:
   - Site URL: o endereço do app (ex.: `https://seu-app.netlify.app`)
   - Redirect URLs: `https://seu-app.netlify.app/**`

A confirmação de e-mail vem ligada por padrão. Para liberar o cadastro sem confirmação:
Authentication → Sign In / Providers → Email → desligue "Confirm email".

### 2. Netlify
- New site → Import from GitHub → este repositório. Build: `npm run build`, publish: `dist`
  (já está no `netlify.toml`).
- As variáveis já estão no arquivo `.env` do repositório (URL do Supabase, chave **publishable**,
  que é pública por design, e o número de WhatsApp). Para trocar algo, edite o `.env` ou defina
  a variável no Netlify (Site settings → Environment variables), que tem prioridade.
  **Nunca** coloque a chave service_role no app.

### Publicar arrastando (Netlify Drop)
`npm run build` e arraste a pasta `dist` (ou um zip do conteúdo dela) em app.netlify.com/drop.
O arquivo `public/_redirects` garante que as páginas internas funcionem ao recarregar.

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
src/content/    músicas e Método (7 tons)
supabase/       schema.sql (tabelas + RLS)
```

## Créditos (código aberto)
- Afinador: [pitchy](https://github.com/ianprime0509/pitchy) (MIT)
