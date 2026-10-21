// Gera a linha do tempo (em batidas) a partir das seções da música.
// Sem áudio sincronizado, a posição de cada troca é ESTIMADA pela coluna do
// acorde sobre a letra e arredondada para a grade do compasso.
import type { Song, Timeline, ChordEvent, LyricEvent } from './types'

export function buildTimeline(song: Pick<Song, 'sections' | 'beatsPerBar' | 'barsPerLine'>): Timeline {
  const bpb = song.beatsPerBar
  const grid = bpb % 3 === 0 ? 3 : 2
  const chords: ChordEvent[] = []
  const lines: LyricEvent[] = []
  let beat = 0

  song.sections.forEach((section, si) => {
    section.lines.forEach((line, li) => {
      const bars = line.bars ?? song.barsPerLine
      const lineBeats = bars * bpb
      lines.push({ beat, durationBeats: lineBeats, sectionIndex: si, lineIndex: li, sectionName: section.name, line })

      if (line.chords.length) {
        const instrumental = !line.lyric.trim()
        const width = Math.max(line.lyric.length, ...line.chords.map((c) => c.col + c.chord.length), 1)
        let prevOffset = -1
        line.chords.forEach((c, k) => {
          let offset: number
          if (instrumental) {
            // Linha instrumental: divide os compassos igualmente entre os acordes.
            offset = Math.round((k * lineBeats) / line.chords.length)
          } else {
            offset = Math.round(((c.col / width) * lineBeats) / grid) * grid
          }
          if (offset <= prevOffset) offset = prevOffset + 1
          if (offset >= lineBeats) offset = Math.max(prevOffset + 1, lineBeats - 1)
          prevOffset = offset
          chords.push({ chord: c.chord, beat: beat + offset, durationBeats: 0, sectionIndex: si, lineIndex: li })
        })
      }
      beat += lineBeats
    })
  })

  // Junta acordes repetidos em sequência e calcula durações.
  const merged: ChordEvent[] = []
  for (const ev of chords) {
    const last = merged[merged.length - 1]
    if (last && last.chord === ev.chord) continue
    merged.push(ev)
  }
  merged.forEach((ev, i) => {
    const end = i + 1 < merged.length ? merged[i + 1].beat : beat
    ev.durationBeats = end - ev.beat
  })

  return { chords: merged, lines, totalBeats: beat, beatsPerBar: bpb }
}

/** Timeline simples para treinos: cada acorde dura `barsEach` compassos, repetindo `repeats` vezes. */
export function loopTimeline(chordNames: string[], beatsPerBar: number, barsEach: number, repeats: number): Timeline {
  const chords: ChordEvent[] = []
  const lines: LyricEvent[] = []
  let beat = 0
  const dur = beatsPerBar * barsEach
  for (let r = 0; r < repeats; r++) {
    const lineStart = beat
    chordNames.forEach((c) => {
      chords.push({ chord: c, beat, durationBeats: dur, sectionIndex: 0, lineIndex: r })
      beat += dur
    })
    lines.push({
      beat: lineStart,
      durationBeats: beat - lineStart,
      sectionIndex: 0,
      lineIndex: r,
      sectionName: `Rodada ${r + 1}`,
      line: { lyric: '', chords: chordNames.map((chord, col) => ({ chord, col })) },
    })
  }
  return { chords, lines, totalBeats: beat, beatsPerBar }
}

/** Índice do último evento com beat <= pos (busca binária). */
export function indexAt<T extends { beat: number }>(events: T[], pos: number): number {
  let lo = 0
  let hi = events.length - 1
  let ans = -1
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    if (events[mid].beat <= pos) {
      ans = mid
      lo = mid + 1
    } else hi = mid - 1
  }
  return ans
}
