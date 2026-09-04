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
// Cases 01–03 include the real screenshots captured during the live
// walkthrough. Cases 04–08 (visual/heuristic passes) don't have
// screenshots yet.

import c01img01 from "../assets/ux-audit/case-01/01-linesheet-holiday-landing.jpg";
import c01img02 from "../assets/ux-audit/case-01/02-style-picker-panel-opened.jpg";
import c01img03 from "../assets/ux-audit/case-01/03-quantities-entered-black.jpg";
import c01img04 from "../assets/ux-audit/case-01/04-switch-color-confirmation-modal.jpg";
import c01img05 from "../assets/ux-audit/case-01/05-quantities-entered-navy.jpg";
import c01img06 from "../assets/ux-audit/case-01/06-cart-verification-correct-totals.jpg";

import c02img01 from "../assets/ux-audit/case-02/01-linesheet-fall-landing.jpg";
import c02img02 from "../assets/ux-audit/case-02/02-duplicated-warning-no-quantity-grid.jpg";
import c02img03 from "../assets/ux-audit/case-02/03-color-selected-still-no-grid-visible.jpg";
import c02img04 from "../assets/ux-audit/case-02/04-quantity-grid-revealed-after-scroll.jpg";
import c02img05 from "../assets/ux-audit/case-02/05-cart-shows-ghost-zero-line.jpg";

import c03img01 from "../assets/ux-audit/case-03/01-custom-linesheets-menu.jpg";
import c03img02 from "../assets/ux-audit/case-03/02-navigation-mismatch-reports-all-no-cart-icon.jpg";
import c03img03 from "../assets/ux-audit/case-03/03-quantities-entered-white.jpg";
import c03img04 from "../assets/ux-audit/case-03/04-outdated-cart-error-vs-added-to-cart-button.jpg";
import c03img05 from "../assets/ux-audit/case-03/05-cart-verification-item-missing.jpg";

const case01 = {
  id: "case-01",
  title: "Holiday linesheet: add multiple colors to cart",
  status: "Pass — flow works correctly.",
  statusKind: "pass",
  summary: "Baseline check: entering quantities for two colors and adding both to the cart works correctly, including a safeguard against losing quantities when switching colors.",
  scope: [
    { label: "Area", value: "Key journeys — order entry (Linesheets), cognitive walkthrough baseline." },
    { label: "Report", value: "Holiday 2026 → October → 1X1 Rib." },
    { label: "Style", value: "V-Neck Short Sleeve Back Seam Tee, PA2170." },
    { label: "Interaction boundary", value: "Quantities were entered for two colors and both were added to the cart; the cart was verified directly afterward. No order was submitted." },
    { label: "Session", value: "Run as a baseline, before Cases 02 and 03, to confirm the underlying add-to-cart mechanic works under normal conditions before drawing conclusions from the issues found there." },
  ],
  blocks: [
    {
      type: "steps",
      heading: "Steps",
      items: [
        { text: "Opened the “Holiday 2026” linesheet report and let it load. Breadcrumb: LINE SHEETS > HOLIDAY 2026 > OCTOBER > 1X1 RIB.", image: c01img01, caption: "Holiday linesheet landing" },
        { text: "Scrolled down through the grid of styles until reaching the “Loose Knit Slub” group, and picked V-Neck Short Sleeve Back Seam Tee (PA2170) — a style with 6 available colors, to make sure the multi-color case was meaningfully tested." },
        { text: "Opened its order panel (calculator icon). The panel opened with a color already pre-selected (Black) and no warning of any kind.", image: c01img02, caption: "Style picker panel opened" },
        { text: "Entered quantities for Black across all 5 sizes: XS 3, S 4, M 4, L 3, XL 2 — 16 units total, $560.00. All within the “Available” stock shown per size (130/204/224/143/60).", image: c01img03, caption: "Quantities entered for Black" },
        { text: "Clicked a second color swatch (Navy) before adding Black to the cart. The interface caught this correctly: a confirmation modal appeared — “Add to Cart Not Added — You've selected a quantity for this item but haven't added it to your cart. Click Add to Cart to include it or Cancel to continue without adding.” This is a good safeguard against silently losing entered quantities when switching colors.", image: c01img04, caption: "Switch-color confirmation modal" },
        { text: "Confirmed “Add to Cart” for Black. The panel then switched cleanly to the Navy color, with a fresh, empty quantity grid (stock: 85/125/152/108/30) and the primary button now reading “GO TO CART” — a correct sign that Black had been added successfully." },
        { text: "Entered quantities for Navy: XS 2, S 3, M 3, L 2, XL 1 — 11 units, $385.00.", image: c01img05, caption: "Quantities entered for Navy" },
        { text: "Clicked “Add to Cart”. Button changed to “GO TO CART” again, confirming success." },
        { text: "Opened the real cart page to verify directly (not just trust the button state — see Case 03 for why that matters). The cart showed PA2170 with exactly the entered quantities and correct math: Black 3/4/4/3/2 = 16 units, $560.00; Navy 2/3/3/2/1 = 11 units, $385.00; subtotal $945.00 ✓ (560 + 385).", image: c01img06, caption: "Cart verification — correct totals" },
      ],
    },
    {
      type: "list",
      heading: "Positive observations",
      items: [
        "The color-switch safeguard (step 5) correctly prevents silently losing entered quantities when a second color is picked before adding the first to the cart.",
        "The button state (“Add to Cart” → “GO TO CART”) reliably reflected success throughout this flow.",
        "Cart totals matched the entered quantities exactly, with no discrepancy in unit counts or pricing.",
      ],
    },
    {
      type: "richtext",
      heading: "Notes / follow-up needed",
      paragraphs: [
        "Under normal conditions — a style with no prior cart history, browsed through a standard linesheet — the add-to-cart flow works correctly, including a helpful safeguard when switching colors mid-entry. This confirms the underlying mechanic is sound, which makes the failures in Case 02 and Case 03 more clearly a matter of specific triggering conditions (an existing cart line, or a specific navigation path) rather than the core feature being broken outright. No open questions from this case.",
      ],
    },
  ],
};

