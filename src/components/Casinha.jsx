import casinha from '../assets/img/casinha.webp'
import './Casinha.css'

// Faixa de grama na base do card: os dois cards ficam no mesmo quintal.
const grama = (
  <svg className="casinha-grama" viewBox="0 0 200 180" aria-hidden="true">
    <path
      d="M0 156 Q12 148 24 156 T48 156 T72 156 T96 156 T120 156 T144 156 T168 156 T192 156 T216 156 V180 H0 Z"
      fill="#7cc35a"
    />
  </svg>
)

/**
 * Casinha das perguntas de dentro e fora.
 *
 * dentro: a casa ocupa o card e a vaga fica na porta, o lugar de entrar.
 * fora: a casa fica pequena a esquerda e a vaga fica no quintal ao lado.
 */
export default function Casinha({ posicao, children }) {
  return (
    <span className={`casinha casinha--${posicao}`}>
      {grama}

      {/* Casa e vaga no mesmo bloco, para pularem juntas no acerto. */}
      <span className="casinha-corpo">
        <img className="casinha-imagem" src={casinha} alt="" draggable={false} />
        <span className={`casinha-vaga casinha-vaga--${posicao}`}>{children}</span>
      </span>
    </span>
  )
}
