# Case 03 — Navigation structure: left panel & user menu

**Status:** Issues found — a misleading section label (Finding 1), a data-accuracy bug where MY ACCOUNT can keep showing a previous customer's address and orders under a newly selected customer's name (Finding 2), and three lower-priority consistency issues on the same user/account control (Findings 3–5). Confirmed consistent across desktop, tablet, and mobile — no viewport-specific regressions found.

**Priority:** High overall. Finding 2 is a data-accuracy bug affecting the exact screen a Sales Rep would use to check a customer's real orders, which pushes this above a purely cosmetic case. Finding 1 remains a significant, structural, app-wide labeling mismatch (every item under "MY ACCOUNT" is affected, on every screen, for every Sales Rep) in its own right. Findings 3–5 are each Low on their own (see their own Priority notes) — none of them blocks or misleads a user about what to do next.

## Scope

- **Area:** Targeted heuristic evaluation of the left navigation panel (present app-wide) and the top-right user menu: structure, grouping, and label clarity, both expanded and collapsed.
- **Screen:** App-wide — the left navigation panel and the "Alan Jalife" user menu are present on every authenticated screen; evaluated from the Fall 2026 report and the Administration pages it links to.
- **Interaction boundary:** Desktop pass tested using the user's own real, already-authenticated Chrome session. Expanded every left-panel section and opened every sub-item that was safe to open read-only, including selecting a test customer ("A Line (CA)") to confirm what "MY ACCOUNT" actually shows, then deselecting it again afterward. No user was created, edited, or deleted in Manage users; no report or asset was modified in Manage reports / Manage assets; no order or payment was placed. The tablet/mobile follow-up (see Steps below) re-checked the same surface — left panel, MY ACCOUNT's customer-select modal, ADMINISTRATION, and the user menu — without repeating the full customer-selection walkthrough, since Finding 1 was already fully evidenced on desktop.
- **Session:** Third case of this audit round. Tablet and mobile were completed as a same-case follow-up, matching how Case 02 was closed out — tablet via Claude's built-in browser with viewport emulation, mobile jointly with the UX Assessment Lead due to a known tooling limitation (see Steps and Notes).

## Steps — tablet follow-up (768×1024)

Retested via Claude's built-in browser with real viewport emulation (confirmed via `window.innerWidth`), on the same already-authenticated session.

