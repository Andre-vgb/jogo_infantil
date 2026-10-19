import { useCallback, useReducer, useRef } from 'react'
import { perguntasDoNivel, FALAS } from './data/perguntas'
import { embaralhar } from './utils/embaralhar'
import { narrar, calarVoz, somAcerto, somNovaTentativa } from './utils/audio'
import { montarLinha, baixarRegistro } from './utils/registro'
import TelaInicio from './components/TelaInicio'
import TelaJogo from './components/TelaJogo'
import TelaResultado from './components/TelaResultado'
import Confete from './components/Confete'
import './App.css'

const PONTOS_DE_PRIMEIRA = 10
const PONTOS_COM_TENTATIVA = 5
const ESPERA_FESTA = 1500
const ESPERA_PROXIMA = 2000

const estadoInicial = {
  tela: 'inicio',
  nome: '',
  nivel: null,
  perguntasJogo: [],
  indicePergunta: 0,
  acertos: 0,
  pontos: 0,
  tentativas: 1,
  festa: null,
  aviso: null,
  registro: [],
}

function jogoReducer(estado, acao) {
  switch (acao.type) {
    case 'DEFINIR_NOME':
      return { ...estado, nome: acao.nome }

    case 'INICIAR_JOGO':
      return {
        ...estadoInicial,
        nome: estado.nome,
        tela: 'jogo',
        nivel: acao.nivel,
        // Embaralha a ordem das perguntas a cada partida.
        perguntasJogo: embaralhar(perguntasDoNivel(acao.nivel)),
      }

    case 'ERRAR': {
      const pergunta = estado.perguntasJogo[estado.indicePergunta]
      return {
        ...estado,
        tentativas: estado.tentativas + 1,
        aviso: { tipo: 'gentil', texto: 'Quase! Vamos tentar outra vez.' },
        registro: [
          ...estado.registro,
          montarLinha({
            sequencial: estado.registro.length + 1,
            nome: estado.nome.trim() || 'Criança',
            nivel: estado.nivel,
            pergunta,
            resultado: 'ERRO',
            tentativas: estado.tentativas,
          }),
        ],
      }
    }

    case 'ACERTAR': {
      const pergunta = estado.perguntasJogo[estado.indicePergunta]
      const dePrimeira = estado.tentativas === 1
      const ganho = dePrimeira ? PONTOS_DE_PRIMEIRA : PONTOS_COM_TENTATIVA
      return {
        ...estado,
        acertos: estado.acertos + 1,
        pontos: estado.pontos + ganho,
        aviso: { tipo: 'bom', texto: 'Muito bem!' },
        festa: { ganho, estrelas: dePrimeira ? 2 : 1 },
        registro: [
          ...estado.registro,
          montarLinha({
            sequencial: estado.registro.length + 1,
            nome: estado.nome.trim() || 'Criança',
            nivel: estado.nivel,
            pergunta,
            resultado: 'ACERTO',
            tentativas: estado.tentativas,
          }),
        ],
      }
    }

    case 'LIMPAR_FESTA':
      return { ...estado, festa: null }

    case 'DEFINIR_AVISO':
      return { ...estado, aviso: acao.aviso }

    case 'PROXIMA_PERGUNTA': {
      const ultimaPergunta = estado.indicePergunta >= estado.perguntasJogo.length - 1
      if (ultimaPergunta) return { ...estado, tela: 'resultado', aviso: null }
      return {
        ...estado,
        indicePergunta: estado.indicePergunta + 1,
        tentativas: 1,
        aviso: null,
      }
    }

    case 'REINICIAR':
      return { ...estadoInicial, nome: estado.nome }

    default:
      return estado
  }
}

export default function App() {
  const [estado, dispatch] = useReducer(jogoReducer, estadoInicial)
  const confeteRef = useRef(null)
  const comemorar = useCallback(() => confeteRef.current?.soltar(), [])
  const relogios = useRef([])
  const travado = useRef(false)

  const limparRelogios = () => {
    relogios.current.forEach(clearTimeout)
    relogios.current = []
  }

  const agendar = (acao, ms) => relogios.current.push(setTimeout(acao, ms))

  const iniciarJogo = (nivel) => {
    limparRelogios()
    travado.current = false
    dispatch({ type: 'INICIAR_JOGO', nivel })
  }

  // A tela so informa se acertou ou nao: as regras ficam aqui.
  const responder = (correta) => {
    if (travado.current) return

    if (!correta) {
      dispatch({ type: 'ERRAR' })
      somNovaTentativa()
      narrar(FALAS.erro.texto, FALAS.erro.audio)
      return
    }

    travado.current = true
    dispatch({ type: 'ACERTAR' })
    somAcerto()
    narrar(FALAS.acerto.texto, FALAS.acerto.audio)
    comemorar()

    agendar(() => dispatch({ type: 'LIMPAR_FESTA' }), ESPERA_FESTA)
    agendar(() => {
      travado.current = false
      dispatch({ type: 'PROXIMA_PERGUNTA' })
    }, ESPERA_PROXIMA)
  }

  const reiniciar = () => {
    limparRelogios()
    calarVoz()
    travado.current = false
    dispatch({ type: 'REINICIAR' })
  }

  return (
    <div className="app">
      {estado.tela === 'inicio' && (
        <TelaInicio
          nome={estado.nome}
          onMudarNome={(nome) => dispatch({ type: 'DEFINIR_NOME', nome })}
          onIniciar={iniciarJogo}
        />
      )}

      {estado.tela === 'jogo' && (
        <TelaJogo
          estado={estado}
          onResponder={responder}
          onAvisar={(aviso) => dispatch({ type: 'DEFINIR_AVISO', aviso })}
          onSair={reiniciar}
        />
      )}

      {estado.tela === 'resultado' && (
        <TelaResultado
          nome={estado.nome}
          acertos={estado.acertos}
          total={estado.perguntasJogo.length}
          pontos={estado.pontos}
          onBaixarRegistro={() => baixarRegistro(estado.registro, estado.nome)}
          onReiniciar={reiniciar}
          onComemorar={comemorar}
        />
      )}
      <Confete ref={confeteRef} />
    </div>
  )
}
