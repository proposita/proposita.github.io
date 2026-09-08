# Case 02 — Application landing page / Default report (Fall 2026)

**Status:** Issues found — a reproducible, always-visible search defect on the app's highest-traffic screen, plus an icon-vocabulary consistency issue spanning multiple controls.

**Priority:** High — the core issue (Finding 1) is not a blocker, but it is 100% reproducible on every single search performed on the first screen every sales rep or buyer sees after logging in, and it directly undermines trust in the search results themselves. Frequency and prominence push this above Case 01's Medium, even without a hard functional block.

## Scope

- **Area:** Cognitive walkthrough of the post-login landing flow, plus a targeted heuristic evaluation of the search, header, and left-navigation panel controls on that same screen.
- **Screen:** `/reports/linesheets?report_id=3771&utm_report_name=fall-2026` — the Fall 2026 linesheet report. This is the report that auto-executes and lands the user here immediately after login, with "Fall 2026" pre-selected/highlighted in the left navigation's LINESHEETS list.
- **Interaction boundary:** Tested using the user's own real, already-authenticated Chrome session (via the Claude in Chrome extension) — no test credentials were needed for this case, unlike Case 01. Covered: a full page refresh/re-execution of the report; scrolling the full report to confirm it can be traversed end to end; a three-part search test (a nonsense string, "Tie", "Knit") followed by clearing the search box; the header (logo, collapse toggle, search icon, account-name menu); the elements above the report grid (breadcrumb and the icons to its upper right); the left navigation panel's collapse/reopen behavior; and the three "View" buttons that change the report's display format. The header star ("Select All") and X ("Unselect All") icons were clicked to see what they do, but the resulting confirmation dialog was cancelled without confirming, to avoid actually applying a bulk action to the report. No product was added to a cart and no order was submitted. Desktop only — tablet and mobile were explicitly out of scope for this case per the test plan; they're left for a follow-up.
- **Session:** Continues the current audit round (Case 01 was the first case).

## Findings

### Finding 1 — A "No results found" message always renders after search results, even when real matches are shown above it

Searching "Tie" correctly filters the report down to matching products (e.g. "Tie Front Tee" is shown). But directly below those real, correct results, the UI also renders a "No results found in this report." block — on the same results list, at the same time as genuine matches.

This isn't limited to edge cases: a clean, single search for "Tie" (with no prior no-results search run first) reproduces it immediately, so it isn't leftover state from a previous search. The block appears to render unconditionally at the end of every search-results list, regardless of whether the list above it actually has content.

A user performing the single most common action on this screen — searching within the current season's report — is shown a message telling them their search found nothing, directly underneath the results proving that it did. That's a direct contradiction on screen at the same time, on the app's highest-traffic view.

**Heuristic relevance:** Visibility of system status; error prevention (a false negative status message here is arguably worse than no message, since it actively misleads).

**Suggested direction:** The "No results found in this report." block should only render when the results list is actually empty — this reads as a conditional check that's missing or inverted somewhere in the search-results rendering logic, not a design decision.

*Screenshot:* `04-tie-search-phantom-no-results-bug.jpg`

### Finding 2 — The same icon glyph is reused for different, sometimes conflicting actions across the screen

Three separate controls on this screen reuse a glyph that already carries an established meaning elsewhere on the same screen:

- The header star icon (next to "Show Favorites") triggers "Select All", not "favorite" — yet each individual product card has its own, separate, genuine per-item favorite star, using the identical glyph for a different action (visible on hover, alongside expand/arrow controls).
- The header X icon, right next to that star, triggers "Unselect All" — a bulk-deselect action. The same X glyph, in the opposite corner of the header (before the logo), is also the control used to collapse the left navigation panel.
- That collapse control then turns into a hamburger icon once the panel is collapsed, to reopen it. To be precise: the control itself is visible and works correctly in both directions — it's a real, findable icon in the top-left corner, before the logo, not a hidden hit target. But neither icon is the conventional choice for the job: X commonly signals "close/dismiss this content entirely" rather than "temporarily collapse a persistent panel", and hamburger commonly signals "open a menu" rather than "restore the panel you just collapsed".

