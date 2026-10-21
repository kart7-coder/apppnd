// Banco de formas de acorde: formas abertas e com pestana usuais ("padrão").
// As formas do Método Acordes Exclusivos ficam em src/content/method e são
// registradas aqui quando carregadas (registerShapes).
import type { ChordShape, Frets, Fingers, Barre } from './types'

/** Atalho: frets "x32010" (x = não tocar; casas ≥10 entre parênteses: "x(10)(12)..."). */
function parseFrets(s: string): Frets {
  const out: number[] = []
  const re = /\((\d+)\)|x|\d/g
  let m: RegExpExecArray | null
  while ((m = re.exec(s))) out.push(m[0] === 'x' ? -1 : Number(m[1] ?? m[0]))
  if (out.length !== 6) throw new Error(`Forma inválida: ${s}`)
  return out as Frets
}

function parseFingers(s: string): Fingers {
  if (s.length !== 6) throw new Error(`Dedos inválidos: ${s}`)
  return s.split('').map(Number) as Fingers
}

export const STD = 'Forma usual (padrão do violão)'

export function shape(
  name: string,
  frets: string,
  fingers: string,
  opts: { barre?: Barre; source?: string; note?: string; rootString?: number; id?: string } = {},
): ChordShape {
  return {
    id: opts.id ?? `${name}@${frets}`,
    name,
    frets: parseFrets(frets),
    fingers: parseFingers(fingers),
    barres: opts.barre ? [opts.barre] : undefined,
    source: opts.source ?? STD,
    note: opts.note,
    rootString: opts.rootString,
  }
}

const b = (fret: number, fromString: number, toString: number, finger = 1): Barre => ({ fret, fromString, toString, finger })

