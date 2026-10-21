import Arte from './Arte'
import './Moldura.css'

/**
 * Moldura branca com a sala colorida dentro, usada pelas tres telas.
 * Recebe o tema (a cor do cenario) e o que mostrar nos quatro cantos.
 */
export default function Moldura({
  tema = 'tema-madeira',
  onFechar,
  onOuvir,
  estrelas,
  pontos,
  contador,
  sobreposicao,
  children,
}) {
  return (
    <div className="quadro">
      <div className={`sala ${tema}`}>
        {onFechar && (
          <button type="button" className="btn-fechar" onClick={onFechar} aria-label="Sair">
            ✕
          </button>
        )}

        {(estrelas || pontos != null) && (
          <div className="sala-topo">
            {estrelas && (
              <div
                className="sala-estrelas"
                aria-label={`${estrelas.acesas} de ${estrelas.total} estrelas`}
              >
                {Array.from({ length: estrelas.total }, (_, i) => (
                  <span key={i} className={i < estrelas.acesas ? 'acesa' : ''}>
                    ★
                  </span>
                ))}
              </div>
            )}

            {pontos != null && <div className="sala-placar">{pontos}</div>}
          </div>
        )}

        {onOuvir && (
          <button
            type="button"
            className="btn-som"
            onClick={onOuvir}
            aria-label="Ouvir novamente"
          >
            <Arte texto="🔊" />
          </button>
        )}

        {contador && <div className="sala-contador">{contador}</div>}

        {children}
        {sobreposicao}
      </div>
    </div>
  )
}
