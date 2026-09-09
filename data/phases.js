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
// This currently covers the eight cases completed so far in this audit
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
import c03img11 from "../assets/ux-audit/navigation-structure/11-administration-manage-users-keyboard-focus.jpg";
import c03img12 from "../assets/ux-audit/navigation-structure/12-linesheets-expanded-season-list-unreachable.jpg";
import c03img13 from "../assets/ux-audit/navigation-structure/13-user-drawer-open-recent-customers.jpg";
import c03img14 from "../assets/ux-audit/navigation-structure/14-user-drawer-log-out-focused.jpg";
import c03img15 from "../assets/ux-audit/navigation-structure/15-focus-leaked-behind-open-drawer.jpg";

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

import c06img01 from "../assets/ux-audit/style-cards/01-style-cards-standard-view-default.jpg";
import c06img02 from "../assets/ux-audit/style-cards/02-style-cards-gallery-view-icons-no-change.png";
import c06img03 from "../assets/ux-audit/style-cards/03-style-cards-icon-opens-drawer-correct-color.jpg";
import c06img04 from "../assets/ux-audit/style-cards/04-style-cards-image-lightbox-single-photo.jpg";
import c06img05 from "../assets/ux-audit/style-cards/05-style-cards-standard-inline-expand-table.jpg";
import c06img06 from "../assets/ux-audit/style-cards/06-style-cards-extended-view-table.jpg";
import c06img07 from "../assets/ux-audit/style-cards/07-style-cards-standard-view-after-extended-all-expanded.jpg";

import c07img01 from "../assets/ux-audit/add-to-cart/01-drawer-black-quantity-exceeds-availability-error.jpg";
import c07img02 from "../assets/ux-audit/add-to-cart/02-drawer-black-valid-distinct-quantities-per-size.jpg";
import c07img03 from "../assets/ux-audit/add-to-cart/03-drawer-dark-navy-valid-distinct-quantities-per-size.jpg";
import c07img04 from "../assets/ux-audit/add-to-cart/04-cart-verification-both-colors-match-drawer.jpg";
import c07img05 from "../assets/ux-audit/add-to-cart/05-bulk-stepper-clamps-at-max-available-no-error.jpg";
import c07img06 from "../assets/ux-audit/add-to-cart/06-drawer-close-button-visible-focus-ring.png";
import c07img07 from "../assets/ux-audit/add-to-cart/07-add-to-cart-button-no-visible-focus-indicator.png";
import c07img08 from "../assets/ux-audit/add-to-cart/08-color-swatches-plain-divs-not-focusable.png";

// Case 08's screenshot numbering keeps the original filenames from the
// desktop pass's full 01-17 sequence (see /ux-audit-log/screenshots/
// case-08-cart-editing-order-placement) — only a representative subset
// (05-13) is promoted here, skipping 01-04 and 14-17, which document the
// delivery-date typed-input symptom that was ultimately retracted (see
// case08's Notes). No screenshots exist for the tablet retest (768px):
// this session's built-in browser has no save-to-disk mechanism for
// screenshots, unlike the Chrome extension tool used for desktop.
import c08img05 from "../assets/ux-audit/cart-editing-order-placement/05-add-delivery-creates-new-empty-group.jpg";
import c08img06 from "../assets/ux-audit/cart-editing-order-placement/06-valid-calendar-date-change-persists.jpg";
import c08img07 from "../assets/ux-audit/cart-editing-order-placement/07-move-to-delivery-blocked-30-day-window.jpg";
import c08img08 from "../assets/ux-audit/cart-editing-order-placement/08-move-guided-flow-immediately-fails.jpg";
import c08img09 from "../assets/ux-audit/cart-editing-order-placement/09-edit-quantity-persists-to-cart-row.jpg";
import c08img10 from "../assets/ux-audit/cart-editing-order-placement/10-remove-color-confirmation-dialog.jpg";
import c08img11 from "../assets/ux-audit/cart-editing-order-placement/11-duplicate-creates-second-delivery-line.jpg";
import c08img12 from "../assets/ux-audit/cart-editing-order-placement/12-duplicate-blocks-checkout-hidden-tooltip.jpg";
import c08img13 from "../assets/ux-audit/cart-editing-order-placement/13-checkout-season-minimum-validation.jpg";

