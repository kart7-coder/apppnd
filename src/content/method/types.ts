import type { ChordShape } from '../../music/types'

export interface MethodDegree {
  degree: string
  chord: string
  label: string
  shapes: ChordShape[]
}

export interface MethodSequence {
  title: string
  roman: string
  chords: string
  options: ChordShape[][]
}

export interface MethodTone {
  id: string
  key: string
  name: string
  /** Página inicial no PDF completo. */
  page: number
  degrees: MethodDegree[]
  sequences: MethodSequence[]
  /** Transcrição parcial: graus ainda não passados para o app. */
  pending?: string
}

export const TONE_LIST = [
  { id: 'do', key: 'C', name: 'Dó' },
  { id: 're', key: 'D', name: 'Ré' },
  { id: 'mi', key: 'E', name: 'Mi' },
  { id: 'fa', key: 'F', name: 'Fá' },
  { id: 'sol', key: 'G', name: 'Sol' },
  { id: 'la', key: 'A', name: 'Lá' },
  { id: 'si', key: 'B', name: 'Si' },
] as const
