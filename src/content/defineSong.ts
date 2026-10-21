import { parseCifra } from '../music/cifra'
import type { Song, SongSection } from '../music/types'

export function defineSong(meta: Omit<Song, 'sections'>, cifra: string): Song {
  return { ...meta, sections: parseCifra(cifra) }
}

/** Seções na ordem de execução (aplica `arrangement` quando existir). */
export function arrangedSections(song: Song): SongSection[] {
  if (!song.arrangement) return song.sections
  return song.arrangement.map((name) => {
    const s = song.sections.find((x) => x.name === name)
    if (!s) throw new Error(`Seção "${name}" não existe em ${song.id}`)
    return s
  })
}
