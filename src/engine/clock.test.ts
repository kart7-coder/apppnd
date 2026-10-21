import { MetronomeClock, type TimeSource } from './clock'

function fakeSource() {
  let t = 100
  const src: TimeSource & { advance(s: number): void } = {
    now: () => t,
    resume: async () => {},
    advance: (s: number) => {
      t += s
    },
  }
  return src
}

function make(extra: Partial<ConstructorParameters<typeof MetronomeClock>[0]> = {}) {
  const source = fakeSource()
  const clicks: number[] = []
  const clock = new MetronomeClock({
    bpm: 120,
    beatsPerBar: 4,
    endBeat: 32,
    source,
    setTicker: () => () => {},
    onClick: (when) => clicks.push(when),
    ...extra,
  })
  return { clock, source, clicks }
}

describe('MetronomeClock', () => {
  it('avança pela fonte de tempo, não por contagem de timers', async () => {
    const { clock, source } = make()
    await clock.play()
    source.advance(1.5) // 120 bpm → 3 batidas
    expect(clock.getBeat()).toBeCloseTo(3)
  })

  it('pausa e retoma sem perder a posição', async () => {
    const { clock, source } = make()
    await clock.play()
    source.advance(1)
    clock.pause()
    source.advance(10)
    expect(clock.getBeat()).toBeCloseTo(2)
    await clock.play()
    source.advance(0.5)
    expect(clock.getBeat()).toBeCloseTo(3)
  })

  it('mudar a velocidade mantém a posição e altera o ritmo de avanço', async () => {
    const { clock, source } = make()
    await clock.play()
    source.advance(1) // 2 batidas
    clock.setSpeed(0.5)
    expect(clock.getBeat()).toBeCloseTo(2)
    source.advance(1) // a 60 bpm efetivos → +1 batida
    expect(clock.getBeat()).toBeCloseTo(3)
  })

  it('loop volta ao início do trecho', async () => {
    const { clock, source } = make()
    clock.setLoop({ start: 4, end: 8 })
    clock.seek(4)
    await clock.play()
    source.advance(2.1) // passaria da batida 8
    clock.tick()
    expect(clock.getBeat()).toBeGreaterThanOrEqual(4)
    expect(clock.getBeat()).toBeLessThan(5)
  })

  it('para no fim e avisa', async () => {
    let ended = false
    const { clock, source } = make({ onEnd: () => (ended = true) })
    await clock.play()
    source.advance(20)
    clock.tick()
    expect(ended).toBe(true)
    expect(clock.isPlaying()).toBe(false)
    expect(clock.getBeat()).toBe(32)
  })

  it('agenda cliques nos instantes exatos das batidas', async () => {
    const { clock, source, clicks } = make()
    clock.seek(-4) // contagem regressiva
    await clock.play()
    for (let i = 0; i < 40; i++) {
      source.advance(0.025)
      clock.tick()
    }
    // 1 s a 120 bpm: batidas -4..-2 (e a próxima dentro do lookahead)
    expect(clicks.slice(0, 3).map((c) => +(c - 100).toFixed(3))).toEqual([0, 0.5, 1])
  })
})
