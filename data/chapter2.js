// Chapter 2 — Feature expansion + embedded AI
// Status: upcoming. Structure ready to receive real sections (same schema
// as chapter1.js: text / findings-grid / matrix / closing) once the audit
// is done and the concrete proposals are defined.

export default {
  id: "expansion-ai",
  index: 2,
  status: "upcoming",
  title: "Expansion & AI",
  shortTitle: "Expansion & AI",
  summary: "Improvements to the current application, introducing AI features gradually and with a focus on the wholesale buyer's flow.",
  accentVar: "--accent-ai",

  sections: [
    {
      type: "teaser",
      eyebrow: "Chapter 02 — Coming soon",
      title: "Feature expansion <em>with embedded AI</em>",
      body: "Building on the audit's findings, this chapter will propose concrete improvements to the current application — several of them powered by AI, introduced gradually and without disrupting current users.",
      modules: [
        { title: "Smart search & discovery", body: "Semantic search and assisted filtering across the wholesale catalog.", ai: true },
        { title: "Reorder recommendations", body: "Suggestions based on order history by account/season.", ai: true },
        { title: "Assisted order entry", body: "Autocomplete and smart validation for large order entry.", ai: true },
        { title: "Demand forecasting", body: "Stock-out predictions and reorder estimates for frequent buyers.", ai: true },
        { title: "Conversational assistant", body: "Support for order status, stock, and account terms inquiries.", ai: true },
        { title: "Flow improvements (non-AI)", body: "Direct usability fixes derived from the Chapter 1 audit.", ai: false },
      ],
      cta: { label: "Back to home", href: "#/" },
    },
  ],
};
