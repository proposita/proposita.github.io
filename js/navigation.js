// Controla la navegación dentro de un capítulo: dots de progreso,
// teclado (flechas / Home / End) y el estado "sección activa".

export function initChapterNavigation(scrollEl, sections) {
  const dotsWrap = document.querySelector("[data-progress-dots]");
  if (dotsWrap) {
    dotsWrap.innerHTML = sections
      .map(
        (_, i) =>
          `<button class="progress__dot" data-dot="${i}" aria-label="Ir a sección ${i + 1}"></button>`
      )
      .join("");
  }

  const dots = dotsWrap ? [...dotsWrap.querySelectorAll(".progress__dot")] : [];
  const sectionEls = sections.map((_, i) => document.getElementById(`section-${i}`));

  function setActive(i) {
    dots.forEach((d, di) => d.classList.toggle("is-active", di === i));
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          const i = sectionEls.indexOf(entry.target);
          if (i !== -1) setActive(i);
        }
      });
    },
    { root: scrollEl, threshold: [0.5] }
  );
  sectionEls.forEach((el) => el && io.observe(el));

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      sectionEls[i]?.scrollIntoView({ behavior: "smooth" });
    });
  });

  setActive(0);

  function currentIndex() {
    let closest = 0;
    let closestDist = Infinity;
    sectionEls.forEach((el, i) => {
      if (!el) return;
      const dist = Math.abs(el.getBoundingClientRect().top);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });
    return closest;
  }

  function goTo(i) {
    const clamped = Math.max(0, Math.min(sectionEls.length - 1, i));
    sectionEls[clamped]?.scrollIntoView({ behavior: "smooth" });
  }

  function onKeydown(e) {
    if (["ArrowDown", "PageDown"].includes(e.key)) {
      e.preventDefault();
      goTo(currentIndex() + 1);
    } else if (["ArrowUp", "PageUp"].includes(e.key)) {
      e.preventDefault();
      goTo(currentIndex() - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      goTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      goTo(sectionEls.length - 1);
    }
  }

  window.addEventListener("keydown", onKeydown);

  // Devuelve una función de limpieza para cuando se desmonta el capítulo.
  return () => {
    window.removeEventListener("keydown", onKeydown);
    io.disconnect();
  };
}

export function initMatrixInteraction(root = document) {
  root.querySelectorAll(".matrix-grid").forEach((grid) => {
    const section = grid.closest(".chapter__section");
    const detail = section?.querySelector("[data-matrix-detail]");
    const titleEl = detail?.querySelector("[data-matrix-title]");
    const bodyEl = detail?.querySelector("[data-matrix-body]");

    grid.querySelectorAll(".matrix-pin").forEach((pin) => {
      pin.addEventListener("click", () => {
        const isOpen = pin.classList.contains("is-open");
        grid.querySelectorAll(".matrix-pin").forEach((p) => p.classList.remove("is-open"));
        if (isOpen) {
          detail?.classList.remove("is-visible");
          return;
        }
        pin.classList.add("is-open");
        // Las finding-cards viven en secciones anteriores del capítulo
        // (no dentro de la sección de la matriz), así que buscamos en
        // todo el root del capítulo, no sólo en esta sección.
        const card = root.querySelector(`.finding-card[data-finding-id="${pin.dataset.findingId}"]`);
        if (card && titleEl && bodyEl) {
          titleEl.textContent = card.querySelector("h4")?.textContent ?? "";
          bodyEl.textContent = card.querySelector("p")?.textContent ?? "";
          detail.classList.add("is-visible");
        }
      });
    });
  });
}
