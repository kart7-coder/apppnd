import type { ChordShape } from '../music/types'
import { ChordDiagram, FINGER_COLORS } from './ChordDiagram'
import { FINGER_NAMES } from './HandView'
import { STRING_NAME } from '../music/explain'

/** Tipo do acorde em palavras simples, a partir do nome. */
export function chordQuality(name: string): string {
  const s = name.replace(/^[A-G][#b]?/, '').replace(/\/.*/, '')
  if (/^m7\(?9|^m9/.test(s)) return 'Menor com nona'
  if (/^m7/.test(s)) return 'Menor com sétima'
  if (/^m6/.test(s)) return 'Menor com sexta'
  if (/^m11/.test(s)) return 'Menor com décima primeira'
  if (/^m/.test(s) && !/^maj/.test(s)) return 'Menor'
  if (/maj7|7M/.test(s)) return 'Maior com sétima maior'
  if (/^7sus|sus/.test(s)) return 'Suspenso'
  if (/^7/.test(s)) return 'Com sétima'
  if (/6\/9|69/.test(s)) return 'Com sexta e nona'
  if (/^6/.test(s)) return 'Com sexta'
  if (/9|add/.test(s)) return 'Com nona'
  if (/^5/.test(s)) return 'Quinta (power chord)'
  if (/^4/.test(s)) return 'Suspenso'
  return 'Maior'
}

const ordinal = (n: number) => `${n}ª`

/** Desenho do acorde + lista de dedos (casa e corda), como um cartão de estudo. */
export function ChordInfo({ shape, name }: { shape?: ChordShape; name: string }) {
  if (!shape) return null
  type Row = { finger: number; text: string }
  const rows: Row[] = []
  for (const b of shape.barres ?? []) rows.push({ finger: b.finger, text: `${ordinal(b.fret)} casa · deitado da corda ${b.fromString} à ${b.toString}` })
  shape.frets.forEach((fret, i) => {
    const finger = shape.fingers[i]
    if (fret <= 0 || !finger) return
    const str = 6 - i
    if ((shape.barres ?? []).some((b) => b.finger === finger && b.fret === fret)) return
    rows.push({ finger, text: `${ordinal(fret)} casa · ${str}ª corda (${STRING_NAME[str]})` })
  })
  rows.sort((a, b) => a.finger - b.finger)
  const open = shape.frets.map((f, i) => (f === 0 ? 6 - i : 0)).filter(Boolean)
  const muted = shape.frets.map((f, i) => (f < 0 ? 6 - i : 0)).filter(Boolean)

  return (
    <div className="chord-info">
      <div className="card ci-diagram">
        <b className="ci-name">{name}</b>
        <span className="ci-quality">({chordQuality(name)})</span>
        <ChordDiagram shape={shape} showName={false} size={128} />
      </div>
      <div className="card ci-list">
        {rows.map((r) => (
          <div key={r.finger + r.text} className="ci-row">
            <i style={{ background: FINGER_COLORS[r.finger] }}>{r.finger}</i>
            <span>
              <b>{FINGER_NAMES[r.finger]}</b>
              <small>{r.text}</small>
            </span>
          </div>
        ))}
        {open.length > 0 && (
          <div className="ci-row">
            <i className="ci-open" />
            <span>
              <b>Corda solta</b>
              <small>Corda {open.join(', ')}: não pressionar</small>
            </span>
          </div>
        )}
        {muted.length > 0 && (
          <div className="ci-row">
            <i className="ci-mute">✕</i>
            <span>
              <b>Não tocar</b>
              <small>Corda {muted.join(', ')}</small>
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
