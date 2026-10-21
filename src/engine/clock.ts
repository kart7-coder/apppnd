// Relógio musical. A posição é sempre calculada a partir do relógio de áudio
// (AudioContext.currentTime), nunca somando intervalos de timer, para não
// perder a sincronia ao pausar, voltar ou mudar a velocidade.

export interface MusicClock {
  /** Posição atual em batidas (negativa durante a contagem regressiva). */
  getBeat(): number
  isPlaying(): boolean
  play(): Promise<void>
  pause(): void
  seek(beat: number): void
  setSpeed(speed: number): void
  getSpeed(): number
  setLoop(loop: { start: number; end: number } | null): void
  getLoop(): { start: number; end: number } | null
  setMetronome(on: boolean): void
  dispose(): void
}

/** Fonte de tempo; injetável para testes. */
export interface TimeSource {
  now(): number
  resume(): Promise<void>
}

export interface MetronomeClockOptions {
  bpm: number
  beatsPerBar: number
  /** Batida final da música; ao chegar, o relógio para. */
  endBeat: number
  onEnd?: () => void
  /** Chamado para tocar um clique no instante `when` (segundos da fonte). */
  onClick?: (when: number, accent: boolean) => void
  /** Chamado ao cruzar o início de cada batida (para disparar sons de acorde etc.). */
  onBeat?: (beat: number, when: number) => void
  source: TimeSource
  /** Função de agendamento; padrão setInterval. */
  setTicker?: (fn: () => void, ms: number) => () => void
}

const LOOKAHEAD_SEC = 0.12
const TICK_MS = 25

export class MetronomeClock implements MusicClock {
  private anchorTime = 0
  private anchorBeat = 0
  private speed = 1
  private playing = false
  private loop: { start: number; end: number } | null = null
  private metronome = true
  private nextClickBeat = 0
  private stopTicker: (() => void) | null = null
  private opts: MetronomeClockOptions

  constructor(opts: MetronomeClockOptions) {
    this.opts = opts
  }

  private secPerBeat() {
    return 60 / (this.opts.bpm * this.speed)
  }

  getBeat(): number {
    if (!this.playing) return this.anchorBeat
    return this.anchorBeat + (this.opts.source.now() - this.anchorTime) / this.secPerBeat()
  }

  isPlaying() {
    return this.playing
  }

  async play() {
    if (this.playing) return
    await this.opts.source.resume()
    if (this.anchorBeat >= this.opts.endBeat) this.anchorBeat = 0
    this.anchorTime = this.opts.source.now()
    this.playing = true
    this.nextClickBeat = Math.ceil(this.anchorBeat - 1e-6)
    const ticker = this.opts.setTicker ?? ((fn, ms) => {
      const id = setInterval(fn, ms)
      return () => clearInterval(id)
    })
    this.stopTicker = ticker(() => this.tick(), TICK_MS)
    this.tick()
  }

  pause() {
    if (!this.playing) return
    this.anchorBeat = this.getBeat()
    this.playing = false
    this.stopTicker?.()
    this.stopTicker = null
  }

  seek(beat: number) {
    this.anchorBeat = beat
    this.anchorTime = this.opts.source.now()
    this.nextClickBeat = Math.ceil(beat - 1e-6)
  }

  setSpeed(speed: number) {
    const b = this.getBeat()
    this.speed = Math.min(1.5, Math.max(0.25, speed))
    this.anchorBeat = b
    this.anchorTime = this.opts.source.now()
  }

  getSpeed() {
    return this.speed
  }

  setLoop(loop: { start: number; end: number } | null) {
    this.loop = loop && loop.end > loop.start ? loop : null
  }

  getLoop() {
    return this.loop
  }

  setMetronome(on: boolean) {
    this.metronome = on
  }

  /** Agenda cliques à frente e trata loop/fim. Exposto para testes. */
  tick() {
    if (!this.playing) return
    const beat = this.getBeat()
    if (this.loop && beat >= this.loop.end) {
      this.seek(this.loop.start)
    } else if (beat >= this.opts.endBeat) {
      this.anchorBeat = this.opts.endBeat
      this.playing = false
      this.stopTicker?.()
      this.stopTicker = null
      this.opts.onEnd?.()
      return
    }
    const now = this.opts.source.now()
    const horizon = this.getBeat() + LOOKAHEAD_SEC / this.secPerBeat()
    const limit = this.loop ? Math.min(horizon, this.loop.end) : horizon
    while (this.nextClickBeat < limit) {
      const k = this.nextClickBeat
      const when = this.anchorTime + (k - this.anchorBeat) * this.secPerBeat()
      if (when >= now - 0.01) {
        const bpb = this.opts.beatsPerBar
        if (this.metronome || k < 0) this.opts.onClick?.(Math.max(when, now), ((k % bpb) + bpb) % bpb === 0)
        this.opts.onBeat?.(k, Math.max(when, now))
      }
      this.nextClickBeat++
    }
  }

  dispose() {
    this.pause()
  }
}
