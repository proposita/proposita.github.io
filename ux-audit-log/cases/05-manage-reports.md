# Case 05 — Administration: Manage Reports (list & row Actions)

**Status:** Issues found — the same checkbox-rendering ambiguity and Actions-icon mismatch found in Case 04, two more table columns that are defined but never populated, one report whose USER count looks suspicious given how heavily it's actually used, and the screen has no responsive/mobile treatment at all.

**Priority:** Medium — the list itself and its three real row actions (Check images, Check prices, Share via Email) all work correctly and are genuinely useful; nothing blocks an admin from auditing or sharing a report. The checkbox-rendering issue (Finding 2) is the most concerning item, since a Price Audit run with the wrong currencies/price-levels selected — without realizing it, because the selection state is hard to read — could produce a misleading CSV.

## Scope

- **Area:** Targeted heuristic evaluation of ADMINISTRATION → Manage Reports: the list itself (scrolling, search), and the per-row "Actions" control's three actions (Check images, Check prices, Share via Email). Explicitly includes a cross-screen consistency check against Case 04 (Manage Users) — icons, typography, colors, and line/border styles.
- **Screen:** `/administration/manage-reports`.
- **Interaction boundary:** Tested using the user's own real, already-authenticated Chrome session. Opened all three Actions items at least once, using "Fall 2026" (the live, heavily-trafficked default report) as the primary test case since it has real styles/colors/prices behind it, unlike several of the empty legacy report types. Ran the Image Audit to completion (a read-only check). Opened the Price Audit and Sharing Options modals and inspected/toggled their controls, but never clicked "RUN PRICE CHECK" or "SHARE," to avoid triggering a real CSV download or sending a real email. Searched the "Report name" box and cleared it. Desktop only, via Claude in Chrome.
- **Session:** Fifth case of this audit round, run together with Case 04 (Manage Users) as a matched pair per the UX Assessment Lead's request. Desktop only, by design — per the UX Assessment Lead, this screen (and Manage Users) was never built with a responsive/mobile treatment, so a tablet/mobile pass would only reproduce the same known gap rather than surface anything new; see Finding 6.

## Steps — list (scrolling & search)

- Opened Manage Reports: a single table (TYPE, REPORT NAME, CREATED, SHAREABLE LINKS, USERS, ACTIONS) listing 15 rows total — the 10 fixed report types (Backorder, Booking, Final Sale, In Transit, Offprice, On Hand, Preorder, Sale, Warehouse Sale, Web Reserve), "Favorites," and the four seasonal linesheets (Spring 2027, Holiday 2026, Fall 2026, In Stock).
- Pressed `End`: confirmed "In Stock" is the true last row — this is the complete list, not a paginated excerpt; no pagination or "load more" controls exist, and none are needed at this scale.
- Searched "fall" in the Report Name box: live-filtered instantly to the single matching row, "Fall 2026."
- Cleared the search: the full 15-row list returned correctly.

## Steps — row Actions

