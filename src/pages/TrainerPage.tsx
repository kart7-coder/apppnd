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
          subtitle={`${bpm} bpm · ${bars === 1 ? '1 compasso' : `${bars} compassos`} por acorde`}
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
      <h1>Treino de troca</h1>
      <p className="muted">Escolha de 2 a 4 acordes. O app alterna entre eles no ritmo, e você troca quando o bloco chegar na linha.</p>
      <div className="chips wrap" role="group" aria-label="Acordes">
        {PICKS.map((c) => (
          <button key={c} className={`chip ${chords.includes(c) ? 'on' : ''}`} onClick={() => toggle(c)} aria-pressed={chords.includes(c)}>
            {c}
          </button>
        ))}
      </div>
      <div className="chord-row">
        {chords.map((c) => (
          <ChordDiagram key={c} shape={bestShape(c)} name={c} size={100} />
        ))}
      </div>
      <div className="form-row">
        <label>
          Duração de cada acorde
          <select value={bars} onChange={(e) => setBars(Number(e.target.value))}>
            <option value={2}>2 compassos (mais fácil)</option>
            <option value={1}>1 compasso</option>
          </select>
        </label>
        <label>
          Andamento: {bpm} bpm
          <input type="range" min={40} max={140} step={5} value={bpm} onChange={(e) => setBpm(Number(e.target.value))} />
        </label>
      </div>
      <button className="btn btn-primary btn-block" disabled={chords.length < 2} onClick={() => setStarted(true)}>
        Começar treino
      </button>
    </div>
  )
}
