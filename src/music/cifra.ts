// Converte cifras no formato "acorde em cima, letra embaixo" em seções/linhas estruturadas.
import type { SongSection, SongLine, ChordAt } from './types'

const CHORD_RE =
  /^[A-G](#|b)?(m(?!aj)|maj|M|dim|aug|sus|add|°|º|\+|-|\d|\(|\)|[#b](?=\d))*(\/[A-G](#|b)?)?$/

export function isChordToken(tok: string): boolean {
  return CHORD_RE.test(tok)
}

/** Linha só de acordes (aceita marcações como "(2x)" e "|"). */
export function isChordLine(line: string): boolean {
  const toks = line
    .trim()
    .split(/\s+/)
    .filter((t) => t && t !== '|' && !/^\(?\d+x\)?$/i.test(t))
  return toks.length > 0 && toks.every(isChordToken)
}

function chordsOf(line: string): ChordAt[] {
  const out: ChordAt[] = []
  const re = /\S+/g
  let m: RegExpExecArray | null
  while ((m = re.exec(line))) {
    if (isChordToken(m[0])) out.push({ chord: m[0], col: m.index })
  }
  return out
}

const SECTION_RE = /^\s*\[(.+)\]\s*$/
/** Sufixo opcional "{4}" no fim da linha de acordes = compassos da linha. */
const BARS_RE = /\s*\{(\d+)\}\s*$/

/**
 * Formato aceito:
 *   [Verso 1]
 *   C            G                  Am
 *     O universo chora, o sol se apagou
 *   C G Am F7M {4}        ← linha instrumental (sem letra), 4 compassos
 */
export function parseCifra(text: string): SongSection[] {
  const sections: SongSection[] = []
  let current: SongSection | null = null
  const ensure = () => {
    if (!current) {
      current = { name: '', lines: [] }
      sections.push(current)
    }
    return current
  }
  const rows = text.replace(/\t/g, '    ').split('\n')
  for (let i = 0; i < rows.length; i++) {
    const raw = rows[i].replace(/\s+$/, '')
    if (!raw.trim()) continue
    const sec = raw.match(SECTION_RE)
    if (sec) {
      current = { name: sec[1].trim(), lines: [] }
      sections.push(current)
      continue
    }
    const barsMatch = raw.match(BARS_RE)
    const body = barsMatch ? raw.replace(BARS_RE, '') : raw
    if (isChordLine(body)) {
      const next = rows[i + 1]?.replace(/\s+$/, '') ?? ''
      const nextIsLyric = next.trim() !== '' && !isChordLine(next.replace(BARS_RE, '')) && !SECTION_RE.test(next)
      const line: SongLine = { lyric: nextIsLyric ? next : '', chords: chordsOf(body) }
      if (barsMatch) line.bars = Number(barsMatch[1])
      if (!nextIsLyric && !barsMatch) line.bars = line.chords.length
      ensure().lines.push(line)
      if (nextIsLyric) i++
    } else {
      ensure().lines.push({ lyric: raw, chords: [] })
    }
  }
  return sections.filter((s) => s.lines.length > 0)
}

/** Lista de acordes distintos na ordem em que aparecem. */
export function chordsUsed(sections: SongSection[]): string[] {
  const seen: string[] = []
  for (const s of sections) for (const l of s.lines) for (const c of l.chords) if (!seen.includes(c.chord)) seen.push(c.chord)
  return seen
}
