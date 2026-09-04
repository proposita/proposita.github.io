import chapter1 from "../data/chapter1.js";
import chapter2 from "../data/chapter2.js";
import chapter3 from "../data/chapter3.js";
import phases from "../data/phases.js";
import { renderSection } from "./render.js";
import { renderPhasePage, renderCategoryPage, renderFindingPage } from "./pages.js";
import { initReveal, revealNow } from "./animations.js";
import { initChapterNavigation, initMatrixInteraction } from "./navigation.js";

const chapters = [chapter1, chapter2, chapter3];
const app = document.getElementById("app");
let cleanupChapter = null;

function statusLabel(status) {
  return status === "active" ? "Available" : "Coming soon";
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
          <div class="brandbar__meta">B2B Platform Evolution Report</div>
        </div>
        <div class="home__hero" data-reveal>
          <p class="eyebrow" data-reveal-item>Evolution Proposal — B2B Wholesale Platform</p>
          <h1 class="home__title" data-reveal-item>A diagnosis, a roadmap, and a <em>platform</em> to build.</h1>
          <p class="home__lede" data-reveal-item>This report brings together the three workstreams proposed for Lilla P: an assessment of the current experience, the evolution and expansion of the existing application, and the definition of a broader B2B Product Platform. Together, they provide a structured path from understanding today’s experience to identifying what should improve, what should grow, and what should be built next — with AI tools playing an important role throughout the roadmap.</p>
        </div>
      </div>
      <div class="container">
        <div class="home__cards" data-reveal>${cards}</div>
      </div>
      <div class="container">
        <div class="home__footer">
          <span>Lîlaby — Design &amp; Technology Studio</span>
          <span>Living document — updated as the project progresses</span>
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
        <a class="topbar__home" href="#/">← Home</a>
        <span class="topbar__title">${String(chapterData.index).padStart(2, "0")} — ${chapterData.shortTitle}</span>
      </div>
      <nav class="chapter__progress" data-progress-dots aria-label="Chapter progress"></nav>
      ${sectionsHtml}
    </div>
  `;

  const scrollEl = app.querySelector(".chapter");
  scrollEl.scrollTop = 0;

  initReveal(scrollEl);
  initMatrixInteraction(scrollEl);
  cleanupChapter = initChapterNavigation(scrollEl, chapterData.sections);
}

function findPhase(chapterIndex, phaseId) {
  return phases.find((p) => p.chapterIndex === chapterIndex && p.id === phaseId);
}

function renderPhase(chapterIndex, phaseId) {
  const phase = findPhase(chapterIndex, phaseId);
  if (!phase) {
    location.hash = `#/chapter/${chapterIndex}`;
    return;
  }
  app.innerHTML = renderPhasePage(phase);
  initReveal(app);
}

function renderCategory(chapterIndex, phaseId, categoryId) {
  const phase = findPhase(chapterIndex, phaseId);
  const category = phase && phase.categories && phase.categories.find((c) => c.id === categoryId);
  if (!phase || !category) {
    location.hash = `#/chapter/${chapterIndex}/phase/${phaseId}`;
    return;
  }
  app.innerHTML = renderCategoryPage(phase, category);
  initReveal(app);
}

function renderFinding(chapterIndex, phaseId, findingId, categoryId) {
  const phase = findPhase(chapterIndex, phaseId);
  const finding = phase && phase.findings.find((f) => f.id === findingId);
  const category = categoryId && phase && phase.categories && phase.categories.find((c) => c.id === categoryId);
  if (!phase || !finding) {
    location.hash = `#/chapter/${chapterIndex}/phase/${phaseId}`;
    return;
  }
  app.innerHTML = renderFindingPage(phase, finding, category || undefined);
  initReveal(app);
}

function route() {
  if (cleanupChapter) {
    cleanupChapter();
    cleanupChapter = null;
  }

  const hash = location.hash || "#/";
  const findingInCategoryMatch = hash.match(
    /^#\/chapter\/(\d+)\/phase\/([\w-]+)\/category\/([\w-]+)\/finding\/([\w-]+)/
  );
  const findingMatch = hash.match(/^#\/chapter\/(\d+)\/phase\/([\w-]+)\/finding\/([\w-]+)/);
  const categoryMatch = hash.match(/^#\/chapter\/(\d+)\/phase\/([\w-]+)\/category\/([\w-]+)/);
  const phaseMatch = hash.match(/^#\/chapter\/(\d+)\/phase\/([\w-]+)/);
  const chapterMatch = hash.match(/^#\/chapter\/(\d+)/);

  if (findingInCategoryMatch) {
    renderFinding(
      Number(findingInCategoryMatch[1]),
      findingInCategoryMatch[2],
      findingInCategoryMatch[4],
      findingInCategoryMatch[3]
    );
  } else if (findingMatch) {
    renderFinding(Number(findingMatch[1]), findingMatch[2], findingMatch[3]);
  } else if (categoryMatch) {
    renderCategory(Number(categoryMatch[1]), categoryMatch[2], categoryMatch[3]);
  } else if (phaseMatch) {
    renderPhase(Number(phaseMatch[1]), phaseMatch[2]);
  } else if (chapterMatch) {
    renderChapter(Number(chapterMatch[1]));
  } else {
    renderHome();
  }
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", route);
window.addEventListener("DOMContentLoaded", route);

// In case the script runs after DOMContentLoaded already fired.
if (document.readyState !== "loading") route();
