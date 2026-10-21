import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getSong, songChords, songShape, songTimeline, DIFFICULTY_LABEL, CATEGORY_LABEL } from '../content'
import { ChordLegend } from '../components/ChordLegend'
import { HandView, HandIcon } from '../components/HandView'
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
  const [picked, setPicked] = useState<string | null>(null)

  useEffect(() => {
    if (song && auth.user) logHistory(auth.user.id, 'song', song.id, song.title)
  }, [song, auth.user])

  if (!song) return <Navigate to="/musicas" replace />

  const chords = songChords(song)
  const tl = songTimeline(song)
  const minutes = Math.max(1, Math.round((tl.totalBeats * 60) / song.bpm / 60))
  const shown = picked ?? chords[0]
  const shownShape = songShape(song, shown)

  return (
    <div className="page">
      <div className="row between top-row">
        <Link to="/musicas" className="back-link">
          <Icon name="back" size={18} /> Músicas
        </Link>
        <button className={`icon-btn ${favs.isFav(song.id) ? 'on' : ''}`} onClick={() => favs.toggle(song.id)} aria-pressed={favs.isFav(song.id)} aria-label="Salvar nas favoritas">
          <Icon name="heart" />
        </button>
      </div>

      <header className="song-head">
        <p className="song-meta">{song.harpa ? `Harpa Cristã ${song.harpa}` : song.artist ?? CATEGORY_LABEL[song.category]}</p>
        <h1>{song.title}</h1>
        <p className="song-meta">
          {chords.length} acordes · {DIFFICULTY_LABEL[song.difficulty]} · {minutes} min
          {pr?.completions ? ' · ✓ já tocou' : ''}
        </p>
      </header>

      <div className="main-actions">
        <Link className="btn btn-primary btn-hero" to={`/tocar/${song.id}?modo=pratica`}>
          <Icon name="play" /> Tocar agora
        </Link>
        <div className="row2">
          <Link className="btn" to={`/musicas/${song.id}/aprender`}>
            Aprender os acordes
          </Link>
          <Link className="btn" to={`/tocar/${song.id}?modo=jogo`}>
            Modo desafio
          </Link>
        </div>
      </div>

      <section>
        <h2 className="h-small">Acordes da música</h2>
        <div className="chips">
          {chords.map((c) => (
            <button
              key={c}
              className={`chip chord-chip ${c === shown ? 'on' : ''}`}
              onClick={() => {
                setPicked(c)
                const sh = songShape(song, c)
                if (sh) strumChord(sh)
              }}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="card chord-show">
          <HandIcon size={72} active={shownShape ? [...new Set(shownShape.fingers.filter((f) => f > 0))] : []} />
          <HandView shape={shownShape} width={340} className="hand-big" />
        </div>
        <ChordLegend />
      </section>

      <section>
        <h2 className="h-small">Letra e acordes</h2>
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
        {song.arrangement && <p className="muted small">Ordem: {song.arrangement.join(' → ')}</p>}
        {song.reviewNotes?.map((n) => (
          <p key={n} className="muted small">
            Obs.: {n}
          </p>
        ))}
      </section>
    </div>
  )
}
