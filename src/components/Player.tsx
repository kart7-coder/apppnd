import { useMemo, useState, type ReactNode } from 'react'
import type { ChordShape, SongLine, SyncStatus, Timeline } from '../music/types'
import { usePlayer } from '../engine/usePlayer'
import { Highway, LANE_COLORS } from './Highway'
import { ChordDiagram } from './ChordDiagram'
import { Icon } from './Icon'

export type PlayMode = 'jogo' | 'pratica'

interface Props {
  title: string
  subtitle?: string
  timeline: Timeline
  bpm: number
  sync: SyncStatus
  shapeFor: (chord: string) => ChordShape | undefined
  label?: (chord: string) => string
  mode: PlayMode
  onExit: () => void
  onComplete?: (stats: { speed: number; practicedSec: number }) => void
  headerExtra?: ReactNode
}

const LEVELS = [
  { id: 'facil', label: 'Fácil', speed: 0.6 },
  { id: 'normal', label: 'Normal', speed: 0.8 },
  { id: 'desafio', label: 'Desafio', speed: 1 },
]
const SPEEDS = [0.5, 0.6, 0.75, 0.9, 1, 1.1]

function fmt(beats: number, bpm: number, speed: number) {
  const s = Math.max(0, (beats * 60) / (bpm * speed))
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}

export function Player({ title, subtitle, timeline, bpm, sync, shapeFor, label = (c) => c, mode, onExit, onComplete, headerExtra }: Props) {
  const lanes = useMemo(() => {
    const l: string[] = []
    for (const c of timeline.chords) if (!l.includes(c.chord)) l.push(c.chord)
    return l
  }, [timeline])
  const p = usePlayer({ timeline, bpm, shapeFor, initialSpeed: mode === 'pratica' ? 0.6 : 0.8, onComplete })
  const [showControls, setShowControls] = useState(true)

  // Na contagem regressiva, o primeiro acorde já aparece como "Prepare".
  const preparing = p.chordIndex < 0
  const cur = timeline.chords[Math.max(0, p.chordIndex)]
  const next = preparing ? timeline.chords[1] : timeline.chords[p.chordIndex + 1]
  const line = p.lineIndex >= 0 ? timeline.lines[p.lineIndex] : timeline.lines[0]
  const nextLine = timeline.lines[(p.lineIndex >= 0 ? p.lineIndex : 0) + 1]
  const beatsToNext = next ? next.beat - p.beat : 0
  const countIn = p.beat < 0 ? Math.ceil(-p.beat) : 0

  const sectionRange = (lineIdx: number) => {
    const sec = timeline.lines[lineIdx]?.sectionIndex
    const lines = timeline.lines.filter((l) => l.sectionIndex === sec)
    const start = lines[0].beat
    const last = lines[lines.length - 1]
    return { start, end: last.beat + last.durationBeats, name: lines[0].sectionName }
  }

  const toggleLoop = () => {
    if (p.loop) p.setLoop(null)
    else p.setLoop(sectionRange(Math.max(0, p.lineIndex)))
  }
  const jumpLine = (delta: number) => {
    const target = Math.max(0, Math.min(timeline.lines.length - 1, (p.lineIndex < 0 ? 0 : p.lineIndex) + delta))
    p.seek(timeline.lines[target].beat)
  }

  return (
    <div className="player">
      <header className="player-top">
        <button className="icon-btn" onClick={onExit} aria-label="Sair">
          <Icon name="back" />
        </button>
        <div className="player-title">
          <strong>{title}</strong>
          <span>
            {subtitle}
            {subtitle ? ' · ' : ''}
            {sync === 'synced' ? 'Sincronizado com áudio' : 'Ritmo pelo metrônomo'}
          </span>
        </div>
        {headerExtra}
      </header>

      <div className="player-body">
        <section className="player-stage">
          <Highway timeline={timeline} getBeat={p.getBeat} lanes={lanes} label={label} lookahead={timeline.beatsPerBar * 2} />
          <div className="lane-legend" aria-hidden>
            {lanes.map((c, i) => (
              <span key={c} style={{ color: LANE_COLORS[i % LANE_COLORS.length] }}>
                {label(c)}
              </span>
            ))}
          </div>
          {countIn > 0 && p.playing && <div className="count-in">{countIn}</div>}
          {!p.playing && !p.ended && (
            <button className="stage-play" onClick={p.play} aria-label="Tocar">
              <Icon name="play" />
              <span>{p.beat <= 0 ? 'Começar' : 'Continuar'}</span>
            </button>
          )}
          {p.ended && (
            <div className="stage-result" role="status">
              <h3>Música concluída! 🎉</h3>
              <p>
                Velocidade: <b>{Math.round(p.speed * 100)}%</b>
              </p>
              <p className="muted small">
                Pontuação por acerto só vai existir quando o app puder ouvir o violão. Por enquanto, o objetivo é chegar a 100% de velocidade.
              </p>
              <div className="row gap">
                <button className="btn" onClick={() => { p.restart(); p.play() }}>
                  Tocar de novo
                </button>
                {p.speed < 1 && (
                  <button className="btn btn-primary" onClick={() => { p.setSpeed(Math.min(1, p.speed + 0.1)); p.restart(); p.play() }}>
                    Mais rápido ({Math.round(Math.min(1, p.speed + 0.1) * 100)}%)
                  </button>
                )}
              </div>
            </div>
          )}
        </section>

        <aside className="player-side">
          <div className="chord-now">
            <div className="chord-card current">
              <span className="tag">{preparing ? 'Prepare' : 'Agora'}</span>
              <ChordDiagram shape={cur ? shapeFor(cur.chord) : undefined} name={cur ? label(cur.chord) : '—'} size={150} />
            </div>
            <div className="chord-card next">
              <span className="tag">
                Próximo{next && p.playing && beatsToNext <= timeline.beatsPerBar ? ` em ${Math.ceil(beatsToNext)}` : ''}
              </span>
              {next ? <ChordDiagram shape={shapeFor(next.chord)} name={label(next.chord)} size={104} /> : <p className="muted">Fim</p>}
            </div>
          </div>

          <div className="lyrics" aria-live="polite">
            {line && <div className="section-name">{line.sectionName}</div>}
            {line && <LyricLine line={line.line} label={label} active={preparing ? undefined : cur?.chord} current />}
            {nextLine && <LyricLine line={nextLine.line} label={label} />}
          </div>
        </aside>
      </div>

      {p.audioError && <p className="alert">{p.audioError}</p>}

      <footer className={`player-controls ${showControls ? '' : 'collapsed'}`}>
        <div className="progress">
          <span>{fmt(p.beat, bpm, p.speed)}</span>
          <input
            type="range"
            min={0}
            max={timeline.totalBeats}
            step={0.25}
            value={Math.max(0, p.beat)}
            onChange={(e) => p.seek(Number(e.target.value))}
            aria-label="Posição na música"
          />
          <span>{fmt(timeline.totalBeats, bpm, p.speed)}</span>
        </div>
        <div className="transport">
          <button className="icon-btn" onClick={p.restart} aria-label="Reiniciar">
            <Icon name="restart" />
          </button>
          <button className="icon-btn" onClick={() => jumpLine(-1)} aria-label="Linha anterior">
            <Icon name="prev" />
          </button>
          <button className="icon-btn big" onClick={p.playing ? p.pause : p.play} aria-label={p.playing ? 'Pausar' : 'Tocar'}>
            <Icon name={p.playing ? 'pause' : 'play'} />
          </button>
          <button className="icon-btn" onClick={() => jumpLine(1)} aria-label="Próxima linha">
            <Icon name="next" />
          </button>
          <button className={`icon-btn ${p.loop ? 'on' : ''}`} onClick={toggleLoop} aria-pressed={!!p.loop} aria-label="Repetir este trecho">
            <Icon name="loop" />
          </button>
        </div>
        {p.loop && <p className="loop-info">Repetindo: {sectionRange(Math.max(0, p.lineIndex)).name || 'trecho'}</p>}
        <div className="options">
          {mode === 'jogo' ? (
            <div className="chips" role="group" aria-label="Nível">
              {LEVELS.map((l) => (
                <button key={l.id} className={`chip ${Math.abs(p.speed - l.speed) < 0.01 ? 'on' : ''}`} onClick={() => p.setSpeed(l.speed)}>
                  {l.label}
                </button>
              ))}
            </div>
          ) : (
            <label className="speed">
              Velocidade
              <select value={p.speed} onChange={(e) => p.setSpeed(Number(e.target.value))}>
                {SPEEDS.map((s) => (
                  <option key={s} value={s}>
                    {Math.round(s * 100)}%
                  </option>
                ))}
              </select>
            </label>
          )}
          <button className={`chip ${p.metronome ? 'on' : ''}`} onClick={() => p.setMetronome(!p.metronome)} aria-pressed={p.metronome}>
            Metrônomo
          </button>
          <button className={`chip ${p.guide ? 'on' : ''}`} onClick={() => p.setGuide(!p.guide)} aria-pressed={p.guide}>
            Violão guia
          </button>
          <button className="chip ghost hide-desktop" onClick={() => setShowControls((v) => !v)}>
            {showControls ? 'Menos' : 'Mais'}
          </button>
        </div>
      </footer>
    </div>
  )
}

