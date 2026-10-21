// Tons de Ré a Si do Método Acordes Exclusivos (sequências transcritas dos PDFs).
import { shape } from '../../music/chordDb'
import type { ChordShape, Barre } from '../../music/types'
import type { MethodTone } from './types'

const PENDING =
  'Os acordes do tom ainda estão chegando ao app. As sequências prontas já estão completas: comece por elas!'
const SOA = (x: string) => `Nomeado assim no material, mas as notas desenhadas formam ${x}. Revisar.`
const BARRE_A =
  'No material, a 1ª corda aparece marcada para tocar sem dedo indicado; interpretado como pestana do dedo 1 (forma de Lá).'

function maker(tone: string, page: number) {
  let n = 0
  return (name: string, frets: string, fingers: string, bass: number, note?: string, barre?: Barre): ChordShape =>
    shape(name, frets, fingers, {
      id: `ae-${tone}-${++n}`,
      source: `Método Acordes Exclusivos – Tom de ${tone}, p. ${page}`,
      rootString: bass,
      note,
      barre,
    })
}

// ---------- Ré (p. 13) ----------
const re = maker('Ré', 13)
const D69 = re('D6/9', 'x54200', '043100', 5)
const A7r = re('A7', 'x02023', '001023', 5)
const G7r = re('G7', '3x0001', '300001', 6)
const D6r = re('D6', 'xx0202', '000102', 4)
const A9r = re('A9', 'x0(11)900', '003100', 5)
const G9r = re('G9', '3x020x', '200100', 6)
const Em7r1 = re('Em7', '070060', '020010', 6, 'Como desenhado (6ª posição: dedo 2 na 7ª casa da 5ª corda e dedo 1 na 6ª casa da 2ª corda), as notas são E E D G F E, que não formam Em7. Provável erro no material. Revisar.')
const Em7r2 = re('Em7', '0x2030', '001020', 6)

// ---------- Mi (p. 19) ----------
const mi = maker('Mi', 19)
const Emi = mi('E', '022100', '023100', 6)
const Bmi = mi('B', 'x24442', '012341', 5, BARRE_A, { fret: 2, fromString: 5, toString: 1, finger: 1 })
const A9mi = mi('A9', 'x0(11)900', '003100', 5)
const Emi2 = mi('E', 'xx2404', '001304', 4)
const B7mi = mi('B7', 'x21202', '021304', 5)
const A7sus4 = mi('A7sus4', 'x02030', '001020', 5)
const Fsm = mi('F#m', '2x222x', '102340', 6, SOA('F#m7 (F# E A C#)'))

// ---------- Fá (p. 24) ----------
const fa = maker('Fá', 24)
const Ffa = fa('F', 'xx321x', '003210', 4)
const Dmfa = fa('Dm', 'xx0211', '000312', 4, SOA('Dm7 (D A C F)'))
const Bb13 = fa('A#13', 'x1303x', '013040', 5)
const Cfa = fa('C', 'x32010', '032010', 5)
const F6fa = fa('F6', '10323x', '103240', 6)
const Dm7fa = fa('Dm', '(10)877xx', '431200', 6)
const Bbfa = fa('A#', 'xx876x', '003210', 4)
const C6fa = fa('C6', 'x3x055', '010034', 5)

// ---------- Sol (p. 30) ----------
const sol = maker('Sol', 30)
const Gsol = sol('G', '320003', '210003', 6)
const Emsol = sol('Em', '079080', '013020', 6)
const C6sol = sol('C6', 'x3x055', '010034', 5)
const D6sol = sol('D6', 'xx0202', '000102', 4)
const Gsol2 = sol('G', 'x20030', '010020', 5, SOA('G6 com baixo em Si (B D G D E)'))
const EmG = sol('Em/G', '322000', '312000', 6)
const Csus2 = sol('Csus2', 'x32033', '021034', 5, SOA('Cadd9 (C E G D), pois tem a 3ª (E)'))
const Dsol = sol('D', 'xx0232', '000132', 4)

// ---------- Lá (p. 36) ----------
const la = maker('Lá', 36)
const Ala = la('A', 'x02220', '001230', 5)
const Fsmla = la('F#m', '2x222x', '102340', 6, SOA('F#m7 (F# E A C#)'))
const Dla = la('D', 'xx0235', '000123', 4, 'Forma sem a 3ª (D A D A), como desenhada no material.')
const Ela = la('E', 'xx2100', '002100', 4)
const Asus2 = la('Asus2', 'x02420', '001320', 5, SOA('Aadd9 (A E B C#), pois tem a 3ª (C#)'))
const Fsm11 = la('F#m11', '202200', '102300', 6)
const D6la = la('D6', 'xx0432', '000321', 4)
const Ela2 = la('E', '0xx457', '000123', 6, 'Forma sem a 3ª (E B E B), como desenhada no material.')

