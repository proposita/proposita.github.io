import { defineConfig } from "vite";

export default defineConfig({
  // Rutas de assets relativas: el sitio usa ruteo por hash (#/chapter/1),
  // así que funciona igual servido en la raíz de un dominio o en un
  // subpath tipo GitHub Pages (usuario.github.io/nombre-del-repo/) sin
  // tener que hardcodear el nombre del repo acá.
  base: "./",
  build: {
    outDir: "dist",
  },
});