const case01 = {
  id: "case-01",
  caseNumber: "01",
  title: "Login screen: cross-area review",
  status: "Issues found — no blocker on the primary path.",
  statusKind: "issue",
  // Which viewports this case's evidence actually covers — read by the
  // Chapter 1 closing slide's cases table (js/render.js,
  // renderCasesTable). Every case covers all three unless it's one of
  // the two admin-journeys cases (04, 05), which were never built with
  // a responsive/mobile treatment and so were only ever tested at
  // desktop width, by design (see each case's own Session note).
  viewports: ["desktop", "tablet", "mobile"],
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
        { label: "Priority note", value: "Medium — a silent dead end on the very first interaction available on this screen; it doesn't block a user who enters a valid email, but a user who clicks too early is given nothing to act on." },
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
        { label: "Priority note", value: "Medium-High — a simple typo is carried, unvalidated and uncorrectable, straight into a registration-request flow, which both strands the user and risks generating junk signup requests with malformed emails baked in." },
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
        { label: "Priority note", value: "Low — the wait is short and always resolves correctly on its own; this is a missing status cue, not a stuck or broken state." },
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
  viewports: ["desktop", "tablet", "mobile"],
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
        { label: "Priority note", value: "High — a reproducible, self-contradicting message on the app's single highest-traffic screen, on its single most common action (search), directly undermining trust in a genuine result the user is looking straight at." },
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
        { label: "Priority note", value: "Medium — each control behaves correctly and predictably once its meaning is known, but the same star and X glyphs mapping to different (in the star's case, bulk vs. per-item) actions on one screen risks a misclick on an action that affects every visible item at once." },
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
        { label: "Priority note", value: "Medium — the underlying content is still fully reachable (via each card's own expand caret), but a control that visibly does nothing at this width is more confusing than one that's hidden or disabled, and undermines trust in the other controls around it." },
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
        { label: "Priority note", value: "Low — both rows stay in sync and the feature works correctly either way; this is a markup/visual cleanup, not a functional defect (the same pattern recurs, and is rated the same way, on Case 06)." },
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
  status: "Issues found — a misleading section label, a data-accuracy bug on the customer-account screen, three lower-priority consistency issues, and — from a keyboard-only follow-up — a hard dead end where a keyboard-only user can't change either the selected season/lineheet or the selected customer. Original pass confirmed consistent across desktop, tablet, and mobile; the keyboard follow-up was desktop-only.",
  statusKind: "issue-high",
  viewports: ["desktop", "tablet", "mobile"],
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
  // tagged with "responsive" here. It IS tagged with Area 3's
  // "accessibility" category, added once the later keyboard-navigation
  // follow-up (Findings 6-8) turned up real, No-Pass issues there.
  categories: ["design-system", "visibility-status", "user-control-errors", "sales-rep-journeys", "buyer-journeys", "accessibility"],
  categorySummaries: {
    "design-system": "“MY ACCOUNT” in the left panel is actually the selected customer's account, not the Sales Rep's own, and the top-right user control changes its own visual identity between its open and closed states.",
    "visibility-status": "Switching the selected customer can leave the MY ACCOUNT screen showing the previous customer's real address and orders under the new customer's name — the “Recent customers” list also loads behind a loading spinner that's easy to miss.",
    "user-control-errors": "The user drawer's own close control sits at the opposite corner from where the drawer was opened, and re-clicking the trigger doesn't close it — though clicking the dimmed backdrop does, so a working fallback exists.",
    "sales-rep-journeys": "Covers “Select a customer”: picking a customer via the search box works correctly and searches the full customer base, but switching customers can leave the MY ACCOUNT screen showing the previous customer's real data under the new customer's name until the page is reloaded.",
    "buyer-journeys": "Covers “Select a customer” for a Buyer contact linked to more than one customer: the same search-box selection was tested here, and works correctly, but switching customers can leave the MY ACCOUNT screen showing the previous customer's real data under the newly selected one's name until the page is reloaded.",
    "accessibility": "A keyboard-only user can never change which season/lineheet is being viewed, and can't select a different customer from the user menu at all — neither the default “Recent customers” list nor a typed search's results can be reached by keyboard, the menu has no focus trap, and Escape doesn't close it.",
  },
  summary: "“MY ACCOUNT” opens the selected customer's account, not the Sales Rep's own, and switching customers can leave that same screen showing the previous customer's real address and orders under the new customer's name.",
  scope: [
    { label: "Area", value: "Targeted heuristic evaluation of the left navigation panel (present app-wide) and the top-right user menu: structure, grouping, label clarity, and customer-switching behavior, both expanded and collapsed, across desktop, tablet, and mobile." },
    { label: "Screen", value: "App-wide — the left navigation panel and the “Alan Jalife” user menu are present on every authenticated screen; evaluated from the Fall 2026 report and the Administration and MY ACCOUNT pages it links to." },
    { label: "Interaction boundary", value: "Desktop pass tested using the user's own real, already-authenticated Chrome session. Expanded every left-panel section and opened every sub-item that was safe to open read-only, including selecting test customers (starting with “A Line (CA)”) to confirm what “MY ACCOUNT” actually shows. A later follow-up retested customer selection via the search box specifically (not just “Recent customers”), and repeatedly switched between customers to check whether MY ACCOUNT's content refreshed correctly. A further, separate follow-up re-tested the left panel and the user menu again, desktop only, using the real browser's native Tab/Enter/Escape key handling instead of mouse clicks, to check whether both panels are actually operable without a mouse. No user was created, edited, or deleted in Manage users; no report or asset was modified in Manage reports / Manage assets; no order or payment was placed. Every customer selected during testing was deselected afterward." },
    { label: "Session", value: "Third case of this audit round. Tablet (768×1024) via Claude's built-in browser with viewport emulation, and mobile (375×812) jointly with the UX Assessment Lead due to a known click-timeout limitation, both closed out the same session; the customer-search and data-refresh follow-up was a later session, back on desktop, and the keyboard-navigation follow-up (Findings 6-8) a later session still, after this case had already been closed." },
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
      type: "steps",
      heading: "Steps — keyboard navigation (left panel and user menu, desktop)",
      items: [
        { text: "Traced the first 20 Tab stops from a fresh page load using genuine key presses (Tab, Enter, Escape), reading document.activeElement after each one rather than assuming: hamburger icon → header search box → the “Alan Jalife” user-menu trigger → three breadcrumb dropdowns → “Show Favorites” → two view-mode buttons → all seven left-panel accordion buttons in the correct order → the panel's own collapse control → a “Log out” button that also lives in the left panel → main content. Every accordion button showed a visible focus outline and correct aria-controls/aria-expanded attributes." },
        { text: "Pressed Enter on the ADMINISTRATION button: it expanded correctly, exactly as a click would.", image: c03img11, caption: "ADMINISTRATION expanded via keyboard, “Manage users” reachable and focused" },
        { text: "Checked LINESHEETS — expanded by default on page load — the same way: tabbing from its button skips straight to CUSTOM LINESHEETS, so none of its four items (Spring 2027, Holiday 2026, Fall 2026, In Stock) ever receive keyboard focus.", image: c03img12, caption: "LINESHEETS expanded; its four items are visible but unreachable by Tab" },
        { text: "Opened the user menu with a real Enter press on the trigger: the drawer opened correctly, but focus stayed on the trigger button rather than moving into the drawer.", image: c03img13, caption: "User menu open, “Recent customers” populated" },
        { text: "Traced forward from there: 15 Tab presses from the trigger pass through the rest of the page header and the whole left panel before finally reaching the drawer's own close button, then its search box, its customer list, and a “Log out” button inside the drawer.", image: c03img14, caption: "Last reachable stop inside the open drawer, “Log out” focused" },
        { text: "Typed a query into “Search by name”: the filtered results use the same non-interactive row markup as the default list, and pressing Tab from the input skips the results entirely and lands on the page's own <body> element." },
        { text: "Pressed Escape while the drawer was open: no effect. Continued tabbing past “Log out”: focus left the drawer entirely and landed on a product's own control in the grid behind it, with the drawer still visibly open.", image: c03img15, caption: "Drawer still open, focus now on the page behind it" },
        { text: "Closed the drawer with a real click to reset state cleanly, and confirmed the test account was left as found: no customer left selected, nothing added to any cart, no user/report/asset data changed." },
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
        { label: "Priority note", value: "Medium — unlike Finding 2 below, no data is ever wrong here, but a section name that reads as “my own account” when it's actually whichever customer is currently selected is a real mismatch for a Sales Rep managing dozens of accounts, not just a wording nitpick." },
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
      type: "richtext",
      heading: "Finding 6 — A keyboard-only user can never change which season/lineheet is being viewed",
      paragraphs: [
        "The left panel's seven top-level sections are, on their own, fully keyboard-operable: all seven accordion buttons are real elements, reachable via Tab in the correct top-to-bottom order, each carrying correct aria-controls and aria-expanded attributes, each showing a visible focus outline, and each toggling open/closed correctly on a real Enter key press — confirmed live on ADMINISTRATION.",
        "But whether a section's contents are reachable once expanded turns out to depend entirely on which section it is, and the one that's open by default — LINESHEETS — is one of the ones that fails. Its four items (Spring 2027, Holiday 2026, Fall 2026, In Stock) are plain list rows with no tabindex, role, or href at all; tabbing from the LINESHEETS button skips straight past all four and lands on the CUSTOM LINESHEETS button next, confirmed live via a real Tab trace. A mouse user can click any of the four freely; a keyboard-only user can never reach any of them — meaning they can never change which season or lineheet they're looking at, only ever view whichever one the report happened to load with.",
        "This isn't a blanket failure of the accordion pattern itself: ADMINISTRATION's own three items (Manage users, Manage reports, Manage assets) use tabindex=\"0\" on the same kind of list row, are genuinely reachable via Tab right after their section's button, and activate correctly on Enter — confirmed live. The fix pattern already exists elsewhere in this same panel; it just wasn't applied to LINESHEETS' own list.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "User control and freedom; accessibility (WCAG 2.1.1 Keyboard — all functionality operable through a keyboard interface)." },
        { label: "Suggested direction", value: "Add tabindex=\"0\" (and ideally a role such as option or menuitem, with a keydown handler for Enter/Space) to each item inside LINESHEETS' season list, matching the pattern ADMINISTRATION's own sub-items already use. Worth a quick audit of the other four sections too, since this case only directly tested LINESHEETS and ADMINISTRATION's contents against each other." },
        { label: "Priority note", value: "High — this is a genuine, reproducible dead end for a core task (choosing which season/lineheet to view), not just added friction, and it affects the one section that's open on every fresh page load." },
      ],
    },
    {
      type: "richtext",
      heading: "Finding 7 — Opening the user menu doesn't move focus into it, and reaching its own controls means tabbing through the page behind it first",
      paragraphs: [
        "The “Alan Jalife” trigger that opens the top-right user menu is itself reachable early and cleanly — the 3rd Tab stop from a fresh page load — and opens the drawer correctly on a real Enter press. From there, though, keyboard behavior diverges from what a dialog-like panel would normally do.",
        "Confirmed live: pressing Enter on the trigger opens the drawer but leaves focus exactly where it was, on the trigger button itself — it does not move into the drawer's own content (e.g., its search box), which is the behavior a screen-reader or keyboard user would expect from a panel that just took over part of the screen. Pressing Tab from there goes to “Fall 2026”, one of the breadcrumb dropdowns in the main page header — a control that has nothing to do with the drawer and sits behind/beside it. Continuing the trace, 15 Tab presses from the trigger pass through the rest of the header and the whole left panel before finally reaching the drawer's own close button, and only then its search box.",
        "In other words, a keyboard user who opens this menu meaning to search for or select a customer has to tab past most of the page's other controls first, none of which are visually inside the drawer, several of which the drawer now sits in front of. The trigger button also carries no aria-expanded or aria-haspopup attribute, so a screen reader gives no indication in advance that activating it opens anything at all.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Visibility of system status; user control and freedom; accessibility (focus order should follow a logical, predictable sequence — WCAG 2.4.3)." },
        { label: "Suggested direction", value: "When the drawer opens, move focus to its first focusable element (the search box) rather than leaving it on the trigger. Add aria-expanded and aria-haspopup=\"dialog\" (or similar) to the trigger button so its behavior is announced in advance." },
        { label: "Priority note", value: "Medium — a real, confirmed friction and focus-order problem, and inconsistent with how a panel like this is expected to behave, but a patient keyboard user can still eventually reach the drawer's own controls by continuing to tab forward." },
      ],
    },
    {
      type: "richtext",
      heading: "Finding 8 — Inside the open user menu, no customer can actually be selected by keyboard, and the panel has no focus trap or Escape support",
      paragraphs: [
        "Once a keyboard user does reach the drawer's own content (see Finding 7), the core task it exists for — picking a different customer — turns out to be unreachable by keyboard entirely, and the panel itself doesn't behave like a modal/dialog in several other ways that compound the problem.",
        "Confirmed live, in order: the “Recent customers” list receives focus as a whole (Chrome does this automatically for any scrollable region, to support arrow-key scrolling), but none of its individual customer rows do — each is a plain list row with no tabindex, role, or href, so tabbing once more from the list skips every customer name and lands directly on “Log out”. The “Search by name” box works correctly by keyboard as a text input, but its filtered results use the exact same non-interactive row markup — worse, pressing Tab while a result list is open doesn't even reach the list container: focus leaves the input and lands on the page's own <body> element, so a keyboard user who searched for a customer has no way to Tab into any of the matches at all.",
        "Together, this means a keyboard-only Sales Rep cannot select a different customer from this panel by any path — not from Recent Customers, and not from a search — even though both paths work correctly and are genuinely useful for a mouse user. Pressing Escape while the drawer is open has no effect — it doesn't close, and focus doesn't move; there's no keyboard equivalent of the backdrop click that Finding 5 already confirmed closes the drawer correctly with a mouse. Continuing to Tab forward past “Log out” moves focus out of the drawer entirely and into the product grid behind it, confirmed via a screenshot showing the drawer still visibly open while a product's own control, partially behind/beside it, now carries the visible focus ring — the drawer has no focus trap.",
        "The drawer's container has no role=\"dialog\" or aria-modal=\"true\", and its own close (“X”) button has no accessible label — the same “unlabeled icon control” gap Finding 4 already flagged on this drawer's trigger extends to its close control too. Together, these missing semantics likely explain why none of the keyboard behaviors above work the way a properly-marked-up dialog's would.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "User control and freedom; accessibility (WCAG 2.1.1 Keyboard, 2.1.2 No Keyboard Trap, 2.4.3 Focus Order, 4.1.2 Name, Role, Value)." },
        { label: "Suggested direction", value: "Give each customer row (in both the default list and search results) a tabindex=\"0\" and a real interactive role, with an Enter/Space handler that mirrors the existing click handler. Mark the drawer container role=\"dialog\" and aria-modal=\"true\", label its close button, trap Tab/Shift+Tab within it while open, and wire Escape to close it — the same set of fixes a standard accessible-dialog pattern would already cover." },
        { label: "Priority note", value: "High — combined with Finding 6, this means a keyboard-only user has no way to change either of the two things this app's whole navigation model revolves around (which season/lineheet, and which customer), with no error message or alternative path offered in either case." },
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
        "Keyboard navigation (desktop): the left panel's seven accordion headers are a genuinely well-built keyboard pattern — real buttons, correct Tab order matching the visual layout, correct aria-controls/aria-expanded, visible focus outlines, and correct Enter-key activation, confirmed live. ADMINISTRATION's three sub-items go a step further and are themselves properly keyboard-reachable and operable — proof the fully-accessible version of this pattern already exists in the app and just needs to be applied consistently (see Finding 6). The “Search by name” box in the user menu also remains a normal, fully keyboard-operable text input even under this stricter test.",
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
        "The keyboard-navigation follow-up (Findings 6-8) was requested separately from this case's original close, once the audit noticed keyboard operability of the left panel and user menu hadn't been directly tested — desktop only, per that request; tablet/mobile keyboard behavior (e.g. an external keyboard paired with a tablet) is out of scope here and untested.",
        "A methodology note for future keyboard-navigation testing on this app: calling .blur() on the active element does not reliably reset the browser's own Tab-sequence starting point back to the top of the page — a subsequent Tab press can resume from wherever the previous trace left off internally, even though nothing visibly has focus. A full page reload before each fresh Tab trace was the only reliable way found to get a consistent, reproducible starting point.",
        "Not investigated further, but noticed in passing while tracing focus order: an earlier interaction that opened a product's quick-view panel and then closed it left that panel's own header buttons (close, favorite) still present in the page's Tab order, positioned far outside the visible viewport rather than removed or hidden from it. This is a different panel from the two this case was scoped to test, so it wasn't pursued as its own finding here, but it points at the same underlying gap as Finding 8 (panels not fully removing themselves from the accessibility tree when closed) and may be worth a dedicated look in a future case.",
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
  // Desktop only, by design — this admin screen was never built with a
  // responsive/mobile treatment (see Finding 5 and this case's own
  // Session note).
  viewports: ["desktop"],
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
  // Desktop only, by design — same known gap as Case 04 (see Finding 6
  // and this case's own Session note).
  viewports: ["desktop"],
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

const case06 = {
  id: "case-06",
  caseNumber: "06",
  title: "Style cards: view formats, color browsing, and icon consistency",
  status: "Issues found — minor gaps only: color swatches don't track or jump to the browsed photo, tablet needs one extra click to browse colors, mobile lists “Show Favorites” twice, and two icons sit outside the app's real icon system. Everything else — the three View formats, and color/size/price data — works correctly and agrees exactly across desktop, tablet, and mobile.",
  statusKind: "issue",
  viewports: ["desktop", "tablet", "mobile"],
  // Findings 2 (swatch click doesn't jump to a color) and 5 (drawer-entry
  // and mobile "..." icons sit outside the app's real icon system) are
  // consistency-and-standards / match-with-the-real-world gaps. Finding 1
  // (swatches don't track the browsed color) is a visibility-of-status
  // gap. Findings 3 (tablet: no hover arrows, gallery needed) and 4
  // (mobile: duplicated "Show Favorites") are Area 3's "responsive"
  // category, the second per the UX Assessment Lead's own request. Also
  // carries both of Area 2's Buyer Journeys and Sales Rep Journeys — this
  // case covers "Linesheet / catalog browsing", and every buyer-facing
  // journey applies equally to Sales Reps acting on a customer's behalf
  // (see the Key Journeys table). No accessibility-specific issue was
  // found, so that category isn't listed here.
  categories: ["design-system", "visibility-status", "responsive", "buyer-journeys", "sales-rep-journeys"],
  categorySummaries: {
    "design-system": "Clicking a color swatch doesn't jump to that color's photo the way it visually implies, and two icons — the card's drawer-entry icon and mobile's “...” menu icon — turn out to be static images outside the app's real icon system, with a measurable color mismatch and, across the wider product, three unrelated “more options” glyphs rather than one shared standard.",
    "visibility-status": "The color-swatch row never reflects which color is currently showing as a card's photos are paged through with the hover arrows or the lightbox.",
    "responsive": "At 768px, browsing between colors from the grid takes one extra click (opening the image gallery) since the card's hover arrows don't appear at this width; at 375px, the “...” menu lists “Show Favorites” twice, though both stay correctly in sync.",
    "buyer-journeys": "Covers “Linesheet / catalog browsing”: all three View formats, and a style's full color/size/price data, work correctly and agree exactly across desktop, tablet, and mobile — the gaps found are all small efficiency or consistency issues, not blockers.",
    "sales-rep-journeys": "Covers “Linesheet / catalog browsing” performed by a Sales Rep on behalf of a selected customer — the same screens, controls, and findings as the Buyer Journeys entry above, since a Sales Rep browses the identical catalog.",
  },
  summary: "All three View formats, and a style's full color range, work correctly and agree exactly across desktop, tablet, and mobile — but color swatches don't track or jump to the color being browsed, tablet needs one extra click to browse colors, and two of the card's icons turn out to sit outside the app's real icon system.",
  scope: [
    { label: "Area", value: "Card-level testing of style cards on a linesheet report: the three advertised View formats (Gallery, Standard, Extended), whether color/size/availability/price data agrees across formats and widths, whether a style's photos can be browsed and enlarged for each of its available colors, and how a card hands off into the right-side detail drawer. The detail drawer's own content and behavior are explicitly out of scope here — that's Case 07. A closing icon-consistency check, added at the UX Assessment Lead's request before closing the case, is also included." },
    { label: "Screen", value: "/reports/3771 (the Fall 2026 linesheet report), the same style-card grid tested in Case 02, this time focused on the cards themselves rather than the report's search/header controls." },
    { label: "Interaction boundary", value: "Desktop tested using the user's own real, already-authenticated Chrome session; the tablet (768×1024) and mobile (375×812) follow-ups both used Claude's built-in browser with true viewport emulation, also on an already-authenticated session. Purely read-only aside from a few deliberate, reverted checks: a style was favorited (once per width) to confirm the star control and the “Show Favorites” filter work together, then un-favorited immediately after each time. A “SELECT ALL” confirmation dialog was triggered once by mistake during the tablet pass and cancelled without confirming. No quantities were entered and no cart or order action was taken. The detail drawer was opened only to confirm its two entry points land on the right product and color." },
    { label: "Session", value: "Sixth case of this audit round, covering desktop, tablet (768px), and mobile (375px). An initial desktop pass and a separate initial tablet pass each misread part of this case's behavior; both were corrected after the UX Assessment Lead flagged them, and the corrected, verified behavior is what's documented below (see Notes). The mobile follow-up used the assessment methodology's standard collaborative approach for this browser's sub-768px click limitation." },
  ],
  blocks: [
    {
      type: "steps",
      heading: "Steps — the three View formats (desktop)",
      items: [
        { text: "Confirmed via the page's own accessibility labels that the three icons next to “View” are, in order: “Gallery view”, “Standard card view”, and “Extended list view”. On a fresh page load, Gallery view is the active, default format: a photo-forward card per style, with a color-swatch row, name, SKU, and price beneath it, several cards per row at this width.", image: c06img02, caption: "The three View icons: Gallery, Standard, and Extended" },
        { text: "Switched to Extended list view: one row per style, full-width, one card per line — the color name appears as its own text label per row, price is repeated on every row, and per-size quantities plus an EXPCT. (expected date) column are shown for every color.", image: c06img06, caption: "Extended list view — one full-width row per style, with the complete inline table" },
        { text: "Switched to Standard card view: each card shows its own inline per-color size/availability breakdown beneath the photo, more compact than Extended — no color-name text label per row (just the swatch color chip), and the price shown once at the top of the card rather than repeated per row.", image: c06img01, caption: "Standard card view — swatch row, chevron, and price shown per card" },
        { text: "Switched back to Gallery view from Standard: correctly returned to the collapsed, photo-forward layout, confirming Gallery does work as a real, distinct format — it simply produces no visible change when clicked while already active (the case on a fresh page load), which is what first read as broken. Re-verified the active-state highlight moves correctly between all three icons as each is clicked." },
      ],
    },
    {
      type: "steps",
      heading: "Steps — image browsing, swatches, and entry points (desktop)",
      items: [
        { text: "Hovering a card's photo (in both Gallery and Standard view) revealed a fullscreen/expand icon top-left, a favorite star top-right, and left/right navigation arrows — available before any click." },
        { text: "On the “3/4 Sleeve Boatneck” (PA1136) card, defaulting to Black, clicked the right arrow repeatedly while hovering: image 2/12 showed a back view still in Black, but image 3/12 switched the garment to Dark Navy (a front view), and image 4/12 showed Dark Navy from the back — confirming the arrows page through multiple angles per color and then continue into the next available color's own photos, all within one sequential set." },
        { text: "Checked the color-swatch row while the card was showing Dark Navy (via the arrows): none of the swatch chips showed any highlight or selected state reflecting Dark Navy — the swatch row looks identical regardless of which color the arrows have navigated to (see Finding 1)." },
        { text: "Clicked directly on a color swatch chip (e.g. Rope, on a card already showing Black): this did not jump the photo to Rope — it only toggled the same inline size/availability table that the chevron opens, leaving the currently-displayed photo unchanged (see Finding 2)." },
        { text: "Opened the lightbox by clicking a card's photo directly: same content as the hover-arrow browsing, in a larger overlay, with its own left/right arrows, page counter, and favorite star — paging through it confirmed it also crosses from one color into the next, matching the card-level hover behavior.", image: c06img04, caption: "Full-screen image lightbox — its own arrows, page counter, and favorite star" },
        { text: "Clicked the small icon to the right of the price at the bottom of the “Short Sleeve Crew” card: opened the right-side detail drawer, correctly showing “Short Sleeve Crew / PA1142” with “Dark Navy” pre-selected — matching the color the card was displaying at the time. The drawer's own contents were not evaluated further here (Case 07).", image: c06img03, caption: "Card icon opens the detail drawer, correctly pre-scoped to Dark Navy" },
        { text: "Hovering a card and clicking its favorite star toggled it on (confirmed via a close-up check that the star filled solid); toggling the page's “Show Favorites” control at top right correctly filtered the grid down to only that one favorited style, and its own label changed to “Show All” while active. Reverted both afterward to leave the report as found." },
        { text: "Compared Standard view's inline per-color table against Extended view's full table for two styles: every color, every per-size quantity, every EXPCT. date, and every price matched exactly, including both views correctly showing two separate rows for a color with two incoming inventory batches (Black arriving both “In Stock” and again on a later “Aug 01” date).", image: c06img05, caption: "Standard view's inline table — a color with two incoming batches shown as two distinct rows, matching Extended exactly" },
        { text: "Re-checked the same comparison across all six styles on the row at once: Standard's inline tables (once expanded) and Extended's own table agreed on every figure, style by style.", image: c06img07, caption: "Standard view, six cards with inline tables expanded — matches Extended view's numbers exactly" },
      ],
    },
    {
      type: "richtext",
      heading: "Finding 1 — The color swatches don't indicate which color is currently being shown via the arrow-browsed photos",
      paragraphs: [
        "Paging through a card's photos with the hover arrows (or the lightbox) does cross from one available color into the next, but nothing in the swatch row reflects that: the swatches look the same — no highlight, border, or other selected-state change — no matter which color the visible photo has moved to. A user relying on the swatch row as a quick reference for “what color am I looking at” has to instead read that from the photo itself.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Visibility of system status (the interface has this information — it knows which color is showing — but doesn't surface it in the one place a user would naturally look)." },
        { label: "Suggested direction", value: "Highlight or otherwise mark whichever swatch corresponds to the color currently shown by the arrows/lightbox, and update it live as the user pages through." },
        { label: "Priority note", value: "Low — this doesn't block anything, since the photo itself always shows the true current color; it's a missed opportunity for a clearer status cue, not an error." },
      ],
    },
    {
      type: "richtext",
      heading: "Finding 2 — Clicking a color swatch doesn't jump to that color's photo directly",
      paragraphs: [
        "The swatches look like they should let you pick a color and see it immediately, but clicking one only opens or closes the inline size/availability table — it has no effect on which photo is displayed. To actually see a specific color's photo, the only path found on desktop was paging through the hover arrows (or the lightbox) sequentially from wherever the card currently is, which could mean several clicks for a color photographed later in the sequence.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Match between system and the real world (a row of clickable-looking color swatches implies clicking one shows that color); flexibility and efficiency of use." },
        { label: "Suggested direction", value: "Consider wiring a swatch click to jump the photo (and, ideally, the arrow position) directly to that color's first photo, rather than requiring sequential paging to reach it — mobile's own swatch behavior, see Positive observations, already does something close to this." },
        { label: "Priority note", value: "Low — full color browsing is confirmed possible via the arrows, so nothing is actually inaccessible; this is an efficiency gap, not a blocker." },
      ],
    },
    {
      type: "steps",
      heading: "Steps — tablet follow-up (768×1024)",
      items: [
        { text: "Resized the viewport to 768px and confirmed the report loads with the same left panel, header, and grid structure as desktop, just narrower." },
        { text: "Checked the three View icons' accessibility labels at this width: “Gallery view”, “One column list view”, and “Extended list view” — the same three buttons as desktop, but the middle one's identity changes from “Standard card view” to “One column list view”. A first pass at this test wrongly concluded the three buttons all render the same layout at 768px; that didn't survive a careful retest and is retracted below (see Notes)." },
        { text: "Retested each button individually, confirming the underlying view actually changed each time (not just re-clicking a button already active) before screenshotting. The three views are genuinely distinct at 768px, adapted to the narrower width: Gallery shows two collapsed cards per row; One column list shows the same collapsed card content as Gallery but one to a row at full width; Extended shows one row per style with the full inline table next to the photo, matching desktop's Extended content exactly." },
        { text: "Hovered a card's photo in both Gallery and One column list view: a fullscreen icon and a favorite star appeared, same as desktop — but not the left/right color-browsing arrows that appear on desktop card hover. Hovering Extended view's photo shows neither icon, but the photo remains directly clickable." },
        { text: "Clicking a card's photo (or its fullscreen icon, where present) opens the same full-screen image gallery in all three views — a distinct overlay from the detail drawer, per the UX Assessment Lead's clarification, with its own page counter and left/right arrows. Paging it forward crossed from Black into Dark Navy on the “3/4 Sleeve Boatneck” card, confirming full color-to-color browsing still works at this width — just reached through this gallery rather than through hover-arrows on the card itself." },
        { text: "Also found, on a closer look at this gallery: it has its own favorite star, clearly visible and functional — clicking it filled solid immediately. This contradicts an earlier, wrong reading of this same control as invisible/unreachable at tablet width (see Notes); it's genuinely visible, just positioned in a way a first pass mistook as hidden." },
        { text: "Clicked the small icon next to the price at the bottom of a Gallery-view card, and separately the style's name text: both opened the right-side detail drawer correctly, scoped to the right product and color, in both Gallery and One column list view." },
        { text: "Tested “Show Favorites”: clicking the header star by mistake first triggered a “SELECT ALL” confirmation dialog (favorite everything) — cancelled without confirming, the same header icon-reuse pattern already flagged in Case 02. Favorited a style instead via the card's own hover-revealed star, then confirmed “Show Favorites” (label swapping to “Show All”) filtered the grid down to just that card. Reverted both afterward." },
      ],
    },
    {
      type: "richtext",
      heading: "Finding 3 — At 768px, hovering a card's photo shows the fullscreen icon and favorite star but not the color-browsing arrows; browsing colors from the grid means opening the image gallery first",
      paragraphs: [
        "On desktop, hovering a card's photo reveals a fullscreen icon, a favorite star, and left/right arrows that page directly through every available color's photos. At 768px, the same hover still reveals the fullscreen icon and the star, but not the arrows — the only way to page from one color's photo to the next is to first open the full-screen image gallery (via the fullscreen icon, or by clicking the photo directly), which does have working arrows and correctly crosses between colors. So the capability itself is fully intact at this width; what's missing is the quick, no-extra-click preview that hovering gives on desktop.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Consistency across breakpoints; efficiency of use (an extra step — opening the gallery — is required at 768px for something desktop does in place)." },
        { label: "Suggested direction", value: "Low-effort option: no change needed, since the gallery is one click away and clearly discoverable. If more parity with desktop is wanted, consider showing simplified arrows directly on the card at this width too, sized for a narrower layout." },
        { label: "Priority note", value: "Low — nothing is hidden or broken; a user can still reach every color's photo in one extra click via the gallery, and that gallery is easy to find." },
      ],
    },
    {
      type: "steps",
      heading: "Steps — mobile follow-up (375×812)",
      items: [
        { text: "Resized the viewport to 375px and confirmed the report loads adapted the same way Case 03 already documented for this width: the left navigation collapses behind a hamburger icon, and the header's favorite/star/X controls collapse behind a “...” (more options) icon." },
        { text: "Hit the same click-timeout tooling limitation already documented in the assessment methodology for any emulated width under 768px: every direct tap via the automated click action reliably timed out, while scrolling, typing, and screenshots kept working normally. Per the established collaborative method, the UX Assessment Lead performed the first tap (opening the “...” menu) directly; for the remainder of this pass, dispatching the equivalent click event through the page's own script console proved a reliable stand-in for a manual tap, so the rest of the pass — view switching, swatches, the image gallery, favoriting, and both drawer entry points — was completed without further manual taps." },
        { text: "The UX Assessment Lead tapped the “...” (more options) icon and found “Show Favorites” listed twice, both doing the same thing. Confirmed via the page's own markup: the dropdown genuinely renders two separate “Show Favorites” toggle rows, both sharing the same (invalid, duplicated) HTML id, both wired to the same underlying state — toggling either one toggles both together, in sync, and correctly filters the grid (see Finding 4)." },
        { text: "Found the three View buttons live inside the hamburger's slide-out panel at this width, not in the main content header. Opening that panel shows only two of the three: Gallery (the active default) and Extended — One column list isn't shown at all here. This lines up with Gallery already rendering exactly one full-width card per row by default at 375px — the same thing One column list exists to force at wider widths — so hiding it reads as a sensible, deliberate simplification rather than a bug." },
        { text: "Switched to Extended view: confirmed it renders the same full inline table seen on desktop and tablet, adapted to a single narrow column. Switched back to Gallery afterward." },
        { text: "Checked a Gallery card's photo without any hover step (touch has no hover state): the fullscreen icon and the favorite star are shown directly, by default, with no interaction needed — notably better than tablet's hover-only reveal of these same two icons." },
        { text: "Tapped a card's photo to open the full-screen image gallery: opened correctly as a complete overlay (unlike tablet, where the left nav panel remained partly visible behind it), with a visible page counter, left/right arrows, and its own favorite star. Paging forward crossed from Black to Dark Navy on the “3/4 Sleeve Boatneck” card, confirming full color-to-color browsing works the same as desktop and tablet." },
        { text: "Expanded the chevron on a Gallery card: the inline size/availability table opened correctly, with every figure matching desktop and tablet exactly, and — like tablet — showing the color name as its own text label per row." },
        { text: "Tapped both of the card's entry points into the detail drawer — the price-row icon, and the style's name text: both opened the same correctly-scoped drawer as on desktop and tablet." },
        { text: "Tapped a color swatch directly (tried twice, with two different colors): unlike desktop and tablet, where a swatch click only toggles the inline table, at 375px tapping a swatch opens the detail drawer directly, pre-scoped to that exact color — confirmed reproducible both times (see Positive observations)." },
      ],
    },
    {
      type: "richtext",
      heading: "Finding 4 — The mobile “...” menu lists “Show Favorites” twice",
      paragraphs: [
        "Opening the “...” (more options) menu at 375px shows two separate “Show Favorites” toggle rows, one directly under the other, both doing exactly the same thing. Checked in the page's own markup: both rows are genuinely separate elements, sharing the same HTML id — itself invalid markup — and both are wired to the same underlying state, so they never go out of sync with each other; toggling either one toggles both, and the grid filters correctly either way. Nothing is functionally broken, but a user opening this menu sees a redundant, slightly confusing duplicate control.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Consistency and standards; error prevention (a duplicated toggle invites doubt about whether the two controls really are the same, even though they are)." },
        { label: "Suggested direction", value: "Remove the duplicate row from the mobile dropdown's markup, keeping a single “Show Favorites” entry there." },
        { label: "Priority note", value: "Low — both toggles stay in sync and the feature works correctly either way; this is a visual/markup cleanup, not a functional defect." },
      ],
    },
    {
      type: "steps",
      heading: "Steps — icon design consistency (cross-width)",
      items: [
        { text: "Before closing this case, the UX Assessment Lead flagged two specific icons by eye — the card's drawer-entry icon (next to the price on every card) and the mobile report header's “...” icon — as visually out of step with the rest of the interface: a different color and heavier line weight on the first, a glyph that “feels out of system” on the second. Rather than answering from a visual impression alone, both were inspected directly in the page's own code." },
        { text: "Drawer icon: found it's rendered via <img src=\"assets/images/icons/style_drawer.svg\"> — a static image reference, not a live vector. Fetched that SVG file directly: its shapes are solid filled geometry (no stroke at all), with the fill color hard-coded inside the file, fill=\"#90807B\". Compared against the card's other icons in the same corner — the favorite star and the fullscreen icon — both inline SVGs using stroke=\"currentColor\" at a thin 1.5 stroke-width, which inherit the app's live icon color, computed as rgb(92, 79, 72) (#5C4F48) wherever checked." },
        { text: "Mobile “...” icon: found it's <img src=\"assets/images/icons/small_actions.png\" alt=\"Actions\"> inside a circular button — a PNG raster, not a vector at all. For comparison, checked how the rest of the app's real icon system works: a reusable <svg-icon src=\"....svg\"> Angular component that renders inline, resolution-independent vector icons (used for the same panel's close and info icons) — a structurally different, more capable mechanism than a plain <img>." },
        { text: "Checked whether an equivalent “more options” icon exists anywhere else in the product, to test whether this glyph is unique to this one spot. Navigated to ADMINISTRATION → Manage Reports (Case 05) and inspected its row-level kebab icon: it loads yet another distinct file, context_menu_dots_32x32.png — vertical dots with no circular background, visually different from the mobile “...” icon's horizontal dots in a circle. Case 04 previously documented that Manage Users' own Actions column uses a third, completely different glyph (a single edit pencil) for the same column label." },
      ],
    },
    {
      type: "richtext",
      heading: "Finding 5 — Two icons on this screen (and a third documented elsewhere) don't participate in the app's real icon system, with measurable visual consequences",
      paragraphs: [
        "Two specific icons the UX Assessment Lead flagged by eye both check out as genuinely inconsistent with the rest of the interface, for a concrete, shared technical reason: both are static image files (one SVG loaded via <img>, one PNG) instead of the inline, currentColor-aware vector icons the rest of the app's icon system uses.",
        "The card's drawer-entry icon (style_drawer.svg, loaded via <img>) has its fill color hard-coded inside the file itself (#90807B), which does not match the app's actual live icon color (#5C4F48, computed from the neighboring favorite-star and expand icons) — a real, measurable color mismatch, not just a subjective impression. It's also drawn as solid filled shapes rather than the thin stroke-outline style the neighboring icons use, which is what reads as a “heavier line” even though technically there's no stroke at all, just solid fill. Because it's a flat image rather than a live vector, it also can never pick up a hover state, an active-state color, or a future theme change the way the rest of the icon system automatically does.",
        "The mobile report header's “...” icon (small_actions.png) is a PNG raster inside a circular button, structurally outside the app's <svg-icon>-based icon system used elsewhere on the same screen. Checking whether this same “more options” concept appears elsewhere in the product turned up not one consistent icon but three unrelated ones: this circled-horizontal-dots PNG on mobile, a different vertical-dots PNG with no circle on Manage Reports' row-level Actions column, and a plain edit-pencil icon on Manage Users' own Actions column (Case 04). This isn't one icon that drifted from a shared standard — there's no single shared “more options” icon in the product to drift from in the first place.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Consistency and standards (both the UX Assessment Lead's specific catches, and the broader pattern of three different “more options” glyphs found across screens); recognition over recall (a solid, differently-colored glyph and a uniquely-styled “...” button both ask the user to learn one-off visual meanings rather than recognizing a pattern already established elsewhere in the product)." },
        { label: "Suggested direction", value: "Bring the drawer-entry icon into the same inline-SVG icon system as the rest of the card (matching its stroke weight and letting it inherit the live icon color via currentColor) rather than loading it as a static image. Separately, standardize on one “more options” icon and reuse it everywhere the product needs that concept — mobile's report header, Manage Reports' row actions, and Manage Users' row actions — instead of the three unrelated glyphs currently in use." },
        { label: "Priority note", value: "Low — nothing here is broken or blocks a task; this is a visual-consistency and design-system finding, worth fixing as part of a broader icon cleanup rather than urgently." },
      ],
    },
    {
      type: "list",
      heading: "Positive observations",
      items: [
        "All three View formats work correctly and are each genuinely distinct at every width tested — desktop's Gallery/Standard/Extended, and tablet's Gallery/One column list/Extended — and switching between them, in every direction, correctly updates both the layout and the active-state highlight every time.",
        "A style's photos across every one of its available colors can be browsed directly from the card at every width — no need to open the drawer just to see what a style looks like in a different color — via desktop's hover arrows, or via the full-screen image gallery on tablet and mobile.",
        "The full-screen image gallery is a clean, working, and clearly separate feature from the detail drawer at every width, with its own page counter, left/right arrows that correctly cross between colors, and its own visible, working favorite star — including at 375px, where it renders as a complete overlay rather than tablet's partial one.",
        "Standard view's inline per-color table and Extended view's full table agree exactly on every figure checked — same colors, same per-size quantities, same EXPCT. dates, and the same price — across multiple styles and all three widths, including correctly handling a color with two separate incoming inventory batches as two distinct rows.",
        "The favorite star and “Show Favorites” filter work correctly together end to end at every width: starring a card immediately reflects as a filled star, the filter narrows the grid to just the favorited item(s), and the filter's own label swaps to describe its next action (“Show Favorites” ↔ “Show All”).",
        "The small icon next to a card's price, and the card's own name/photo, both reliably open the right-side detail drawer, correctly scoped to the exact product and color the card was displaying — confirmed at all three widths.",
        "Two touch-appropriate adaptations at 375px stood out as genuine improvements over the wider breakpoints: the fullscreen icon and favorite star show on a card by default (no hover needed), and tapping a color swatch jumps straight into the detail drawer pre-scoped to that color — arguably a better resolution of Finding 2 (swatches not jumping to a color) than either desktop or tablet offer, even though it opens the drawer rather than just updating the card's photo.",
        "Hiding the “One column list” view button at 375px (leaving only Gallery and Extended) lines up with Gallery already rendering as a single full-width card per row by default there — a sensible simplification rather than a missing feature.",
      ],
    },
    {
      type: "richtext",
      heading: "Notes / follow-up needed",
      paragraphs: [
        "This case's first desktop pass drew two conclusions the UX Assessment Lead corrected after review, both verified and folded into this write-up: “Gallery view” was initially reported as non-functional — in fact it's the default view, so clicking it while already active correctly produces no change, while switching to it from Standard or Extended does change the layout. And a style's other colors were initially reported as unreachable from the card — in fact hovering a card's photo reveals left/right arrows that page through every available color's photos; the swatches themselves just don't drive this (see Finding 2).",
        "The tablet follow-up itself needed a correction, caught by the UX Assessment Lead. The first tablet pass reported all three View buttons rendering identically at 768px, and the card-hover color arrows and the gallery's favorite star both being invisible/unreachable at this width. On retest, none of that held up: the View buttons genuinely differ (Finding 3); the color-browsing arrows are reachable one click away via the gallery, which itself has a clearly visible, working favorite star. The root cause was methodological — the first pass's clicks on the View buttons weren't reliably registering, silently landing back on whatever view was already active, which produced consistently identical screenshots that read as “no distinction” rather than as a tooling problem. The retest fixed this by checking the page's actual underlying state (via a script) after each click, not just trusting the screenshot, before drawing any conclusion — a lesson worth carrying into future viewport-emulation passes.",
        "This case deliberately did not evaluate the detail drawer's own content, fields, or behavior once opened — confirming only that the two card-level entry points correctly open it. Full drawer evaluation is Case 07.",
        "Screenshots could not be saved as evidence for the tablet or mobile follow-ups: the built-in browser pane's screenshot tool doesn't currently support cropping a region to a file (region zoom calls returned the full, uncropped viewport instead), so those two sections rely on the step-by-step written account above, cross-checked against real page state at each step, rather than saved images.",
        "The mobile (375px) follow-up was done jointly with the UX Assessment Lead per the assessment methodology's documented collaborative approach for this browser's known sub-768px click limitation — the Lead performed the first tap, and dispatching click events through the page's own script console reliably handled the rest of the pass.",
        "A fourth view-related detail exists that this case didn't test: at wider desktop widths (around 1280px), a fourth View button appears alongside the three tested here. Not necessarily an issue, but worth a dedicated look to document what it does and at what exact width it appears — flagged as a candidate for its own small follow-up case rather than reopening this one.",
        "This case's three widths (desktop, tablet, mobile) are now all covered for style cards, plus a targeted icon-consistency check the UX Assessment Lead asked for before closing (Finding 5). Case 06 is now closed.",
      ],
    },
  ],
};

