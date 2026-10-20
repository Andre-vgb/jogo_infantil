import { Fragment, useState } from 'react'
import { separarArtes } from '../data/artes'

function Figura({ nome, emoji, src }) {
  const [falhou, setFalhou] = useState(false)
  // Sem o PNG na pasta, mostra o emoji: nunca um icone quebrado no meio da atividade.
  if (falhou || !src) return <span>{emoji}</span>
  return (
    <img className="arte" src={src} alt={nome} draggable={false} onError={() => setFalhou(true)} />
  )
}

/** Troca cada emoji conhecido pelo desenho correspondente. */
export default function Arte({ texto }) {
  if (!texto) return null
  return separarArtes(texto).map((parte, i) =>
    parte.tipo === 'arte' ? (
      <Figura key={i} nome={parte.nome} emoji={parte.emoji} src={parte.src} />
    ) : (
      <Fragment key={i}>{parte.valor}</Fragment>
    ),
  )
}