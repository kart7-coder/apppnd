import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { useHistory, useProgress } from '../lib/userData'
import { Icon } from '../components/Icon'

const STARTER = 'harpa-291-a-mensagem-da-cruz'

const TOOLS = [
  { to: '/musicas', icon: 'music', title: 'Músicas', text: '30 hinos e louvores para tocar junto' },
  { to: '/treino', icon: 'bolt', title: 'Treino de troca', text: 'Pule de um acorde para outro sem travar' },
  { to: '/acordes', icon: 'grid', title: 'Acordes', text: 'Onde colocar cada dedo, com som' },
  { to: '/metodo', icon: 'book', title: 'Método', text: 'Acordes bonitos para cada tom' },
]

export function HomePage() {
  const auth = useAuth()
  const history = useHistory(4)
  const progress = useProgress('song')
  const first = (auth.profile?.name || '').split(' ')[0]
  const played = Object.values(progress).some((p) => p.completions)

  return (
    <div className="page">
      <header className="hero">
        <span className="eyebrow">{first ? `Paz, ${first} 🙏` : 'Bem-vindo 🙏'}</span>
        <h1>
          Toque sua primeira música <span className="grad-text">hoje.</span>
        </h1>
        <p className="lead">Os acordes descem pela tela como num jogo. Você só troca de acorde quando o bloco chega na linha.</p>
        <Link to={`/tocar/${STARTER}?modo=pratica`} className="hero-cta">
          <span className="hero-cta-icon">
            <Icon name="play" size={26} />
          </span>
          <span>
            <b>Começar com “A Mensagem da Cruz”</b>
            <small>Só 3 acordes · ideal para iniciantes</small>
          </span>
        </Link>
      </header>

      <section>
        <div className="section-head">
          <h2>Primeiros passos</h2>
          <p>Nunca tocou? Siga nessa ordem.</p>
        </div>
        <div className="steps">
          <Link to="/afinador" className="card card-hover step">
            <span className="step-num">1</span>
            <b>Afine o violão</b>
            <small>O app ouve pelo microfone e diz se a corda está certa.</small>
          </Link>
          <Link to={`/musicas/${STARTER}/aprender`} className="card card-hover step">
            <span className="step-num">2</span>
            <b>Aprenda 3 acordes</b>
            <small>Lá, Ré e Mi: com eles você já toca 10 hinos.</small>
          </Link>
          <Link to={`/tocar/${STARTER}?modo=pratica`} className="card card-hover step">
            <span className="step-num">3</span>
            <b>Toque junto</b>
            <small>Comece devagar e aumente a velocidade aos poucos.</small>
            {played && <span className="done"><Icon name="check" /></span>}
          </Link>
        </div>
      </section>

      {history.length > 0 && (
        <section>
          <div className="section-head">
            <h2>Continue de onde parou</h2>
          </div>
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
        <div className="section-head">
          <h2>Tudo para você praticar</h2>
          <p>Grátis e sem limite.</p>
        </div>
        <div className="tool-grid">
          {TOOLS.map((t) => (
            <Link key={t.to} to={t.to} className="card card-hover tool">
              <span className="tool-icon">
                <Icon name={t.icon} />
              </span>
              <b>{t.title}</b>
              <small>{t.text}</small>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