const case02 = {
  id: "case-02",
  title: "Fall linesheet: order panel hides the quantity grid behind a “duplicated in cart” warning",
  status: "Issue found.",
  statusKind: "issue",
  summary: "Opening the order panel for a style with an existing zero-quantity cart line shows only a dead-end-looking warning; reaching the quantity grid requires two undiscoverable steps.",
  scope: [
    { label: "Area", value: "Key journeys — order entry (Linesheets), cognitive walkthrough; also touches error prevention, feedback, and recovery (heuristic evaluation)." },
    { label: "Report", value: "Fall 2026 → July → 1X1 Rib." },
    { label: "Style", value: "3/4 Sleeve Boatneck, PA1136." },
    { label: "Interaction boundary", value: "The order panel was opened, a color was selected, and the panel was scrolled to reach the quantity grid; the cart was inspected to understand the pre-existing state. No quantities were submitted and no order was placed." },
    { label: "Session", value: "Encountered while exploring the Fall 2026 linesheet, on a style that — unknown to us at the time — already had an existing line in the cart with every size at zero units. This turned out to be a recurring pattern, not a one-off." },
  ],
  blocks: [
    {
      type: "steps",
      heading: "Steps",
      items: [
        { text: "Opened the “Fall 2026” linesheet. Breadcrumb: LINE SHEETS > FALL 2026 > JULY > 1X1 RIB.", image: c02img01, caption: "Fall linesheet landing" },
        { text: "Opened the order panel for PA1136 (calculator icon). Instead of the usual color swatches + quantity grid, the panel showed only the photo, the color swatches, and a warning box: “This item was duplicated in your cart. Review and adjust quantities in the cart.” No color was pre-selected, no quantity grid was visible, and nothing else appeared below the warning. At this point the panel looks complete — there's no visual cue that anything is missing or that further action (like picking a color) would reveal more.", image: c02img02, caption: "Duplicated warning, no quantity grid visible" },
        { text: "Clicked a color swatch (Dark Navy). The warning disappeared and a “Select Quantity” header appeared — but the actual size/quantity grid was still not visible without scrolling. The “Delivery” dropdown was empty and the “SELECT QUANTITY” button stayed disabled.", image: c02img03, caption: "Color selected, still no grid visible without scrolling" },
        { text: "Scrolled down inside the panel. Only then did the actual quantity grid appear: sizes XS–XL, each showing 50 units under a column header reading “Aug 01” (a date, not the word “Available”) and a quantity stepper.", image: c02img04, caption: "Quantity grid revealed after scrolling" },
        { text: "Checked the real cart to understand the “duplicated” warning. PA1136 had a line there already, with every color and size at 0 units — a $0.00 “ghost” line — sitting above other lines with real quantities (e.g. PA1177 with 32 units in Black).", image: c02img05, caption: "Cart shows the pre-existing zero-quantity line" },
      ],
    },
    {
      type: "richtext",
      heading: "Finding — The “duplicated in cart” warning hides the order controls behind two undiscoverable steps",
      paragraphs: [
        "The warning reads like the final state of the panel, not a prompt to do something else. There's no link to jump to the existing cart line, no “clear it” action, and no explanation of what “duplicated” actually refers to. Reaching the quantity grid requires two undiscoverable steps — select a color, then scroll — with no visual hint (arrow, “scroll for more”, partial grid peeking into view) that either step exists. A buyer moving quickly could reasonably conclude this style simply can't be ordered from this screen.",
        "A secondary observation from the same panel: the stock column header reads “Aug 01” (an expected-delivery date) here, while in Case 01 the same column, for a different style/color, read “Available” instead. Both are presumably showing similar information (units on hand or expected), but the label changes depending on stock status without any legend explaining the difference.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Error prevention, feedback, and recovery; visibility of system status; recognition rather than recall." },
        { label: "Suggested direction", value: "Make the “duplicated in cart” state actionable in place — for example, a link to the existing cart line and a way to clear or adjust it directly from the warning — rather than presenting it as an apparent dead end. Surface the quantity grid without requiring undiscoverable steps. Confirm whether “Aug 01” and “Available” are meant to convey different things and, if so, label them explicitly." },
      ],
    },
    {
      type: "list",
      heading: "Positive observations",
      items: [
        "The underlying order-entry mechanic still works once the grid is actually reached: selecting a color and scrolling does surface a functional quantity grid (further confirmed in Case 01).",
      ],
    },
    {
      type: "richtext",
      heading: "Notes / follow-up needed",
      paragraphs: [
        "This is the second time we've seen a style sit in the cart with every color/size at zero. It doesn't appear to be something we caused — PA1136 had this line before we ever touched its quantities, and the same pattern turned up again, unprompted, on other styles browsed later in the audit (see Case 03's cart screenshots for another example, PA3323). Where these empty lines come from, and whether they point to a functional issue elsewhere in the flow, is worth investigating with a functional or technical stakeholder — separately from the panel-visibility issue documented above, since it appears to be what triggers the “duplicated in cart” warning in the first place.",
        "For a buyer trying to place a large multi-style order, hitting this on any style that already has a stray cart line would look like a dead end, even though the core order-entry mechanic itself works (confirmed in Case 01).",
      ],
    },
  ],
};

