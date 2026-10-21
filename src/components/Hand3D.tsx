import { useEffect, useRef, useState } from 'react'
import type { ChordShape } from '../music/types'
import { FINGER_COLORS, baseFretOf } from './ChordDiagram'
import { HandView } from './HandView'
import type { HandScene } from './hand3d/scene'

interface Props {
  shape?: ChordShape
  className?: string
  /** Proporção largura/altura do quadro. */
  aspect?: number
}

type Marks = { tips: { finger: number; x: number; y: number }[]; strings: { str: number; x: number; y: number }[] }

/**
 * Mão 3D realista no braço do violão (three.js + modelo de mão aberto do WebXR).
 * Carrega sob demanda; enquanto isso (ou sem WebGL) mostra o braço 2D com as bolinhas.
 */
export function Hand3D({ shape, className, aspect = 1.55 }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<HandScene | null>(null)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [marks, setMarks] = useState<Marks>({ tips: [], strings: [] })
  const shapeRef = useRef(shape)
  shapeRef.current = shape

  const refreshMarks = () => {
    const s = sceneRef.current
    if (s) setMarks({ tips: s.tipScreen(), strings: s.stringScreen() })
  }

  useEffect(() => {
    let alive = true
    let ro: ResizeObserver | null = null
    import('./hand3d/scene')
      .then(({ createHandScene }) => createHandScene(canvasRef.current!, '/models/left-hand.glb'))
      .then((s) => {
        if (!alive) return s.dispose()
        sceneRef.current = s
        const resize = () => {
          const el = wrapRef.current
          if (!el) return
          s.resize(el.clientWidth, el.clientHeight)
          refreshMarks()
        }
        ro = new ResizeObserver(resize)
        ro.observe(wrapRef.current!)
        resize()
        const sh = shapeRef.current
        s.setShape(sh, sh ? baseFretOf(sh) : 1)
        refreshMarks()
        setReady(true)
      })
      .catch(() => alive && setFailed(true))
    return () => {
      alive = false
      ro?.disconnect()
      sceneRef.current?.dispose()
      sceneRef.current = null
    }
  }, [])

  useEffect(() => {
    const s = sceneRef.current
    if (!s) return
    s.setShape(shape, shape ? baseFretOf(shape) : 1)
    refreshMarks()
  }, [shape])

  if (failed) return <HandView shape={shape} hand={false} className={className} width={620} />

  return (
    <div ref={wrapRef} className={`hand3d ${className ?? ''}`} style={{ aspectRatio: String(aspect) }}>
      <canvas ref={canvasRef} aria-hidden />
      {!ready && (
        <div className="hand3d-loading">
          <HandView shape={shape} hand={false} width={620} />
        </div>
      )}
      {ready && shape && (
        <div className="hand3d-marks" aria-hidden>
          {marks.strings.map((m) => {
            const f = shape.frets[6 - m.str]
            return (
              <span key={m.str} className={`hm-str ${f === 0 ? 'open' : f < 0 ? 'mute' : ''}`} style={{ left: m.x, top: m.y }}>
                {f < 0 ? '✕' : f === 0 ? '' : m.str}
              </span>
            )
          })}
          {marks.tips.map((t) => (
            <span key={t.finger} className="hm-tip" style={{ left: t.x, top: t.y, background: FINGER_COLORS[t.finger] }}>
              {t.finger}
            </span>
          ))}
          {baseFretOf(shape) > 1 && <span className="hm-pos">casa {baseFretOf(shape)}</span>}
        </div>
      )}
    </div>
  )
}
