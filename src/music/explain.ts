// Gera instruções curtas em português a partir dos dados da forma.
import type { ChordShape } from './types'

export const STRING_NAME = ['', 'Mi agudo', 'Si', 'Sol', 'Ré', 'Lá', 'Mi grave']
const FINGER_NAME = ['', 'indicador (1)', 'médio (2)', 'anelar (3)', 'mínimo (4)']

export function describeShape(shape: ChordShape): string[] {
  const out: string[] = []
  for (const b of shape.barres ?? []) {
    out.push(`Pestana: ${FINGER_NAME[b.finger]} deitado na casa ${b.fret}, da corda ${b.fromString} à ${b.toString}.`)
  }
  const inBarre = (str: number, fret: number, finger: number) =>
    (shape.barres ?? []).some((b) => b.fret === fret && b.finger === finger && str <= b.fromString && str >= b.toString)
  shape.frets.forEach((fret, i) => {
    const str = 6 - i
    const finger = shape.fingers[i]
    if (fret > 0 && finger && !inBarre(str, fret, finger)) {
      out.push(`Dedo ${FINGER_NAME[finger]} na casa ${fret} da corda ${str} (${STRING_NAME[str]}).`)
    }
  })
  const muted = shape.frets.map((f, i) => (f < 0 ? 6 - i : 0)).filter(Boolean)
  const open = shape.frets.map((f, i) => (f === 0 ? 6 - i : 0)).filter(Boolean)
  if (open.length) out.push(`Cordas soltas (tocar sem apertar): ${open.join(', ')}.`)
  if (muted.length) out.push(`Não toque: corda${muted.length > 1 ? 's' : ''} ${muted.join(', ')}.`)
  const played = shape.frets.map((f, i) => (f >= 0 ? 6 - i : 0)).filter(Boolean)
  if (played.length) out.push(`Comece a batida pela corda ${Math.max(...played)} (${STRING_NAME[Math.max(...played)]}).`)
  return out
}

function fingerPositions(shape: ChordShape) {
  const map = new Map<number, { str: number; fret: number }[]>()
  shape.frets.forEach((fret, i) => {
    const f = shape.fingers[i]
    if (fret > 0 && f) map.set(f, [...(map.get(f) ?? []), { str: 6 - i, fret }])
  })
  return map
}

/** Dicas para trocar de um acorde para outro. */
export function describeChange(from: ChordShape, to: ChordShape): string[] {
  const a = fingerPositions(from)
  const b = fingerPositions(to)
  const stay: number[] = []
  const slide: string[] = []
  for (const [finger, posB] of b) {
    const posA = a.get(finger)
    if (!posA) continue
    if (posA.length === 1 && posB.length === 1) {
      if (posA[0].str === posB[0].str && posA[0].fret === posB[0].fret) stay.push(finger)
      else if (posA[0].str === posB[0].str) slide.push(`${FINGER_NAME[finger]} desliza na corda ${posB[0].str} da casa ${posA[0].fret} para a ${posB[0].fret}`)
    }
  }
  const tips: string[] = []
  if (stay.length) tips.push(`Dedo de apoio: o ${stay.map((f) => FINGER_NAME[f]).join(' e o ')} não sai do lugar. Use-o como guia.`)
  tips.push(...slide.map((s) => `Atalho: o ${s}, sem tirar o dedo da corda.`))
  if (!stay.length && !slide.length) tips.push('Nenhum dedo fica no lugar: tire a mão inteira e coloque todos os dedos juntos, como um "carimbo".')
  tips.push('Comece devagar. Troque no último tempo do compasso para chegar no acorde novo no tempo 1.')
  return tips
}
