// Chapter 1 — phase & finding detail data.
//
// This is the "promoted" version of the working case log in
// /ux-audit-log: the three methodology phases (see chapter1.js's
// Methodology section), each with the findings (audit cases) that belong
// to it, using the Evidence model structure agreed in
// documents/ux-assessment.md (Scope, Steps/Findings, Positive
// observations, Notes / follow-up needed — plus an optional Assessment
// boundary and next step for incomplete cases).
//
// A single case object can be referenced from more than one phase's
// `findings` array below (e.g. Case 01 touches all three methodology
// areas), and can carry more than one entry in its own `categories`
// array — a case's individual findings can relate to more than one
// category, so the case itself is listed under every category at least
// one of its findings belongs to, rather than being forced into a
// single bucket. js/pages.js reads `categories` as an array
// (`.includes(...)`), not a single value.
//
// A category id only ever needs to be unique within the phase that
// declares it (category pages always filter within one phase's own
// `findings` first), so the same flat `categories` array on a case can
// freely mix ids from more than one phase's category scheme — e.g. a
// case can carry both an Area 1 heuristic category (design-system,
// visibility-status, user-control-errors) and an Area 2 journey category
// (common-journeys, buyer-journeys, sales-rep-journeys, admin-journeys)
// at once, since each is only ever read while already scoped to its own
// phase. All three phases declare `categories` today: "heuristic-
// evaluation" (Area 1), "cognitive-walkthrough" (Area 2, grouping
// journeys by who performs them), and "responsive-accessibility" (Area
// 3) — see each phase's own comments below.
//
// A case's `categories` array (and `categorySummaries`) should only ever
// list a heuristic-quality category — Area 1's design-system /
// visibility-status / user-control-errors, and Area 3's responsive /
// accessibility — when that case actually has a No-Pass finding there.
// A clean/passing result for a category is simply left off the case
// entirely, rather than listed with a "Pass" status: these summary pages
// only ever surface categories with an actual issue. (Area 2's journey
// categories are the exception — every case that walks through a
// journey belongs there regardless of outcome, since they're about
// coverage, not findings.) A separate table listing every case's overall
// Pass/No-Pass status may be added later; not part of this file yet.
//
// This currently covers the two cases completed so far in this audit
// round (see /ux-audit-log/cases). Earlier cases from the previous
// round (`ux-audit-log-v1/`) are not part of this file.

import c01img01 from "../assets/ux-audit/login-screen-review/01-login-initial-state.jpg";
import c01img02 from "../assets/ux-audit/login-screen-review/02-empty-submit-no-feedback.jpg";
import c01img03 from "../assets/ux-audit/login-screen-review/03-invalid-email-redirected-to-signup-request.jpg";

import c02img01 from "../assets/ux-audit/landing-page-default-report/01-report-refresh-loading-state.jpg";
import c02img02 from "../assets/ux-audit/landing-page-default-report/02-report-clean-state-item-hover.jpg";
import c02img03 from "../assets/ux-audit/landing-page-default-report/03-nonsense-search-no-results-state.jpg";
import c02img04 from "../assets/ux-audit/landing-page-default-report/04-tie-search-phantom-no-results-bug.jpg";

