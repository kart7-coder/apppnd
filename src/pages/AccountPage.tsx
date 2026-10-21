import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth, hasProduct } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { useFavorites, useHistory, useProgress } from '../lib/userData'
import { ALL_SONGS } from '../content'
import { OFFERS } from '../lib/offers'
import { OfferCard } from '../components/OfferCard'
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
      <h1>Minha conta</h1>
      <div className="stats">
        <div>
          <b>{completed}</b>
          <small>músicas concluídas</small>
        </div>
        <div>
          <b>{minutes}</b>
          <small>min praticados</small>
        </div>
        <div>
          <b>{favs.ids.length + chordFavs.ids.length}</b>
          <small>favoritos</small>
        </div>
      </div>

      <section>
        <h2>Meus acessos</h2>
        <div className="list">
          <div className="list-item">
            <Icon name="check" /> <span>Conteúdo gratuito: hinos, treino, afinador, Tom de Dó do Método</span>
          </div>
          {Object.values(OFFERS).map((o) =>
            hasProduct(auth, o.product) ? (
              <div key={o.product} className="list-item">
                <Icon name="check" /> <span>{o.title}</span>
              </div>
            ) : null,
          )}
        </div>
        {Object.values(OFFERS)
          .filter((o) => !hasProduct(auth, o.product))
          .map((o) => (
            <OfferCard key={o.product} product={o.product} compact />
          ))}
      </section>

      {favs.ids.length > 0 && (
        <section>
          <h2>Músicas favoritas</h2>
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
          <h2>Histórico</h2>
          <div className="list">
            {history.map((h) => (
              <div key={h.item_type + h.item_id} className="list-item">
                <span>{h.title}</span>
                <small className="muted">{new Date(h.seen_at).toLocaleDateString('pt-BR')}</small>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2>Dados</h2>
        <form onSubmit={saveName} className="form">
          <label>
            Nome
            <input value={name} onChange={(e) => { setName(e.target.value); setSaved(false) }} />
          </label>
          <p className="muted small">E-mail: {auth.user?.email}</p>
          <button className="btn">{saved ? 'Salvo ✓' : 'Salvar'}</button>
        </form>
      </section>

      <div className="row gap wrap">
        {auth.profile?.is_admin && (
          <Link to="/admin" className="btn">
            <Icon name="shield" /> Painel admin
          </Link>
        )}
        <button className="btn ghost" onClick={auth.signOut}>
          <Icon name="logout" /> Sair
        </button>
      </div>
    </div>
  )
}
