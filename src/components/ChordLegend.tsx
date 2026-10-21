/** Explica como ler o desenho do acorde, para quem nunca viu um. */
export function ChordLegend() {
  return (
    <div className="chord-legend">
      <p className="muted small">
        O desenho é o braço do violão em pé: as linhas em pé são as cordas (a da esquerda é a mais grossa) e cada espaço entre as linhas deitadas é uma <b>casa</b>.
      </p>
      <div className="legend">
        <div>
          <span className="sym dot">1</span>
          Aperte com o dedo do número
        </div>
        <div>
          <span className="sym open" />
          Toque a corda solta
        </div>
        <div>
          <span className="sym mute">✕</span>
          Não toque essa corda
        </div>
        <div>
          <span className="sym bar" />
          Pestana: um dedo deitado
        </div>
      </div>
      <p className="muted small">Dedos: 1 indicador · 2 médio · 3 anelar · 4 mindinho</p>
    </div>
  )
}
