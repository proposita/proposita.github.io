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
// This currently covers the three cases completed so far in this audit
// round (see /ux-audit-log/cases). Earlier cases from the previous
// round (`ux-audit-log-v1/`) are not part of this file.

import c01img01 from "../assets/ux-audit/login-screen-review/01-login-initial-state.jpg";
import c01img02 from "../assets/ux-audit/login-screen-review/02-empty-submit-no-feedback.jpg";
import c01img03 from "../assets/ux-audit/login-screen-review/03-invalid-email-redirected-to-signup-request.jpg";

import c02img01 from "../assets/ux-audit/landing-page-default-report/01-report-refresh-loading-state.jpg";
import c02img02 from "../assets/ux-audit/landing-page-default-report/02-report-clean-state-item-hover.jpg";
import c02img03 from "../assets/ux-audit/landing-page-default-report/03-nonsense-search-no-results-state.jpg";
import c02img04 from "../assets/ux-audit/landing-page-default-report/04-tie-search-phantom-no-results-bug.jpg";

import c03img01 from "../assets/ux-audit/navigation-structure/01-left-nav-panel-default-state.jpg";
import c03img02 from "../assets/ux-audit/navigation-structure/02-user-menu-recent-customers-populated.jpg";
import c03img03 from "../assets/ux-audit/navigation-structure/03-select-customer-modal-on-my-account.jpg";
import c03img04 from "../assets/ux-audit/navigation-structure/04-my-account-sales-orders-for-selected-customer.jpg";
import c03img05 from "../assets/ux-audit/navigation-structure/05-administration-manage-users.jpg";
import c03img06 from "../assets/ux-audit/navigation-structure/06-user-menu-open-generic-avatar-icon.jpg";
import c03img07 from "../assets/ux-audit/navigation-structure/07-user-menu-closed-alan-jalife-text-desktop.jpg";
import c03img08 from "../assets/ux-audit/navigation-structure/08-recent-customers-loading-spinner.jpg";
import c03img09 from "../assets/ux-audit/navigation-structure/09-my-account-stale-customer-data-after-switch.jpg";
import c03img10 from "../assets/ux-audit/navigation-structure/10-my-account-correct-data-after-reload.jpg";

import c04img01 from "../assets/ux-audit/manage-users/01-manage-users-list-default-state.jpg";
import c04img02 from "../assets/ux-audit/manage-users/02-manage-users-employee-sales-rep-search-results.jpg";
import c04img03 from "../assets/ux-audit/manage-users/03-manage-users-actions-modal-loading-spinner.jpg";
import c04img04 from "../assets/ux-audit/manage-users/04-manage-users-order-entry-access-checkbox-ambiguous.jpg";

import c05img01 from "../assets/ux-audit/manage-reports/01-manage-reports-list-default-state.jpg";
import c05img02 from "../assets/ux-audit/manage-reports/02-manage-reports-actions-dropdown-menu.jpg";
import c05img03 from "../assets/ux-audit/manage-reports/03-manage-reports-image-audit-loading-state.jpg";
import c05img04 from "../assets/ux-audit/manage-reports/04-manage-reports-image-audit-results-fall-2026.jpg";
import c05img05 from "../assets/ux-audit/manage-reports/05-manage-reports-price-audit-checkboxes-ambiguous.jpg";
import c05img06 from "../assets/ux-audit/manage-reports/06-manage-reports-price-audit-single-checkbox-state.jpg";
import c05img07 from "../assets/ux-audit/manage-reports/07-manage-reports-sharing-options-modal.jpg";

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
  status: "Issues found — a reproducible search defect, an icon-vocabulary consistency issue, plus two smaller viewport-specific issues found in a tablet/mobile follow-up.",
  statusKind: "issue-high",
  // Finding 1 (phantom "no results" message) is a visibility-of-status
  // gap; Finding 2 (icon reuse) is a consistency-and-standards gap.
  // Findings 3 and 4 (tablet/mobile follow-up) are responsive gaps.
  categories: ["visibility-status", "design-system", "responsive"],
  // See case01's categorySummaries above for why this exists: each entry
  // covers only the finding(s) that belong to that specific category.
  categorySummaries: {
    "visibility-status": "A “No results found” message renders unconditionally after every search, even directly beneath genuine matches, on the app's highest-traffic screen.",
    "design-system": "The same icon glyph is reused for different, conflicting actions across the screen — a star means both “favorite” and “select all”, and an X means both “unselect all” and “collapse this panel” — pointing to a missing icon vocabulary.",
    "responsive": "Tablet (768px) matches desktop almost exactly, but the three “View” buttons stop producing any visible difference. Mobile (375px) adapts its layout sensibly, but the header's “…” menu shows a duplicated “Show Favorites” toggle.",
  },
  summary: "A “No results found” message renders unconditionally after every search, even beneath genuine matches, on the first screen every sales rep or buyer sees after logging in.",
  scope: [
    { label: "Area", value: "Cognitive walkthrough of the post-login landing flow, plus a targeted heuristic evaluation of the search, header, and left-navigation panel controls on that same screen." },
    { label: "Screen", value: "/reports/linesheets?report_id=3771&utm_report_name=fall-2026 — the Fall 2026 linesheet report, which auto-executes and lands the user here immediately after login, with “Fall 2026” pre-selected in the left navigation's LINESHEETS list." },
    { label: "Interaction boundary", value: "Desktop pass tested using the user's own real, already-authenticated Chrome session — no test credentials were needed for this case. Covered: a full page refresh; scrolling the full report end to end; a three-part search test; the header; the elements above the report grid; the left navigation panel's collapse/reopen; and the three “View” buttons. The header “Select All” / “Unselect All” confirmation dialog was seen but cancelled without confirming, to avoid applying a real bulk action. No product was added to a cart and no order was submitted." },
    { label: "Viewports", value: "Desktop (this session), plus tablet (768×1024) and mobile (375×812), both added in a later follow-up session using Claude's built-in browser with viewport emulation, in the same authenticated test environment. See Steps and Notes below for how the mobile pass was run." },
    { label: "Session", value: "Second case of this audit round; the tablet/mobile follow-up was a later session." },
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
      type: "steps",
      heading: "Steps — tablet follow-up (768×1024)",
      items: [
        { text: "Refreshed the Fall 2026 report at tablet width: same clean loading state as desktop, and the layout renders with no clipping as the page is scrolled end to end — the breadcrumb keeps tracking scroll position live." },
        { text: "Hovering a product card still reveals its favorite and expand icons, since 768px keeps mouse-style hover rather than switching to touch." },
        { text: "Repeated the nonsense-string, “Tie”, and “Knit” searches: the correct no-results state, and the same phantom “No results found in this report.” block beneath real matches, both reproduce identically to desktop — confirming Finding 1 isn't tied to a specific viewport." },
        { text: "Opened the header's “Select All” confirmation dialog (cancelled without confirming) and collapsed/reopened the left navigation panel — both work correctly; collapsing the panel also reflows the report from one column to two, making use of the freed width." },
        { text: "Switched between the three “View” buttons and found no visible difference between them at this width (see Finding 3)." },
      ],
    },
    {
      type: "steps",
      heading: "Steps — mobile follow-up (375×812)",
      items: [
        { text: "Repeated the same pass at mobile width jointly with the UX Assessment Lead (see Notes): the report loads cleanly, the breadcrumb abbreviates to “FL26”, and each product card's favorite/expand icons show persistently instead of only on hover — expected for a touch interface." },
        { text: "At this width the header's Show Favorites / Select All / Unselect All controls collapse into a “…” overflow menu. Opening it surfaced a display issue of its own (see Finding 4)." },
        { text: "Searched “Tie” and “Knit”: the phantom “No results found in this report.” block reproduces exactly as at desktop and tablet, with no clipping in the message itself." },
        { text: "The “Select All” confirmation dialog opens cleanly and was cancelled without confirming. The hamburger menu opens a full-screen navigation drawer with no clipping, correctly highlighting the active report." },
        { text: "The “…” menu also surfaced an “Edit this report” option (Save / Save as / Delete / Publish Report, plus a remove control on every row) not previously noted in this case. Out of scope here — not tested, to avoid modifying real report data (see Notes)." },
      ],
    },
    {
      type: "richtext",
      heading: "Finding 3 — At tablet width, the three “View” buttons no longer look different",
      paragraphs: [
        "On desktop, the “View” toggle switches between three genuinely different layouts: a photo grid, a grid with an inline inventory table, and a full-width list. At tablet width (768px), switching between all three buttons produces the exact same layout: a single-column card per product, with color/size quantities only available by tapping that card's own expand caret.",
        "None of the three is broken on its own — the single-column layout with an expandable inventory table is clean and usable — but the control itself stops doing anything, which is confusing for a Sales Rep who deliberately picks “Extended list view” expecting to see every item's inventory at once, the way it works on desktop, without needing to expand each card individually.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Visibility of system status; consistency and standards (a control that produces no visible effect makes the interface's own state hard to trust)." },
        { label: "Suggested direction", value: "Either give “View” its own responsive treatment at tablet width (e.g. “Extended list view” could pre-expand every card's inventory table), or hide/disable the toggle at widths where it has no effect, so the control doesn't imply choices that aren't really available." },
      ],
    },
    {
      type: "richtext",
      heading: "Finding 4 — The mobile “…” menu shows “Show Favorites” twice",
      paragraphs: [
        "At mobile width, the header's Show Favorites toggle, Select All, and Unselect All controls move into a “…” overflow menu, reached by tapping the icon next to the breadcrumb. Opening it shows two separate “Show Favorites” toggle rows, one directly below the other, before Select all / Unselect all / Edit this report.",
        "Both toggles do control the same thing — the UX Assessment Lead confirmed either one turns favorites-only view on and off — so this isn't a broken control, just a duplicated one. A likely cause: the app renders both a mobile and a desktop version of this menu's contents into the same overflow panel at this width, instead of showing only the one that applies.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Consistency and standards; aesthetic and minimalist design (redundant, identical controls in the same menu read as a mistake, not a deliberate choice)." },
        { label: "Suggested direction", value: "Remove the duplicate row — only one “Show Favorites” toggle should render inside the “…” menu at this width." },
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
        "All three “View” buttons work correctly with no bugs on desktop: the default photo grid, the grid-with-inventory-table, and the full-width list view all render their expected content correctly when switched between (see Finding 3 for how this changes at tablet width).",
        "Left navigation panel collapse and reopen both work correctly in either direction, via the X/hamburger control in the top-left corner before the logo (see Finding 2 for a note on that control's icon choice).",
        "Tablet (768×1024) matches desktop almost exactly: the report loads cleanly, scrolls with no clipping, hover still reveals per-item icons, and collapsing the left navigation panel correctly reflows the report from one column to two.",
        "Mobile (375×812) adapts sensibly: the breadcrumb abbreviates to fit (“FL26” for “Fall 26”), per-item icons show persistently instead of needing hover, the hamburger menu opens a clean full-screen navigation drawer, and the “Select All” confirmation dialog renders correctly with no clipping.",
      ],
    },
    {
      type: "richtext",
      heading: "Notes / follow-up needed",
      paragraphs: [
        "This case is now closed across all three target viewports: desktop (this session), tablet, and mobile (both added in a later follow-up session). Findings 1 and 2 reproduce identically at every width tested; Findings 3 and 4 are specific to tablet and mobile respectively.",
        "The mobile pass was run jointly with the UX Assessment Lead: a tooling limitation prevented Claude from tapping controls directly at 375px width in this session's browser (clicks reliably timed out under touch emulation, independent of the app itself), so the UX Assessment Lead performed each tap in Claude's built-in browser and shared the result for Claude to inspect and document.",
        "The header “Select All” / “Unselect All” dialog was again seen but deliberately cancelled without confirming, at every width, to avoid applying a real bulk action to the report during testing. What “Select All” is actually for and whether it behaves correctly when confirmed remains untested.",
        "The mobile “…” menu also surfaced an “Edit this report” screen (Save / Save as / Delete / Publish Report, plus a remove control on every row) that hadn't been noticed in the original desktop pass. It wasn't tested, to avoid modifying real report data, and its scope lines up with the “Create and share custom linesheets/reports” Sales Rep journey noted in the Area 2 experience map — worth a dedicated case of its own later, rather than folding it into this one.",
        "Worth checking later: does the same phantom “No results found” block appear on other reports (a past season, Custom Linesheets), or is it specific to this report/template?",
      ],
    },
  ],
};