/** Formas padrão: a primeira de cada nome é a preferida. */
export const STANDARD_SHAPES: ChordShape[] = [
  // Maiores
  shape('C', 'x32010', '032010'),
  shape('D', 'xx0232', '000132'),
  shape('E', '022100', '023100'),
  shape('F', '133211', '134211', { barre: b(1, 6, 1) }),
  shape('G', '320003', '210003'),
  shape('G', '320033', '210034', { id: 'G@320033' }),
  shape('A', 'x02220', '001230'),
  shape('B', 'x24442', '012341', { barre: b(2, 5, 1) }),
  shape('Bb', 'x13331', '012341', { barre: b(1, 5, 1) }),
  shape('A#', 'x13331', '012341', { barre: b(1, 5, 1) }),
  shape('F#', '244322', '134211', { barre: b(2, 6, 1) }),
  shape('C#', 'x46664', '012341', { barre: b(4, 5, 1) }),
  shape('Eb', 'x68886', '012341', { barre: b(6, 5, 1) }),
  shape('Ab', '466544', '134211', { barre: b(4, 6, 1) }),
  shape('G#', '466544', '134211', { barre: b(4, 6, 1) }),
  // Menores
  shape('Am', 'x02210', '002310'),
  shape('Dm', 'xx0231', '000231'),
  shape('Em', '022000', '023000'),
  shape('Bm', 'x24432', '013421', { barre: b(2, 5, 1) }),
  shape('F#m', '244222', '134111', { barre: b(2, 6, 1) }),
  shape('C#m', 'x46654', '013421', { barre: b(4, 5, 1) }),
  shape('G#m', '466444', '134111', { barre: b(4, 6, 1) }),
  shape('Fm', '133111', '134111', { barre: b(1, 6, 1) }),
  shape('Gm', '355333', '134111', { barre: b(3, 6, 1) }),
  shape('Cm', 'x35543', '013421', { barre: b(3, 5, 1) }),
  shape('D#m', 'x68876', '013421', { barre: b(6, 5, 1) }),
  shape('Ebm', 'x68876', '013421', { barre: b(6, 5, 1) }),
  shape('A#m', 'x13321', '013421', { barre: b(1, 5, 1) }),
  shape('Bbm', 'x13321', '013421', { barre: b(1, 5, 1) }),
  // Com sétima
  shape('A7', 'x02020', '002030'),
  shape('B7', 'x21202', '021304'),
  shape('C7', 'x32310', '032410'),
  shape('D7', 'xx0212', '000213'),
  shape('E7', '020100', '020100'),
  shape('G7', '320001', '320001'),
  shape('F7', '131211', '131211', { barre: b(1, 6, 1) }),
  shape('F#7', '242322', '131211', { barre: b(2, 6, 1) }),
  shape('C#7', 'x46464', '013141', { barre: b(4, 5, 1) }),
  shape('Am7', 'x02010', '002010'),
  shape('Dm7', 'xx0211', '000211'),
  shape('Em7', '022030', '012030'),
  shape('Bm7', 'x24232', '013121', { barre: b(2, 5, 1) }),
  shape('F#m7', '242222', '131111', { barre: b(2, 6, 1) }),
  shape('C#m7', 'x46454', '013141', { barre: b(4, 5, 1) }),
  shape('G#m7', '464444', '131111', { barre: b(4, 6, 1) }),
  // Sétima maior
  shape('C7M', 'x32000', '032000'),
  shape('D7M', 'xx0222', '000111'),
  shape('E7M', '021100', '031200'),
  shape('F7M', 'xx3210', '003210'),
  shape('G7M', '320002', '320001'),
  shape('A7M', 'x02120', '002130'),
  // Nona, suspensos e outros
  shape('A9', 'x02420', '001310'),
  shape('D9', 'xx0230', '000130'),
  shape('E9', '022102', '023104'),
  shape('C9', 'x32030', '021030'),
  shape('G9', '300003', '200003'),
  shape('F9', 'xx3213', '003214'),
  shape('G6', '320000', '210000'),
  shape('Dm7(9)', 'x5355x', '021340'),
  shape('F7M(9)', 'xx3253', '002143'),
  shape('Dsus4', 'xx0233', '000134'),
  shape('D4', 'xx0233', '000134'),
  shape('Asus4', 'x02230', '001240'),
  shape('A4', 'x02230', '001240'),
  shape('Esus4', '022200', '023400'),
  shape('E4', '022200', '023400'),
  shape('Dsus2', 'xx0230', '000120'),
  shape('Asus2', 'x02200', '001200'),
  shape('Cadd9', 'x32033', '021034'),
  shape('E5', '022xxx', '012000'),
  // Inversões comuns
  shape('D/F#', '2x0232', '200143'),
  shape('G/B', 'x20003', '010003'),
  shape('C/E', '032010', '032010'),
  shape('E/G#', '4x2100', '402100'),
  shape('A/C#', 'x42220', '041110', { barre: b(2, 4, 2) }),
  shape('C/G', '332010', '342010'),
  shape('F/A', 'x03211', '003211'),
  shape('Am/G', '3x2210', '402310'),
  shape('B/D#', 'x6444x', '041110', { barre: b(4, 4, 2) }),
  shape('F#/A#', 'x1342x', '013420'),
]

const ALL: ChordShape[] = [...STANDARD_SHAPES]
const byId = new Map(ALL.map((s) => [s.id, s]))

export function registerShapes(shapes: ChordShape[]) {
  for (const s of shapes) {
    if (!byId.has(s.id)) {
      ALL.push(s)
      byId.set(s.id, s)
    }
  }
}

export function shapeById(id: string): ChordShape | undefined {
  return byId.get(id)
}

/** Nomes equivalentes usados nas cifras. */
const ALIASES: Record<string, string> = {
  F7M: 'F7M', Fmaj7: 'F7M', C7M: 'C7M', Cmaj7: 'C7M', G7M: 'G7M', Gmaj7: 'G7M', D7M: 'D7M', A7M: 'A7M', E7M: 'E7M',
  Db: 'C#', 'D#': 'Eb', Gb: 'F#', 'Gbm': 'F#m', Dbm: 'C#m', Abm: 'G#m',
}

/** Todas as formas para um nome, preferindo o id indicado. */
export function shapesFor(name: string, preferredId?: string): ChordShape[] {
  const canonical = ALIASES[name] ?? name
  const list = ALL.filter((s) => s.name === name || s.name === canonical)
  if (preferredId) {
    const p = byId.get(preferredId)
    if (p) return [p, ...list.filter((s) => s.id !== p.id)]
  }
  return list
}

export function bestShape(name: string, preferredId?: string): ChordShape | undefined {
  return shapesFor(name, preferredId)[0]
}

export function allShapes(): ChordShape[] {
  return ALL
}
