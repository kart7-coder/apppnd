import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getSong, songChords, songShape, songTimeline, DIFFICULTY_LABEL, CATEGORY_LABEL } from '../content'
import { ChordDiagram } from '../components/ChordDiagram'
import { Icon } from '../components/Icon'
import { useAuth, hasProduct } from '../lib/auth'
import { logHistory, useFavorites, useProgress } from '../lib/userData'
import { Locked } from '../components/OfferCard'
import { LyricLine } from '../components/Player'
import { strumChord } from '../engine/audio'

export function SongDetailPage() {
  const { id = '' } = useParams()
  const song = getSong(id)
  const auth = useAuth()
  const favs = useFavorites('song')
  const pr = useProgress('song')[id]

  useEffect(() => {
    if (song && auth.user) logHistory(auth.user.id, 'song', song.id, song.title)
  }, [song, auth.user])

  if (!song) return <Navigate to="/musicas" replace />
  if (!hasProduct(auth, song.product)) return <div className="page"><Locked product={song.product!} /></div>

  const chords = songChords(song)
  const tl = songTimeline(song)
  const minutes = Math.round((tl.totalBeats * 60) / song.bpm / 60)

  return (
    <div className="page">
      <Link to="/musicas" className="back-link">
        <Icon name="back" size={18} /> Músicas
      </Link>
      <header className="detail-head">
        <div>
          <p className="eyebrow">{song.harpa ? `Harpa Cristã ${song.harpa}` : CATEGORY_LABEL[song.category]}</p>
          <h1>{song.title}</h1>
          <p className="muted">
            {song.artist ? `${song.artist} · ` : ''}Tom {song.key} · {DIFFICULTY_LABEL[song.difficulty]} · ~{minutes} min
          </p>
        </div>
        <button className={`icon-btn ${favs.isFav(song.id) ? 'on' : ''}`} onClick={() => favs.toggle(song.id)} aria-pressed={favs.isFav(song.id)} aria-label="Favoritar">
          <Icon name="heart" />
        </button>
      </header>

      <div className="cta-row">
        <Link className="btn btn-primary" to={`/tocar/${song.id}?modo=jogo`}>
          <Icon name="play" /> Tocar (modo jogo)
        </Link>
        <Link className="btn" to={`/tocar/${song.id}?modo=pratica`}>
          Prática guiada
        </Link>
        <Link className="btn" to={`/musicas/${song.id}/aprender`}>
          Aprender passo a passo
        </Link>
      </div>

      {pr?.completions ? (
        <p className="badge ok">
          Você já completou {pr.completions}x · melhor velocidade {Math.round((pr.bestSpeed ?? 0) * 100)}%
        </p>
      ) : null}

      <div className="note">
        <Icon name="sound" size={18} />
        <span>
          Ainda não temos a gravação desta música. No modo Tocar, ela segue o <b>metrônomo</b>, e o "violão guia" toca o acorde de cada compasso. As trocas são uma
          estimativa a partir da cifra.
        </span>
      </div>

      <section>
        <h2>Acordes da música</h2>
        <p className="muted small">Toque no acorde para ouvir.</p>
        <div className="chord-row">
          {chords.map((c) => {
            const shape = songShape(song, c)
            return (
              <button key={c} className="chord-tile" onClick={() => shape && strumChord(shape)} aria-label={`Ouvir ${c}`}>
                <ChordDiagram shape={shape} name={c} size={112} />
              </button>
            )
          })}
        </div>
      </section>

      <section>
        <h2>Cifra</h2>
        <div className="sheet">
          {song.sections.map((sec) => (
            <div key={sec.name} className="sheet-section">
              {sec.name && <h3>{sec.name}</h3>}
              {sec.lines.map((l, i) => (
                <LyricLine key={i} line={l} label={(c) => c} />
              ))}
            </div>
          ))}
        </div>
        {song.arrangement && <p className="muted small">Ordem: {song.arrangement.join(' → ')}</p>}
        {song.reviewNotes?.map((n) => (
          <p key={n} className="note warn small">
            Revisão: {n}
          </p>
        ))}
        <p className="muted small">Fonte: {song.source.file}{song.source.page ? `, p. ${song.source.page}` : ''}</p>
      </section>
    </div>
  )
}
