import { useEffect, useRef } from 'react'
import type { Timeline } from '../music/types'

export const LANE_COLORS = ['#ff8a2a', '#2dd4bf', '#a78bfa', '#f472b6', '#a3e635', '#38bdf8', '#facc15', '#fb7185']

interface Props {
  timeline: Timeline
  getBeat: () => number
  lanes: string[]
  /** Batidas visíveis acima da linha de execução. */
  lookahead?: number
  label?: (chord: string) => string
}

/**
 * Pista de execução em canvas. Cada acorde da música tem uma faixa (cor própria);
 * os blocos descem e tocam a linha no instante da troca. A posição vem SEMPRE do
 * relógio musical (getBeat), lida a cada quadro.
 */
export function Highway({ timeline, getBeat, lanes, lookahead = 8, label = (c) => c }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const propsRef = useRef({ timeline, getBeat, lanes, lookahead, label })
  propsRef.current = { timeline, getBeat, lanes, lookahead, label }

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let raf = 0
    let w = 0
    let h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const css = getComputedStyle(document.documentElement)
    const fontFamily = css.getPropertyValue('--font-display').trim() || 'sans-serif'

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    const draw = () => {
      const { timeline: tl, getBeat: gb, lanes: ls, lookahead: la, label: lb } = propsRef.current
      const pos = gb()
      ctx.clearRect(0, 0, w, h)
      const hitY = h * 0.84
      const pxPerBeat = hitY / la
      const n = Math.max(ls.length, 1)
      const laneW = w / n
      const yOf = (beat: number) => hitY - (beat - pos) * pxPerBeat

      // faixas
      for (let i = 0; i < n; i++) {
        ctx.fillStyle = i % 2 ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.05)'
        ctx.fillRect(i * laneW, 0, laneW, h)
      }
      // linhas de batida e compasso
      const first = Math.floor(pos - (h - hitY) / pxPerBeat)
      const last = Math.ceil(pos + la)
      for (let b = first; b <= last; b++) {
        if (b < 0 || b > tl.totalBeats) continue
        const y = yOf(b)
        const bar = b % tl.beatsPerBar === 0
        ctx.strokeStyle = bar ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.07)'
        ctx.lineWidth = bar ? 2 : 1
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }

      // blocos de acorde
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      for (const ev of tl.chords) {
        const yStart = yOf(ev.beat)
        const yEnd = yOf(ev.beat + ev.durationBeats)
        if (yEnd > h || yStart < -40) continue
        const lane = Math.max(0, ls.indexOf(ev.chord))
        const color = LANE_COLORS[lane % LANE_COLORS.length]
        const bw = Math.min(laneW * 0.76, 200)
        const x = lane * laneW + (laneW - bw) / 2
        const active = pos >= ev.beat && pos < ev.beat + ev.durationBeats
        // cauda = duração do acorde
        ctx.globalAlpha = active ? 0.45 : 0.25
        ctx.fillStyle = color
        const tailTop = Math.max(yEnd, -10)
        const tailBottom = Math.min(yStart, hitY)
        if (tailBottom > tailTop) ctx.fillRect(x + bw * 0.38, tailTop, bw * 0.24, tailBottom - tailTop)
        ctx.globalAlpha = 1
        // cabeça = momento da troca
        if (yStart <= h + 30 && yStart >= -30 && pos <= ev.beat + 0.6) {
          const gh = Math.min(46, Math.max(30, laneW * 0.32))
          const passed = pos >= ev.beat
          ctx.fillStyle = color
          ctx.shadowColor = color
          ctx.shadowBlur = passed ? 24 : 8
          roundRect(ctx, x, yStart - gh / 2, bw, gh, 12)
          ctx.fill()
          ctx.shadowBlur = 0
          ctx.fillStyle = '#0b1020'
          ctx.font = `700 ${Math.min(22, gh * 0.5)}px ${fontFamily}`
          ctx.fillText(lb(ev.chord), x + bw / 2, yStart + 1)
        }
      }

      // linha de execução
      ctx.fillStyle = 'rgba(255,255,255,0.9)'
      ctx.fillRect(0, hitY - 2, w, 4)
      for (let i = 0; i < n; i++) {
        ctx.strokeStyle = LANE_COLORS[i % LANE_COLORS.length]
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(i * laneW + laneW / 2, hitY, 9, 0, Math.PI * 2)
        ctx.stroke()
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className="highway" aria-hidden />
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}
