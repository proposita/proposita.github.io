// Capítulo 1 — Auditoría UX
//
// IMPORTANTE: los hallazgos de este archivo son EJEMPLOS ILUSTRATIVOS
// (marcados con el tag "Ejemplo") para probar el mecanismo del sitio,
// no observaciones reales sobre la app de Lilla P todavía.
// Reemplazá cada "finding" por hallazgos reales una vez que tengamos
// capturas / acceso / research de la aplicación actual.

export default {
  id: "auditoria-ux",
  index: 1,
  status: "active", // active | upcoming
  title: "Auditoría UX",
  shortTitle: "Auditoría UX",
  summary: "Diagnóstico de la experiencia actual de la plataforma B2B: qué funciona, qué fricciona y qué prioridad tiene resolverlo.",
  accentVar: "--accent",

  sections: [
    {
      type: "cover",
      eyebrow: "Capítulo 01",
      title: "Auditoría <em>UX</em> de la plataforma B2B actual",
      meta: [
        { label: "Cliente", value: "Lilla P — Wholesale" },
        { label: "Alcance", value: "App B2B de venta mayorista (web)" },
        { label: "Estado", value: "En curso" },
      ],
    },
    {
      type: "text",
      eyebrow: "Objetivo",
      title: "Por qué empezamos por acá",
      body: "Antes de sumar inteligencia artificial o nuevos módulos, necesitamos un diagnóstico honesto de la experiencia actual: dónde generamos fricción a los compradores mayoristas, qué tareas les cuestan más de lo que deberían, y qué es sólido y conviene preservar.",
    },
    {
      type: "text",
      eyebrow: "Metodología",
      title: "Cómo evaluamos la aplicación",
      list: [
        { label: "Revisión heurística", body: "Evaluación experta sobre los flujos clave (catálogo, carga de pedido, checkout, cuenta) contra heurísticas de usabilidad y patrones B2B/wholesale." },
        { label: "Recorrido de flujos críticos", body: "Simulación de las tareas más frecuentes de un comprador mayorista, de punta a punta." },
        { label: "Relevamiento responsive", body: "Comportamiento de la interfaz en los dispositivos y tamaños de pantalla relevantes para el uso real de los compradores." },
        { label: "Entrevistas / research", body: "A incorporar si el cliente puede facilitar acceso a usuarios o datos de uso existentes." },
      ],
    },
    {
      type: "findings-grid",
      eyebrow: "Hallazgos",
      title: "Navegación y arquitectura de información",
      findings: [
        {
          id: "f1",
          severity: "alto",
          effort: 2,
          example: true,
          title: "Ejemplo — Categorización del catálogo poco alineada al criterio de compra mayorista",
          description: "El comprador B2B suele buscar por temporada/colección o por código, no del mismo modo que un consumidor final. Si la taxonomía actual no refleja ese criterio, la búsqueda se vuelve lenta.",
          recommendation: "Validar la taxonomía con compradores reales y, si corresponde, ofrecer filtros/orden alternativos orientados a wholesale.",
        },
        {
          id: "f2",
          severity: "medio",
          effort: 1,
          example: true,
          title: "Ejemplo — Falta de breadcrumbs en secciones profundas",
          description: "En pantallas anidadas (colección > categoría > producto) puede no quedar claro dónde está parado el usuario ni cómo volver sin perder filtros aplicados.",
          recommendation: "Incorporar breadcrumbs persistentes que conserven el estado de filtros al volver.",
        },
        {
          id: "f3",
          severity: "bajo",
          effort: 1,
          example: true,
          title: "Ejemplo — Estados vacíos poco informativos",
          description: "Ante una búsqueda sin resultados, la pantalla podría no orientar al usuario sobre próximos pasos (ajustar filtros, contactar a su representante, etc.).",
          recommendation: "Diseñar estados vacíos accionables con sugerencias concretas.",
        },
      ],
    },
    {
      type: "findings-grid",
      eyebrow: "Hallazgos",
      title: "Flujo de pedido (order entry) y checkout",
      findings: [
        {
          id: "f4",
          severity: "alto",
          effort: 3,
          example: true,
          title: "Ejemplo — Carga de pedidos grandes por talle/color es lenta",
          description: "Cuando un comprador necesita cargar muchas combinaciones de SKU (talle × color) fila por fila, el proceso puede volverse tedioso comparado con flujos tipo grilla o carga masiva.",
          recommendation: "Evaluar una vista de carga tipo grilla/matriz o importación desde planilla para pedidos de gran volumen.",
        },
        {
          id: "f5",
          severity: "medio",
          effort: 2,
          example: true,
          title: "Ejemplo — Visibilidad de stock y mínimos poco clara antes de confirmar",
          description: "El comprador puede llegar al final del checkout sin haber visto con claridad disponibilidad real, mínimos de compra o fechas estimadas de entrega por ítem.",
          recommendation: "Exponer stock, mínimos y ETA en el mismo punto donde se toma la decisión de compra, no sólo al final.",
        },
        {
          id: "f6",
          severity: "medio",
          effort: 1,
          example: true,
          title: "Ejemplo — Sin confirmación clara post-pedido",
          description: "La pantalla o el email de confirmación podrían no resumir con claridad qué se pidió, condiciones y próximos pasos administrativos.",
          recommendation: "Rediseñar la confirmación como un resumen accionable (PDF/email) con el detalle completo del pedido.",
        },
      ],
    },
    {
      type: "matrix",
      eyebrow: "Síntesis",
      title: "Matriz de priorización",
      body: "Cruce entre severidad del problema y esfuerzo estimado de resolución — para decidir qué encarar primero. Tocá cada punto para ver el detalle.",
      axisX: ["Bajo esfuerzo", "Esfuerzo medio", "Alto esfuerzo"],
      axisY: "Severidad ↑",
      items: [
        { ref: "f1", x: 2, y: 3 },
        { ref: "f2", x: 1, y: 2 },
        { ref: "f3", x: 1, y: 1 },
        { ref: "f4", x: 3, y: 3 },
        { ref: "f5", x: 2, y: 2 },
        { ref: "f6", x: 1, y: 2 },
      ],
    },
    {
      type: "closing",
      eyebrow: "Cierre del capítulo",
      title: "De la auditoría a la <em>hoja de ruta</em>",
      body: "Con los hallazgos priorizados, el siguiente paso es traducirlos en mejoras concretas — muchas de las cuales pueden potenciarse con funcionalidades de IA embebida. Eso es el Capítulo 2.",
      cta: { label: "Ir al Capítulo 2", href: "#/chapter/2" },
    },
  ],
};
