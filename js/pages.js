// Renders Chapter 1's drill-down pages beyond its own scrolling
// sections: a methodology phase can lead either straight to its
// findings (Areas without categories) or to a summary of categories
// first (Area 1 today), then to a findings table, then to one finding's
// full detail — using the Evidence model structure from
// documents/ux-assessment.md.
//
// These are standalone pages, not part of a chapter's snap-scrolling
// section flow, so they don't go through render.js's sectionShell/
// renderSection — they build their own simple document-flow layout,
// reusing the site's existing topbar and container conventions.

// A case's number (e.g. "Case 01"), shown ahead of its title wherever a
// case is referenced — the findings table and the case's own detail
// page — so cases stay quick to identify by number as the log grows.
// Falls back to nothing for a finding that doesn't carry a caseNumber.
function caseLabel(f) {
  return f.caseNumber ? `Case ${f.caseNumber} — ` : "";
}

function topbar(backHref, backLabel, title) {
  return `
    <div class="chapter__topbar">
      <a class="topbar__home" href="${backHref}">← ${backLabel}</a>
      <span class="topbar__title">${title}</span>
    </div>
  `;
}

function renderScope(scope) {
  const rows = (scope || [])
    .map((s) => `<div><dt>${s.label}</dt><dd>${s.value}</dd></div>`)
    .join("");
  return `<dl class="finding-detail__scope" data-reveal-item>${rows}</dl>`;
}

function renderStepsBlock(block) {
  const items = (block.items || [])
    .map((item) => {
      const img = item.image
        ? `<div class="evidence-step__img"><img src="${item.image}" alt="${item.caption ?? ""}" loading="lazy" /></div>${
            item.caption ? `<div class="evidence-step__caption">${item.caption}</div>` : ""
          }`
        : "";
      return `<li><p>${item.text}</p>${img}</li>`;
    })
    .join("");
  return `
    <div class="evidence-block" data-reveal-item>
      ${block.heading ? `<h3 class="evidence-block__heading">${block.heading}</h3>` : ""}
      <ol class="evidence-steps">${items}</ol>
    </div>
  `;
}

function renderRichtextBlock(block) {
  const paras = (block.paragraphs || []).map((p) => `<p>${p}</p>`).join("");
  const meta = block.meta
    ? `<div class="evidence-meta">${block.meta
        .map((m) => `<div><b>${m.label}</b><p>${m.value}</p></div>`)
        .join("")}</div>`
    : "";
  return `
    <div class="evidence-block" data-reveal-item>
      ${block.heading ? `<h3 class="evidence-block__heading">${block.heading}</h3>` : ""}
      ${paras}
      ${meta}
    </div>
  `;
}

function renderListBlock(block) {
  const items = (block.items || []).map((i) => `<li>${i}</li>`).join("");
  const tag = block.ordered ? "ol" : "ul";
  const cls = block.ordered ? "evidence-list evidence-list--ordered" : "evidence-list";
  // Optional paragraphs around the list itself — same shape as a
  // richtext block's `paragraphs`, so a list can be introduced or
  // followed by a bit of prose without needing a separate richtext block
  // right before/after it. `intro` renders before the list, `paragraphs`
  // after — both take an array of strings, one `<p>` each.
  const intro = (block.intro || []).map((p) => `<p>${p}</p>`).join("");
  const paras = (block.paragraphs || []).map((p) => `<p>${p}</p>`).join("");
  return `
    <div class="evidence-block" data-reveal-item>
      ${block.heading ? `<h3 class="evidence-block__heading">${block.heading}</h3>` : ""}
      ${intro}
      <${tag} class="${cls}">${items}</${tag}>
      ${paras}
    </div>
  `;
}

// `grouped: true` switches on a compact variant (see .evidence-table--grouped
// in chapters.css): no header row, no vertical borders, and a horizontal
// rule only where a new row-group starts — inferred from the row's first
// cell being non-empty (the convention used for a table whose first
// column names a group only on that group's first row, leaving it blank
// on the rows below). A normal table (no `grouped`) is unaffected.
// `footnote` renders as a small aside right under the table, for a caveat
// that belongs with the table rather than as a separate paragraph below it.
function renderTableBlock(block) {
  const hasHeader = block.headers && block.headers.length;
  const head = hasHeader ? `<thead><tr>${block.headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>` : "";
  const rows = (block.rows || [])
    .map((r) => {
      const isGroupStart = block.grouped && r[0];
      return `<tr${isGroupStart ? ` class="evidence-table__group-start"` : ""}>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`;
    })
    .join("");
  return `
    <div class="evidence-block" data-reveal-item>
      ${block.heading ? `<h3 class="evidence-block__heading">${block.heading}</h3>` : ""}
      ${block.note ? `<p>${block.note}</p>` : ""}
      <div class="evidence-table-wrap">
        <table class="evidence-table${block.grouped ? " evidence-table--grouped" : ""}">
          ${head}
          <tbody>${rows}</tbody>
        </table>
      </div>
      ${block.footnote ? `<p class="evidence-table__footnote">${block.footnote}</p>` : ""}
    </div>
  `;
}