const case03 = {
  id: "case-03",
  title: "Custom Linesheets → Reports: Add to Cart fails silently",
  status: "Issue found — high severity.",
  statusKind: "issue-high",
  summary: "Reaching a product through “Custom Linesheets → View all” unexpectedly lands in Reports > All, where Add to Cart shows a contradictory success/failure state and the item is never actually added.",
  scope: [
    { label: "Area", value: "Navigation; key journeys — order entry and cart; also touches error prevention, feedback, and recovery (heuristic evaluation)." },
    { label: "Report/path", value: "Custom Linesheets → View all (unexpectedly lands on Reports > All > October > 1X1 Rib)." },
    { label: "Styles", value: "Long Sleeve Crew (PA1182); reproduced separately with V-Neck Short Sleeve Back Seam Tee (PA1181)." },
    { label: "Interaction boundary", value: "Quantities were entered and “Add to Cart” was clicked; the resulting cart state was verified directly. No order was submitted." },
    { label: "Session", value: "Tested twice, on two separate occasions with two different logins (same underlying account), using two different products each time — the outcome was identical both times." },
  ],
  blocks: [
    {
      type: "steps",
      heading: "Steps",
      items: [
        { text: "Clicked “CUSTOM LINESHEETS” in the sidebar, then its only sub-item, “View all”.", image: c03img01, caption: "Custom Linesheets menu" },
        { text: "This did not open a “Custom Linesheets” view. It landed on breadcrumb REPORTS > ALL > OCTOBER > 1X1 RIB — a completely different section than the one just clicked, with no transition or message indicating a redirect happened. On top of that, the top bar in this section has no cart icon — only the search icon and the account avatar are present.", image: c03img02, caption: "Navigation mismatch: lands on Reports > All, no cart icon in top bar" },
        { text: "Picked a style with no prior cart history (Long Sleeve Crew, PA1182), selected the White color, and entered quantities across all 5 sizes: XS 2, S 3, M 3, L 2, XL 1 — 11 units, $440.00. All within the “Available” stock shown (74/163/157/143/72).", image: c03img03, caption: "Quantities entered for White" },
        { text: "Clicked “Add to Cart”. Instead of confirming the addition, an error modal appeared: “OUTDATED CART — Missing SKUs — The following items were removed from the order because they are no longer available in the report”, listing PA1182 White across all 5 sizes. At the same time, the button behind the modal had already changed to “ADDED TO CART” — directly contradicting what the modal on top of it was saying.", image: c03img04, caption: "Outdated Cart error, with “Added to Cart” showing behind it" },
        { text: "Dismissed the modal and went to the real cart to check the ground truth (rather than trust either the error message or the button). The cart total was unchanged: 55 units, $2,110.00 — exactly what it was before this attempt. PA1182 was nowhere in the cart.", image: c03img05, caption: "Cart verification: item never actually added" },
        { text: "Repeated the same sequence with a second, different style (V-Neck Short Sleeve Back Seam Tee, PA1181, and separately PA1181 in a first pass done without screenshots) — same “Outdated Cart / Missing SKUs” error, same false “Added to Cart” button state, same result confirmed in the cart: nothing added." },
      ],
    },
    {
      type: "richtext",
      heading: "Finding — “Custom Linesheets” routes into a different section, where Add to Cart silently fails",
      paragraphs: [
        "The item is never actually added to the cart, despite the stock shown being well within range and the interaction otherwise looking successful. The button and the modal disagree with each other in the same moment — one says the SKUs were removed as unavailable, the other says they were added. A buyer who doesn't independently check the cart (which most people wouldn't do after seeing “Added to Cart”) would walk away believing their order went through.",
        "This only happens from this specific navigation path. The identical action — same account, same kind of style, same quantities — worked correctly when done from a normal linesheet (see Case 01). The trigger appears to be reaching the product through “Custom Linesheets → View all”, which unexpectedly routes into the “Reports > All” section instead. The missing cart icon in this section's top bar compounds the risk: even a careful buyer who wanted to double-check their cart from this screen has no direct way to do so.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Error prevention, feedback, and recovery; visibility of system status; consistency and standards (the “Custom Linesheets” entry point does not lead to a Custom Linesheets view, and this section's top bar is missing a control present everywhere else)." },
        { label: "Suggested direction", value: "Treat this as an immediate risk rather than a minor bug — confirm with a technical owner why this navigation path lands in “Reports > All” instead of a Custom Linesheets view, and why Add to Cart fails there specifically. Until fixed, the button and modal should never present contradictory outcomes for the same action. Restore the cart icon to this section's top bar regardless of the underlying cause." },
      ],
    },
    {
      type: "list",
      heading: "Positive observations",
      items: [
        "The same add-to-cart action works correctly when performed from a normal linesheet (Case 01), confirming this is not a general failure of the mechanic — it is isolated to this specific navigation path.",
      ],
    },
    {
      type: "richtext",
      heading: "Notes / follow-up needed",
      paragraphs: [
        "For a B2B wholesale ordering tool, an order that silently fails to reach the cart — while the interface tells the buyer it succeeded — is a serious, trust-breaking failure. This is not an edge case tied to unusual input (stock, quantities, and product were all unremarkable); it's tied to a specific, discoverable navigation path that a buyer could easily land on by clicking “Custom Linesheets” from the main menu, as we did. This should be validated with a technical stakeholder to confirm the root cause before finalizing a fix recommendation.",
      ],
    },
  ],
};