const case03 = {
  id: "case-03",
  caseNumber: "03",
  title: "Navigation structure: left panel & user menu",
  status: "Issues found — a misleading section label, a data-accuracy bug on the customer-account screen, and three lower-priority consistency issues. Confirmed consistent across desktop, tablet, and mobile.",
  statusKind: "issue-high",
  // Finding 1 (MY ACCOUNT mislabeling) and Finding 4 (avatar/icon identity
  // change) are consistency-and-standards gaps; Finding 2 (stale customer
  // data after a switch) and Finding 3 (Recent customers spinner) are
  // visibility-of-status gaps; Finding 5 (drawer close control) is both a
  // consistency gap and a user-control-and-freedom gap (no toggle-to-close,
  // though a working backdrop fallback exists). Also carries Area 2's Sales
  // Rep Journeys AND Buyer Journeys — this case's search-box test covers
  // "Select a customer", and is where Finding 2 (the customer-switch bug)
  // was actually found. That journey isn't Sales-Rep-exclusive: per the UX
  // Assessment Lead, a Buyer's app account belongs to a NetSuite contact,
  // not a customer directly, and a contact tied to more than one customer
  // must select which one to act on too — see the Key Journeys table's own
  // footnote below. Area 3's tablet/mobile follow-up found no
  // viewport-specific issues, so per the summary-page rule this case isn't
  // tagged with "responsive" or "accessibility" here.
  categories: ["design-system", "visibility-status", "user-control-errors", "sales-rep-journeys", "buyer-journeys"],
  categorySummaries: {
    "design-system": "“MY ACCOUNT” in the left panel is actually the selected customer's account, not the Sales Rep's own, and the top-right user control changes its own visual identity between its open and closed states.",
    "visibility-status": "Switching the selected customer can leave the MY ACCOUNT screen showing the previous customer's real address and orders under the new customer's name — the “Recent customers” list also loads behind a loading spinner that's easy to miss.",
    "user-control-errors": "The user drawer's own close control sits at the opposite corner from where the drawer was opened, and re-clicking the trigger doesn't close it — though clicking the dimmed backdrop does, so a working fallback exists.",
    "sales-rep-journeys": "Covers “Select a customer”: picking a customer via the search box works correctly and searches the full customer base, but switching customers can leave the MY ACCOUNT screen showing the previous customer's real data under the new customer's name until the page is reloaded.",
    "buyer-journeys": "Covers “Select a customer” for a Buyer contact linked to more than one customer: the same search-box selection was tested here, and works correctly, but switching customers can leave the MY ACCOUNT screen showing the previous customer's real data under the newly selected one's name until the page is reloaded.",
  },
  summary: "“MY ACCOUNT” opens the selected customer's account, not the Sales Rep's own, and switching customers can leave that same screen showing the previous customer's real address and orders under the new customer's name.",
  scope: [
    { label: "Area", value: "Targeted heuristic evaluation of the left navigation panel (present app-wide) and the top-right user menu: structure, grouping, label clarity, and customer-switching behavior, both expanded and collapsed, across desktop, tablet, and mobile." },
    { label: "Screen", value: "App-wide — the left navigation panel and the “Alan Jalife” user menu are present on every authenticated screen; evaluated from the Fall 2026 report and the Administration and MY ACCOUNT pages it links to." },
    { label: "Interaction boundary", value: "Desktop pass tested using the user's own real, already-authenticated Chrome session. Expanded every left-panel section and opened every sub-item that was safe to open read-only, including selecting test customers (starting with “A Line (CA)”) to confirm what “MY ACCOUNT” actually shows. A later follow-up retested customer selection via the search box specifically (not just “Recent customers”), and repeatedly switched between customers to check whether MY ACCOUNT's content refreshed correctly. No user was created, edited, or deleted in Manage users; no report or asset was modified in Manage reports / Manage assets; no order or payment was placed. Every customer selected during testing was deselected afterward." },
    { label: "Session", value: "Third case of this audit round. Tablet (768×1024) via Claude's built-in browser with viewport emulation, and mobile (375×812) jointly with the UX Assessment Lead due to a known click-timeout limitation, both closed out the same session; the customer-search and data-refresh follow-up was a later session, back on desktop." },
  ],
  blocks: [
    {
      type: "steps",
      heading: "Steps",
      items: [
        { text: "Opened the left navigation panel's seven sections one at a time (LINESHEETS, CUSTOM LINESHEETS, REPORTS, SAVE/SHARE/PRINT, MY ACCOUNT, SETTINGS, ADMINISTRATION) and recorded every sub-item. Confirmed it's a single-open accordion: expanding one section collapses whichever was open before.", image: c03img01, caption: "Left navigation panel, default state" },
        { text: "Recorded REPORTS' 10 report types (Backorder, Booking, Final Sale, In Transit, Offprice, On Hand, Preorder, Sale, Warehouse Sale, Web Reserve) and CUSTOM LINESHEETS' single “View all” entry, plus SAVE/SHARE/PRINT (Export as PDF, Export as CSV) and SETTINGS (Hide details, Price level, Currency pricing, Mask quantities — report-display toggles, not account settings)." },
        { text: "Clicked MY ACCOUNT's “Open orders” with no customer selected: a “SELECT CUSTOMER — Customer must be selected for this action” modal appeared, confirming the whole section is scoped to a customer, not to the logged-in Sales Rep.", image: c03img03, caption: "“SELECT CUSTOMER” modal on MY ACCOUNT" },
        { text: "Selected a customer (“A Line (CA)”) via that modal and reopened “Open orders”: it loaded “SALES ORDERS” for “A Line Boutique” at /my-account/orders?orderType=open — confirming the section shows the selected customer's data under a “my-account” label and URL. Deselected the customer afterward.", image: c03img04, caption: "MY ACCOUNT sales orders for the selected customer" },
        { text: "Recorded ADMINISTRATION's three items and opened each: Manage users is a searchable table of customer-side logins; Manage reports is a back-office registry of every report/linesheet definition; Manage assets is a style-image upload tool. All three cover the whole customer base, distinct in scope from MY ACCOUNT's single-customer view.", image: c03img05, caption: "ADMINISTRATION → Manage users" },
        { text: "Opened the top-right user menu (“Alan Jalife”): a right-side drawer with “Select your customer” (search box), a “Recent customers” list, and “Log out”.", image: c03img02, caption: "User menu, “Recent customers” populated" },
        { text: "Collapsed the left panel via its X/hamburger control: the whole panel (icons and labels) disappears rather than collapsing to an icon-only rail, so none of its labels remain visible or reachable via tooltip while collapsed." },
      ],
    },
    {
      type: "steps",
      heading: "Steps — tablet follow-up (768×1024)",
      items: [
        { text: "Retested via Claude's built-in browser with real viewport emulation, on the same already-authenticated session. Reloaded at 768×1024: the left panel renders exactly as on desktop — same seven sections, same single-open accordion, no collapse-to-icon-rail or drawer treatment at this width." },
        { text: "Expanded MY ACCOUNT and clicked “Open orders”: the same “SELECT CUSTOMER” modal appeared, with working CANCEL and SELECT buttons. (One earlier attempt in this same session saw the modal's CANCEL/X/Escape all silently fail to close it — a stale in-page state fixed instantly by a page reload, not a genuine width-specific bug; see Notes.)" },
        { text: "Expanded ADMINISTRATION: same three items, same order as desktop." },
        { text: "Opened the top-right user menu: same right-side drawer layout as desktop. “Recent customers” populated with the same nine accounts after a short delay — see Finding 3 for what that delay actually looks like." },
        { text: "Collapsed the left panel via its top-left control: the whole panel disappears (not an icon rail) and the report reflows to a 2-column grid — matching Case 02's tablet finding for the same control. Reopened cleanly via the hamburger icon." },
      ],
    },
    {
      type: "steps",
      heading: "Steps — mobile follow-up (375×812)",
      items: [
        { text: "Attempted first with Claude's built-in browser alone: tapping the hamburger icon to open the left panel timed out after 30 seconds with no effect, the same click-timeout limitation documented in Case 01 and Case 02. Switched to the same joint method used for Case 02's mobile pass: the UX Assessment Lead performs each tap directly in the same emulated session and reports it; Claude inspects the resulting state." },
        { text: "UX Assessment Lead tapped the hamburger icon: the left panel opened as a full-screen overlay (not a sidebar, unlike desktop/tablet) — same seven sections, same order." },
        { text: "UX Assessment Lead expanded MY ACCOUNT and tapped “Open orders”: the same “SELECT CUSTOMER” modal appeared as a centered dialog over the dimmed panel. Tapped CANCEL, which closed it correctly." },
        { text: "UX Assessment Lead expanded ADMINISTRATION (same three items), then closed the panel and tapped the “AJ” avatar to open the user menu: same drawer content as desktop/tablet. This time, watching live, the UX Assessment Lead caught something Claude's own desktop/tablet passes had missed — see Finding 3." },
      ],
    },
    {
      type: "steps",
      heading: "Steps — customer search & data-refresh check (desktop, Claude in Chrome)",
      items: [
        { text: "Two things were still open after the tablet/mobile follow-up: whether “SELECT CUSTOMER” also worked when picking a customer through the search box rather than “Recent customers”, and a UX Assessment Lead question about the drawer's close control (see Finding 5). Both were checked back on desktop, in the same real, already-authenticated Chrome session." },
        { text: "Opened the user menu and typed “line” into “Search by name”: results updated to a broader set than the nine Recent Customers — “A Line Boutique”, “A Line (CA)”, “Ameline Shoppe”, “Canterbury of Crestline”, “Caroline Boutique”, “Caroline Rice”, and more below the fold — each with its own city/state, confirming this genuinely searches the full customer base (matching substrings inside names, not just the start) rather than filtering the Recent list." },
        { text: "Selected “Ameline Shoppe” from those search results: the drawer closed, the top-right chip updated to “Ameline Shoppe”, and pricing on the report updated to that customer's own price level — the search-based selection path works correctly." },
        { text: "Opened MY ACCOUNT → Open orders for the newly selected “Ameline Shoppe”: the page briefly showed the previous customer's address and order list under “Ameline Shoppe”'s own name and heading, before settling a couple of seconds later on the correct data. This first read as a loading-transition flash — until it was retested and didn't always self-correct (see Finding 2)." },
        { text: "Repeated the customer switch three times in a row (via both Recent Customers and search), checking Open Orders each time: the previous customer's address carried over as stale content in all three attempts, and in one of those the previous customer's actual order numbers, dates, and dollar totals carried over too, incorrectly labeled under the new customer's name.", image: c03img09, caption: "MY ACCOUNT: “Ameline Shoppe” heading, but the previous customer's stale address and orders" },
        { text: "Confirmed a fresh page reload (not just re-selecting the customer) reliably shows the correct data for whichever customer is currently selected — used as the “ground truth” to compare each stale-state capture against. Deselected the test customer afterward.", image: c03img10, caption: "Same account, correct, immediately after a reload" },
      ],
    },
    {
      type: "richtext",
      heading: "Finding 1 — “MY ACCOUNT” is misleadingly named: it's the selected customer's account, not the Sales Rep's own",
      paragraphs: [
        "Every item under “MY ACCOUNT” — Open orders, Shipped orders, Make payment, Payment methods, Payment history, Carts list, Activity history — requires a customer to be selected first, and once one is, all seven show that customer's data, not anything belonging to the logged-in Sales Rep. Clicking “Open orders” with no customer selected surfaces a “Customer must be selected for this action” modal; after selecting “A Line (CA)”, the same link loads “A Line Boutique”'s sales orders at a URL that literally reads /my-account/orders.",
        "For a Sales Rep acting on behalf of dozens of buyer accounts, a section labeled “MY ACCOUNT” reads as “my own account” — the natural first guess — when it's actually “the account of whichever customer I currently have selected”. That's a real mismatch between the label and what it opens, not just a wording nitpick: a rep could reasonably expect it to hold their own login details or preferences.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Match between system and the real world; consistency and standards (a section's label should describe what's inside it)." },
        { label: "Suggested direction", value: "Rename the section to something that names the customer, not the rep — e.g. “Customer Account” or “Client Orders & Payments” — or, if a customer is selected, show that customer's name in the section header the way the top-right chip already does." },
      ],
    },
    {
      type: "richtext",
      heading: "Finding 2 — Switching customers can leave MY ACCOUNT showing the previous customer's address and orders under the new customer's name",
      paragraphs: [
        "After a customer is already selected, switching to a different one — via either “Recent customers” or the search box — does not reliably refresh the content on MY ACCOUNT screens like Open Orders. The page heading and the top-right chip both update immediately to the newly selected customer's name, but the address and order list underneath can keep showing the previous customer's real data for longer, in some cases indefinitely without a manual page reload.",
        "This was reproduced three times in a row, switching between “Ameline Shoppe,” “Wildflower Boutique (IN),” and “Buka”: every time, the street address shown stayed on the previous customer's real address for at least a couple of seconds, and twice it never corrected on its own within several seconds and needed a manual reload to fix. Once, the order list itself carried over: after selecting “Wildflower Boutique (IN),” the screen showed that name as the heading, but “Ameline Shoppe”'s real street address and its three real orders (SOLP217000–217002, with their real dates and dollar totals) underneath — none of which belong to Wildflower Boutique. A subsequent reload confirmed Wildflower Boutique's actual, correct state: its own address, and zero open orders.",
        "A fresh page reload after selecting a customer reliably shows that customer's own correct data every time — the underlying data and the URL routing are both correct. The bug is specifically that switching customers without a reload does not consistently trigger the address and order list to refetch, while the page's own heading and the global “selected customer” chip do refresh immediately, so the two parts of the screen can disagree about whose data is actually showing.",
        "This is a more serious variant of the same underlying gap as Finding 3 below (a loading/refresh state that's invisible or inconsistent): here, though, the risk isn't just a missed loading cue — it's a Sales Rep potentially reading a wrong customer's real order numbers, dates, and dollar amounts as if they belonged to the customer they just selected, with no visual indication anything is stale.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Visibility of system status; match between system and the real world (the visible state must match the actual data)." },
        { label: "Suggested direction", value: "Make the customer switch a single atomic operation from the user's point of view — don't update the heading/chip until the address and order data for the new customer have actually loaded, and show an explicit loading state on the MY ACCOUNT content itself in the meantime, rather than leaving stale content visible under a new label." },
        { label: "Priority note", value: "High — unlike this case's other findings, this one can show a Sales Rep incorrect, specific business data (a real order number, date, and dollar total) mislabeled as belonging to the wrong customer, with nothing on screen to flag it as stale." },
      ],
    },
    {
      type: "richtext",
      heading: "Finding 3 — “Recent customers” does show a loading spinner, but it's positioned and styled in a way that makes it easy to miss",
      paragraphs: [
        "Opening the top-right user menu shows “Select your customer” with a search box and a “Recent customers” label right away, but the list itself can take a few seconds to populate. Claude's own desktop and tablet passes first read this window as showing no loading indicator at all — the section just looked empty, then populated a few seconds later with nine recent accounts.",
        "During the mobile follow-up, watching the same interaction live, the UX Assessment Lead caught what Claude's screenshots had missed: there is a loading spinner (concentric circles, no text) on all three viewports, but it renders centered in the full page viewport — not inside or near the “Recent customers” list itself — and directly over the dark overlay that dims the rest of the page while the drawer is open. Since the spinner is a dark gray, roughly the same tone as that overlay, it blends into the background rather than reading as an active loading state. It was later caught on camera too, while investigating Finding 2 above: opening the user menu again right after switching customers landed a screenshot mid-load, showing the spinner exactly where and how the UX Assessment Lead described it.",
        "This changes the finding's root cause but not its practical effect: a buyer or rep opening this menu still has no usable signal, in practice, that the list is loading rather than empty.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Visibility of system status." },
        { label: "Suggested direction", value: "Move the loading indicator into the “Recent customers” list area itself (inline spinner or skeleton rows) instead of the center of the viewport, and give it enough contrast against the dimmed overlay to actually be seen." },
        { label: "Priority note", value: "Low, per the UX Assessment Lead — a loading indicator does exist, the delay it covers is short, and nothing about it is broken, only easy to miss. Worth fixing but not urgent." },
      ],
    },
    {
      type: "richtext",
      heading: "Finding 4 — The account/user control changes its own visual identity between closed and open states",
      paragraphs: [
        "Flagged by the UX Assessment Lead while reviewing the tablet and mobile screenshots above, then confirmed at real desktop width too: the top-right control for the current user renders as three different things depending on state and viewport, rather than one consistent element that simply opens a panel. Desktop, panel closed: plain text, “Alan Jalife”, with a dropdown chevron — no icon or avatar at all. Tablet/mobile, panel closed: a circular avatar showing initials, “AJ”. All three viewports, panel open: the text or initials disappear entirely, replaced by a generic person-silhouette icon in a plain circle — the same icon at every width, unrelated to either the name or the initials shown a moment before.",
        "Since this is the same control before and after the same click, a user has no visual thread connecting the two states — the thing they just clicked seems to change identity rather than simply opening. It's a small effect on any single click, but it sits right next to Finding 1 as a second instance of this case's underlying theme: this area of the app doesn't yet have one consistent way of representing “the current user.” Separately, the open-state icon button also has no accessible name in the page's accessibility tree — worth a mention here since it's the same element, though a full accessibility pass is Area 3's job, not this case's.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Consistency and standards (the same control should look and read the same way across its own states)." },
        { label: "Suggested direction", value: "Pick one representation for the current user — the avatar-with-initials pattern already used at tablet/mobile is the more scalable choice — and use it consistently whether the panel is open or closed, and at every viewport. Add an accessible label to the open-state button regardless of which icon is kept." },
        { label: "Priority note", value: "Low. Nothing here blocks or misleads a user about what to do next — it's a minor visual inconsistency on a control most people glance at rather than study." },
      ],
    },
    {
      type: "richtext",
      heading: "Finding 5 — The user drawer's close control sits at the opposite corner from where it was opened, and doesn't double as a toggle",
      paragraphs: [
        "Raised as a question by the UX Assessment Lead: is the “X” that closes the user drawer, and its position, actually right? Checked directly: the drawer opens from the top-right of the screen (that's where the avatar/name trigger lives, both open and closed), but its own “X” close control sits at the drawer's opposite, inner edge — the top-left corner of the drawer itself, away from the viewport's outer edge and away from the trigger that opened it.",
        "This breaks symmetry with the app's other slide-out panel: the left navigation panel's own collapse control sits at its outer edge (the viewport's top-left, where that panel visually lives), so closing it happens right where you'd reach for it. The user drawer instead puts its close control at its inner edge, on the opposite side of the screen from its own trigger.",
        "Two related behaviors, checked directly: clicking the avatar/trigger a second time while the drawer is already open does not close it — it has no effect, so the button that opens the drawer can't be used as a toggle to close it again, unlike a common, expected pattern for this kind of control. Clicking anywhere on the dimmed backdrop does close the drawer correctly, so there's a working, discoverable fallback — this isn't a dead end, just a less direct path than a close control positioned exactly where you'd expect it.",
        "This is also the third distinct place in the app using an “X” glyph (Case 02's Finding 2 already flagged the header “Unselect All” X next to the left-nav collapse X) — here, at least, the meaning (“close this panel”) is consistent with the nav panel's own X, so this reads as a positioning/predictability issue rather than another instance of the glyph itself carrying conflicting meanings.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Consistency and standards (this app's two slide-out panels close themselves via different corners); user control and freedom (a natural “click here again to undo” path is missing, though a working alternative exists)." },
        { label: "Suggested direction", value: "Move the drawer's close control to its own outer edge (top-right of the viewport, near or replacing the avatar/name trigger) to mirror the left nav panel's convention, and/or make the trigger itself toggle the drawer closed on a second click." },
        { label: "Priority note", value: "Low. The backdrop-click fallback means no one gets stuck; this is a minor efficiency and consistency gap, not a blocker." },
      ],
    },
    {
      type: "list",
      heading: "Positive observations",
      items: [
        "The left panel's seven sections are a clean, predictable single-open accordion — expanding one collapses whichever was open before, with no stuck or double-open states.",
        "Reporting is grouped clearly and predictably: REPORTS (10 report types), CUSTOM LINESHEETS, and SAVE/SHARE/PRINT (PDF/CSV export) sit together and cover generation, browsing, and output without overlap.",
        "SETTINGS correctly scopes itself to report-display preferences rather than mixing in account-level settings, which keeps its contents predictable once you know what the section is for.",
        "ADMINISTRATION cleanly separates Lilla P's own back-office functions from any single customer's data — Manage users lists customer-side logins, Manage reports is a full registry of every report/linesheet, and Manage assets handles style-image uploads. None of the three leak into MY ACCOUNT or vice versa.",
        "There's no self-service “edit my profile” screen for the logged-in Sales Rep, but this is expected rather than a gap: user records are provisioned through a NetSuite integration, and an administrator manages accounts directly via ADMINISTRATION → Manage users — correctly placed there rather than duplicated elsewhere.",
        "The “Search by name” box in the user menu works correctly and searches the full customer base, not just the nine-item Recent Customers list — it matches substrings anywhere in a name (e.g. “line” also matches “Ameline Shoppe” and “Canterbury of Crestline”, not only names starting with “Line”), and shows each result's city/state to help disambiguate similarly named accounts. Selecting a customer from search results works the same as selecting one from Recent Customers.",
        "The underlying customer data itself is correct in every case checked — a fresh page reload after selecting any customer always shows that customer's own correct address and orders. Finding 2's bug is specifically about the screen not refreshing reliably on a plain customer switch, not about wrong data being stored anywhere.",
        "Tablet (768×1024), fully verified: the left panel, the MY ACCOUNT customer-select modal, ADMINISTRATION, and the user menu all reproduce desktop's behavior exactly, with no tablet-specific regressions. Panel collapse/reopen behaves the same as Case 02 found for this same control (whole panel disappears, report reflows to 2 columns).",
        "Mobile (375×812), fully verified via joint testing: the left panel opens as a full-screen overlay instead of a sidebar — a sensible, deliberate adaptation for the width, not a bug — but still surfaces the same seven sections in the same order. The MY ACCOUNT modal and ADMINISTRATION both reproduce cleanly.",
      ],
    },
    {
      type: "richtext",
      heading: "Notes / follow-up needed",
      paragraphs: [
        "Findings 4 and 5 both came from questions the UX Assessment Lead raised after reviewing this case's own screenshots and steps — the avatar/icon swap and the drawer's close-control position were both things Claude's own passes had walked past without registering as inconsistencies. Finding 2 (the stale-data bug) was found the same way, while specifically checking the search-based customer selection the UX Assessment Lead asked to have tested.",
        "Finding 2 was reproduced 3 times in the same session and appears highly reliable, but the exact trigger condition (why it sometimes takes ~2 seconds to self-correct and sometimes doesn't correct at all without a reload) wasn't isolated — worth a developer's read on the actual refetch logic behind a customer switch, rather than more manual reproduction from the UI alone.",
        "Correction from the UX Assessment Lead, incorporated above: an earlier draft of this case treated the missing “edit my own profile” screen as a navigation gap. It isn't — self-service profile editing isn't part of this app's scope in this version, since user data comes from NetSuite and administrators manage accounts via Manage users.",
        "During the tablet pass, one early attempt to close the MY ACCOUNT customer-select modal (via CANCEL, the X, and Escape) silently failed to do anything, despite each click reporting success. A page reload immediately resolved it, and the same modal opened and closed normally on every other attempt at every width tested — this reads as a one-off stale-state glitch in the same testing session, not a reproducible tablet-width bug, but it's noted here in case it recurs in a future case.",
        "While re-capturing evidence for Finding 1 on desktop, selecting “A Line (CA)” from the customer picker triggered an “IN PROGRESS CART” dialog reading “A Line Boutique has an in-progress Fall 2026 cart” — i.e. picking one named account surfaced cart state under a different customer name, echoing the same “MY ACCOUNT” naming inconsistency from a different angle. Neither this dialog nor the “OUTDATED CART” dialog that followed it was part of this case's original test plan, and neither was investigated further — worth its own case later.",
        "Worth checking later: does Manage users (ADMINISTRATION) also list internal/Sales Rep accounts like Alan Jalife's own, or only customer-side logins? The page viewed here showed only rows with USER TYPE “Customer” before pagination was explored further.",
      ],
    },
  ],
};

