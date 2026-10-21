// Método Acordes Exclusivos – Tom de Dó Maior (C). Transcrito do PDF completo, p. 3–7.
// Convenção do material: × = não tocar, ● = corda do baixo, ○ = tocar.
// Strings de casas da 6ª para a 1ª corda; "(10)" = casa 10.
import { shape } from '../../music/chordDb'
import type { ChordShape, Barre } from '../../music/types'
import type { MethodTone } from './types'

const SRC = 'Método Acordes Exclusivos – Tom de Dó'
let n = 0
function s(name: string, frets: string, fingers: string, bass: number, page: number, note?: string, barre?: Barre): ChordShape {
  return shape(name, frets, fingers, { id: `ae-do-${++n}`, source: `${SRC}, p. ${page}`, rootString: bass, note, barre })
}

const SOA = (x: string) => `Nomeado assim no material, mas as notas desenhadas formam ${x}. Revisar.`

// Formas das sequências (p. 7)
const Csus4 = s('Csus4', 'x33013', '023014', 5, 7)
const Am9a = s('Am9', 'x07500', '003100', 5, 7)
const Fmaj7a = s('Fmaj7', '1xx210', '100320', 6, 7)
const G7a = s('G7', '3x0001', '300001', 6, 7)
const C6a = s('C6', 'x3x055', '010034', 5, 7)
const Am7as = s('Am', 'x02010', '002010', 5, 7, SOA('Am7 (A E G C E)'))
const Fsus2 = s('Fsus2', '1x301x', '103020', 6, 7)
const G7b = s('G7', '320001', '320001', 6, 7)

