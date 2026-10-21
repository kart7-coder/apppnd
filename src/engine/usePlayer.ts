import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ChordShape, Timeline } from '../music/types'
import { indexAt } from '../music/timeline'
import { MetronomeClock } from './clock'
import { audioTimeSource, playClick, strumChord } from './audio'

export interface PlayerOptions {
  timeline: Timeline
  bpm: number
  shapeFor: (chord: string) => ChordShape | undefined
  initialSpeed?: number
  onComplete?: (stats: { speed: number; practicedSec: number }) => void
}

export function usePlayer({ timeline, bpm, shapeFor, initialSpeed = 1, onComplete }: PlayerOptions) {
  const [playing, setPlaying] = useState(false)
  const [beat, setBeat] = useState(0)
  const [speed, setSpeedState] = useState(initialSpeed)
  const [loop, setLoopState] = useState<{ start: number; end: number } | null>(null)
  const [metronome, setMetronomeState] = useState(true)
  const [guide, setGuide] = useState(true)
  const [ended, setEnded] = useState(false)
  const [audioError, setAudioError] = useState<string | null>(null)

  const guideRef = useRef(guide)
  guideRef.current = guide
  const shapeForRef = useRef(shapeFor)
  shapeForRef.current = shapeFor
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete
  const practiced = useRef({ sec: 0, since: 0 })

  const clock = useMemo(() => {
    const bpb = timeline.beatsPerBar
    const c = new MetronomeClock({
      bpm,
      beatsPerBar: bpb,
      endBeat: timeline.totalBeats,
      source: audioTimeSource(),
      onClick: (when, accent) => playClick(when, accent),
      onBeat: (k, when) => {
        if (!guideRef.current || k < 0) return
        // Violão guia: palheta no início de cada compasso com o acorde vigente.
        const i = indexAt(timeline.chords, k + 1e-6)
        const startsHere = i >= 0 && Math.abs(timeline.chords[i].beat - k) < 1e-6
        if (i >= 0 && (startsHere || k % bpb === 0)) {
          const shape = shapeForRef.current(timeline.chords[i].chord)
          if (shape) strumChord(shape, when)
        }
      },
      onEnd: () => {
        stopPracticeTimer()
        setPlaying(false)
        setEnded(true)
        onCompleteRef.current?.({ speed: c.getSpeed(), practicedSec: Math.round(practiced.current.sec) })
      },
    })
    c.seek(-bpb)
    return c
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeline, bpm])

  function stopPracticeTimer() {
    if (practiced.current.since) {
      practiced.current.sec += (performance.now() - practiced.current.since) / 1000
      practiced.current.since = 0
    }
  }

  useEffect(() => {
    clock.setSpeed(speed)
    clock.setMetronome(metronome)
    setBeat(clock.getBeat())
    return () => clock.dispose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clock])

  // Atualiza a interface ~12x por segundo; o canvas lê o relógio direto a 60 fps.
  useEffect(() => {
    if (!playing) return
    let raf = 0
    let last = 0
    const loopFn = (t: number) => {
      if (t - last > 80) {
        last = t
        setBeat(clock.getBeat())
      }
      raf = requestAnimationFrame(loopFn)
    }
    raf = requestAnimationFrame(loopFn)
    return () => cancelAnimationFrame(raf)
  }, [playing, clock])

  // Mantém a tela acesa enquanto toca (quando o navegador suporta).
  useEffect(() => {
    if (!playing || !('wakeLock' in navigator)) return
    let lock: WakeLockSentinel | null = null
    navigator.wakeLock.request('screen').then((l) => (lock = l)).catch(() => {})
    return () => {
      lock?.release().catch(() => {})
    }
  }, [playing])

  // Pausa se o app for para segundo plano.
  useEffect(() => {
    const onHide = () => {
      if (document.hidden && clock.isPlaying()) {
        clock.pause()
        stopPracticeTimer()
        setPlaying(false)
        setBeat(clock.getBeat())
      }
    }
    document.addEventListener('visibilitychange', onHide)
    return () => document.removeEventListener('visibilitychange', onHide)
  }, [clock])

  const play = useCallback(async () => {
    setEnded(false)
    setAudioError(null)
    if (clock.getBeat() >= timeline.totalBeats) clock.seek(-timeline.beatsPerBar)
    try {
      await clock.play()
      practiced.current.since = performance.now()
      setPlaying(true)
    } catch {
      setAudioError('Não foi possível iniciar o áudio. Toque em Play novamente ou verifique se o celular não está no silencioso.')
    }
  }, [clock, timeline])

  const pause = useCallback(() => {
    clock.pause()
    stopPracticeTimer()
    setPlaying(false)
    setBeat(clock.getBeat())
  }, [clock])

  const seek = useCallback(
    (b: number) => {
      const clamped = Math.max(-timeline.beatsPerBar, Math.min(b, timeline.totalBeats - 0.01))
      clock.seek(clamped)
      setEnded(false)
      setBeat(clamped)
    },
    [clock, timeline],
  )

  const restart = useCallback(() => {
    clock.seek(loop ? loop.start - timeline.beatsPerBar : -timeline.beatsPerBar)
    setEnded(false)
    setBeat(clock.getBeat())
  }, [clock, loop, timeline])

  const setSpeed = useCallback(
    (s: number) => {
      clock.setSpeed(s)
      setSpeedState(clock.getSpeed())
    },
    [clock],
  )

  const setLoop = useCallback(
    (l: { start: number; end: number } | null) => {
      clock.setLoop(l)
      setLoopState(clock.getLoop())
      if (l && (clock.getBeat() < l.start || clock.getBeat() >= l.end)) {
        clock.seek(l.start)
        setBeat(l.start)
      }
    },
    [clock],
  )

  const setMetronome = useCallback(
    (on: boolean) => {
      clock.setMetronome(on)
      setMetronomeState(on)
    },
    [clock],
  )

  const chordIndex = indexAt(timeline.chords, beat)
  const lineIndex = indexAt(timeline.lines, beat)

  return {
    clock,
    getBeat: () => clock.getBeat(),
    beat,
    playing,
    ended,
    speed,
    loop,
    metronome,
    guide,
    audioError,
    chordIndex,
    lineIndex,
    play,
    pause,
    seek,
    restart,
    setSpeed,
    setLoop,
    setMetronome,
    setGuide,
  }
}
