# Informe & Propuesta Lilla P — Evolución de plataforma B2B

Sitio-informe interactivo para presentarle a Lilla P los tres frentes del proyecto:

1. **Auditoría UX** de la aplicación B2B actual (Capítulo 1 — en desarrollo)
2. **Ampliación de funcionalidades + IA embebida** (Capítulo 2 — próximamente)
3. **Product Platform**: evolución hacia un portal multi-módulo — inventario, pagos, order entry (Capítulo 3 — próximamente)

Proyecto **Vite + npm**: JS plano (sin framework), con GSAP como dependencia
de verdad (no CDN) y un build que compila todo a estático en `dist/`, listo
para publicarse en cualquier hosting. El deploy está configurado para
**GitHub Pages vía GitHub Actions** (ver más abajo).

## Requisitos

- [Node.js](https://nodejs.org) 18 o superior (con esto ya viene `npm`).
  Comprobalo con `node -v` en una terminal.

## Cómo correrlo en tu máquina

```
npm install      # instala dependencias (una sola vez, o cuando cambien)
npm run dev      # levanta un servidor local con recarga en vivo
```

Va a abrir algo como `http://localhost:5173`. `Ctrl+C` para cortarlo.

## Build de producción

```
npm run build
```

Genera la carpeta `dist/` con HTML/CSS/JS ya compilados y optimizados —
es lo que se sube a cualquier hosting. Para previsualizar ese build antes
de publicarlo:

```
npm run preview
```

## Deploy a GitHub Pages (automático)

El repo incluye `.github/workflows/deploy.yml`, que en cada `push` a `main`
instala dependencias, corre `npm run build` y publica `dist/` en GitHub
Pages — no hace falta correr el build a mano ni subir la carpeta `dist/`.

Pasos para activarlo (una sola vez, después de crear el repo en GitHub y
subir este código):

1. En GitHub: **Settings → Pages → Build and deployment → Source** → elegir
   **"GitHub Actions"** (en vez de "Deploy from a branch").
2. Hacer push a `main`. En la pestaña **Actions** del repo vas a ver correr
   el workflow "Deploy a GitHub Pages".
3. Cuando termine, el link va a quedar publicado en esa misma pantalla de
   Settings → Pages (algo como `https://tu-usuario.github.io/nombre-repo/`).

El sitio usa navegación por hash (`#/`, `#/chapter/1`), así que no hace
falta ningún ajuste extra para que funcione en el subpath que le asigna
GitHub Pages a un repo — `vite.config.js` ya está configurado con
`base: "./"` para que los assets se resuelvan bien ahí.

## Estructura del proyecto

```
index.html            Shell del sitio, carga fuentes/CSS y arranca main.js
vite.config.js          Config de build (output a dist/, base relativo)
package.json             Dependencias y scripts (dev / build / preview)
.github/workflows/
  deploy.yml              Build + deploy automático a GitHub Pages
css/
  tokens.css               Paleta, tipografía, espaciado — el "sistema de diseño" del informe
  base.css                  Reset + mecanismo de reveal-on-scroll
  components.css             Home (portada + tarjetas de capítulo) + shell de capítulo (nav, dots)
  chapters.css                Estilos de contenido: hallazgos, matriz, teasers
js/
  main.js                   Router (#/  y  #/chapter/N) + orquestación
  render.js                  Convierte los datos de /data en HTML por tipo de sección
  navigation.js                Scroll entre secciones, dots de progreso, teclado, matriz interactiva
  animations.js                 Reveal-on-scroll (IntersectionObserver + GSAP, importado de npm)
data/
  chapter1.js                Contenido de Auditoría UX (hoy con hallazgos DE EJEMPLO)
  chapter2.js                  Teaser de Ampliación & IA
  chapter3.js                   Teaser de Product Platform
assets/                      Para capturas, diagramas, etc. (vacío por ahora)
```

## Cómo sumar contenido

Todo el contenido vive en `/data/*.js`, separado del código de layout — la idea
es que para avanzar el proyecto alcance con **editar estos archivos**, sin tocar
`render.js` salvo que se necesite un tipo de sección nuevo.

Tipos de sección disponibles hoy (usados en `chapter1.js` como referencia):

- `cover` — portada de capítulo
- `text` — bloque de texto, con lista opcional
- `findings-grid` — grilla de tarjetas de hallazgos (severidad + recomendación)
- `matrix` — matriz de priorización interactiva (severidad × esfuerzo)
- `closing` — cierre de capítulo con CTA
- `teaser` — vista previa de un capítulo aún no desarrollado (con módulos)

Para agregar un tipo de sección nuevo: sumar un `case` en `renderSection()`
(`js/render.js`) y su función de render correspondiente.

## Estado actual — importante

Los hallazgos de `data/chapter1.js` están marcados con la etiqueta **"Ejemplo"**
en la tarjeta: son contenido ilustrativo para probar el mecanismo del sitio
(severidad, recomendación, matriz), **no observaciones reales sobre la app de
Lilla P todavía**. El próximo paso es reemplazarlos por hallazgos reales de la
auditoría (a partir de capturas, acceso a la app, o research existente).

## Próximos pasos

1. Crear el repo en GitHub, hacer el primer push y activar Pages (ver arriba).
2. Reemplazar los hallazgos de ejemplo del Capítulo 1 por hallazgos reales de
   la auditoría.
3. Sumar capturas/evidencia a `assets/` y referenciarlas desde las tarjetas de
   hallazgos.
4. Una vez cerrado el Capítulo 1, desarrollar el contenido completo (no teaser)
   del Capítulo 2 — Ampliación & IA.
5. Ídem para el Capítulo 3 — Product Platform, con enfoque de propuesta
   comercial.
6. Definir identidad visual definitiva (hoy es una dirección inicial: base
   ivorie cálida + tipografía Fraunces/Inter + acento coral, con azul eléctrico
   reservado para momentos de IA) — ajustable en `css/tokens.css` en cuanto
   tengamos referencias visuales concretas.