const case04 = {
  id: "case-04",
  title: "Spring 2027 linesheet: card and product drawer show different availability",
  status: "Issue found — independent from Cases 01–03.",
  statusKind: "issue",
  category: "visibility-status",
  summary: "The product card and the drawer show different “Available” quantities for the same product, color, and size — reproduced on two styles.",
  scope: [
    { label: "Area", value: "Targeted heuristic evaluation — consistency and system status visibility." },
    { label: "Report", value: "Spring 2027 → January → 1X1 Rib." },
    { label: "Style", value: "Long Sleeve Turtleneck Tee, PA1278." },
    { label: "Interaction boundary", value: "The cart was inspected, but no order was submitted." },
    { label: "Session", value: "New assessment session; existing audit cases were not edited or reused as the test record." },
  ],
  blocks: [
    {
      type: "steps",
      heading: "Steps",
      items: [
        { text: "Open the Spring 2027 linesheet report." },
        { text: "Locate the Long Sleeve Turtleneck Tee PA1278 product card." },
        { text: "Record the availability values shown in the card for the Black color." },
        { text: "Open the product drawer by clicking the card." },
        { text: "Select the Black color swatch." },
        { text: "Compare the drawer's Available quantities with the values shown in the card." },
      ],
    },
    {
      type: "table",
      heading: "Evidence observed",
      note: "The product card showed the following Black availability values by size:",
      headers: ["XS", "S", "M", "L", "XL"],
      rows: [
        ["Card — Black", "102", "203", "204", "124", "63"],
        ["Drawer — Black", "36", "87", "87", "74", "37"],
      ],
    },
    {
      type: "richtext",
      paragraphs: [
        "The drawer was displaying “1/30 X-Warehouse” as the selected delivery option. No explanation was provided for why the quantities differed from the product card, and the card's surrounding report context did not make the distinction apparent.",
        "The same pattern was reproduced with a second, previously untested style in the same report: Short Sleeve Crew PA1142. Its card showed Heather Grey availability of 0 / 23 / 67 / 37 / 27 (XS through XL), while the drawer showed 200 / 200 / 200 / 200 / 200 for the same color.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Consistency and standards — the same product/color/size combination presents two different availability states within the same report flow. Visibility of system status — the interface does not explain whether the drawer is showing a different inventory source, delivery allocation, or refreshed stock state. Error prevention — a buyer may enter quantities based on one representation and add a different quantity expectation based on the other." },
      ],
    },
    {
      type: "richtext",
      heading: "Follow-up needed",
      paragraphs: [
        "Confirm with a functional or technical owner whether the card and drawer intentionally represent different inventory concepts. If they do, the UI should label the distinction explicitly; if they do not, the data shown by one of the views should be corrected.",
      ],
    },
  ],
};