const case01 = {
  id: "case-01",
  caseNumber: "01",
  title: "Login screen: cross-area review",
  status: "Issues found — no blocker on the primary path.",
  statusKind: "issue",
  // Area 1 categories this case's findings belong to (see file header):
  // Finding 1 and 2 are error-prevention gaps, Finding 3 is a visibility-
  // of-system-status gap. Also carries Area 2's Common Journeys — this
  // case covers the "Log in to the app" journey, shared by every role.
  // Area 3's checks (responsive, accessibility) turned up no issues for
  // this case, so per the summary-page rule (see the file header and
  // Area 3's categoriesIntro below) it isn't associated with either of
  // those categories here — only categories with an actual No-Pass
  // finding get listed.
  categories: ["user-control-errors", "visibility-status", "common-journeys"],
  // Category-scoped one-liners shown in a category page's row instead of
  // the general `summary` below, so this case reads correctly no matter
  // which of its categories it's listed under (see js/pages.js,
  // renderCategoryPage). Each one describes only the finding(s) that
  // actually belong to that category.
  categorySummaries: {
    "user-control-errors": "Submitting the login form empty gives no feedback at all, and a malformed email is accepted with no format check — both silent gaps at the app's single entry point.",
    "visibility-status": "The multi-second wait before the app decides what to do with an email has no status message, so a slow response can easily read as the screen being stuck.",
    "common-journeys": "Covers the \"Log in to the app\" journey: submitting the form empty or with a malformed email gives no useful feedback along the way, though nothing blocks a user who enters a correct, registered email.",
  },
  summary: "Submitting the login form empty or with a malformed email gives no useful feedback along the way, though nothing blocks a user who enters a correct, registered email.",
  scope: [
    { label: "Area", value: "All three methodology areas, applied together to a single screen — targeted heuristic evaluation, cognitive walkthrough, and a responsive/accessibility spot check." },
    { label: "Screen", value: "/login (the “Log in / Register” email-first screen), plus where it leads: /signuprequest (“Complete your registration”)." },
    { label: "Interaction boundary", value: "No login was completed and no account was accessed — this session has no test credentials for the portal. Testing was limited to the pre-authentication screen itself: submitting it empty, submitting a malformed string, submitting a valid-format but unregistered email, keyboard-only navigation, and a responsive check at tablet (768×1024) and mobile (375×812) viewports. No real signup request was submitted, to avoid creating one in Lilla P's system." },
    { label: "Session", value: "First case of this audit round." },
  ],
  blocks: [
    {
      type: "steps",
      heading: "Steps",
      items: [
        { text: "Opened the /login screen: a single Email field and a “Continue” button, plus a “Continue with Google” option.", image: c01img01, caption: "Login screen, initial state" },
        { text: "Clicked “Continue” with the Email field empty. Nothing happened: no inline error, no field highlight, no message near the button — and a check of network activity confirmed no request is even sent.", image: c01img02, caption: "Empty submit — no feedback of any kind" },
        { text: "Typed a string with no “@” and no domain (“notanemail”) and clicked “Continue”. The button showed a loading spinner for a few seconds with no status text, then redirected to /signuprequest (“Complete your registration”) with that same malformed string carried over into a disabled Email field.", image: c01img03, caption: "Invalid email redirected straight to “Complete your registration”" },
      ],
    },
    {
      type: "richtext",
      heading: "Finding 1 — Submitting the form empty gives no feedback at all",
      paragraphs: [
        "Clicking “Continue” with the Email field empty produces no visible change: no inline error, no field highlight, no message near the button. A check of network activity confirmed no request is even sent — the click is a complete no-op. A user who clicks Continue too early (a very likely first interaction on this screen) has no way to know why nothing happened.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Error prevention; visibility of system status." },
        { label: "Suggested direction", value: "Either disable “Continue” until the field has a plausible value, or show an inline “Enter your email to continue” message on click." },
      ],
    },
    {
      type: "richtext",
      heading: "Finding 2 — No email-format validation before submitting",
      paragraphs: [
        "Typing a string with no “@” and no domain (“notanemail”) is accepted by the form exactly like a real email: the button shows a loading state for several seconds, then the app redirects to /signuprequest (“Complete your registration”) with that same malformed string carried over verbatim into the (disabled/pre-filled) Email field of the registration form.",
        "There is no client-side check that the input even looks like an email before the app commits to a multi-second round trip and lands the user on an unrelated, longer form. A user who mistypes their email (a missing “@”, a stray space, a typo) is not told their input was invalid — they're dropped into a “request access” flow with a broken email address baked into a field they can't edit.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Error prevention; recognition, diagnosis, and recovery from errors." },
        { label: "Suggested direction", value: "Validate email format client-side before submitting, with an inline message, before ever reaching the “not found” / registration-request path." },
      ],
    },
    {
      type: "richtext",
      heading: "Finding 3 — The wait before redirecting has no status message",
      paragraphs: [
        "Between clicking “Continue” and landing on either the next login step or /signuprequest, the button shows a spinner for roughly 2–3 seconds with no accompanying text. Nothing tells the user what's happening (“Checking your email…” or similar), so a slower response could easily read as the screen being stuck rather than working — this is the same gap that let Finding 2 go unnoticed until the redirect actually happened.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Visibility of system status." },
        { label: "Suggested direction", value: "A short status label alongside the spinner would close this gap cheaply." },
      ],
    },
    {
      type: "list",
      heading: "Positive observations",
      items: [
        "The screen is minimal and focused: one field, one primary action for the first step, which keeps the initial decision simple.",
        "The Email field shows a clear, reasonably high-contrast focus outline when tabbed into.",
        "Full keyboard navigation works correctly: Tab reaches “Continue” and Enter submits the form from the Email field.",
        "The app is currently English-only by design, with no multi-language support — the Spanish text on the Google sign-in button (“Continuar con Google”) is that provider's own button label, not an inconsistency in Lilla P's UI.",
        "The “email not found → request access” pattern itself is a coherent, intentional design for a B2B portal without open self-signup — as opposed to a bug — since it behaved identically and predictably for both a malformed string and a valid-format but unregistered email.",
        "Tablet (768×1024), fully verified: both /login and the /signuprequest form render cleanly — no clipping, no overlapping fields, labels and buttons stay fully usable, and Submit is reachable after a short scroll. Repeating the empty-submit and invalid-email tests at this width gave identical results to desktop (Findings 1–3 above), so there's no tablet-specific regression.",
        "Mobile (375×812), layout confirmed clean: the login screen renders with the same clean, centered, non-clipped layout as tablet/desktop — no responsive breakage visible.",
      ],
    },
    {
      type: "richtext",
      heading: "Notes / follow-up needed",
      paragraphs: [
        "This case could not be extended past the email step: this session has no test credentials for the portal, so the password step (or whatever follows for a recognized email) and the authenticated app were not reached. A follow-up pass needs valid test credentials to continue the cognitive walkthrough past login.",
        "Interactive testing at the mobile (375px) width specifically — actually submitting the form — could not be completed in this session due to a tooling limitation with touch-emulated input at that viewport, so the invalid-email and empty-submit behaviors were visually inferred at that width from the clean static layout and from tablet matching desktop exactly, rather than directly re-confirmed.",
        "Worth a later check: does the same “no format validation” gap (Finding 2) exist on the registration form itself — e.g. would it accept “notanemail” as a final submission? Not tested here, to avoid submitting a real request to Lilla P's customer service team.",
      ],
    },
    {
      type: "richtext",
      heading: "Assessment boundary and next step",
      paragraphs: [
        "Area 3 (responsive/accessibility) is now substantially complete for this screen: tablet is fully verified with no differences from desktop, and mobile's static layout is clean, though its interactive behavior wasn't directly re-confirmed (see Notes). The remaining gap is Area 2: this case doesn't extend past the email step, since this session has no test credentials for the portal. Next step: get test credentials to walk through an actual login and continue the cognitive walkthrough into the authenticated app.",
      ],
    },
  ],
};

