import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ALL_SONGS, CATEGORY_LABEL, DIFFICULTY_LABEL, songChords } from '../content'
import { useFavorites, useProgress } from '../lib/userData'
import { Icon } from '../components/Icon'
import type { Song } from '../music/types'

function norm(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

const ART = [
  'linear-gradient(135deg,#ffc46b,#ff5a3c)',
  'linear-gradient(135deg,#7cf3dd,#2a9df4)',
  'linear-gradient(135deg,#c3b6ff,#7b5cff)',
  'linear-gradient(135deg,#ffb3d1,#ff5c8a)',
  'linear-gradient(135deg,#d6ff8a,#3ee39b)',
]

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
      <header className="page-head">
        <span className="eyebrow">{ALL_SONGS.length} músicas</span>
        <h1>Escolha uma música</h1>
        <p className="lead">Comece pelas fáceis (●○○). Elas usam poucos acordes.</p>
      </header>
      <div className="search">
        <Icon name="search" />
        <input placeholder="Buscar pelo nome ou nº da Harpa" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar música" />
      </div>
      <div className="chips scroll" role="group" aria-label="Filtros">
        <button className={`chip ${cat === '' ? 'on' : ''}`} onClick={() => setCat('')}>
          Todas
        </button>
        {cats.map((c) => (
          <button key={c} className={`chip ${cat === c ? 'on' : ''}`} onClick={() => setCat(c)}>
            {CATEGORY_LABEL[c]}
          </button>
        ))}
        <button className={`chip ${cat === 'fav' ? 'on' : ''}`} onClick={() => setCat('fav')}>
          ♥ Salvas
        </button>
        {[1, 2].map((d) => (
          <button key={d} className={`chip ${diff === d ? 'on' : ''}`} onClick={() => setDiff(diff === d ? 0 : d)}>
            {DIFFICULTY_LABEL[d as 1 | 2]}
          </button>
        ))}
      </div>

      <div className="song-grid">
        {list.map((s, i) => {
          const pr = progress[s.id]
          return (
            <Link key={s.id} to={`/musicas/${s.id}`} className="card card-hover song-card">
              <span className="song-art" style={{ background: ART[i % ART.length] }}>
                {s.harpa ?? s.title.slice(0, 1)}
              </span>
              <b>{s.title}</b>
              <small>{s.harpa ? `Harpa Cristã ${s.harpa}` : s.artist}</small>
              <span className="level" aria-label={`Nível ${DIFFICULTY_LABEL[s.difficulty]}`}>
                {[1, 2, 3].map((n) => (
                  <i key={n} className={n <= s.difficulty ? 'on' : ''} />
                ))}
              </span>
              <span className="mini-chords">
                {songChords(s).slice(0, 5).map((c) => (
                  <i key={c}>{c}</i>
                ))}
              </span>
              <span className="corner">
                {pr?.completions ? <span className="badge ok">✓</span> : favs.isFav(s.id) ? <span className="fav-dot">♥</span> : null}
              </span>
            </Link>
          )
        })}
      </div>
      {!list.length && <p className="muted">Nenhuma música encontrada.</p>}
    </div>
  )
}
