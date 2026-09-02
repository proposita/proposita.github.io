import chapter1 from "../data/chapter1.js";
import chapter2 from "../data/chapter2.js";
import chapter3 from "../data/chapter3.js";
import { renderSection } from "./render.js";
import { initReveal, revealNow } from "./animations.js";
import { initChapterNavigation, initMatrixInteraction } from "./navigation.js";

const chapters = [chapter1, chapter2, chapter3];
const app = document.getElementById("app");
let cleanupChapter = null;

function statusLabel(status) {
  return status === "active" ? "Disponible" : "Próximamente";
}

function renderHome() {
  const cards = chapters
    .map(
      (ch) => `
      <a class="chapter-card" data-status="${ch.status}" href="#/chapter/${ch.index}">
        <div class="chapter-card__index">${String(ch.index).padStart(2, "0")}</div>
        <div class="chapter-card__body">
          <h3>${ch.shortTitle}</h3>
          <p>${ch.summary}</p>
        </div>
        <div class="chapter-card__footer">
          <span class="status-pill" data-status="${ch.status}">${statusLabel(ch.status)}</span>
          <span class="chapter-card__arrow">→</span>
        </div>
      </a>`
    )
    .join("");

  app.innerHTML = `
    <div class="home">
      <div class="container">
        <div class="home__brandbar">
          <div class="brandbar__mark">Lîlaby <span>×</span> Lilla P</div>
          <div class="brandbar__meta">Informe de evolución de plataforma B2B</div>
        </div>
        <div class="home__hero" data-reveal>
          <p class="eyebrow" data-reveal-item>Propuesta de evolución — Plataforma B2B Wholesale</p>
          <h1 class="home__title" data-reveal-item>Un diagnóstico, una hoja de ruta y una <em>plataforma</em> por construir.</h1>
          <p class="home__lede" data-reveal-item>Este informe reúne los tres frentes de trabajo propuestos a Lilla P: la auditoría de la experiencia actual, su evolución con inteligencia artificial embebida, y la propuesta de un portal B2B multi-módulo.</p>
        </div>
      </div>
      <div class="container">
        <div class="home__cards" data-reveal>${cards}</div>
      </div>
      <div class="container">
        <div class="home__footer">
          <span>Lîlaby — Estudio de diseño y tecnología</span>
          <span>Documento vivo — se actualiza a medida que avanza el proyecto</span>
        </div>
      </div>
    </div>
  `;

  revealNow(app);
}

function renderChapter(index) {
  const chapterData = chapters.find((c) => c.index === index);
  if (!chapterData) {
    location.hash = "#/";
    return;
  }

  const total = chapterData.sections.length;
  const sectionsHtml = chapterData.sections
    .map((section, i) =>
      renderSection(section, { index: i, total, eyebrow: section.eyebrow ?? chapterData.title }, chapterData)
    )
    .join("");

  app.innerHTML = `
    <div class="chapter" style="--accent-current: var(${chapterData.accentVar})" data-chapter="${chapterData.id}">
      <div class="chapter__topbar">
        <a class="topbar__home" href="#/">← Inicio</a>
        <span class="topbar__title">${String(chapterData.index).padStart(2, "0")} — ${chapterData.shortTitle}</span>
      </div>
      <nav class="chapter__progress" data-progress-dots aria-label="Progreso del capítulo"></nav>
      ${sectionsHtml}
    </div>
  `;

  const scrollEl = app.querySelector(".chapter");
  scrollEl.scrollTop = 0;

  initReveal(scrollEl);
  initMatrixInteraction(scrollEl);
  cleanupChapter = initChapterNavigation(scrollEl, chapterData.sections);
}

function route() {
  if (cleanupChapter) {
    cleanupChapter();
    cleanupChapter = null;
  }

  const hash = location.hash || "#/";
  const chapterMatch = hash.match(/^#\/chapter\/(\d+)/);

  if (chapterMatch) {
    renderChapter(Number(chapterMatch[1]));
  } else {
    renderHome();
  }
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", route);
window.addEventListener("DOMContentLoaded", route);

// En caso de que el script se ejecute después de DOMContentLoaded.
if (document.readyState !== "loading") route();