function renderBlock(block) {
  switch (block.type) {
    case "steps":
      return renderStepsBlock(block);
    case "richtext":
      return renderRichtextBlock(block);
    case "list":
      return renderListBlock(block);
    case "table":
      return renderTableBlock(block);
    default:
      return "";
  }
}

// ---------- Phase summary (categories) ----------
// Shown for a phase that declares `categories` (Area 1 today): a longer
// explanation of the work done in this phase (its `explainer` blocks,
// reusing the same block renderers as a finding's detail), followed by
// one rule-separated section per category — description, finding count,
// and a button into that category's findings table.

export function renderPhaseSummaryPage(phase) {
  const explainer = (phase.explainer || []).map(renderBlock).join("");

  const categoriesIntro = phase.categoriesIntro
    ? `
      <div class="category-list-intro" data-reveal>
        <h2 class="category-list-intro__title" data-reveal-item>${phase.categoriesIntro.title}</h2>
        <p class="category-list-intro__body" data-reveal-item>${phase.categoriesIntro.body}</p>
      </div>
    `
    : "";

  const sections = phase.categories
    .map((cat) => {
      const count = phase.findings.filter((f) => (f.categories || []).includes(cat.id)).length;
      return `
        <div class="category-row" data-reveal-item>
          <div class="category-row__title">
            <h3><span class="category-chip" data-cat="${cat.id}">${cat.title}</span></h3>
            <div class="category-row__count">${count} finding${count === 1 ? "" : "s"}</div>
          </div>
          <div class="category-row__body">
            <p>${cat.description}</p>
            <a class="btn btn--primary" href="#/chapter/${phase.chapterIndex}/phase/${phase.id}/category/${cat.id}">See Findings →</a>
          </div>
        </div>
      `;
    })
    .join("");

  // Closing highlight for the phase's priority finding (Area 1 today: the
  // missing Design System). Its accent color follows the matching
  // category chip via `data-cat`, when one is set.
  const highlight = phase.priorityHighlight
    ? (() => {
        const h = phase.priorityHighlight;
        const cat = (phase.categories || []).find((c) => c.id === h.categoryId);
        const cta = cat
          ? `<div class="priority-callout__cta" data-reveal-item><a class="btn btn--ghost" href="#/chapter/${phase.chapterIndex}/phase/${phase.id}/category/${cat.id}">See ${cat.title} findings →</a></div>`
          : "";
        return `
          <div class="priority-callout" data-cat="${h.categoryId ?? ""}" data-reveal>
            <span class="eyebrow" data-reveal-item>${h.eyebrow}</span>
            <h3 class="priority-callout__title" data-reveal-item>${h.title}</h3>
            <p class="priority-callout__body" data-reveal-item>${h.body}</p>
            ${cta}
          </div>
        `;
      })()
    : "";

  return `
    ${topbar(`#/chapter/${phase.chapterIndex}`, "Chapter", `${phase.eyebrow} — ${phase.title}`)}
    <div class="page">
      <div class="container">
        <div class="page__header" data-reveal>
          <div class="page__eyebrow-row"><span class="eyebrow" data-reveal-item>${phase.eyebrow}</span></div>
          <h1 class="page__title" data-reveal-item>${phase.title}</h1>
          <p class="page__intro" data-reveal-item>${phase.intro}</p>
        </div>
        <div class="phase-explainer">${explainer}</div>
        ${categoriesIntro}
        <div class="category-list" data-reveal>${sections}</div>
        ${highlight}
      </div>
    </div>
  `;
}

// ---------- Findings list (table) ----------
// Reused for a phase without categories (goes straight here from the
// phase link) and for a single category's findings (goes here from a
// "See Findings" button). `findingHref` builds each row's link so the
// caller controls whether it carries a category segment.

function renderFindingsListPage({ backHref, backLabel, eyebrow, title, intro, findings, findingHref, explainer, rowSummary }) {
  const summaryFor = rowSummary || ((f) => f.summary);
  const explainerHtml = explainer && explainer.length
    ? `<div class="phase-explainer">${explainer.map(renderBlock).join("")}</div>`
    : "";
  const rows = findings.length
    ? `<div class="phase-findings" data-reveal>${findings
        .map(
          (f) => `
        <a class="phase-finding-row" data-kind="${f.statusKind}" data-reveal-item href="${findingHref(f)}">
          <span class="status-tag" data-kind="${f.statusKind}">${f.status}</span>
          <div class="phase-finding-row__body">
            <h4>${caseLabel(f)}${f.title}</h4>
            <p>${summaryFor(f)}</p>
          </div>
          <span class="phase-finding-row__arrow">→</span>
        </a>`
        )
        .join("")}</div>`
    : `<p class="phase-empty" data-reveal-item>No findings recorded yet here.</p>`;

  return `
    ${topbar(backHref, backLabel, eyebrow)}
    <div class="page">
      <div class="container">
        <div class="page__header" data-reveal>
          <div class="page__eyebrow-row"><span class="eyebrow" data-reveal-item>${eyebrow}</span></div>
          <h1 class="page__title" data-reveal-item>${title}</h1>
          ${intro ? `<p class="page__intro" data-reveal-item>${intro}</p>` : ""}
        </div>
        ${explainerHtml}
        ${rows}
      </div>
    </div>
  `;
}

// Entry point for a phase link (`#/chapter/N/phase/ID`): a phase with
// `categories` shows the summary page; one without goes straight to its
// flat findings table.
export function renderPhasePage(phase) {
  if (phase.categories) return renderPhaseSummaryPage(phase);
  return renderFindingsListPage({
    backHref: `#/chapter/${phase.chapterIndex}`,
    backLabel: "Chapter",
    eyebrow: phase.eyebrow,
    title: phase.title,
    intro: phase.intro,
    findings: phase.findings,
    findingHref: (f) => `#/chapter/${phase.chapterIndex}/phase/${phase.id}/finding/${f.id}`,
    explainer: phase.explainer,
  });
}

// Entry point for a category link (`#/chapter/N/phase/ID/category/CID`).
// A finding can belong to more than one category (see phases.js's file
// header), so it's included here whenever its own `categories` array
// contains this one — not exclusively. The row itself still shows a
// category-scoped summary via `categorySummaries` (falling back to the
// finding's general `summary` if that specific category isn't covered),
// so a case whose findings split across categories doesn't show the
// same generic blurb — describing all of its findings — in every
// category it's listed under. The link still opens the full case either
// way; only the listing-row text is scoped.
export function renderCategoryPage(phase, category) {
  return renderFindingsListPage({
    backHref: `#/chapter/${phase.chapterIndex}/phase/${phase.id}`,
    backLabel: phase.title,
    eyebrow: `${phase.eyebrow} — ${category.title}`,
    title: category.title,
    intro: category.description,
    findings: phase.findings.filter((f) => (f.categories || []).includes(category.id)),
    findingHref: (f) => `#/chapter/${phase.chapterIndex}/phase/${phase.id}/category/${category.id}/finding/${f.id}`,
    rowSummary: (f) => (f.categorySummaries && f.categorySummaries[category.id]) || f.summary,
  });
}

// ---------- Finding detail ----------
// `category` is passed when the finding was reached through a category
// page, so the back-link and eyebrow point one level up correctly.
export function renderFindingPage(phase, finding, category) {
  const blocks = (finding.blocks || []).map(renderBlock).join("");
  const backHref = category
    ? `#/chapter/${phase.chapterIndex}/phase/${phase.id}/category/${category.id}`
    : `#/chapter/${phase.chapterIndex}/phase/${phase.id}`;
  const backLabel = category ? category.title : phase.title;
  const eyebrow = category ? `${phase.eyebrow} — ${category.title}` : phase.eyebrow;

  return `
    ${topbar(backHref, backLabel, `${caseLabel(finding)}${finding.title}`)}
    <div class="page">
      <div class="container">
        <div class="finding-detail">
          <div class="page__header" data-reveal>
            <div class="page__eyebrow-row">
              <span class="eyebrow" data-reveal-item>${eyebrow}</span>
              <span class="status-tag" data-kind="${finding.statusKind}" data-reveal-item>${finding.status}</span>
            </div>
            <h1 class="page__title" data-reveal-item>${caseLabel(finding)}${finding.title}</h1>
          </div>
          ${renderScope(finding.scope)}
          ${blocks}
          <div class="page__back-crumb" data-reveal-item>
            <a class="btn btn--ghost" href="${backHref}">← Back to ${backLabel}</a>
          </div>
        </div>
      </div>
    </div>
  `;
}
