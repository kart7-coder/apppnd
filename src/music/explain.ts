// Instruções curtas, em linguagem simples, geradas a partir dos dados da forma.
import type { ChordShape } from './types'

export const STRING_NAME = ['', 'Mi fininha', 'Si', 'Sol', 'Ré', 'Lá', 'Mi grossa']
const FINGER_NAME = ['', 'indicador', 'médio', 'anelar', 'mindinho']

const list = (nums: number[]) => (nums.length > 1 ? `${nums.slice(0, -1).join(', ')} e ${nums[nums.length - 1]}` : `${nums[0]}`)

export function describeShape(shape: ChordShape): string[] {
  const out: string[] = []
  for (const b of shape.barres ?? []) {
    out.push(`Pestana: deite o dedo ${b.finger} (${FINGER_NAME[b.finger]}) na casa ${b.fret}, apertando da corda ${b.fromString} até a corda ${b.toString} ao mesmo tempo.`)
  }
  const inBarre = (str: number, fret: number, finger: number) =>
    (shape.barres ?? []).some((b) => b.fret === fret && b.finger === finger && str <= b.fromString && str >= b.toString)
  shape.frets.forEach((fret, i) => {
    const str = 6 - i
    const finger = shape.fingers[i]
    if (fret > 0 && finger && !inBarre(str, fret, finger)) {
      out.push(`Dedo ${finger} (${FINGER_NAME[finger]}) na corda ${str} (${STRING_NAME[str]}), casa ${fret}.`)
    }
  })
  const muted = shape.frets.map((f, i) => (f < 0 ? 6 - i : 0)).filter(Boolean)
  const open = shape.frets.map((f, i) => (f === 0 ? 6 - i : 0)).filter(Boolean)
  if (open.length) out.push(`Corda${open.length > 1 ? 's' : ''} ${list(open)}: toque solta${open.length > 1 ? 's' : ''}, sem apertar.`)
  if (muted.length) out.push(`Não toque a${muted.length > 1 ? 's' : ''} corda${muted.length > 1 ? 's' : ''} ${list(muted)}.`)
  const played = shape.frets.map((f, i) => (f >= 0 ? 6 - i : 0)).filter(Boolean)
  if (played.length && muted.length) out.push(`Na batida, comece pela corda ${Math.max(...played)}.`)
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
      else if (posA[0].str === posB[0].str) slide.push(`o dedo ${finger} só escorrega na corda ${posB[0].str}, da casa ${posA[0].fret} para a casa ${posB[0].fret}`)
    }
  }
  const tips: string[] = []
  if (stay.length) tips.push(`Boa notícia: o dedo ${list(stay)} fica parado no mesmo lugar. Use-o como âncora.`)
  tips.push(...slide.map((s) => `Atalho: ${s}, sem tirar da corda.`))
  if (!stay.length && !slide.length) tips.push('Nenhum dedo fica no lugar: tire a mão toda e encaixe os dedos juntos, como um carimbo.')
  tips.push('Vá devagar no começo. A velocidade vem com a repetição.')
  return tips
}
