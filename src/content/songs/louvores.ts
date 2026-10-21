// Louvores transcritos do PDF "cifras 1.pdf" (Cifras Gospel para Iniciante).
// Andamento e compassos são ESTIMADOS (o material não traz áudio nem andamento).
import { defineSong } from '../defineSong'
import type { Song } from '../../music/types'

const FILE = 'cifras 1.pdf'
const base = { category: 'louvor' as const, sync: 'estimated' as const, beatsPerBar: 4, barsPerLine: 2 }

export const LOUVOR_SONGS: Song[] = [
  defineSong(
    {
      ...base,
      id: 'grande-e-o-senhor',
      title: 'Grande é o Senhor',
      artist: 'Adhemar de Campos',
      difficulty: 2,
      key: 'A',
      bpm: 96,
      source: { file: FILE, page: 7 },
      arrangement: ['Intro', 'Primeira Parte', 'Refrão', 'Intro', 'Refrão', 'Refrão'],
    },
    `
[Intro]
A9 D9 E A9

[Primeira Parte]
 A9            D9
Grande é o Senhor
         E            A9
E muito digno de louvor
     D9               E
Na cidade do nosso Deus
           F#m7
Seu Santo Monte
A9               Bm7 C#m7 D9 E
Alegria de toda terra
 A9            D9
Grande é o Senhor
               E     A9
Em quem nós temos a vitória
      D9
E que nos ajuda
           F#m7
Contra o inimigo
    A9
Por isso diante Dele
         Bm7 C#m7 D9 E
Nos prostramo-os

[Refrão]
    A9
Queremos o teu
                C#m7
Nome engrandecer
D9           A
E agradecer-te
        Bm7              E
Por tua obra em nossas vidas
     A9                     C#m7
Confiamos em teu infinito amor
     D9          A9
Pois só tu és o Deus eterno
Bm7          E      A9
Sobre toda terra e céu
`,
  ),

  defineSong(
    {
      ...base,
      id: 'vim-para-adorar-te',
      title: 'Vim para Adorar-te',
      artist: 'Adoração e Adoradores',
      difficulty: 2,
      key: 'E',
      bpm: 72,
      source: { file: FILE, page: 8 },
      arrangement: ['Intro', 'Primeira Parte', 'Refrão', 'Segunda Parte', 'Refrão', 'Final'],
    },
    `
[Intro]
E9 A9 C#m7 {4}
E9 A9

[Primeira Parte]
 E
Luz do mundo
   A9
Viestes à terra
 E                    A9
Pra que eu pudesse te ver
 E
Tua beleza me
A9
Leva a adorar-te
 E9              A9
Quero contigo viver

[Refrão]
              E
Vim para adorar-te
               B7
Vim para prostrar-me
            E             A9
Vim para dizer que és meu Deus
                E
És totalmente amável
           B7
Totalmente digno
           E           A9
Tão maravilhoso para mim

[Segunda Parte]
E      B7
Eterno rei
   F#m7       A9
Exaltado nas alturas
  E B7     A9
Glorioso nos céus
     E     B7
Humilde vieste
   F#m7       A9
À terra que criaste
 E        B7
Por amor pobre
  A9
Se fez

[Final]
   B7           A9
Eu nunca saberei o preço
      B7             F#m7
Dos meus pecados lá na cruz
`,
  ),

  defineSong(
    {
      ...base,
      id: 'yeshua',
      title: 'Yeshua',
      artist: 'Comunidade Católica Colo de Deus',
      difficulty: 1,
      key: 'Am',
      bpm: 70,
      source: { file: FILE, page: 37 },
      reviewNotes: ['No material: "Tom: Am (Tom original: G#m)".'],
      arrangement: ['Intro', 'Primeira Parte', 'Refrão', 'Intro', 'Primeira Parte', 'Refrão'],
    },
    `
[Intro]
Am7 F9 C Em
Am7 F9 C Em

[Primeira Parte]
   Am7
Te chamam de deus e de senhor
   F9
Te chamam de rei, de salvador
   C                                 Em
E eu me atrevo a te chamar de meu amor
   Am7
Te chamam de deus e de senhor
   F9
Te chamam de rei, de salvador
  C                                 Em
E eu me atrevo a te chamar de meu amor

[Refrão]
 Am7    F9
Yeshua, Yeshua
    C    Em
Tu és tão lindo
                    Am7
Que eu nem sei me expressar
 F9        C      Em
Yeshua, Tu és tão lindo
`,
  ),

  defineSong(
    {
      ...base,
      category: 'corinho',
      id: 'deus-esta-aqui',
      title: 'Deus Está Aqui',
      artist: 'Corinhos Evangélicos',
      difficulty: 1,
      key: 'G',
      bpm: 110,
      source: { file: FILE, page: 38 },
      reviewNotes: ['No material: "Tom: C", mas a cifra está em Sol (G). Revisar.'],
      arrangement: ['Intro', 'Corinho', 'Corinho'],
    },
    `
[Intro]
C G Am

[Corinho]
G       D Em
Deus, está aqui, aleluia
     C9                   D   G
Tão certo como o ar que eu respiro
    C9                  D          G Em
Tão certo como o amanhã que se levanta
   Am                  D                G D
Tão certo como eu te falo e podes me ouvir
`,
  ),

  defineSong(
    {
      ...base,
      id: 'galileu',
      title: 'Galileu',
      artist: 'Fernandinho',
      difficulty: 2,
      key: 'C',
      bpm: 68,
      source: { file: FILE, page: 50 },
      reviewNotes: ['No material: "Tom: C (Tom original: C#)".'],
      arrangement: ['Intro', 'Primeira Parte', 'Segunda Parte', 'Pré-Refrão', 'Refrão', 'Intro', 'Segunda Parte', 'Pré-Refrão', 'Refrão', 'Interlúdio', 'Refrão'],
    },
    `
[Intro]
C Am F7M Am F7M

[Primeira Parte]
C
  Deixou sua glória
Foi por amor, foi por amor
Am        F7M           Am
  E o seu sangue, derramou
             F7M
Que grande amor

[Segunda Parte]
Dm7       F7M     C
  Naquela via dolorosa
         G
Se entregou
Dm7        F7M
  Eu não mereço
          C             G
Mas sua graça me alcançou
     Dm7            F7M
Eu me rendo ao seu amor
       C             G
Eu me rendo ao seu amor
     Dm7            F7M
Eu me rendo ao seu amor
      Am
Eu me rendo
       G
Eu me rendo

[Pré-Refrão]
Am
Deus Emanuel
 F7M
Estrela da Manhã
 C
Cordeiro de Deus
 G
Pão da Vida
 Am
Príncipe da Paz
   F7M
O grande El Shaddai
 C
Santo de Israel
 G
Luz do Mundo

[Refrão]
Dm7 F7M  C      G
Galileu, Jesus, Jesus
Dm7 F7M  C      G
Galileu, Jesus, Jesus
Dm7 F7M  C      G
Galileu, Jesus, Jesus
Dm7 F7M  C      G
Galileu, Jesus, Jesus

[Interlúdio]
F7M
  Oh, oh, oh, oh
G
  Oh, oh, oh, oh
Am               C
   Oh, oh, oh, oh
F7M G Am C
`,
  ),
  defineSong(
    {
      ...base,
      id: 'nada-alem-do-sangue',
      title: 'Nada Além do Sangue',
      artist: 'Fernandinho',
      difficulty: 1,
      key: 'C',
      bpm: 72,
      source: { file: FILE, page: 54 },
      arrangement: ['Intro', 'Verso 1', 'Verso 2', 'Refrão', 'Ponte', 'Verso 2', 'Refrão', 'Verso 3', 'Verso 4', 'Verso 3'],
    },
    `
[Intro]
C Am C Am

[Verso 1]
     C                 Am
Teu sangue leva-me além
              C                     Am
A todas as alturas onde ouço a tua voz
                G
Fala de tua justiça
             F7M                     C     Am G
Pela minha vida Jesus, este é o teu sangue

[Verso 2]
     C              Am
Tua cruz mostra tua graça
                C                    Am
Fala do amor do pai que prepara para nós
                  G
Um caminho para ele
                     F7M              C  Am G
Onde posso me achegar somente pelo sangue

[Refrão]
C
Que nos lava dos pecados,
Am
Que nos traz restauração,
G
Nada além do sangue,
F7M                       C  G F7M
Nada além do sangue de Jesus
  C
O que nos faz brancos como a neve,
Am
Aceitos como amigos de Deus,
G
Nada além do sangue,
F7M                     C   G F7M
Nada além do sangue de Jesus

[Ponte]
C G F7M

[Verso 3]
C             Am
Eu sou livre, Eu sou livre...
G
Nada além do sangue,
F7M                           C G F7M
Nada além do sangue de Jesus

[Verso 4]
C               G F7M G               Am
Alvo mais que a neve, Alvo mais que a neve
C                 F7M         G                  C
Sim neste sangue lavado, mais alvo que a neve serei
`,
  ),

  defineSong(
    {
      ...base,
      id: 'quero-conhecer-jesus',
      title: 'Quero Conhecer Jesus (Yeshua)',
      artist: 'Gabriel Guedes',
      difficulty: 1,
      key: 'G',
      bpm: 70,
      source: { file: FILE, page: 61 },
      arrangement: ['Estrofe', 'Estrofe', 'Yeshua', 'Ponte', 'Yeshua'],
    },
    `
[Estrofe]
           C                   D
O meu orgulho me tirou do jardim
          Em                       D
Tua humildade colocou o jardim em mim
             C                         D
E se eu vendesse tudo o que tenho em troca do amor
       Em D
Eu falharia
         C                  D
Pois o amor não se compra, nem se merece
     Em               D
O amor se ganha, de graça o recebe
      C              D
Eu quero conhecer Jesus
    Em               D
Eu quero conhecer Jesus
      C              D
Eu quero conhecer Jesus
         Em C     D
E ser achado nele

[Yeshua]
     C Em G D
Yeshua
     C Em G D
Yeshua
     C Em G D
Yeshua

[Ponte]
         C           Em
O meu amado é o mais belo
      G              D
Entre milhares e milhares
`,
  ),

  defineSong(
    {
      ...base,
      id: 'deus-provera',
      title: 'Deus Proverá',
      artist: 'Gabriela Gomes',
      difficulty: 1,
      key: 'Em',
      bpm: 76,
      source: { file: FILE, page: 62 },
      reviewNotes: ['No material: "Tom: Em (Tom original: Dm)".'],
      arrangement: ['Intro', 'Estrofe 1', 'Estrofe 2', 'Refrão', 'Ponte', 'Deus proverá', 'Refrão'],
    },
    `
[Intro]
           Em C             G D
Oh, oh, oh     Oh, oh, oh

[Estrofe 1]
Em                  C                     G
   Posso até estar aflito mas nunca derrotado
                  D
Eu posso até chorar
                 Em
Eu posso até sofrer
             C
Mas o amanhã vira
              G            D
E minha fé será recompensada
                   C          Em
E o meu Deus não falha não

[Estrofe 2]
                     C
Eu posso até estar ferido
                   G
Mas nunca destruído
                  D               Em
Eu posso ser provado para ser aprovado
             C
Mas o amanhã vira
             G            D
E minha fé será recompensada
                    C
E o meu Deus não falha não

[Refrão]
                     C
Não vivo pela vista não
                   G
Eu vivo pela fé então
               D
Deus proverá
              Em
Deus proverá
                     C
Olho para o alto então
                 G
Vem o socorro sim
               D
Deus proverá
               Em C G D
Deus proverá

[Ponte]
Am Em G D

[Deus proverá]
         Am
Deus proverá
                               Em
Quando o azeite e a farinha faltar
                       G
E a minha força se esgotar
              D
Deus proverá
             Am
Deus proverá
                          Em
Mesmo o cego me faz enxergar
                      G           D
Mesmo falho me faz andar sobre as águas
`,
  ),

  defineSong(
    {
      ...base,
      id: 'atos-2',
      title: 'Atos 2',
      artist: 'Gabriela Rocha',
      difficulty: 2,
      key: 'G',
      bpm: 72,
      source: { file: FILE, page: 64 },
      arrangement: ['Intro', 'Primeira Parte', 'Solo', 'Primeira Parte', 'Refrão', 'Refrão', 'Interlúdio', 'Segunda Parte', 'Segunda Parte', 'Segunda Parte', 'Refrão', 'Refrão', 'Final'],
    },
    `
[Intro]
Em7 C9 G Bm7
Em7 C9 G Bm7

[Primeira Parte]
     Em7                 C9
Nós estamos aqui tão sedentos de ti
         G            Bm7
Vem oh Deus, vem oh Deus
      Em7
Enche este lugar
       C9                   G        Bm7
Meu desejo é sentir teu poder, teu poder

[Solo]
Em7 C9 G Bm7

[Refrão]
       C9           Em7
Então vem me incendiar
            G          D9
Meu coração é o teu altar
          C9          Em7
Quero ouvir o som do céu
     G           D9
Tua glória contemplar

[Interlúdio]
C9 Em7 G C9 D9

[Segunda Parte]
          C9
Te damos honra
         Em7
Te damos glória
           G
Teu é o poder
              D9
Pra sempre, amém

[Final]
C9 {2}
`,
  ),
  defineSong(
    {
      ...base,
      id: 'pra-sempre',
      title: 'Pra Sempre',
      artist: 'Fernandinho',
      difficulty: 1,
      key: 'C',
      bpm: 76,
      source: { file: FILE, page: 58 },
      arrangement: ['Intro', 'Verso 1', 'Verso 2', 'Verso 3', 'Refrão', 'Verso 3', 'Refrão', 'Solo', 'Verso 4', 'Refrão'],
    },
    `
[Intro]
C G Am F7M

[Verso 1]
C            G                  Am
  O universo chora, o sol se apagou
           F7M
Ali estava morto o salvador
C                 G                     Am
  Seu corpo lá na cruz, seu sangue derramou
             F7M          C     G     Dm F7M
O peso do pecado, ele levou, levou, levou

[Verso 2]
C                   G                   Am
  Deus pai o abandonou, cessou seu respirar
                    F7M
Em trevas se encontrou o filho
C               G                  Am
  A guerra começou, a morte enfrentou
                  F7M
Todo o poder das trevas, vencido foi

[Verso 3]
C                 G                 Am
  A terra estremeceu, sepulcro se abriu
               F7M
E nada vencerá, seu grande amor
C                  G                Am
  A morte onde estás, o rei ressuscitou
                 F7M
Ele venceu pra sempre!

[Refrão]
     C         G
Pra sempre exaltado é
     Am        F7M
Pra sempre adorado é
     C         G              Am            F7M
Pra sempre ele vive, ressuscitou, ressuscitou
     C         G              Am            F7M
Pra sempre ele vive, ressuscitou, ressuscitou

[Solo]
C G Am F7M
C G Am F7M

[Verso 4]
C             G                 Am
  Cantamos aleluia! Cantamos aleluia!
                  F7M
Cantamos aleluia! Cordeiro venceu!
C             G                 Am
  Cantamos aleluia! Cantamos aleluia!
                  F7M           C
Cantamos aleluia! Cordeiro venceu!
`,
  ),

  defineSong(
    {
      ...base,
      id: 'eu-navegarei',
      title: 'Eu Navegarei',
      artist: 'Gabriela Rocha',
      difficulty: 2,
      key: 'Am',
      bpm: 70,
      source: { file: FILE, page: 68 },
      reviewNotes: ['No material: "Tom: Am (Tom original: G#m)".'],
      arrangement: ['Intro', 'Primeira Parte', 'Refrão', 'Refrão', 'Intro', 'Primeira Parte', 'Refrão', 'Refrão', 'Final'],
    },
    `
[Intro]
Am7 G F7M Dm7 E

[Primeira Parte]
          Am7
Eu navegarei
                G
No oceano do Espírito
          F7M Dm7
E ali adorarei
                   E
Ao Deus do meu amor
       Am7
Eu adorarei
                 G
Ao Deus da minha vida
                F7M Dm7
Que me compreendeu
                     E
Sem nenhuma explicação

[Refrão]
         Am7
Espírito, Espírito
                G
Que desce como fogo
                  F7M   Dm7
Vem como em pentecostes
              E
E enche-me de novo

[Final]
Am7 G F7M Dm7 E Am7
`,
  ),

  defineSong(
    {
      ...base,
      id: 'lugar-secreto',
      title: 'Lugar Secreto',
      artist: 'Gabriela Rocha',
      difficulty: 2,
      key: 'Am',
      bpm: 68,
      source: { file: FILE, page: 72 },
      arrangement: ['Intro', 'Primeira Parte', 'Refrão', 'Solo', 'Primeira Parte', 'Refrão', 'Refrão', 'Segunda Parte', 'Segunda Parte', 'Segunda Parte', 'Refrão'],
    },
    `
[Intro]
F7M G6
F7M G6

[Primeira Parte]
F7M                         G6
   Tu és tudo o que eu mais quero
F7M                   G6
     O meu fôlego, tu és
F7M                      G6
     Em Teus braços, é o meu lugar
       F7M          G6
Estou aqui, estou aqui
F7M                    G6
   Pai, eu amo sua presença
F7M                        G6
   Teu sorriso é vida em mim
F7M                G6
   Eu seguro em suas mãos
         F7M           G6
Confio em ti, confio em ti

[Refrão]
              F7M
Quero ir mais fundo
              Dm7(9)
Leva-me mais perto
               Am7
Onde eu te encontro
            Em7
No lugar secreto
                  F7M
Aos Teus pés, me rendo
          Dm7(9)      Am7     G6
Pois a tua glória quero ver

[Solo]
F7M Dm7(9) Am7 Em7
F7M Dm7(9) Am7 G6

[Segunda Parte]
                   F7M(9)
Tudo o que eu mais quero é Te ver
                   Dm7(9)
Me envolva com tua glória e poder
         Am7
Tua majestade é real
          Em7
Tua voz ecoa em meu ser
`,
  ),
  defineSong(
    {
      ...base,
      id: 'teu-santo-nome',
      title: 'Teu Santo Nome',
      artist: 'Gabriela Rocha',
      difficulty: 2,
      key: 'G',
      bpm: 72,
      source: { file: FILE, page: 74 },
      reviewNotes: ['No material: "Tom: C", mas a cifra gira em torno de G (C9 G D9 Em Am7). Revisar.'],
      arrangement: ['Intro', 'Primeira Parte', 'Pré-Refrão', 'Refrão', 'Pré-Refrão', 'Refrão', 'Refrão', 'Refrão', 'Final'],
    },
    `
[Intro]
C9 G

[Primeira Parte]
             Am7
Todo ser que vive
                 Em
Louve ao nome do Senhor
         C9
Toda criatura se derrame
         G    D9
Aos Seus pés
                Am7
Ao som da Sua voz
           Em
O universo se desfaz
             C9
Não há outro nome
                      G D9
Comparado ao grande Eu Sou

[Pré-Refrão]
Am7               C9
 E mesmo sendo pó
               G
Com tudo que há em mim
   D9
Confessarei
Am7               C9
 Que céus e terra passarão
    G            D9
Mas o Teu nome é eterno

[Refrão]
Em               C9
Todo joelho dobrará
             G
Ao ouvir Teu nome
          D9
Teu Santo nome
Em               C9
Todo ser confessará
                    G
Louvado seja o Teu nome
          D9
Teu santo nome

[Final]
D9 Bm7 D9
`,
  ),

  defineSong(
    {
      ...base,
      id: 'ha-um-lugar',
      title: 'Há um Lugar',
      artist: 'Heloísa Rosa',
      difficulty: 1,
      key: 'G',
      bpm: 74,
      source: { file: FILE, page: 85 },
      arrangement: ['Intro', 'Estrofe 1', 'Intro', 'Estrofe 2', 'Esse lugar', 'Estrofe 3', 'Estrofe 4', 'Esse lugar', 'Solo', 'Esse lugar'],
    },
    `
[Intro]
C9 G

[Estrofe 1]
          C9
Há um lugar de descanso em ti
          G
Há um lugar de refrigério em ti
          C9            D       Em
Há um lugar onde a verdade reina
        C9         G
Esse lugar é no Senhor

[Estrofe 2]
         C9
Há um lugar onde as pessoas não me influenciam
          G
Há um lugar onde eu ouço o teu espírito
         C9       D              Em
Há um lugar de vitória em meio a guerra
        C9          G
Esse lugar é no Senhor

[Esse lugar]
                  C9
Esse lugar é no Senhor
                   G
Esse lugar é no Senhor
                  C9
Esse lugar é no Senhor
                   G
Esse lugar é no Senhor

[Estrofe 3]
         C9
Há um lugar onde a inconstância não me domina
          G
Há um lugar onde minha fé é fortalecida
         C9          D            Em
Há um lugar onde a paz é quem governa
        C9         G
Esse lugar é no Senhor

[Estrofe 4]
          C9
Há um lugar onde os sonhos não se abortam
          G
Há um lugar onde os meus medos não me dominam
          C9                D          Em
Há um lugar que quando se perde é que se ganha
       C9           G
Esse lugar é no Senhor

[Solo]
C9 G
`,
  ),
  defineSong(
    {
      ...base,
      id: 'toca-em-mim-de-novo',
      title: 'Toca em Mim de Novo',
      artist: 'Isadora Pompeo',
      difficulty: 1,
      key: 'D',
      bpm: 70,
      source: { file: FILE, page: 105 },
      reviewNotes: ['O material indica que o Bm7 pode ser trocado por D, para facilitar.'],
      arrangement: ['Intro', 'Primeira Parte', 'Pré-Refrão', 'Refrão', 'Interlúdio', 'Primeira Parte', 'Pré-Refrão', 'Refrão', 'Pré-Refrão', 'Refrão'],
    },
    `
[Intro]
D G D G

[Primeira Parte]
 D                              G
   Lembro quando te encontrei
                  D
Tudo novo você fez
                    G
Os abraços que senti
                  Bm7
Me fizeram prosseguir
                 G
Várias vezes eu caí
                 D
E você me levantou
                  G
Eu achava estar bem
Mas me rendo

[Pré-Refrão]
A
Eu me rendo
G
Eu me rendo
A             G
Eu me rendo a ti
A
Eu me rendo
G
Eu me rendo
A            G
Eu me rendo a ti

[Refrão]
 D
Toca em mim de novo
G
Enche-me de novo
Bm7
  Eu não me vejo
G
 Sem tua presença
 D
Toca em mim de novo
G
Enche-me de novo
Bm7
  Eu não me vejo
G
 Sem tua presença

[Interlúdio]
D D9 G G7M
D D9 G G7M
`,
  ),

  defineSong(
    {
      ...base,
      id: 'ousado-amor',
      title: 'Ousado Amor',
      artist: 'Isaías Saad',
      difficulty: 1,
      key: 'Em',
      bpm: 72,
      source: { file: FILE, page: 109 },
      reviewNotes: ['No material: "Tom: Em (Tom original: D#m)".'],
      arrangement: ['Estrofe 1', 'Refrão', 'Interlúdio', 'Estrofe 2', 'Refrão', 'Ponte', 'Ponte', 'Ponte', 'Refrão'],
    },
    `
[Estrofe 1]
Em7               D4
  Antes de eu falar
            C9
Tu cantavas sobre mim
Em7             D4
  Tu tens sido tão
        C9
Tão bom pra mim
Em7                  D4
  Antes de eu respirar
             C9
Sopraste Tua vida em mim
Em7             D4
  Tu tens sido tão
        C9
Tão bom pra mim

[Refrão]
       Em7            D4
Oh, impressionante, infinito
     C9            G
E ousado amor de Deus
        Em7           D4
Oh, que deixa as noventa e nove
C9               G
Só pra me encontrar
               Em7
Não posso comprá-lo,
         D4
nem merecê-lo
          C9             G
Mesmo assim se entregou
       Em7            D4
Oh, impressionante, infinito
     C9            G
E ousado amor de Deus

[Interlúdio]
Em D4 C9 G
Em D4 C9 G

[Estrofe 2]
Em7            D4
  Inimigo eu fui
                 C9
Mas Teu amor lutou por mim
Em7              D4
  Tu tens sido tão
         C9
Tão bom pra mim
Em7              D4
  Não tinha valor
             C9
Mas tudo pagou por mim
Em7             D4
  Tu tens sido tão
        C9
Tão bom pra mim

[Ponte]
Em7                 D4
  Traz luz para as sombras
           C9                    G
Escala montanhas pra me encontrar
Em7             D4
   Derruba muralhas
               C9                G
Destrói as mentiras, pra me encontrar
`,
  ),
  defineSong(
    {
      ...base,
      id: 'em-teus-bracos',
      title: 'Em Teus Braços',
      artist: 'Laura Souguellis',
      difficulty: 1,
      key: 'C',
      bpm: 66,
      source: { file: FILE, page: 121 },
      arrangement: ['Estrofe', 'Pré-Refrão', 'Refrão', 'Estrofe', 'Pré-Refrão', 'Refrão', 'Recaio', 'Pré-Refrão', 'Refrão', 'Refrão', 'O toque mais puro'],
    },
    `
[Estrofe]
F7M
  Segura estou nos braços
                        C7M
Daquele que nunca me deixou
F7M
  Seu amor perfeito sempre esteve
             C7M
Repousado em mim

[Pré-Refrão]
            Am
E se eu passar pelo vale
            F7M           G
Acharei conforto em teu amor
               Em
Pois eu sei que és aquele
         F7M          G
Que me guarda, me guardas

[Refrão]
             F7M
Em teus braços é meu descanso
              C7M
Em teus braços é meu descanso
              F7M
Em teus braços é meu descanso
             C7M
Em teus braços é meu descanso

[Recaio]
F7M
  Recaio em tua graça
C7M
  Recaio de novo em tuas mãos
F7M
  Recaio em tua graça
C7M
  Recaio de novo em tuas mãos

[O toque mais puro]
 F7M
O toque mais puro
O amor mais seguro do mundo
 C7M
O toque mais puro
                               F7M
O amor mais seguro do mundo é o teu
 F7M
O toque mais puro
O amor mais seguro do mundo
 C7M
O toque mais puro
O amor mais seguro do mundo
         F7M
É o teu Jesus
`,
  ),

  defineSong(
    {
      ...base,
      id: 'que-amor-e-esse',
      title: 'Que Amor é Esse',
      artist: 'Luma Elpidio',
      difficulty: 1,
      key: 'G',
      bpm: 70,
      source: { file: FILE, page: 128 },
      arrangement: ['Intro', 'Primeira Parte', 'Refrão', 'Intro', 'Segunda Parte', 'Refrão final'],
    },
    `
[Intro]
C9 G C9 G

[Primeira Parte]
             C9
Tu me dás a paz que excede todo entendimento humano
              G
E quando planejo me mostras que é bem melhor o teu plano
            C9
Com misericórdia me cobres derramando graça em mim
                            G
Eu desconheço um outro amor assim
              C9
E ao meu respeito eu sei que só tens pensamentos de paz
             G
Por teu sacrifício hoje eu posso andar sem olhar para trás
                 C9
Eu não compreendo tamanha bondade que está sobre mim
                              G
Eu desconheço um outro amor assim

[Refrão]
           C9
Que amor é esse?
Graça incalculável
              G
Não tem interesse, não quer nada em troca
Tua vontade é boa, perfeita e agradável
       C9       G
Para mim, para mim
             C9
Quero conhecer-te, ouvir teus segredos
               G
Não importa o preço, eu me lanço inteiro
Sei que nos teus braços existe um espaço
       C9
Para mim
        G
Para mim

[Segunda Parte]
  C9
E nada vai ocupar teu lugar em mim
  G
E ninguém pode ocupar meu lugar em Ti
  C9
E nada vai ocupar teu lugar em mim
                             G
Eu desconheço um outro amor assim
  C9
E nada vai ocupar teu lugar em mim
  Em7                              G
E ninguém pode ocupar meu lugar em Ti
  C9
E nada vai ocupar teu lugar em mim
                             G
Eu desconheço um outro amor assim

[Refrão final]
         C9
Que amor é esse?
Graça incalculável
             G
Não tem interesse, não quer nada em troca
Tua vontade é boa, perfeita e agradável
       C9        G Bm7
Para mim, para mim
           Am7                        C9
Quero conhecer-te mais, ouvir teus segredos
               Em
Não importa o preço, eu me lanço inteiro
                 G
Sei que nos teus braços existe um espaço
      C9
Para mim
       G
Para mim
`,
  ),
  defineSong(
    {
      ...base,
      id: 'maranata',
      title: 'Maranata',
      artist: 'Ministério Avivah',
      difficulty: 1,
      key: 'Em',
      bpm: 76,
      source: { file: FILE, page: 137 },
      reviewNotes: ['No material: "Tom: Em (Tom original: Cm)".'],
      arrangement: ['Intro', 'Primeira Parte', 'Pré-Refrão', 'Refrão', 'Solo', 'Primeira Parte', 'Pré-Refrão', 'Refrão', 'Refrão', 'Solo final', 'Vem Jesus', 'Vem Jesus'],
    },
    `
[Intro]
Em C G D

[Primeira Parte]
Em                  C
  Tu és a minha luz, a minha salvação
   G            D
E a ti me renderei
Em                     C
  Se ao Teu lado estou, seguro em tuas mãos
   G      D
Eu nada temerei

[Pré-Refrão]
C D Em          G           D
Oh oh oh tu és Santo oh Senhor
C D Em          G            D
Oh oh oh, tu és digno de louvor

[Refrão]
 C              G                Em
Só em ti confiarei, eu nada temerei
               D                          C
Em frente eu irei, pois eu sei que vivo estás
               Em                       G
E um dia voltarás, do céu pra nos buscar
                   D
Pra sempre reinarás, aleluia

[Solo]
Em C G D
Em C G D

[Solo final]
Em G D C
Em G D C

[Vem Jesus]
G C
Oh oh oh
G D
Oh oh oh
       G          C
Vem Jesus, vem Jesus
     G                    D
Maranata, ora vem Senhor Jesus
`,
  ),

  defineSong(
    {
      ...base,
      id: 'para-que-entre-o-rei',
      title: 'Para que Entre o Rei',
      artist: 'Ministério Morada',
      difficulty: 2,
      key: 'Em',
      bpm: 70,
      source: { file: FILE, page: 141 },
      arrangement: ['Intro', 'Primeira Parte', 'Segunda Parte', 'Segunda Parte', 'Primeira Parte'],
    },
    `
[Intro]
Em C9 G D/F#

[Primeira Parte]
Em
 Para que entre o Rei
C9                    G
 Jesus o Rei da Glória
                     D/F#
Eu abro o meu coração
                  Em
Eu abro meu coração
Para que entre o Rei
C9                    G
 Jesus o Rei da Glória
                   D/F#
Eu abro o meu coração
                  Em
Eu abro meu coração

[Segunda Parte]
 Em
Quem é o Rei da Glória
 C9
Quem é o Rei da Glória
  G
É Jesus! Jesus!
D/F#
Ele é o Rei! Ele é o Rei
`,
  ),
]
