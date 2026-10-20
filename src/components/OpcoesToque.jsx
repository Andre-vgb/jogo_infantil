import { useMemo, useState } from 'react'
import Arte from './Arte'
import { embaralhar } from '../utils/embaralhar'
import './OpcoesToque.css'

const CORES = {
  vermelho: '#E4443A',
  azul: '#3E8FD6',
  amarelo: '#F2C230',
  verde: '#4FAE6A',
  laranja: '#EE8B37',
  roxo: '#8B62C4',
  rosa: '#E982B4',
  marrom: '#8A5A3C',
}

function ConteudoDaOpcao({ tipo, opcao }) {
  if (tipo === 'numero') return <span className="opcao-numeral">{opcao.valor}</span>
  if (tipo === 'letra') return <span className="opcao-letra">{opcao.valor}</span>
  if (tipo === 'palavra') return <span className="opcao-palavra">{opcao.valor}</span>
  if (tipo === 'cor') return <span className="opcao-cor" style={{ background: CORES[opcao.valor] }} />
  return (
    <>
      <span className="opcao-figura" style={{ fontSize: 58 * (opcao.escala || 1) }}>
        <Arte texto={opcao.valor} />
      </span>
      {opcao.rotulo && <span className="opcao-rotulo">{opcao.rotulo}</span>}
    </>
  )
}

/** Perguntas respondidas com um toque: numero, letra, cor, palavra ou imagem. */
export default function OpcoesToque({ pergunta, onResponder }) {
  // Embaralha a cada partida para a crianca nao decorar a posicao da resposta.
  const opcoes = useMemo(() => embaralhar(pergunta.opcoes), [pergunta])
  const [tremendo, setTremendo] = useState(null)

  const escolher = (opcao, i) => {
    if (!opcao.correta) {
      setTremendo(i)
      setTimeout(() => setTremendo(null), 360)
    }
    onResponder(opcao.correta)
  }

  // As de numero ficam em fichas sobre uma prateleira de madeira.
  const naBandeja = pergunta.tipo === 'numero'

  return (
    <section
      className={`opcoes-grid${naBandeja ? ' opcoes-grid--bandeja' : ''}`}
      aria-label="Opções de resposta"
    >
      {opcoes.map((opcao, i) => (
        <button
          key={i}
          type="button"
          className={[
            'opcao-btn',
            naBandeja && 'opcao-btn--ficha',
            tremendo === i && 'opcao-btn--tremendo',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => escolher(opcao, i)}
        >
          <ConteudoDaOpcao tipo={pergunta.tipo} opcao={opcao} />
        </button>
      ))}
    </section>
  )
}

