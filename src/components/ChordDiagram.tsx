import type { ChordShape } from '../music/types'

/** Uma cor por dedo (a mesma do desenho da mão). */
export const FINGER_COLORS = ['#ff8a2b', '#ff8a2b', '#2fe0c4', '#a18bff', '#ff5c8a']

interface Props {
  shape?: ChordShape
  name?: string
  size?: number
  showName?: boolean
  className?: string
}

const FRETS_SHOWN = 5

export function baseFretOf(shape: ChordShape): number {
  const pressed = shape.frets.filter((f) => f > 0)
  if (!pressed.length) return 1
  const max = Math.max(...pressed)
  return max <= FRETS_SHOWN ? 1 : Math.min(...pressed)
}

/** Diagrama vertical: cordas da 6ª (esquerda) à 1ª (direita), casas de cima para baixo. */
export function ChordDiagram({ shape, name, size = 140, showName = true, className }: Props) {
  const label = name ?? shape?.name ?? ''
  const w = size
  const h = size * 1.25
  const padX = w * 0.16
  const top = h * (showName ? 0.27 : 0.14)
  const bottom = h * 0.95
  const gridW = w - padX * 2
  const gridH = bottom - top
  const sx = (i: number) => padX + (gridW / 5) * i
  const fy = (f: number) => top + (gridH / FRETS_SHOWN) * f
  const r = Math.min(gridW / 5, gridH / FRETS_SHOWN) * 0.36

  if (!shape) {
    return (
      <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className={className} role="img" aria-label={`${label}: diagrama não cadastrado`}>
        {showName && <text x={w / 2} y={h * 0.13} className="cd-name" textAnchor="middle" fontSize={w * 0.15}>{label}</text>}
        <rect x={padX} y={top} width={gridW} height={gridH} className="cd-missing" rx={6} />
        <text x={w / 2} y={top + gridH / 2} textAnchor="middle" className="cd-missing-text" fontSize={w * 0.075}>
          diagrama não cadastrado
        </text>
      </svg>
    )
  }

  const base = baseFretOf(shape)
  const rel = (f: number) => f - base + 1
  const barres = shape.barres ?? []
  const inBarre = (stringIdx: number, fret: number, finger: number) =>
    barres.some((b) => b.fret === fret && b.finger === finger && 6 - stringIdx <= b.fromString && 6 - stringIdx >= b.toString)

  const desc = shape.frets
    .map((f, i) => `corda ${6 - i}: ${f < 0 ? 'não tocar' : f === 0 ? 'solta' : `casa ${f}, dedo ${shape.fingers[i]}`}`)
    .join('; ')

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className={className} role="img" aria-label={`${label}. ${desc}`}>
      {showName && (
        <text x={w / 2} y={h * 0.13} className="cd-name" textAnchor="middle" fontSize={w * 0.15}>
          {label}
        </text>
      )}
      {/* casas */}
      {Array.from({ length: FRETS_SHOWN + 1 }, (_, f) => (
        <line key={f} x1={sx(0)} x2={sx(5)} y1={fy(f)} y2={fy(f)} className={f === 0 && base === 1 ? 'cd-nut' : 'cd-fret'} />
      ))}
      {/* cordas */}
      {Array.from({ length: 6 }, (_, i) => (
        <line key={i} x1={sx(i)} x2={sx(i)} y1={top} y2={bottom} className="cd-string" strokeWidth={1 + (5 - i) * 0.25} />
      ))}
      {base > 1 && (
        <text x={padX - r * 0.6} y={fy(0.5) + r * 0.45} textAnchor="end" className="cd-pos" fontSize={w * 0.095}>
          {base}ª
        </text>
      )}
      {/* cordas soltas / abafadas */}
      {shape.frets.map((f, i) => {
        const y = top - r * 1.25
        if (f < 0)
          return (
            <g key={i} className="cd-mute" aria-hidden>
              <line x1={sx(i) - r * 0.6} x2={sx(i) + r * 0.6} y1={y - r * 0.6} y2={y + r * 0.6} />
              <line x1={sx(i) - r * 0.6} x2={sx(i) + r * 0.6} y1={y + r * 0.6} y2={y - r * 0.6} />
            </g>
          )
        if (f === 0)
          return <circle key={i} cx={sx(i)} cy={y} r={r * 0.62} className={shape.rootString === 6 - i ? 'cd-open cd-root' : 'cd-open'} />
        return null
      })}
      {/* pestanas */}
      {barres.map((b, k) => {
        const x1 = sx(6 - b.fromString)
        const x2 = sx(6 - b.toString)
        const y = fy(rel(b.fret) - 0.5)
        return (
          <g key={k}>
            <rect x={x1 - r} y={y - r} width={x2 - x1 + 2 * r} height={2 * r} rx={r} className="cd-barre" style={{ fill: FINGER_COLORS[b.finger] }} />
            <text x={(x1 + x2) / 2} y={y + r * 0.42} textAnchor="middle" className="cd-finger" fontSize={r * 1.2}>
              {b.finger}
            </text>
          </g>
        )
      })}
      {/* dedos */}
      {shape.frets.map((f, i) => {
        if (f <= 0) return null
        const finger = shape.fingers[i]
        if (inBarre(i, f, finger)) return null
        const cy = fy(rel(f) - 0.5)
        return (
          <g key={i}>
            <circle cx={sx(i)} cy={cy} r={r} className="cd-dot" style={{ fill: FINGER_COLORS[finger] }} />
            {finger > 0 && (
              <text x={sx(i)} y={cy + r * 0.42} textAnchor="middle" className="cd-finger" fontSize={r * 1.2}>
                {finger}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}
