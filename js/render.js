// Convierte los datos de un capítulo (ver /data) en HTML.
// Cada función corresponde a un "type" de sección. Para agregar un tipo
// nuevo: sumar el case en renderSection() y su función acá.

function sectionShell(inner, { index, total, eyebrow }) {
  return `
    <section class="chapter__section" data-reveal id="section-${index}">
      <div class="container">
        <div class="section-label">
          <span class="section-label__num">${String(index + 1).padStart(2, "0")}</span>
          <span class="eyebrow">/ ${String(total).padStart(2, "0")} — ${eyebrow ?? ""}</span>
        </div>
        ${inner}
      </div>
    </section>
  `;
}

function renderCover(s) {
  const meta = (s.meta || [])
    .map((m) => `<div><dt>${m.label}</dt><dd>${m.value}</dd></div>`)
    .join("");
  return `
    <h1 class="s-cover__title" data-reveal-item>${s.title}</h1>
    <dl class="s-cover__meta" data-reveal-item>${meta}</dl>
  `;
}

// Note + category chips shown under a nav-list item's description
// (currently just the "Targeted heuristic evaluation" row): a short note
// (e.g. "Findings are automatically grouped by AI into these N
// categories:") on its own line, followed by that same phase's category
// chips on the line below it. Each chip with an `href` is its own link —
// straight to that category's findings, not the phase link the rest of
// the row points to. Reuses .category-chip / data-cat so the palette
// stays in one place (css/tokens.css + chapters.css); the smaller sizing
// here is scoped to this context only (see .s-text__list-categories in
// chapters.css), not a change to the chip elsewhere.
function renderListItemCategories(li) {
  if (!li.categories || !li.categories.length) return "";
  const chips = li.categories
    .map((c) =>
      c.href
        ? `<a class="category-chip" data-cat="${c.id}" href="${c.href}">${c.title}</a>`
        : `<span class="category-chip" data-cat="${c.id}">${c.title}</span>`
    )
    .join("");
  return `
    <span class="s-text__list-categories">
      ${li.categoriesNote ? `<span class="s-text__list-categories__note">${li.categoriesNote}</span>` : ""}
      <span class="s-text__list-categories__chips">${chips}</span>
    </span>
  `;
}

// A nav-list item that links out to a phase page. Every such row —
// whether or not it has category chips — uses the same 2-column grid
// structure (see .s-text__list li.s-text__list-row in chapters.css), so
// the label/description columns line up consistently across all rows
// instead of each one being sized to its own content independently.
//
// A row with category chips can't use a single wrapping <a> — an <a>
// can't contain another <a>, and each chip is its own link — so instead
// of trying to make one element cover the whole row (an invisible
// overlay turned out fragile in practice), each visible piece gets its
// own small link to the same phase page: the label, and the
// description-with-arrow. Both reuse .s-text__list-link so they pick up
// the same hover/arrow behavior with no extra rules needed. Rows without
// categories use the exact same two-link shape, just with nothing
// rendered in the categories slot. Blank space in the row (the gap
// between the two links, or below the chips) isn't clickable —
// acceptable per Gastón.
function renderNavListItem(li) {
  return `
    <li class="s-text__list-row" data-reveal-item>
      <a class="s-text__list-link" href="${li.href}"><b>${li.label}</b></a>
      <div class="s-text__list-row__main">
        <a class="s-text__list-link" href="${li.href}">
          <span>${li.body}</span>
          <span class="s-text__list-arrow">→</span>
        </a>
        ${renderListItemCategories(li)}
      </div>
    </li>
  `;
}

function renderText(s) {
  // A list where every item links out (a phase-navigation table, e.g.
  // Chapter 1's Methodology section) breaks out of the section's normal
  // reading width and reuses the Home chapter-index's row language
  // (arrow icon/color/position, full-width separator rules) instead of
  // the plain narrow bullet list.
  const isNavList = s.list && s.list.length > 0 && s.list.every((li) => li.href);

  const listItemsHtml = s.list
    ? s.list
        .map((li) =>
          li.href
            ? renderNavListItem(li)
            : `<li data-reveal-item><b>${li.label}</b><span>${li.body}</span></li>`
        )
        .join("")
    : "";

  // s.body can be a single string (one paragraph) or an array of strings
  // (one <p> per paragraph), so longer text blocks can break cleanly.
  const bodies = Array.isArray(s.body) ? s.body : s.body ? [s.body] : [];
  const body = bodies
    .map((p) => `<p class="s-text__body" data-reveal-item>${p}</p>`)
    .join("");

  if (isNavList) {
    return `
      <div class="s-text">
        <h2 class="s-text__title" data-reveal-item>${s.title}</h2>
        ${body}
      </div>
      <ul class="s-text__list s-text__list--nav">${listItemsHtml}</ul>
    `;
  }

  const list = s.list ? `<ul class="s-text__list">${listItemsHtml}</ul>` : "";
  return `
    <div class="s-text">
      <h2 class="s-text__title" data-reveal-item>${s.title}</h2>
      ${body}
      ${list}
    </div>
  `;
}

