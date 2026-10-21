import type { ChordShape } from '../music/types'
import { FINGER_COLORS, baseFretOf } from './ChordDiagram'

interface Props {
  shape?: ChordShape
  /** Largura em px (a altura acompanha). */
  width?: number
  className?: string
}

const FINGER_NAMES = ['', 'indicador', 'médio', 'anelar', 'mindinho']
const SKIN = '#f0c3a0'
const SKIN_EDGE = '#c98f6b'

/**
 * Braço do violão deitado, como você vê olhando para baixo enquanto toca:
 * a corda mais grossa (6) fica em cima e a cabeça do violão à esquerda.
 * A mão vem por baixo do braço e cada dedo encosta na corda/casa certa.
 */
export function HandView({ shape, width = 340, className }: Props) {
  const W = 340
  const H = 200
  const left = 34
  const fretW = 60
  const top = 22
  const gap = 17
  const sy = (str: number) => top + (6 - str) * gap // corda 6 em cima
  const neckBottom = sy(1) + 10
  if (!shape) return null

  const base = baseFretOf(shape)
  const fx = (fret: number) => left + fretW * (fret - base + 0.5)
  const barres = shape.barres ?? []

  // Onde cada dedo encosta.
  type Tip = { finger: number; x: number; y: number; y2?: number }
  const tips: Tip[] = []
  for (const b of barres) tips.push({ finger: b.finger, x: fx(b.fret), y: sy(b.fromString), y2: sy(b.toString) })
  shape.frets.forEach((fret, i) => {
    const finger = shape.fingers[i]
    if (fret <= 0 || !finger) return
    const str = 6 - i
    const inBarre = barres.some((b) => b.finger === finger && b.fret === fret && str <= b.fromString && str >= b.toString)
    if (!inBarre && !tips.some((t) => t.finger === finger)) tips.push({ finger, x: fx(fret), y: sy(str) })
  })

  const xs = tips.map((t) => t.x)
  const palmX = xs.length ? Math.min(Math.max((Math.min(...xs) + Math.max(...xs)) / 2 + 10, 110), 260) : 140
  const knuckle = (f: number) => ({ x: palmX - 45 + (f - 1) * 30, y: neckBottom + 36 })

  const fingers = [4, 3, 2, 1] // desenha o indicador por último (fica por cima)

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={width}
      height={(width * H) / W}
      className={className}
      role="img"
      aria-label={`Mão no braço do violão: ${tips.map((t) => `dedo ${t.finger}`).join(', ') || 'cordas soltas'}`}
    >
      {/* braço */}
      <rect x={left} y={top - 10} width={W - left - 6} height={neckBottom - top + 10} rx={6} fill="#3a2717" />
      <rect x={left} y={top - 10} width={W - left - 6} height={neckBottom - top + 10} rx={6} fill="url(#wood)" opacity={0.6} />
      <defs>
        <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5a3b22" />
          <stop offset="1" stopColor="#24170d" />
        </linearGradient>
      </defs>
      {/* trastes (ferrinhos) */}
      {Array.from({ length: 6 }, (_, k) => (
        <line
          key={k}
          x1={left + k * fretW}
          x2={left + k * fretW}
          y1={top - 10}
          y2={neckBottom}
          stroke={k === 0 && base === 1 ? '#f2efe6' : '#b9b3a6'}
          strokeWidth={k === 0 && base === 1 ? 7 : 2.5}
        />
      ))}
      {/* marcações do braço */}
      {[3, 5, 7, 9, 12].map((m) =>
        m >= base && m < base + 5 ? <circle key={m} cx={fx(m)} cy={(top + neckBottom) / 2 - 5} r={4} fill="#e9e1cf" opacity={0.35} /> : null,
      )}
      {/* cordas */}
      {[6, 5, 4, 3, 2, 1].map((str) => (
        <line key={str} x1={left - 4} x2={W - 6} y1={sy(str)} y2={sy(str)} stroke="#dcdde6" strokeWidth={0.8 + str * 0.32} opacity={0.9} />
      ))}
      {/* números das cordas e corda solta/abafada */}
      {[6, 5, 4, 3, 2, 1].map((str) => {
        const f = shape.frets[6 - str]
        return (
          <g key={str}>
            {f === 0 && <circle cx={left - 16} cy={sy(str)} r={5.5} fill="none" stroke="#3ee39b" strokeWidth={2.2} />}
            {f < 0 && (
              <g stroke="#ff6b7a" strokeWidth={2.2} strokeLinecap="round">
                <line x1={left - 21} x2={left - 11} y1={sy(str) - 5} y2={sy(str) + 5} />
                <line x1={left - 21} x2={left - 11} y1={sy(str) + 5} y2={sy(str) - 5} />
              </g>
            )}
            {f > 0 && (
              <text x={left - 16} y={sy(str) + 4} textAnchor="middle" fontSize={10} fill="#9097b3">
                {str}
              </text>
            )}
          </g>
        )
      })}
      {base > 1 && (
        <text x={fx(base)} y={H - 4} textAnchor="middle" fontSize={12} fill="#c7cbe0" fontWeight={600}>
          casa {base}
        </text>
      )}

      {/* palma */}
      <ellipse cx={palmX} cy={H + 8} rx={74} ry={40} fill={SKIN} stroke={SKIN_EDGE} strokeWidth={2} />

      {/* dedos (corpo) */}
      {fingers.map((f) => {
        const tip = tips.find((t) => t.finger === f)
        const k = knuckle(f)
        if (!tip) {
          // dedo livre: dobrado, sem encostar no braço
          return <line key={f} x1={k.x} y1={H} x2={k.x} y2={k.y + 8} stroke={SKIN} strokeWidth={15} strokeLinecap="round" opacity={0.85} />
        }
        const bottom = tip.y2 ?? tip.y
        const d = `M ${k.x} ${H + 4} L ${k.x} ${k.y} Q ${k.x} ${bottom + 24} ${tip.x} ${bottom + 9}`
        return (
          <g key={f}>
            <path d={d} fill="none" stroke={SKIN_EDGE} strokeWidth={16} strokeLinecap="round" />
            <path d={d} fill="none" stroke={SKIN} strokeWidth={13} strokeLinecap="round" />
          </g>
        )
      })}
      {/* pontas dos dedos: sempre por cima, para nenhuma ficar escondida */}
      {tips.map((tip) => (
        <g key={tip.finger}>
          {tip.y2 != null ? (
            <rect x={tip.x - 8} y={tip.y - 8} width={16} height={tip.y2 - tip.y + 16} rx={8} fill={FINGER_COLORS[tip.finger]} stroke="#fff" strokeWidth={1.5} />
          ) : (
            <circle cx={tip.x} cy={tip.y} r={8.5} fill={FINGER_COLORS[tip.finger]} stroke="#fff" strokeWidth={1.5} />
          )}
          <text x={tip.x} y={(tip.y2 != null ? (tip.y + tip.y2) / 2 : tip.y) + 3.8} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="#14100c">
            {tip.finger}
          </text>
        </g>
      ))}
    </svg>
  )
}

/** Legenda das cores dos dedos. */
export function FingerLegend() {
  return (
    <div className="finger-legend">
      {[1, 2, 3, 4].map((f) => (
        <span key={f}>
          <i style={{ background: FINGER_COLORS[f] }}>{f}</i>
          {FINGER_NAMES[f]}
        </span>
      ))}
    </div>
  )
}
