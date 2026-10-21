// 10 Hinos Harpa Cristã – Apenas 3 Acordes (A·D·E).
// Letras e cifras transcritas do PDF "10 Hinos Harpa Cristã – Apenas 3 Acordes.pdf".
// Andamento e compassos são ESTIMADOS (o material não traz áudio nem andamento).
import { defineSong } from '../defineSong'
import type { Song } from '../../music/types'

const FILE = '10 Hinos Harpa Cristã – Apenas 3 Acordes.pdf'
const SHAPES = { A: 'A@x02220', D: 'D@xx0232', E: 'E@022100' }
const common = {
  category: 'harpa' as const,
  difficulty: 1 as const,
  key: 'A',
  sync: 'estimated' as const,
  shapes: SHAPES,
}

const withRefrain = (verses: number) =>
  Array.from({ length: verses }, (_, i) => [`Estrofe ${i + 1}`, 'Refrão']).flat()

export const HARPA_SONGS: Song[] = [
  defineSong(
    {
      ...common,
      id: 'harpa-291-a-mensagem-da-cruz',
      title: 'A Mensagem da Cruz',
      harpa: 291,
      bpm: 90,
      beatsPerBar: 3,
      barsPerLine: 4,
      source: { file: FILE, page: 3 },
      arrangement: withRefrain(4),
    },
    `
[Estrofe 1]
A                    D
Rude cruz se erigiu! Dela o dia fugiu
            E                                 A
Com emblema de vergonha e de dor
                                              D
Mas contemplo essa cruz, porque nela Jesus
            E                         A
Deu a vida por mim pecador

[Refrão]
            E                        A
Sim, eu amo a mensagem da cruz
            D                        A
Até morrer eu a vou proclamar
                                 D
Levarei eu também minha Cruz
            E                A
Até por uma coroa trocar

[Estrofe 2]
    A
Desde a glória dos céus,
        D
o Cordeiro de Deus
            E                 A
Ao Calvário humilhante baixou
                                          D
Essa cruz tem para mim, atrativos sem fim
            E            A
Porque nela Jesus me salvou

[Estrofe 3]
A
Nessa cruz padeceu
     D
E por mim já morreu
         E                        A
Meu Jesus, para dar-me o perdão
                                  D
E eu me alegro na cruz, dela vem graça e luz
         E                A
Para minha santificação

[Estrofe 4]
A
Eu aqui com Jesus
     D
A vergonha da cruz
         E                A
Quero sempre levar e sofrer
                                      D
Cristo vem me buscar, e com Ele, no lar
         E                    A
Uma parte da glória hei de ter
`,
  ),

  defineSong(
    {
      ...common,
      id: 'harpa-15-foi-na-cruz',
      title: 'Foi na Cruz',
      harpa: 15,
      bpm: 100,
      beatsPerBar: 3,
      barsPerLine: 4,
      source: { file: FILE, page: 4 },
      arrangement: withRefrain(4),
    },
    `
[Estrofe 1]
  A                     E
Oh! quão cego andei e perdido vaguei
                                    A
Longe, longe do meu Salvador!
  D
Mas do céu Ele desceu
  A
E Seu sangue verteu
         E                      A
Pra salvar um tão pobre pecador

[Refrão]
  A                                         E
Foi na cruz, foi na cruz, onde um dia eu vi
                                A
Meu pecado castigado em Jesus
  D                     A
Foi ali, pela fé, que os olhos abri
  E                     A
E agora me alegro em Sua luz

[Estrofe 2]
  A                     E
Eu ouvia falar dessa graça sem par
                                    A
Que do céu trouxe o nosso Jesus
  D                             A
Mas eu surdo me fiz, converter-me não quis
  E                                     A
Ao Senhor, que por mim morreu na cruz

[Estrofe 3]
  A                  E
Mas um dia senti meu pecado, e vi
                         A
Sobre mim a espada da lei
  D                  A
Apressado fugi, em Jesus me escondi
  E                  A
E abrigo seguro nele achei

[Estrofe 4]
  A                  E
Quão ditoso, então esse meu coração
                         A
Conhecendo o excelso amor
  D                              A
Que levou meu Jesus a sofrer lá na cruz
  E                                      A
Pra salvar a um tão pobre pecador
`,
  ),

  defineSong(
    {
      ...common,
      id: 'harpa-193-a-alma-abatida',
      title: 'A Alma Abatida',
      harpa: 193,
      bpm: 84,
      beatsPerBar: 4,
      barsPerLine: 2,
      source: { file: FILE, page: 5 },
      arrangement: withRefrain(3),
    },
    `
[Estrofe 1]
  A
Se tu, minh'alma, a Deus suplicas,
  E                    A
E não recebes, confiando fica
Em Suas promessas, que são mui ricas,
  E                    A
E infalíveis pra te valer.

[Refrão]
  D                          A
Por que te abates, ó minha alma?
  E                          A
E te comoves, perdendo a calma?
  D                          A
Não tenhas medo, em Deus espera,
  E                          A
Porque bem cedo, Jesus virá.

[Estrofe 2]
  A
Ele intercede por ti, minh'alma;
  E                    A
Espera nEle, com fé e calma;
Jesus de todos teus males salva,
  E                    A
E te abençoa, dos altos céus.

[Estrofe 3]
  A
Terás em breve, as dores findas,
  E                    A
No dia alegre da Sua vinda;
Se Cristo tarda, espera ainda
  E                    A
Mais um pouquinho, e O verás.
`,
  ),

  defineSong(
    {
      ...common,
      id: 'harpa-545-porque-ele-vive',
      title: 'Porque Ele Vive',
      harpa: 545,
      bpm: 76,
      beatsPerBar: 4,
      barsPerLine: 2,
      source: { file: FILE, page: 6 },
      arrangement: withRefrain(2),
    },
    `
[Estrofe 1]
  A                   D
Deus enviou seu Filho amado
  A                   E
Pra perdoar pra me salvar
  A                   D
Na cruz sofreu por meus pecados
      A           E               A
Mas ressurgiu e vivo com o pai estar

[Refrão]
      A
Porque Ele vive
             D
Posso crer no amanhã
      A
Porque Ele vive
      E
Temor não há
      A
Mas eu bem sei, eu sei
             D
Que a minha vida
      A                     E
Está nas mãos do meu Jesus
      A
Que vivo está

[Estrofe 2]
  A                  D
E quando enfim, chegar a hora
  A                  E
Em que a morte enfrentarei
  A                  D
Sem medo, então, terei vitória
  A                  E
irei na Glória, ao meu Jesus
           A
Que vivo está
`,
  ),

  defineSong(
    {
      ...common,
      id: 'harpa-526-grandioso-es-tu',
      title: 'Grandioso És Tu',
      harpa: 526,
      bpm: 66,
      beatsPerBar: 4,
      barsPerLine: 2,
      source: { file: FILE, page: 7 },
      arrangement: withRefrain(5),
      reviewNotes: [
        'No PDF, a 3ª estrofe ("Olho as florestas…") está cifrada em Sol (G–C–D), diferente do restante em Lá (A–D–E). Aqui ela foi transposta para Lá (G→A, C→D, D→E) para manter os 3 acordes. Revisar.',
      ],
    },
    `
[Estrofe 1]
  A                                  D
Senhor, meu Deus, quando eu, maravilhado
       E                  A
Contemplo a tua imensa criação
                          D
A terra e o mar e o céu todo estrelado
       E                  A
Me vêm falar da tua perfeição

[Refrão]
  A    D             A
Então minh'alma canta a ti, Senhor
       E                  A
Grandioso és Tu! Grandioso és Tu!
  A    D             A
Então minh'alma canta a ti, Senhor
       E                  A
Grandioso és Tu! Grandioso és Tu!

[Estrofe 2]
  A                              D
Quando as estrelas, tão de mim distantes
       E                  A
Vejo a brilhar com vívido esplendor
  A                          D
Relembro, oh! Deus, as glórias cintilantes
       E                  A
Que meu Jesus deixou, por meu amor!

[Estrofe 3]
  A                                  D
Olho as florestas murmurando ao vento
       E                  A
E, ao ver que Tu plantaste cada pé
  A                      D
Recordo a cruz, o lenho tão cruento
       E                  A
E no teu Filho afirmo a minha fé

[Estrofe 4]
  A                                  D
E quando penso que Tu não poupaste
          E                  A
Teu filho amado por amor de mim
  A                      D
Meu coração, que nele Tu ganhaste
          E                                  A
Transborda, oh! Pai, de amor que não tem fim!

[Estrofe 5]
  A                                      D
E quando Cristo, o amado meu, voltando
          E                  A
Vier dos céus o povo seu buscar
  A                      D
No lar eterno quero, jubilando
          E                  A
A tua santa face contemplar
`,
  ),

  defineSong(
    {
      ...common,
      id: 'harpa-192-pelo-sangue',
      title: 'Pelo Sangue',
      harpa: 192,
      bpm: 104,
      beatsPerBar: 4,
      barsPerLine: 2,
      source: { file: FILE, page: 8 },
      arrangement: withRefrain(3),
    },
    `
[Estrofe 1]
A
Pelo mundo brilha a luz
D
Desde que morreu Jesus
A                            E
Pendurado lá na cruz do calvário!
A
Os pecados carregou
D
E da culpa nos livrou
A                                E       A
Com o sangue que manou, no calvário!

[Refrão]
D                       A
Pelo sangue, pelo sangue
E
Somos redimidos, sim
A
Pelo sangue carmezim
D                       A
Pelo sangue, pelo sangue
                         E    A
Pelo sangue de Jesus, no calvário

[Estrofe 2]
A
Antes, tinha mui temor
D
Mas, agora, tenho amor
A                            E
Pois compreendo o valor do calvário
A
Eu vivi na perdição
D
Mas achei a salvação
A                                    E       A
Pela grande redenção: o calvário

[Estrofe 3]
A
És um grande pecador?
D
Eis aqui teu Salvador!
A
Tema do bom pregador
E                   A
O calvário, o cordeiro divinal
D
Padeceu na cruz teu mal
A                            E     A
E oferece graça tal, no calvário
`,
  ),

  defineSong(
    {
      ...common,
      id: 'harpa-244-louvai-a-jesus',
      title: 'Louvai a Jesus',
      harpa: 244,
      bpm: 96,
      beatsPerBar: 3,
      barsPerLine: 4,
      source: { file: FILE, page: 9 },
      arrangement: withRefrain(4),
    },
    `
[Estrofe 1]
A
Louvai a Jesus, amoroso;
E                   A
Na cruz os pecados levou,
Que nos enche de Santo gozo;
E                   A
Com sangue o céu nos ganhou

[Refrão]
D             A
Ao meu Senhor,
E                       A
Que tenho no meu coração,
D             A
Eu dou louvor,
E                       A
Pois Ele me deu salvação.

[Estrofe 2]
A
Louvai a Jesus poderoso,
E                   A
Que veio livrar da prisão
A
Um povo cativo, medroso,
E                   A
Que não tinha consolação.

[Estrofe 3]
D
Louvai a Jesus, vosso guia
E                   A
No mundo de tribulação;
A
E não tem temor, quem confia
E                   A
Em Deus, mas real proteção.

[Estrofe 4]
D
Louvai a Jesus, dai-Lhe glória,
E                   A
Pois Rei e Senhor Ele é;
A
Na cruz nos ganhou a vitória;
E                   A
Vencei com Jesus pela fé.
`,
  ),

  defineSong(
    {
      ...common,
      id: 'harpa-400-em-jesus',
      title: 'Em Jesus',
      harpa: 400,
      bpm: 92,
      beatsPerBar: 4,
      barsPerLine: 2,
      source: { file: FILE, page: 10 },
    },
    `
[Estrofe 1]
A                   E
Em Jesus, vivendo cada dia
                        A
Em Jesus, eu tenho alegria
                               D
Em Jesus, oh, doce harmonia
E                       A
Em Jesus, desfruto a paz de Deus!

[Estrofe 2]
A                   E
Em Jesus, na rocha inabalável
                               A
Em Jesus, no homem incomparável
                               D
Em Jesus, no Deus tão adorável
E                       A
Em Jesus, o mal não temerei!

[Estrofe 3]
A                   E
Em Jesus, a graça é infinita
                        A
Em Jesus, oh, Bênção inaudita
                        D
Em Jesus, minh'alma é bendita
E                       A
Em Jesus, eu tenho salvação!

[Estrofe 4]
A                   E
Em Jesus, não temo o mal e a morte
                        A
Em Jesus, estou firmado e forte
                               D
Em Jesus, meu barco ruma ao norte
E                       A
Em Jesus, eu sempre hei de vencer!
`,
  ),

  defineSong(
    {
      ...common,
      id: 'harpa-115-trabalhai-e-orai',
      title: 'Trabalhai e Orai',
      harpa: 115,
      bpm: 100,
      beatsPerBar: 4,
      barsPerLine: 2,
      source: { file: FILE, page: 11 },
      arrangement: withRefrain(3),
    },
    `
[Estrofe 1]
A                   E
Eu quero trabalhar pra meu Senhor
                         A
Levando a Palavra com amor
A
Quero eu cantar e orar
D
E ocupado quero estar
E                   A
Sim, na vinha do Senhor

[Refrão]
A
Trabalhai e orai
                    E
Na seara e na vinha do Senhor
A
Meu desejo é orar
D
E ocupado quero estar
E                   A
Sim, na vinha do Senhor

[Estrofe 2]
A                   E
Eu quero, cada dia, trabalhar
                         A
Escravos do pecado libertar
A
Conduzi-los a Jesus
D
Nosso guia, nossa luz
E                   A
Sim, na vinha do Senhor

[Estrofe 3]
A                  E
Eu quero ser obreiro de valor
                            A
Confiando no poder do Salvador
A
Se quiseres trabalhar
D
Acharás também lugar
E                  A
Sim, na vinha do Senhor
`,
  ),

  defineSong(
    {
      ...common,
      id: 'harpa-39-alvo-mais-que-a-neve',
      title: 'Alvo Mais Que a Neve',
      harpa: 39,
      bpm: 84,
      beatsPerBar: 4,
      barsPerLine: 2,
      source: { file: FILE, page: 12 },
      arrangement: withRefrain(3),
    },
    `
[Estrofe 1]
A
Bendito seja o Cordeiro
       E
Que na cruz por nós padeceu
A
Bendito seja o Seu sangue
       E                     A
Que por nós ali Ele verteu
D                  A
Eis nesse sangue, lavados
D                             E
Com roupas que tão alvas são
A
Os pecadores remidos
       E                              A
Que perante seu Deus já estão

[Refrão]
A                  E
Alvo mais que a neve
D                  A
Alvo mais que a neve
                   D
Sim, neste sangue lavado
       E                     A
Mais alvo que a neve serei

[Estrofe 2]
A
Quão espinhosa a coroa
       E
Que Jesus por nós suportou
A
Ó, quão profundas as chagas
       E                              A
Que nos provam o quanto Ele amou
D                  A
Eis, nessas chagas, pureza
D                  E
Para o maior pecador
A
Pois que mais alvo que a neve
       E                          A
O Teu sangue nos torna, Senhor

[Estrofe 3]
A
Se nós a Ti confessarmos
        E
E seguirmos na Tua luz
A
Tu não somente perdoas
        E                      A
Purificas também, ó Jesus
D                   A
Sim, e de todo pecado
D                   E
Que maravilha de amor
A
Pois, que mais alvo que a neve
        E                      A
O Teu sangue nos torna, Senhor
`,
  ),
]
