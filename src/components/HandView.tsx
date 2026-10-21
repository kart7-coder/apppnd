import type { ChordShape } from '../music/types'
import { FINGER_COLORS, baseFretOf } from './ChordDiagram'

interface Props {
  shape?: ChordShape
  /** Largura em px (a altura acompanha). */
  width?: number
  className?: string
}

const FINGER_NAMES = ['', 'indicador', 'médio', 'anelar', 'mindinho']

/**
 * Braço do violão deitado, como você vê olhando para baixo enquanto toca:
 * a corda mais grossa (6) fica em cima e a cabeça do violão à esquerda.
 * Cada bolinha colorida é um dedo (mesmas cores do ícone da mão).
 */
export function HandView({ shape, width = 340, className }: Props) {
  const W = 340
  const H = 132
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



  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={width}
      height={(width * H) / W}
      className={className}
      role="img"
      aria-label={`Braço do violão: ${tips.map((t) => `dedo ${t.finger}`).join(', ') || 'cordas soltas'}`}
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

      {/* pontas dos dedos: sempre por cima, para nenhuma ficar escondida */}
      {tips.map((tip) => (
        <g key={tip.finger}>
          {tip.y2 != null ? (
            <rect x={tip.x - 10} y={tip.y - 10} width={20} height={tip.y2 - tip.y + 20} rx={10} fill={FINGER_COLORS[tip.finger]} stroke="#fff" strokeWidth={1.5} />
          ) : (
            <circle cx={tip.x} cy={tip.y} r={10} fill={FINGER_COLORS[tip.finger]} stroke="#fff" strokeWidth={1.5} />
          )}
          <text x={tip.x} y={(tip.y2 != null ? (tip.y + tip.y2) / 2 : tip.y) + 4.2} textAnchor="middle" fontSize={12} fontWeight={700} fill="#14100c">
            {tip.finger}
          </text>
        </g>
      ))}
    </svg>
  )
}

/** Ícone de mão em traço, com a ponta de cada dedo na cor dele. */
export function HandIcon({ size = 92, active = [] as number[] }: { size?: number; active?: number[] }) {
  // dedos: [x da base, altura] — indicador a mindinho
  const F = [
    { f: 1, x: 30, top: 14 },
    { f: 2, x: 46, top: 6 },
    { f: 3, x: 62, top: 10 },
    { f: 4, x: 77, top: 24 },
  ]
  return (
    <svg viewBox="0 0 100 110" width={size} height={(size * 110) / 100} role="img" aria-label="Dedos: 1 indicador, 2 médio, 3 anelar, 4 mindinho" className="hand-icon">
      <g fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.55)" strokeWidth={2.4} strokeLinejoin="round">
        {F.map((d) => (
          <rect key={d.f} x={d.x - 6.5} y={d.top} width={13} height={64 - d.top} rx={6.5} />
        ))}
        <rect x={6} y={50} width={13} height={36} rx={6.5} transform="rotate(-32 12 70)" />
        <path d="M22 58 H86 V80 C86 96 74 104 58 104 H44 C30 104 22 94 22 80 Z" />
      </g>
      {F.map((d) => (
        <g key={d.f} opacity={active.length && !active.includes(d.f) ? 0.3 : 1}>
          <circle cx={d.x} cy={d.top + 7} r={7.5} fill={FINGER_COLORS[d.f]} />
          <text x={d.x} y={d.top + 10.5} textAnchor="middle" fontSize={9.5} fontWeight={700} fill="#14100c">
            {d.f}
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