const case05 = {
  id: "case-05",
  title: "Linesheets: visual consistency and composition review",
  status: "Issues found — visual heuristic pass only.",
  statusKind: "issue",
  category: "design-system",
  summary: "Breadcrumb labels don't match the navigation's naming convention, and the extended list view breaks down at the inspected viewport width.",
  scope: [
    { label: "Area", value: "Targeted heuristic evaluation — visual consistency and standards." },
    { label: "Report", value: "Spring 2027 → January → 1X1 Rib." },
    { label: "Views reviewed", value: "Gallery, one-column list, and extended list." },
    { label: "Interaction boundary", value: "Product cards and the drawer were inspected visually. No quantities were changed and no item was added to the cart during this pass." },
    { label: "Session", value: "New visual assessment pass; Cases 01–04 were not edited or reused as the test record." },
  ],
  blocks: [
    {
      type: "richtext",
      heading: "Finding 1 — Breadcrumb terminology is inconsistent with the navigation labels",
      paragraphs: [
        "The left navigation uses full, title-case names such as Spring 2027, Holiday 2026, and Fall 2026. The breadcrumb uses compressed labels such as LS, SPRING 27, JAN, and 1X1 RIB.",
        "This creates an avoidable visual and language inconsistency within the same screen. The breadcrumb also mixes an acronym (LS), an abbreviated year (27), a month abbreviation (JAN), and an uppercase style name. The user must mentally map these labels back to the full names shown in the navigation.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Consistency and standards; recognition rather than recall." },
        { label: "Suggested direction", value: "Use the same naming convention across navigation and breadcrumb, or establish a deliberate, consistently applied compact-label system with clear rules." },
      ],
    },
    {
      type: "richtext",
      heading: "Finding 2 — Extended list view has a readability and composition breakdown",
      paragraphs: [
        "In the extended list view, the product image, product information, inventory table, and additional columns are forced into a narrow horizontal area. The result observed in the test viewport included:",
      ],
    },
    {
      type: "list",
      items: [
        "column headers compressed into very small clusters;",
        "adjacent numeric values visually concatenated, for example 200200200200200;",
        "color names wrapping in ways that make row scanning difficult;",
        "right-side columns partially clipped;",
        "a horizontal scrollbar required to inspect the full table;",
        "the visual hierarchy between product identity, inventory values, and expected date becoming difficult to follow.",
      ],
    },
    {
      type: "richtext",
      paragraphs: [
        "This is primarily a composition and readability problem. The view technically exposes the information, but the visual treatment does not preserve a usable table structure at the inspected viewport width.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Consistency and standards; aesthetic and minimalist design; recognition rather than recall." },
        { label: "Suggested direction", value: "Define minimum column widths and responsive behavior for the extended list. Consider prioritizing core columns, allowing controlled wrapping, or moving secondary information into a structured secondary region rather than compressing all columns into the same width." },
      ],
    },
    {
      type: "list",
      heading: "Positive observations",
      items: [
        "Product name, style code, and wholesale/retail price use the same content pattern between the product card and drawer.",
        "Color swatches use the same visual palette between the card and drawer, while the drawer adds the selected color name.",
        "Product imagery, product identity, and pricing remain visually recognizable when moving from the card to the drawer.",
      ],
    },
    {
      type: "richtext",
      heading: "Notes / follow-up needed",
      paragraphs: [
        "This case intentionally excludes quantity validation, add-to-cart behavior, cart state, and order submission. Those belong to the later journey and functional validation workstreams.",
      ],
    },
  ],
};

