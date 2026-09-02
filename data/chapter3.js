// Capítulo 3 — Product Platform
// Estado: upcoming. Es la propuesta comercial más ambiciosa: convertir
// la app B2B actual en un portal con múltiples módulos.

export default {
  id: "product-platform",
  index: 3,
  status: "upcoming",
  title: "Product Platform",
  shortTitle: "Product Platform",
  summary: "La propuesta más ambiciosa: convertir la app B2B actual en un portal con múltiples módulos — inventario, pagos, order entry y más.",
  accentVar: "--accent-ai",

  sections: [
    {
      type: "teaser",
      eyebrow: "Capítulo 03 — Próximamente",
      title: "De app de pedidos a <em>Product Platform</em>",
      body: "La oferta comercial más ambiciosa del informe: evolucionar la aplicación B2B actual hacia un portal modular, donde la carga de pedidos es una función más dentro de una plataforma más amplia de gestión mayorista.",
      modules: [
        { title: "Inventario", body: "Visibilidad de stock en tiempo real, multi-depósito, para compradores y equipo comercial.", ai: false },
        { title: "Pagos", body: "Gestión de cuenta corriente, medios de pago y estados de cuenta integrados.", ai: false },
        { title: "Order entry", body: "Evolución del flujo actual de carga de pedidos como módulo dentro del portal.", ai: false },
        { title: "Analytics para el comprador", body: "Reportes de compra, tendencias y sugerencias de reposición.", ai: true },
        { title: "Gestión de cuenta y accesos", body: "Roles, múltiples usuarios por cuenta mayorista, permisos por tienda/sucursal.", ai: false },
      ],
      cta: { label: "Volver al inicio", href: "#/" },
    },
  ],
};