const case04 = {
  id: "case-04",
  caseNumber: "04",
  title: "Administration: Manage Users (list & row Actions)",
  status: "Issues found — an ambiguous checkbox rendering state inside the row-level Actions modal, an \"Actions\" icon that doesn't match its counterpart on Manage Reports, two table columns that are defined but never populated, and no responsive/mobile treatment at all.",
  statusKind: "issue",
  // Finding 1 (checkbox rendering) is both a visibility-of-status and a
  // consistency-and-standards gap; Finding 2 (Actions icon mismatch) is a
  // consistency-and-standards gap, another data point in the design-system
  // theme tracked since Case 01. Findings 3 and 4 (COMPANY / USER TYPE
  // never populated) are visibility-of-status gaps. Also carries Area 2's
  // Admin Journeys — this case covers "Manage users" — and, per Finding 5
  // (no responsive/mobile treatment at all, a deliberate known gap rather
  // than something reproduced and diagnosed), Area 3's "responsive"
  // category. No accessibility-specific issue was found, so that category
  // isn't listed here.
  categories: ["design-system", "visibility-status", "admin-journeys", "responsive"],
  categorySummaries: {
    "design-system": "The \"Actions\" column uses a different icon here than on Manage Reports for what should be the same kind of control, and a checkbox's checked state renders as an ambiguous gray fill instead of a checkmark — the same component misstyled on Case 05 too.",
    "visibility-status": "A checked checkbox is hard to tell apart from an unchecked one, and two table columns (COMPANY, and some USER TYPE values) never show any data at all.",
    "admin-journeys": "Covers \"Manage users\": searching, scrolling, and editing a user record all work correctly, but a checkbox rendering bug inside the edit modal and an icon mismatch with Manage Reports both surfaced along the way.",
    "responsive": "This screen has no tablet or mobile layout at all — a known, deliberate scope gap for this internal admin tool rather than something tested and found broken.",
  },
  summary: "Searching, scrolling, and editing a user record all work correctly, but a shared checkbox component renders its checked state as an ambiguous gray fill, and the two ADMINISTRATION screens use inconsistent icons for the same \"Actions\" control.",
  scope: [
    { label: "Area", value: "Targeted heuristic evaluation of ADMINISTRATION → Manage Users: the list itself (scrolling, search), and the per-row \"Actions\" control. Explicitly includes a cross-screen consistency check against Case 05 (Manage Reports) — icons, typography, colors, and line/border styles — since both live under the same ADMINISTRATION section." },
    { label: "Screen", value: "/administration/manage-users." },
    { label: "Interaction boundary", value: "Tested using the user's own real, already-authenticated Chrome session. Opened the Actions modal for several accounts across all three USER TYPE values found (Customer, Employee, Sales Rep), inspected every field, and toggled one checkbox to test its rendering — always followed by CANCEL, never SAVE, so no account data was changed. DELETE was seen but never clicked. Searched the Email box with several terms (a full email, a domain, a name fragment) and cleared it each time. Toggled \"Show Inactive\" once." },
    { label: "Session", value: "Fourth case of this audit round, run together with Case 05 (Manage Reports) as a matched pair per the UX Assessment Lead's request. Desktop only, by design — per the UX Assessment Lead, this screen (and Manage Reports) was never built with a responsive/mobile treatment, so a tablet/mobile pass would only reproduce the same known gap rather than surface anything new; see Finding 5." },
  ],
  blocks: [
    {
      type: "steps",
      heading: "Steps — list (scrolling & search)",
      items: [
        { text: "Opened Manage Users: a single, un-paginated table (EMAIL, USER TYPE, COMPANY, IS B2B ADMIN, INACTIVE, NS ACCESS, STATUS, ACTIONS) sorted alphabetically by email, starting at \"123mdonahue@gmail.com\".", image: c04img01, caption: "Manage Users list, default state" },
        { text: "Scrolled through several screens' worth of rows: the table keeps loading continuously with no stutter, no \"load more\" button, and no pagination controls — the header row and the app's top bar both stay pinned while scrolling." },
        { text: "Pressed End: jumped straight to the literal last row alphabetically, \"ZOE@CLOTHCLOTHING.COM\" — confirming the entire user base is rendered as one continuous list, not paginated or virtualized into pages." },
        { text: "Searched \"adele\" in the Email box: live-filtered to the single matching row (adele@nkstfrancisville.com) instantly, no extra click needed." },
        { text: "Searched \"lillap.com\" and separately \"gangbaragency\": both correctly returned only the matching subset (11 @lillap.com accounts, all USER TYPE \"Employee\"; 5 @gangbaragency.com accounts, all USER TYPE \"Sales Rep\") — confirming the search matches anywhere in the email, not just a prefix, and that internal (non-customer) accounts are included in this list.", image: c04img02, caption: "Employee and Sales Rep accounts in the same search results" },
        { text: "Toggled \"Show Inactive\" on, then off: no visible change in the row set in either state — see Notes, since this may just mean no inactive accounts exist in this test data." },
      ],
    },
    {
      type: "steps",
      heading: "Steps — row Actions",
      items: [
        { text: "Clicked the Actions icon (a horizontal-lines-with-pencil glyph) on a Customer row: opened an \"ACCOUNT SETTINGS\" modal directly — no intermediate menu — with User Information (Email, B2B Access, Is B2B Admin, Pay Now Access, Order Entry Access, Inactive, Reset User Password) and Report Preferences (Country, Pricing Options) side by side, and CANCEL / DELETE / SAVE at the bottom." },
        { text: "Repeated on an Employee row and a Sales Rep row (jenny@gangbaragency.com): same modal, same fields, same layout regardless of USER TYPE." },
        { text: "On the Sales Rep row's modal, noticed the \"Order Entry Access\" checkbox rendered as a solid gray-filled square, visually different from every other checkbox on the same form (which were plain white/empty outlines) — see Finding 1.", image: c04img04, caption: "\"Order Entry Access\" checkbox rendering as an ambiguous gray fill" },
        { text: "Clicked that checkbox once to test it: it toggled to a plain white/empty box (confirming the control itself works and isn't disabled), then clicked CANCEL. Reopened the same account's modal afterward: the checkbox was back to its original gray-filled state, confirming CANCEL correctly discarded the change and nothing was actually saved." },
        { text: "While the Actions modal was loading (between the click and the modal appearing), one screenshot happened to land mid-load and captured the same low-contrast, viewport-centered loading spinner documented in Case 03 Finding 3 — reproducing here too, on a different screen.", image: c04img03, caption: "Actions modal loading — the same low-contrast, centered spinner as Case 03" },
      ],
    },
    {
      type: "richtext",
      heading: "Finding 1 — A checkbox's \"checked\" state renders as an ambiguous gray fill instead of a checkmark",
      paragraphs: [
        "The \"Order Entry Access\" checkbox inside the ACCOUNT SETTINGS modal, when checked (true), does not render with a checkmark glyph the way every other true/checked indicator in this app does (for example, the table's own NS ACCESS and IS B2B ADMIN columns, which show a clear ✓). Instead it renders as a plain, solid gray-filled square — visually close to a disabled or indeterminate control, and easy to read as \"off\" or \"not applicable\" rather than \"on.\"",
        "This was confirmed directly: clicking the box toggled it to a normal empty white square (proving it isn't disabled and the click registers), and reopening the same account after a CANCEL showed the gray-filled state again, unchanged — so this is the control's genuine default rendering for \"checked,\" not a stuck or broken state.",
        "The same exact rendering — a solid gray square, no checkmark, for a field that is actually selected/true — reproduces on Case 05 (Manage Reports), in both the Price Audit modal's currency/price-level checkboxes and the Sharing Options modal's \"Link expires\" checkbox. This appears to be one shared checkbox component used inconsistently with the rest of the app's checked-state styling, not three unrelated bugs.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Visibility of system status; consistency and standards (the same \"checked\" concept should look the same everywhere in the app)." },
        { label: "Suggested direction", value: "Give this checkbox component's checked state the same checkmark treatment used elsewhere in the app (or a filled box with a visible tick), so \"on\" and \"off\" are unambiguous at a glance without needing to click and compare." },
        { label: "Priority note", value: "Medium — worth fixing promptly since it affects a real permission field an admin might rely on, but the true state is still recoverable (click and observe the toggle), so it isn't a data-accuracy bug like Case 03's Finding 2." },
      ],
    },
    {
      type: "richtext",
      heading: "Finding 2 — The \"Actions\" column uses a different icon here than on Manage Reports",
      paragraphs: [
        "Manage Users' ACTIONS column uses a single glyph — a short horizontal-lines icon with a small pencil overlapping its bottom-right corner — for every row, and clicking it always opens the same single edit modal directly. Manage Reports' ACTIONS column (Case 05) uses a completely different glyph for the same job: a vertical three-dot \"kebab\" menu, which opens a dropdown of several distinct actions rather than one direct modal.",
        "Both columns share the same header label, \"ACTIONS,\" sit in the same ADMINISTRATION section, and are reached one click apart from each other in the left navigation — but they use unrelated icon metaphors (a single edit action vs. a menu-of-many) for what a user would reasonably expect to be the same kind of control across two sibling admin screens.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Consistency and standards." },
        { label: "Suggested direction", value: "Standardize on one icon per interaction pattern: if a row only ever has one action, an edit/pencil icon fits; if a row can have several actions (as Manage Reports does), the kebab/three-dot menu is the right choice — but use the same choice consistently for the same underlying pattern, or at minimum don't reuse the identical \"ACTIONS\" header label for two visually unrelated controls." },
        { label: "Priority note", value: "Low on its own — neither control is broken — but it's another data point in the design-system gap already tracked since Case 01." },
      ],
    },
    {
      type: "richtext",
      heading: "Finding 3 — The COMPANY column is defined but never populated, for any user",
      paragraphs: [
        "Every row in the table — Customer, Employee, and Sales Rep accounts alike, across roughly 500 rows checked by scrolling and by targeted searches — shows a blank COMPANY cell. No row seen during this pass had any value in that column.",
        "It's possible this column is simply not wired up to a data source yet, or that it's meant for a use case (e.g. multi-brand Sales Reps, per the NetSuite contact/customer model raised in Case 03) that doesn't apply to any of the currently-visible accounts. Either way, a column that never shows data across the entire visible user base is worth a direct check with the dev team.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Visibility of system status; aesthetic and minimalist design (an always-empty column adds width and visual noise without conveying anything)." },
        { label: "Suggested direction", value: "Confirm with engineering whether COMPANY is expected to populate under any real condition; if not currently functional, consider hiding it until it is, rather than showing a permanently blank column." },
        { label: "Priority note", value: "Low — cosmetic, doesn't block or mislead any task tested here." },
      ],
    },
    {
      type: "richtext",
      heading: "Finding 4 — Some rows have a blank USER TYPE with a \"Validate\" status",
      paragraphs: [
        "A handful of rows (for example caleb@shop-skirt.com, bmosamazomwiz1070@gmail.com, hpohland@msn.com, kathryn@petitandolson.com, marcycol@msn.com, naomi@mesamies.com, Natalie.nibimtk@gmail.com) show no value at all in USER TYPE, and their STATUS reads \"Validate\" rather than \"Activated.\" One additional row, system@lillap.com, also has a blank USER TYPE but shows \"Activated.\"",
        "This is a small population of accounts out of several hundred, so it reads as a data/onboarding-state edge case rather than a systemic bug — but it's worth understanding whether \"Validate\" status accounts are expected to lack a USER TYPE until some pending step completes, or whether this is a display gap.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Match between system and the real world (a record with no type value is ambiguous about what kind of account it actually is)." },
        { label: "Suggested direction", value: "Requires functional validation with the team — confirm whether \"Validate\" status accounts are mid-provisioning (and so legitimately lack a type yet) or whether USER TYPE should always be populated regardless of status." },
        { label: "Priority note", value: "Low — affects a small minority of rows and doesn't block searching, viewing, or editing any account." },
      ],
    },
    {
      type: "richtext",
      heading: "Finding 5 — No responsive/mobile treatment exists for this screen",
      paragraphs: [
        "Per the UX Assessment Lead, Manage Users (along with Manage Reports, see Case 05 Finding 6) was never designed with a tablet or mobile layout — unlike every customer/Sales-Rep-facing screen covered in Cases 01–03, which all adapt at 768px and 375px. Since this is a known, deliberate scope gap rather than something to reproduce and diagnose, a tablet/mobile pass wasn't run for this case; the built-in browser's own real-window resize confirmed the desktop table layout doesn't reflow at narrower widths, which is consistent with there being no responsive design intended for this screen at all today.",
        "Being an internal, back-office ADMINISTRATION screen used by Lilla P staff rather than by buyers or Sales Reps in the field, this is a reasonable gap to have deprioritized so far — but it's worth recording as a known, deliberate limitation rather than leaving it undocumented.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Flexibility and efficiency of use (an admin who needs to look something up from a phone or tablet currently cannot)." },
        { label: "Suggested direction", value: "When responsive work is prioritized for the ADMINISTRATION section, Manage Users' wide, many-column table would need a real mobile treatment (e.g. a card-per-user layout, or a reduced column set) rather than a simple reflow, given how many columns it carries." },
        { label: "Priority note", value: "Low — this is a deliberate, known scope gap on an internal admin tool, not a regression or a broken experience; desirable to fix eventually, not urgent." },
      ],
    },
    {
      type: "list",
      heading: "Positive observations",
      items: [
        "The Email search box filters live and correctly: an exact local-part match, a domain-only search, and a company-name fragment all returned exactly the expected subset of rows, with no stale results left over between searches.",
        "The full list — several hundred rows — scrolls as one continuous, un-paginated table with no stutter, no broken lazy-loading, and no dead zones; Home/End jump to the true first/last row exactly as expected.",
        "USER TYPE correctly distinguishes Customer, Employee, and Sales Rep accounts in the same list — this directly answers the open question left in Case 03's Notes (whether Manage Users lists only customer-side logins): it does not, it lists every account type, internal and customer-facing alike.",
        "IS B2B ADMIN renders correctly with a real checkmark for at least one account confirmed to have it set (kelsey@lillap.com), which narrows Finding 1 specifically to the ACCOUNT SETTINGS modal's own checkbox styling rather than a table-wide rendering problem.",
        "The Actions modal opens the same \"ACCOUNT SETTINGS\" layout regardless of the row's USER TYPE (Customer, Employee, or Sales Rep tested) — one consistent edit experience, not three different ones.",
        "CANCEL correctly discards unsaved changes: a checkbox toggled during this pass reverted to its original state on reopening the modal, confirming no accidental edits were persisted.",
        "The modal's own close \"X\" sits in the conventional top-right corner of the dialog — a small, positive contrast with Case 03 Finding 5's drawer-positioning issue.",
      ],
    },
    {
      type: "richtext",
      heading: "Notes / follow-up needed",
      paragraphs: [
        "\"Show Inactive\" produced no visible change in either state during this pass. This is inconclusive rather than a negative finding: every row seen across extensive scrolling and searching showed STATUS \"Activated\" or \"Validate,\" never \"Inactive,\" so it's possible this test dataset simply has no inactive accounts to reveal. Not confirmed either way — would need a known inactive test account to verify the toggle actually filters.",
        "DELETE was visible on every ACCOUNT SETTINGS modal but never clicked, to avoid deleting a real account.",
        "Raw email data shows some casing inconsistency (all-caps vs. lowercase addresses) and at least one likely-duplicate pair (nissa@keepboutique.co vs. nissa@keepboutique.com) — a data-quality observation from the NetSuite/contact source data itself, not a UI defect, so no design recommendation attached.",
        "Finding 1 (the checkbox rendering bug) and Finding 2 (the Actions icon mismatch) are cross-referenced with Case 05, where the same two patterns were found independently while testing Manage Reports. Documented in both cases since each was discovered via that screen's own flow, but they likely represent two single, shared-component fixes rather than four separate issues — worth flagging to the dev team as such.",
        "Finding 5 (no responsive/mobile treatment) is likewise cross-referenced with Case 05 Finding 6 — both ADMINISTRATION screens share the same gap, most likely because both were built without a mobile use case in mind from the start, rather than as two independent oversights.",
      ],
    },
  ],
};

