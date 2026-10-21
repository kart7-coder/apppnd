import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ALL_SONGS, CATEGORY_LABEL, DIFFICULTY_LABEL, songChords } from '../content'
import { useFavorites, useProgress } from '../lib/userData'
import { Icon } from '../components/Icon'
import type { Song } from '../music/types'

function norm(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

export function SongsPage() {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<Song['category'] | 'fav' | ''>('')
  const [diff, setDiff] = useState<number>(0)
  const favs = useFavorites('song')
  const progress = useProgress('song')
  const cats = Array.from(new Set(ALL_SONGS.map((s) => s.category)))

  const list = useMemo(() => {
    const nq = norm(q.trim())
    return ALL_SONGS.filter(
      (s) =>
        (!nq || norm(`${s.title} ${s.artist ?? ''} ${s.harpa ?? ''}`).includes(nq)) &&
        (!cat || (cat === 'fav' ? favs.isFav(s.id) : s.category === cat)) &&
        (!diff || s.difficulty === diff),
    )
  }, [q, cat, diff, favs])

  return (
    <div className="page">
      <h1>Músicas</h1>
      <div className="search">
        <Icon name="search" />
        <input placeholder="Buscar por título, artista ou nº da Harpa" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar música" />
      </div>
      <div className="chips scroll" role="group" aria-label="Categoria">
        <button className={`chip ${cat === '' ? 'on' : ''}`} onClick={() => setCat('')}>
          Todas
        </button>
        {cats.map((c) => (
          <button key={c} className={`chip ${cat === c ? 'on' : ''}`} onClick={() => setCat(c)}>
            {CATEGORY_LABEL[c]}
          </button>
        ))}
        <button className={`chip ${cat === 'fav' ? 'on' : ''}`} onClick={() => setCat('fav')}>
          ♥ Favoritas
        </button>
        <select className="chip" value={diff} onChange={(e) => setDiff(Number(e.target.value))} aria-label="Dificuldade">
          <option value={0}>Qualquer nível</option>
          <option value={1}>Iniciante</option>
          <option value={2}>Intermediário</option>
          <option value={3}>Avançado</option>
        </select>
      </div>

      <div className="song-list">
        {list.map((s) => {
          const pr = progress[s.id]
          return (
            <Link key={s.id} to={`/musicas/${s.id}`} className="song-row">
              <span className="song-num">{s.harpa ? s.harpa : s.key}</span>
              <span className="song-info">
                <b>{s.title}</b>
                <small>
                  {s.harpa ? `Harpa Cristã ${s.harpa}` : s.artist} · {DIFFICULTY_LABEL[s.difficulty]}
                </small>
                <span className="mini-chords">
                  {songChords(s).slice(0, 6).map((c) => (
                    <i key={c}>{c}</i>
                  ))}
                </span>
              </span>
              <span className="song-meta">
                {favs.isFav(s.id) && <span className="fav-dot" aria-label="Favorita">♥</span>}
                {pr?.completions ? <span className="badge ok">✓ {Math.round((pr.bestSpeed ?? 0) * 100)}%</span> : null}
              </span>
            </Link>
          )
        })}
        {!list.length && <p className="muted">Nenhuma música encontrada.</p>}
      </div>
    </div>
  )
}
