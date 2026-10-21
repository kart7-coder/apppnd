import { useEffect, useRef, useState } from 'react'
import { PitchDetector } from 'pitchy'
import { audioContext, strumChord } from '../engine/audio'
import { STANDARD_TUNING, centsBetween, freqToNote } from '../music/theory'
import { shape } from '../music/chordDb'

type Status = 'idle' | 'starting' | 'listening' | 'error'

const IN_TUNE_CENTS = 5

/** Corda mais próxima da frequência (em cents). */
function nearestString(freq: number) {
  let best = STANDARD_TUNING[0]
  let bestAbs = Infinity
  for (const s of STANDARD_TUNING) {
    const c = Math.abs(centsBetween(freq, s.freq))
    if (c < bestAbs) {
      bestAbs = c
      best = s
    }
  }
  return best
}

export default function TunerPage() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [freq, setFreq] = useState<number | null>(null)
  const [manual, setManual] = useState<number | null>(null)
  const stopRef = useRef<() => void>(() => {})

  useEffect(() => () => stopRef.current(), [])

  async function start() {
    setError('')
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      setStatus('error')
      setError('O microfone só funciona com o app aberto em https. Abra pelo link oficial do app.')
      return
    }
    setStatus('starting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      })
      const ctx = audioContext()
      if (ctx.state !== 'running') await ctx.resume()
      const source = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 4096
      source.connect(analyser)
      const buf = new Float32Array(analyser.fftSize)
      const detector = PitchDetector.forFloat32Array(analyser.fftSize)
      detector.minVolumeDecibels = -45
      const recent: number[] = []
      let raf = 0
      let lastHeard = 0
      const loop = () => {
        analyser.getFloatTimeDomainData(buf)
        const [pitch, clarity] = detector.findPitch(buf, ctx.sampleRate)
        const now = performance.now()
        if (clarity > 0.92 && pitch > 60 && pitch < 1000) {
          recent.push(pitch)
          if (recent.length > 7) recent.shift()
          const sorted = [...recent].sort((a, b) => a - b)
          setFreq(sorted[Math.floor(sorted.length / 2)])
          lastHeard = now
        } else if (now - lastHeard > 1200) {
          recent.length = 0
          setFreq(null)
        }
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
      stopRef.current = () => {
        cancelAnimationFrame(raf)
        source.disconnect()
        stream.getTracks().forEach((t) => t.stop())
      }
      setStatus('listening')
    } catch (e) {
      setStatus('error')
      const name = (e as DOMException)?.name
      setError(
        name === 'NotAllowedError'
          ? 'Permissão do microfone negada. Libere o microfone nas configurações do navegador e tente de novo.'
          : name === 'NotFoundError'
            ? 'Nenhum microfone encontrado neste aparelho.'
            : 'Não foi possível acessar o microfone.',
      )
    }
  }

  function stop() {
    stopRef.current()
    stopRef.current = () => {}
    setStatus('idle')
    setFreq(null)
  }

  const target = manual != null ? STANDARD_TUNING.find((s) => s.string === manual)! : freq ? nearestString(freq) : null
  const cents = freq && target ? Math.round(centsBetween(freq, target.freq)) : null
  const clamped = cents == null ? 0 : Math.max(-50, Math.min(50, cents))
  const inTune = cents != null && Math.abs(cents) <= IN_TUNE_CENTS
  const heard = freq ? freqToNote(freq) : null

  return (
    <div className="page tuner">
      <h1>Afinador</h1>
      <p className="muted">Afinação padrão: Mi · Lá · Ré · Sol · Si · Mi. Toque uma corda solta por vez, perto do celular.</p>

      <div className={`tuner-dial ${inTune ? 'ok' : ''}`} aria-live="polite">
        <div className="tuner-note">
          {target ? target.note : '—'}
          <small>{target ? `${target.string}ª corda · ${target.label}` : status === 'listening' ? 'Toque uma corda' : ''}</small>
        </div>
        <div className="tuner-scale" aria-hidden>
          <span className="tick zero" />
          <div className="needle" style={{ transform: `translateX(-50%) rotate(${clamped * 0.9}deg)`, opacity: cents == null ? 0.25 : 1 }} />
        </div>
        <div className="tuner-hint">
          {cents == null
            ? status === 'listening'
              ? 'Ouvindo…'
              : ''
            : inTune
              ? 'Afinado ✓'
              : cents < 0
                ? `Grave (${cents}). Aperte a tarraxa`
                : `Agudo (+${cents}). Afrouxe a tarraxa`}
        </div>
        {heard && <div className="muted small">Ouvindo: {heard.note}{heard.octave} · {freq!.toFixed(1)} Hz</div>}
      </div>

      {status !== 'listening' ? (
        <button className="btn btn-primary btn-block" onClick={start} disabled={status === 'starting'}>
          {status === 'starting' ? 'Abrindo microfone…' : 'Ativar microfone'}
        </button>
      ) : (
        <button className="btn btn-block" onClick={stop}>
          Parar
        </button>
      )}
      {error && <p className="alert" role="alert">{error}</p>}

      <h2>Corda</h2>
      <div className="string-picker" role="group" aria-label="Escolher corda">
        <button className={`chip ${manual == null ? 'on' : ''}`} onClick={() => setManual(null)}>
          Automático
        </button>
        {STANDARD_TUNING.map((s) => (
          <button key={s.string} className={`chip ${manual === s.string ? 'on' : ''}`} onClick={() => setManual(s.string)}>
            {s.string}ª {s.note}
          </button>
        ))}
      </div>
      <h2>Som de referência</h2>
      <div className="string-picker">
        {STANDARD_TUNING.map((s) => {
          const frets = ['x', 'x', 'x', 'x', 'x', 'x']
          frets[6 - s.string] = '0'
          return (
            <button key={s.string} className="chip" onClick={() => strumChord(shape(s.note, frets.join(''), '000000'))} aria-label={`Ouvir ${s.label}`}>
              ▶ {s.note}
            </button>
          )
        })}
      </div>
      <p className="muted small">
        A precisão pode variar com barulho ao redor, com a qualidade do microfone e com cordas muito velhas. O app só usa o microfone enquanto esta tela está aberta.
      </p>
    </div>
  )
}
