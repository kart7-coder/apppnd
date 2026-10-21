import { useId } from 'react'
import type { ChordShape } from '../music/types'
import { FINGER_COLORS, baseFretOf } from './ChordDiagram'

interface Props {
  shape?: ChordShape
  /** Largura em px (a altura acompanha). */
  width?: number
  className?: string
  /** Desenhar a mão (falso = só o braço com as bolinhas). */
  hand?: boolean
}

export const FINGER_NAMES = ['', 'Indicador', 'Médio', 'Anelar', 'Mindinho']

const W = 360
const H = 232
const LEFT = 42
const TOP = 32
const GAP = 17.5
const FRETS = 5
const FRET_W = (W - LEFT - 4) / FRETS
const sy = (str: number) => TOP + (6 - str) * GAP // corda 6 (mais grossa) em cima
const NECK_BOTTOM = sy(1) + 10

type Pt = { x: number; y: number }

function bezier(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const u = 1 - t
  return {
    x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
    y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
  }
}

/** Contorno de um dedo que afina da base até a ponta, ao longo de uma curva. */
function fingerGeometry(pts: Pt[], wBase: number, wTip: number, grow = 0) {
  const n = pts.length
  const left: Pt[] = []
  const right: Pt[] = []
  const normals: Pt[] = []
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)]
    const b = pts[Math.min(n - 1, i + 1)]
    const dx = b.x - a.x
    const dy = b.y - a.y
    const len = Math.hypot(dx, dy) || 1
    const nx = -dy / len
    const ny = dx / len
    normals.push({ x: nx, y: ny })
    const w = (wBase + (wTip - wBase) * (i / (n - 1))) / 2 + grow
    left.push({ x: pts[i].x + nx * w, y: pts[i].y + ny * w })
    right.push({ x: pts[i].x - nx * w, y: pts[i].y - ny * w })
  }
  const rTip = wTip / 2 + grow
  const f = (p: Pt) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`
  const d =
    `M ${f(left[0])} ` +
    left.slice(1).map((p) => `L ${f(p)}`).join(' ') +
    ` A ${rTip} ${rTip} 0 0 1 ${f(right[n - 1])} ` +
    right.slice(0, -1).reverse().map((p) => `L ${f(p)}`).join(' ') +
    ' Z'
  return { d, normals }
}

function curve(b: Pt, t: Pt, samples = 26): Pt[] {
  const p1 = { x: b.x + (t.x - b.x) * 0.3, y: b.y + (t.y - b.y) * 0.38 }
  const p2 = { x: b.x + (t.x - b.x) * 0.82, y: b.y + (t.y - b.y) * 0.8 }
  return Array.from({ length: samples }, (_, i) => bezier(b, p1, p2, t, i / (samples - 1)))
}

/**
 * Braço do violão visto de cima (como você vê olhando para baixo enquanto toca)
 * com uma mão natural: cada dedo pressiona a corda/casa certa.
 */
export function HandView({ shape, width = 360, className, hand = true }: Props) {
  const uid = useId().replace(/:/g, '')
  if (!shape) return null
  const base = baseFretOf(shape)
  // o dedo aperta logo atrás do traste
  const pressX = (fret: number) => LEFT + FRET_W * (fret - base + 1) - FRET_W * 0.34
  const barres = shape.barres ?? []

  type Tip = { finger: number; x: number; y: number; yTop?: number }
  const tips: Tip[] = []
  for (const b of barres) tips.push({ finger: b.finger, x: pressX(b.fret), y: sy(b.toString), yTop: sy(b.fromString) })
  shape.frets.forEach((fret, i) => {
    const finger = shape.fingers[i]
    if (fret <= 0 || !finger) return
    const str = 6 - i
    const inBarre = barres.some((b) => b.finger === finger && b.fret === fret && str <= b.fromString && str >= b.toString)
    if (!inBarre && !tips.some((t) => t.finger === finger)) tips.push({ finger, x: pressX(fret), y: sy(str) })
  })

  // Dedos paralelos, vindo de baixo e da direita (como a mão real vista de cima).
  const SLOPE = 0.42 // deslocamento horizontal por unidade de altura
  const KY = NECK_BOTTOM + 30
  const kx: Record<number, number> = {}
  const anchorX = tips.length ? tips.reduce((a, t) => a + t.x + (KY - t.y) * SLOPE, 0) / tips.length : LEFT + FRET_W * 2
  for (let f = 1; f <= 4; f++) {
    const tip = tips.find((t) => t.finger === f)
    const ideal = tip ? tip.x + (KY + (f - 1) * 4 - tip.y) * SLOPE : anchorX + (f - 2) * 21
    kx[f] = f === 1 ? ideal : Math.max(ideal, kx[f - 1] + 20)
  }
  // se passou do limite à direita, empurra tudo para a esquerda
  const over = kx[4] - (W - 26)
  if (over > 0) for (let f = 1; f <= 4; f++) kx[f] -= over
  const knuckle = (f: number): Pt => ({ x: kx[f], y: KY + (f - 1) * 4 })
  const k1 = knuckle(1)
  const k4 = knuckle(4)

  // desenha primeiro os dedos que vão mais longe (ficam por trás)
  const order = [1, 2, 3, 4].sort((a, b) => (tips.find((t) => t.finger === a)?.y ?? 999) - (tips.find((t) => t.finger === b)?.y ?? 999))
  const skin = `skin-${uid}`
  const wood = `wood-${uid}`
  const shadowF = `sh-${uid}`
  const height = hand ? H : NECK_BOTTOM + 14

  return (
    <svg
      viewBox={`0 0 ${W} ${height}`}
      width={width}
      height={(width * height) / W}
      className={className}
      role="img"
      aria-label={`Mão no braço do violão: ${tips.map((t) => FINGER_NAMES[t.finger]).join(', ') || 'cordas soltas'}`}
    >
      <defs>
        <linearGradient id={wood} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a2c1a" />
          <stop offset="0.5" stopColor="#3a2214" />
          <stop offset="1" stopColor="#24140b" />
        </linearGradient>
        <linearGradient id={skin} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f2c7a5" />
          <stop offset="0.55" stopColor="#e2a982" />
          <stop offset="1" stopColor="#c98c66" />
        </linearGradient>
        <filter id={shadowF} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
      </defs>

      {/* cabeça do violão (à esquerda) */}
      <rect x={0} y={TOP - 18} width={LEFT + 4} height={NECK_BOTTOM - TOP + 26} rx={10} fill="#2b1a10" />
      {/* escala de madeira */}
      <rect x={LEFT} y={TOP - 12} width={W - LEFT} height={NECK_BOTTOM - TOP + 14} fill={`url(#${wood})`} />
      {/* marcações do braço */}
      {[3, 5, 7, 9].map((m) =>
        m >= base && m < base + FRETS ? <circle key={m} cx={LEFT + FRET_W * (m - base + 0.5)} cy={(TOP + sy(1)) / 2} r={4.5} fill="#e8dcc4" opacity={0.75} /> : null,
      )}
      {12 >= base && 12 < base + FRETS && (
        <>
          <circle cx={LEFT + FRET_W * (12 - base + 0.5)} cy={sy(5)} r={4.5} fill="#e8dcc4" opacity={0.75} />
          <circle cx={LEFT + FRET_W * (12 - base + 0.5)} cy={sy(2)} r={4.5} fill="#e8dcc4" opacity={0.75} />
        </>
      )}
      {/* trastes (ferrinhos) */}
      {Array.from({ length: FRETS + 1 }, (_, k) => {
        const x = LEFT + k * FRET_W
        if (k === 0 && base === 1) return <rect key={k} x={x - 4} y={TOP - 12} width={8} height={NECK_BOTTOM - TOP + 14} rx={2} fill="#efe6cf" />
        return (
          <g key={k}>
            <line x1={x + 1.5} x2={x + 1.5} y1={TOP - 12} y2={NECK_BOTTOM + 2} stroke="#000" strokeOpacity={0.35} strokeWidth={2} />
            <line x1={x} x2={x} y1={TOP - 12} y2={NECK_BOTTOM + 2} stroke="#d4d7de" strokeWidth={2.6} />
          </g>
        )
      })}
      {/* cordas: 6, 5, 4 enroladas (douradas); 3, 2, 1 prateadas */}
      {[6, 5, 4, 3, 2, 1].map((str) => (
        <g key={str}>
          <line x1={LEFT - 6} x2={W} y1={sy(str) + 1.2} y2={sy(str) + 1.2} stroke="#000" strokeOpacity={0.4} strokeWidth={0.7 + str * 0.36} />
          <line x1={LEFT - 6} x2={W} y1={sy(str)} y2={sy(str)} stroke={str >= 4 ? '#d8b878' : '#e3e5ec'} strokeWidth={0.7 + str * 0.36} />
        </g>
      ))}
      {/* corda solta / não tocar */}
      {[6, 5, 4, 3, 2, 1].map((str) => {
        const fr = shape.frets[6 - str]
        const cx = LEFT - 18
        return (
          <g key={str}>
            {fr === 0 && <circle cx={cx} cy={sy(str)} r={6} fill="none" stroke="#3ee39b" strokeWidth={2.4} />}
            {fr < 0 && (
              <g stroke="#ff6b7a" strokeWidth={2.6} strokeLinecap="round">
                <line x1={cx - 5} x2={cx + 5} y1={sy(str) - 5} y2={sy(str) + 5} />
                <line x1={cx - 5} x2={cx + 5} y1={sy(str) + 5} y2={sy(str) - 5} />
              </g>
            )}
            {fr > 0 && (
              <text x={cx} y={sy(str) + 4} textAnchor="middle" fontSize={11} fontWeight={600} fill="#a9a2b8">
                {str}
              </text>
            )}
          </g>
        )
      })}
      {base > 1 && (
        <text x={LEFT + FRET_W * 0.5} y={TOP - 18} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffad5c">
          casa {base}
        </text>
      )}

      {hand && (
        <g>
          {/* sombra dos dedos no braço */}
          {tips.map((t) => (
            <ellipse key={t.finger} cx={t.x + 5} cy={t.y + 9 - (t.yTop != null ? (t.y - t.yTop) / 2 : 0)} rx={12} ry={(t.yTop != null ? t.y - t.yTop : 0) / 2 + 8} fill="#000" opacity={0.45} filter={`url(#${shadowF})`} />
          ))}
          {/* dedos: do mindinho ao indicador (o indicador fica na frente) */}
          {order.map((f) => {
            const k0 = knuckle(f)
            const k = { x: k0.x + 6, y: k0.y + 16 }
            const tip = tips.find((t) => t.finger === f)
            const wBase = f === 4 ? 18 : f === 1 ? 21 : 20
            const wTip = f === 4 ? 14.5 : 16.5
            let pts: Pt[]
            if (!tip) {
              // dedo livre: recolhido, sem encostar no braço
              pts = curve(k, { x: k0.x - 2, y: k0.y - 16 }, 10)
            } else if (tip.yTop != null) {
              // pestana: o dedo deita sobre várias cordas
              const low = curve(k, { x: tip.x, y: tip.y + 6 }, 18)
              const up = Array.from({ length: 10 }, (_, i) => ({ x: tip.x, y: tip.y + 4 - ((tip.y + 4 - tip.yTop!) * (i + 1)) / 10 }))
              pts = [...low, ...up]
            } else {
              pts = curve(k, { x: tip.x, y: tip.y + 3 })
            }
            const outer = fingerGeometry(pts, wBase, wTip, 1.3)
            const g = fingerGeometry(pts, wBase, wTip)
            const at = (t: number) => {
              const i = Math.round(t * (pts.length - 1))
              return { p: pts[i], n: g.normals[i], w: (wBase + (wTip - wBase) * t) / 2 }
            }
            const crease = (t: number) => {
              const { p, n, w } = at(t)
              const a = { x: p.x + n.x * (w - 3), y: p.y + n.y * (w - 3) }
              const b = { x: p.x - n.x * (w - 3), y: p.y - n.y * (w - 3) }
              return <path key={t} d={`M ${a.x} ${a.y} Q ${p.x} ${p.y + 2.5} ${b.x} ${b.y}`} stroke="#a86d4b" strokeOpacity={0.55} strokeWidth={1.1} fill="none" />
            }
            const nail = tip && tip.yTop == null ? at(0.93) : null
            const shine = pts
              .slice(2, Math.round(pts.length * 0.85))
              .map((p, i) => {
                const n = g.normals[i + 2]
                return `${i ? 'L' : 'M'} ${p.x + n.x * 3.5} ${p.y + n.y * 3.5}`
              })
              .join(' ')
            return (
              <g key={f}>
                <path d={outer.d} fill="#b97c58" />
                <path d={g.d} fill={`url(#${skin})`} />
                <path d={shine} stroke="#fff" strokeOpacity={0.22} strokeWidth={2.2} fill="none" strokeLinecap="round" />
                {tip ? [crease(0.5), crease(0.76)] : crease(0.6)}
                {nail && (
                  <ellipse
                    cx={nail.p.x}
                    cy={nail.p.y}
                    rx={nail.w * 0.6}
                    ry={4.2}
                    fill="#f6d9cb"
                    stroke="#d3a58c"
                    strokeWidth={0.8}
                    opacity={0.95}
                    transform={`rotate(${(Math.atan2(nail.n.y, nail.n.x) * 180) / Math.PI} ${nail.p.x} ${nail.p.y})`}
                  />
                )}
              </g>
            )
          })}
          {/* palma por cima da base dos dedos (linha dos nós) */}
          <path
            d={`M ${k1.x - 20} ${H + 6}
                C ${k1.x - 26} ${k1.y + 40}, ${k1.x - 22} ${k1.y + 4}, ${k1.x - 10} ${k1.y - 2}
                Q ${(k1.x + k4.x) / 2} ${Math.min(k1.y, k4.y) - 14}, ${k4.x + 12} ${k4.y - 1}
                C ${k4.x + 30} ${k4.y + 10}, ${k4.x + 42} ${H - 30}, ${k4.x + 48} ${H + 6} Z`}
            fill={`url(#${skin})`}
            stroke="#b97c58"
            strokeWidth={1.4}
          />
          {/* nós dos dedos */}
          {[1, 2, 3, 4].map((f) => {
            const k = knuckle(f)
            return <path key={f} d={`M ${k.x - 6} ${k.y + 4} Q ${k.x} ${k.y} ${k.x + 6} ${k.y + 4}`} stroke="#a86d4b" strokeOpacity={0.45} strokeWidth={1.2} fill="none" />
          })}
        </g>
      )}

      {/* número do dedo sobre a ponta */}
      {tips.map((t) => (
        <g key={`m${t.finger}`}>
          {t.yTop != null && !hand && <rect x={t.x - 10} y={t.yTop - 10} width={20} height={t.y - t.yTop + 20} rx={10} fill={FINGER_COLORS[t.finger]} opacity={0.85} />}
          <circle cx={t.x} cy={t.y} r={9.5} fill={FINGER_COLORS[t.finger]} stroke="#fff" strokeWidth={1.6} />
          <text x={t.x} y={t.y + 4} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="#14100c">
            {t.finger}
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
          {FINGER_NAMES[f].toLowerCase()}
        </span>
      ))}
    </div>
  )
}
