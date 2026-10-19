
# Vamos brincar! 🎈

**Vamos brincar!** é um jogo educativo e interativo criado para crianças da **Educação Infantil, Pré-Escola II**, a partir da proposta do Setor de Educação de Brusque.

---

## Sobre o jogo

O jogo apresenta 40 atividades divididas em três níveis de dificuldade, trabalhando quatro abordagens ao mesmo tempo: matemática, português e consciência fonológica, senso de direção e percepção visual. Cada partida embaralha as perguntas e as alternativas de posição, incentivando o raciocínio em vez da memorização.

A criança não precisa ler nada: o enunciado é falado pelo jogo e pode ser repetido quantas vezes ela quiser no botão de som. Cada resposta é registrada com a área e a habilidade trabalhada, e ao final a professora pode salvar um arquivo `.txt` com o desempenho.

---

## Como jogar

1. A professora escreve o nome da criança
2. Escolha o nível de dificuldade: **Fácil**, **Médio** ou **Difícil**
3. Ouça a pergunta falada pelo jogo
4. Responda tocando na alternativa certa, ou arrastando a peça até o lugar certo
5. A cada acerto aparecem os pontos, as estrelas e os confetes
6. Ao final, veja a pontuação e salve o registro em `.txt`

---

## Níveis de dificuldade

| Nível | Perguntas | Conteúdo |
|---|---|---|
| 🌱 Fácil | 16 | Contar até 5, som da letra, primeira letra da palavra, em cima, embaixo, dentro, fora, cores, maior e menor, habitat |
| 🌷 Médio | 12 | Contar até 10, comparar quantidades, sílabas, quantas letras, frente, atrás, entre, lado direito, cores menos usuais, som de animal |
| 🌸 Difícil | 12 | Somar e subtrair, padrões, rimas, sílaba inicial, palavra escrita, trajetos, setas, altura, formas, sombras, achar o diferente |

---

## Abordagens trabalhadas

Cada nível tem as quatro abordagens, e cada uma tem o seu cenário, para a criança perceber pela cor que mudou de assunto.

- **Matemática** (cenário de madeira) contagem, quantidades, comparação, soma e subtração
- **Português e consciência fonológica** (cenário rosa) som da letra, primeira letra, sílabas, rimas, palavra falada e escrita
- **Senso de direção e noções de espaço** (cenário azul) em cima, embaixo, dentro, fora, frente, atrás, entre, lateralidade, trajetos
- **Percepção visual e sensorial** (cenário verde) cores, tamanhos, animais e habitats, formas, sombras, sons de animais

---

## Duas formas de responder

- **Toque** a criança toca na alternativa certa: um número, uma letra, uma cor, uma palavra ou uma figura
- **Arraste** a criança leva a peça até o lugar certo, por exemplo o gato em cima da caixa ou o peixe dentro do aquário

Nas perguntas de arrastar as duas formas valem: arrastar a peça, ou tocar nela e depois tocar no lugar. Arrastar com touchpad é difícil aos 4 ou 5 anos, e nem todo notebook da escola tem tela sensível ao toque.

---

## O erro nunca pune

Sem som grave, sem cor vermelha e sem alternativa que desaparece. A peça apenas balança e volta ao lugar, e a voz convida a tentar de novo. O acerto de primeira vale 10 pontos e duas estrelas; depois de uma tentativa, 5 pontos e uma estrela.

---

## Registro de desempenho

Não há banco de dados: um único arquivo `.txt` com id auto incremento, baixado pelo botão ao final da partida.

```
001|Ana Clara|18/10/2026 14:32:10|facil|F01|Matemática|Contar até 5|ACERTO|1
002|Ana Clara|18/10/2026 14:32:48|facil|F05|Português|Som da letra|ERRO|2
```

O último campo é o número de tentativas até acertar. É o que permite à professora ver não só o acerto, mas em quais habilidades a criança hesita.

---

## Rodando o projeto

```bash
npm install     # só na primeira vez
npm run dev     # abre em http://localhost:5173
npm run build   # gera a pasta dist
npm run preview # confere o build
npm run lint    # checa o código
```

---

## Publicando no GitHub Pages

1. Em `vite.config.js`, deixe `base` igual ao nome do repositório, entre barras:

```js
base: '/Jogo_Infantil/',
```

2. Suba o projeto para o GitHub e rode:

```bash
npm run deploy
```

O script `predeploy` gera o build e o `deploy` publica a pasta `dist` no branch `gh-pages`.

3. No GitHub, em **Settings → Pages**, escolha o branch `gh-pages` e a pasta `/ (root)`.

O endereço fica `https://SEU-USUARIO.github.io/Jogo_Infantil/`. Se as imagens não aparecerem, quase sempre é o `base` diferente do nome do repositório.

---

## Estrutura

```
src/
  App.jsx              estado da partida (useReducer) e regras de pontuação
  components/          uma tela ou peça da interface por arquivo, com o seu CSS
  data/perguntas.js    as 40 perguntas e os três níveis
  data/artes.js        de qual desenho cada emoji do banco vem
  utils/               voz, sons, sorteio e o registro em .txt
  assets/img/          os 51 desenhos em PNG
```

### Acrescentando uma pergunta

Basta copiar o formato de uma parecida em `src/data/perguntas.js`. Nenhum componente precisa mudar.

```js
{
  id: 'F21', nivel: 'facil',
  area: 'Matemática', habilidade: 'Contar até 5',
  texto: 'Quantas bolas você está vendo?',
  cena: '🏐 🏐',
  modo: 'toque', tipo: 'numero',
  opcoes: [
    { valor: '1', correta: false },
    { valor: '2', correta: true },
    { valor: '3', correta: false },
  ],
},
{
  id: 'F22', nivel: 'facil',
  area: 'Senso de direção', habilidade: 'Dentro',
  texto: 'Coloque o peixinho dentro do aquário.',
  modo: 'arraste', peca: '🐠',
  alvos: [
    { posicao: 'dentro', cenario: '🪸', correta: true },
    { posicao: 'fora', cenario: '🪸', correta: false },
  ],
},
```

O `tipo` das perguntas de toque pode ser `numero`, `letra`, `cor`, `palavra` ou `imagem`. A `posicao` dos alvos pode ser `acima`, `abaixo`, `dentro`, `fora`, `esquerda`, `direita` ou `entre`. Os emojis viram desenho pelo mapa em `src/data/artes.js`; se o arquivo não existir, o jogo mostra o emoji no lugar.

---

## Público-alvo

Crianças de 4 e 5 anos, da Educação Infantil Pré-Escola II das escolas de Brusque.

---

## Projeto acadêmico

Desenvolvido no âmbito da **Curricularização da Extensão** do **Centro Universitário de Brusque – UNIFEBE**.