const case06 = {
  id: "case-06",
  title: "My Account and Administration: visual review",
  status: "Visual review completed; one cross-section inconsistency confirmed.",
  statusKind: "issue",
  category: "design-system",
  summary: "Breadcrumb formatting conventions differ between the Holiday 2026 and Spring 2027 linesheets, reinforcing the consistency concern raised in Case 05.",
  scope: [
    { label: "Area", value: "Targeted heuristic evaluation — visual consistency and standards." },
    { label: "Sections reviewed", value: "My Account and Administration." },
    { label: "Reference context", value: "Holiday 2026 linesheet, with comparison against the previously inspected Spring 2027 linesheet." },
    { label: "Interaction boundary", value: "Only navigation accordions were expanded and collapsed for visual inspection. No subsection was opened, no data was changed, and no transactional action was performed." },
    { label: "Session", value: "New visual assessment pass; previous cases were not edited." },
  ],
  blocks: [
    {
      type: "richtext",
      heading: "Cross-section finding — Breadcrumb formatting changes between reports",
      paragraphs: [
        "The breadcrumb shown on the Holiday 2026 linesheet uses full labels: LINE SHEETS > HOLIDAY 2026 > OCTOBER > 1X1 RIB. The previously inspected Spring 2027 linesheet used a compact, mixed abbreviation pattern: LS > SPRING 27 > JAN > 1X1 RIB.",
        "The two reports are presented within the same Linesheets area and at the same application level, but the breadcrumb conventions change between them. This reinforces the visual consistency concern identified in Case 05: the interface does not appear to apply one stable naming and abbreviation system.",
      ],
      meta: [
        { label: "Heuristic relevance", value: "Consistency and standards; recognition rather than recall." },
        { label: "Suggested direction", value: "Define one breadcrumb convention and apply it across all report instances. If responsive or space constraints require compact labels, use a consistent compact format and preserve the same semantic level across all breadcrumbs." },
      ],
    },
    {
      type: "list",
      heading: "My Account — consistency observations",
      items: [
        "The section header uses the same uppercase treatment as the other primary navigation groups.",
        "Sub-items use a consistent sentence-case treatment: Open orders, Shipped orders, Make payment, Payment methods, Payment history, Carts list, and Activity history.",
        "The icon-and-label rows share a consistent left alignment, spacing pattern, and muted dark-gray line-icon treatment.",
        "The expanded/collapsed state uses the same chevron treatment as the other navigation accordions.",
      ],
    },
    {
      type: "richtext",
      paragraphs: ["No additional confirmed visual inconsistency was recorded in this section."],
    },
    {
      type: "list",
      heading: "Administration — consistency observations",
      items: [
        "Manage users, Manage reports, and Manage assets follow the same icon-and-label pattern used by My Account.",
        "The section header, chevron, capitalization, indentation, and vertical spacing are visually aligned with My Account and the other primary navigation groups.",
        "Opening Administration collapses My Account, preserving the single-open accordion behavior seen elsewhere in the navigation.",
      ],
    },
    {
      type: "richtext",
      paragraphs: ["No additional confirmed visual inconsistency was recorded in this section."],
    },
    {
      type: "richtext",
      heading: "Notes / follow-up needed",
      paragraphs: [
        "This case intentionally excludes page-level functional behavior inside My Account and Administration. Those areas can be evaluated later through the key-journey and functional validation workstreams.",
      ],
    },
  ],
};

const case07 = {
  id: "case-07",
  title: "Administration Actions: visual consistency review",
  status: "Issue found — inconsistent action affordances and presentation patterns.",
  statusKind: "issue",
  category: "design-system",
  summary: "Manage users and Manage reports expose row-level actions through different affordances and interaction patterns, with no visual system explaining the difference.",
  scope: [
    { label: "Area", value: "Targeted heuristic evaluation — visual consistency and standards." },
    { label: "Screens reviewed", value: "Administration → Manage users and Administration → Manage reports." },
    { label: "Interaction boundary", value: "Opened the first row's Actions control on each screen for visual inspection only. No edit, delete, save, validation, image check, price check, or email action was executed." },
    { label: "Session", value: "New assessment pass; previous cases were not edited." },
  ],
  blocks: [
    {
      type: "richtext",
      heading: "Finding — The Actions column uses different visual affordances and interaction patterns",
      paragraphs: [
        "Both screens expose a final column labeled ACTIONS, but the control presented to the user is materially different:",
      ],
    },
    {
      type: "list",
      heading: "Manage users",
      items: [
        "Uses a direct edit-style icon (users_edit_32x32.png) resembling lines with a pencil.",
        "The icon has no visible text label.",
        "Selecting it opens a large modal titled ACCOUNT SETTINGS.",
        "The modal contains editable user information, access checkboxes, report preferences, and CANCEL, DELETE, and SAVE controls.",
      ],
    },
    {
      type: "list",
      heading: "Manage reports",
      items: [
        "Uses a vertical three-dot icon as the action trigger.",
        "Selecting it opens a compact contextual menu aligned to the right of the row.",
        "The menu contains Check images, Check prices, and Share via Email, each with a separate icon and label.",
      ],
    },
    {
      type: "richtext",
      heading: "Why this matters visually",
      paragraphs: [
        "The same column heading and table context establish an expectation that row actions will follow a shared interaction convention. Instead, one screen communicates a direct edit action while the other communicates a multi-option overflow menu. The difference may be justified by the underlying tasks, but the interface provides no visual system that explains why the action model changes between adjacent Administration screens. The discrepancy is especially noticeable because:",
      ],
    },
    {
      type: "list",
      items: [
        "one trigger is a specific object/action icon and the other is a generic overflow icon;",
        "one action opens a modal while the other opens an inline menu;",
        "the user-facing affordance is unlabeled in Manage users but labeled after opening in Manage reports;",
        "the action icon treatment and menu treatment do not establish a consistent pattern for administrative tables.",
      ],
    },
    {
      type: "richtext",
      meta: [
        { label: "Heuristic relevance", value: "Consistency and standards; recognition rather than recall; user control and freedom." },
        { label: "Suggested direction", value: "Define a shared pattern for administrative table actions. For example, use the same overflow trigger in both tables, with the resulting menu exposing the relevant actions for that row. If a direct edit affordance is intentionally retained for users, supplement it with a consistent visual and interaction rule so users can understand when an action is direct edit versus a broader action menu." },
      ],
    },
    {
      type: "list",
      heading: "Positive observations",
      items: [
        "Both tables use the same uppercase ACTIONS column treatment.",
        "The report action menu uses concise labels and supporting icons, making its available options easy to scan once opened.",
        "The user settings modal has a clear two-section structure: User Information and Report Preferences.",
      ],
    },
  ],
};

