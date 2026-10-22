// A narracao vem dos arquivos .mp3 gravados, em public/audio.
let narracao = null

export function calarVoz() {
  if (narracao) {
    narracao.pause()
    narracao.currentTime = 0
    narracao = null
  }
}

/**
 * Toca a fala gravada, interrompendo a que estiver tocando. Resolve false se
 * o navegador bloquear o som (antes do primeiro toque na pagina, por exemplo).
 */
export function narrar(arquivo) {
  calarVoz()
  if (!arquivo) return Promise.resolve(false)

  const audio = new Audio(`${import.meta.env.BASE_URL}${arquivo}`)
  narracao = audio
  return audio.play().then(
    () => true,
    () => false,
  )
}

// Sons curtos gerados na hora, sem arquivo de audio.
let contexto = null

function tocar(notas) {
  const Audio = window.AudioContext || window.webkitAudioContext
  if (!Audio) return
  if (!contexto) contexto = new Audio()
  if (contexto.state === 'suspended') contexto.resume()

  notas.forEach(([hz, atraso]) => {
    const oscilador = contexto.createOscillator()
    const ganho = contexto.createGain()
    oscilador.type = 'sine'
    oscilador.frequency.value = hz
    const t = contexto.currentTime + atraso
    ganho.gain.setValueAtTime(0.0001, t)
    ganho.gain.exponentialRampToValueAtTime(0.22, t + 0.03)
    ganho.gain.exponentialRampToValueAtTime(0.0001, t + 0.22)
    oscilador.connect(ganho)
    ganho.connect(contexto.destination)
    oscilador.start(t)
    oscilador.stop(t + 0.25)
  })
}

export const somAcerto = () => tocar([[523, 0], [659, 0.14], [784, 0.28]])

// Uma nota so, neutra: o documento pede que o erro nao cause frustracao.
export const somNovaTentativa = () => tocar([[392, 0]])
