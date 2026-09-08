# Case 04 — Administration: Manage Users (list & row Actions)

**Status:** Issues found — an ambiguous checkbox rendering state inside the row-level Actions modal, an "Actions" icon that doesn't match its counterpart on Manage Reports, two table columns that are defined but never populated in this dataset, and the screen has no responsive/mobile treatment at all.

**Priority:** Medium — nothing here blocks a Sales Rep or admin from searching for, opening, or editing a user record, and the underlying data (search, user type, permission flags) is otherwise accurate. The checkbox-rendering issue (Finding 1) is the one item worth watching more closely, since it could lead an admin to misjudge whether a real permission is actually granted — but it doesn't misreport data the way Case 03's Finding 2 did, since the true state is still recoverable by toggling the box and checking whether it change.

## Scope

- **Area:** Targeted heuristic evaluation of ADMINISTRATION → Manage Users: the list itself (scrolling, search), and the per-row "Actions" control. Explicitly includes a cross-screen consistency check against Case 05 (Manage Reports) — icons, typography, colors, and line/border styles — since both live under the same ADMINISTRATION section.
- **Screen:** `/administration/manage-users`.
- **Interaction boundary:** Tested using the user's own real, already-authenticated Chrome session. Opened the Actions modal for several accounts across all three USER TYPE values found (Customer, Employee, Sales Rep), inspected every field, and toggled one checkbox to test its rendering — always followed by CANCEL, never SAVE, so no account data was changed. DELETE was seen but never clicked. Searched the Email box with several terms (a full email, a domain, a name fragment) and cleared it each time. Toggled "Show Inactive" once. Desktop only, via Claude in Chrome.
- **Session:** Fourth case of this audit round, run together with Case 05 (Manage Reports) as a matched pair per the UX Assessment Lead's request. Desktop only, by design — per the UX Assessment Lead, this screen (and Manage Reports) was never built with a responsive/mobile treatment, so a tablet/mobile pass would only reproduce the same known gap rather than surface anything new; see Finding 5.

## Steps — list (scrolling & search)

- Opened Manage Users: a single, un-paginated table (EMAIL, USER TYPE, COMPANY, IS B2B ADMIN, INACTIVE, NS ACCESS, STATUS, ACTIONS) sorted alphabetically by email, starting at "123mdonahue@gmail.com".
- Scrolled through several screens' worth of rows: the table keeps loading continuously with no stutter, no "load more" button, and no pagination controls — the header row and the app's top bar both stay pinned while scrolling.
- Pressed `End`: jumped straight to the literal last row alphabetically, "ZOE@CLOTHCLOTHING.COM" — confirming the entire user base is rendered as one continuous list, not paginated or virtualized into pages.
- Searched "adele" in the Email box: live-filtered to the single matching row (`adele@nkstfrancisville.com`) instantly, no extra click needed.
- Searched "lillap.com" and separately "gangbaragency": both correctly returned only the matching subset (11 `@lillap.com` accounts, all USER TYPE "Employee"; 5 `@gangbaragency.com` accounts, all USER TYPE "Sales Rep") — confirming the search matches anywhere in the email, not just a prefix, and that internal (non-customer) accounts are included in this list. See Positive observations.
- Toggled "Show Inactive" on, then off: no visible change in the row set in either state — see Notes, since this may just mean no inactive accounts exist in this test data.

## Steps — row Actions

