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

function renderText(s) {
  const list = s.list
    ? `<ul class="s-text__list">${s.list
        .map((li) => `<li data-reveal-item><b>${li.label}</b><span>${li.body}</span></li>`)
        .join("")}</ul>`
    : "";
  const body = s.body ? `<p class="s-text__body" data-reveal-item>${s.body}</p>` : "";
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
    <article class="finding-card" data-reveal-item data-finding-id="${f.id}">
      <div class="finding-card__top">
        <span class="severity-badge" data-sev="${f.severity}">${f.severity}</span>
        ${f.example ? `<span class="example-tag">Ejemplo</span>` : ""}
      </div>
      <h4>${f.title}</h4>
      <p>${f.description}</p>
      <div class="finding-card__rec">
        <b>Recomendación</b>
        <p>${f.recommendation}</p>
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
    <p class="matrix-hint">Tocá un punto de la matriz para ver el detalle del hallazgo.</p>
  `;
}

function renderClosing(s) {
  return `
    <div class="s-closing">
      <h2 class="s-closing__title" data-reveal-item>${s.title}</h2>
      <p class="s-closing__body" data-reveal-item>${s.body}</p>
      <div class="cta-row" data-reveal-item>
        <a class="btn btn--primary" href="${s.cta.href}">${s.cta.label} →</a>
        <a class="btn btn--ghost" href="#/">Volver al inicio</a>
      </div>
    </div>
  `;
}

function renderTeaser(s) {
  const modules = (s.modules || [])
    .map(
      (m) => `
      <div class="module-chip" data-reveal-item>
        <b>${m.title} ${m.ai ? `<span class="ai-tag">IA</span>` : ""}</b>
        <span>${m.body}</span>
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
      inner = `<p>Tipo de sección desconocido: ${section.type}</p>`;
  }
  return sectionShell(inner, ctx);
}