const case05 = {
  id: "case-05",
  caseNumber: "05",
  title: "Administration: Manage Reports (list & row Actions)",
  status: "Issues found — the same checkbox-rendering ambiguity and Actions-icon mismatch found in Case 04, two more table columns that are defined but never populated, one report whose USER count looks suspicious given how heavily it's actually used, and no responsive/mobile treatment at all.",
  statusKind: "issue",
  // Finding 1 (Actions icon mismatch) is the same consistency-and-standards
  // gap as Case 04 Finding 2, evidenced from this screen's own side.
  // Finding 2 (checkbox rendering) is both a visibility-of-status and a
  // consistency-and-standards gap — the same shared component misstyled on
  // Case 04. Findings 3 and 4 (TYPE / USERS never populated correctly) are
  // visibility-of-status gaps. Also carries Area 2's Admin Journeys — this
  // case covers "Manage reports" — and, per Finding 6 (no responsive/mobile
  // treatment at all, the same deliberate known gap as Case 04), Area 3's
  // "responsive" category.
  categories: ["design-system", "visibility-status", "admin-journeys", "responsive"],
  categorySummaries: {
    "design-system": "The \"Actions\" column uses a kebab menu here but a single edit icon on Manage Users for what should be the same kind of control, and the same ambiguous gray-fill checkbox rendering from Case 04 reproduces twice on this screen too.",
    "visibility-status": "Checked checkboxes in the Price Audit and Sharing Options modals are hard to tell apart from unchecked ones, and two table columns (TYPE, and USERS for the app's most-used report) show no data or a suspicious 0.",
    "admin-journeys": "Covers \"Manage reports\": the list and all three row actions (Check images, Check prices, Share via Email) work correctly and are genuinely useful, but the same checkbox rendering bug from Case 04 and an icon mismatch with Manage Users both surfaced here too.",
    "responsive": "This screen has no tablet or mobile layout at all — the same known, deliberate scope gap already recorded for Manage Users.",
  },
  summary: "The list and its three row actions (Check images, Check prices, Share via Email) all work correctly, but the same ambiguous checkbox rendering found on Manage Users reproduces twice here, and its \"Actions\" icon still doesn't match Manage Users' own.",
  scope: [
    { label: "Area", value: "Targeted heuristic evaluation of ADMINISTRATION → Manage Reports: the list itself (scrolling, search), and the per-row \"Actions\" control's three actions (Check images, Check prices, Share via Email). Explicitly includes a cross-screen consistency check against Case 04 (Manage Users) — icons, typography, colors, and line/border styles." },
    { label: "Screen", value: "/administration/manage-reports." },
    { label: "Interaction boundary", value: "Tested using the user's own real, already-authenticated Chrome session. Opened all three Actions items at least once, using \"Fall 2026\" (the live, heavily-trafficked default report) as the primary test case since it has real styles/colors/prices behind it, unlike several of the empty legacy report types. Ran the Image Audit to completion (a read-only check). Opened the Price Audit and Sharing Options modals and inspected/toggled their controls, but never clicked \"RUN PRICE CHECK\" or \"SHARE,\" to avoid triggering a real CSV download or sending a real email. Searched the \"Report name\" box and cleared it." },
    { label: "Session", value: "Fifth case of this audit round, run together with Case 04 (Manage Users) as a matched pair per the UX Assessment Lead's request. Desktop only, by design — per the UX Assessment Lead, this screen (and Manage Users) was never built with a responsive/mobile treatment, so a tablet/mobile pass would only reproduce the same known gap rather than surface anything new; see Finding 6." },
  ],
  blocks: [
    {
      type: "steps",
      heading: "Steps — list (scrolling & search)",
      items: [
        { text: "Opened Manage Reports: a single table (TYPE, REPORT NAME, CREATED, SHAREABLE LINKS, USERS, ACTIONS) listing 15 rows total — the 10 fixed report types (Backorder, Booking, Final Sale, In Transit, Offprice, On Hand, Preorder, Sale, Warehouse Sale, Web Reserve), \"Favorites,\" and the four seasonal linesheets (Spring 2027, Holiday 2026, Fall 2026, In Stock).", image: c05img01, caption: "Manage Reports list, default state" },
        { text: "Pressed End: confirmed \"In Stock\" is the true last row — this is the complete list, not a paginated excerpt; no pagination or \"load more\" controls exist, and none are needed at this scale." },
        { text: "Searched \"fall\" in the Report Name box: live-filtered instantly to the single matching row, \"Fall 2026.\"" },
        { text: "Cleared the search: the full 15-row list returned correctly." },
      ],
    },
    {
      type: "steps",
      heading: "Steps — row Actions",
      items: [
        { text: "Clicked the Actions icon (a vertical three-dot \"kebab\" menu) on the \"Favorites\" row: opened a dropdown with three items — \"Check images,\" \"Check prices,\" \"Share via Email\" — each with its own icon.", image: c05img02, caption: "Actions kebab menu, dropdown open" },
        { text: "Ran \"Check images\" on Favorites (empty report): opened an \"Image audit - Favorites\" modal showing 0 styles/colors checked and a green \"All rendered styles have a default image and all rendered colors have an image\" message — correct for an empty report." },
        { text: "Ran \"Check images\" on \"Fall 2026\" (the real, populated default report): showed a proper inline loading state (\"Checking report images...\" with a small spinner) before resolving.", image: c05img03, caption: "Check images — inline loading state on Fall 2026" },
        { text: "The check resolved to 58 styles checked, 221 colors checked, 0 missing defaults, 0 missing color images, 0 total issues, and the same green success message.", image: c05img04, caption: "Check images results — Fall 2026, 0 issues found" },
        { text: "Opened \"Check prices\" on \"Fall 2026\": a \"Price audit - Fall 2026\" modal listing every USD price combination — 13 percentage-discount tiers (8% through 80% Off) and 10 named price levels (Bloomingdale's, BO/Volume, CA RT, CA WS, Employee, Promo, Retail, Sale, Wholesale, Wholesale 2) — with the header reading \"23 price combination(s) selected.\" None of the 23 checkboxes showed a checkmark; all rendered as solid gray-filled squares.", image: c05img05, caption: "Price audit — 23 combinations selected, none show a checkmark" },
        { text: "Clicked \"Clear all\": the count correctly dropped to \"0 price combination(s) selected\" and every box switched to a plain white/empty outline, confirming the gray fill really was this control's own \"checked\" rendering, not a display glitch. Clicked a single box (\"8% Off\") to confirm: it showed the same gray fill, with the count reading \"1 price combination(s) selected.\" Closed via the modal's own X without running the check.", image: c05img06, caption: "Price audit — single checkbox selected, same gray-fill rendering" },
        { text: "Opened \"Share via Email\" on \"Fall 2026\": opened a \"SHARING OPTIONS\" modal (a different title than the menu item that opened it) with Visible To, Link expires (On Date / After N clicks), a \"Share with\" email field, a message box, and a \"Notify me when clicked\" checkbox. The \"On Date\" checkbox was pre-checked and rendered with the same gray-fill, no-checkmark styling seen in the Price Audit — reproducing Finding 2 a second time on this same screen. Closed via CANCEL without sharing anything.", image: c05img07, caption: "Sharing Options modal — \"On Date\" checkbox with the same ambiguous rendering" },
      ],
    },
    {
      type: "richtext",
      heading: "Finding 1 — The \"Actions\" column uses a different icon here than on Manage Users",
      paragraphs: [
        "Manage Reports' ACTIONS column uses a vertical three-dot \"kebab\" menu for every row, opening a dropdown of three distinct actions (Check images, Check prices, Share via Email). Manage Users' ACTIONS column (Case 04) uses a single horizontal-lines-with-pencil glyph instead, which opens one direct edit modal with no menu at all. Both columns share the identical \"ACTIONS\" header label and sit one click apart in the same ADMINISTRATION section.",
        "Here the kebab-menu pattern is the right choice, since this screen genuinely has three separate actions per row — so this finding isn't \"Manage Reports got it wrong,\" it's that the two screens disagree with each other under the same label. See Case 04 Finding 2 for the full write-up; this is the same underlying issue, evidenced from the other side.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Consistency and standards." },
        { label: "Suggested direction", value: "See Case 04 Finding 2 — standardize which icon represents \"one direct action\" vs. \"a menu of several,\" and apply it consistently to both screens." },
        { label: "Priority note", value: "Low on its own, same design-system pattern already tracked since Case 01." },
      ],
    },
    {
      type: "richtext",
      heading: "Finding 2 — Checked checkboxes render as an ambiguous gray fill, with no checkmark, in two places on this screen",
      paragraphs: [
        "Both the Price Audit modal's currency/price-level checkboxes and the Sharing Options modal's \"Link expires: On Date\" checkbox render their true/checked state as a solid gray-filled square, with no checkmark glyph — identical to the issue found independently on Case 04's ACCOUNT SETTINGS modal (\"Order Entry Access\").",
        "This was directly confirmed on the Price Audit: the modal opened with all 23 available price combinations pre-selected (\"23 price combination(s) selected\"), yet not one of the 23 checkboxes showed a checkmark — all 23 were the same solid gray fill. Clicking \"Clear all\" dropped the count to 0 and switched every box to a plain white outline, proving the gray fill genuinely represents \"selected,\" just without the checkmark that would normally signal it. The same pattern repeated on a single checkbox clicked individually, and again on the Sharing Options modal's pre-checked \"On Date\" box.",
        "Because the Price Audit defaults to all combinations selected, and because \"selected\" and \"not selected\" here look almost the same (a light gray square either way, with or without the fill), an admin skimming this modal could easily misjudge which currencies and price levels are actually about to be checked before running the audit — or, in Sharing Options, whether a share link is actually set to expire.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Visibility of system status; consistency and standards (the same \"checked\" concept renders differently here than in the rest of the app, which uses a real checkmark — see the table's own IS B2B ADMIN column on Case 04)." },
        { label: "Suggested direction", value: "Same as Case 04 Finding 1 — this is very likely one shared checkbox component; give its checked state a visible checkmark (or another unambiguous glyph) consistent with the rest of the app, rather than a plain filled square." },
        { label: "Priority note", value: "Medium — the Price Audit case in particular could lead to an admin running (or skipping) checks against the wrong scope of price levels without realizing it, since the default \"everything selected\" state is the hardest one to visually distinguish from \"nothing selected.\"" },
      ],
    },
    {
      type: "richtext",
      heading: "Finding 3 — The TYPE column is defined but never populated, for any report",
      paragraphs: [
        "All 15 rows in the table — every fixed report type and every seasonal linesheet — show a blank TYPE cell. No row seen during this pass had any value in that column, the same pattern as Case 04's COMPANY column.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Visibility of system status; aesthetic and minimalist design." },
        { label: "Suggested direction", value: "Confirm with engineering whether TYPE is meant to categorize reports (e.g. \"Linesheet\" vs. \"Standard report\" vs. \"Custom\") and simply isn't wired up yet, or whether the column should be removed." },
        { label: "Priority note", value: "Low — cosmetic, doesn't block any task tested here." },
      ],
    },
    {
      type: "richtext",
      heading: "Finding 4 — The USERS column shows 0 for every report, including the live default report every Sales Rep and Buyer lands on",
      paragraphs: [
        "Every row's USERS column reads 0 — including \"Fall 2026,\" which (per Case 02) is the exact report that auto-executes and lands every logged-in user on it immediately after login. If USERS is meant to reflect real usage or assigned access, a 0 here for the app's single most-used report looks wrong on its face.",
        "It's also possible USERS counts something narrower and legitimately zero today — for example, individual user-level report assignments made through some other, not-yet-tested part of ADMINISTRATION, as opposed to the report's default/automatic visibility to everyone. The SHAREABLE LINKS column right next to it does show real, varied, non-zero counts per report (0 through 71), which suggests the table's data layer works in general — it's specifically USERS that's suspicious.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Visibility of system status; match between system and the real world." },
        { label: "Suggested direction", value: "Requires functional validation with the team — confirm exactly what USERS is meant to count, and whether Fall 2026 legitimately has 0 by that definition or whether this is an undercount." },
        { label: "Priority note", value: "Low-Medium — nothing observable breaks because of it, but if this number is ever surfaced to an admin as a usage signal, it's currently misleading for the app's most important report." },
      ],
    },
    {
      type: "richtext",
      heading: "Finding 6 — No responsive/mobile treatment exists for this screen",
      paragraphs: [
        "Per the UX Assessment Lead, Manage Reports (along with Manage Users, see Case 04 Finding 5) was never designed with a tablet or mobile layout — unlike every customer/Sales-Rep-facing screen covered in Cases 01–03, which all adapt at 768px and 375px. Since this is a known, deliberate scope gap rather than something to reproduce and diagnose, a tablet/mobile pass wasn't run for this case.",
        "Being an internal, back-office ADMINISTRATION screen used by Lilla P staff rather than by buyers or Sales Reps in the field, this is a reasonable gap to have deprioritized so far — but it's worth recording as a known, deliberate limitation rather than leaving it undocumented.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Flexibility and efficiency of use (an admin who needs to check a report or share a link from a phone or tablet currently cannot)." },
        { label: "Suggested direction", value: "When responsive work is prioritized for the ADMINISTRATION section, Manage Reports' table is narrower than Manage Users' and would likely reflow more easily — but its three Actions modals (Image audit, Price audit, Sharing Options) would each need their own mobile layout pass, particularly the Price Audit's two-column checkbox grid." },
        { label: "Priority note", value: "Low — this is a deliberate, known scope gap on an internal admin tool, not a regression or a broken experience; desirable to fix eventually, not urgent." },
      ],
    },
    {
      type: "list",
      heading: "Positive observations",
      items: [
        "The Report Name search box filters live and correctly.",
        "The full report list (15 rows) is short, complete, and needs no pagination — confirmed by jumping to the true last row with End.",
        "\"Check images\" is a genuinely well-built feature: correct, non-zero counts on a real populated report (58 styles / 221 colors checked for Fall 2026), a proper inline loading state with descriptive text (\"Checking report images...\") rather than the unlabeled, hard-to-see spinner documented in Case 03 Finding 3 — a positive contrast worth noting.",
        "\"Check prices\" correctly lists every real currency/price-level combination actually configured in the system (13 percentage tiers, 10 named price levels) — the underlying audit data is comprehensive; the only issue is the checkbox styling covered in Finding 2.",
        "\"Share via Email\" / Sharing Options offers sensible, complete controls (visibility, link expiry by date or click count, a real email field, an optional message, and a notify-on-click toggle) — a fully thought-out feature, not a stub.",
        "SHAREABLE LINKS shows plausible, varied real counts per report (0 through 71) — this specific column's data looks trustworthy, in contrast to USERS (Finding 4).",
      ],
    },
    {
      type: "richtext",
      heading: "Notes / follow-up needed",
      paragraphs: [
        "\"RUN PRICE CHECK\" and \"SHARE\" were never clicked, to avoid a real CSV download or a real outgoing email during testing.",
        "Findings 1 and 2 are cross-referenced with Case 04, where the same two patterns were found independently while testing Manage Users. Documented in both cases since each was discovered via that screen's own flow, but they likely represent shared-component fixes rather than separate bugs per screen.",
        "The Sharing Options modal's title (\"SHARING OPTIONS\") doesn't match the menu item that opens it (\"Share via Email\") — a small naming mismatch, not raised as its own finding since the modal's actual scope (a shareable link, with an optional email step) is broader than \"email\" alone, so the mismatch reads as imprecise labeling rather than a misleading one.",
        "Finding 6 (no responsive/mobile treatment) is cross-referenced with Case 04 Finding 5 — both ADMINISTRATION screens share the same gap, most likely because both were built without a mobile use case in mind from the start, rather than as two independent oversights.",
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
    findings: [case01, case02, case03, case04, case05],
  },
  {
    id: "cognitive-walkthrough",
    chapterIndex: 1,
    eyebrow: "Area 2",
    title: "Key journeys",
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
          ["<b>Buyer Journeys</b>", "Select a customer (2)"],
          ["", "Linesheet / catalog browsing"],
          ["", "Adding items to the cart"],
          ["", "Placing an order"],
          ["", "Order tracking"],
          ["", "Payments"],
          ["", "Account preferences"],
          ["<b>Sales Rep Journeys (1)</b>", "Select a customer"],
          ["", "Create and share custom linesheets/reports"],
          ["<b>Admin Journeys</b>", "Manage users"],
          ["", "Manage reports"],
          ["", "Activity audit"],
        ],
        footnote: "(1) Every Buyer journey above also applies to Sales Reps, performed on behalf of the selected customer. (2) In Lilla P's underlying NetSuite customer model, a Buyer's app account belongs to a contact, not a customer directly — a contact tied to a single customer (the common case) has that customer selected automatically, but a contact tied to more than one customer (e.g. a buyer who works across multiple brands) must choose which one to act on, the same selection flow a Sales Rep uses on a customer's behalf.",
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
    findings: [case01, case02, case03, case04, case05],
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
    findings: [case01, case02, case03, case04, case05],
  },
];
