import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { TONE_LIST, FREE_TONE, METHOD_PRODUCT, useMethodTone, type MethodTone } from '../content/method'
import { ChordDiagram } from '../components/ChordDiagram'
import { Icon } from '../components/Icon'
import { Locked } from '../components/OfferCard'
import { Player } from '../components/Player'
import { useAuth, hasProduct } from '../lib/auth'
import { logHistory } from '../lib/userData'
import { strumChord } from '../engine/audio'
import { shapeNotes, NOTE_PT } from '../music/theory'
import { loopTimeline } from '../music/timeline'
import type { ChordShape } from '../music/types'

export function MethodPage() {
  const auth = useAuth()
  const owned = hasProduct(auth, METHOD_PRODUCT)
  return (
    <div className="page">
      <img src="/logo.png" alt="Método Acordes Exclusivos" className="method-logo" />
      <p className="muted">
        Acordes exclusivos para cada grau do campo harmônico, com sequências prontas para aplicar nos louvores. Toque em um acorde para ouvir, ou treine as sequências no modo
        Tocar.
      </p>
      <div className="tone-grid">
        {TONE_LIST.map((t) => {
          const free = t.id === FREE_TONE
          return (
            <Link key={t.id} to={`/metodo/${t.id}`} className="tone-card">
              <span className="tone-key">{t.key}</span>
              <span>
                <b>Tom de {t.name} Maior</b>
                <small>{free ? 'Grátis' : owned ? 'Liberado' : 'Exclusivo'}</small>
              </span>
              {!free && !owned && <Icon name="lock" size={18} />}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function ShapeCard({ shape }: { shape: ChordShape }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`shape-card ${open ? 'open' : ''}`}>
      <button className="chord-tile" onClick={() => { strumChord(shape); setOpen((v) => !v) }} aria-label={`Ouvir ${shape.name}`} aria-expanded={open}>
        <ChordDiagram shape={shape} size={108} />
      </button>
      {shape.note && <span className="warn-dot" title="Ver observação">!</span>}
      {open && (
        <div className="shape-info small">
          <p>Notas: {shapeNotes(shape.frets).join(' · ')}</p>
          {shape.note && <p className="warn">{shape.note}</p>}
        </div>
      )}
    </div>
  )
}

export function MethodTonePage() {
  const { tone: id = '' } = useParams()
  const meta = TONE_LIST.find((t) => t.id === id)
  const auth = useAuth()
  const owned = id === FREE_TONE || hasProduct(auth, METHOD_PRODUCT)
  const state = useMethodTone(owned ? id : '__none__')

  useEffect(() => {
    if (meta && auth.user) logHistory(auth.user.id, 'method', meta.id, `Método: Tom de ${meta.name}`)
  }, [meta, auth.user])

  if (!meta) return <Navigate to="/metodo" replace />
  const header = (
    <>
      <Link to="/metodo" className="back-link">
        <Icon name="back" size={18} /> Método
      </Link>
      <h1>
        Tom de {meta.name} Maior <span className="muted">({meta.key})</span>
      </h1>
    </>
  )
  if (!owned)
    return (
      <div className="page">
        {header}
        <Locked product={METHOD_PRODUCT} />
      </div>
    )
  if (state.status === 'loading') return <div className="page">{header}<div className="spinner" /></div>
  if (state.status === 'error') return <div className="page">{header}<p className="alert">{state.message}</p></div>
  if (state.status === 'locked')
    return (
      <div className="page">
        {header}
        <p className="note">Este tom ainda está sendo preparado no app. Enquanto isso, use o PDF do método que você recebeu.</p>
      </div>
    )
  return <ToneView tone={state.tone} header={header} />
}

function ToneView({ tone, header }: { tone: MethodTone; header: React.ReactNode }) {
  const [tab, setTab] = useState<'graus' | 'sequencias'>('sequencias')
  return (
    <div className="page">
      {header}
      <p className="muted">Acordes exclusivos para cada grau do campo harmônico de {NOTE_PT[tone.key[0]] ?? tone.key} maior.</p>
      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === 'sequencias'} className={tab === 'sequencias' ? 'on' : ''} onClick={() => setTab('sequencias')}>
          Sequências para praticar
        </button>
        <button role="tab" aria-selected={tab === 'graus'} className={tab === 'graus' ? 'on' : ''} onClick={() => setTab('graus')}>
          Acordes por grau
        </button>
      </div>

      {tab === 'sequencias' &&
        tone.sequences.map((seq, si) => (
          <section key={si} className="sequence">
            <h2>
              {seq.title}: {seq.roman}
            </h2>
            <p className="muted">{seq.chords}</p>
            {seq.options.map((opt, oi) => (
              <div key={oi} className="seq-option">
                <div className="row between">
                  <h3>Opção {oi + 1}</h3>
                  <Link className="btn btn-primary btn-sm" to={`/metodo/${tone.id}/tocar/${si}/${oi}`}>
                    <Icon name="play" size={16} /> Treinar no modo Tocar
                  </Link>
                </div>
                <div className="chord-row">
                  {opt.map((sh, k) => (
                    <ShapeCard key={k} shape={sh} />
                  ))}
                </div>
              </div>
            ))}
          </section>
        ))}

      {tab === 'graus' && (
        <>
          {tone.pending && <p className="note">{tone.pending}</p>}
          {tone.degrees.map((d) => (
            <section key={d.degree}>
              <h2>
                {d.degree} grau · {d.chord} <span className="muted">({d.label})</span>
              </h2>
              <div className="chord-row wrap">
                {d.shapes.map((sh) => (
                  <ShapeCard key={sh.id} shape={sh} />
                ))}
              </div>
            </section>
          ))}
          <p className="muted small">Toque num diagrama para ouvir e ver as notas. O "!" indica observação de revisão.</p>
        </>
      )}
    </div>
  )
}

export function MethodPlayPage() {
  const { tone: id = '', seq = '0', opt = '0' } = useParams()
  const nav = useNavigate()
  const auth = useAuth()
  const owned = id === FREE_TONE || hasProduct(auth, METHOD_PRODUCT)
  const state = useMethodTone(owned ? id : '__none__')
  const [bpm] = useState(72)

  const data = useMemo(() => {
    if (state.status !== 'ok') return null
    const s = state.tone.sequences[Number(seq)]
    const shapes = s?.options[Number(opt)]
    if (!shapes) return null
    // Rótulo único por posição para não juntar formas diferentes com o mesmo nome.
    const keys = shapes.map((sh, i) => `${sh.name}#${i}`)
    return { s, shapes, keys, timeline: loopTimeline(keys, 4, 1, 8) }
  }, [state, seq, opt])

  if (!owned) return <Navigate to={`/metodo/${id}`} replace />
  if (!data) return <div className="center-screen"><div className="spinner" /></div>

  return (
    <Player
      title={`${data.s.title} · Opção ${Number(opt) + 1}`}
      subtitle={`Tom de ${state.status === 'ok' ? state.tone.name : ''} · ${data.s.chords}`}
      timeline={data.timeline}
      bpm={bpm}
      sync="estimated"
      shapeFor={(k) => data.shapes[data.keys.indexOf(k)]}
      label={(k) => k.split('#')[0]}
      mode="pratica"
      onExit={() => nav(`/metodo/${id}`)}
    />
  )
}