// ---------- Si (p. 42) ----------
const si = maker('Si', 42)
const Bsi = si('B', 'x24442', '012341', 5, BARRE_A, { fret: 2, fromString: 5, toString: 1, finger: 1 })
const Fs = si('F#', 'xx4322', '004312', 4)
const E6si = si('E6', '000102', '000102', 6, 'Como desenhado, as notas são E A D G# B F#; para E6 faltaria o C#. Revisar.')
const B7si = si('B7', 'x21202', '021304', 5)
const Fs69 = si('F#6/9', '2111xx', '412300', 6)
const E6si2 = si('E6', '0x969x', '003140', 6)
const Csm = si('C#m', 'x4210x', '032100', 5, SOA('C#m7 (C# E G# B)'))
const Csm7 = si('C#m7', '9x999x', '102340', 6)

export const OTHER_TONES: MethodTone[] = [
  {
    id: 're', key: 'D', name: 'Ré', page: 9, degrees: [], pending: PENDING,
    sequences: [
      { title: 'Sequência 1', roman: 'I – V – IV – V', chords: 'D – A – G – A', options: [[D69, A7r, G7r, A7r], [D6r, A9r, G9r, A9r]] },
      { title: 'Sequência 2', roman: 'ii – V – I', chords: 'Em – A – D', options: [[Em7r1, A9r, D6r], [Em7r2, A7r, D69]] },
    ],
  },
  {
    id: 'mi', key: 'E', name: 'Mi', page: 15, degrees: [], pending: PENDING,
    sequences: [
      { title: 'Sequência 1', roman: 'I – V – IV – V', chords: 'E – B – A – B', options: [[Emi, Bmi, A9mi, Bmi], [Emi2, B7mi, A7sus4, B7mi]] },
      { title: 'Sequência 2', roman: 'ii – V – I', chords: 'F#m – B – E', options: [[Fsm, B7mi, Emi2], [Fsm, Bmi, Emi]] },
    ],
  },
  {
    id: 'fa', key: 'F', name: 'Fá', page: 21, degrees: [], pending: PENDING,
    sequences: [
      { title: 'Sequência 1', roman: 'I – vi – IV – V', chords: 'F – Dm – A# – C', options: [[Ffa, Dmfa, Bb13, Cfa], [F6fa, Dm7fa, Bbfa, C6fa]] },
      { title: 'Sequência 2', roman: 'I – V – vi – IV', chords: 'F – C – Dm – A#', options: [[F6fa, C6fa, Dm7fa, Bbfa], [Ffa, Cfa, Dmfa, Bb13]] },
    ],
  },
  {
    id: 'sol', key: 'G', name: 'Sol', page: 26, degrees: [], pending: PENDING,
    sequences: [
      { title: 'Sequência 1', roman: 'I – vi – IV – V', chords: 'G – Em – C – D', options: [[Gsol, Emsol, C6sol, D6sol], [Gsol2, EmG, Csus2, Dsol]] },
      { title: 'Sequência 2', roman: 'I – V – vi – IV', chords: 'G – D – Em – C', options: [[Gsol2, Dsol, EmG, Csus2], [Gsol, D6sol, Emsol, C6sol]] },
    ],
  },
  {
    id: 'la', key: 'A', name: 'Lá', page: 32, degrees: [], pending: PENDING,
    sequences: [
      { title: 'Sequência 1', roman: 'I – vi – IV – V', chords: 'A – F#m – D – E', options: [[Ala, Fsmla, Dla, Ela], [Asus2, Fsm11, D6la, Ela2]] },
      { title: 'Sequência 2', roman: 'I – V – vi – IV', chords: 'A – E – F#m – D', options: [[Asus2, Ela2, Fsm11, D6la], [Ala, Ela, Fsmla, Dla]] },
    ],
  },
  {
    id: 'si', key: 'B', name: 'Si', page: 38, degrees: [], pending: PENDING,
    sequences: [
      { title: 'Sequência 1', roman: 'I – V – IV – V', chords: 'B – F# – E – F#', options: [[Bsi, Fs, E6si, Fs], [B7si, Fs69, E6si2, Fs69]] },
      { title: 'Sequência 2', roman: 'ii – V – I', chords: 'C#m – F# – B', options: [[Csm, Fs, B7si], [Csm7, Fs69, Bsi]] },
    ],
  },
]
