import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { authErrorPt, useAuth } from '../lib/auth'

function AuthLayout({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="auth">
      <div className="auth-strings" aria-hidden>
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} />
        ))}
      </div>
      <div className="auth-card">
        <img src="/icon-192.png" alt="" className="auth-logo" width={64} height={64} />
        <span className="eyebrow">Acordes Exclusivos</span>
        <h1>{title}</h1>
        {subtitle && <p className="muted">{subtitle}</p>}
        {children}
      </div>
    </div>
  )
}

export function LoginPage() {
  const { user, loading } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  if (!loading && user) return <Navigate to={(loc.state as { from?: string } | null)?.from ?? '/'} replace />

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setBusy(false)
    if (error) setError(authErrorPt(error.message))
    else nav((loc.state as { from?: string } | null)?.from ?? '/', { replace: true })
  }

  return (
    <AuthLayout title="Que bom te ver!" subtitle="Aprenda violão tocando os hinos e louvores da sua igreja, mesmo que nunca tenha tocado.">
      <form onSubmit={submit} className="form">
        <label>
          E-mail
          <input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Senha
          <input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error && <p className="alert" role="alert">{error}</p>}
        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
      <p className="auth-links">
        <Link to="/recuperar-senha">Esqueci minha senha</Link>
        <span>
          Não tem conta? <Link to="/criar-conta">Criar conta grátis</Link>
        </span>
      </p>
    </AuthLayout>
  )
}

export function SignupPage() {
  const { user, loading } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  if (!loading && user) return <Navigate to="/" replace />

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (password.length < 6) return setError('A senha precisa ter pelo menos 6 caracteres.')
    setBusy(true)
    setError(null)
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { name: name.trim() }, emailRedirectTo: `${location.origin}/` },
    })
    setBusy(false)
    if (error) return setError(authErrorPt(error.message))
    // Com confirmação de e-mail ligada, não há sessão até a pessoa clicar no link.
    if (!data.session) setSent(true)
  }

  if (sent)
    return (
      <AuthLayout title="Confirme seu e-mail" subtitle={`Enviamos um link para ${email}. Abra o e-mail e toque no link para ativar sua conta.`}>
        <Link className="btn btn-block" to="/entrar">
          Voltar para entrar
        </Link>
      </AuthLayout>
    )

  return (
    <AuthLayout title="Crie sua conta grátis" subtitle="Tudo liberado. Seu progresso fica salvo no celular e no computador.">
      <form onSubmit={submit} className="form">
        <label>
          Nome
          <input autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          E-mail
          <input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Senha (mín. 6 caracteres)
          <input type="password" autoComplete="new-password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error && <p className="alert" role="alert">{error}</p>}
        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? 'Criando…' : 'Criar conta'}
        </button>
      </form>
      <p className="auth-links">
        <span>
          Já tem conta? <Link to="/entrar">Entrar</Link>
        </span>
      </p>
    </AuthLayout>
  )
}

export function ForgotPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${location.origin}/nova-senha` })
    setBusy(false)
    if (error) setError(authErrorPt(error.message))
    else setSent(true)
  }

  return (
    <AuthLayout title="Recuperar senha" subtitle={sent ? 'Se o e-mail estiver cadastrado, você vai receber um link para criar uma nova senha.' : 'Informe o e-mail da sua conta.'}>
      {!sent && (
        <form onSubmit={submit} className="form">
          <label>
            E-mail
            <input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          {error && <p className="alert" role="alert">{error}</p>}
          <button className="btn btn-primary btn-block" disabled={busy}>
            {busy ? 'Enviando…' : 'Enviar link'}
          </button>
        </form>
      )}
      <p className="auth-links">
        <Link to="/entrar">Voltar para entrar</Link>
      </p>
    </AuthLayout>
  )
}

export function ResetPasswordPage() {
  const { session, loading } = useAuth()
  const nav = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (password.length < 6) return setError('A senha precisa ter pelo menos 6 caracteres.')
    setBusy(true)
    const { error } = await supabase.auth.updateUser({ password })
    setBusy(false)
    if (error) setError(authErrorPt(error.message))
    else {
      // Recarrega para limpar o estado de recuperação.
      nav('/', { replace: true })
      location.reload()
    }
  }

  if (!loading && !session)
    return (
      <AuthLayout title="Link expirado" subtitle="Abra novamente o link do e-mail ou peça um novo.">
        <Link className="btn btn-block" to="/recuperar-senha">
          Pedir novo link
        </Link>
      </AuthLayout>
    )

  return (
    <AuthLayout title="Nova senha">
      <form onSubmit={submit} className="form">
        <label>
          Nova senha
          <input type="password" autoComplete="new-password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error && <p className="alert" role="alert">{error}</p>}
        <button className="btn btn-primary btn-block" disabled={busy}>
          Salvar senha
        </button>
      </form>
    </AuthLayout>
  )
}
