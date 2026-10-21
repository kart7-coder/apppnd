import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Player } from '../components/Player'
import { ChordDiagram } from '../components/ChordDiagram'
import { bestShape } from '../music/chordDb'
import { loopTimeline } from '../music/timeline'

const PICKS = ['A', 'D', 'E', 'G', 'C', 'Am', 'Em', 'Dm', 'F', 'Bm', 'F#m', 'C#m', 'B7', 'E7', 'A7', 'D7', 'G7', 'F7M', 'D9', 'A9']

/** Treino de troca: alterna 2–4 acordes em loop, no metrônomo. */
export function TrainerPage() {
  const [params] = useSearchParams()
  const nav = useNavigate()
  const initial = (params.get('acordes') ?? '').split(',').filter(Boolean)
  const back = params.get('volta')
  const [chords, setChords] = useState<string[]>(initial.length ? initial : ['A', 'D'])
  const [bars, setBars] = useState(1)
  const [bpm, setBpm] = useState(70)
  const [started, setStarted] = useState(initial.length > 0)

  const timeline = useMemo(() => loopTimeline(chords.length ? chords : ['A'], 4, bars, 16), [chords, bars])

  const toggle = (c: string) =>
    setChords((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : prev.length >= 4 ? prev : [...prev, c]))

  if (started && chords.length >= 2)
    return (
      <div className="trainer-full">
        <Player
          key={chords.join() + bars + bpm}
          title={`Treino: ${chords.join(' → ')}`}
          subtitle={`${bars === 1 ? '4' : '8'} batidas em cada acorde`}
          timeline={timeline}
          bpm={bpm}
          sync="estimated"
          shapeFor={(c) => bestShape(c)}
          mode="pratica"
          onExit={() => (back ? nav(back) : setStarted(false))}
        />
      </div>
    )

  return (
    <div className="page">
      <header className="page-head">
        <span className="eyebrow">Treino de troca</span>
        <h1>Troque de acorde sem travar</h1>
        <p className="lead">A parte mais difícil do começo é trocar de acorde a tempo. Escolha de 2 a 4 acordes e o app alterna entre eles no ritmo, como um exercício.</p>
      </header>
      <div className="chips wrap" role="group" aria-label="Acordes">
        {PICKS.map((c) => (
          <button key={c} className={`chip ${chords.includes(c) ? 'on' : ''}`} onClick={() => toggle(c)} aria-pressed={chords.includes(c)}>
            {c}
          </button>
        ))}
      </div>
      <p className="muted small">{chords.length < 2 ? 'Escolha pelo menos 2 acordes.' : `Selecionados: ${chords.join(' → ')}`}</p>
      <div className="chord-row">
        {chords.map((c) => (
          <ChordDiagram key={c} shape={bestShape(c)} name={c} size={100} />
        ))}
      </div>
      <div className="form-row">
        <label>
          Tempo em cada acorde
          <select value={bars} onChange={(e) => setBars(Number(e.target.value))}>
            <option value={2}>8 batidas (mais fácil)</option>
            <option value={1}>4 batidas</option>
          </select>
        </label>
        <label>
          Velocidade: {bpm < 60 ? 'bem devagar' : bpm < 85 ? 'devagar' : bpm < 110 ? 'média' : 'rápida'} ({bpm} batidas por minuto)
          <input type="range" min={40} max={140} step={5} value={bpm} onChange={(e) => setBpm(Number(e.target.value))} />
        </label>
      </div>
      <div className="narrow center">
        <button className="btn btn-primary btn-block" disabled={chords.length < 2} onClick={() => setStarted(true)}>
          Começar treino
        </button>
      </div>
    </div>
  )
}