export const TONE_DO: MethodTone = {
  id: 'do',
  key: 'C',
  name: 'Dó',
  page: 3,
  degrees: [
    {
      degree: 'I',
      chord: 'C',
      label: 'Dó maior',
      shapes: [
        s('C', 'x32010', '032010', 5, 3),
        s('C', 'x32013', '032014', 5, 3),
        s('C', 'xx(10)988', '004312', 4, 3),
        s('C', 'x35050', '013040', 5, 3),
        s('C', 'x3555x', '012340', 5, 3),
        s('C5', 'x355xx', '013400', 5, 3),
        s('Cmaj7', 'x3200x', '021000', 5, 3),
        s('Cmaj7', 'xx(10)987', '004321', 4, 3),
        s('C6', 'x32210', '042310', 5, 3),
        s('C6', 'x3525x', '023140', 5, 3),
        C6a,
        s('C6/9', 'x3223x', '031240', 5, 3),
        s('C6/9', '8777xx', '412300', 6, 3),
        s('C6/9', 'xx(10)9(10)(10)', '002134', 4, 3),
        s('Cmaj9', 'x3243x', '021430', 5, 3),
        s('Cmaj9', '8797xx', '314200', 6, 3),
      ],
    },
    {
      degree: 'ii',
      chord: 'Dm',
      label: 'Ré menor',
      shapes: [
        s('Dm', 'xx0231', '000231', 4, 3),
        s('Dm', 'x5323x', '042130', 5, 3),
        s('Dm', 'xx0211', '000312', 4, 3, SOA('Dm7 (D A C F)')),
        s('Dm', 'x5321x', '043210', 5, 3, SOA('Dm7 (D F A C)')),
        s('Dm', 'x5356x', '021340', 5, 3, SOA('Dm7 sem a 5ª (D F C F)')),
        s('Dm', '(10)877xx', '431200', 6, 3),
        s('Dm', '(10)8(10)7xx', '324100', 6, 3, SOA('Dm7 sem a 5ª (D F C D)')),
        s('Dm7', 'x5355x', '021340', 5, 3, SOA('Dm9 sem a 5ª (D F C E)')),
        s('Dm7', '(10)8(10)(10)xx', '213400', 6, 3),
        s('Dm9', 'xx(12)(10)(10)(12)', '003124', 4, 3),
        s('Dm11', '(10)x7(10)8x', '301420', 6, 3),
        s('Dm', 'x5x76x', '010320', 5, 3),
        s('Dm7', 'x5x56x', '010230', 5, 3),
        s('Dm7', 'xx021x', '000210', 4, 3, 'Forma sem a 3ª (D A C), como desenhada no material.'),
      ],
    },
    {
      degree: 'iii',
      chord: 'Em',
      label: 'Mi menor',
      shapes: [
        s('Em', '022030', '012030', 6, 4, SOA('Em7 (E B E G D E)')),
        s('Em', '022000', '012000', 6, 4),
        s('Em', '020000', '010000', 6, 4, SOA('Em7 (E B D G B E)')),
        s('Em', 'xx2000', '001000', 4, 4),
        s('Em', 'xx2003', '001002', 4, 4),
        s('Em', 'xx2433', '001423', 4, 4, SOA('Em7 (E B D G)')),
        s('Em', '079080', '013020', 6, 4),
        s('Em', '0xx453', '000231', 6, 4),
        s('Em7', '000002', '000001', 6, 4, 'Como desenhado (só o dedo 1 na 2ª casa da 1ª corda), as notas são E A D G B F#, que não formam Em7. Provável erro no material. Revisar.'),
        s('Em7', '0x2030', '001020', 6, 4),
        s('Em7', '020033', '010023', 6, 4),
        s('Em7', '022033', '012034', 6, 4),
        s('Em11', '022203', '012304', 6, 4),
        s('Em11', '002000', '001000', 6, 4),
        s('Em7(9)', 'x7577x', '021340', 5, 4),
        s('Em7(9)', '020032', '010032', 6, 4),
        s('Em7(9)', '075770', '021340', 6, 4),
        s('Em7(9)', '024030', '013020', 6, 4),
        s('Em9', '024000', '013000', 6, 4),
        s('Em9', 'xx2002', '001002', 4, 4),
      ],
    },
    {
      degree: 'IV',
      chord: 'F',
      label: 'Fá maior',
      shapes: [
        s('F', 'xx3211', '004312', 4, 4),
        s('F', 'xx3565', '001243', 4, 4),
        s('F', 'x8756x', '043120', 5, 4),
        s(
          'F',
          'x8(10)(10)(10)8',
          '012341',
          5,
          4,
          'No material, a 1ª corda aparece marcada para tocar sem dedo indicado; interpretado como pestana do dedo 1 na 8ª casa (forma de Lá).',
          { fret: 8, fromString: 5, toString: 1, finger: 1 },
        ),
        s('F', '1332xx', '134200', 6, 4),
        s('F', 'xx321x', '003210', 4, 4),
        s('F', '1xx2xx', '100200', 6, 4),
        s('Fmaj7', '1x221x', '103420', 6, 4),
        Fmaj7a,
        s('F6', '1xx231', '100342', 6, 4),
        s('F6', 'xx3535', '001324', 4, 4),
        s('F6', 'x8(10)7(10)x', '023140', 5, 4),
        s('F6', '10323x', '103240', 6, 5),
        s('F6/9', '1000xx', '100000', 6, 5),
        s('F6/9', '1x001x', '100020', 6, 5),
        s('F6/9', '1xx233', '100234', 6, 5),
        s('Fmaj9', 'x8798x', '021430', 5, 5),
        s('Fmaj9', '1020xx', '102000', 6, 5),
        s('Fmaj9', 'xx3253', '002143', 4, 5),
      ],
    },
    {
      degree: 'V',
      chord: 'G',
      label: 'Sol maior',
      shapes: [
        s('G', '320003', '210003', 6, 5),
        s('G', '32000x', '210000', 6, 5),
        s('G', 'xx5433', '004312', 4, 5),
        s('G', 'xx5707', '001304', 4, 5),
        s('G', 'xx5787', '001243', 4, 5),
        s('G', 'x(10)978x', '043120', 5, 5),
        s('G', 'x554xx', '023100', 5, 5, 'Baixo em Ré (G/D).'),
        s('G', 'x20030', '010020', 5, 5, SOA('G6 com baixo em Si (B D G D E)')),
        s('G', '3xx43x', '100320', 6, 5),
        s('G', 'xx543x', '003210', 4, 5),
        s('G', '35540x', '134200', 6, 5),
        G7a,
        s('G7', '3x340x', '102300', 6, 5),
        s('G7', 'xx5767', '001324', 4, 5),
        G7b,
        s('G7', '3x300x', '102000', 6, 5),
        s('G7', '3x343x', '102430', 6, 5),
        s('G6', '3x243x', '201430', 6, 5),
        s('G6', '3xx453', '100342', 6, 5),
        s('G6', 'xx5430', '003210', 4, 5),
        s('G6', '322003', '312004', 6, 5),
        s('G6', '3x2000', '201000', 6, 5),
        s('G6', '320000', '210000', 6, 5),
        s('G7sus4', '3x353x', '102430', 6, 5),
        s('G7sus4', 'xx5567', '001234', 4, 5, 'As notas desenhadas (G C F B) incluem a 3ª (B); soa como G11. Revisar.'),
        s('G7sus4', 'xx5768', '001324', 4, 5),
        s('Gsus4', '3x0013', '300014', 6, 5),
        s('Gsus4', 'xx5533', '003412', 4, 5),
      ],
    },
    {
      degree: 'vi',
      chord: 'Am',
      label: 'Lá menor',
      shapes: [
        s('Am', 'x02210', '002310', 5, 6),
        Am7as,
        s('Am', '5322xx', '431200', 6, 6),
        s('Am', '5352xx', '324100', 6, 6, SOA('Am7 (A C G A)')),
        s('Am', '5x555x', '102340', 6, 6, SOA('Am7 (A G C E)')),
        s('Am7', '5355xx', '213400', 6, 6),
        s(
          'Am7',
          '555557',
          '111113',
          6,
          6,
          'Como desenhado (pestana na 5ª casa e dedo 3 na 7ª casa da 1ª corda), as notas são A D G C E B. Na forma usual de Am7 com pestana, o dedo 3 fica na 5ª corda (575555). Revisar.',
          { fret: 5, fromString: 6, toString: 1, finger: 1 },
        ),
        s('Am7', '5xx553', '200341', 6, 6),
        s('Am7', 'x0x553', '000341', 5, 6),
        s('Am7', '505550', '102340', 6, 6),
        s('Am9', 'x02410', '002310', 5, 6),
        Am9a,
        s('Am9', 'xx7557', '003124', 4, 6),
        s('Am11', 'x00210', '000210', 5, 6),
        s('Am11', 'x0253x', '001320', 5, 6),
        s('Am11', 'x0x530', '000310', 5, 6),
        s('Am6', 'x02013', '002013', 5, 6, SOA('Am7 (A E G C G); para Am6 seria preciso um Fá#. Revisar.')),
      ],
    },
  ],
  sequences: [
    {
      title: 'Sequência 1',
      roman: 'I – vi – IV – V',
      chords: 'C – Am – F – G',
      options: [
        [Csus4, Am9a, Fmaj7a, G7a],
        [C6a, Am7as, Fsus2, G7b],
      ],
    },
    {
      title: 'Sequência 2',
      roman: 'I – V – vi – IV',
      chords: 'C – G – Am – F',
      options: [
        [Csus4, G7a, Am7as, Fmaj7a],
        [C6a, G7b, Am9a, Fsus2],
      ],
    },
  ],
}