const case02 = {
  id: "case-02",
  caseNumber: "02",
  title: "Application landing page / Default report (Fall 2026)",
  status: "Issues found — a reproducible search defect, plus an icon-vocabulary consistency issue.",
  statusKind: "issue-high",
  // Finding 1 (phantom "no results" message) is a visibility-of-status
  // gap; Finding 2 (icon reuse) is a consistency-and-standards gap.
  categories: ["visibility-status", "design-system"],
  // See case01's categorySummaries above for why this exists: each entry
  // covers only the finding(s) that belong to that specific category.
  categorySummaries: {
    "visibility-status": "A “No results found” message renders unconditionally after every search, even directly beneath genuine matches, on the app's highest-traffic screen.",
    "design-system": "The same icon glyph is reused for different, conflicting actions across the screen — a star means both “favorite” and “select all”, and an X means both “unselect all” and “collapse this panel” — pointing to a missing icon vocabulary.",
  },
  summary: "A “No results found” message renders unconditionally after every search, even beneath genuine matches, on the first screen every sales rep or buyer sees after logging in.",
  scope: [
    { label: "Area", value: "Cognitive walkthrough of the post-login landing flow, plus a targeted heuristic evaluation of the search, header, and left-navigation panel controls on that same screen." },
    { label: "Screen", value: "/reports/linesheets?report_id=3771&utm_report_name=fall-2026 — the Fall 2026 linesheet report, which auto-executes and lands the user here immediately after login, with “Fall 2026” pre-selected in the left navigation's LINESHEETS list." },
    { label: "Interaction boundary", value: "Tested using the user's own real, already-authenticated Chrome session — no test credentials were needed for this case. Covered: a full page refresh; scrolling the full report end to end; a three-part search test; the header; the elements above the report grid; the left navigation panel's collapse/reopen; and the three “View” buttons. The header “Select All” / “Unselect All” confirmation dialog was seen but cancelled without confirming, to avoid applying a real bulk action. No product was added to a cart and no order was submitted. Desktop only — tablet and mobile are a follow-up." },
    { label: "Session", value: "Second case of this audit round." },
  ],
  blocks: [
    {
      type: "steps",
      heading: "Steps",
      items: [
        { text: "Refreshed the Fall 2026 report and confirmed it re-executes cleanly, with a clear loading state.", image: c02img01, caption: "Report refresh / loading state" },
        { text: "Scrolled the full report end to end, and inspected a product card's own per-item favorite star on hover, for later comparison against the header icons.", image: c02img02, caption: "Clean report state, per-item favorite star on hover" },
        { text: "Searched a nonsense string (“xbxbccbnxnbsjdsjd”) to confirm the report correctly shows no real matches.", image: c02img03, caption: "Nonsense-string search — correct no-results state" },
        { text: "Cleared the search and ran a clean, single search for “Tie”. The real match (“Tie Front Tee”) appeared correctly — but directly beneath it, a “No results found in this report.” block also rendered, contradicting the results shown right above it.", image: c02img04, caption: "“Tie” search: real result shown alongside a phantom “No results found” block" },
        { text: "Repeated the same search with “Knit”: same real-match-plus-phantom-message pattern. Cleared the search box afterward and confirmed the original, unfiltered Fall 2026 report was fully restored." },
      ],
    },
    {
      type: "richtext",
      heading: "Finding 1 — A “No results found” message always renders after search results, even when real matches are shown above it",
      paragraphs: [
        "Searching “Tie” correctly filters the report down to matching products (e.g. “Tie Front Tee” is shown). But directly below those real, correct results, the UI also renders a “No results found in this report.” block — on the same results list, at the same time as genuine matches.",
        "This isn't limited to edge cases: a clean, single search for “Tie” (with no prior no-results search run first) reproduces it immediately, so it isn't leftover state from a previous search. The block appears to render unconditionally at the end of every search-results list, regardless of whether the list above it actually has content.",
        "A user performing the single most common action on this screen — searching within the current season's report — is shown a message telling them their search found nothing, directly underneath the results proving that it did. That's a direct contradiction on screen at the same time, on the app's highest-traffic view.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Visibility of system status; error prevention (a false negative status message here is arguably worse than no message, since it actively misleads)." },
        { label: "Suggested direction", value: "The “No results found in this report.” block should only render when the results list is actually empty — this reads as a conditional check that's missing or inverted somewhere in the search-results rendering logic, not a design decision." },
      ],
    },
    {
      type: "richtext",
      heading: "Finding 2 — The same icon glyph is reused for different, sometimes conflicting actions across the screen",
      paragraphs: [
        "Three separate controls on this screen reuse a glyph that already carries an established meaning elsewhere on the same screen: the header star icon (next to “Show Favorites”) triggers “Select All”, not “favorite” — yet each individual product card has its own, separate, genuine per-item favorite star, using the identical glyph for a different action. The header X icon, right next to that star, triggers “Unselect All” — while the same X glyph, in the opposite corner of the header (before the logo), is also the control used to collapse the left navigation panel, which then turns into a hamburger icon to reopen it.",
        "None of these three controls is broken — each does what it does, consistently, once you know what it does. The panel-collapse control itself is visible and works correctly in both directions — a real, findable icon in the top-left corner, not a hidden hit target — but neither X nor hamburger is the conventional choice for that job: X commonly signals “close/dismiss this content entirely” rather than “temporarily collapse a persistent panel”, and hamburger commonly signals “open a menu” rather than “restore the panel you just collapsed”. Taken together, this points to the app not yet having a settled, consistent icon vocabulary.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Consistency and standards; match between system and the real world (icon meaning should map predictably to its action, and not be reused for unrelated ones)." },
        { label: "Suggested direction", value: "Define a small, consistent icon vocabulary for this app: reserve the star exclusively for favoriting, use a distinct glyph (a checkbox or grid-select icon) for bulk selection, and use a chevron or arrow — not X/hamburger — for a persistent panel's collapse/expand control." },
      ],
    },
    {
      type: "list",
      heading: "Positive observations",
      items: [
        "Refreshing the page correctly re-executes the report and refreshes its contents, with a clear loading state in between — nothing about the reload reads as broken or stuck.",
        "The full report can be scrolled and traversed end to end with no dead zones, cut-off content, or broken lazy-loading. The breadcrumb and date/collection chip above the grid track scroll position live, which is a genuinely useful orientation cue in a long report.",
        "Search itself works correctly at the data level: a nonsense string correctly returns a report with no real matches; “Tie” and “Knit” both correctly filter to the right matching products; and clearing the search box correctly and fully restores the original, unfiltered report. Finding 1 is a display defect layered on top of search, not a defect in the search/filter logic itself.",
        "The header's account-name menu is a well-built, purposeful “Select your customer” panel for sales reps switching between buyer accounts — not a generic/broken account menu, as its label might suggest at first glance.",
        "The “Show Favorites” toggle works correctly in both directions and has a good, clear empty state when no favorites are set.",
        "All three “View” buttons work correctly with no bugs: the default photo grid, the grid-with-inventory-table, and the full-width list view all render their expected content correctly when switched between.",
        "Left navigation panel collapse and reopen both work correctly in either direction, via the X/hamburger control in the top-left corner before the logo (see Finding 2 for a note on that control's icon choice).",
      ],
    },
    {
      type: "richtext",
      heading: "Notes / follow-up needed",
      paragraphs: [
        "This case was scoped to desktop only — tablet (768px) and mobile (375px) behavior for this same screen and its search/panel controls have not been tested yet and should get their own follow-up pass, the same way Case 01 was closed out.",
        "The header “Select All” / “Unselect All” dialog was seen but deliberately cancelled without confirming, to avoid applying a real bulk action to the report during testing. What “Select All” is actually for and whether it behaves correctly when confirmed is untested.",
        "Worth checking later: does the same phantom “No results found” block appear on other reports (a past season, Custom Linesheets), or is it specific to this report/template?",
      ],
    },
  ],
};

