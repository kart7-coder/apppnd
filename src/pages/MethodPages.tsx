import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ALL_TONES, getTone, type MethodTone } from '../content/method'
import { ChordDiagram } from '../components/ChordDiagram'
import { Icon } from '../components/Icon'
import { Player } from '../components/Player'
import { useAuth } from '../lib/auth'
import { logHistory } from '../lib/userData'
import { strumChord } from '../engine/audio'
import { shapeNotes, NOTE_PT } from '../music/theory'
import { loopTimeline } from '../music/timeline'
import type { ChordShape } from '../music/types'

/** "I – vi – IV – V" → "1º – 6º – 4º – 5º" (mais fácil para iniciantes). */
const ROMAN: Record<string, number> = { i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7 }
function ordinal(roman: string) {
  return roman
    .split('–')
    .map((r) => `${ROMAN[r.trim().toLowerCase()] ?? r.trim()}º`)
    .join(' – ')
}

export function MethodPage() {
  return (
    <div className="page">
      <header className="page-head">
        <img src="/logo.png" alt="Método Acordes Exclusivos" className="method-logo" />
        <h1>Acordes que deixam o louvor mais bonito</h1>
        <p className="lead">
          Cada música tem um <b>tom</b>: um grupo de acordes que combinam entre si. Escolha o tom e veja formas diferentes (e mais bonitas) de tocar esses acordes, com
          sequências prontas para treinar.
        </p>
      </header>
      <div className="tone-grid">
        {ALL_TONES.map((t) => (
          <Link key={t.id} to={`/metodo/${t.id}`} className="card card-hover tone-card">
            <span className="tone-key">{t.key}</span>
            <b>Tom de {t.name}</b>
            <small>{t.degrees.length ? `${t.degrees.reduce((a, d) => a + d.shapes.length, 0)} acordes` : `${t.sequences.length} sequências`}</small>
          </Link>
        ))}
      </div>
    </div>
  )
}

function ShapeCard({ shape }: { shape: ChordShape }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`shape-card ${open ? 'open' : ''}`}>
      <button
        className="chord-tile"
        onClick={() => {
          strumChord(shape)
          setOpen((v) => !v)
        }}
        aria-label={`Ouvir ${shape.name}`}
        aria-expanded={open}
      >
        <ChordDiagram shape={shape} size={108} />
      </button>
      {shape.note && <span className="warn-dot" title="Ver observação">!</span>}
      {open && (
        <div className="shape-info small">
          <p className="muted">Notas: {shapeNotes(shape.frets).join(' · ')}</p>
          {shape.note && <p className="warn">{shape.note}</p>}
        </div>
      )}
    </div>
  )
}

export function MethodTonePage() {
  const { tone: id = '' } = useParams()
  const tone = getTone(id)
  const auth = useAuth()

  useEffect(() => {
    if (tone && auth.user) logHistory(auth.user.id, 'method', tone.id, `Método: Tom de ${tone.name}`)
  }, [tone, auth.user])

  if (!tone) return <Navigate to="/metodo" replace />
  return <ToneView tone={tone} />
}

function ToneView({ tone }: { tone: MethodTone }) {
  const [tab, setTab] = useState<'sequencias' | 'graus'>('sequencias')
  return (
    <div className="page">
      <Link to="/metodo" className="back-link">
        <Icon name="back" size={18} /> Todos os tons
      </Link>
      <header className="page-head">
        <span className="tone-key center" style={{ marginBottom: 14 }}>
          {tone.key}
        </span>
        <h1>Tom de {NOTE_PT[tone.key[0]] ?? tone.name} Maior</h1>
        <p className="lead">Toque em qualquer desenho para ouvir. Comece pelas sequências: são trechos prontos que aparecem em muitos louvores.</p>
      </header>
      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === 'sequencias'} className={tab === 'sequencias' ? 'on' : ''} onClick={() => setTab('sequencias')}>
          Sequências prontas
        </button>
        <button role="tab" aria-selected={tab === 'graus'} className={tab === 'graus' ? 'on' : ''} onClick={() => setTab('graus')}>
          Acordes do tom
        </button>
      </div>

      {tab === 'sequencias' &&
        tone.sequences.map((seq, si) => (
          <section key={si}>
            <div className="section-head">
              <h2>{seq.title}</h2>
              <p>
                {seq.chords} <span className="small">({ordinal(seq.roman)} acorde do tom)</span>
              </p>
            </div>
            {seq.options.map((opt, oi) => (
              <div key={oi} className="card seq-option">
                <h3>Jeito {oi + 1}</h3>
                <div className="chord-row wrap">
                  {opt.map((sh, k) => (
                    <ShapeCard key={k} shape={sh} />
                  ))}
                </div>
                <Link className="btn btn-primary btn-sm" to={`/metodo/${tone.id}/tocar/${si}/${oi}`}>
                  <Icon name="play" size={16} /> Treinar no ritmo
                </Link>
              </div>
            ))}
          </section>
        ))}

      {tab === 'graus' && (
        <>
          {tone.pending && <p className="note">{tone.pending}</p>}
          {tone.degrees.map((d, i) => (
            <section key={d.degree}>
              <div className="section-head">
                <h2>
                  {i + 1}º acorde: {d.chord}
                </h2>
                <p>
                  {d.label} · {d.shapes.length} jeitos de tocar
                </p>
              </div>
              <div className="chord-row wrap">
                {d.shapes.map((sh) => (
                  <ShapeCard key={sh.id} shape={sh} />
                ))}
              </div>
            </section>
          ))}
          {tone.degrees.length > 0 && <p className="muted small">O “!” amarelo indica uma observação sobre o desenho original.</p>}
        </>
      )}
    </div>
  )
}

export function MethodPlayPage() {
  const { tone: id = '', seq = '0', opt = '0' } = useParams()
  const nav = useNavigate()
  const tone = getTone(id)

  const data = useMemo(() => {
    const s = tone?.sequences[Number(seq)]
    const shapes = s?.options[Number(opt)]
    if (!s || !shapes) return null
    // Rótulo único por posição para não juntar formas diferentes com o mesmo nome.
    const keys = shapes.map((sh, i) => `${sh.name}#${i}`)
    return { s, shapes, keys, timeline: loopTimeline(keys, 4, 1, 8) }
  }, [tone, seq, opt])

  if (!tone || !data) return <Navigate to="/metodo" replace />

  return (
    <Player
      title={`${data.s.title} · Jeito ${Number(opt) + 1}`}
      subtitle={`Tom de ${tone.name} · ${data.s.chords}`}
      timeline={data.timeline}
      bpm={72}
      sync="estimated"
      shapeFor={(k) => data.shapes[data.keys.indexOf(k)]}
      label={(k) => k.split('#')[0]}
      mode="pratica"
      onExit={() => nav(`/metodo/${id}`)}
    />
  )
}
