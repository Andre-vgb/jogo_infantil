import { useEffect } from 'react'
import Moldura from './Moldura'
import Arte from './Arte'
import { narrar } from '../utils/audio'
import { FALAS } from '../data/perguntas'
import './TelaResultado.css'

export default function TelaResultado({
  acertos,
  total,
  pontos,
  onReiniciar,
  onComemorar,
}) {
  useEffect(() => {
    narrar(FALAS.final.audio)
    onComemorar()
    const timer = setTimeout(onComemorar, 700)
    return () => clearTimeout(timer)
  }, [onComemorar])

  return (
    <main className="tela-resultado">
      {/* A mesma moldura das perguntas, com os quatro cantos no lugar de sempre. */}
      <Moldura
        tema="tema-palco"
        onFechar={onReiniciar}
        onOuvir={() => narrar(FALAS.final.audio)}
        estrelas={{ total, acesas: acertos }}
        pontos={pontos}
        contador={`${total} de ${total}`}
      >
        <span className="resultado-balao" aria-hidden="true"><Arte texto="🎈" /></span>
        <h1 className="resultado-titulo">Você conseguiu!</h1>
        <p className="resultado-estrelas" aria-hidden="true">{'★'.repeat(acertos)}</p>
        <p className="resultado-texto">
          Você acertou {acertos} de {total} e fez{' '}
          <strong>{pontos} pontos</strong>.
        </p>
        <button type="button" className="btn-voltar" onClick={onReiniciar}>
          Voltar ao início
        </button>
      </Moldura>
    </main>
  )
}
