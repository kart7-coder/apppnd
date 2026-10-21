import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { useFavorites, useHistory, useProgress } from '../lib/userData'
import { ALL_SONGS } from '../content'
import { Icon } from '../components/Icon'

export function AccountPage() {
  const auth = useAuth()
  const favs = useFavorites('song')
  const chordFavs = useFavorites('chord')
  const progress = useProgress('song')
  const history = useHistory(10)
  const [name, setName] = useState(auth.profile?.name ?? '')
  const [saved, setSaved] = useState(false)

  const completed = Object.values(progress).filter((p) => p.completions).length
  const minutes = Math.round(Object.values(progress).reduce((a, p) => a + (p.practicedSec ?? 0), 0) / 60)
  const display = auth.profile?.name || auth.user?.email || ''

  async function saveName(e: FormEvent) {
    e.preventDefault()
    if (!auth.user) return
    await supabase.from('profiles').update({ name: name.trim() }).eq('id', auth.user.id)
    await supabase.auth.updateUser({ data: { name: name.trim() } })
    setSaved(true)
    auth.refresh()
  }

  return (
    <div className="page">
      <header className="page-head">
        <div className="avatar">{display.slice(0, 1).toUpperCase()}</div>
        <h1>{auth.profile?.name || 'Seu perfil'}</h1>
        <p className="lead">{auth.user?.email}</p>
      </header>

      <div className="stats">
        <div className="card">
          <b className="grad-text">{completed}</b>
          <small>músicas tocadas até o fim</small>
        </div>
        <div className="card">
          <b className="grad-text">{minutes}</b>
          <small>minutos de treino</small>
        </div>
        <div className="card">
          <b className="grad-text">{favs.ids.length + chordFavs.ids.length}</b>
          <small>salvos</small>
        </div>
      </div>

      {favs.ids.length > 0 && (
        <section>
          <div className="section-head">
            <h2>Músicas salvas</h2>
          </div>
          <div className="list">
            {favs.ids.map((id) => {
              const s = ALL_SONGS.find((x) => x.id === id)
              return s ? (
                <Link key={id} to={`/musicas/${id}`} className="list-item">
                  <Icon name="heart" /> <span>{s.title}</span>
                </Link>
              ) : null
            })}
          </div>
        </section>
      )}

      {history.length > 0 && (
        <section>
          <div className="section-head">
            <h2>Vistos recentemente</h2>
          </div>
          <div className="list">
            {history.map((h) => (
              <div key={h.item_type + h.item_id} className="list-item">
                <span>{h.title}</span>
                <small className="muted">· {new Date(h.seen_at).toLocaleDateString('pt-BR')}</small>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="section-head">
          <h2>Seus dados</h2>
        </div>
        <form onSubmit={saveName} className="form card narrow-form">
          <label>
            Como quer ser chamado
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setSaved(false)
              }}
            />
          </label>
          <button className="btn">{saved ? 'Salvo ✓' : 'Salvar'}</button>
        </form>
      </section>

      <section>
        <button className="btn ghost" onClick={auth.signOut}>
          <Icon name="logout" /> Sair da conta
        </button>
      </section>
    </div>
  )
}
