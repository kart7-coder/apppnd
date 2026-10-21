import { useMemo, useState } from 'react'
import { allShapes, shapesFor } from '../music/chordDb'
import { ChordDiagram } from '../components/ChordDiagram'
import { Icon } from '../components/Icon'
import { describeShape } from '../music/explain'
import { strumChord } from '../engine/audio'
import { useFavorites } from '../lib/userData'
import { methodShapes } from '../content/method'
import { ChordLegend } from '../components/ChordLegend'
import type { ChordShape } from '../music/types'

const FILTERS = [
  { id: '', label: 'Todos' },
  { id: 'maior', label: 'Maiores (som alegre)' },
  { id: 'menor', label: 'Menores (som triste)' },
  { id: 'setima', label: 'Com 7 (som suave)' },
  { id: 'outros', label: 'Especiais' },
  { id: 'metodo', label: 'Do Método' },
  { id: 'fav', label: '♥ Salvos' },
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

  const names = useMemo(() => {
    const isMethod = (s: ChordShape) => s.source.startsWith('Método')
    const pool = [...allShapes(), ...methodShapes()]
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
  }, [q, filter, favs])

  const variations = (name: string) => {
    const list = shapesFor(name)
    for (const s of methodShapes()) if (s.name === name && !list.some((x) => x.frets.join() === s.frets.join())) list.push(s)
    return list.filter((s, i, arr) => arr.findIndex((x) => x.frets.join() === s.frets.join()) === i)
  }

  return (
    <div className="page">
      <header className="page-head">
        <span className="eyebrow">Dicionário</span>
        <h1>Onde colocar cada dedo</h1>
        <p className="lead">Procure pelo nome do acorde (as letras que aparecem em cima da letra da música) e toque para ouvir.</p>
      </header>
      <div className="search">
        <Icon name="search" />
        <input placeholder="Digite o acorde. Ex.: Am, G, D/F#" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar acorde" />
      </div>
      <div className="chips scroll" role="group" aria-label="Tipo">
        {FILTERS.map((f) => (
          <button key={f.id} className={`chip ${filter === f.id ? 'on' : ''}`} onClick={() => setFilter(f.id)}>
            {f.label}
          </button>
        ))}
      </div>

      {!open && <ChordLegend />}

      {open && (
        <section className="card chord-detail" aria-label={`Acorde ${open}`}>
          <header className="chord-detail-head">
            <h2>{open}</h2>
            <p className="muted small">{variations(open).length > 1 ? `${variations(open).length} jeitos de tocar. Arraste para o lado para ver todos.` : 'Toque no desenho para ouvir.'}</p>
            <div className="actions">
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
