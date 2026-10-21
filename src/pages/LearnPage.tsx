import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getSong, songChords, songShape, songTimeline } from '../content'
import { ChordDiagram } from '../components/ChordDiagram'
import { Icon } from '../components/Icon'
import { describeChange, describeShape } from '../music/explain'
import { strumChord } from '../engine/audio'
import { useAuth, hasProduct } from '../lib/auth'

type Step = { kind: 'intro' } | { kind: 'chord'; chord: string } | { kind: 'change'; from: string; to: string } | { kind: 'done' }

export function LearnPage() {
  const { id = '' } = useParams()
  const song = getSong(id)
  const auth = useAuth()
  const [i, setI] = useState(0)

  const steps = useMemo<Step[]>(() => {
    if (!song) return []
    const chords = songChords(song)
    const changes: { from: string; to: string }[] = []
    const tl = songTimeline(song)
    for (let k = 1; k < tl.chords.length; k++) {
      const from = tl.chords[k - 1].chord
      const to = tl.chords[k].chord
      const key = [from, to].sort().join('|')
      if (!changes.some((c) => [c.from, c.to].sort().join('|') === key)) changes.push({ from, to })
    }
    return [
      { kind: 'intro' },
      ...chords.map((chord) => ({ kind: 'chord' as const, chord })),
      ...changes.map((c) => ({ kind: 'change' as const, ...c })),
      { kind: 'done' },
    ]
  }, [song])

  if (!song) return <Navigate to="/musicas" replace />
  if (!hasProduct(auth, song.product)) return <Navigate to={`/musicas/${id}`} replace />
  const step = steps[i]
  const chords = songChords(song)

  return (
    <div className="page learn">
      <Link to={`/musicas/${song.id}`} className="back-link">
        <Icon name="back" size={18} /> {song.title}
      </Link>
      <div className="steps-bar" aria-label={`Etapa ${i + 1} de ${steps.length}`}>
        {steps.map((_, k) => (
          <span key={k} className={k <= i ? 'on' : ''} />
        ))}
      </div>

      {step.kind === 'intro' && (
        <section className="learn-card">
          <p className="eyebrow">Aprender passo a passo</p>
          <h1>{song.title}</h1>
          <p>
            Esta música usa <b>{chords.length} acordes</b>. Primeiro você aprende cada um. Depois treina as trocas entre eles e, no fim, toca a música inteira.
          </p>
          <div className="chord-row">
            {chords.map((c) => (
              <ChordDiagram key={c} shape={songShape(song, c)} name={c} size={96} />
            ))}
          </div>
          <p className="muted small">Dica: afine o violão antes. <Link to="/afinador">Abrir afinador</Link></p>
        </section>
      )}

      {step.kind === 'chord' && (() => {
        const shape = songShape(song, step.chord)
        return (
          <section className="learn-card">
            <p className="eyebrow">Acorde</p>
            <h1>{step.chord}</h1>
            <div className="learn-chord">
              <ChordDiagram shape={shape} name={step.chord} size={190} />
              <ul className="instructions">
                {shape ? describeShape(shape).map((t) => <li key={t}>{t}</li>) : <li>Diagrama ainda não cadastrado.</li>}
                {shape?.note && <li className="warn">{shape.note}</li>}
              </ul>
            </div>
            {shape && (
              <button className="btn" onClick={() => strumChord(shape)}>
                <Icon name="sound" /> Ouvir como soa
              </button>
            )}
            <p className="muted small">Toque corda por corda e verifique se nenhuma está abafada.</p>
          </section>
        )
      })()}

      {step.kind === 'change' && (() => {
        const a = songShape(song, step.from)
        const b = songShape(song, step.to)
        return (
          <section className="learn-card">
            <p className="eyebrow">Troca de acorde</p>
            <h1>
              {step.from} → {step.to}
            </h1>
            <div className="change-pair">
              <ChordDiagram shape={a} name={step.from} size={130} />
              <span className="arrow">→</span>
              <ChordDiagram shape={b} name={step.to} size={130} />
            </div>
            <ul className="instructions">{a && b && describeChange(a, b).map((t) => <li key={t}>{t}</li>)}</ul>
            <Link className="btn btn-primary" to={`/treino?acordes=${encodeURIComponent(`${step.from},${step.to}`)}&volta=${encodeURIComponent(`/musicas/${song.id}/aprender`)}`}>
              <Icon name="bolt" /> Treinar esta troca
            </Link>
          </section>
        )
      })()}

      {step.kind === 'done' && (
        <section className="learn-card">
          <p className="eyebrow">Pronto!</p>
          <h1>Agora toque a música</h1>
          <p>Comece na prática guiada a 60% e vá subindo a velocidade até 100%.</p>
          <div className="cta-row">
            <Link className="btn btn-primary" to={`/tocar/${song.id}?modo=pratica`}>
              Prática guiada
            </Link>
            <Link className="btn" to={`/tocar/${song.id}?modo=jogo`}>
              Modo jogo
            </Link>
          </div>
        </section>
      )}

      <div className="step-nav">
        <button className="btn" disabled={i === 0} onClick={() => setI(i - 1)}>
          Voltar
        </button>
        <button className="btn btn-primary" disabled={i === steps.length - 1} onClick={() => setI(i + 1)}>
          Avançar
        </button>
      </div>
    </div>
  )
}
