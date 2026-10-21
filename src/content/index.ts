import type { Song } from '../music/types'
import { buildTimeline } from '../music/timeline'
import { chordsUsed } from '../music/cifra'
import { bestShape } from '../music/chordDb'
import { HARPA_SONGS } from './songs/harpa'
import { LOUVOR_SONGS } from './songs/louvores'
import { arrangedSections } from './defineSong'

export const ALL_SONGS: Song[] = [...HARPA_SONGS, ...LOUVOR_SONGS]

export const CATEGORY_LABEL: Record<Song['category'], string> = {
  harpa: 'Harpa Cristã',
  louvor: 'Louvores',
  corinho: 'Corinhos',
  exercicio: 'Exercícios',
}

export const DIFFICULTY_LABEL = { 1: 'Iniciante', 2: 'Intermediário', 3: 'Avançado' } as const

export function getSong(id: string): Song | undefined {
  return ALL_SONGS.find((s) => s.id === id)
}

const tlCache = new Map<string, ReturnType<typeof buildTimeline>>()
export function songTimeline(song: Song) {
  let t = tlCache.get(song.id)
  if (!t) {
    t = buildTimeline({ ...song, sections: arrangedSections(song) })
    tlCache.set(song.id, t)
  }
  return t
}

export function songChords(song: Song): string[] {
  return chordsUsed(song.sections)
}

export function songShape(song: Song, chord: string) {
  return bestShape(chord, song.shapes?.[chord])
}
