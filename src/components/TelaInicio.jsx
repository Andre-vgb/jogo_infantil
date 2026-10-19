import Moldura from './Moldura'
import Arte from './Arte'
import { NIVEIS, FALAS, perguntasDoNivel } from '../data/perguntas'
import { narrar } from '../utils/audio'
import './TelaInicio.css'

export default function TelaInicio({ nome, onMudarNome, onIniciar }) {
  return (
    <main className="tela-inicio">
      <Moldura tema="tema-palco" onOuvir={() => narrar(FALAS.convite.texto, FALAS.convite.audio)}>
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

      {/* Unico momento de teclado do jogo, e quem usa e a professora. */}
      <p className="inicio-nome">
        <label htmlFor="nome">Professor:</label>
        <input
          id="nome"
          value={nome}
          onChange={(e) => onMudarNome(e.target.value)}
          placeholder="nome da criança"
          autoComplete="off"
        />
      </p>
    </main>
  )
}