const case07 = {
  id: "case-07",
  caseNumber: "07",
  title: "Adding to cart: quantities by size and color, and cart verification",
  status: "Issues found — five gaps, none blocking the core flow. The full journey — browsing to a style, opening its drawer, entering different quantities across sizes and colors, adding to cart, and verifying the cart matches exactly — works correctly end to end, confirmed identically at desktop, 768px tablet, and 375px mobile widths. The app also enforces each size's real availability precisely (current stock plus a known incoming batch, right down to the unit) before Add to Cart or Update Quantity can be used — but exceeding it by typing a number gives only a red border, with no message anywhere explaining what happened or what the real maximum is (reproduced at every width). A desktop-only accessibility pass on the same drawer found its color swatches have no keyboard path at all, and its images and two of its most-used controls lack accessible names or a visible focus indicator. Tablet testing surfaced the favorite star's dual role as a cart-membership toggle — confirmed deliberate business logic, not a bug, but with un-favoriting confirmed not to actually persist. A desktop-only follow-up found the header's cart icon is scoped to whichever report is currently open, hiding real, unsubmitted order value the moment a different report is opened.",
  statusKind: "issue",
  viewports: ["desktop", "tablet", "mobile"],
  // Finding 1 (the availability-limit error has no explanation, only a
  // red border) is a user-control-and-errors gap. Findings 2 and 3
  // (keyboard-inaccessible color swatches; missing alt text and no
  // visible focus indicator) are Area 3's accessibility category. Finding
  // 4 (the favorite star's meaning departs from its near-universal
  // "bookmark" convention, and un-favoriting doesn't persist) touches
  // both design-system (match with the real world) and visibility-status
  // (the visible state after a click doesn't match what's actually
  // persisted). Finding 5 (the header cart icon hides real pending order
  // value once a different report is open) is also visibility-status.
  // Also carries both of Area 2's Buyer Journeys and Sales Rep Journeys —
  // this case covers "Adding items to the cart", and every buyer-facing
  // journey applies equally to Sales Reps acting on a customer's behalf
  // (see the Key Journeys table). No responsive-specific issue was found
  // (every result matched exactly across all three widths), so that
  // category isn't listed here.
  categories: ["user-control-errors", "accessibility", "design-system", "visibility-status", "buyer-journeys", "sales-rep-journeys"],
  categorySummaries: {
    "user-control-errors": "Typing a quantity above a size's real, precisely-enforced availability limit gives no explanation anywhere — just a red border and a disabled button, with no message saying what happened or what the real maximum is. The drawer's own “+” stepper controls don't share this problem: they simply stop at the true maximum instead of ever producing an invalid number.",
    "accessibility": "The drawer's five color swatches have no keyboard path at all — a complete dead end for choosing a color without a mouse — and its images have no alt text, while its quantity fields and main action button show no visible focus indicator when tabbed to.",
    "design-system": "The favorite star departs from its near-universal “bookmark this for later” meaning: tapping it actually adds the item to the cart at quantity 0 — confirmed as deliberate business logic — collapsing two different user intents, curating and transacting, into one icon.",
    "visibility-status": "Un-favoriting an item doesn't actually persist (the underlying cart line never changes, so the star reverts to marked on refresh), and the header's cart icon disappears the moment a different report is opened, even with real, unsubmitted order value still sitting untouched elsewhere.",
    "buyer-journeys": "Covers “Adding items to the cart”: browsing to a style, opening its drawer, entering distinct quantities across sizes and colors, adding to cart, and verifying the cart — confirmed working correctly, and identically, across desktop, tablet, and mobile.",
    "sales-rep-journeys": "Covers “Adding items to the cart” performed by a Sales Rep on behalf of a selected customer — the same drawer, quantity entry, and cart verification as the Buyer Journeys entry above, since a Sales Rep uses the identical add-to-cart flow.",
  },
  summary: "The full add-to-cart journey works correctly and matches exactly across desktop, tablet, and mobile — but exceeding a size's availability limit gives no explanation, the drawer's color swatches have no keyboard path, and the header's cart icon and the favorite star each hide or misrepresent the cart's real state in specific situations.",
  scope: [
    { label: "Area", value: "Cognitive walkthrough of the “Adding items to the cart” journey: browsing the catalog to a style, opening its detail drawer, selecting different quantities across sizes and colors, adding to cart, and verifying the resulting cart line by line — retested at desktop, 768px tablet, and 375px mobile widths. Also includes a desktop-only accessibility spot check of the drawer (image alt text, keyboard reachability and operability, and focus visibility), a desktop-only check of the favorite star's coupling with cart membership, and a desktop-only check of the header cart icon's visibility when switching between reports." },
    { label: "Screen", value: "/reports/3771 (the Fall 2026 linesheet report, same as Cases 02 and 06) → the style detail drawer for “3/4 Sleeve Boatneck” (PA1136) → /my-account/cart (the “ORDER PREVIEW” cart screen)." },
    { label: "Interaction boundary", value: "Desktop tested using the user's own real, already-authenticated Chrome session; the tablet (768×1024) and mobile (375×812) follow-ups both used Claude's built-in browser with true viewport emulation, also on an already-authenticated session. Real quantities were added to the real cart for one style across two colors (Black and Dark Navy) at each width, the resulting cart verified line by line, then both lines removed afterward via “Remove Color” (each behind its own confirmation dialog) to leave the shared account as it was found. “Submit Orders” was never clicked — no order was placed at any point, on any width. Deliberately tested entering quantities beyond a size's real availability (up to 99999 on one row) to see how the app responds; these excessive values were always corrected before ever calling Add to Cart." },
    { label: "Session", value: "Seventh case of this audit round, now closed across all three viewports. Started desktop only, per the UX Assessment Lead's explicit request to start with the desktop version using their own Chrome. The core journey was then retested at 768px tablet width, and finally at 375px mobile width, both using Claude's built-in browser with true viewport emulation. Accessibility and the header cart-icon check were desktop-only by explicit scoping, not oversight." },
  ],
  blocks: [
    {
      type: "steps",
      heading: "Steps — browsing to a style and opening the drawer",
      items: [
        { text: "Opened the Fall 2026 linesheet report (/reports/3771), the same grid tested in Cases 02 and 06, already showing several styles per row. Clicked the small drawer-entry icon on the “3/4 Sleeve Boatneck” (PA1136) card: opened the right-side detail drawer directly to this style, defaulting to Black, with a “Select Quantity” table (Size / Available / Aug 01 / Quantity) below the photo and color swatches — the same drawer entry point and layout already confirmed working in Case 06." },
        { text: "The table's columns for Black: XS (0 available, 50 arriving Aug 01), S (200 / 450), M (200 / 250), L (200 / 250), XL (200 / 250) — all quantities starting at 0, with a “SELECT QUANTITY” button, disabled until at least one size has a quantity greater than 0." },
        { text: "Noticed two extra, full-height “−”/“+” controls flanking the whole table: a bulk stepper that increments or decrements every size row at once by one unit per click — a fast way to build a one-of-each-size selection, confirmed by clicking it once and watching all five rows go from 0 to 1 simultaneously before resetting back to 0 to continue testing normally." },
      ],
    },
    {
      type: "steps",
      heading: "Steps — testing the availability limit",
      items: [
        { text: "With Black still selected, typed 250 directly into the S row's quantity field (Available: 200, Aug 01: 450). Accepted with no visible warning — a quantity above the current stock figure alone is allowed, since the Aug 01 column represents real, known incoming stock." },
        { text: "Typed 99999 into the same field to find the actual ceiling. This time the input's border turned red and “ADD TO CART” became disabled (confirmed via its own `disabled` state, not just its visual color) — but no error text, tooltip, or accessible label appeared anywhere in the drawer explaining why, or what value would be accepted.", image: c07img01, caption: "Typing far beyond a size's real availability produces only a red-bordered field — no message anywhere" },
        { text: "Narrowed the exact ceiling by testing several values in sequence on the same field: 650 is accepted (no error), 651 immediately shows the red border and disables the button. 650 is exactly Available (200) + Aug 01 (450) for that row — confirming the app validates each size against its true total stock, precisely, right down to the unit." },
        { text: "Corrected the field back to a normal, valid quantity (3) to continue the main flow." },
      ],
    },
    {
      type: "richtext",
      heading: "Finding 1 — Exceeding a size's real availability by typing a number gives no explanation anywhere, only a red border",
      paragraphs: [
        "Every size in the drawer's quantity table has a real, enforced maximum equal to its current “Available” figure plus its known future “Aug 01” batch (confirmed precisely: 650 = 200 + 450 is accepted, 651 is not). Typing a number above that maximum is accepted into the field, but the moment it crosses the line, the input's border turns red and both “ADD TO CART” and “UPDATE QUANTITY” become disabled — with no text message, tooltip, or accessible label anywhere in the drawer saying what happened or what the actual maximum is. A user has to notice the color change, then manually add the “Available” and “Aug 01” columns themselves to figure out what number would actually be accepted.",
        "This is inconsistent with how the drawer's own “+” stepper controls handle the same limit: clicking “+” enough times on a row never produces an invalid number at all — it simply stops incrementing exactly at the true maximum, with no error state ever shown, confirmed directly by driving the bulk “apply to every size” stepper 250 clicks past a size whose real ceiling was only 50. The stepper path prevents the error before it happens; the typing path lets the user hit it, then leaves them to self-diagnose it. Reproduced identically at both 768px tablet and 375px mobile widths.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Visibility of system status (the interface has the exact maximum — it enforces it precisely — but never displays it); recognition, diagnosis, and recovery from errors (there's no explanation to recognize or diagnose, and recovery means doing the subtraction yourself); reliance on color as the only signal (a colorblind user, or anyone not looking closely at the field's border, would have no way to notice the field is even in an error state)." },
        { label: "Suggested direction", value: "Add an inline message near the field when it's over the limit — for example “Maximum available: 650” — and wire it to the input via aria-describedby (or a role=\"alert\" region) so it's not conveyed by color alone. Since the “+” stepper already knows the exact ceiling and enforces it silently, the same value is available to power an explicit message on the typing path too, rather than building new logic for it." },
        { label: "Priority note", value: "Medium — the cap is genuinely enforced and no bad data can reach the cart, but this will be hit routinely on a frequent, everyday flow (adding a multi-size order to cart) any time inventory is tight, and currently offers no way to recover from it except guesswork." },
      ],
    },
    {
      type: "steps",
      heading: "Steps — entering different quantities per size and color, and adding to cart",
      items: [
        { text: "With Black selected, set distinct quantities across four of the five sizes — S: 3, M: 5, L: 2, XL: 4 (XS left at 0, since it has no current stock) — for a total of 14 units, $532.00.", image: c07img02, caption: "Black — distinct, valid quantities entered across four sizes" },
        { text: "Clicked “ADD TO CART”: the button relabeled to “ADDED TO CART” (now disabled) and a “GO TO CART” link appeared below the total. A cart icon also appeared in the app's top header for the first time in this session — it isn't shown at all while the cart is empty (see Finding 5)." },
        { text: "Clicked the Dark Navy swatch next, while Black's quantities were still showing: correctly triggered an “Add to Cart Not Added” confirmation, since Black had already been added by this point with nothing further pending — clicked “Cancel” to continue without adding anything further, which switched the drawer to Dark Navy as expected." },
        { text: "Dark Navy's table showed only two columns instead of three — “Aug 01” and “Quantity”, no “Available” column at all — because this color currently has zero units in stock in every size. The column disappears rather than showing a column of zeros, a sensible simplification rather than a bug." },
        { text: "Set different quantities across four of the five sizes again, in a different pattern than Black's — XS: 2, M: 6, L: 1, XL: 3 (S left at 0) — for a total of 12 units, $456.00, and clicked “ADD TO CART” again.", image: c07img03, caption: "Dark Navy — a different distinct quantity pattern, with the “Available” column absent for a zero-stock color" },
      ],
    },
    {
      type: "steps",
      heading: "Steps — verifying the cart",
      items: [
        { text: "Clicked “GO TO CART”: landed on /my-account/cart, an “ORDER PREVIEW” screen grouped by delivery (“Fall 2026: September 9/30 X-Warehouse”), listing “3/4 Sleeve Boatneck” (PA1136) with one row per color.", image: c07img04, caption: "Cart verification — both colors match the drawer exactly, size by size" },
        { text: "Compared every figure against what was actually entered in the drawer: Black showed XS 0 / S 3 / M 5 / L 2 / XL 4, 14 units, $532.00; Dark Navy showed XS 2 / S 0 / M 6 / L 1 / XL 3, 12 units, $456.00 — an exact match, with no rounding or drift. The style subtotal read $988.00, and the cart's own Total showed 26 units and $988.00 — both correct." },
        { text: "Opened each row's “⋮” menu: “Move To Another Delivery”, “Duplicate”, “Edit Quantity”, and “Remove Color” were all present. Used “Edit Quantity” on the Black row: it reopened the same drawer, on Black, correctly pre-filled with the saved values (0, 3, 5, 2, 4), with the button shown disabled (“SELECT QUANTITY”) until something actually changes — confirmed by editing S to 7, which relabeled it to “UPDATE QUANTITY” and enabled it. Reverted S back to 3." },
        { text: "Used the bulk “+” stepper 250 times in a row from the saved (0, 3, 5, 2, 4) state, to check whether the same per-row availability ceiling found earlier also applies to the stepper controls, not just to typing. XS — whose true ceiling is only 50 — stopped exactly at 50 instead of reaching 250, while the other sizes (each with a much higher ceiling) simply added 250 as expected. None of the fields turned red and “UPDATE QUANTITY” stayed enabled throughout — the stepper clamps silently at the true maximum instead of ever allowing an invalid value.", image: c07img05, caption: "Bulk stepper clamps silently at each size's true maximum — never an error state" },
        { text: "Closed the drawer without saving this stress-test change: a “Quantity Changes Not Applied” guard dialog appeared, and “Cancel” correctly discarded it, confirmed by reopening the cart page and seeing Black's row unchanged." },
        { text: "Removed both colors from the cart via “Remove Color” (each behind its own “Are you sure?” confirmation) to restore the shared test account to its original, empty-cart state." },
      ],
    },
    {
      type: "steps",
      heading: "Steps — accessibility spot check on the drawer (images and keyboard navigation, desktop only)",
      items: [
        { text: "Inspected every img element inside the drawer (7 total): the main garment photo and 5 color-swatch thumbnails all have no alt attribute at all — not even an empty alt=\"\" marking them as decorative. Screen readers fall back to reading the image filename or announcing “image” with no useful content." },
        { text: "Inspected the 5 color swatches: each is a plain div with the color name only in a title attribute (a hover tooltip, not a reliable accessible name) — no role=\"button\", no tabindex, no aria-label. Confirmed via tabIndex inspection that none of the 5 are keyboard-focusable at all." },
        { text: "Drove a live Tab-key trace through the drawer, reading document.activeElement after each press: close → info → favorite → a small unlabeled icon button → XS quantity → S → M → L → XL → action button. The 5 color swatches are never visited — a keyboard-only user cannot change the drawer's color at all.", image: c07img08, caption: "The color swatches are plain, non-focusable divs — completely skipped by the keyboard" },
        { text: "Confirmed the quantity itself can still be set without a mouse: typing a number directly into a focused field works exactly as with a mouse, and the field also responds to the native Up/Down arrow-key spinner behavior — so quantities can be set via keyboard, just not via the custom stepper buttons themselves (excluded from the tab order, tabindex=\"-1\")." },
        { text: "Checked focus visibility by reading each focused element's computed outline/box-shadow. The three header icon buttons (close, info, favorite) keep the browser's own default focus ring, clearly visible.", image: c07img06, caption: "Header icon buttons keep a visible default focus ring" },
        { text: "The 5 quantity input fields and, notably, the main action button itself all have outline: none with no alternative focus style — focusing them produces no visible change at all.", image: c07img07, caption: "The main action button has no visible focus indicator at all, even while focused and enabled" },
        { text: "All values were reset to 0 before any Add to Cart call in this part of testing, so no cart line was created and no cleanup was needed." },
      ],
    },
    {
      type: "richtext",
      heading: "Finding 2 — The color swatches in the drawer cannot be reached or operated with the keyboard at all",
      paragraphs: [
        "The 5 color swatches in the drawer are plain div elements with no tabindex, no role=\"button\", and no aria-label — confirmed by inspecting every swatch's properties and by a live Tab-key trace through the whole drawer, which skips straight from the header icon buttons to the first quantity field without ever landing on a swatch. There is no keyboard equivalent offered anywhere else in the drawer for switching color. A keyboard-only user can open the drawer, read the default color's photo and price, and set quantities for that one color, but cannot reach any of the style's other colors from the drawer at all.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Accessibility / keyboard operability (a core interactive control has no keyboard path); this also affects anyone who simply prefers keyboard navigation for speed, not only assistive-technology users." },
        { label: "Suggested direction", value: "Give each swatch a real interactive role — either a native button or a div role=\"button\" tabindex=\"0\" with an aria-label built from the color name already available in the existing title attribute — and wire Enter/Space to the same click handler already in place." },
        { label: "Priority note", value: "High — this isn't a rough edge on an already-reachable control, it's a complete keyboard dead end on a control with no alternative path, blocking a core action (choosing which color to order) for anyone who can't use a mouse." },
      ],
    },
    {
      type: "richtext",
      heading: "Finding 3 — The drawer's images have no alt text, and its two most-used controls show no visible focus indicator",
      paragraphs: [
        "All 7 img elements inside the drawer — the main garment photo and the 5 color-swatch thumbnails — have no alt attribute at all, confirmed by inspecting the DOM directly. A screen reader has nothing to announce for the garment photo itself, the one image in the drawer that actually carries information — the swatches are a smaller loss on this specific point, since their color name is already exposed via title, but title is not a dependable substitute for alt or aria-label either.",
        "Separately, focus visibility is inconsistent across the drawer's 10 keyboard-focusable elements. The 3 header icon buttons keep the browser's default focus outline, so a keyboard user can see where they are. But the 5 quantity input fields and — more importantly — the main action button all have outline: none with no replacement focus style. A keyboard user typing quantities and tabbing to submit has no visual confirmation of where their focus is for the two things they're actually doing in this drawer.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Accessibility (missing accessible names for informative images; visibility of system status for keyboard focus, which the WCAG “Focus Visible” criterion treats as a baseline requirement, not a nice-to-have)." },
        { label: "Suggested direction", value: "Add a descriptive alt (e.g. “3/4 Sleeve Boatneck, Black”) to the garment photo, and either alt=\"\" or a matching descriptive alt to each swatch thumbnail. Restore a visible :focus-visible style to the quantity inputs and the action button, consistent with what the header icon buttons already show." },
        { label: "Priority note", value: "Medium — neither issue blocks a sighted mouse user, but together they make the drawer meaningfully harder to use with a screen reader or keyboard alone, on top of Finding 2's complete color-switching dead end." },
      ],
    },
    {
      type: "steps",
      heading: "Steps — retesting the core flow at tablet width (768px)",
      items: [
        { text: "Retested the same journey — browsing to PA1136, opening its drawer, testing the availability limit, entering distinct quantities per size and color, adding to cart, and verifying the cart — at a 768px tablet viewport, using Claude's built-in browser with true viewport emulation. Accessibility was not re-checked at this width, only the core journey already covered on desktop." },
        { text: "Every result matched desktop exactly: the same drawer-entry behavior (a color swatch tap on the card still only expands the inline table, not the drawer), the same 99999-over-limit red-border/no-message gap reproduced on the S field, the same Black (14 units/$532.00) and Dark Navy (12 units/$456.00) quantities producing the same $988.00/26-unit cart total, and the same “⋮” menu and Edit Quantity round-trip." },
        { text: "One observation turned into a real finding: Dark Navy's favorite star switched on by itself right after “ADD TO CART” was clicked, with no click on the star itself — confirmed via the DOM (class=\"selected favorite fav-row\"). The UX Assessment Lead explained this directly afterward: the star doubles as a cart-membership toggle (see Finding 4)." },
        { text: "Removed both colors via “Remove Color” to restore the cart to empty. “Submit Orders” was never clicked at any point during this pass." },
      ],
    },
    {
      type: "richtext",
      heading: "Finding 4 — The favorite star doubles as a cart-membership toggle, and un-favoriting doesn't actually persist",
      paragraphs: [
        "This isn't a bug in its core design — it's a deliberate business decision, explained directly by the UX Assessment Lead after this case surfaced it as an unexplained observation during tablet testing: the star icon doesn't only mark a style or SKU as a favorite. Tapping it adds the item to the cart (creating an empty cart first if none exists) at quantity 0, and there's no separate, independent place a “favorite” is recorded — the star's state is entirely derived from whether the item currently has a line in the cart. Entering real quantities manually has the same underlying effect, which is why doing so also fills in the star automatically.",
        "Testing confirmed that un-starring an item does not remove it from the cart — the cart line stays exactly as it was, which is also why no confirmation dialog appears when un-starring: nothing is actually being removed. The visible effect is that the star appears to un-mark in the moment, but since favorite status has no home other than cart presence, and the cart presence never actually changed, refreshing the report shows the star back to marked.",
        "From a usability standpoint, two issues are worth flagging independent of whether reusing the cart as the storage mechanism for favorites is a reasonable engineering shortcut. First, a conceptual one: a star is one of the most standardized icons in software — it almost always means “save this for later,” a lightweight, purely personal curation action, deliberately separate from actually acquiring the item. Here it means something functionally different: “this item now has a presence in your cart.” Collapsing browsing/curating and transacting into one icon means a Sales Rep can't do the first without triggering the second, and is likely to make “Show Favorites” (Case 06) less useful over time as a curation tool. Second, a confirmed functional one: un-favoriting doesn't persist — a broken feedback loop where the interface shows one state right after the click and a different, contradicting state on the next visit. What still hasn't been tested is the case with real stakes: un-starring an item that already has non-zero quantities entered.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Match between system and the real world (the star's meaning departs from the near-universal convention it borrows its icon from, and now also from what un-starring visibly appears to do); visibility of system status (the UI shows a state change on click that doesn't match the persisted state, discoverable only by refreshing); user control and freedom (a rep has no working way to remove a style from their favorites once a corresponding cart line — even an empty one — exists)." },
        { label: "Suggested direction", value: "Decide whether un-favoriting an empty (quantity-0) cart line is supposed to remove that line — if so, this is a straightforward functional bug to fix; if favorite lines are meant to persist in the cart regardless of the star's state, then the star's on/off affordance is misleading and shouldn't visually promise a toggle it can't deliver. Separately, if favoriting and cart-membership need to stay technically linked, consider giving them visually distinct affordances so a rep can tell, at a glance, whether a control touches their real order." },
        { label: "Priority note", value: "Medium. A favorite toggle that silently fails to persist is a real, confirmed, user-facing defect, but no order quantities are at risk in the case actually tested — the untested real-quantity scenario could still turn out to matter more once checked." },
      ],
    },
    {
      type: "steps",
      heading: "Steps — investigating the header cart icon (desktop only)",
      items: [
        { text: "Prompted by the UX Assessment Lead's own observation: added 2 units of PA1136 Black/S to the Fall 2026 cart ($76.00), confirming the header cart icon appeared. Switched to the Spring 2027 report without touching the cart: the icon disappeared from the DOM entirely (document.querySelector('.cart-icon-button') returned null, not merely hidden by CSS), even though the $76.00 line was still sitting untouched in Fall 2026's cart. Switched back to Fall 2026: the icon reappeared." },
        { text: "Checked “MY ACCOUNT” → “Carts list” as a global, report-independent fallback: it correctly listed “Fall 2026” as an active cart while the header icon was hidden on Spring 2027 — but its own “TOTALS” column read $0.00, and the expanded delivery row showed “Amount: -”, for a cart the real Order Preview screen, moments apart, correctly totaled at $76.00." },
        { text: "Along the way, found a pre-existing, unrelated entry already in the Fall 2026 cart — “Long Sleeve Crew” (PA1182) favorited in all 5 colors at quantity 0 (25 zero-value rows, $0.00) — almost certainly residue from Case 06's own favorite-star testing. Flagged for the UX Assessment Lead rather than removed unilaterally; confirmed afterward as expected, harmless leftover, not something to clean up." },
      ],
    },
    {
      type: "richtext",
      heading: "Finding 5 — The header cart icon is scoped to whichever report is currently open, not to whether there's anything pending anywhere in the account",
      paragraphs: [
        "The small cart icon next to the search icon in the header isn't a simple “cart has items” indicator — it's scoped to the specific report/season currently being viewed. Confirmed step by step: with the cart genuinely empty, the icon is absent from the page entirely. Adding real quantities makes it appear while still on that report; switching to a different report makes it disappear completely, even though the original order is still sitting there, untouched. Switching back brings it straight back. The underlying cart data never changes across any of this — only the icon's presence does.",
        "There is a second, global way to check for pending cart activity: “MY ACCOUNT” → “Carts list”, which correctly detects an active cart regardless of which report is open — but its own totals are unreliable ($0.00 and “-” for a cart the real Order Preview screen correctly totaled at $76.00), so even the one fallback designed to answer “do I have anything pending elsewhere” gets the dollar figure wrong.",
        "A cart icon's whole job, in essentially every ordering interface a wholesale buyer has used, is to give a persistent, always-visible answer to “do I have anything pending right now” — reinforced here by the fact that this icon does show live cart content, not a generic notification. Scoping its visibility to the currently-open report undermines that job in exactly the situation this kind of tool is used most: a rep working across several seasons in one sitting. Someone who builds a real order under one report, then moves on to browse another, gets no reminder that the first order is still open — the header doesn't stay silent about it, it actively signals “nothing pending,” which is false.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Visibility of system status (the true state — real money pending in a cart — doesn't change when switching reports, but the interface's only persistent signal for that state does, flipping to imply the opposite of what's true); consistency (the same fact is shown accurately in the Order Preview itself, and inconsistently or wrongly in the two others that exist to summarize it — the header icon and Carts List's totals)." },
        { label: "Suggested direction", value: "Make the header cart icon reflect the account's cart state globally — present whenever any report/season has a pending cart, the same way “Carts list” already correctly detects it. If the architecture genuinely ties a cart to a single report, a secondary, lightweight signal belongs somewhere in the persistent chrome (a badge on “MY ACCOUNT,” or on the linesheet switcher) so a rep browsing one report can tell they left something in another. Separately, Carts List's totals should be fixed to match what Order Preview already computes correctly for the same data." },
        { label: "Priority note", value: "High. This isn't a rough edge inside one drawer — it's a gap in the primary, sitewide indicator for “you have an open order,” for what looks like the normal way this product gets used. A missed or forgotten cart is the kind of thing that turns into a real business cost — an order that should have shipped and didn't — not just an inconvenience." },
      ],
    },
    {
      type: "steps",
      heading: "Steps — retesting the core flow at mobile width (375px)",
      items: [
        { text: "Retested the same journey a third time at a 375px mobile viewport, using Claude's built-in browser. Neither accessibility nor the header cart-icon check was repeated here — only the core journey." },
        { text: "The built-in browser's click action reliably timed out at this width, a previously-seen limitation below tablet width. Every interaction was instead driven via direct JavaScript clicks on the page's own elements, with screenshots used throughout to visually confirm each result — a testing-tool workaround, not a product issue." },
        { text: "Confirmed a mobile-specific, positive difference: tapping a color swatch directly on the catalog card opens the drawer immediately, pre-scoped to that exact color — unlike desktop and tablet, where the same tap only expands the card's inline color/size table. Consistent with the same swatch-driven pattern Case 06 documented for mobile." },
        { text: "Re-ran the availability-limit test: typed 99999 into a quantity field. Same result as desktop and tablet — a red-bordered field, a disabled button, no explanatory text anywhere." },
        { text: "Set Black to S 3 / M 5 / L 2 / XL 4 (14 units/$532.00) and Dark Navy to XS 2 / M 6 / L 1 / XL 3 (12 units/$456.00), adding both to cart with no guard dialog needed, since nothing was left pending between switches." },
        { text: "Navigated to the cart via the drawer's “GO TO CART” button: the cart's single-column mobile layout matched desktop and tablet's data exactly — $988.00 / 26 units total, both colors' quantities correct." },
        { text: "Disambiguated the mobile cart's “⋮” menu — rendered with a different icon than desktop/tablet's, and with several instances on the page (delivery-level, style-level, and one per color row) — by matching each icon to its nearby row text. Used “Edit Quantity” on the Dark Navy row: the drawer reopened correctly pre-filled with the saved values, same behavior as desktop and tablet." },
        { text: "Removed both colors via “Remove Color” (each behind its own confirmation) to restore the cart to empty for this delivery. “Submit Orders” was never clicked. Reset the viewport and closed the browser tab once testing was complete." },
      ],
    },
    {
      type: "list",
      heading: "Positive observations",
      items: [
        "The full journey — browse the catalog, open a style's drawer, enter different quantities across multiple sizes and multiple colors, add to cart, and verify — worked correctly end to end at every width tested, with the cart matching the drawer exactly on every figure checked: per-size quantities, per-color subtotals, and the cart's own grand total (26 units, $988.00 across the two colors tested, identical on desktop, tablet, and mobile).",
        "The app enforces each size's real availability precisely — current stock plus a known future batch, right down to the unit (650 accepted, 651 rejected) — a meaningful, correctly-implemented business rule, reproduced identically at all three widths.",
        "Two separate guard dialogs (“Add to Cart Not Added” when switching color with a pending, unsaved quantity; “Quantity Changes Not Applied” when closing the drawer mid-edit) proactively protect against silently losing entered quantities.",
        "The bulk stepper (increment or decrement every size in the table by one, in a single click) is a fast, well-built shortcut for a common wholesale pattern, and correctly respects each size's own individual cap even when applied in bulk, never producing an invalid value.",
        "The cart's per-line “⋮” menu (Move To Another Delivery, Duplicate, Edit Quantity, Remove Color) is a complete, sensible set of controls; Edit Quantity correctly reloads the exact saved quantities at every width, and Remove Color asks for confirmation before deleting a line.",
        "The action button's label changes contextually and correctly through the whole lifecycle of one interaction — “SELECT QUANTITY” → “ADD TO CART” → “ADDED TO CART” → “UPDATE QUANTITY” — a small but genuinely helpful bit of status communication.",
        "A color with zero current stock in every size simply drops the “Available” column from its table entirely rather than showing a column full of zeros — a sensible adaptation consistent with the adaptive-column pattern already seen in Case 06.",
        "Quantities can be set entirely by keyboard even though the custom “+”/“−” steppers themselves aren't focusable: typing a number directly into a field works exactly as with a mouse, and the field also responds to the native Up/Down arrow-key spinner behavior.",
        "The entire core journey behaves identically at 768px and 375px as it does on desktop — same numbers, same guard behavior, same adaptive-column pattern — and mobile adds a genuine, touch-appropriate improvement of its own: a swatch tap opens the drawer directly, pre-scoped to that color, rather than requiring a separate drawer-entry tap.",
      ],
    },
    {
      type: "richtext",
      heading: "Notes / follow-up needed",
      paragraphs: [
        "“Move To Another Delivery” and “Duplicate” (seen in the cart's per-line menu) were not tested here — outside this case's scope, but worth their own look if a future case covers multi-delivery cart management.",
        "Only one style (PA1136, “3/4 Sleeve Boatneck”) and two colors were used for this case's evidence. The underlying behavior (drawer, quantities, cart math, availability cap) is a shared component used across every style in the catalog per Case 06's own findings, so this case's findings are expected to generalize, but weren't independently re-confirmed on a second style.",
        "No order was submitted at any point across any of the three widths (“Submit Orders” was never clicked), and the cart was restored to empty after every pass via “Remove Color,” consistent with this audit's standing practice of leaving the shared test account as it was found.",
        "The accessibility spot check covered only this same drawer, on this same style and color (PA1136, Black), on desktop — not the cart page, not other drawers, and not screen-reader software itself (findings are based on DOM/ARIA inspection and real keyboard-only interaction, not an actual screen reader run). A screen-reader pass (e.g. VoiceOver or NVDA) would give a more complete picture.",
        "Residual test data found in the shared account, not created by this case: the Fall 2026 cart contains “Long Sleeve Crew” (PA1182) favorited in all 5 colors at quantity 0, almost certainly leftover from Case 06's own favorite-star testing. Confirmed by the UX Assessment Lead as expected, harmless leftover — not cleaned up, since it predates this case and wasn't part of its scope.",
        "“Carts list” (MY ACCOUNT → Carts list) is a useful global summary of open carts across every report for future cases touching cart or checkout behavior, but its own totals are unreliable (see Finding 5), so it wasn't relied on for this case's core verification, which used the actual “ORDER PREVIEW” screen throughout.",
        "At 375px mobile width, the built-in browser's click action reliably timed out on every attempt — a previously-seen limitation below tablet width. Every mobile interaction in this case was instead driven via direct JavaScript clicks on the relevant DOM elements, with screenshots used to visually confirm each result. This is a testing-tool limitation of this audit's own tooling, not a defect in the site.",
        "Case 07 is now closed across desktop, tablet (768px), and mobile (375px).",
      ],
    },
  ],
};

