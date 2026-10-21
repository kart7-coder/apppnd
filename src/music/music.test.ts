import { parseCifra, isChordLine, isChordToken, chordsUsed } from './cifra'
import { buildTimeline, indexAt, loopTimeline } from './timeline'
import { transposeChord, freqToNote } from './theory'
import { allShapes, bestShape } from './chordDb'
import { HARPA_SONGS } from '../content/songs/harpa'
import { ALL_SONGS } from '../content'
import { arrangedSections } from '../content/defineSong'

describe('cifra', () => {
  it('reconhece acordes e não confunde letra', () => {
    for (const c of ['A', 'F#m7', 'D/F#', 'C7M', 'Bb', 'E7(9)', 'Asus4', 'Am9', 'G#m', 'C#m7(b5)']) expect(isChordToken(c)).toBe(true)
    for (const w of ['Em Jesus', 'E por mim já morreu', 'A vergonha da cruz', 'Deus']) expect(isChordLine(w)).toBe(false)
    expect(isChordLine('  A    D             A')).toBe(true)
    expect(isChordLine('C G Am F7M (2x)')).toBe(true)
  })

  it('associa acordes à linha de letra com a coluna correta', () => {
    const s = parseCifra(`[V1]\nA                    D\nRude cruz se erigiu! Dela o dia fugiu\n[Refrão]\nE  A\nSim`)
    expect(s.map((x) => x.name)).toEqual(['V1', 'Refrão'])
    expect(s[0].lines[0]).toEqual({ lyric: 'Rude cruz se erigiu! Dela o dia fugiu', chords: [{ chord: 'A', col: 0 }, { chord: 'D', col: 21 }] })
    expect(chordsUsed(s)).toEqual(['A', 'D', 'E'])
  })

  it('linha instrumental ganha um compasso por acorde, ou o valor {n}', () => {
    const s = parseCifra(`C G Am F\nC G {8}`)
    expect(s[0].lines[0].bars).toBe(4)
    expect(s[0].lines[1].bars).toBe(8)
    expect(s[0].lines[0].lyric).toBe('')
  })
})

describe('timeline', () => {
  const song = { beatsPerBar: 4, barsPerLine: 2, sections: parseCifra(`A       D\nabcdefghijklmnop\nE\nxyz`) }
  it('posiciona trocas na grade e calcula durações', () => {
    const t = buildTimeline(song)
    expect(t.totalBeats).toBe(16)
    expect(t.chords.map((c) => [c.chord, c.beat, c.durationBeats])).toEqual([
      ['A', 0, 4],
      ['D', 4, 4],
      ['E', 8, 8],
    ])
  })
  it('junta acordes repetidos', () => {
    const t = buildTimeline({ beatsPerBar: 4, barsPerLine: 1, sections: parseCifra(`A\nx\nA\ny`) })
    expect(t.chords).toHaveLength(1)
    expect(t.chords[0].durationBeats).toBe(8)
  })
  it('busca binária encontra o evento atual', () => {
    const ev = [{ beat: 0 }, { beat: 4 }, { beat: 8 }]
    expect(indexAt(ev, -1)).toBe(-1)
    expect(indexAt(ev, 0)).toBe(0)
    expect(indexAt(ev, 7.9)).toBe(1)
    expect(indexAt(ev, 100)).toBe(2)
  })
  it('loop de treino repete a sequência', () => {
    const t = loopTimeline(['A', 'D'], 4, 1, 3)
    expect(t.chords).toHaveLength(6)
    expect(t.totalBeats).toBe(24)
  })
})

describe('theory', () => {
  it('transpõe acordes com baixo', () => {
    expect(transposeChord('D/F#', 2)).toBe('E/G#')
    expect(transposeChord('Bb', 2)).toBe('C')
    expect(transposeChord('F#m7', -1)).toBe('Fm7')
  })
  it('converte frequência em nota', () => {
    expect(freqToNote(440)).toMatchObject({ note: 'A', octave: 4, cents: 0 })
    expect(freqToNote(82.41)).toMatchObject({ note: 'E', octave: 2 })
    expect(freqToNote(446).cents).toBeGreaterThan(20)
  })
})

describe('conteúdo', () => {
  it('formas de acorde são consistentes (dedo só onde há casa pressionada)', () => {
    for (const s of allShapes()) {
      s.frets.forEach((f, i) => {
        if (f <= 0) expect(s.fingers[i], `${s.id} corda ${6 - i}`).toBe(0)
        else expect(s.fingers[i], `${s.id} corda ${6 - i}`).toBeGreaterThan(0)
      })
    }
  })
  it('todas as músicas têm diagramas para todos os acordes e linha do tempo válida', () => {
    expect(HARPA_SONGS).toHaveLength(10)
    expect(new Set(ALL_SONGS.map((s) => s.id)).size).toBe(ALL_SONGS.length)
    for (const song of ALL_SONGS) {
      const secs = arrangedSections(song)
      for (const c of chordsUsed(secs)) expect(bestShape(c, song.shapes?.[c]), `${song.id}: ${c}`).toBeTruthy()
      const t = buildTimeline({ ...song, sections: secs })
      expect(t.totalBeats).toBeGreaterThan(0)
      for (let i = 1; i < t.chords.length; i++) expect(t.chords[i].beat).toBeGreaterThan(t.chords[i - 1].beat)
      expect(new Set(song.sections.map((s) => s.name)).size).toBe(song.sections.length)
    }
  })
})

describe('Método (Tom de Dó, grátis)', async () => {
  const { TONE_DO } = await import('../content/method/do')
  const { shapeNotes } = await import('./theory')
  it('6 graus, 2 sequências, formas consistentes e com a fundamental', () => {
    expect(TONE_DO.degrees).toHaveLength(6)
    expect(TONE_DO.sequences).toHaveLength(2)
    for (const s of [...TONE_DO.degrees.flatMap((d) => d.shapes), ...TONE_DO.sequences.flatMap((x) => x.options.flat())]) {
      s.frets.forEach((f, i) => expect(f > 0, `${s.id}`).toBe(s.fingers[i] > 0))
      if (!s.note) expect(shapeNotes(s.frets), s.id).toContain(s.name.match(/^[A-G][#b]?/)![0])
    }
  })
})
