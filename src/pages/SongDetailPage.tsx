import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getSong, songChords, songShape, songTimeline, DIFFICULTY_LABEL, CATEGORY_LABEL } from '../content'
import { ChordDiagram } from '../components/ChordDiagram'
import { ChordLegend } from '../components/ChordLegend'
import { Icon } from '../components/Icon'
import { useAuth } from '../lib/auth'
import { logHistory, useFavorites, useProgress } from '../lib/userData'
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

  const chords = songChords(song)
  const tl = songTimeline(song)
  const minutes = Math.max(1, Math.round((tl.totalBeats * 60) / song.bpm / 60))

  return (
    <div className="page">
      <Link to="/musicas" className="back-link">
        <Icon name="back" size={18} /> Músicas
      </Link>
      <header className="detail-hero page-head">
        <span className="eyebrow">{song.harpa ? `Harpa Cristã ${song.harpa}` : CATEGORY_LABEL[song.category]}</span>
        <h1>{song.title}</h1>
        <p className="lead">
          {song.artist ? `${song.artist} · ` : ''}
          {chords.length} acordes · {DIFFICULTY_LABEL[song.difficulty]} · cerca de {minutes} min
        </p>
        <button className={`icon-btn ${favs.isFav(song.id) ? 'on' : ''}`} onClick={() => favs.toggle(song.id)} aria-pressed={favs.isFav(song.id)} aria-label="Salvar nas favoritas">
          <Icon name="heart" />
        </button>
      </header>

      {pr?.completions ? (
        <p className="badge ok">
          ✓ Você já tocou {pr.completions}x · melhor velocidade {Math.round((pr.bestSpeed ?? 0) * 100)}%
        </p>
      ) : null}

      <div className="cta-col">
        <Link className="btn btn-primary" to={`/musicas/${song.id}/aprender`}>
          Aprender do zero
          <small>Cada acorde e cada troca, passo a passo</small>
        </Link>
        <Link className="btn" to={`/tocar/${song.id}?modo=pratica`}>
          Treinar devagar
          <small>Começa em 60% da velocidade</small>
        </Link>
        <Link className="btn" to={`/tocar/${song.id}?modo=jogo`}>
          Tocar junto
          <small>Escolha o nível: fácil, médio ou normal</small>
        </Link>
      </div>

      <section>
        <div className="section-head">
          <h2>Os acordes desta música</h2>
          <p>Toque no desenho para ouvir como soa.</p>
        </div>
        <div className="chord-row wrap">
          {chords.map((c) => {
            const shape = songShape(song, c)
            return (
              <button key={c} className="chord-tile" onClick={() => shape && strumChord(shape)} aria-label={`Ouvir ${c}`}>
                <ChordDiagram shape={shape} name={c} size={chords.length <= 3 ? 96 : 84} />
              </button>
            )
          })}
        </div>
        <ChordLegend />
      </section>

      <section>
        <div className="section-head">
          <h2>Letra com os acordes</h2>
          <p>O nome em laranja mostra em que palavra trocar de acorde.</p>
        </div>
        <div className="card sheet">
          {song.sections.map((sec) => (
            <div key={sec.name} className="sheet-section">
              {sec.name && <h3>{sec.name}</h3>}
              {sec.lines.map((l, i) => (
                <LyricLine key={i} line={l} label={(c) => c} />
              ))}
            </div>
          ))}
        </div>
        {song.arrangement && <p className="muted small">Ordem para tocar: {song.arrangement.join(' → ')}</p>}
        <div className="note small">
          <Icon name="sound" size={18} />
          <span>Ainda não temos a gravação desta música. No modo Tocar, o ritmo vem do metrônomo (um "tic" a cada tempo) e o app toca o acorde para você acompanhar.</span>
        </div>
        {song.reviewNotes?.map((n) => (
          <p key={n} className="muted small">
            Observação: {n}
          </p>
        ))}
      </section>
    </div>
  )
}
