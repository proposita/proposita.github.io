// Reveal-on-enter: cuando una sección (o un elemento marcado) entra en
// viewport, se le agrega la clase .is-visible (ver base.css) y se anima
// además un stagger de sus [data-reveal-item] con GSAP.

import gsap from "gsap";

export function initReveal(root = document) {
  const targets = root.querySelectorAll("[data-reveal]");
  if (!targets.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          staggerChildren(entry.target);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -4% 0px" }
  );

  targets.forEach((t) => io.observe(t));
}

// Para vistas que no dependen de scroll (p. ej. la home, que puede entrar
// entera o casi entera en el viewport y nunca cruzar un umbral de
// intersección): revela todo de inmediato, con la misma animación.
export function revealNow(root = document) {
  const targets = root.querySelectorAll("[data-reveal]");
  targets.forEach((t) => {
    t.classList.add("is-visible");
    staggerChildren(t);
  });
}

function staggerChildren(el) {
  const items = el.querySelectorAll("[data-reveal-item]");
  if (!items.length) return;

  gsap.fromTo(
    items,
    { opacity: 0, y: 22 },
    { opacity: 1, y: 0, duration: 0.75, ease: "power3.out", stagger: 0.08, delay: 0.05 }
  );
}
