// Capítulo 2 — Ampliación de funcionalidades + IA embebida
// Estado: upcoming. Estructura lista para sumar secciones reales
// (mismo esquema que chapter1.js: text / findings-grid / matrix / closing)
// cuando terminemos la auditoría y definamos las propuestas concretas.

export default {
  id: "ampliacion-ia",
  index: 2,
  status: "upcoming",
  title: "Ampliación & IA",
  shortTitle: "Ampliación & IA",
  summary: "Mejoras a la aplicación actual, incorporando funcionalidades de IA de forma gradual y con foco en el flujo del comprador mayorista.",
  accentVar: "--accent-ai",

  sections: [
    {
      type: "teaser",
      eyebrow: "Capítulo 02 — Próximamente",
      title: "Ampliación de funcionalidades <em>con IA embebida</em>",
      body: "A partir de los hallazgos de la auditoría, este capítulo va a proponer mejoras concretas a la aplicación actual — varias de ellas potenciadas con IA, incorporadas de forma gradual y sin fricción para el usuario actual.",
      modules: [
        { title: "Búsqueda y descubrimiento inteligente", body: "Búsqueda semántica y filtros asistidos sobre el catálogo mayorista.", ai: true },
        { title: "Recomendaciones de recompra", body: "Sugerencias basadas en historial de pedidos por cliente/temporada.", ai: true },
        { title: "Carga asistida de pedidos", body: "Autocompletado y validación inteligente en la carga de pedidos grandes.", ai: true },
        { title: "Forecasting de demanda", body: "Estimaciones de quiebre de stock y reposición para compradores frecuentes.", ai: true },
        { title: "Asistente conversacional", body: "Soporte para consultas de estado de pedido, stock y condiciones comerciales.", ai: true },
        { title: "Mejoras de flujo (no-IA)", body: "Ajustes de usabilidad directos derivados de la auditoría del Capítulo 1.", ai: false },
      ],
      cta: { label: "Volver al inicio", href: "#/" },
    },
  ],
};