function findingCard(f) {
  return `
    <article class="finding-row" data-reveal-item data-finding-id="${f.id}" data-sev="${f.severity}">
      <div class="finding-row__meta">
        <span class="severity-tag" data-sev="${f.severity}">${f.severity}</span>
        ${f.example ? `<span class="example-tag">Example</span>` : ""}
      </div>
      <div class="finding-row__content">
        <h4>${f.title}</h4>
        <p>${f.description}</p>
        <div class="finding-row__rec">
          <b>Recommendation</b>
          <p>${f.recommendation}</p>
        </div>
      </div>
    </article>
  `;
}

function renderFindingsGrid(s) {
  return `
    <div class="s-findings__header">
      <h2>${s.title}</h2>
    </div>
    <div class="s-findings__grid">
      ${s.findings.map(findingCard).join("")}
    </div>
  `;
}

function renderMatrix(s, chapterData) {
  // Build a lookup from the findings sections of this same chapter so the
  // matrix can show full detail for each referenced finding id.
  const allFindings = (chapterData.sections || [])
    .filter((sec) => sec.type === "findings-grid")
    .flatMap((sec) => sec.findings);

  const cells = Array.from({ length: 9 }).map(() => "").join("");

  const pins = s.items
    .map((item) => {
      const f = allFindings.find((ff) => ff.id === item.ref);
      if (!f) return "";
      // Inset from the edges (8%–92%) so pins at the extremes of the
      // matrix don't get clipped by the grid's rounded/overflow-hidden edge.
      const leftPct = 8 + ((item.x - 1) / 2) * 84;
      const topPct = 92 - ((item.y - 1) / 2) * 84;
      return `<button class="matrix-pin" data-sev="${f.severity}" data-finding-id="${f.id}"
                style="left:${leftPct}%; top:${topPct}%;" aria-label="${f.title}">${f.severity[0].toUpperCase()}</button>`;
    })
    .join("");

  return `
    <div class="s-matrix__header">
      <h2>${s.title}</h2>
      <p class="s-text__body" style="font-size:var(--fs-body); margin-top:var(--space-2);">${s.body ?? ""}</p>
    </div>
    <div class="matrix-wrap" data-reveal-item>
      <div class="matrix-axis-y">${s.axisY ?? ""}</div>
      <div style="position:relative;">
        <div class="matrix-grid">${cells}${pins}</div>
        <div class="matrix-axis-x">
          ${(s.axisX || []).map((a) => `<span>${a}</span>`).join("")}
        </div>
      </div>
    </div>
    <div class="matrix-detail" data-matrix-detail>
      <h4 data-matrix-title></h4>
      <p data-matrix-body></p>
    </div>
    <p class="matrix-hint">Tap a point on the matrix to see the finding's detail.</p>
  `;
}

function renderClosing(s) {
  return `
    <div class="s-closing">
      <h2 class="s-closing__title" data-reveal-item>${s.title}</h2>
      <p class="s-closing__body" data-reveal-item>${s.body}</p>
      <div class="cta-row" data-reveal-item>
        <a class="btn btn--primary" href="${s.cta.href}">${s.cta.label} →</a>
        <a class="btn btn--ghost" href="#/">Back to home</a>
      </div>
    </div>
  `;
}

function renderTeaser(s) {
  const modules = (s.modules || [])
    .map(
      (m) => `
      <div class="module-row" data-reveal-item>
        <div class="module-row__title">${m.title} ${m.ai ? `<span class="ai-tag">AI</span>` : ""}</div>
        <p class="module-row__body">${m.body}</p>
      </div>`
    )
    .join("");
  return `
    <div class="s-closing">
      <h2 class="s-closing__title" data-reveal-item>${s.title}</h2>
      <p class="s-closing__body" data-reveal-item>${s.body}</p>
      <div class="s-teaser__modules">${modules}</div>
      <div class="cta-row" data-reveal-item>
        <a class="btn btn--ghost" href="${s.cta.href}">${s.cta.label}</a>
      </div>
    </div>
  `;
}

export function renderSection(section, ctx, chapterData) {
  let inner = "";
  switch (section.type) {
    case "cover":
      inner = renderCover(section);
      break;
    case "text":
      inner = renderText(section);
      break;
    case "findings-grid":
      inner = renderFindingsGrid(section);
      break;
    case "matrix":
      inner = renderMatrix(section, chapterData);
      break;
    case "closing":
      inner = renderClosing(section);
      break;
    case "teaser":
      inner = renderTeaser(section);
      break;
    default:
      inner = `<p>Unknown section type: ${section.type}</p>`;
  }
  return sectionShell(inner, ctx);
}
