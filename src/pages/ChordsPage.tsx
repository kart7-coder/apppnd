import { useMemo, useState } from 'react'
import { allShapes, shapesFor } from '../music/chordDb'
import { ChordDiagram } from '../components/ChordDiagram'
import { Icon } from '../components/Icon'
import { describeShape } from '../music/explain'
import { strumChord } from '../engine/audio'
import { useFavorites } from '../lib/userData'
import { useMethodShapes } from '../content/method'
import type { ChordShape } from '../music/types'

const FILTERS = [
  { id: '', label: 'Todos' },
  { id: 'maior', label: 'Maiores' },
  { id: 'menor', label: 'Menores' },
  { id: 'setima', label: 'Com 7ª' },
  { id: 'outros', label: '9ª, sus, inversões' },
  { id: 'metodo', label: 'Do Método' },
  { id: 'fav', label: '♥ Favoritos' },
]

function kind(name: string): string {
  const s = name.replace(/^[A-G][#b]?/, '')
  if (name.includes('/') || /9|sus|add|4|5|6/.test(s)) return 'outros'
  if (/7/.test(s)) return 'setima'
  if (s.startsWith('m')) return 'menor'
  return 'maior'
}

export function ChordsPage() {
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('')
  const [open, setOpen] = useState<string | null>(null)
  const favs = useFavorites('chord')
  const methodShapes = useMethodShapes()

  const names = useMemo(() => {
    const isMethod = (s: ChordShape) => s.source.startsWith('Método')
    const pool = [...allShapes(), ...methodShapes]
    const out: string[] = []
    for (const s of pool) {
      if (out.includes(s.name)) continue
      if (filter === 'metodo' && !isMethod(s)) continue
      if (filter && filter !== 'metodo' && filter !== 'fav' && kind(s.name) !== filter) continue
      if (filter === 'fav' && !favs.isFav(s.name)) continue
      if (q && !s.name.toLowerCase().startsWith(q.trim().toLowerCase())) continue
      out.push(s.name)
    }
    return out
  }, [q, filter, favs, methodShapes])

  const variations = (name: string) => {
    const list = shapesFor(name)
    for (const s of methodShapes) if (s.name === name && !list.some((x) => x.frets.join() === s.frets.join())) list.push(s)
    return list.filter((s, i, arr) => arr.findIndex((x) => x.frets.join() === s.frets.join()) === i)
  }

  return (
    <div className="page">
      <h1>Dicionário de acordes</h1>
      <div className="search">
        <Icon name="search" />
        <input placeholder="Ex.: F#m, D/F#, Am7" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar acorde" />
      </div>
      <div className="chips scroll" role="group" aria-label="Tipo">
        {FILTERS.map((f) => (
          <button key={f.id} className={`chip ${filter === f.id ? 'on' : ''}`} onClick={() => setFilter(f.id)}>
            {f.label}
          </button>
        ))}
      </div>

      {open && (
        <section className="chord-detail" aria-label={`Acorde ${open}`}>
          <header className="row between">
            <h2>{open}</h2>
            <div className="row gap">
              <button className={`icon-btn ${favs.isFav(open) ? 'on' : ''}`} onClick={() => favs.toggle(open)} aria-label="Favoritar">
                <Icon name="heart" />
              </button>
              <button className="icon-btn" onClick={() => setOpen(null)} aria-label="Fechar">
                ✕
              </button>
            </div>
          </header>
          <div className="variations">
            {variations(open).map((s, i) => (
              <div key={s.id} className="variation">
                <button className="chord-tile" onClick={() => strumChord(s)} aria-label={`Ouvir ${s.name} forma ${i + 1}`}>
                  <ChordDiagram shape={s} size={150} />
                </button>
                <ul className="instructions small">
                  {describeShape(s).map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                  {s.note && <li className="warn">{s.note}</li>}
                </ul>
                <p className="muted small">{s.source}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="chord-grid">
        {names.map((n) => (
          <button key={n} className={`chord-tile ${open === n ? 'on' : ''}`} onClick={() => setOpen(n)}>
            <ChordDiagram shape={variations(n)[0]} name={n} size={96} />
          </button>
        ))}
      </div>
    </div>
  )
}
