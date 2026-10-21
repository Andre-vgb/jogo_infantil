import { useEffect } from 'react'
import Moldura from './Moldura'
import Arte from './Arte'
import { NIVEIS, FALAS, perguntasDoNivel } from '../data/perguntas'
import { narrar } from '../utils/audio'
import './TelaInicio.css'

// Tempo sem ninguem mexer na tela ate o convite tocar de novo.
const ESPERA_CONVITE = 20000

export default function TelaInicio({ onIniciar }) {
  // Toca o convite ao abrir e repete a cada 20 segundos parado. Se o navegador
  // bloquear o som ate o primeiro toque, o convite toca nesse toque.
  useEffect(() => {
    let relogio = null
    let bloqueado = false

    const convidar = () => {
      narrar(FALAS.convite.audio).then((tocou) => {
        bloqueado = !tocou
      })
      agendar()
    }

    const agendar = () => {
      clearTimeout(relogio)
      relogio = setTimeout(convidar, ESPERA_CONVITE)
    }

    const aoMexer = (evento) => {
      // Tocar num nivel ja comeca o jogo: ai o convite nao precisa tocar.
      if (bloqueado && !evento.target.closest?.('.btn-nivel')) {
        bloqueado = false
        narrar(FALAS.convite.audio)
      }
      agendar()
    }

    convidar()
    window.addEventListener('pointerdown', aoMexer)
    window.addEventListener('keydown', aoMexer)
    return () => {
      clearTimeout(relogio)
      window.removeEventListener('pointerdown', aoMexer)
      window.removeEventListener('keydown', aoMexer)
    }
  }, [])

  return (
    <main className="tela-inicio">
      <Moldura tema="tema-palco" onOuvir={() => narrar(FALAS.convite.audio)}>
        <h1 className="inicio-titulo">Vamos brincar!</h1>

        <div className="inicio-mascotes" aria-hidden="true">
          <span><Arte texto="🐱" /></span>
          <span><Arte texto="🐰" /></span>
          <span><Arte texto="🐵" /></span>
        </div>

        <p className="inicio-subtitulo">Escolha um caminho</p>

        <section className="inicio-niveis" aria-label="Escolha o nível de dificuldade">
          {NIVEIS.map(({ id, label, estrelas, selo }) => (
            <button
              key={id}
              type="button"
              className="btn-nivel"
              onClick={() => onIniciar(id)}
            >
              <span className="nivel-selo"><Arte texto={selo} /></span>
              <span className="nivel-label">{label}</span>
              <span className="nivel-estrelas" aria-hidden="true">{estrelas}</span>
              <span className="nivel-desc">{perguntasDoNivel(id).length} perguntas</span>
            </button>
          ))}
        </section>
      </Moldura>
    </main>
  )
}
