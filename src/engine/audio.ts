// Áudio do navegador: AudioContext compartilhado, clique de metrônomo e um
// "violão" sintetizado (Karplus-Strong simplificado) para ouvir o acorde.
import type { ChordShape } from '../music/types'
import type { TimeSource } from './clock'

let ctx: AudioContext | null = null

export function audioContext(): AudioContext {
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    ctx = new Ctor()
  }
  return ctx
}

export function audioTimeSource(): TimeSource {
  return {
    now: () => audioContext().currentTime,
    // Navegadores móveis só liberam áudio após um toque do usuário.
    resume: async () => {
      const c = audioContext()
      if (c.state !== 'running') await c.resume()
    },
  }
}

export function playClick(when: number, accent: boolean, volume = 0.5) {
  const c = audioContext()
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.frequency.value = accent ? 1600 : 1000
  gain.gain.setValueAtTime(0.0001, when)
  gain.gain.exponentialRampToValueAtTime(volume * (accent ? 1 : 0.6), when + 0.002)
  gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.06)
  osc.connect(gain).connect(c.destination)
  osc.start(when)
  osc.stop(when + 0.08)
}

const OPEN_MIDI = [40, 45, 50, 55, 59, 64] // E2 A2 D3 G3 B3 E4

function pluckBuffer(c: AudioContext, freq: number, seconds: number): AudioBuffer {
  const rate = c.sampleRate
  const len = Math.floor(rate * seconds)
  const buf = c.createBuffer(1, len, rate)
  const data = buf.getChannelData(0)
  const period = Math.max(2, Math.round(rate / freq))
  const ring = new Float32Array(period)
  for (let i = 0; i < period; i++) ring[i] = Math.random() * 2 - 1
  let idx = 0
  for (let i = 0; i < len; i++) {
    const next = (idx + 1) % period
    const v = 0.498 * (ring[idx] + ring[next])
    data[i] = ring[idx]
    ring[idx] = v
    idx = next
  }
  return buf
}

const bufferCache = new Map<number, AudioBuffer>()

/** Toca o acorde como uma palhetada para baixo, corda por corda. */
export function strumChord(shape: ChordShape, when?: number, volume = 0.35) {
  const c = audioContext()
  const t0 = when ?? c.currentTime
  let k = 0
  shape.frets.forEach((fret, i) => {
    if (fret < 0) return
    const midi = OPEN_MIDI[i] + fret
    let buf = bufferCache.get(midi)
    if (!buf) {
      buf = pluckBuffer(c, 440 * Math.pow(2, (midi - 69) / 12), 2.2)
      bufferCache.set(midi, buf)
    }
    const src = c.createBufferSource()
    src.buffer = buf
    const g = c.createGain()
    g.gain.value = volume
    src.connect(g).connect(c.destination)
    src.start(t0 + k * 0.018)
    k++
  })
}
