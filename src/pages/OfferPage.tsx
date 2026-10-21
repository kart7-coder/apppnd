import { Navigate, useParams } from 'react-router-dom'
import { OFFERS } from '../lib/offers'
import { OfferCard } from '../components/OfferCard'
import { useAuth, hasProduct } from '../lib/auth'

export function OfferPage() {
  const { product = '' } = useParams()
  const auth = useAuth()
  if (!OFFERS[product]) return <Navigate to="/" replace />
  return (
    <div className="page">
      {hasProduct(auth, product) ? <p className="note">✓ Você já tem acesso a {OFFERS[product].title}.</p> : <OfferCard product={product} />}
    </div>
  )
}