None of these three controls is broken — each does what it does, consistently, once you know what it does. But across this one screen, the same two glyphs (star, X) each carry two unrelated meanings, and a third control (the nav toggle) borrows icons from patterns with well-established meanings elsewhere on the web that don't quite match what it's doing here. Taken together, this points to the app not yet having a settled, consistent icon vocabulary, rather than three unrelated one-off issues.

**Heuristic relevance:** Consistency and standards; match between system and the real world (icon meaning should map predictably to its action, and not be reused for unrelated ones).

**Suggested direction:** Define a small, consistent icon vocabulary for this app: reserve the star exclusively for favoriting, use a distinct glyph (a checkbox or grid-select icon) for bulk selection, and use a chevron or arrow — not X/hamburger — for a persistent panel's collapse/expand control. Worth tracking icon consistency as its own thread across future cases, since this is likely to recur elsewhere in the app.

*Screenshot:* `02-report-clean-state-item-hover.jpg` (shows a product card's own per-item favorite star on hover, for comparison against the header icons)

## Positive observations

- Refreshing the page correctly re-executes the report and refreshes its contents, with a clear loading state in between (see `01-report-refresh-loading-state.jpg`) — nothing about the reload reads as broken or stuck.
- The full report can be scrolled and traversed end to end with no dead zones, cut-off content, or broken lazy-loading. The breadcrumb and date/collection chip above the grid track scroll position live, which is a genuinely useful orientation cue in a long report.
- Search itself works correctly at the data level: a nonsense string ("xbxbccbnxnbsjdsjd") correctly returns a report with no real matches (see `03-nonsense-search-no-results-state.jpg`); "Tie" and "Knit" both correctly filter to the right matching products; and clearing the search box correctly and fully restores the original, unfiltered Fall 2026 report. Finding 1 is a display defect layered on top of search, not a defect in the search/filter logic itself.
- The header's account-name menu is a well-built, purposeful "Select your customer" panel for sales reps switching between buyer accounts — not a generic/broken account menu, as its label might suggest at first glance.
- The "Show Favorites" toggle works correctly in both directions and has a good, clear empty state when no favorites are set.
- All three "View" buttons next to the left nav's "View" label work correctly with no bugs: the default photo grid, the grid-with-inventory-table (per color/size breakdown plus an EXPECT. date), and the full-width list view (one product per row with TOTAL and PRICE columns) all render their expected content correctly when switched between.
- Left navigation panel collapse and reopen both work correctly in either direction, via the X/hamburger control in the top-left corner before the logo (see Finding 2 for a note on that control's icon choice).

## Notes / follow-up needed

- This case was scoped to desktop only, per the test plan — tablet (768px) and mobile (375px) behavior for this same screen and its search/panel controls have not been tested yet and should get their own follow-up pass, the same way Case 01 was closed out.
- The header "Select All" / "Unselect All" dialog was seen but deliberately cancelled without confirming, to avoid applying a real bulk action to the report during testing. What "Select All" is actually for (bulk add-to-cart? bulk export?) and whether it behaves correctly when confirmed is untested and out of scope for this case.
- Worth checking later: does the same phantom "No results found" block appear on other reports (a past season, Custom Linesheets), or is it specific to this report/template?

## Assessment boundary and next step

This case covers the post-login landing report at a walkthrough + targeted-heuristic level: refresh, scroll, search, header, left-nav panel, and view modes. It does not touch the order/cart flow (adding items, quantities, submitting orders) or any other report/screen. Next step: either extend this same report into the add-to-cart flow, or move to a different screen (e.g. Custom Linesheets, or a past-season report) to keep breadth across the app before going deeper on any one flow.