- Clicked the Actions icon (a vertical three-dot "kebab" menu) on the "Favorites" row: opened a dropdown with three items — "Check images," "Check prices," "Share via Email" — each with its own icon.
- Ran "Check images" on Favorites (empty report): opened an "Image audit - Favorites" modal showing 0 styles/colors checked and a green "All rendered styles have a default image and all rendered colors have an image" message — correct for an empty report.
- Ran "Check images" on "Fall 2026" (the real, populated default report): showed a proper inline loading state ("Checking report images..." with a small spinner) before resolving to 58 styles checked, 221 colors checked, 0 missing defaults, 0 missing color images, 0 total issues, and the same green success message.
- Opened "Check prices" on "Fall 2026": a "Price audit - Fall 2026" modal listing every USD price combination — 13 percentage-discount tiers (8% through 80% Off) and 10 named price levels (Bloomingdale's, BO/Volume, CA RT, CA WS, Employee, Promo, Retail, Sale, Wholesale, Wholesale 2) — with the header reading "23 price combination(s) selected." None of the 23 checkboxes showed a checkmark; all rendered as solid gray-filled squares. Clicked "Clear all": the count correctly dropped to "0 price combination(s) selected" and every box switched to a plain white/empty outline, confirming the gray fill really was this control's own "checked" rendering, not a display glitch. Clicked a single box ("8% Off") to confirm: it showed the same gray fill, with the count reading "1 price combination(s) selected." Closed via the modal's own X without running the check.
- Opened "Share via Email" on "Fall 2026": opened a "SHARING OPTIONS" modal (a different title than the menu item that opened it) with Visible To, Link expires (On Date / After N clicks), a "Share with" email field, a message box, and a "Notify me when clicked" checkbox. The "On Date" checkbox was pre-checked and rendered with the same gray-fill, no-checkmark styling seen in the Price Audit — reproducing Finding 2 a second time on this same screen. Closed via CANCEL without sharing anything.

## Findings

### Finding 1 — The "Actions" column uses a different icon here than on Manage Users

Manage Reports' ACTIONS column uses a vertical three-dot "kebab" menu for every row, opening a dropdown of three distinct actions (Check images, Check prices, Share via Email). Manage Users' ACTIONS column (Case 04) uses a single horizontal-lines-with-pencil glyph instead, which opens one direct edit modal with no menu at all. Both columns share the identical "ACTIONS" header label and sit one click apart in the same ADMINISTRATION section.

Here the kebab-menu pattern is the right choice, since this screen genuinely has three separate actions per row — so this finding isn't "Manage Reports got it wrong," it's that the two screens disagree with each other under the same label. See Case 04 Finding 2 for the full write-up; this is the same underlying issue, evidenced from the other side.

**Heuristic relevance:** Consistency and standards.

**Suggested direction:** See Case 04 Finding 2 — standardize which icon represents "one direct action" vs. "a menu of several," and apply it consistently to both screens.

**Priority note:** Low on its own, same design-system pattern already tracked since Case 01.

*Screenshots:* `02-manage-reports-actions-dropdown-menu.jpg` (compare against Case 04's `01-manage-users-list-default-state.jpg`)

### Finding 2 — Checked checkboxes render as an ambiguous gray fill, with no checkmark, in two places on this screen

Both the Price Audit modal's currency/price-level checkboxes and the Sharing Options modal's "Link expires: On Date" checkbox render their true/checked state as a solid gray-filled square, with no checkmark glyph — identical to the issue found independently on Case 04's ACCOUNT SETTINGS modal ("Order Entry Access").

This was directly confirmed on the Price Audit: the modal opened with all 23 available price combinations pre-selected ("23 price combination(s) selected"), yet not one of the 23 checkboxes showed a checkmark — all 23 were the same solid gray fill. Clicking "Clear all" dropped the count to 0 and switched every box to a plain white outline, proving the gray fill genuinely represents "selected," just without the checkmark that would normally signal it. The same pattern repeated on a single checkbox clicked individually, and again on the Sharing Options modal's pre-checked "On Date" box.

Because the Price Audit defaults to all combinations selected, and because "selected" and "not selected" here look almost the same (a light gray square either way, with or without the fill), an admin skimming this modal could easily misjudge which currencies and price levels are actually about to be checked before running the audit — or, in Sharing Options, whether a share link is actually set to expire.

**Heuristic relevance:** Visibility of system status; consistency and standards (the same "checked" concept renders differently here than in the rest of the app, which uses a real checkmark — see the table's own IS B2B ADMIN column on Case 04).

**Suggested direction:** Same as Case 04 Finding 1 — this is very likely one shared checkbox component; give its checked state a visible checkmark (or another unambiguous glyph) consistent with the rest of the app, rather than a plain filled square.

**Priority note:** Medium — the Price Audit case in particular could lead to an admin running (or skipping) checks against the wrong scope of price levels without realizing it, since the default "everything selected" state is the hardest one to visually distinguish from "nothing selected."

*Screenshots:* `05-manage-reports-price-audit-checkboxes-ambiguous.jpg`, `06-manage-reports-price-audit-single-checkbox-state.jpg`, `07-manage-reports-sharing-options-modal.jpg`

### Finding 3 — The TYPE column is defined but never populated, for any report

All 15 rows in the table — every fixed report type and every seasonal linesheet — show a blank TYPE cell. No row seen during this pass had any value in that column, the same pattern as Case 04's COMPANY column.

**Heuristic relevance:** Visibility of system status; aesthetic and minimalist design.

**Suggested direction:** Confirm with engineering whether TYPE is meant to categorize reports (e.g. "Linesheet" vs. "Standard report" vs. "Custom") and simply isn't wired up yet, or whether the column should be removed.

**Priority note:** Low — cosmetic, doesn't block any task tested here.

*Screenshots:* `01-manage-reports-list-default-state.jpg`

### Finding 4 — The USERS column shows 0 for every report, including the live default report every Sales Rep and Buyer lands on

Every row's USERS column reads 0 — including "Fall 2026," which (per Case 02) is the exact report that auto-executes and lands every logged-in user on it immediately after login. If USERS is meant to reflect real usage or assigned access, a 0 here for the app's single most-used report looks wrong on its face.

It's also possible USERS counts something narrower and legitimately zero today — for example, individual user-level report assignments made through some other, not-yet-tested part of ADMINISTRATION, as opposed to the report's default/automatic visibility to everyone. The SHAREABLE LINKS column right next to it does show real, varied, non-zero counts per report (0 through 71), which suggests the table's data layer works in general — it's specifically USERS that's suspicious.

**Heuristic relevance:** Visibility of system status; match between system and the real world.

**Suggested direction:** Requires functional validation with the team — confirm exactly what USERS is meant to count, and whether Fall 2026 legitimately has 0 by that definition or whether this is an undercount.

**Priority note:** Low-Medium — nothing observable breaks because of it, but if this number is ever surfaced to an admin as a usage signal, it's currently misleading for the app's most important report.

### Finding 6 — No responsive/mobile treatment exists for this screen

Per the UX Assessment Lead, Manage Reports (along with Manage Users, see Case 04 Finding 5) was never designed with a tablet or mobile layout — unlike every customer/Sales-Rep-facing screen covered in Cases 01–03, which all adapt at 768px and 375px. Since this is a known, deliberate scope gap rather than something to reproduce and diagnose, a tablet/mobile pass wasn't run for this case.

Being an internal, back-office ADMINISTRATION screen used by Lilla P staff rather than by buyers or Sales Reps in the field, this is a reasonable gap to have deprioritized so far — but it's worth recording as a known, deliberate limitation rather than leaving it undocumented.

**Heuristic relevance:** Flexibility and efficiency of use (an admin who needs to check a report or share a link from a phone or tablet currently cannot).

**Suggested direction:** When responsive work is prioritized for the ADMINISTRATION section, Manage Reports' table is narrower than Manage Users' and would likely reflow more easily — but its three Actions modals (Image audit, Price audit, Sharing Options) would each need their own mobile layout pass, particularly the Price Audit's two-column checkbox grid.

**Priority note:** Low — this is a deliberate, known scope gap on an internal admin tool, not a regression or a broken experience; desirable to fix eventually, not urgent.

## Positive observations

- The Report Name search box filters live and correctly.
- The full report list (15 rows) is short, complete, and needs no pagination — confirmed by jumping to the true last row with `End`.
- "Check images" is a genuinely well-built feature: correct, non-zero counts on a real populated report (58 styles / 221 colors checked for Fall 2026), a proper inline loading state with descriptive text ("Checking report images...") rather than the unlabeled, hard-to-see spinner documented in Case 03 Finding 3 — a positive contrast worth noting.
- "Check prices" correctly lists every real currency/price-level combination actually configured in the system (13 percentage tiers, 10 named price levels) — the underlying audit data is comprehensive; the only issue is the checkbox styling covered in Finding 2.
- "Share via Email" / Sharing Options offers sensible, complete controls (visibility, link expiry by date or click count, a real email field, an optional message, and a notify-on-click toggle) — a fully thought-out feature, not a stub.
- SHAREABLE LINKS shows plausible, varied real counts per report (0 through 71) — this specific column's data looks trustworthy, in contrast to USERS (Finding 4).

## Notes / follow-up needed

- "RUN PRICE CHECK" and "SHARE" were never clicked, to avoid a real CSV download or a real outgoing email during testing.
- Findings 1 and 2 are cross-referenced with Case 04, where the same two patterns were found independently while testing Manage Users. Documented in both cases since each was discovered via that screen's own flow, but they likely represent shared-component fixes rather than separate bugs per screen.
- The Sharing Options modal's title ("SHARING OPTIONS") doesn't match the menu item that opens it ("Share via Email") — a small naming mismatch, not raised as its own finding since the modal's actual scope (a shareable link, with an optional email step) is broader than "email" alone, so the mismatch reads as imprecise labeling rather than a misleading one.
- Finding 6 (no responsive/mobile treatment) is cross-referenced with Case 04 Finding 5 — both ADMINISTRATION screens share the same gap, most likely because both were built without a mobile use case in mind from the start, rather than as two independent oversights.
