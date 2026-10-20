import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import './Confete.css'

const CORES = ['#FF6B6B', '#FFD84D', '#5FC49B', '#5AB6DC', '#8C7BD8', '#FF9F1A', '#F06BB0']
const QUANTIDADE = 130

/**
 * Confetes em canvas, por cima de tudo. Param sozinhos quando saem da tela,
 * para nao pesar nos Chromebooks mais simples da escola.
 * Uso: const confete = useRef(); ... confete.current.soltar()
 */
const Confete = forwardRef(function Confete(_, ref) {
  const canvasRef = useRef(null)
  const flocos = useRef([])
  const animacao = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ajustar = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    ajustar()
    window.addEventListener('resize', ajustar)
    return () => {
      window.removeEventListener('resize', ajustar)
      if (animacao.current) cancelAnimationFrame(animacao.current)
    }
  }, [])

  function passo() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    flocos.current = flocos.current.filter((f) => f.y < canvas.height + 50)
    flocos.current.forEach((f) => {
      f.vy += f.g
      f.x += f.vx
      f.y += f.vy
      f.giro += f.vgiro
      ctx.save()
      ctx.translate(f.x, f.y)
      ctx.rotate(f.giro)
      ctx.fillStyle = f.cor
      ctx.fillRect(-f.l / 2, -f.a / 2, f.l, f.a)
      ctx.restore()
    })

    animacao.current = flocos.current.length ? requestAnimationFrame(passo) : null
  }

  useImperativeHandle(ref, () => ({
    soltar() {
      const sala = document.querySelector('.sala')
      const r = sala
        ? sala.getBoundingClientRect()
        : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight }

      for (let i = 0; i < QUANTIDADE; i++) {
        flocos.current.push({
          x: r.left + r.width * 0.5 + (Math.random() - 0.5) * r.width * 0.7,
          y: r.top + r.height * 0.45 + (Math.random() - 0.5) * 40,
          vx: (Math.random() - 0.5) * 6,
          vy: -5 - Math.random() * 8,
          g: 0.22 + Math.random() * 0.13,
          l: 5 + Math.random() * 7,
          a: 8 + Math.random() * 9,
          cor: CORES[i % CORES.length],
          giro: Math.random() * 6.3,
          vgiro: (Math.random() - 0.5) * 0.32,
        })
      }
      if (!animacao.current) animacao.current = requestAnimationFrame(passo)
    },
  }))

  return <canvas className="confete" ref={canvasRef} aria-hidden="true" />
})

export default Confete