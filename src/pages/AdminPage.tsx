import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { OFFERS } from '../lib/offers'

interface Row {
  id: string
  name: string | null
  email: string | null
  created_at: string
}
interface Ent {
  id: number
  user_id: string
  product: string
  granted_at: string
  revoked_at: string | null
}

/** Painel para liberar ou revogar acesso depois do pagamento no WhatsApp. */
export default function AdminPage() {
  const auth = useAuth()
  const [q, setQ] = useState('')
  const [rows, setRows] = useState<Row[]>([])
  const [ents, setEnts] = useState<Ent[]>([])
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  if (!auth.profile?.is_admin) return <Navigate to="/" replace />

  async function search(e?: FormEvent) {
    e?.preventDefault()
    setBusy(true)
    setMsg('')
    const term = q.trim()
    const { data, error } = await supabase
      .from('profiles')
      .select('id,name,email,created_at')
      .or(`email.ilike.%${term.replace(/[%,()]/g, '')}%,name.ilike.%${term.replace(/[%,()]/g, '')}%`)
      .order('created_at', { ascending: false })
      .limit(20)
    if (error) {
      setBusy(false)
      return setMsg('Erro ao buscar: ' + error.message)
    }
    const list = (data as Row[]) ?? []
    setRows(list)
    const { data: e2 } = await supabase.from('entitlements').select('id,user_id,product,granted_at,revoked_at').in('user_id', list.map((r) => r.id))
    setEnts((e2 as Ent[]) ?? [])
    setBusy(false)
    if (!list.length) setMsg('Ninguém encontrado. A pessoa precisa criar a conta no app primeiro.')
  }

  async function grant(userId: string, product: string) {
    const { error } = await supabase.from('entitlements').insert({ user_id: userId, product, granted_by: auth.user!.id, note: 'Pix via WhatsApp' })
    setMsg(error ? 'Erro: ' + error.message : 'Acesso liberado ✓')
    search()
  }

  async function revoke(entId: number) {
    if (!confirm('Revogar este acesso?')) return
    const { error } = await supabase.from('entitlements').update({ revoked_at: new Date().toISOString() }).eq('id', entId)
    setMsg(error ? 'Erro: ' + error.message : 'Acesso revogado.')
    search()
  }

  return (
    <div className="page">
      <h1>Admin · Liberar acessos</h1>
      <p className="muted">
        Depois que a pessoa pagar pelo WhatsApp, busque pelo e-mail que ela usa no app e libere o produto. O acesso aparece na hora (ou ao reabrir o app).
      </p>
      <form onSubmit={search} className="search">
        <input placeholder="E-mail ou nome" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar pessoa" />
        <button className="btn btn-primary btn-sm" disabled={busy || q.trim().length < 2}>
          Buscar
        </button>
      </form>
      {msg && <p className="note">{msg}</p>}
      <div className="list">
        {rows.map((r) => (
          <div key={r.id} className="admin-row">
            <div>
              <b>{r.name || '(sem nome)'}</b>
              <small>{r.email} · desde {new Date(r.created_at).toLocaleDateString('pt-BR')}</small>
            </div>
            <div className="admin-actions">
              {Object.values(OFFERS).map((o) => {
                const active = ents.find((e) => e.user_id === r.id && e.product === o.product && !e.revoked_at)
                return active ? (
                  <button key={o.product} className="chip on" onClick={() => revoke(active.id)} title="Clique para revogar">
                    ✓ {o.title}
                  </button>
                ) : (
                  <button key={o.product} className="chip" onClick={() => grant(r.id, o.product)}>
                    + {o.title}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
