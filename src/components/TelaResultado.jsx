import { useEffect } from 'react'
import Arte from './Arte'
import { narrar } from '../utils/audio'
import { FALAS } from '../data/perguntas'
import './TelaResultado.css'

export default function TelaResultado({
  nome,
  acertos,
  total,
  pontos,
  onBaixarRegistro,
  onReiniciar,
  onComemorar,
}) {
  useEffect(() => {
    narrar(FALAS.final.texto, FALAS.final.audio)
    onComemorar()
    const timer = setTimeout(onComemorar, 700)
    return () => clearTimeout(timer)
  }, [onComemorar])

  return (
    <main className="tela-resultado">
      <span className="resultado-balao" aria-hidden="true"><Arte texto="🎈" /></span>
      <h1 className="resultado-titulo">Você conseguiu!</h1>
      <p className="resultado-estrelas" aria-hidden="true">{'★'.repeat(acertos)}</p>
      <p className="resultado-texto">
        {nome.trim() || 'A criança'} acertou {acertos} de {total} e fez <strong>{pontos} pontos</strong>.
      </p>
      <div className="resultado-botoes">
        <button type="button" className="btn-salvar" onClick={onBaixarRegistro}>
          Salvar registro (.txt)
        </button>
        <button type="button" className="btn-voltar" onClick={onReiniciar}>
          Voltar ao início
        </button>
      </div>
    </main>
  )
}