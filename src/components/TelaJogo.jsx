import { useEffect } from 'react'
import Moldura from './Moldura'
import Arte from './Arte'
import Festa from './Festa'
import OpcoesToque from './OpcoesToque'
import PalcoArraste from './PalcoArraste'
import { narrar } from '../utils/audio'
import './TelaJogo.css'

// Cada abordagem tem o seu cenario.
const TEMA_DA_AREA = {
  'Matemática': 'tema-madeira',
  'Português': 'tema-rosa',
  'Senso de direção': 'tema-gelo',
  'Percepção visual': 'tema-grama',
}

export default function TelaJogo({ estado, onResponder, onAvisar, onSair }) {
  const { perguntasJogo, indicePergunta, acertos, pontos, festa, aviso } = estado
  const pergunta = perguntasJogo[indicePergunta]
  const total = perguntasJogo.length

  // Fala o enunciado sempre que a pergunta muda.
  useEffect(() => {
    const timer = setTimeout(() => narrar(pergunta.audio), 400)
    return () => clearTimeout(timer)
  }, [pergunta])

  return (
    <main className="tela-jogo">
      <Moldura
        tema={TEMA_DA_AREA[pergunta.area] || 'tema-madeira'}
        onFechar={onSair}
        onOuvir={() => narrar(pergunta.audio)}
        estrelas={{ total, acesas: acertos }}
        pontos={pontos}
        contador={`${indicePergunta + 1} de ${total}`}
        sobreposicao={festa ? <Festa ganho={festa.ganho} estrelas={festa.estrelas} /> : null}
      >
        {pergunta.cena && (
          <div className={`jogo-cena${pergunta.cenaTexto ? ' jogo-cena--texto' : ''}`}>
            {pergunta.cenaTexto ? pergunta.cena : <Arte texto={pergunta.cena} />}
          </div>
        )}

        {pergunta.modo === 'toque' ? (
          <OpcoesToque key={pergunta.id} pergunta={pergunta} onResponder={onResponder} />
        ) : (
          <PalcoArraste
            key={pergunta.id}
            pergunta={pergunta}
            onResponder={onResponder}
            onAvisar={onAvisar}
          />
        )}
      </Moldura>

      {/* O enunciado escrito fica fora da moldura: e apoio para a professora,
          a crianca so ouve. */}
      <p className="jogo-apoio">{pergunta.texto}</p>
      <p className={`jogo-aviso${aviso?.tipo === 'gentil' ? ' jogo-aviso--gentil' : ''}`} aria-live="polite">
        {aviso ? aviso.texto : ''}
      </p>
    </main>
  )
}