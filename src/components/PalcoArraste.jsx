import { useMemo, useRef, useState } from 'react'
import Arte from './Arte'
import { embaralhar } from '../utils/embaralhar'
import { narrar } from '../utils/audio'
import { FALAS } from '../data/perguntas'
import './PalcoArraste.css'

/**
 * Perguntas respondidas arrastando a peca ate o lugar certo.
 *
 * Aceita duas formas de proposito: arrastar, ou tocar na peca e depois tocar
 * no alvo. Arrastar com touchpad e dificil aos 4 ou 5 anos, e nem todo
 * notebook da escola tem tela sensivel ao toque.
 */
export default function PalcoArraste({ pergunta, onResponder, onAvisar }) {
  const alvos = useMemo(() => embaralhar(pergunta.alvos), [pergunta])

  const [arrasto, setArrasto] = useState(null)
  const [escolhida, setEscolhida] = useState(false)
  const [realcado, setRealcado] = useState(null)
  const [assentadaEm, setAssentadaEm] = useState(null)
  const [tremendo, setTremendo] = useState(false)
  const inicio = useRef(null)

  const alvoSob = (x, y) => {
    const elemento = document.elementFromPoint(x, y)?.closest('[data-alvo]')
    return elemento ? Number(elemento.dataset.alvo) : null
  }

  const soltarNo = (i) => {
    if (assentadaEm != null) return
    if (alvos[i].correta) {
      setAssentadaEm(i)
      onResponder(true)
    } else {
      setTremendo(true)
      setTimeout(() => setTremendo(false), 360)
      onResponder(false)
    }
  }

  const aoDescer = (evento) => {
    if (assentadaEm != null) return
    evento.preventDefault()
    evento.currentTarget.setPointerCapture(evento.pointerId)
    const caixa = evento.currentTarget.getBoundingClientRect()
    inicio.current = {
      dx: evento.clientX - caixa.left,
      dy: evento.clientY - caixa.top,
      moveu: false,
    }
    setArrasto({ x: caixa.left, y: caixa.top })
  }

  const aoMover = (evento) => {
    if (!inicio.current) return
    inicio.current.moveu = true
    setArrasto({ x: evento.clientX - inicio.current.dx, y: evento.clientY - inicio.current.dy })
    setRealcado(alvoSob(evento.clientX, evento.clientY))
  }

  const aoSubir = (evento) => {
    const info = inicio.current
    inicio.current = null
    setArrasto(null)
    setRealcado(null)
    if (!info) return

    // Tocou sem arrastar: marca a peca e espera o toque no lugar certo.
    if (!info.moveu) {
      setEscolhida((marcada) => {
        const agora = !marcada
        if (agora) narrar(FALAS.tocarNoLugar.texto, FALAS.tocarNoLugar.audio)
        onAvisar(agora ? { tipo: 'gentil', texto: FALAS.tocarNoLugar.texto } : null)
        return agora
      })
      return
    }

    const i = alvoSob(evento.clientX, evento.clientY)
    if (i != null) soltarNo(i)
  }

  const aoClicarAlvo = (i) => {
    if (!escolhida) return
    setEscolhida(false)
    onAvisar(null)
    soltarNo(i)
  }

  const peca = (
    <div
      className={[
        'peca',
        arrasto && 'peca--arrastando',
        escolhida && 'peca--escolhida',
        tremendo && 'peca--tremendo',
      ]
        .filter(Boolean)
        .join(' ')}
      style={arrasto ? { left: arrasto.x, top: arrasto.y } : undefined}
      onPointerDown={aoDescer}
      onPointerMove={aoMover}
      onPointerUp={aoSubir}
      onPointerCancel={aoSubir}
    >
      <Arte texto={pergunta.peca} />
    </div>
  )

  const montarAlvo = (alvo, i) => {
    const vaga = (
      <span className="alvo-vaga">
        {assentadaEm === i && (
          <span className="peca peca--assentada">
            <Arte texto={pergunta.peca} />
          </span>
        )}
      </span>
    )

    const cenario = (texto) => (
      <span className={`alvo-cenario${alvo.sombra ? ' alvo-cenario--sombra' : ''}`}>
        <Arte texto={texto} />
      </span>
    )

    const estilo = {}
    let conteudo

    switch (alvo.posicao) {
      case 'dentro':
        conteudo = <span className="alvo-recinto">{cenario(alvo.cenario)}{vaga}</span>
        break
      case 'fora':
        conteudo = (
          <>
            <span className="alvo-recinto">{cenario(alvo.cenario)}</span>
            {vaga}
          </>
        )
        break
      case 'entre':
        conteudo = (
          <>
            {cenario(alvo.cenario[0])}
            {vaga}
            {cenario(alvo.cenario[1])}
          </>
        )
        break
      case 'acima':
        estilo.flexDirection = 'column'
        conteudo = <>{vaga}{cenario(alvo.cenario)}</>
        break
      case 'abaixo':
        estilo.flexDirection = 'column'
        conteudo = <>{cenario(alvo.cenario)}{vaga}</>
        break
      case 'esquerda':
        conteudo = <>{vaga}{cenario(alvo.cenario)}</>
        break
      default:
        conteudo = <>{cenario(alvo.cenario)}{vaga}</>
    }

    if (alvo.elevacao) estilo.marginBottom = alvo.elevacao

    return (
      <div
        key={i}
        data-alvo={i}
        className={`alvo${realcado === i ? ' alvo--perto' : ''}`}
        style={estilo}
        onClick={() => aoClicarAlvo(i)}
      >
        {conteudo}
      </div>
    )
  }

  return (
    <>
      <section className="palco" aria-label="Lugares onde soltar">
        {alvos.map(montarAlvo)}
      </section>
      <div className="gaveta">{assentadaEm == null ? peca : null}</div>
    </>
  )
}