// Chapter 3 — Product Platform
// Status: upcoming. The most ambitious proposal: turning the current B2B
// app into a Product Platform.

export default {
  id: "product-platform",
  index: 3,
  status: "upcoming",
  title: "Product Platform",
  shortTitle: "Product Platform",
  summary: "The most ambitious proposal: turning the current B2B app into a Product Platform — inventory, payments, order entry, and more.",
  accentVar: "--accent-ai",

  sections: [
    {
      type: "teaser",
      eyebrow: "Chapter 03 — Coming soon",
      title: "From order-taking app to <em>Product Platform</em>",
      body: "The report's most ambitious commercial offer: evolving the current B2B application into a Product Platform, where order entry is just one function within a broader wholesale management platform.",
      modules: [
        { title: "Inventory", body: "Real-time, multi-warehouse stock visibility for buyers and the sales team.", ai: false },
        { title: "Payments", body: "Integrated credit account management, payment methods, and statements.", ai: false },
        { title: "Order entry", body: "Evolution of the current order-entry flow as one module within the portal.", ai: false },
        { title: "Buyer analytics", body: "Purchase reports, trends, and reorder suggestions.", ai: true },
        { title: "Account & access management", body: "Roles, multiple users per wholesale account, permissions by store/branch.", ai: false },
      ],
      cta: { label: "Back to home", href: "#/" },
    },
  ],
};
