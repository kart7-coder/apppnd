import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from './supabase'

export interface Profile {
  id: string
  name: string | null
  email: string | null
  is_admin: boolean
}

interface AuthState {
  loading: boolean
  session: Session | null
  user: User | null
  profile: Profile | null
  /** Evento PASSWORD_RECOVERY recebido (link "esqueci a senha"). */
  recovering: boolean
  refresh(): Promise<void>
  signOut(): Promise<void>
}

const Ctx = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [recovering, setRecovering] = useState(false)

  async function loadUserData(s: Session | null) {
    if (!s) {
      setProfile(null)
      return
    }
    const p = await supabase.from('profiles').select('id,name,email,is_admin').eq('id', s.user.id).maybeSingle()
    setProfile(
      (p.data as Profile | null) ?? {
        id: s.user.id,
        name: (s.user.user_metadata?.name as string) ?? null,
        email: s.user.email ?? null,
        is_admin: false,
      },
    )
  }

  useEffect(() => {
    let alive = true
    supabase.auth.getSession().then(async ({ data }) => {
      if (!alive) return
      setSession(data.session)
      await loadUserData(data.session)
      if (alive) setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      if (event === 'PASSWORD_RECOVERY') setRecovering(true)
      setSession(s)
      // Fora do callback para não travar o cliente do Supabase.
      setTimeout(() => loadUserData(s), 0)
    })
    return () => {
      alive = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const value: AuthState = {
    loading,
    session,
    user: session?.user ?? null,
    profile,
    recovering,
    refresh: () => loadUserData(session),
    signOut: async () => {
      await supabase.auth.signOut()
      setRecovering(false)
    },
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAuth(): AuthState {
  const v = useContext(Ctx)
  if (!v) throw new Error('useAuth fora do AuthProvider')
  return v
}

/** Mensagens do Supabase em português. */
export function authErrorPt(msg: string): string {
  const m = msg.toLowerCase()
  if (m.includes('invalid login')) return 'E-mail ou senha incorretos.'
  if (m.includes('email not confirmed')) return 'Confirme seu e-mail pelo link que enviamos antes de entrar.'
  if (m.includes('already registered')) return 'Este e-mail já tem conta. Tente entrar ou recuperar a senha.'
  if (m.includes('password should be')) return 'A senha precisa ter pelo menos 6 caracteres.'
  if (m.includes('rate limit')) return 'Muitas tentativas. Aguarde alguns minutos e tente de novo.'
  if (m.includes('failed to fetch') || m.includes('network')) return 'Sem conexão com o servidor. Verifique sua internet.'
  return msg
}
