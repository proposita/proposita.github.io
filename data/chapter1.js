// Chapter 1 — UX Audit
//
// IMPORTANT: the findings in this file are ILLUSTRATIVE EXAMPLES (tagged
// "Example") meant to exercise the site's mechanics, not real observations
// about the Lilla P app yet. Replace each finding with a real one once we
// have screenshots / access / existing research on the current app.

export default {
  id: "ux-audit",
  index: 1,
  status: "active", // active | upcoming
  title: "UX Audit",
  shortTitle: "UX Audit",
  summary: "A diagnosis of the current B2B experience: what's working, what's causing friction, and what's worth prioritizing.",
  accentVar: "--accent",

  sections: [
    {
      type: "cover",
      eyebrow: "Chapter 01",
      title: "<em>UX</em> audit of the current B2B platform",
      meta: [
        { label: "Client", value: "Lilla P — Wholesale" },
        { label: "Scope", value: "B2B wholesale ordering app (web)" },
        { label: "Status", value: "In progress" },
      ],
    },
    {
      type: "text",
      eyebrow: "Objective",
      title: "Why we're starting here",
      body: "Before adding artificial intelligence or new modules, we need an honest diagnosis of the current experience: where we're creating friction for wholesale buyers, which tasks cost them more effort than they should, and what's already solid and worth preserving.",
    },
    {
      type: "text",
      eyebrow: "Methodology",
      title: "How we're evaluating the application",
      list: [
        { label: "Heuristic review", body: "Expert evaluation of the key flows (catalog, order entry, checkout, account) against usability heuristics and B2B/wholesale patterns." },
        { label: "Critical flow walkthroughs", body: "End-to-end simulation of the most frequent tasks a wholesale buyer performs." },
        { label: "Responsive audit", body: "How the interface behaves across the devices and screen sizes relevant to how buyers actually use it." },
        { label: "Interviews / research", body: "To be added if the client can provide access to users or existing usage data." },
      ],
    },
    {
      type: "findings-grid",
      eyebrow: "Findings",
      title: "Navigation and information architecture",
      findings: [
        {
          id: "f1",
          severity: "high",
          effort: 2,
          example: true,
          title: "Example — Catalog categorization doesn't match wholesale buying criteria",
          description: "B2B buyers typically search by season/collection or by SKU code, not the way an end consumer would. If the current taxonomy doesn't reflect that, search becomes slow.",
          recommendation: "Validate the taxonomy with real buyers and, where relevant, offer alternative filters/sorting geared toward wholesale.",
        },
        {
          id: "f2",
          severity: "medium",
          effort: 1,
          example: true,
          title: "Example — Missing breadcrumbs in deep sections",
          description: "In nested screens (collection > category > product), it may not be clear where the user is or how to go back without losing applied filters.",
          recommendation: "Add persistent breadcrumbs that preserve filter state when navigating back.",
        },
        {
          id: "f3",
          severity: "low",
          effort: 1,
          example: true,
          title: "Example — Uninformative empty states",
          description: "When a search returns no results, the screen may not guide the user toward next steps (adjusting filters, contacting their rep, etc.).",
          recommendation: "Design actionable empty states with concrete suggestions.",
        },
      ],
    },
    {
      type: "findings-grid",
      eyebrow: "Findings",
      title: "Order entry and checkout flow",
      findings: [
        {
          id: "f4",
          severity: "high",
          effort: 3,
          example: true,
          title: "Example — Entering large orders by size/color is slow",
          description: "When a buyer needs to enter many SKU combinations (size × color) row by row, the process can become tedious compared to a grid-style or bulk-upload flow.",
          recommendation: "Evaluate a grid/matrix-style entry view, or a spreadsheet import, for high-volume orders.",
        },
        {
          id: "f5",
          severity: "medium",
          effort: 2,
          example: true,
          title: "Example — Stock and minimums aren't clear before checkout",
          description: "A buyer may reach the end of checkout without a clear view of real availability, order minimums, or estimated delivery dates per item.",
          recommendation: "Surface stock, minimums, and ETA at the same point where the purchase decision is made, not only at the end.",
        },
        {
          id: "f6",
          severity: "medium",
          effort: 1,
          example: true,
          title: "Example — No clear post-order confirmation",
          description: "The confirmation screen or email may not clearly summarize what was ordered, terms, and next administrative steps.",
          recommendation: "Redesign the confirmation as an actionable summary (PDF/email) with the full order detail.",
        },
      ],
    },
    {
      type: "matrix",
      eyebrow: "Synthesis",
      title: "Prioritization matrix",
      body: "Severity vs. estimated effort to resolve — to decide what to tackle first. Tap any point for detail.",
      axisX: ["Low effort", "Medium effort", "High effort"],
      axisY: "Severity ↑",
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
      eyebrow: "Chapter close",
      title: "From audit to <em>roadmap</em>",
      body: "With the findings prioritized, the next step is translating them into concrete improvements — many of which can be enhanced with embedded AI. That's Chapter 2.",
      cta: { label: "Go to Chapter 2", href: "#/chapter/2" },
    },
  ],
};
