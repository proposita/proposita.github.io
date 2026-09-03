# Lilla P Report — B2B Platform Evolution

Interactive report site for presenting Lilla P with the three fronts of the project:

1. **UX Audit** of the current B2B application (Chapter 1 — in progress)
2. **Feature expansion + embedded AI** (Chapter 2 — coming soon)
3. **Product Platform**: evolution into a multi-module portal — inventory, payments, order entry (Chapter 3 — coming soon)

**Vite + npm** project: plain JS (no framework), with GSAP as a real
dependency (not a CDN) and a build that compiles everything to static
files in `dist/`, ready to publish on any hosting provider. Deployment is
set up for **GitHub Pages via GitHub Actions** (see below).

## Requirements

- [Node.js](https://nodejs.org) 18 or newer (this includes `npm`).
  Check with `node -v` in a terminal.

## Running it locally

```
npm install      # install dependencies (once, or whenever they change)
npm run dev      # starts a local server with live reload
```

This opens something like `http://localhost:5173`. `Ctrl+C` to stop it.

## Production build

```
npm run build
```

Generates the `dist/` folder with compiled, optimized HTML/CSS/JS — this
is what gets uploaded to any hosting provider. To preview that build
before publishing it:

```
npm run preview
```

## Deploying to GitHub Pages (automatic)

The repo includes `.github/workflows/deploy.yml`, which on every `push`
to `main` installs dependencies, runs `npm run build`, and publishes
`dist/` to GitHub Pages — no need to build by hand or upload the `dist/`
folder yourself.

Steps to enable it (one-time, after creating the GitHub repo and pushing
this code):

1. On GitHub: **Settings → Pages → Build and deployment → Source** →
   choose **"GitHub Actions"** (instead of "Deploy from a branch").
2. Push to `main`. In the repo's **Actions** tab you'll see the "Deploy a
   GitHub Pages" workflow run.
3. Once it finishes, the link will be published on that same Settings →
   Pages screen (something like `https://your-username.github.io/repo-name/`).

The site uses hash-based routing (`#/`, `#/chapter/1`), so no extra setup
is needed for it to work under the subpath GitHub Pages assigns a repo —
`vite.config.js` is already set to `base: "./"` so assets resolve
correctly there.

## Project structure

```
index.html            Site shell: loads fonts/CSS and boots main.js
vite.config.js          Build config (output to dist/, relative base)
package.json             Dependencies and scripts (dev / build / preview)
.github/workflows/
  deploy.yml              Automatic build + deploy to GitHub Pages
css/
  tokens.css               Palette, typography, spacing — the report's "design system"
  base.css                  Reset + reveal-on-scroll mechanism
  components.css             Home (hero + chapter index) + chapter shell (nav, dots)
  chapters.css                Content styles: findings, matrix, teasers
js/
  main.js                   Router (#/  and  #/chapter/N) + orchestration
  render.js                  Turns /data content into HTML per section type
  navigation.js                Scroll between sections, progress dots, keyboard, interactive matrix
  animations.js                 Reveal-on-scroll (IntersectionObserver + GSAP, imported from npm)
data/
  chapter1.js                UX Audit content (currently with EXAMPLE findings)
  chapter2.js                  Expansion & AI teaser
  chapter3.js                   Product Platform teaser
assets/                      For screenshots, diagrams, etc. (empty for now)
```

## Adding content

All content lives in `/data/*.js`, separate from the layout code — the
idea is that moving the project forward should mostly mean **editing
these files**, without touching `render.js` unless a new section type is
needed.

Section types available today (used in `chapter1.js` as reference):

- `cover` — chapter cover
- `text` — text block, with an optional list
- `findings-grid` — list of findings (severity + recommendation)
- `matrix` — interactive prioritization matrix (severity × effort)
- `closing` — chapter close with a CTA
- `teaser` — preview of a chapter not yet built out (with modules)

To add a new section type: add a `case` in `renderSection()`
(`js/render.js`) and its corresponding render function.
