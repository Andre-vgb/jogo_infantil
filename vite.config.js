import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base precisa ser o nome do repositorio no GitHub, entre barras,
// senao o GitHub Pages nao acha os arquivos do build.
export default defineConfig({
  plugins: [react()],
  base: '/jogo_infantil/',
})
