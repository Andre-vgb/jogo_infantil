// A narracao pode vir de dois lugares:
// 1. um arquivo .mp3 gravado, em public/audio
// 2. a voz do proprio navegador, quando o arquivo ainda nao existe
//
// Assim da para ir gravando as falas aos poucos, sem travar o jogo.
export function falar(texto) {
  if (!texto || !('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const fala = new SpeechSynthesisUtterance(texto)
  fala.lang = 'pt-BR'
  fala.rate = 0.85
  fala.pitch = 1.12
  window.speechSynthesis.speak(fala)
}

export function calarVoz() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
  pararAudio()
}

let narracao = null

export function pararAudio() {
  if (narracao) {
    narracao.pause()
    narracao.currentTime = 0
    narracao = null
  }
}

/**
 * Toca a fala. Se o arquivo nao estiver em public/audio, usa a voz do
 * navegador com o mesmo texto.
 */
export function narrar(texto, arquivo) {
  calarVoz()
  if (!arquivo) return falar(texto)

  const audio = new Audio(`${import.meta.env.BASE_URL}${arquivo}`)
  narracao = audio
  audio.addEventListener('error', () => falar(texto))
  audio.play().catch(() => falar(texto))
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
