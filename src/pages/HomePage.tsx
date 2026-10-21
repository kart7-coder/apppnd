import { Link } from 'react-router-dom'
import { useAuth, hasProduct } from '../lib/auth'
import { useHistory } from '../lib/userData'
import { Icon } from '../components/Icon'
import { ALL_SONGS } from '../content'
import { OfferCard } from '../components/OfferCard'

const TOOLS = [
  { to: '/musicas', icon: 'music', title: 'Tocar músicas', text: 'Acordes descendo na tela, no ritmo da música.' },
  { to: '/afinador', icon: 'tuner', title: 'Afinador', text: 'Afine pelo microfone antes de começar.' },
  { to: '/treino', icon: 'bolt', title: 'Treino de troca', text: 'Destrave a mão trocando entre 2 a 4 acordes.' },
  { to: '/metodo', icon: 'book', title: 'Método Acordes Exclusivos', text: 'Acordes sofisticados nos 7 tons.' },
  { to: '/acordes', icon: 'grid', title: 'Dicionário de acordes', text: 'Onde colocar cada dedo.' },
]

export function HomePage() {
  const auth = useAuth()
  const history = useHistory(4)
  const first = (auth.profile?.name || '').split(' ')[0]
  const starter = ALL_SONGS.find((s) => s.id === 'harpa-291-a-mensagem-da-cruz')!

  return (
    <div className="page">
      <header className="hero">
        <p className="eyebrow">Paz{first ? `, ${first}` : ''}! 🙏</p>
        <h1>Vamos tocar hoje?</h1>
        <p className="muted">Comece por um hino de 3 acordes e vá aumentando a velocidade.</p>
        <Link to={`/tocar/${starter.id}?modo=pratica`} className="hero-cta">
          <span className="hero-cta-icon">
            <Icon name="play" size={26} />
          </span>
          <span>
            <b>{starter.title}</b>
            <small>Harpa {starter.harpa} · A · D · E</small>
          </span>
        </Link>
      </header>

      {history.length > 0 && (
        <section>
          <h2>Continuar</h2>
          <div className="list">
            {history.map((h) => (
              <Link key={h.item_type + h.item_id} className="list-item" to={h.item_type === 'song' ? `/musicas/${h.item_id}` : h.item_type === 'method' ? `/metodo/${h.item_id}` : '/'}>
                <Icon name={h.item_type === 'song' ? 'music' : 'book'} />
                <span>{h.title}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2>Ferramentas</h2>
        <div className="tool-grid">
          {TOOLS.map((t) => (
            <Link key={t.to} to={t.to} className="tool">
              <span className="tool-icon">
                <Icon name={t.icon} />
              </span>
              <b>{t.title}</b>
              <small>{t.text}</small>
            </Link>
          ))}
        </div>
      </section>

      {!hasProduct(auth, 'metodo_acordes') && (
        <section>
          <OfferCard product="metodo_acordes" compact />
        </section>
      )}
    </div>
  )
}
