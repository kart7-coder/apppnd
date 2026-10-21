// Testes do conteúdo do Método (todos os tons).
describe('Método', async () => {
  const { TONE_DO } = await import('./do')
  const { OTHER_TONES } = await import('./tones')
  const { shapeNotes } = await import('../../music/theory')
  const tones = [TONE_DO, ...OTHER_TONES]

  it('tem os 7 tons, cada sequência com o número certo de acordes', () => {
    expect(tones.map((t) => t.id)).toEqual(['do', 're', 'mi', 'fa', 'sol', 'la', 'si'])
    for (const t of tones)
      for (const s of t.sequences) {
        const n = s.chords.split('–').length
        for (const o of s.options) expect(o, `${t.id} ${s.title}`).toHaveLength(n)
      }
  })

  it('formas consistentes: dedo só em casa pressionada e ids únicos', () => {
    const ids = new Set<string>()
    for (const t of tones) {
      const shapes = [...t.degrees.flatMap((d) => d.shapes), ...t.sequences.flatMap((s) => s.options.flat())]
      for (const s of shapes) {
        s.frets.forEach((f, i) => {
          if (f <= 0) expect(s.fingers[i], `${s.id}`).toBe(0)
          else expect(s.fingers[i], `${s.id} corda ${6 - i}`).toBeGreaterThan(0)
        })
        ids.add(s.id)
      }
    }
    expect(ids.size).toBeGreaterThan(150)
  })

  it('fundamental do acorde está entre as notas (exceto casos anotados)', () => {
    for (const t of tones)
      for (const s of [...t.degrees.flatMap((d) => d.shapes), ...t.sequences.flatMap((x) => x.options.flat())]) {
        const root = s.name.match(/^[A-G][#b]?/)![0]
        if (s.note) continue
        expect(shapeNotes(s.frets), `${s.id} ${s.name} ${s.frets.join(',')}`).toContain(root)
      }
  })
})