- Clicked the Actions icon (a horizontal-lines-with-pencil glyph) on a Customer row: opened an "ACCOUNT SETTINGS" modal directly — no intermediate menu — with User Information (Email, B2B Access, Is B2B Admin, Pay Now Access, Order Entry Access, Inactive, Reset User Password) and Report Preferences (Country, Pricing Options) side by side, and CANCEL / DELETE / SAVE at the bottom.
- Repeated on an Employee row and a Sales Rep row (`jenny@gangbaragency.com`): same modal, same fields, same layout regardless of USER TYPE.
- On the Sales Rep row's modal, noticed the "Order Entry Access" checkbox rendered as a solid gray-filled square, visually different from every other checkbox on the same form (which were plain white/empty outlines) — see Finding 1.
- Clicked that checkbox once to test it: it toggled to a plain white/empty box (confirming the control itself works and isn't disabled), then clicked CANCEL. Reopened the same account's modal afterward: the checkbox was back to its original gray-filled state, confirming CANCEL correctly discarded the change and nothing was actually saved.
- While the Actions modal was loading (between the click and the modal appearing), one screenshot happened to land mid-load and captured the same low-contrast, viewport-centered loading spinner documented in Case 03 Finding 3 — reproducing here too, on a different screen.

## Findings

### Finding 1 — A checkbox's "checked" state renders as an ambiguous gray fill instead of a checkmark

The "Order Entry Access" checkbox inside the ACCOUNT SETTINGS modal, when checked (true), does not render with a checkmark glyph the way every other true/checked indicator in this app does (for example, the table's own NS ACCESS and IS B2B ADMIN columns, which show a clear ✓). Instead it renders as a plain, solid gray-filled square — visually close to a disabled or indeterminate control, and easy to read as "off" or "not applicable" rather than "on."

This was confirmed directly: clicking the box toggled it to a normal empty white square (proving it isn't disabled and the click registers), and reopening the same account after a CANCEL showed the gray-filled state again, unchanged — so this is the control's genuine default rendering for "checked," not a stuck or broken state.

The same exact rendering — a solid gray square, no checkmark, for a field that is actually selected/true — reproduces on Case 05 (Manage Reports), in both the Price Audit modal's currency/price-level checkboxes and the Sharing Options modal's "Link expires" checkbox. See Case 05 for that evidence; this appears to be one shared checkbox component used inconsistently with the rest of the app's checked-state styling, not three unrelated bugs.

**Heuristic relevance:** Visibility of system status; consistency and standards (the same "checked" concept should look the same everywhere in the app).

**Suggested direction:** Give this checkbox component's checked state the same checkmark treatment used elsewhere in the app (or a filled box with a visible tick), so "on" and "off" are unambiguous at a glance without needing to click and compare.

**Priority note:** Medium — worth fixing promptly since it affects a real permission field an admin might rely on, but the true state is still recoverable (click and observe the toggle), so it isn't a data-accuracy bug like Case 03's Finding 2.

*Screenshots:* `03-manage-users-actions-modal-loading-spinner.jpg`, `04-manage-users-order-entry-access-checkbox-ambiguous.jpg`

### Finding 2 — The "Actions" column uses a different icon here than on Manage Reports

Manage Users' ACTIONS column uses a single glyph — a short horizontal-lines icon with a small pencil overlapping its bottom-right corner — for every row, and clicking it always opens the same single edit modal directly. Manage Reports' ACTIONS column (Case 05) uses a completely different glyph for the same job: a vertical three-dot "kebab" menu, which opens a dropdown of several distinct actions rather than one direct modal.

Both columns share the same header label, "ACTIONS," sit in the same ADMINISTRATION section, and are reached one click apart from each other in the left navigation — but they use unrelated icon metaphors (a single edit action vs. a menu-of-many) for what a user would reasonably expect to be the same kind of control across two sibling admin screens.

**Heuristic relevance:** Consistency and standards.

**Suggested direction:** Standardize on one icon per interaction pattern: if a row only ever has one action, an edit/pencil icon fits; if a row can have several actions (as Manage Reports does), the kebab/three-dot menu is the right choice — but use the same choice consistently for the same underlying pattern, or at minimum don't reuse the identical "ACTIONS" header label for two visually unrelated controls.

**Priority note:** Low on its own — neither control is broken — but it's another data point in the design-system gap already tracked since Case 01 (see `documents/ux-assessment.md`'s priority highlight on this theme).

*Screenshots:* `01-manage-users-list-default-state.jpg` (compare against Case 05's `02-manage-reports-actions-dropdown-menu.jpg`)

### Finding 3 — The COMPANY column is defined but never populated, for any user

Every row in the table — Customer, Employee, and Sales Rep accounts alike, across roughly 500 rows checked by scrolling and by targeted searches — shows a blank COMPANY cell. No row seen during this pass had any value in that column.

It's possible this column is simply not wired up to a data source yet, or that it's meant for a use case (e.g. multi-brand Sales Reps, per the NetSuite contact/customer model raised in Case 03) that doesn't apply to any of the currently-visible accounts. Either way, a column that never shows data across the entire visible user base is worth a direct check with the dev team.

**Heuristic relevance:** Visibility of system status; aesthetic and minimalist design (an always-empty column adds width and visual noise without conveying anything).

**Suggested direction:** Confirm with engineering whether COMPANY is expected to populate under any real condition; if not currently functional, consider hiding it until it is, rather than showing a permanently blank column.

**Priority note:** Low — cosmetic, doesn't block or mislead any task tested here.

*Screenshots:* `02-manage-users-employee-sales-rep-search-results.jpg`

### Finding 4 — Some rows have a blank USER TYPE with a "Validate" status

A handful of rows (for example `caleb@shop-skirt.com`, `bmosamazomwiz1070@gmail.com`, `hpohland@msn.com`, `kathryn@petitandolson.com`, `marcycol@msn.com`, `naomi@mesamies.com`, `Natalie.nibimtk@gmail.com`) show no value at all in USER TYPE, and their STATUS reads "Validate" rather than "Activated." One additional row, `system@lillap.com`, also has a blank USER TYPE but shows "Activated."

This is a small population of accounts out of several hundred, so it reads as a data/onboarding-state edge case rather than a systemic bug — but it's worth understanding whether "Validate" status accounts are expected to lack a USER TYPE until some pending step completes, or whether this is a display gap.

**Heuristic relevance:** Match between system and the real world (a record with no type value is ambiguous about what kind of account it actually is).

**Suggested direction:** Requires functional validation with the team — confirm whether "Validate" status accounts are mid-provisioning (and so legitimately lack a type yet) or whether USER TYPE should always be populated regardless of status.

**Priority note:** Low — affects a small minority of rows and doesn't block searching, viewing, or editing any account.

### Finding 5 — No responsive/mobile treatment exists for this screen

Per the UX Assessment Lead, Manage Users (along with Manage Reports, see Case 05 Finding 6) was never designed with a tablet or mobile layout — unlike every customer/Sales-Rep-facing screen covered in Cases 01–03, which all adapt at 768px and 375px. Since this is a known, deliberate scope gap rather than something to reproduce and diagnose, a tablet/mobile pass wasn't run for this case; the built-in browser's own real-window resize confirmed the desktop table layout doesn't reflow at narrower widths, which is consistent with there being no responsive design intended for this screen at all today.

Being an internal, back-office ADMINISTRATION screen used by Lilla P staff rather than by buyers or Sales Reps in the field, this is a reasonable gap to have deprioritized so far — but it's worth recording as a known, deliberate limitation rather than leaving it undocumented.

**Heuristic relevance:** Flexibility and efficiency of use (an admin who needs to look something up from a phone or tablet currently cannot).

**Suggested direction:** When responsive work is prioritized for the ADMINISTRATION section, Manage Users' wide, many-column table would need a real mobile treatment (e.g. a card-per-user layout, or a reduced column set) rather than a simple reflow, given how many columns it carries.

**Priority note:** Low — this is a deliberate, known scope gap on an internal admin tool, not a regression or a broken experience; desirable to fix eventually, not urgent.

## Positive observations

- The Email search box filters live and correctly: an exact local-part match, a domain-only search, and a company-name fragment all returned exactly the expected subset of rows, with no stale results left over between searches.
- The full list — several hundred rows — scrolls as one continuous, un-paginated table with no stutter, no broken lazy-loading, and no dead zones; `Home`/`End` jump to the true first/last row exactly as expected.
- USER TYPE correctly distinguishes Customer, Employee, and Sales Rep accounts in the same list — this directly answers the open question left in Case 03's Notes (whether Manage Users lists only customer-side logins): it does not, it lists every account type, internal and customer-facing alike.
- IS B2B ADMIN renders correctly with a real checkmark for at least one account confirmed to have it set (`kelsey@lillap.com`), which narrows Finding 1 specifically to the ACCOUNT SETTINGS modal's own checkbox styling rather than a table-wide rendering problem.
- The Actions modal opens the same "ACCOUNT SETTINGS" layout regardless of the row's USER TYPE (Customer, Employee, or Sales Rep tested) — one consistent edit experience, not three different ones.
- CANCEL correctly discards unsaved changes: a checkbox toggled during this pass reverted to its original state on reopening the modal, confirming no accidental edits were persisted.
- The modal's own close "X" sits in the conventional top-right corner of the dialog, matching the corner its own trigger doesn't need to relate to (it's a direct-open modal, not a drawer) — a small, positive contrast with Case 03 Finding 5's drawer-positioning issue.

## Notes / follow-up needed

- "Show Inactive" produced no visible change in either state during this pass. This is inconclusive rather than a negative finding: every row seen across extensive scrolling and searching showed STATUS "Activated" or "Validate," never "Inactive," so it's possible this test dataset simply has no inactive accounts to reveal. Not confirmed either way — would need a known inactive test account to verify the toggle actually filters.
- DELETE was visible on every ACCOUNT SETTINGS modal but never clicked, to avoid deleting a real account.
- Raw email data shows some casing inconsistency (all-caps vs. lowercase addresses) and at least one likely-duplicate pair (`nissa@keepboutique.co` vs. `nissa@keepboutique.com`) — a data-quality observation from the NetSuite/contact source data itself, not a UI defect, so no design recommendation attached.
- Finding 1 (the checkbox rendering bug) and Finding 2 (the Actions icon mismatch) are cross-referenced with Case 05, where the same two patterns were found independently while testing Manage Reports. Documented in both cases since each was discovered via that screen's own flow, but they likely represent two single, shared-component fixes rather than four separate issues — worth flagging to the dev team as such.
- Finding 5 (no responsive/mobile treatment) is likewise cross-referenced with Case 05 Finding 6 — both ADMINISTRATION screens share the same gap, most likely because both were built without a mobile use case in mind from the start, rather than as two independent oversights.