- Reloaded at 768×1024: the left panel renders exactly as on desktop — same seven sections, same single-open accordion, no collapse-to-icon-rail or drawer treatment at this width.
- Expanded MY ACCOUNT and clicked "Open orders": the same "SELECT CUSTOMER — Customer must be selected for this action" modal appeared, with working CANCEL and SELECT buttons. (One earlier attempt in this same session saw the modal's CANCEL/X/Escape all silently fail to close it — reproducible investigation pointed to a stale in-page state rather than a genuine width-specific bug, since a fresh page reload immediately fixed it and the modal has otherwise behaved normally at every other width tested, before and since.)
- Expanded ADMINISTRATION: same three items (Manage users, Manage reports, Manage assets), same order.
- Opened the top-right user menu: same right-side drawer layout as desktop. "Recent customers" populated with the same nine accounts after a short delay — see Finding 2 for what that delay actually looks like.
- Collapsed the left panel via its top-left control: the whole panel disappears (not an icon rail) and the report reflows to a 2-column grid — matching Case 02's tablet finding for the same control. Reopened cleanly via the hamburger icon.

## Steps — mobile follow-up (375×812)

Attempted first with Claude's built-in browser alone: tapping the hamburger icon to open the left panel timed out after 30 seconds with no effect on the page — the same click-timeout limitation documented in Case 01 and Case 02 (every click action hangs at emulated widths under 768px, while scrolling, keyboard input, and screenshots continue to work normally). Switched to the same joint method used for Case 02's mobile pass: the UX Assessment Lead performs each tap directly in the same emulated browser session and reports it; Claude inspects the resulting state via screenshot.

- UX Assessment Lead tapped the hamburger icon: the left panel opened as a full-screen overlay (not a sidebar, unlike desktop/tablet) — same seven sections, same order, LINESHEETS expanded by default with the same four reports.
- UX Assessment Lead expanded MY ACCOUNT and tapped "Open orders": the same "SELECT CUSTOMER" modal appeared, rendered as a centered dialog over the dimmed panel. Tapped CANCEL, which closed it correctly.
- UX Assessment Lead expanded ADMINISTRATION: same three items, same order.
- UX Assessment Lead closed the panel and tapped the "AJ" avatar to open the user menu: same drawer content as desktop/tablet. This time, the UX Assessment Lead was watching live and caught something Claude's own desktop/tablet passes had missed — see Finding 2.

## Steps — customer search & data-refresh check (desktop, Claude in Chrome)

Two things were still open after the tablet/mobile follow-up: whether the "SELECT CUSTOMER" flow also worked when picking a customer through the search box rather than the "Recent customers" list, and a UX Assessment Lead question about the drawer's close control (see Finding 5). Both were checked back on desktop, in the same real, already-authenticated Chrome session used for the original pass.

- Opened the user menu and typed "line" into "Search by name": results updated to a broader set than the nine Recent Customers — "A Line Boutique", "A Line (CA)", "A Line (Denver)", "A Line (SLC)", "Ameline Shoppe", "Canterbury of Crestline", "Caroline Boutique", "Caroline Rice", "Cobblestone Rose", "Ellie Boutique (Mainline)" and more below the fold — each with its own city/state, confirming this genuinely searches the full customer base (matching substrings inside names, not just the start of the name) rather than filtering the nine-item Recent list.
- Selected "Ameline Shoppe" from those search results: the drawer closed, the top-right chip updated to "Ameline Shoppe", and pricing on the report updated to that customer's own price level — the search-based selection path works.
- Opened MY ACCOUNT → Open orders for the newly selected "Ameline Shoppe": the page briefly showed the *previous* customer's address and order list under "Ameline Shoppe"'s own name and heading, before settling a couple of seconds later on Ameline Shoppe's correct address and its own 3 real orders (SOLP217000–217002). This first read as a loading-transition flash — until it was retested and didn't self-correct at all (see Finding 2).
- Repeated the customer switch three times in a row (via both Recent Customers and search), each time checking the Open Orders screen: the previous customer's address carried over as stale content in all three attempts, and in one of those the previous customer's actual order numbers, dates, and dollar totals carried over too, incorrectly labeled under the new customer's name — see Finding 2 for the full evidence chain.
- Confirmed a fresh page reload (not just re-selecting the customer) reliably shows the correct data for whichever customer is currently selected — used this as a way to determine what the "correct" state looks like versus what a plain customer-switch shows without one.
- Deselected the test customer afterward. No user was created, edited, or deleted; no order or payment was placed; no report or asset was modified.

## Findings

### Finding 1 — "MY ACCOUNT" is misleadingly named: it's the selected customer's account, not the Sales Rep's own

Every item under "MY ACCOUNT" — Open orders, Shipped orders, Make payment, Payment methods, Payment history, Carts list, Activity history — requires a customer to be selected first, and once one is, all seven show that customer's data, not anything belonging to the logged-in Sales Rep. Clicking "Open orders" with no customer selected surfaces a "SELECT CUSTOMER — Customer must be selected for this action" modal (see screenshot). After selecting "A Line (CA)" from that modal, the same link loads "SALES ORDERS" for "A Line Boutique" at a URL that literally reads `/my-account/orders?orderType=open` (see screenshot) — the account section's own URL namespace is "my-account", yet its content belongs entirely to the selected customer.

For a Sales Rep acting on behalf of dozens of buyer accounts, a section labeled "MY ACCOUNT" reads as "my own account" — the natural first guess — when it's actually "the account of whichever customer I currently have selected." That's a real mismatch between the label and what it opens, not just a wording nitpick: a rep could reasonably expect it to hold their own login details or preferences instead.

This reproduced cleanly and is fully evidenced end to end: the "must select a customer" modal, the customer-picker, and the resulting "SALES ORDERS" screen for a *different* named account ("A Line Boutique") than the one just picked ("A Line (CA)") all chain together consistently — see Notes for a related naming wrinkle spotted while capturing this evidence.

**Heuristic relevance:** Match between system and the real world; consistency and standards (a section's label should describe what's inside it).

**Suggested direction:** Rename the section to something that names the customer, not the rep — e.g. "Customer Account" or "Client Orders & Payments" — or, if a customer is selected, show that customer's name in the section header the way the top-right chip already does.

*Screenshots:* `03-select-customer-modal-on-my-account.jpg`, `04-my-account-sales-orders-for-selected-customer.jpg`

### Finding 2 — Switching customers can leave MY ACCOUNT showing the previous customer's address and orders under the new customer's name

After a customer is already selected, switching to a different one — via either "Recent customers" or the search box — does not reliably refresh the content on MY ACCOUNT screens like Open Orders. The page heading and the top-right chip both update immediately to the newly selected customer's name, but the address and order list underneath can keep showing the *previous* customer's real data for longer, in some cases indefinitely without a manual page reload.

This was reproduced three times in a row, switching between "Ameline Shoppe," "Wildflower Boutique (IN)," and "Buka":

- Every time, the street address shown stayed on the previous customer's real address for at least a couple of seconds; twice, it never corrected on its own within several seconds of waiting and needed a manual page reload to fix.
- Once, the order list itself carried over: after selecting "Wildflower Boutique (IN)," the screen showed "Wildflower Boutique (IN)" as the heading, "Ameline Shoppe"'s street address underneath it, and Ameline Shoppe's three real orders (SOLP217000–217002, with their real dates and dollar totals) — none of which belong to Wildflower Boutique. A subsequent page reload confirmed Wildflower Boutique's actual, correct state: its own address, and zero open orders.
- Retesting the same switch into "Ameline Shoppe" a second time reproduced the same pattern in the opposite direction: the heading read "Ameline Shoppe," but the address and "no sales orders" empty state both belonged to whichever customer had been selected immediately before it — even though Ameline Shoppe does have three real orders, confirmed moments later by a reload.

A fresh page reload after selecting a customer reliably shows that customer's own correct data every time — the underlying data and the URL routing are both correct. The bug is specifically that switching customers without a reload does not consistently trigger the address and order list to refetch, while the page's own heading and the global "selected customer" chip do refresh immediately, so the two parts of the screen can disagree about whose data is actually showing.

This is a more serious variant of the same underlying gap as Finding 3 below (a loading/refresh state that's invisible or inconsistent): here, though, the risk isn't just a missed loading cue — it's a Sales Rep potentially reading a wrong customer's real order numbers, dates, and dollar amounts as if they belonged to the customer they just selected, with no visual indication anything is stale.

**Heuristic relevance:** Visibility of system status; match between system and the real world (the visible state must match the actual data).

**Suggested direction:** Make the customer switch a single atomic operation from the user's point of view — don't update the heading/chip until the address and order data for the new customer have actually loaded, and show an explicit loading state on the MY ACCOUNT content itself in the meantime, rather than leaving stale content visible under a new label.

**Priority note:** High — unlike this case's other findings, this one can show a Sales Rep incorrect, specific business data (a real order number, date, and dollar total) mislabeled as belonging to the wrong customer, with nothing on screen to flag it as stale.

*Screenshots:* `09-my-account-stale-customer-data-after-switch.jpg` (Ameline Shoppe heading, but the previous customer's address and an incorrect "no sales orders" state), `10-my-account-correct-data-after-reload.jpg` (the same account, correct, immediately after a reload)

### Finding 3 — "Recent customers" does show a loading spinner, but it's positioned and styled in a way that makes it easy to miss

Opening the top-right user menu shows "Select your customer" with a search box and a "Recent customers" label right away, but the list of recent customers itself can take a few seconds to populate. Claude's own desktop and tablet passes read this window as showing no loading indicator at all — the section just looked empty, then populated a few seconds later with nine recent accounts (A Line Boutique, A Line (CA), A Line (Denver), A Line (SLC), Buka, Chandrasekhar Test, Test Commission2, Test Customer 3, Wildflower Boutique (IN)) — see screenshot.

During the mobile follow-up, watching the same interaction live, the UX Assessment Lead caught what Claude's screenshots had missed: there is a loading spinner (concentric circles, no text) on all three viewports, but it renders centered in the full page viewport — not inside or near the "Recent customers" list itself — and directly over the dark overlay that dims the rest of the page while the drawer is open. Since the spinner is a dark gray, roughly the same tone as that overlay, it blends into the background rather than reading as an active loading state, especially since the user's attention is on the drawer (where the list will appear), not the dimmed center of the screen behind it. Claude's own first two passes (desktop, tablet) each happened to take their evidence screenshot after the query had already resolved, which is why the spinner didn't appear in either of this case's first screenshots. It was caught on camera afterward, while investigating Finding 2 above: opening the user menu again right after switching customers landed a screenshot mid-load, showing the spinner exactly where and how the UX Assessment Lead described it — centered in the viewport, well away from the "Recent customers" label, and barely distinguishable from the dimmed backdrop around it.

This changes the finding's root cause but not its practical effect: a buyer or rep opening this menu still has no usable signal, in practice, that the list is loading rather than empty.

**Heuristic relevance:** Visibility of system status.

**Suggested direction:** Move the loading indicator into the "Recent customers" list area itself (inline spinner or skeleton rows) instead of the center of the viewport, and give it enough contrast against the dimmed overlay to actually be seen.

**Priority note:** Low, per the UX Assessment Lead — a loading indicator does exist, the delay it covers is short, and nothing about it is broken, only easy to miss. Worth fixing but not urgent.

*Screenshots:* `02-user-menu-recent-customers-populated.jpg` (settled, populated state), `08-recent-customers-loading-spinner.jpg` (the spinner itself, caught mid-load)

### Finding 4 — The account/user control changes its own visual identity between closed and open states

Flagged by the UX Assessment Lead while reviewing the tablet and mobile screenshots above, then confirmed at real desktop width too: the top-right control for the current user renders as three different things depending on state and viewport, rather than one consistent element that simply opens a panel.

- **Desktop, panel closed:** plain text, "Alan Jalife", with a dropdown chevron — no icon or avatar at all.
- **Tablet/mobile, panel closed:** a circular avatar showing initials, "AJ".
- **All three viewports, panel open:** the text or initials disappear entirely, replaced by a generic person-silhouette icon in a plain circle — the same icon at every width, unrelated to either the name or the initials shown a moment before.

Since this is the same control before and after the same click, a user has no visual thread connecting the two states — the thing they just clicked seems to change identity rather than simply opening. It's a small effect on any single click, but it sits right next to Finding 1 as a second instance of this case's underlying theme: this area of the app doesn't yet have one consistent way of representing "the current user."

Separately, the open-state icon button also has no accessible name in the page's accessibility tree (it reads as an unlabeled `button`) — worth a mention here since it's the same element, though a full accessibility pass is Area 3's job, not this case's.

**Heuristic relevance:** Consistency and standards (the same control should look and read the same way across its own states).

**Suggested direction:** Pick one representation for the current user — the avatar-with-initials pattern already used at tablet/mobile is the more scalable choice — and use it consistently for this control whether the panel is open or closed, and at every viewport. Add an accessible label to the open-state button regardless of which icon is kept.

**Priority note:** Low. Nothing here blocks or misleads a user about what to do next — it's a minor visual inconsistency on a control most people glance at rather than study.

*Screenshots:* `06-user-menu-open-generic-avatar-icon.jpg`, `07-user-menu-closed-alan-jalife-text-desktop.jpg`

### Finding 5 — The user drawer's close control sits at the opposite corner from where it was opened, and doesn't double as a toggle

Raised as a question by the UX Assessment Lead: is the "X" that closes the user drawer, and its position, actually right? Checked directly: the drawer opens from the top-right of the screen (that's where the avatar/name trigger lives, both open and closed), but its own "X" close control sits at the drawer's opposite, inner edge — the top-left corner of the drawer itself, away from the viewport's outer edge and away from the trigger that opened it.

This breaks symmetry with the app's other slide-out panel: the left navigation panel's own collapse control sits at *its* outer edge (the viewport's top-left, where that panel visually lives), so closing it happens right where you'd reach for it. The user drawer instead puts its close control at its *inner* edge, on the opposite side of the screen from its own trigger.

Two related behaviors, checked directly:

- Clicking the avatar/trigger a second time while the drawer is already open does **not** close it — it has no effect, so the button that opens the drawer can't be used as a toggle to close it again, unlike a common, expected pattern for this kind of control.
- Clicking anywhere on the dimmed backdrop **does** close the drawer correctly, so there's a working, discoverable fallback — this isn't a dead end, just a less direct path than a close control positioned exactly where you'd expect it.

This is also the third distinct place in the app using an "X" glyph (Case 02's Finding 2 already flagged the header "Unselect All" X next to the left-nav collapse X) — here, at least, the *meaning* ("close this panel") is consistent with the nav panel's own X, so this reads as a positioning/predictability issue rather than another instance of the glyph itself carrying conflicting meanings.

**Heuristic relevance:** Consistency and standards (this app's two slide-out panels close themselves via different corners); user control and freedom (a natural "click here again to undo" path is missing, though a working alternative exists).

**Suggested direction:** Move the drawer's close control to its own outer edge (top-right of the viewport, near or replacing the avatar/name trigger) to mirror the left nav panel's convention, and/or make the trigger itself toggle the drawer closed on a second click.

**Priority note:** Low. The backdrop-click fallback means no one gets stuck; this is a minor efficiency and consistency gap, not a blocker.

## Positive observations

- The left panel's seven sections (LINESHEETS, CUSTOM LINESHEETS, REPORTS, SAVE/SHARE/PRINT, MY ACCOUNT, SETTINGS, ADMINISTRATION) are a clean, predictable single-open accordion — expanding one collapses whichever was open before, with no stuck or double-open states (see screenshot).
- Reporting is grouped clearly and predictably: REPORTS (10 report types — Backorder, Booking, Final Sale, In Transit, Offprice, On Hand, Preorder, Sale, Warehouse Sale, Web Reserve), CUSTOM LINESHEETS, and SAVE/SHARE/PRINT (Export as PDF, Export as CSV) sit together and cover generation, browsing, and output without overlap.
- SETTINGS correctly scopes itself to report-display preferences (Hide details, Price level, Currency pricing, Mask quantities) rather than mixing in account-level settings, which keeps its contents predictable once you know what the section is for.
- ADMINISTRATION cleanly separates Lilla P's own back-office functions from any single customer's data — Manage users lists customer-side logins (see screenshot), Manage reports is a full registry of every report/linesheet with shareable-link and user counts, and Manage assets handles style-image uploads. None of the three leak into MY ACCOUNT or vice versa.
- There's no self-service "edit my profile" screen for the logged-in Sales Rep, but this is expected rather than a gap: user records are provisioned through a NetSuite integration, and an administrator manages accounts directly via ADMINISTRATION → Manage users — correctly placed there rather than duplicated elsewhere. (This was an early misread on our part, corrected by the UX Assessment Lead — see Notes.)
- The top-right user menu correctly separates its two real jobs — picking a customer to act on behalf of, and logging out — and once "Recent customers" finishes loading, the list itself is genuinely useful for a rep who works with a small recurring set of accounts.
- The "Search by name" box in that same menu works correctly and searches the full customer base, not just the nine-item Recent Customers list — it matches substrings anywhere in a name (e.g. "line" also matches "Ameline Shoppe" and "Canterbury of Crestline", not only names starting with "Line"), and shows each result's city/state to help disambiguate similarly named accounts. Selecting a customer from search results works the same as selecting one from Recent Customers.
- The underlying customer data itself is correct in every case checked — a fresh page reload after selecting any customer always shows that customer's own correct address and orders. Finding 2's bug is specifically about the screen not refreshing reliably on a plain customer switch, not about wrong data being stored anywhere.
- **Tablet (768×1024), fully verified:** the left panel, the MY ACCOUNT customer-select modal, ADMINISTRATION, and the user menu all reproduce desktop's behavior exactly, with no tablet-specific regressions. Panel collapse/reopen behaves the same as Case 02 found for this same control (whole panel disappears, report reflows to 2 columns).
- **Mobile (375×812), fully verified via joint testing:** the left panel opens as a full-screen overlay instead of a sidebar — a sensible, deliberate adaptation for the width, not a bug — but still surfaces the same seven sections in the same order. The MY ACCOUNT modal and ADMINISTRATION both reproduce cleanly. No mobile-specific layout or content issues found beyond Finding 2's loading-spinner visibility problem, which affects all three viewports equally.

## Notes / follow-up needed

- Findings 4 and 5 both came from questions the UX Assessment Lead raised after reviewing this case's own screenshots and steps — the avatar/icon swap (Finding 4) and the drawer's close-control position (Finding 5) were both things Claude's own passes had walked past without registering as inconsistencies. Both were confirmed and evidenced afterward via Claude in Chrome. Finding 2 (the stale-data bug) was found the same way, while specifically checking the search-based customer selection the UX Assessment Lead asked to have tested.
- Finding 2 was reproduced 3 times in the same session and appears highly reliable, but the exact trigger condition (why it sometimes takes ~2 seconds to self-correct and sometimes doesn't correct at all without a reload) wasn't isolated — worth a developer's read on the actual refetch logic behind a customer switch, rather than more manual reproduction from the UI alone.
- Correction from the UX Assessment Lead, incorporated above (Positive observations): an earlier draft of this case treated the missing "edit my own profile" screen as a navigation gap. It isn't — self-service profile editing isn't part of this app's scope in this version, since user data comes from NetSuite and administrators manage accounts via Manage users.
- Correction from the UX Assessment Lead, incorporated above (Finding 2): two corrections landed on this same finding. First, an earlier draft treated "Recent customers" as an empty/non-functional list, based on a screenshot taken immediately after opening the panel — the query is just slow and the list does populate. Second, during the mobile follow-up, the UX Assessment Lead caught a loading spinner in the live session that Claude's own desktop and tablet screenshots had missed entirely, because it renders centered in the viewport (not near the list) and blends into the dimmed overlay. The finding is now about that spinner's placement and contrast, not about a missing loading state.
- The built-in browser's mobile-viewport click-timeout limitation (documented in Case 01 and Case 02) reproduced again here: tapping the hamburger icon at 375px hung for 30 seconds with no effect, while the same action worked instantly at tablet and desktop widths. The mobile Steps above were completed jointly with the UX Assessment Lead as a result — this is now the standard method for any mobile-viewport case, not a one-off workaround (see `documents/ux-assessment.md`, "Testing tools and browser methodology").
- Separately, during the tablet pass, one early attempt to close the MY ACCOUNT customer-select modal (via CANCEL, the X, and Escape) silently failed to do anything, despite each click reporting success. A page reload immediately resolved it, and the same modal opened and closed normally on every other attempt at every width tested — this reads as a one-off stale-state glitch in the same testing session, not a reproducible tablet-width bug, but it's noted here in case it recurs in a future case.
- While re-capturing evidence for Finding 1 on desktop, selecting "A Line (CA)" from the customer picker triggered an "IN PROGRESS CART" dialog reading "**A Line Boutique** has an in-progress Fall 2026 cart" — i.e. picking one named account surfaced cart state under a *different* customer name, echoing the same "MY ACCOUNT" naming inconsistency from a different angle. Resuming that cart then surfaced a second, unprompted "OUTDATED CART" dialog (reassigned items / missing SKUs). Neither dialog was part of this case's original test plan and neither was investigated further — no cart action beyond "Resume" was taken, to avoid altering real cart data — but this is worth its own case: the customer-picker's relationship between a Sales-Rep-facing name ("A Line (CA)") and the underlying account name used elsewhere ("A Line Boutique") may be a broader consistency issue, not isolated to the MY ACCOUNT label.
- Worth checking later: does Manage users (ADMINISTRATION) also list internal/Sales Rep accounts like Alan Jalife's own, or only customer-side logins? The page viewed here showed only rows with USER TYPE "Customer" before pagination was explored further.