const case08 = {
  id: "case-08",
  caseNumber: "08",
  title: "Cart editing and order placement: quantities, line removal, and delivery-date management",
  status: "Issues found — two confirmed findings, one high-priority. Built real, multi-style, multi-color, multi-size cart test data (PA1136 in Black and Dark Navy, plus PA1142 in Dark Navy on desktop; PA1136 in Black alone at tablet width) to exercise the “ORDER PREVIEW” cart page itself: quantity editing, line removal, and — the main focus — how the app manages multiple delivery dates (Add Delivery, Edit Delivery Dates, Move To Another Delivery, Duplicate, Remove Delivery), through to the checkout validation step. An initially-reported defect in the delivery-date typed-input path was retracted after the UX Assessment Lead could not reproduce it under real keyboard input, despite repeated automated reproduction — most likely a testing-tool artifact rather than a real product defect (see Notes). The tablet retest (768px) confirmed every remaining desktop finding and positive observation carries over unchanged, and additionally resolved the per-color minimum-quantity indicator (Finding 2) from incomplete to fully confirmed. A mobile retest (375px) was attempted but could not be completed: interactions began timing out in a way that also affected the UX Assessment Lead's own direct click on the same element, pointing to a genuine site or environment condition rather than a testing-tool limitation — the case is closed with desktop and tablet coverage only.",
  statusKind: "issue-high",
  viewports: ["desktop", "tablet"],
  // Finding 1 (Duplicate's guided flow can silently create an invalid,
  // checkout-blocking cart state that the equivalent Move flow correctly
  // prevents) touches design-system (two parallel actions enforcing
  // different validation levels), user-control-errors (the invalid state
  // is allowed to be created at all), and visibility-status (the only
  // feedback is a small icon that must be actively discovered). Finding 2
  // (the per-color minimum-quantity indicator, now confirmed: threshold 4,
  // advisory-only) is also visibility-status. Also carries both of Area
  // 2's Buyer Journeys and Sales Rep Journeys — this case covers "Placing
  // an order", and every buyer-facing journey applies equally to Sales
  // Reps acting on a customer's behalf. No responsive-specific issue was
  // found (every result matched exactly between desktop and tablet), so
  // that category isn't listed here; no accessibility check was in this
  // case's scope.
  categories: ["design-system", "user-control-errors", "visibility-status", "buyer-journeys", "sales-rep-journeys"],
  categorySummaries: {
    "design-system": "“Move To Another Delivery” and “Duplicate” share the exact same guided menu path and the same auto-suggested default date, yet enforce completely different levels of validation — Move blocks the 30-day-window violation with a clear toast, Duplicate lets the identical invalid state through with no check at all.",
    "user-control-errors": "“Duplicate”'s guided flow lets a user create an invalid, checkout-blocking cart state simply by accepting its own suggested default date — the exact situation “Move To Another Delivery” prevents outright via the identical guided path.",
    "visibility-status": "Duplicate's invalid, checkout-blocking result is only ever signaled by a small orange icon a user has to notice and hover — nothing on the page proactively explains why “Submit Orders” is disabled. By contrast, the per-color minimum-quantity indicator (now confirmed: a 4-unit threshold, advisory only) communicates its own constraint clearly and correctly.",
    "buyer-journeys": "Covers “Placing an order”: editing cart quantities, removing lines, and managing multiple delivery dates (adding, editing, moving, duplicating, and removing them) through to the checkout validation step. Confirmed working correctly at desktop and 768px tablet widths, aside from the two findings above; a mobile (375px) retest was attempted but blocked by an apparent site/environment issue and was not completed.",
    "sales-rep-journeys": "Covers “Placing an order” performed by a Sales Rep on behalf of a selected customer — the same cart, delivery-management, and checkout-validation controls as the Buyer Journeys entry above, since a Sales Rep uses the identical order-placement flow.",
  },
  summary: "Editing cart quantities and removing lines both work correctly and predictably — but “Duplicate” can silently create an invalid, checkout-blocking cart state that the near-identical “Move To Another Delivery” correctly prevents, and a per-color minimum-quantity indicator (now fully confirmed as advisory-only) was initially left unresolved on desktop. Confirmed identically at 768px tablet width; a mobile retest was attempted but blocked by a site/environment issue and not completed.",
  scope: [
    { label: "Area", value: "Cognitive walkthrough of the “Cart Editing / Order Placement” journey: building cart test data across different styles, sizes, and colors, then testing quantity editing, line removal, and — the primary focus — every delivery-date management action available from the delivery group's and each line's “⋮” menus (Add Delivery, Edit Delivery Dates, Move To Another Delivery, Duplicate, Remove Delivery), through to the checkout validation step. The add-to-cart drawer's own functionality was not re-tested — it was used only as a means of getting real data into the cart, and is already covered by Case 07." },
    { label: "Screen", value: "/reports/3771 (the Fall 2026 linesheet report) → the style detail drawer for “3/4 Sleeve Boatneck” (PA1136) and a second style, PA1142 → /my-account/cart (the “ORDER PREVIEW” cart screen), including its “Edit Delivery Dates” side panel → the “Submit Orders” checkout validation dialog." },
    { label: "Interaction boundary", value: "Desktop tested using the user's own real, already-authenticated Chrome session; the tablet (768px) follow-up used this session's built-in browser with true viewport emulation, also on an already-authenticated session. Real quantities were added across two styles and three color lines, plus a temporary second delivery group, then the cart's own editing, delivery-management, and checkout-validation controls were exercised directly. “Submit Orders” was clicked once on each pass, deliberately, as an explicitly approved checkpoint to observe checkout validation — never confirmed or finalized, and exited via “Go back”/“Cancel” both times. All test-added lines and the extra delivery group were removed afterward, restoring the cart to empty." },
    { label: "Session", value: "Eighth case of this audit round, closed after desktop and tablet (768px) coverage. A mobile (375px) retest was attempted using this session's built-in browser, including a collaborative pass with the UX Assessment Lead performing clicks directly — but interactions began timing out in a way that also affected the UX Assessment Lead's own direct click on the same element, pointing to a genuine site or environment condition rather than a testing-tool limitation. The mobile retest was abandoned at that point and the case closed with desktop and tablet coverage only." },
  ],
  blocks: [
    {
      type: "steps",
      heading: "Steps — building cart test data across styles, colors, and sizes",
      items: [
        { text: "Used the “3/4 Sleeve Boatneck” (PA1136) drawer to add Black and Dark Navy, then added a second style, PA1142, in Dark Navy — deliberately spreading test data across two styles, three color lines, and a mix of sizes and quantities, so the cart page itself would have enough real structure to exercise its own editing and delivery-grouping behavior. The drawer's own entry, quantity, and add-to-cart mechanics were not re-examined here — see Case 07." },
        { text: "Landed on /my-account/cart, confirming all three color lines appeared correctly grouped under one delivery header (“Fall 2026: September 9/30 X-Warehouse”), each with its own per-line “⋮” menu (Move To Another Delivery, Duplicate, Edit Quantity, Remove Color) and the delivery group's own “⋮” menu (Add Delivery, Edit Delivery Dates)." },
      ],
    },
    {
      type: "steps",
      heading: "Steps — delivery-date management: calendar selection vs. typed input",
      items: [
        {
          text: "Opened the delivery group's “⋮” menu → “Edit Delivery Dates”: a right-side panel with “Start date” and “X-Warehouse date” fields, each with a calendar-icon toggle and an inline datepicker. Selecting a date via an actual calendar-cell click, then Save, persisted correctly every time — confirmed immediately by the cart's delivery header updating, and again by reopening the panel.",
          image: c08img06,
          caption: "A valid calendar-cell date change persists correctly, confirmed on reopening the panel",
        },
        { text: "Typing a date directly into either field, then clicking Save, repeatedly appeared to fail silently under this session's own automated browser testing — the typed text was accepted with no validation error, but reopening the panel showed the original value unchanged, and network inspection showed no save request was ever sent to the server. This was reproduced again on a dedicated re-verification pass, run specifically because the UX Assessment Lead could not reproduce it on a first attempt." },
        { text: "The UX Assessment Lead then tested the identical interaction manually, more than once, with a real keyboard, and reports it works correctly: a valid typed date saves, and an actually invalid one shows a clear “Invalid Date” message — neither of which this session's automated testing ever observed. Given that direct, repeated conflict between automated and manual results, this is retracted as a confirmed product defect rather than merely downgraded, and treated instead as a likely artifact of how this session's automated typing differs from a real keyboard (full account in Notes)." },
        { text: "Separately confirmed a genuine, working business rule while exploring the calendar: the Start Date calendar disables Saturdays and Sundays outright, preventing a delivery window from ever starting on a weekend." },
      ],
    },
    {
      type: "steps",
      heading: "Steps — Add Delivery, Move To Another Delivery, and Duplicate",
      items: [
        {
          text: "Used the delivery group's “⋮” menu → “Add Delivery”: a second, empty delivery group appeared, its dates auto-suggested as the day after the first delivery's X-Warehouse date, spanning 15 days.",
          image: c08img05,
          caption: "“Add Delivery” creates a new, empty delivery group with a sensible auto-suggested default",
        },
        {
          text: "Tested “Move To Another Delivery” on a color line by dragging it onto the new delivery: blocked immediately with a red toast reading “The item cannot be moved to a delivery date greater than 30 days from its original date.”",
          image: c08img07,
          caption: "Move To Another Delivery correctly blocks a date more than 30 days out, with a clear toast",
        },
        {
          text: "Reproduced the identical block via the guided, non-drag path instead: per-color “⋮” → “Move To Another Delivery” → “Add Delivery” (the only target available with one existing delivery) — its own auto-suggested default, computed 36 days out, fails the same rule on the very first try.",
          image: c08img08,
          caption: "The guided flow's own suggested default already fails Move's 30-day rule",
        },
        {
          text: "Tested the same guided path with “Duplicate” instead, using the identical 36-days-out default: this succeeded with no block, warning, or toast of any kind, creating a new delivery group and a duplicated color line immediately.",
          image: c08img11,
          caption: "The identical guided flow, via “Duplicate,” succeeds with no check at all",
        },
        {
          text: "The only sign anything was wrong appeared back on the main cart list: a small orange “!” icon on the duplicated line, whose tooltip read “This item cannot belong to the delivery you are currently in because the item's date is prior to the delivery date. Please relocate the item to continue.” Confirmed this state also disabled “Submit Orders” entirely, checked directly via the button's disabled attribute, not just visually.",
          image: c08img12,
          caption: "The only feedback for Duplicate's invalid state: a small icon, discoverable only on hover",
        },
      ],
    },
    {
      type: "richtext",
      heading: "Finding 1 — “Duplicate”'s guided flow can create an invalid, checkout-blocking cart state with no front-end warning, unlike the equivalent “Move” flow",
      paragraphs: [
        "“Move To Another Delivery” and “Duplicate” share the same guided per-color “⋮” menu path when only one delivery exists: choosing either one offers “Add Delivery” as the only target, which auto-suggests a new delivery date well outside the 30-day window most tested. For “Move,” this default immediately fails the app's own 30-day move-eligibility rule, with a clear red toast explaining why — confirmed via both the guided menu path and an equivalent drag-and-drop attempt, so the enforcement is real and consistent, not just tied to drag interactions specifically.",
        "“Duplicate,” walked through the identical guided path with the identical default date, has no equivalent check. It succeeds outright — creating a new delivery group and a duplicated color line with no block, warning, or confirmation of any kind. The only trace that something is wrong appears back on the main cart list, as a small orange “!” icon on the affected line, whose tooltip explains the item's date conflicts with its delivery's date. This state was confirmed to disable “Submit Orders” entirely, so the practical consequence isn't cosmetic — it silently prevents checkout — but nothing on the page proactively tells the user that, or why, unless they notice and hover a small icon among what could be a much longer cart.",
        "Because both actions route through the exact same guided flow with the exact same auto-suggested default date, this isn't an edge case reachable only through unusual input — it's the natural result of following Duplicate's own suggested default without changing it, which is very plausibly what most users would do the first time.",
        "Confirmed at tablet width (768px): re-ran both guided flows using an identical 15-days-out default for both actions (rather than desktop's 36-days-out default) — Move was blocked immediately with the same red toast, Duplicate succeeded with no block of any kind. Same asymmetry, same silent checkout-blocking consequence, at a different offset — reinforcing that the missing check in Duplicate isn't tied to any particular date gap.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Consistency and standards (two visually and structurally parallel actions, reached through the same menu shape and the same default-date logic, enforce completely different levels of validation); error prevention (Duplicate lets an invalid state get created at all, rather than preventing it at the point of action the way Move does); visibility of system status (the checkout-blocking consequence is real and immediate, but the only feedback is a small icon that must be actively discovered)." },
        { label: "Suggested direction", value: "Apply the same 30-day-window validation already implemented for “Move” to “Duplicate”'s equivalent guided flow, ideally by having both actions share the same underlying date-eligibility check rather than maintaining two separate implementations that can drift, as they clearly already have. At minimum, surface a toast identical to Move's immediately when Duplicate's guided flow would create the same invalid relationship, rather than allowing the action to complete silently and surfacing the problem only via a small icon discovered later." },
        { label: "Priority note", value: "High. This directly parallels a rule the app already enforces correctly elsewhere, so the fix is largely a matter of applying existing logic consistently rather than designing something new — and until then, it's a checkout-blocking dead end that's easy to trigger by simply accepting Duplicate's own suggested default." },
      ],
    },
    {
      type: "steps",
      heading: "Steps — quantity editing, the per-color minimum indicator, and line removal",
      items: [
        {
          text: "Used “Edit Quantity” on a color line: the same right-side drawer used for adding items reopened, pre-filled correctly with the row's current per-size quantities. The action button correctly relabeled from “SELECT QUANTITY” (disabled) to “UPDATE QUANTITY” (enabled) the moment a value changed, and the update persisted to the cart row immediately, confirmed after closing and reopening the drawer.",
          image: c08img09,
          caption: "Edit Quantity round-trips correctly and persists immediately to the cart row",
        },
        {
          text: "Used “Remove Color” on a test line: a native confirmation dialog appeared (“Remove item — Are you sure you want to remove this item from your order?”), and confirming it removed the line correctly. Confirmed “Remove Color” and “Remove Delivery” both work identically even on an item already in an invalid or errored state — used directly on the invalid duplicated line from the previous section with no special handling needed.",
          image: c08img10,
          caption: "Remove Color asks for confirmation before deleting a line",
        },
        { text: "Noted a separate per-color minimum-order-quantity indicator: a small orange “!” icon near a style's price range, tied to a circled quantity value on a color row below some threshold — observed at “3” units on two unrelated styles, consistently enough to read as a general business rule rather than something style-specific. Left the exact threshold and tooltip text unconfirmed on this desktop pass — see Finding 2 and its tablet resolution below." },
      ],
    },
    {
      type: "richtext",
      heading: "Finding 2 — A per-color minimum-quantity indicator (confirmed at tablet width: threshold 4, advisory-only)",
      paragraphs: [
        "An orange “!” icon appears near a style's price range in the cart, tied to a circled value on a specific color row, whenever that color's total quantity falls below the required minimum. Desktop testing observed this at “3” units on two unrelated styles but left the exact tooltip text and threshold unconfirmed. The tablet retest (768px) resolved both: stepping a color line's quantity up one unit at a time, the icon was present at 3 units and gone at 4, pinning the threshold at exactly 4 units per color. Its tooltip reads, in full: “One or more colors are below the required color minimum.” Checked directly against the “Submit Orders” button's disabled property (not just visually) at 3 units: the button remained enabled throughout — this indicator is advisory only and does not block checkout, unlike Finding 1's icon.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Visibility of system status — the business rule (a 4-unit-per-color minimum) is now clearly confirmed and its messaging, while generic (“one or more colors,” rather than naming which one when there are several lines), correctly and non-disruptively surfaces a real constraint without blocking the user's ability to proceed." },
        { label: "Suggested direction", value: "Minor: consider having the tooltip or icon identify which specific color(s) are under the minimum when a style has multiple color rows, rather than the generic “one or more colors” phrasing — a small clarity improvement, not a defect fix." },
        { label: "Priority note", value: "Low. Originally flagged Medium on desktop specifically because it was unconfirmed whether this indicator blocked checkout; now that tablet testing has confirmed it does not, and that its threshold and messaging are both clear and correct, this is closer to a positive observation than an outstanding finding — kept as a Finding rather than moved to Positive observations only because the “which color” ambiguity noted above is a genuine, if minor, opportunity." },
      ],
    },
    {
      type: "steps",
      heading: "Steps — reaching checkout",
      items: [
        {
          text: "With the cart back in a clean, valid state, and after explicit approval from the UX Assessment Lead per the standing rule that “Submit Orders” is never clicked without a specific go-ahead, clicked “Submit Orders”: triggered an “Opening Order Below Season Minimum” dialog, stating the exact dollar amount needed to meet the minimum and explaining that orders below it require sales-management approval before confirmation.",
          image: c08img13,
          caption: "The Season Minimum checkout validation is clear, specific, and explains the consequence",
        },
        { text: "Attempting to click “Continue” (intending only to observe the next screen, within the scope of the approval given) was blocked by this session's own automated safety guardrail before it reached the page; “Go back” was used instead to exit with no state change — see Notes." },
        { text: "Removed all test-added lines and the extra delivery group afterward, confirming the cart returned to its original, empty state. “Submit Orders” was never actually confirmed or finalized at any point across this case." },
      ],
    },
    {
      type: "steps",
      heading: "Steps — retesting at tablet width (768px)",
      items: [
        { text: "Repeated the same journey at a 768px tablet viewport, using this session's built-in browser with true viewport emulation: added PA1136 in Black to the cart and confirmed the same delivery header as desktop (“Fall 2026: September 9/30 X-Warehouse”)." },
        { text: "Calendar-click date editing behaved exactly as on desktop and persisted correctly. A coordinate-mapping quirk specific to this session's own browser tool briefly looked like a silent click failure until recalibrated — its screenshot-to-CSS-pixel ratio at this preset measured empirically at ~1.094×, not the ~1.042× a naive calculation from the nominal viewport size would suggest. This is a testing-tool artifact, not a product issue, recorded here as a caution for future retests with this tool." },
        { text: "Confirmed a genuine, stricter business rule at this width: the X-Warehouse date field disables every day of its own current month except the one already committed, in addition to the weekend-blocking rule already confirmed for Start Date." },
        { text: "Re-ran the Duplicate-vs-Move guided-flow comparison using an identical 15-days-out default for both actions (rather than desktop's 36-days-out default): Move was blocked immediately with the same toast, Duplicate again succeeded with no block of any kind — the same asymmetry at a different offset. See Finding 1." },
        { text: "Resolved Finding 2: stepping a color line's quantity up one unit at a time pinned the minimum-quantity threshold at exactly 4 units per color, with the tooltip confirmed in full. Confirmed directly via the Submit button's disabled property that this state never blocks checkout." },
        { text: "At the checkout checkpoint, clicking “Submit Orders” surfaced a different dialog than desktop's: a “SELECT CUSTOMER — Customer must be selected for this action” prompt. This is very likely a session/account-context difference (no active customer selected in this particular browser tab) rather than a tablet-specific behavior, and was not investigated further — exited via “CANCEL” with no state change." },
        { text: "No screenshots were saved for this tablet pass: this session's built-in browser returns screenshots inline only, with no save-to-disk mechanism equivalent to the Chrome extension tool used for desktop — this section is written from direct observation and DOM/network verification instead." },
      ],
    },
    {
      type: "list",
      heading: "Positive observations",
      items: [
        "The Start Date calendar correctly disables Saturdays and Sundays outright, preventing a delivery window from ever being set to start on a weekend — a genuine, correctly-implemented business rule.",
        "“Add Delivery”'s auto-suggested default (the day after the prior delivery's X-Warehouse date) is a sensible, low-friction default for the common case of adding a straightforward next delivery window.",
        "“Move To Another Delivery” enforces its 30-day window rule consistently and clearly across two different interaction paths tested (drag-and-drop and the guided per-color menu), with the same specific, understandable toast message both times.",
        "“Edit Quantity” round-trips correctly: it reopens pre-filled with the row's real saved per-size values, correctly toggles its action button's label and enabled state only once something actually changes, and the update persists to the cart row immediately and durably.",
        "“Remove Color” and “Remove Delivery” both show clear native confirmation dialogs before acting, and both work correctly and predictably even when the specific item or delivery being removed is already in an invalid or errored state — a good, consistent safety net.",
        "The checkout “Opening Order Below Season Minimum” validation is clear, specific (it states the exact dollar amount needed to meet the minimum), and correctly explains the consequence (sales-management approval required) rather than just blocking with no context.",
        "A real, valid calendar-cell date selection in “Edit Delivery Dates” works exactly as expected — the change is immediate, visible on the cart header, and durable across reopening the panel. Per the UX Assessment Lead's own manual testing, typing a date directly also works correctly under real keyboard input: a valid typed date saves, and an invalid one shows a clear “Invalid Date” message (see Notes for the discrepancy with what this session's automated testing observed).",
        "Confirmed at tablet width (768px): every desktop finding and positive observation in this list carries over unchanged at 768px — delivery-date calendar-click editing, the Move/Duplicate asymmetry (Finding 1), Edit Quantity's round-trip behavior, and both confirmation dialogs (Remove Color, Remove Delivery) all behaved identically. The X-Warehouse date field additionally disables every day of its own current month except the already-committed one, a stricter but sensible extension of the same pattern.",
      ],
    },
    {
      type: "richtext",
      heading: "Notes / follow-up needed",
      paragraphs: [
        "Retracted: “Edit Delivery Dates” typed-input save failure. This case originally reported, as a High-priority finding, that typing a date directly into the Start Date or X-Warehouse Date field and clicking Save silently fails to persist the change. That symptom was reproduced multiple times through this session's own browser automation, including a dedicated re-verification pass with DOM-level evidence (the field picking up Angular's ng-invalid class with no visible sign of it, and network inspection confirming no save request is sent on that path). That re-verification pass was itself prompted by the UX Assessment Lead reporting they could not reproduce the symptom on a first attempt. Rather than settling the question, the automated re-check reproduced the same symptom again — at which point the UX Assessment Lead tested manually, more than once, with a real keyboard, and reports the field behaves correctly: a validly-typed date saves, and an actually invalid one shows a clear “Invalid Date” message. Neither of those behaviors was ever observed through this session's automated testing. Given that direct, repeated conflict, and no way to make the symptom appear under real human interaction, this is retracted as a confirmed product defect rather than merely downgraded. The most likely explanation is that this session's browser-automation tool injects text into the field in a way a real keyboard doesn't — for example, without the same per-keystroke key events or the same focus/blur timing — enough to desync the form control from the picker's internal state in a way an actual user typing would never trigger.",
        "Session interruption during re-verification: partway through investigating the discrepancy above, the authenticated Chrome session unexpectedly landed on the login screen. Rather than attempting to sign back in on the user's behalf, automated testing was stopped at that point.",
        "Testing-methodology limitation, not a product finding: after receiving explicit approval to click “Submit Orders” and then “Continue” on the resulting Season Minimum dialog (with instructions to cancel rather than finalize), the “Continue” click specifically was blocked by this session's own automated safety guardrail, independent of the approval already given. No workaround was attempted, per that guardrail's own instruction; “Go back” was used instead to exit safely with no state change. This means checkout testing in this case stops one screen short of wherever “Continue” would have led (very likely a final confirm/place-order screen) — that next screen remains unobserved and would need to be evaluated some other way (for example, a live walkthrough with the UX Assessment Lead directly) rather than through this tool's own automated browsing.",
        "The X-Warehouse date calendar's enabled-day range appeared, across a few attempts, to stay anchored near the current date rather than reactively updating after a Start Date change made earlier in the same panel/reopen cycle — flagged with lower confidence, since it may be an artifact of this session's own JS-driven test interaction rather than genuine end-user behavior. Not pursued to a fully conclusive resolution, to avoid over-spending time on an ambiguous, hard-to-reproduce thread; worth a dedicated re-check using only real mouse-driven interaction before treating it as a confirmed bug.",
        "As in Case 07, “Long Sleeve Crew” (PA1182) remains favorited in all 5 colors at quantity 0 in the shared Fall 2026 cart — pre-existing residual test data from Case 06/07, not created or touched in this case, and still not cleaned up pending a decision with the UX Assessment Lead.",
        "Tablet retest (768px) completed using this session's built-in browser (Claude in Chrome was unavailable after a desktop-testing logout incident). All desktop findings and positive observations were confirmed to carry over unchanged; Finding 2 was additionally resolved from incomplete to confirmed. One tooling-only artifact was found and resolved during this pass — the built-in browser's screenshot-to-CSS-pixel coordinate ratio at this tablet preset measured empirically at ~1.094×, not the ~1.042× a naive calculation would suggest — recorded above as a caution for future retests with this tool. One new, unresolved question surfaced at the checkout checkpoint: clicking “Submit Orders” triggered a “SELECT CUSTOMER” prompt that never appeared on desktop, most likely a session/account-context difference rather than a tablet-specific behavior — not investigated further. No screenshots were saved for this tablet pass, for the tooling reason noted above.",
        "Mobile retest (375px) attempted, not completed. With a customer now selected, a mobile retest was attempted first in this session's built-in browser directly, then — after that browser proved unresponsive to clicks at this width — via a collaborative workflow with the UX Assessment Lead performing each click directly on their own machine. The drawer for a test style opened successfully this way, surfacing a new “Delivery” dropdown not seen on desktop or tablet, but the next click — on that dropdown, attempted both by this session's tooling and, separately, by the UX Assessment Lead directly — did not respond either way. Because the UX Assessment Lead's own direct click also failed, this points to a genuine site or environment condition at the time of testing (possibly related to network conditions flagged elsewhere in this session, or an unrelated site issue) rather than a limitation of any specific testing tool. No cart test data was added at mobile width beyond opening the one drawer, so no cleanup was needed. The case is closed here, with desktop and tablet (768px) coverage confirmed and mobile (375px) not completed.",
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
    findings: [case01, case02, case03, case04, case05, case06, case07, case08],
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
          ["<b>Sales Rep Journeys</b>", "Select a customer"],
          ["", "Linesheet / catalog browsing (1)"],
          ["", "Adding items to the cart (1)"],
          ["", "Placing an order (1)"],
          ["", "Order tracking (1)"],
          ["", "Payments (1)"],
          ["", "Account preferences (1)"],
          ["", "Create and share custom linesheets/reports"],
          ["<b>Admin Journeys</b>", "Manage users"],
          ["", "Manage reports"],
          ["", "Activity audit"],
        ],
        footnote: "(1) The same journey as the matching Buyer Journeys row above, performed by a Sales Rep on behalf of the selected customer — listed here explicitly, and classified under both categories on this area's Finding Summary, rather than left as a footnote-only note. (2) In Lilla P's underlying NetSuite customer model, a Buyer's app account belongs to a contact, not a customer directly — a contact tied to a single customer (the common case) has that customer selected automatically, but a contact tied to more than one customer (e.g. a buyer who works across multiple brands) must choose which one to act on, the same selection flow a Sales Rep uses on a customer's behalf.",
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
        description: "Every Buyer journey, performed by a Sales Rep on behalf of a selected customer, plus journeys unique to the role — for example, selecting which customer to act on before doing anything else. A case classified under Buyer Journeys is also classified here, since Sales Reps use the same screens and controls a Buyer would.",
      },
      {
        id: "admin-journeys",
        title: "Admin Journeys",
        description: "Journeys specific to admin users managing accounts, reports, and platform configuration.",
      },
    ],
    findings: [case01, case02, case03, case04, case05, case06, case07, case08],
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
    findings: [case01, case02, case03, case04, case05, case06, case07, case08],
  },
];
