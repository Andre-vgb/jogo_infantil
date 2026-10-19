// Registro de desempenho. Sem banco de dados: um unico arquivo .txt com id
// auto incremento, como o Setor de Educacao pediu.
//
// 001|Ana Clara|18/10/2026 14:32:10|facil|F01|Matemática|Contar até 5|ACERTO|1

export function montarLinha({ sequencial, nome, nivel, pergunta, resultado, tentativas }) {
  const agora = new Date()
  return [
    String(sequencial).padStart(3, '0'),
    nome,
    `${agora.toLocaleDateString('pt-BR')} ${agora.toLocaleTimeString('pt-BR')}`,
    nivel,
    pergunta.id,
    pergunta.area,
    pergunta.habilidade,
    resultado,
    tentativas,
  ].join('|')
}

export function baixarRegistro(linhas, nome) {
  const blob = new Blob([linhas.join('\n') + '\n'], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `registro-${(nome || 'crianca').replace(/\s+/g, '-').toLowerCase()}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
