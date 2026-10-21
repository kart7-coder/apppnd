import { useEffect, useMemo, useState } from 'react'
import type { ChordShape } from '../music/types'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getSong, songChords, songShape, songTimeline } from '../content'
import { ChordDiagram } from '../components/ChordDiagram'
import { ChordLegend } from '../components/ChordLegend'
import { Hand3D } from '../components/Hand3D'
import { ChordInfo } from '../components/ChordInfo'
import { Icon } from '../components/Icon'
import { describeChange } from '../music/explain'
import { strumChord } from '../engine/audio'

type Step = { kind: 'intro' } | { kind: 'chord'; chord: string } | { kind: 'change'; from: string; to: string } | { kind: 'done' }

export function LearnPage() {
  const { id = '' } = useParams()
  const song = getSong(id)
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
  const step = steps[i]
  const chords = songChords(song)
  const chordSteps = steps.filter((s) => s.kind === 'chord').length

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
        <section className="card learn-card">
          <span className="eyebrow">Aprender do zero</span>
          <h1>{song.title}</h1>
          <p className="lead">
            São <b>{chords.length} acordes</b>. Você aprende um por vez, treina as trocas e depois toca a música.
          </p>
          <div className="chord-row wrap">
            {chords.map((c) => (
              <ChordDiagram key={c} shape={songShape(song, c)} name={c} size={chords.length <= 3 ? 96 : 80} />
            ))}
          </div>
          <ChordLegend />
          <p className="muted small">
            Dica: afine o violão antes de começar. <Link to="/afinador">Abrir o afinador</Link>
          </p>
        </section>
      )}

      {step.kind === 'chord' &&
        (() => {
          const shape = songShape(song, step.chord)
          const n = steps.indexOf(step)
          return (
            <section className="card learn-card">
              <span className="eyebrow">
                Acorde {n} de {chordSteps}
              </span>
              <h1>{step.chord}</h1>
              <div className="learn-chord">
                <div className="hand-stage">
                  <Hand3D shape={shape} aspect={1.8} />
                </div>
                <ChordInfo shape={shape} name={step.chord} />
                {shape?.note && <p className="small warn">{shape.note}</p>}
              </div>
              {shape && (
                <button className="btn" onClick={() => strumChord(shape)}>
                  <Icon name="sound" /> Ouvir como deve soar
                </button>
              )}
              <p className="muted small">Toque corda por corda. Se alguma sair abafada, aperte com a ponta do dedo, bem perto do ferrinho.</p>
            </section>
          )
        })()}

      {step.kind === 'change' &&
        (() => {
          const a = songShape(song, step.from)
          const b = songShape(song, step.to)
          return (
            <section className="card learn-card">
              <span className="eyebrow">Treine a troca</span>
              <h1>
                {step.from} → {step.to}
              </h1>
              <p className="lead">Na música, você vai pular de um para o outro. Treine até conseguir sem olhar muito para a mão.</p>
              <ChangeAnimation from={step.from} to={step.to} a={a} b={b} />
              <ul className="instructions">{a && b && describeChange(a, b).map((t) => <li key={t}>{t}</li>)}</ul>
              <p />
              <Link
                className="btn btn-primary"
                to={`/treino?acordes=${encodeURIComponent(`${step.from},${step.to}`)}&volta=${encodeURIComponent(`/musicas/${song.id}/aprender`)}`}
              >
                <Icon name="bolt" /> Treinar esta troca no ritmo
              </Link>
            </section>
          )
        })()}

      {step.kind === 'done' && (
        <section className="card learn-card">
          <span className="eyebrow">Você conseguiu 🎉</span>
          <h1>Agora é tocar a música</h1>
          <p className="lead">Comece devagar. Quando ficar fácil, aumente a velocidade nos ajustes do player.</p>
          <div className="cta-col">
            <Link className="btn btn-primary" to={`/tocar/${song.id}?modo=pratica`}>
              Tocar agora
            </Link>
            <Link className="btn" to={`/tocar/${song.id}?modo=jogo`}>
              Modo desafio
            </Link>
          </div>
        </section>
      )}

      <div className="step-nav">
        <button className="btn" disabled={i === 0} onClick={() => setI(i - 1)}>
          Voltar
        </button>
        <button className="btn btn-primary" disabled={i === steps.length - 1} onClick={() => setI(i + 1)}>
          {i === 0 ? 'Começar' : 'Próximo'}
        </button>
      </div>
    </div>
  )
}

/** Mostra a mão indo e voltando entre os dois acordes. */
function ChangeAnimation({ from, to, a, b }: { from: string; to: string; a?: ChordShape; b?: ChordShape }) {
  const [onB, setOnB] = useState(false)
  useEffect(() => {
    const id = setInterval(() => setOnB((v) => !v), 1600)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="change-hands">
      <div className="chips">
        <span className={`chip ${!onB ? 'on' : ''}`}>{from}</span>
        <span className="arrow">⇄</span>
        <span className={`chip ${onB ? 'on' : ''}`}>{to}</span>
      </div>
      <div className="hand-stage">
        <Hand3D shape={onB ? b : a} aspect={1.8} />
      </div>
    </div>
  )
}
