# Case 01 — Login screen: cross-area review

**Status:** Issues found — no blocker on the primary path, but a silent dead end on user error.

**Priority:** Medium — no finding blocks a user who enters a correct, registered email from continuing; the issues found are edge cases (empty submit, malformed input) at the app's single entry point, so they're worth fixing but don't appear to be stopping the main flow today.

## Scope

- **Area:** All three methodology areas, applied together to a single screen — targeted heuristic evaluation, cognitive walkthrough, and a responsive/accessibility spot check.
- **Screen:** `/login` (the "Log in / Register" email-first screen), plus where it leads: `/signuprequest` ("Complete your registration").
- **Interaction boundary:** No login was completed and no account was accessed — this session has no test credentials for the portal. Testing was limited to the pre-authentication screen itself: submitting it empty, submitting a malformed string, submitting a valid-format but unregistered email, keyboard-only navigation, and a responsive check at tablet (768×1024) and mobile (375×812) viewports. No real signup request was submitted (the `/signuprequest` form was inspected but its own Submit button was never clicked, to avoid creating a real request in Lilla P's system). The keyboard-navigation check was later redone manually by the UX Assessment Lead — see Positive observations. The responsive check was redone with Claude's built-in browser (real viewport emulation) after the first attempt, with a different browser tool, failed to actually change the rendered viewport — see Positive observations and Notes.
- **Session:** First case of this audit round.

## Findings

### Finding 1 — Submitting the form empty gives no feedback at all

Clicking "Continue" with the Email field empty produces no visible change: no inline error, no field highlight, no message near the button. A check of network activity confirmed no request is even sent — the click is a complete no-op. A user who clicks Continue too early (a very likely first interaction on this screen) has no way to know why nothing happened.

**Heuristic relevance:** Error prevention; visibility of system status.

**Suggested direction:** Either disable "Continue" until the field has a plausible value, or show an inline "Enter your email to continue" message on click.

### Finding 2 — No email-format validation before submitting

Typing a string with no `@` and no domain (`notanemail`) is accepted by the form exactly like a real email: the button shows a loading state for several seconds, then the app redirects to `/signuprequest` ("Complete your registration") with that same malformed string carried over verbatim into the (disabled/pre-filled) Email field of the registration form.

There is no client-side check that the input even looks like an email before the app commits to a multi-second round trip and lands the user on an unrelated, longer form. A user who mistypes their email (a missing `@`, a stray space, a typo) is not told their input was invalid — they're dropped into a "request access" flow with a broken email address baked into a field they can't edit.

**Heuristic relevance:** Error prevention; recognition, diagnosis, and recovery from errors.

**Suggested direction:** Validate email format client-side before submitting, with an inline message, before ever reaching the "not found" / registration-request path.

### Finding 3 — The wait before redirecting has no status message

Between clicking "Continue" and landing on either the next login step or `/signuprequest`, the button shows a spinner for roughly 2–3 seconds with no accompanying text. Nothing tells the user what's happening ("Checking your email…" or similar), so a slower response could easily read as the screen being stuck rather than working — this is the same gap that let Finding 2 go unnoticed until the redirect actually happened.

**Heuristic relevance:** Visibility of system status.

**Journey relevance:** The goal ("log in") is clear and the field/button are unambiguous, but the system gives no signal of what it's doing while it decides whether this email exists — the walkthrough's "does the interface explain the current state?" check fails here.

**Suggested direction:** A short status label alongside the spinner would close this gap cheaply.

## Positive observations

- The screen is minimal and focused: one field, one primary action for the first step, which keeps the initial decision simple.
- The Email field shows a clear, reasonably high-contrast focus outline when tabbed into.
- Full keyboard navigation works correctly: Tab reaches "Continue" and Enter submits the form from the Email field, confirmed by a manual retest from the UX Assessment Lead (an earlier automated check in this session had misread the tab order — corrected here).
- The app is currently English-only by design, with no multi-language support — the Spanish text on the Google sign-in button ("Continuar con Google") is that provider's own button label, not an inconsistency in Lilla P's UI.
- The "email not found → request access" pattern itself is a coherent, intentional design for a B2B portal without open self-signup (as opposed to a bug): it behaved identically and predictably for both a malformed string and a valid-format but unregistered email.
- **Tablet (768×1024), fully verified:** both `/login` and the `/signuprequest` ("Complete your registration") form render cleanly — no clipping, no overlapping fields, labels and buttons stay fully usable, "By registering…" checkbox text wraps normally, and Submit is reachable after a short scroll. Repeated the empty-submit and invalid-email ("notanemail") tests at this width and got identical results to desktop (Findings 1–3 above), so there's no tablet-specific regression.
- **Mobile (375×812), layout confirmed clean:** the login screen renders with the same clean, centered, non-clipped layout as tablet/desktop — no responsive breakage visible. Interactive testing (submitting the form) could not be completed at this exact width in this session — see Notes — so this is a visual-only confirmation, not a full walkthrough.

## Notes / follow-up needed

- This case could not be extended past the email step: this session has no test credentials for the portal, so the password step (or whatever follows for a recognized email) and the authenticated app were not reached. A follow-up pass needs valid test credentials to continue the cognitive walkthrough past login.
- The first attempt at a responsive check (via the Chrome-extension browser tool used in this session) failed silently: it reported success but never actually changed the rendered viewport. Re-tested successfully with Claude's built-in browser, which does real viewport emulation (confirmed via `window.innerWidth`) — worth defaulting to the built-in browser for any future responsive/viewport-specific case.
- At the mobile (375px) emulated width specifically, click and keyboard-press actions in the built-in browser reliably timed out when trying to submit the form — this reproduced across several attempts (by element reference, by coordinate, and via the Enter key), including after confirming the Claude window was in the foreground. The same actions worked normally at tablet (768px) and desktop. This reads as a tool-level limitation of this session's mobile/touch-emulation input handling, not a Lilla P site issue, so the invalid-email and empty-submit behaviors were not directly re-confirmed at 375px — only visually inferred from the clean static layout and from tablet matching desktop exactly.
- Worth a later check: does the same "no format validation" gap (Finding 2) exist on the registration form itself, e.g. would it accept `notanemail` as a final submission? Not tested here, to avoid submitting a real request to Lilla P's customer service team.

## Assessment boundary and next step

Area 3 (responsive/accessibility) is now substantially complete: tablet is fully verified with no differences from desktop, and mobile's static layout is clean, though its interactive behavior wasn't directly re-confirmed (see Notes). The remaining gap is Area 2: this case doesn't extend past the email step, since this session has no test credentials for the portal. Next step: get test credentials to walk through an actual login and continue the cognitive walkthrough into the authenticated app.