export function LyricLine({ line, label, active, current }: { line: SongLine; label: (c: string) => string; active?: string; current?: boolean }) {
  if (!line.lyric.trim()) {
    return (
      <p className={`lyric instrumental ${current ? 'current' : ''}`}>
        {line.chords.map((c, i) => (
          <b key={i} className={c.chord === active ? 'active' : ''}>
            {label(c.chord)}
          </b>
        ))}
      </p>
    )
  }
  // Divide a letra nas colunas dos acordes; cada pedaço leva seu acorde em cima.
  const parts: { chord?: string; text: string }[] = []
  const cols = line.chords.map((c) => c.col)
  let cursor = 0
  if (!cols.length || cols[0] > 0) parts.push({ text: line.lyric.slice(0, cols[0] ?? line.lyric.length) })
  line.chords.forEach((c, i) => {
    const start = Math.max(c.col, cursor)
    const end = i + 1 < cols.length ? cols[i + 1] : line.lyric.length
    parts.push({ chord: c.chord, text: line.lyric.slice(start, Math.max(start, end)) || ' ' })
    cursor = end
  })
  return (
    <p className={`lyric ${current ? 'current' : ''}`}>
      {parts.map((pt, i) => (
        <span key={i} className="seg">
          {pt.chord && <b className={pt.chord === active && current ? 'active' : ''}>{label(pt.chord)}</b>}
          <span className="txt">{pt.text}</span>
        </span>
      ))}
    </p>
  )
}
