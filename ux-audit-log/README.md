# UX Audit — Case Log

This folder is a running log of the hands-on testing done against the Lilla P B2B wholesale test instance (`https://test.lillap.com/`), as part of the Chapter 1 UX audit. Each entry below is one test case: a specific task flow, walked through step by step, with a short summary of what was found. Screenshots and a full step-by-step account for each case live in `cases/` and `screenshots/`.

This log is a working document, not the final report. Findings and screenshots are captured here first, case by case, across desktop, tablet, and mobile; the site's Chapter 1 content (`data/phases.js`) and its screenshots are only updated in a separate, later pass, once a batch of cases has been reviewed together — see `documents/ux-assessment.md` for the full working method. This also means the material below isn't tied to a single report: the same case log could feed more than one report or deliverable.

This is a fresh round of testing, starting from Case 01.

## How to read this log

Each case below is either a **pass** (the flow works as a buyer would expect) or an **issue** (something broke, confused, or misled during the flow). Each case also gets a first-pass **Priority** (High / Medium / Low), following the Evidence model in `documents/ux-assessment.md`. Severity/effort scoring beyond that is intentionally left out of this log — full triage happens later, once the audit pass is done. This is raw field notes: what we tried, what we saw, in what order.

## Cases

### Case 01 — Login screen: cross-area review

**Status:** Issues found — no blocker on the primary path, but a silent dead end on user error.

Reviewed the `/login` screen against all three methodology areas at once. Submitting the form empty gives zero feedback (not even a network request). A malformed, non-email string is accepted with no format check and, after a few unexplained seconds of loading, redirects to a full "Complete your registration" form with the broken string baked into a disabled field. Keyboard navigation (Tab + Enter) works correctly through the form, and the app is intentionally English-only, so neither of those turned out to be real issues. Retested at tablet (768px) and mobile (375px) with Claude's built-in browser (real viewport emulation): tablet fully reproduces desktop's behavior with no responsive-specific issues, and mobile's static layout is equally clean, though its interactive behavior wasn't directly re-confirmed at that width — see the case for why. None of this blocks a user who enters a correct, registered email — hence Medium priority — but it's a rough first impression of the app.

[Full detail →](cases/01-login-screen-review.md)

### Case 02 — Application landing page / Default report (Fall 2026)

**Status:** Issues found — a reproducible, always-visible search defect on the app's highest-traffic screen, plus an icon-vocabulary consistency issue spanning multiple controls.

Walked through the first screen a sales rep or buyer sees after logging in: the Fall 2026 linesheet report, which auto-executes and lands the user there directly. Refresh, full-report scrolling, and the search/filter logic itself all work correctly — a nonsense-string search, a real search ("Tie", "Knit"), and clearing the search all behave as expected. But a "No results found in this report." message renders unconditionally at the end of every search's results list, even directly beneath genuine matches — a clean, single search for "Tie" reproduces it immediately, so it's a real, always-on display defect, not an edge case. Separately, three controls on this screen reuse icon glyphs that already mean something else on the same screen: the header star ("Select All") next to each product's own genuine per-item favorite star; the header X ("Unselect All") next to the X that collapses the left nav panel; and that same panel's X/hamburger toggle, which works correctly but borrows icons whose conventional meaning ("close", "open menu") doesn't quite match what they do here. Everything else tested — the account-name "Select your customer" panel, the "Show Favorites" toggle, all three report View modes, and panel collapse/reopen — worked correctly. Desktop only for this case; tablet and mobile are a follow-up.

[Full detail →](cases/02-post-login-fall-2026-report-landing.md)

### Case 03 — Navigation structure: left panel & user menu

**Status:** Issues found — a misleading section label, a data-accuracy bug where the MY ACCOUNT screen can keep showing a previous customer's real address and orders under a newly selected customer's name, and three Low-priority consistency issues on the same user/account control. Confirmed consistent across desktop, tablet, and mobile — no viewport-specific regressions found. Priority: High.

Reviewed the left navigation panel (present on every authenticated screen) and the top-right "Alan Jalife" user menu: what each of the panel's seven sections contains, how reporting, customer-account administration, and Lilla P's own back-office administration are each grouped, and whether labels stay clear both expanded and collapsed. The panel itself is a clean, predictable single-open accordion, and ADMINISTRATION correctly separates Lilla P's own back-office functions (Manage users, Manage reports, Manage assets) from any single customer's data. But "MY ACCOUNT" is misleadingly named: every item under it requires a customer to be selected first and then shows that customer's orders and payments, not the logged-in Sales Rep's own — confirmed end to end via the "customer must be selected" modal, a selected test customer, and the resulting `/my-account/orders` screen showing that customer's sales orders. Retested at tablet (768px) and mobile (375px): both reproduce desktop's behavior exactly, with mobile adapting the left panel into a full-screen overlay rather than a sidebar — a sensible adaptation, not a bug; the mobile pass needed the same joint testing method as Case 01 and Case 02, since the built-in browser's mobile-click limitation reproduced again. A follow-up test of customer selection via the user menu's search box (rather than its "Recent customers" list) confirmed the search itself works correctly — it matches anywhere in a name across the full customer base, not just the nine recent entries — but surfaced a more serious, unplanned finding: switching the selected customer can leave the MY ACCOUNT screen showing the *previous* customer's real address and orders under the *new* customer's name and heading, sometimes correcting itself after a couple of seconds and sometimes persisting until a manual page reload. This was reproduced 3–4 times across different customer pairs, with a full reload always restoring correct data — confirming it's a refresh-timing bug, not a data-storage problem — and it's serious enough (a Sales Rep could read and act on the wrong customer's real order history) to push the case's overall priority to High. Two smaller, related issues also turned up on the user/account control itself: its "Recent customers" list does show a loading spinner while it fetches — Claude eventually captured it directly on screen — but the spinner is centered in the full viewport rather than near the list and blends into the dark overlay behind the menu, so it read as missing entirely until the UX Assessment Lead caught it live during the mobile follow-up (Low priority, per the UX Assessment Lead); and the control itself changes appearance between its closed state (a name or initials) and its open state (a generic, unrelated icon), across all three viewports. A final check answered a direct question from the UX Assessment Lead about the drawer's own close control: the "X" that closes the user panel sits at the drawer's inner edge (top-left) rather than mirroring its trigger's outer-edge position (top-right), and re-clicking the trigger doesn't toggle the drawer closed — though clicking the dimmed backdrop does, so a working fallback exists.

[Full detail →](cases/03-navigation-structure.md)

## Testing notes

- All testing is done directly on the live test instance.
- No orders are submitted during testing ("Submit Orders" is never clicked).
- Every case gets at least one screenshot documenting the evaluation, saved under `screenshots/case-NN-.../`.
- Full detail on how testing is actually carried out — which browser is used and when, known tooling limitations, and AI's role versus the UX Assessment Lead's — is documented in `documents/ux-assessment.md`, not repeated here per case.
