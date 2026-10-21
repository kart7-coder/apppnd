// Notas, transposição e afinação padrão.

const SHARPS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const FLATS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']

export const NOTE_PT: Record<string, string> = {
  C: 'Dó', D: 'Ré', E: 'Mi', F: 'Fá', G: 'Sol', A: 'Lá', B: 'Si',
}

export function noteIndex(note: string): number {
  const i = SHARPS.indexOf(note)
  return i >= 0 ? i : FLATS.indexOf(note)
}

function shiftNote(note: string, semis: number, preferFlats: boolean): string {
  const i = noteIndex(note)
  if (i < 0) return note
  const j = (((i + semis) % 12) + 12) % 12
  return (preferFlats ? FLATS : SHARPS)[j]
}

/** Transpõe um nome de acorde, incluindo o baixo após "/". */
export function transposeChord(chord: string, semis: number): string {
  if (!semis) return chord
  const m = chord.match(/^([A-G][#b]?)(.*?)(?:\/([A-G][#b]?))?$/)
  if (!m) return chord
  const preferFlats = m[1].includes('b')
  const root = shiftNote(m[1], semis, preferFlats)
  const bass = m[3] ? '/' + shiftNote(m[3], semis, preferFlats) : ''
  return root + m[2] + bass
}

/** Afinação padrão, da 6ª à 1ª corda. */
export const STANDARD_TUNING = [
  { string: 6, note: 'E', octave: 2, freq: 82.41, label: 'Mi grave' },
  { string: 5, note: 'A', octave: 2, freq: 110.0, label: 'Lá' },
  { string: 4, note: 'D', octave: 3, freq: 146.83, label: 'Ré' },
  { string: 3, note: 'G', octave: 3, freq: 196.0, label: 'Sol' },
  { string: 2, note: 'B', octave: 3, freq: 246.94, label: 'Si' },
  { string: 1, note: 'E', octave: 4, freq: 329.63, label: 'Mi agudo' },
]

/** Converte frequência na nota mais próxima e o desvio em cents. */
export function freqToNote(freq: number): { note: string; octave: number; cents: number; midi: number } {
  const midiFloat = 69 + 12 * Math.log2(freq / 440)
  const midi = Math.round(midiFloat)
  const cents = Math.round((midiFloat - midi) * 100)
  return { note: SHARPS[((midi % 12) + 12) % 12], octave: Math.floor(midi / 12) - 1, cents, midi }
}

export function centsBetween(freq: number, target: number): number {
  return 1200 * Math.log2(freq / target)
}

const OPEN_MIDI = [40, 45, 50, 55, 59, 64]

/** Notas tocadas por uma forma (do grave ao agudo, sem repetir). */
export function shapeNotes(frets: number[]): string[] {
  const out: string[] = []
  frets.forEach((f, i) => {
    if (f < 0) return
    const n = SHARPS[(OPEN_MIDI[i] + f) % 12]
    if (!out.includes(n)) out.push(n)
  })
  return out
}
