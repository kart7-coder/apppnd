import { FingerLegend } from './HandView'

/** "Como ler o desenho": fica fechado até a pessoa tocar. */
export function ChordLegend({ open = false }: { open?: boolean }) {
  return (
    <details className="howto" open={open}>
      <summary>Como ler o desenho do acorde?</summary>
      <div className="chord-legend">
        <p className="muted small">
          O desenho mostra o braço do violão. Cada bolinha colorida é um dedo: a cor e o número dizem qual dedo usar. <b>Casa</b> é o espaço entre dois ferrinhos do braço.
        </p>
        <FingerLegend />
        <div className="legend">
          <div>
            <span className="sym open" />
            Corda solta: toque sem apertar
          </div>
          <div>
            <span className="sym mute">✕</span>
            Não toque essa corda
          </div>
          <div>
            <span className="sym bar" />
            Pestana: um dedo deitado em várias cordas
          </div>
          <div>
            <span className="sym">6→1</span>
            Corda 6 é a mais grossa
          </div>
        </div>
      </div>
    </details>
  )
}
