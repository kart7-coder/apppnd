import { useMemo, useState, type ReactNode } from 'react'
import type { ChordShape, SongLine, SyncStatus, Timeline } from '../music/types'
import { usePlayer } from '../engine/usePlayer'
import { Highway, LANE_COLORS } from './Highway'
import { ChordDiagram } from './ChordDiagram'
import { HandView } from './HandView'
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

const SPEEDS = [
  { v: 0.5, label: 'Bem devagar' },
  { v: 0.6, label: 'Devagar' },
  { v: 0.8, label: 'Médio' },
  { v: 1, label: 'Normal' },
]

function fmt(beats: number, bpm: number, speed: number) {
  const s = Math.max(0, (beats * 60) / (bpm * speed))
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}

function readView(): 'mao' | 'desenho' {
  try {
    return localStorage.getItem('ae-view') === 'desenho' ? 'desenho' : 'mao'
  } catch {
    return 'mao'
  }
}

export function Player({ title, subtitle, timeline, bpm, shapeFor, label = (c) => c, mode, onExit, onComplete }: Props) {
  const lanes = useMemo(() => {
    const l: string[] = []
    for (const c of timeline.chords) if (!l.includes(c.chord)) l.push(c.chord)
    return l
  }, [timeline])
  const p = usePlayer({ timeline, bpm, shapeFor, initialSpeed: mode === 'pratica' ? 0.6 : 0.8, onComplete })
  const [settings, setSettings] = useState(false)
  const [view, setViewState] = useState(readView)
  const setView = (v: 'mao' | 'desenho') => {
    setViewState(v)
    try {
      localStorage.setItem('ae-view', v)
    } catch {
      /* sem armazenamento: só nesta sessão */
    }
  }

  // Na contagem regressiva, o primeiro acorde já aparece como "Prepare".
  const preparing = p.chordIndex < 0
  const cur = timeline.chords[Math.max(0, p.chordIndex)]
  const next = preparing ? timeline.chords[1] : timeline.chords[p.chordIndex + 1]
  const line = p.lineIndex >= 0 ? timeline.lines[p.lineIndex] : timeline.lines[0]
  const nextLine = timeline.lines[(p.lineIndex >= 0 ? p.lineIndex : 0) + 1]
  const beatsToNext = next ? next.beat - p.beat : 0
  const countIn = p.beat < 0 ? Math.ceil(-p.beat) : 0
  const curShape = cur ? shapeFor(cur.chord) : undefined
  const soon = next && p.playing && beatsToNext <= timeline.beatsPerBar

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
  const speedLabel = SPEEDS.find((s) => Math.abs(s.v - p.speed) < 0.01)?.label ?? `${Math.round(p.speed * 100)}%`

  return (
    <div className="player">
      <header className="player-top">
        <button className="icon-btn" onClick={onExit} aria-label="Sair">
          <Icon name="back" />
        </button>
        <div className="player-title">
          <strong>{title}</strong>
          <span>
            {subtitle ? `${subtitle} · ` : ''}
            {speedLabel}
          </span>
        </div>
        <button className={`icon-btn ${settings ? 'on' : ''}`} onClick={() => setSettings((v) => !v)} aria-label="Ajustes" aria-expanded={settings}>
          <Icon name="sliders" />
        </button>
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
              <span className="play-ball">
                <Icon name="play" />
              </span>
              <b>{p.beat <= 0 ? 'Começar' : 'Continuar'}</b>
            </button>
          )}
          {!p.playing && !p.ended && p.beat <= 0 && <p className="stage-hint">Troque de acorde quando o bloco tocar a linha branca</p>}
          {p.ended && (
            <div className="stage-result" role="status">
              <h2>Você chegou ao fim! 🎉</h2>
              <p className="muted">{p.speed < 1 ? 'Que tal tentar um pouco mais rápido?' : 'Você já toca na velocidade normal!'}</p>
              <div className="row gap">
                <button
                  className="btn btn-sm"
                  onClick={() => {
                    p.restart()
                    p.play()
                  }}
                >
                  De novo
                </button>
                {p.speed < 1 && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      p.setSpeed(SPEEDS.find((s) => s.v > p.speed + 0.01)?.v ?? 1)
                      p.restart()
                      p.play()
                    }}
                  >
                    Mais rápido
                  </button>
                )}
              </div>
            </div>
          )}
        </section>

        <aside className="player-side">
          <div className="now">
            <div className="now-head">
              <span className="now-tag">{preparing ? 'Prepare a mão' : 'Toque agora'}</span>
              <b className="now-name">{cur ? label(cur.chord) : '—'}</b>
              <span className={`now-next ${soon ? 'soon' : ''}`}>
                {next ? (
                  <>
                    {soon ? `troca em ${Math.ceil(beatsToNext)}` : 'depois'} <b>{label(next.chord)}</b>
                  </>
                ) : (
                  'último acorde'
                )}
              </span>
            </div>
            <div className="now-visual">
              {view === 'mao' ? (
                <HandView shape={curShape} hand={false} width={620} className="neck-view" />
              ) : (
                <ChordDiagram shape={curShape} name="" showName={false} size={150} />
              )}
            </div>
          </div>

          <div className="lyrics" aria-live="polite">
            {line && <LyricLine line={line.line} label={label} active={preparing ? undefined : cur?.chord} current />}
            {nextLine && <LyricLine line={nextLine.line} label={label} />}
          </div>
        </aside>
      </div>

      {p.audioError && <p className="alert">{p.audioError}</p>}

      <footer className="player-controls">
        <div className="progress">
          <span>{fmt(p.beat, bpm, p.speed)}</span>
          <input type="range" min={0} max={timeline.totalBeats} step={0.25} value={Math.max(0, p.beat)} onChange={(e) => p.seek(Number(e.target.value))} aria-label="Posição na música" />
          <span>{fmt(timeline.totalBeats, bpm, p.speed)}</span>
        </div>
        <div className="transport">
          <button className="icon-btn" onClick={() => jumpLine(-1)} aria-label="Voltar uma linha">
            <Icon name="prev" />
          </button>
          <button className="icon-btn big" onClick={p.playing ? p.pause : p.play} aria-label={p.playing ? 'Pausar' : 'Tocar'}>
            <Icon name={p.playing ? 'pause' : 'play'} />
          </button>
          <button className="icon-btn" onClick={() => jumpLine(1)} aria-label="Avançar uma linha">
            <Icon name="next" />
          </button>
          <button className={`icon-btn ${p.loop ? 'on' : ''}`} onClick={toggleLoop} aria-pressed={!!p.loop} aria-label="Repetir esta parte">
            <Icon name="loop" />
          </button>
        </div>
        {p.loop && <p className="loop-info">Repetindo: {sectionRange(Math.max(0, p.lineIndex)).name || 'esta parte'}</p>}
      </footer>

      {settings && (
        <div className="sheet-backdrop" onClick={() => setSettings(false)}>
          <div className="sheet-panel" role="dialog" aria-label="Ajustes" onClick={(e) => e.stopPropagation()}>
            <span className="sheet-grip" />
            <h3>Velocidade</h3>
            <div className="chips wrap" role="group" aria-label="Velocidade">
              {SPEEDS.map((s) => (
                <button key={s.v} className={`chip ${Math.abs(p.speed - s.v) < 0.01 ? 'on' : ''}`} onClick={() => p.setSpeed(s.v)}>
                  {s.label}
                </button>
              ))}
            </div>
            <h3>Mostrar o acorde como</h3>
            <div className="chips" role="group" aria-label="Visualização">
              <button className={`chip ${view === 'mao' ? 'on' : ''}`} onClick={() => setView('mao')}>
                Braço do violão
              </button>
              <button className={`chip ${view === 'desenho' ? 'on' : ''}`} onClick={() => setView('desenho')}>
                ▦ Desenho
              </button>
            </div>
            <h3>Sons</h3>
            <label className="toggle">
              <span>
                <b>Tic do ritmo</b>
                <small>Um “tic” a cada tempo</small>
              </span>
              <input type="checkbox" checked={p.metronome} onChange={(e) => p.setMetronome(e.target.checked)} />
            </label>
            <label className="toggle">
              <span>
                <b>Som do acorde</b>
                <small>O app toca o acorde junto com você</small>
              </span>
              <input type="checkbox" checked={p.guide} onChange={(e) => p.setGuide(e.target.checked)} />
            </label>
            <button
              className="btn btn-sm"
              onClick={() => {
                p.restart()
                setSettings(false)
              }}
            >
              <Icon name="restart" size={18} /> Voltar ao começo
            </button>
            <button className="btn btn-primary btn-block" onClick={() => setSettings(false)}>
              Pronto
            </button>
          </div>
        </div>
      )}
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
  // Agrupa por palavra: cada palavra fica inteira (com seus acordes em cima) e a linha só quebra entre palavras.
  type Sub = { chord?: string; text: string }
  const tokens: (Sub[] | string)[] = []
  let word: Sub[] = []
  const flush = () => {
    if (word.length) tokens.push(word)
    word = []
  }
  // Acorde que cai num espaço vai para o início da próxima palavra.
  let pending: string | undefined
  for (const pt of parts) {
    if (pt.chord) pending = pt.chord
    pt.text.split(/(\s+)/).forEach((piece) => {
      if (!piece) return
      if (/^\s+$/.test(piece)) {
        flush()
        tokens.push(piece)
      } else {
        word.push({ chord: pending, text: piece })
        pending = undefined
      }
    })
  }
  if (pending) word.push({ chord: pending, text: '' })
  flush()
  return (
    <p className={`lyric ${current ? 'current' : ''}`}>
      {tokens.map((t, i) =>
        typeof t === 'string' ? (
          <span key={i}>{t}</span>
        ) : (
          <span key={i} className="word">
            {t.map((sub, j) => (
              <span key={j} className={`sub ${sub.chord ? 'has-chord' : ''}`}>
                <b className={sub.chord && sub.chord === active && current ? 'active' : ''}>{sub.chord ? label(sub.chord) : ''}</b>
                <span>{sub.text}</span>
              </span>
            ))}
          </span>
        ),
      )}
    </p>
  )
}
