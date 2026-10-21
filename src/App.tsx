import { lazy, Suspense, type ReactNode } from 'react'
import { BrowserRouter, Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/auth'
import { supabaseConfigured } from './lib/supabase'
import { Icon } from './components/Icon'
import { LoginPage, SignupPage, ForgotPage, ResetPasswordPage } from './pages/AuthPages'
import { HomePage } from './pages/HomePage'
import { SongsPage } from './pages/SongsPage'
import { SongDetailPage } from './pages/SongDetailPage'
import { PlaySongPage } from './pages/PlaySongPage'
import { LearnPage } from './pages/LearnPage'
import { ChordsPage } from './pages/ChordsPage'
import { MethodPage, MethodTonePage, MethodPlayPage } from './pages/MethodPages'
import { TrainerPage } from './pages/TrainerPage'
import { AccountPage } from './pages/AccountPage'
import { OfferPage } from './pages/OfferPage'

const TunerPage = lazy(() => import('./pages/TunerPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))

function RequireAuth({ children }: { children: ReactNode }) {
  const { loading, user, recovering } = useAuth()
  const loc = useLocation()
  if (loading) return <div className="center-screen"><div className="spinner" aria-label="Carregando" /></div>
  if (recovering) return <Navigate to="/nova-senha" replace />
  if (!user) return <Navigate to="/entrar" replace state={{ from: loc.pathname }} />
  return <>{children}</>
}

const NAV = [
  { to: '/', icon: 'home', label: 'Início', end: true },
  { to: '/musicas', icon: 'music', label: 'Tocar' },
  { to: '/acordes', icon: 'grid', label: 'Acordes' },
  { to: '/afinador', icon: 'tuner', label: 'Afinador' },
  { to: '/conta', icon: 'user', label: 'Conta' },
]

function Shell({ children }: { children: ReactNode }) {
  const { profile } = useAuth()
  return (
    <div className="shell">
      <nav className="nav" aria-label="Principal">
        <div className="nav-brand">
          <img src="/icon-192.png" alt="" width={34} height={34} />
          <span>
            <small>Método</small>
            <b>Acordes Exclusivos</b>
          </span>
        </div>
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end} className="nav-item">
            <Icon name={n.icon} />
            <span>{n.label}</span>
          </NavLink>
        ))}
        <NavLink to="/metodo" className="nav-item desktop-only">
          <Icon name="book" />
          <span>Método</span>
        </NavLink>
        <NavLink to="/treino" className="nav-item desktop-only">
          <Icon name="bolt" />
          <span>Treino de troca</span>
        </NavLink>
        {profile?.is_admin && (
          <NavLink to="/admin" className="nav-item desktop-only">
            <Icon name="shield" />
            <span>Admin</span>
          </NavLink>
        )}
      </nav>
      <main className="main">{children}</main>
    </div>
  )
}

function Protected({ children, bare }: { children: ReactNode; bare?: boolean }) {
  return <RequireAuth>{bare ? children : <Shell>{children}</Shell>}</RequireAuth>
}

export default function App() {
  if (!supabaseConfigured) {
    return (
      <div className="center-screen">
        <div className="card narrow">
          <h1>Configuração pendente</h1>
          <p>Defina VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY (veja o arquivo .env.example).</p>
        </div>
      </div>
    )
  }
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="center-screen"><div className="spinner" /></div>}>
          <Routes>
            <Route path="/entrar" element={<LoginPage />} />
            <Route path="/criar-conta" element={<SignupPage />} />
            <Route path="/recuperar-senha" element={<ForgotPage />} />
            <Route path="/nova-senha" element={<ResetPasswordPage />} />
            <Route path="/" element={<Protected><HomePage /></Protected>} />
            <Route path="/musicas" element={<Protected><SongsPage /></Protected>} />
            <Route path="/musicas/:id" element={<Protected><SongDetailPage /></Protected>} />
            <Route path="/musicas/:id/aprender" element={<Protected><LearnPage /></Protected>} />
            <Route path="/tocar/:id" element={<Protected bare><PlaySongPage /></Protected>} />
            <Route path="/acordes" element={<Protected><ChordsPage /></Protected>} />
            <Route path="/metodo" element={<Protected><MethodPage /></Protected>} />
            <Route path="/metodo/:tone" element={<Protected><MethodTonePage /></Protected>} />
            <Route path="/metodo/:tone/tocar/:seq/:opt" element={<Protected bare><MethodPlayPage /></Protected>} />
            <Route path="/treino" element={<Protected><TrainerPage /></Protected>} />
            <Route path="/afinador" element={<Protected><TunerPage /></Protected>} />
            <Route path="/conta" element={<Protected><AccountPage /></Protected>} />
            <Route path="/oferta/:product" element={<Protected><OfferPage /></Protected>} />
            <Route path="/admin" element={<Protected><AdminPage /></Protected>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}
