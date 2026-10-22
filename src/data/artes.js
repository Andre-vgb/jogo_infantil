// Cada emoji usado no banco de perguntas vira um desenho da pasta assets/img.
// O emoji fica no dado porque e curto e legivel; o desenho e so a apresentacao.

// O Vite resolve os caminhos no build, entao as imagens funcionam tambem
// quando o jogo esta publicado numa subpasta, como no GitHub Pages.
const arquivos = import.meta.glob('../assets/img/*.webp', { eager: true, query: '?url', import: 'default' })

const caminhoDe = (nome) => arquivos[`../assets/img/${nome}.webp`]

export const ARTES = {
  "🐱": "gato",
  "🐈": "gato",
  "🐶": "cachorro",
  "🐕": "cachorro",
  "🍎": "maca",
  "🏐": "bola",
  "🐰": "coelho",
  "🦆": "pato",
  "🐠": "peixe",
  "🐟": "peixe",
  "🏠": "casinha",
  "🌳": "floresta",
  "🏜️": "deserto",
  "🌊": "mar",
  "❄️": "neve",
  "🧒": "crianca",
  "👦": "fila-menino",
  "👧": "fila-menina",
  "🐒": "macaco",
  "🐵": "macaco",
  "⭐": "estrela",
  "🚗": "carrinho",
  "🍪": "biscoito",
  "📦": "caixa",
  "🪑": "mesa",
  "🪸": "aquario",
  "🐸": "sapo",
  "🔔": "sino",
  "🎒": "saco",
  "🛝": "escorregador",
  "🐄": "vaca",
  "🐓": "galo",
  "➕": "mais",
  "🎈": "balao",
  "❔": "interrogacao",
  "☀️": "sol",
  "🧚": "fada",
  "👜": "mala",
  "〰️": "caminho",
  "🪨": "pedra",
  "🥕": "cenoura",
  "🌵": "cacto",
  "⬆️": "seta-cima",
  "⬇️": "seta-baixo",
  "➡️": "seta-lado",
  "🟫": "degrau",
  "🔵": "circulo",
  "🟥": "quadrado",
  "🟦": "quadrado",
  "🔺": "triangulo",
  "🐘": "elefante",
  "🦒": "girafa",
  "🌱": "broto",
  "🌷": "flor",
  "🌸": "arvore-florida",
  "🔊": "alto-falante",
}

const escapar = (texto) => texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const regexDasArtes = new RegExp(
  '(' + Object.keys(ARTES).sort((a, b) => b.length - a.length).map(escapar).join('|') + ')',
  'gu',
)

/** Quebra o texto em pedacos, separando os emojis que viram desenho. */
export function separarArtes(texto) {
  if (!texto) return []
  return String(texto)
    .split(regexDasArtes)
    .filter((parte) => parte !== '')
    .map((parte) => {
      const nome = ARTES[parte]
      return nome
        ? { tipo: 'arte', nome, emoji: parte, src: caminhoDe(nome) }
        : { tipo: 'texto', valor: parte }
    })
}
