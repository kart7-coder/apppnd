import { registerShapes } from '../../music/chordDb'
import type { ChordShape } from '../../music/types'
import { TONE_DO } from './do'
import { OTHER_TONES } from './tones'
import type { MethodTone } from './types'

export * from './types'

/** Os 7 tons, todos gratuitos. */
export const ALL_TONES: MethodTone[] = [TONE_DO, ...OTHER_TONES]

export function allToneShapes(t: MethodTone): ChordShape[] {
  return [...t.degrees.flatMap((d) => d.shapes), ...t.sequences.flatMap((s) => s.options.flat())]
}

const METHOD_SHAPES = ALL_TONES.flatMap(allToneShapes)
registerShapes(METHOD_SHAPES)

export function getTone(id: string): MethodTone | undefined {
  return ALL_TONES.find((t) => t.id === id)
}

/** Formas do método (para o dicionário de acordes). */
export function methodShapes(): ChordShape[] {
  return METHOD_SHAPES
}
