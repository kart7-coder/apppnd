// Ofertas pagas. O pagamento acontece no WhatsApp pelo fluxo "Acordes" do Leona;
// depois do Pix, o admin libera o produto para o e-mail da pessoa em /admin.

export interface Offer {
  product: string
  title: string
  price: string
  pitch: string
  includes: string[]
  /** Mensagem que já vai escrita no WhatsApp. */
  message: string
}

export const OFFERS: Record<string, Offer> = {
  metodo_acordes: {
    product: 'metodo_acordes',
    title: 'Método Acordes Exclusivos',
    price: 'R$ 17,90',
    pitch: 'Saia do básico: acordes sofisticados nos 7 tons, organizados por grau do campo harmônico, com sequências prontas para treinar no modo Tocar.',
    includes: ['Os 7 tons completos (Dó, Ré, Mi, Fá, Sol, Lá, Si)', 'Sequências exclusivas para praticar', 'Bônus: hinos da Harpa, corinhos e louvores'],
    message: 'Olá! Vim pelo app e quero liberar o Método Acordes Exclusivos 🎸',
  },
  kit_iniciante: {
    product: 'kit_iniciante',
    title: 'Kit Iniciante no Violão',
    price: 'R$ 27',
    pitch: 'Passo a passo para quem está começando do zero, com batidas, formação de acordes e cifras para já sair tocando.',
    includes: ['Curso completo "Aprender a tocar"', 'Batidas com exemplos de músicas', 'Coletâneas de cifras gospel'],
    message: 'Olá! Vim pelo app e quero o Kit Iniciante no Violão 🎸',
  },
}

export function whatsappLink(offer: Offer, email?: string | null): string {
  const number = (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) ?? ''
  const text = email ? `${offer.message}\nMeu e-mail no app: ${email}` : offer.message
  return `https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`
}
