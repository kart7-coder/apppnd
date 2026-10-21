import { useEffect } from 'react'
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { getSong, songShape, songTimeline } from '../content'
import { Player, type PlayMode } from '../components/Player'
import { useAuth, hasProduct } from '../lib/auth'
import { logHistory, saveProgress } from '../lib/userData'

export function PlaySongPage() {
  const { id = '' } = useParams()
  const [params] = useSearchParams()
  const nav = useNavigate()
  const auth = useAuth()
  const song = getSong(id)
  const mode: PlayMode = params.get('modo') === 'pratica' ? 'pratica' : 'jogo'

  useEffect(() => {
    if (song && auth.user) logHistory(auth.user.id, 'song', song.id, song.title)
  }, [song, auth.user])

  if (!song || !hasProduct(auth, song.product)) return <Navigate to={`/musicas/${id}`} replace />

  return (
    <Player
      title={song.title}
      subtitle={mode === 'pratica' ? 'Prática guiada' : 'Modo jogo'}
      timeline={songTimeline(song)}
      bpm={song.bpm}
      sync={song.sync}
      shapeFor={(c) => songShape(song, c)}
      mode={mode}
      onExit={() => nav(`/musicas/${song.id}`)}
      onComplete={({ speed, practicedSec }) => {
        if (!auth.user) return
        saveProgress(auth.user.id, 'song', song.id, (old) => ({
          ...old,
          completions: (old.completions ?? 0) + 1,
          bestSpeed: Math.max(old.bestSpeed ?? 0, speed),
          practicedSec: (old.practicedSec ?? 0) + practicedSec,
        }))
      }}
    />
  )
}
