// Chapter 1 — UX Audit
//
// This chapter's own sections are the cover, objective, and methodology
// overview. The methodology's three phases (see the "list" below) link
// out to /data/phases.js, which holds the aggregated + detailed findings
// for each phase (the "promoted" version of /ux-audit-log), rendered by
// js/pages.js instead of this file's section-based flow.

export default {
  id: "ux-audit",
  index: 1,
  status: "active", // active | upcoming
  title: "UX Audit",
  shortTitle: "UX Audit",
  summary: "An AI-assisted diagnosis of the current B2B experience: what’s working, what’s causing friction, and what’s worth prioritizing.",
  accentVar: "--accent",

  sections: [
    {
      type: "cover",
      eyebrow: "Chapter 01",
      title: "<em>UX</em> audit of the current B2B platform",
      meta: [
        { label: "Client", value: "Lilla P — Wholesale" },
        { label: "Scope", value: "B2B Portal" },
        { label: "Status", value: "In progress" },
      ],
    },
    {
      type: "text",
      eyebrow: "Objective",
      title: "Why we're starting here",
      body: [
        "The B2B Portal is already a central part of the daily work of Sales Reps, wholesale buyers, Sales Managers, and admin users. Before introducing new functionality — and eventually building the broader Product Platform — we need a clear understanding of how the current experience performs: where it creates friction, which tasks require unnecessary effort, and what is already working well and should be preserved.",
        "We are using AI tools, guided by a UX Assessment Lead, to accelerate and simplify this evaluation. AI helps us navigate key flows, compare recurring patterns, capture evidence, and synthesize observations more efficiently and consistently.",
        "This diagnosis is valuable in its own right. It can help improve the flows users depend on today, regardless of which new capabilities are ultimately built on top of the B2B Portal.",
      ],
    },
    {
      type: "text",
      eyebrow: "Methodology",
      title: "How we're evaluating the application",
      body: "We’re proposing a focused methodology carried out in three areas, combining AI-assisted exploration and analysis with the direction of a UX Assessment Lead, who defines the scope, guides each area, and validates the findings, while AI helps accelerate navigation, evidence capture, comparison, and synthesis throughout the assessment.",
      list: [
        {
          label: "Targeted heuristic evaluation",
          body: "AI-conducted, UX Assessment Lead-guided review of the key flows using Nielsen’s heuristics as the diagnostic framework. The evaluation focuses on a targeted set of principles — consistency and standards, visibility of system status, error prevention, and error recovery — rather than applying an exhaustive all-heuristics checklist.",
          href: "#/chapter/1/phase/heuristic-evaluation",
          // Trying this out for Area 1 only, per Gastón's request — same
          // category chips as the phase's own Finding Summary table.
          categoriesNote: "Findings are automatically grouped by AI into these 3 categories:",
          // Each chip links straight to that category's findings — not
          // to the phase page above, per Gastón's request.
          categories: [
            { id: "design-system", title: "Design System", href: "#/chapter/1/phase/heuristic-evaluation/category/design-system" },
            { id: "visibility-status", title: "Visibility & Status", href: "#/chapter/1/phase/heuristic-evaluation/category/visibility-status" },
            { id: "user-control-errors", title: "User Control & Errors", href: "#/chapter/1/phase/heuristic-evaluation/category/user-control-errors" },
          ],
        },
        {
          label: "Key journeys and cognitive walkthrough",
          body: "A compact map of the main buyer journeys (browsing, order entry, cart, account, administration), followed by guided walkthroughs of representative tasks to check whether the next step is always clear, understandable, and recoverable.",
          href: "#/chapter/1/phase/cognitive-walkthrough",
        },
        {
          label: "Responsive and accessibility spot checks",
          body: "A targeted look at representative screen sizes and high-risk interface patterns — not a full responsive audit or a WCAG conformance assessment, but a check on where the experience breaks down.",
          href: "#/chapter/1/phase/responsive-accessibility",
        },
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
