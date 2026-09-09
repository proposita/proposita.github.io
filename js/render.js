// Convierte los datos de un capítulo (ver /data) en HTML.
// Cada función corresponde a un "type" de sección. Para agregar un tipo
// nuevo: sumar el case en renderSection() y su función acá.

import phases from "../data/phases.js";

// Short, human label for a case's overall statusKind, used in the
// compact cases table below (renderCasesTable) — a case's own `status`
// field is a full sentence-or-more write-up (fine for its detail page,
// see js/pages.js), so the table shows this short form instead.
const CASE_STATUS_LABEL = {
  pass: "No issues",
  issue: "Issues found",
  "issue-high": "High priority",
  pending: "In progress",
};

// Short label per entry in a case's `viewports` array (see phases.js —
// every case declares this explicitly; it's all three widths unless the
// case is desktop-only by design, currently just the two admin-journeys
// cases). Rendered as small stacked chips, one per width, each with its
// own color (--viewport-* tokens in css/tokens.css) — a palette kept
// separate from the category chips used elsewhere.
const VIEWPORT_LABEL = { desktop: "Desktop", tablet: "Tablet", mobile: "Mobile" };
function renderViewportChips(viewports) {
  if (!viewports || !viewports.length) return "—";
  const chips = viewports
    .map((v) => `<span class="viewport-chip" data-viewport="${v}">${VIEWPORT_LABEL[v] ?? v}</span>`)
    .join("");
  return `<div class="viewport-chips">${chips}</div>`;
}

// Cuts `text` to the last whole word at or before `max` chars (never
// mid-word) and appends a single ellipsis; text already at or under
// `max` is returned unchanged. Used for the cases table's per-case
// description, which otherwise runs long enough to blow up row height.
function truncate(text, max) {
  if (!text || text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

// A case's findings live as "richtext" blocks headed "Finding N — ..."
// inside its own `blocks` array (see any case in phases.js). Counts only
// those that carry a "Priority note" in their `meta` — i.e. findings
// with a reported High/Medium/Low priority, per the cases table's
// Findings column. Every finding across all 8 cases has one as of this
// writing; a future case's finding without one simply won't count here
// until its priority is filled in.
function countFindings(f) {
  return (f.blocks || []).filter(
    (b) =>
      b.type === "richtext" &&
      typeof b.heading === "string" &&
      /^Finding \d+ —/.test(b.heading) &&
      (b.meta || []).some((m) => m.label === "Priority note")
  ).length;
}

// Compact table of every case completed so far, for Chapter 1's closing
// slide (see chapter1.js section 4, `casesTable: true`). Reads straight
// from /data/phases.js at render time — the same source the phase/
// category/finding pages use — so this table grows on its own as new
// cases are promoted there; nothing here needs to change when a case is
// added.
//
// A case object is listed once per phase it belongs to (see phases.js's
// file header) — usually all three — so this dedupes by id first, then
// sorts by case number. Each row links to the case's own detail page;
// any phase that includes the case works as the link's phase segment,
// since the finding-detail route doesn't depend on which one.
function renderCasesTable() {
  const byId = new Map();
  phases.forEach((phase) => {
    (phase.findings || []).forEach((f) => {
      if (!byId.has(f.id)) byId.set(f.id, { finding: f, phase });
    });
  });
  const rows = Array.from(byId.values()).sort((a, b) =>
    (a.finding.caseNumber ?? "").localeCompare(b.finding.caseNumber ?? "")
  );

  const trs = rows
    .map(({ finding: f, phase }) => {
      const href = `#/chapter/${phase.chapterIndex}/phase/${phase.id}/finding/${f.id}`;
      const statusLabel = CASE_STATUS_LABEL[f.statusKind] ?? f.statusKind;
      return `
        <tr>
          <td class="cases-table__num">${f.caseNumber ?? "—"}</td>
          <td class="cases-table__title">
            <a href="${href}"><strong>${f.title}</strong></a>
            <p class="cases-table__desc">${truncate(f.summary ?? "", 200)}</p>
          </td>
          <td class="cases-table__status"><span class="status-tag" data-kind="${f.statusKind}">${statusLabel}</span></td>
          <td class="cases-table__viewports">${renderViewportChips(f.viewports)}</td>
          <td class="cases-table__findings">${countFindings(f)}</td>
        </tr>`;
    })
    .join("");

  return `
    <div class="evidence-table-wrap cases-table-wrap" data-reveal-item>
      <table class="evidence-table cases-table">
        <thead><tr><th>Case</th><th>What was tested</th><th>Status</th><th>Viewports</th><th>Findings</th></tr></thead>
        <tbody>${trs}</tbody>
      </table>
    </div>
  `;
}

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
// (currently the "Targeted heuristic evaluation" and "Key journeys and
// cognitive walkthrough" rows): a short note
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
      ${s.casesTable ? renderCasesTable() : ""}
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
