import { Link } from 'react-router-dom'
import { OFFERS, whatsappLink } from '../lib/offers'
import { useAuth } from '../lib/auth'
import { Icon } from './Icon'

export function OfferCard({ product, compact }: { product: string; compact?: boolean }) {
  const offer = OFFERS[product]
  const { user } = useAuth()
  if (!offer) return null
  if (compact)
    return (
      <Link to={`/oferta/${product}`} className="offer compact">
        <Icon name="lock" />
        <span>
          <b>{offer.title}</b>
          <small>{offer.pitch}</small>
        </span>
        <span className="price">{offer.price}</span>
      </Link>
    )
  return (
    <div className="offer">
      <p className="eyebrow">Conteúdo exclusivo</p>
      <h2>{offer.title}</h2>
      <p>{offer.pitch}</p>
      <ul className="checks">
        {offer.includes.map((i) => (
          <li key={i}>
            <Icon name="check" size={18} /> {i}
          </li>
        ))}
      </ul>
      <a className="btn btn-whats btn-block" href={whatsappLink(offer, user?.email)} target="_blank" rel="noopener noreferrer">
        <Icon name="whatsapp" /> Quero liberar por {offer.price}
      </a>
      <p className="muted small">
        Você conversa com a gente pelo WhatsApp e paga por Pix. Depois do pagamento, o acesso é liberado na sua conta ({user?.email}).
      </p>
    </div>
  )
}

export function Locked({ product }: { product: string }) {
  return (
    <div className="locked">
      <div className="locked-icon">
        <Icon name="lock" size={28} />
      </div>
      <OfferCard product={product} />
    </div>
  )
}