const case08 = {
  id: "case-08",
  title: "My Account Orders: visual review",
  status: "Page-content review pending — customer context required.",
  statusKind: "pending",
  category: "visibility-status",
  summary: "Both Open orders and Shipped orders require a selected customer before rendering; the actual page layouts couldn't be evaluated in this pass.",
  scope: [
    { label: "Area", value: "Targeted heuristic evaluation — visual consistency and standards." },
    { label: "Screens requested", value: "My Account → Open orders and My Account → Shipped orders." },
    { label: "Session state", value: "No customer was selected in the test session." },
    { label: "Interaction boundary", value: "Navigation only. No customer was selected and no order, row, or action control was opened." },
    { label: "Session", value: "New assessment pass; previous cases were not edited." },
  ],
  blocks: [
    {
      type: "richtext",
      heading: "Observed access state",
      paragraphs: ["Selecting either Open orders or Shipped orders produced the same blocking dialog:"],
    },
    {
      type: "list",
      items: [
        "Heading: SELECT CUSTOMER",
        "Message: Customer must be selected for this action",
        "Controls: CANCEL and SELECT",
      ],
    },
    {
      type: "richtext",
      paragraphs: [
        "The dialog was dismissed with CANCEL after each observation. The SELECT control was not activated because doing so would change the functional customer context, which is outside this visual-only pass.",
      ],
    },
    {
      type: "list",
      heading: "My Account navigation — consistency observations",
      items: [
        "Open orders and Shipped orders use the same navigation structure, typography, icon treatment, and indentation as the other My Account entries.",
        "The two labels use the same sentence-case style and parallel wording.",
      ],
    },
    {
      type: "list",
      heading: "Customer-selection dialog — consistency observations",
      items: [
        "The same dialog pattern and wording was presented for both destinations.",
        "The uppercase dialog heading and uppercase action labels are visually aligned with the portal's broader use of uppercase section and breadcrumb labels. No cross-page inconsistency was confirmed from this shared state.",
      ],
    },
    {
      type: "richtext",
      heading: "Assessment boundary and next step",
      paragraphs: [
        "The actual order-page layouts could not be evaluated in this pass because both destinations require a selected customer before rendering their content. A follow-up visual review should be performed after the UX Assessment Lead establishes a suitable test customer context. That review should compare the two pages for:",
      ],
    },
    {
      type: "list",
      items: [
        "page title and breadcrumb treatment;",
        "table or card structure, column labels, and spacing;",
        "order status styling and date/number formatting;",
        "empty-state messaging, if applicable;",
        "row-level action affordances and icon consistency.",
      ],
    },
    {
      type: "richtext",
      paragraphs: ["No confirmed visual finding is recorded for the order-page content based on this pass."],
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
          "This assessment uses Nielsen's heuristics as its diagnostic framework, with AI carrying out the hands-on inspection under the UX Assessment Lead's direction. A heuristic evaluation is an expert inspection method in which evaluators — AI, in this case — review an interface against recognized usability principles. Nielsen's ten heuristics are general principles rather than detailed interface requirements, which makes them useful as a diagnostic framework rather than a rigid checklist.",
          "The complete set includes principles such as visibility of system status, user control and freedom, consistency and standards, error prevention, and helping users recognize, diagnose, and recover from errors. For this assessment, we deliberately focus on the principles most relevant to the current product:",
        ],
      },
      {
        type: "list",
        items: [
          "Consistency and standards",
          "Visibility of system status",
          "Error prevention",
          "Recognition, diagnosis, and recovery from errors",
          "User control and freedom, where recovery or cancellation is relevant",
        ],
      },
      {
        type: "richtext",
        paragraphs: [
          "This is a targeted heuristic evaluation, not a claim that all ten heuristics have been exhaustively reviewed across the entire application.",
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
      },
      {
        type: "richtext",
        paragraphs: [
          "The absence of a formal Design System or component library makes this a particularly relevant focus. The assessment should prioritize recurring patterns and meaningful inconsistencies rather than produce a complete visual inventory.",
        ],
      },
      {
        type: "richtext",
        heading: "What to inspect — Error prevention, feedback, and recovery",
        paragraphs: ["For each relevant interaction, ask:"],
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Does the system prevent the error where possible?",
          "Does it clearly explain what happened?",
          "Does it preserve the user's work?",
          "Does it offer an obvious next action?",
          "Does the visible state match the actual system state?",
        ],
      },
      {
        type: "richtext",
        paragraphs: [
          "Inspect silent failures, contradictory messages, stale or empty states, unexpected redirects, duplicate or zero-quantity records, lost input, unclear disabled actions, generic errors, and recovery after checkout or payment problems.",
        ],
      },
      {
        type: "richtext",
        heading: "AI contribution",
        paragraphs: ["AI's role in this area is to:"],
      },
      {
        type: "list",
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
      body: "AI grouped the issues found during this evaluation into the three categories below, based on the usability principle each one relates to most closely. Each category opens into its own findings, with the observed evidence and a suggested direction for each one.",
    },
    // Categories group this phase's findings by which of Area 1's
    // heuristic principles they primarily relate to (see
    // documents/ux-assessment.md, Area 1 — What to inspect). Each finding
    // above declares its `category` by this same id.
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
    findings: [case04, case05, case06, case07, case08],
  },
  {
    id: "cognitive-walkthrough",
    chapterIndex: 1,
    eyebrow: "Area 2",
    title: "Key journeys and cognitive walkthrough",
    intro: "A compact map of the main buyer journeys (browsing, order entry, cart, account, administration), followed by guided walkthroughs of representative tasks to check whether the next step is always clear, understandable, and recoverable.",
    explainer: [
      {
        type: "richtext",
        heading: "Experience map",
        paragraphs: [
          "The experience map should define the key journeys in a compact format. It does not need detailed personas or complete business-process documentation.",
          "For each journey, capture:",
        ],
      },
      {
        type: "list",
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
        paragraphs: ["Initial journeys may include:"],
      },
      {
        type: "list",
        items: [
          "access and customer selection",
          "catalog and linesheet browsing",
          "product and order entry",
          "cart verification",
          "checkout and payment",
          "orders and account history",
          "administration",
        ],
      },
      {
        type: "richtext",
        paragraphs: [
          "The map will guide case selection and make coverage visible. It should be updated as the assessment reveals new paths, states, or relationships between modules.",
        ],
      },
      {
        type: "richtext",
        heading: "Cognitive walkthrough",
        paragraphs: [
          "A cognitive walkthrough is appropriate because it evaluates learnability and discoverability through a task, without requiring formal user participation. The walkthrough asks whether a person can understand the goal, identify the next action, associate that action with the desired result, and recover when the expected result does not occur.",
          "The walkthroughs will be:",
        ],
      },
      {
        type: "list",
        items: [
          "limited to a small number of representative journeys",
          "executed by AI in the live test application",
          "guided and reviewed by the UX Assessment Lead",
          "based on realistic goals already understood from the project context",
          "documented with observed behavior and supporting evidence",
        ],
      },
      {
        type: "richtext",
        paragraphs: ["The initial audit cases provide a useful starting set:"],
      },
      {
        type: "list",
        items: [
          "Case 01: a normal multi-color order-entry flow that succeeds",
          "Case 02: an existing cart state that hides or changes the order-entry experience",
          "Case 03: a navigation path that produces contradictory add-to-cart feedback and a cart-integrity failure",
        ],
      },
      {
        type: "richtext",
        paragraphs: ["For each selected journey, ask:"],
      },
      {
        type: "list",
        items: [
          "Is the user's goal clear?",
          "Is the next action visible and understandable?",
          "Does the interface explain the current state?",
          "Does the result match the user's expectation?",
          "If the action fails, can the user recover without losing work?",
        ],
      },
      {
        type: "richtext",
        heading: "AI contribution",
        paragraphs: ["AI's role in this area is to:"],
      },
      {
        type: "list",
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
    findings: [case01, case02, case03],
  },
  {
    id: "responsive-accessibility",
    chapterIndex: 1,
    eyebrow: "Area 3",
    title: "Responsive and accessibility spot checks",
    intro: "A targeted look at representative screen sizes and high-risk interface patterns — not a full responsive audit or a WCAG conformance assessment, but a check on where the experience breaks down.",
    explainer: [
      {
        type: "richtext",
        heading: "Scope",
        paragraphs: [
          "This area is a targeted review, not a full responsive audit or WCAG conformance assessment. It should focus on representative viewports, high-risk modules, and patterns already encountered in the first two areas.",
          "Review:",
        ],
      },
      {
        type: "list",
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
        type: "richtext",
        heading: "AI contribution",
        paragraphs: ["AI's role in this area is to:"],
      },
      {
        type: "list",
        items: [
          "navigate the same journey at selected viewport sizes",
          "compare screenshots across viewports",
          "detect clipping, overflow, disappearing actions, and inconsistent layout behavior",
          "identify repeated responsive and accessibility patterns",
          "capture evidence and draft recommendations",
        ],
      },
    ],
    findings: [],
  },
];
