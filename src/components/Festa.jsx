import './Festa.css'

/** Brilho verde com os pontos ganhos, por cima da tela de pergunta. */
export default function Festa({ ganho, estrelas }) {
  return (
    <div className="festa" role="status">
      <span className="festa-ganho">+{ganho}</span>
      {Array.from({ length: estrelas }, (_, i) => (
        <span key={i} className="festa-estrela" aria-hidden="true">★</span>
      ))}
    </div>
  )
}