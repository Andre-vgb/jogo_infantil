import { separarArtes } from '../data/artes'

// Baixa desenhos e falas antes de aparecerem, para a troca de pergunta ser
// instantanea mesmo com a internet fraca da escola. O navegador guarda no
// cache e, quando a pergunta chega, ja esta tudo pronto.
const jaPedidos = new Set()

function pedirImagem(src) {
  if (!src || jaPedidos.has(src)) return
  jaPedidos.add(src)
  const img = new Image()
  img.src = src
}

function pedirAudio(arquivo) {
  const url = `${import.meta.env.BASE_URL}${arquivo}`
  if (jaPedidos.has(url)) return
  jaPedidos.add(url)
  const audio = new Audio()
  audio.preload = 'auto'
  audio.src = url
}

/** Percorre a pergunta (ou fala) inteira atras de .mp3 e de emojis com desenho. */
export function preCarregar(item) {
  if (!item) return
  if (typeof item === 'string') {
    if (item.endsWith('.mp3')) pedirAudio(item)
    else separarArtes(item).forEach((parte) => parte.tipo === 'arte' && pedirImagem(parte.src))
    return
  }
  if (typeof item === 'object') Object.values(item).forEach(preCarregar)
}