export default [
  {
    id: "heuristic-evaluation",
    chapterIndex: 1,
    eyebrow: "Area 1",
    title: "Targeted heuristic evaluation",
    intro: "AI-assisted review of the key flows against a focused set of usability principles — consistency and standards, visibility of system status, error prevention, and error recovery — rather than an exhaustive, all-heuristics checklist.",
    // Longer explanation of the work done in this phase, shown on the
    // summary page just above the categories. Adapted from
    // documents/ux-assessment.md, "Area 1 — Targeted heuristic
    // evaluation" (Rationale, What to inspect, AI contribution — Outputs
    // omitted, since that's redundant with the categories/findings
    // below). The Rationale's opening paragraph adds an explicit mention
    // of AI's role, per Gastón's request.
    explainer: [
      {
        type: "richtext",
        heading: "Rationale",
        paragraphs: [
          "This assessment uses Nielsen's heuristics as its diagnostic framework, with AI carrying out the hands-on inspection under the UX Assessment Lead's direction. A heuristic evaluation is an expert inspection method in which evaluators — AI, in this case — review an interface against recognized usability principles.",
          "The complete set includes principles such as visibility of system status, user control and freedom, consistency and standards, error prevention, and helping users recognize, diagnose, and recover from errors.",
        ],
      },
      {
        type: "list",
        heading: "What to inspect — Consistency and standards",
        items: [
          "navigation labels and breadcrumbs",
          "page titles and headings",
          "button labels and action states",
          "icon meaning and labeling",
          "modal and drawer behavior",
          "forms, tables, and repeated controls",
          "status, empty, loading, and success messages",
          "terminology, capitalization, and spelling",
          "repeated responsive patterns",
          "visual patterns that affect comprehension or confidence",
        ],
        paragraphs: [
          "The absence of a formal Design System or component library makes this a particularly relevant focus. The assessment should prioritize recurring patterns and meaningful inconsistencies rather than produce a complete visual inventory.",
        ],
      },
      {
        type: "list",
        heading: "What to inspect — Error prevention, feedback, and recovery",
        ordered: true,
        items: [
          "Does the system prevent the error where possible?",
          "Does it clearly explain what happened?",
          "Does it preserve the user's work?",
          "Does it offer an obvious next action?",
          "Does the visible state match the actual system state?",
        ],
        paragraphs: [
          "Inspect silent failures, contradictory messages, stale or empty states, unexpected redirects, duplicate or zero-quantity records, lost input, unclear disabled actions, generic errors, and recovery after checkout or payment problems.",
        ],
      },
      {
        type: "list",
        heading: "AI contribution",
        items: [
          "inspect repeated patterns across screens",
          "compare labels, states, and component behavior",
          "identify inconsistencies while navigating",
          "detect contradictions between controls, messages, and resulting data",
          "capture screenshots and reproduction steps",
          "group related observations",
          "draft consistency and error-handling findings in English",
        ],
      },
    ],
    // Short title + intro shown just above the category table, framing
    // it as AI's grouping of this phase's issues.
    categoriesIntro: {
      title: "Finding Summary",
      body: "AI grouped the issues found during this evaluation into the three categories below, based on the usability principle each one relates to most closely. A case with findings that touch more than one principle is listed under every category it belongs to — not forced into a single bucket. Each category opens into its own findings, with the observed evidence and a suggested direction for each one.",
    },
    // Categories group this phase's findings by which of Area 1's
    // heuristic principles they primarily relate to (see
    // documents/ux-assessment.md, Area 1 — What to inspect). Each finding
    // above declares which of these it belongs to via its `categories`
    // array (a finding can belong to more than one).
    categories: [
      {
        id: "design-system",
        title: "Design System",
        description: "Findings about consistency and standards: whether components, labels, layouts, and interaction patterns behave the same way across the application. These point toward the value of a defined design system and shared component library.",
      },
      {
        id: "visibility-status",
        title: "Visibility & Status",
        description: "Findings about whether the interface clearly and accurately communicates what state the system is in — data shown, availability, delivery, or access — so buyers can trust what they see and act on it with confidence.",
      },
      {
        id: "user-control-errors",
        title: "User Control & Errors",
        description: "Findings about how well the interface prevents mistakes, explains what happened when something goes wrong, and lets buyers recover, undo, or continue without losing their work.",
      },
    ],
    // Closing highlight: calls out the priority finding for this phase —
    // the missing Design System — with Gastón's justification text.
    // `categoryId` ties its accent color to the matching category chip.
    priorityHighlight: {
      eyebrow: "Priority highlight",
      title: "The case for a shared Design System",
      body: "Establishing a shared design system would provide the foundation for a more consistent, scalable, and maintainable B2B experience. It would align visual decisions across navigation, forms, tables, dialogs, states, and responsive behaviors, while giving design and development teams a common source of truth. Beyond improving coherence for users, a design system would reduce duplicated decisions, accelerate future delivery, support accessibility, and make it easier to evolve the application as new modules are introduced.",
      categoryId: "design-system",
    },
    findings: [case01, case02],
  },
  {
    id: "cognitive-walkthrough",
    chapterIndex: 1,
    eyebrow: "Area 2",
    title: "Key journeys and cognitive walkthrough",
    intro: "A compact experience map of this area's key journeys, grouped by who performs them.",
    explainer: [
      {
        type: "richtext",
        heading: "Experience map",
        paragraphs: [
          "The experience map is a compact record of this app's key journeys — not detailed personas or complete business-process documentation. It groups those journeys into four categories, by who performs them:",
        ],
      },
      {
        type: "list",
        items: [
          "<b>Common Journeys</b> — shared by every authenticated role.",
          "<b>Buyer Journeys</b> — a wholesale buyer's own flows.",
          "<b>Sales Rep Journeys</b> — everything a buyer can do, performed on their behalf, plus a few journeys unique to the role.",
          "<b>Admin Journeys</b> — platform administration.",
        ],
      },
      {
        type: "list",
        intro: ["For each journey, capture:"],
        items: [
          "user goal",
          "main entry point",
          "key steps",
          "important system states",
          "principal risks or uncertainty points",
          "review priority",
        ],
      },
      {
        type: "richtext",
        heading: "Key Journeys",
      },
      {
        type: "table",
        grouped: true,
        rows: [
          ["<b>Common Journeys</b>", "Log in to the app"],
          ["", "Register for the app"],
          ["<b>Buyer Journeys</b>", "Linesheet / catalog browsing"],
          ["", "Adding items to the cart"],
          ["", "Placing an order"],
          ["", "Order tracking"],
          ["", "Payments"],
          ["", "Account preferences"],
          ["<b>Sales Rep Journeys (*)</b>", "Select a customer"],
          ["", "Create and share custom linesheets/reports"],
          ["<b>Admin Journeys</b>", "Manage users"],
          ["", "Manage reports"],
          ["", "Activity audit"],
        ],
        footnote: "(*) Every Buyer journey above also applies to Sales Reps, performed on behalf of the selected customer.",
      },
      {
        type: "list",
        heading: "AI contribution",
        items: [
          "execute the selected journey step by step",
          "record navigation paths and state changes",
          "compare expected and observed outcomes",
          "verify important results against the cart or another source of truth",
          "capture screenshots at meaningful moments",
          "identify unexpected routes, hidden controls, and misleading feedback",
          "structure each walkthrough as a consistent case record",
          "suggest related journeys or untested state variations",
        ],
      },
    ],
    // Short title + intro shown just above the category table, framing
    // it as the experience map's grouping of this area's journeys — same
    // pattern as Area 1's Finding Summary (see categoriesIntro there).
    categoriesIntro: {
      title: "Finding Summary",
      body: "The experience map groups this area's key journeys into the four categories below, based on which role primarily performs them. Each category opens into its own list of journeys and the cases that cover them — a journey shared across roles is listed under Common Journeys rather than repeated under each one.",
    },
    // Categories group Area 2's journeys (and, in turn, the case
    // walkthroughs that cover them) by who performs them, per the
    // experience map. Each finding above declares which of these it
    // belongs to via its own `categories` array (a finding can belong to
    // more than one) — see phases.js's file header. Journeys themselves,
    // and which existing cases map to which category, are still being
    // defined; this scaffold is deliberately in place ahead of that.
    categories: [
      {
        id: "common-journeys",
        title: "Common Journeys",
        description: "Journeys shared by every authenticated role — Sales Reps, buyers, and admins alike — such as logging in or landing on the default report.",
      },
      {
        id: "buyer-journeys",
        title: "Buyer Journeys",
        description: "Journeys specific to a wholesale buyer browsing, ordering, and managing their own account.",
      },
      {
        id: "sales-rep-journeys",
        title: "Sales Rep Journeys",
        description: "Journeys specific to a Sales Rep acting on behalf of a buyer account — for example, selecting a customer before placing an order.",
      },
      {
        id: "admin-journeys",
        title: "Admin Journeys",
        description: "Journeys specific to admin users managing accounts, reports, and platform configuration.",
      },
    ],
    findings: [case01, case02],
  },
  {
    id: "responsive-accessibility",
    chapterIndex: 1,
    eyebrow: "Area 3",
    title: "Responsive and accessibility spot checks",
    intro: "A targeted look at representative screen sizes and high-risk interface patterns — not a full responsive audit or a WCAG conformance assessment, but a check on where the experience breaks down.",
    explainer: [
      {
        type: "list",
        heading: "Scope",
        items: [
          "clipped or disappearing content",
          "page titles that become unreadable or abbreviated",
          "navigation and account actions that become unavailable",
          "tables that cannot be meaningfully used on small screens",
          "drawers and overlays that obscure context",
          "touch target size",
          "visible focus and keyboard access where observable",
          "contrast and reliance on color",
          "icon-only controls and missing labels",
          "responsive behavior of forms, errors, and confirmation states",
        ],
      },
      {
        type: "list",
        heading: "AI contribution",
        items: [
          "navigate the same journey at selected viewport sizes",
          "compare screenshots across viewports",
          "detect clipping, overflow, disappearing actions, and inconsistent layout behavior",
          "identify repeated responsive and accessibility patterns",
          "capture evidence and draft recommendations",
        ],
      },
    ],
    // Same Finding Summary treatment as Areas 1 and 2 — see those phases'
    // own comments. Area 3 splits into just two categories rather than
    // three or four.
    categoriesIntro: {
      title: "Finding Summary",
      body: "This area's checks are grouped into the two categories below. Each category opens into its own list of findings and the cases that cover them.",
    },
    categories: [
      {
        id: "responsive",
        title: "Responsive",
        description: "Whether content displays correctly across three representative viewport widths — desktop, tablet, and mobile.",
      },
      {
        id: "accessibility",
        title: "Accessibility",
        description: "Targeted accessibility checks against high-risk patterns — not an exhaustive review against the WCAG guidelines.",
      },
    ],
    findings: [case01],
  },
];
