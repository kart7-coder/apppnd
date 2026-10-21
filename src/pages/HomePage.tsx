import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { useHistory, useProgress } from '../lib/userData'
import { Icon } from '../components/Icon'

const STARTER = 'harpa-291-a-mensagem-da-cruz'

const STEPS = [
  { to: '/afinador', title: 'Afinar o violão', text: 'O app ouve e te guia' },
  { to: `/musicas/${STARTER}/aprender`, title: 'Aprender 3 acordes', text: 'Lá, Ré e Mi' },
  { to: `/tocar/${STARTER}?modo=pratica`, title: 'Tocar a 1ª música', text: 'Bem devagar no começo' },
]

const TOOLS = [
  { to: '/musicas', icon: 'music', title: 'Músicas' },
  { to: '/acordes', icon: 'grid', title: 'Acordes' },
  { to: '/treino', icon: 'bolt', title: 'Treino' },
  { to: '/metodo', icon: 'book', title: 'Método' },
]

export function HomePage() {
  const auth = useAuth()
  const history = useHistory(3)
  const progress = useProgress('song')
  const first = (auth.profile?.name || '').split(' ')[0]
  const played = Object.values(progress).some((p) => p.completions)
  const last = history.find((h) => h.item_type === 'song')

  return (
    <div className="page home">
      <header className="hero">
        <p className="hello">Olá{first ? `, ${first}` : ''} 👋</p>
        <h1>
          Vamos tocar <span className="grad-text">hoje?</span>
        </h1>
        <Link to={last ? `/musicas/${last.item_id}` : `/tocar/${STARTER}?modo=pratica`} className="btn btn-primary btn-hero">
          <Icon name="play" /> <span className="ellipsis">{last ? `Continuar: ${last.title}` : 'Começar agora'}</span>
        </Link>
      </header>

      {!played && (
        <section>
          <h2 className="h-small">Primeira vez? Siga os 3 passos</h2>
          <div className="step-list">
            {STEPS.map((s, i) => (
              <Link key={s.to} to={s.to} className="step-row">
                <span className="step-num">{i + 1}</span>
                <span className="step-text">
                  <b>{s.title}</b>
                  <small>{s.text}</small>
                </span>
                <Icon name="chevron" size={18} />
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="quick-grid">
          {TOOLS.map((t) => (
            <Link key={t.to} to={t.to} className="quick">
              <span className="tool-icon">
                <Icon name={t.icon} />
              </span>
              <b>{t.title}</b>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
