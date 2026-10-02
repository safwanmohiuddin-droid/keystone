# Build log

## 2 October 2026 — synthetic dataset foundation

Added 14 reproducible JSON datasets, a TypeScript import entry point, documentation, a seed generator and a consistency checker. Includes three personas, three fictional employers, 30 task definitions, a 12-chapter replay, 12 housing quotes and 240 fictional city cases. All rules, costs and durations are demo assumptions, not production advice or measured outcomes.

Verified: `npm run data:check`, identical file hashes after regeneration, TypeScript and ESLint. Checks cover persona eligibility, acyclic graphs, valid replay actions, cheque totals and independently recomputed city aggregates. No screens changed; browser screenshots do not apply to this data milestone. The landing/dashboard prototype remains to be built.

## 2 October 2026 — local visual prototype

Built the Monument landing page with an original sandstone arch, a three-step sample onboarding, a bilingual workspace and a fictional city view. Workspace actions include dependency-aware completion, blocked-step rerouting and resume, upfront-rent comparisons, sample name review, draft copying, theme/language changes and a 12-chapter replay. Loading, error and not-found routes are included. This is a visual prototype, not the full production specification.

Verified in the Codex browser with its Playwright locator surface: landing → onboarding → workspace, step completion changing the recommendation, pausing a step choosing a parallel ready action, rent cash changing to AED 33,883 for Priya's fictional six-cheque quote, name review, EN/AR RTL mirror, night theme, persona-specific lanes, district selection and final replay state reaching 100%. Checked all four routes at 768, 1280×720 and 1440×900, plus 390×844 mobile screens. No horizontal overflow. Browser console had no new errors or warnings after fixes.

Fixed a hydration warning by rounding original SVG coordinates consistently between server and browser; added Next's smooth-scroll marker; ensured other personas do not default to Priya's HR draft; removed nested state updates from the replay timer; added an accessible dialog title. The arch entrance uses a restrained spring and a reduced-motion branch. CSS disables motion under the OS preference. Actual reduced-motion emulation, 150% browser zoom, physical-device touch testing and reference-site screenshot studies remain unverified. There are no pinned-scroll sections in this preview.

Checks: production build, ESLint, five Vitest dependency/eligibility/completion tests and all 14 dataset consistency checks pass. `npx --yes impeccable detect src/` exited 0 without console output; this is not a claim of a completed independent design critique. Visual inspection and a technical audit informed the fixes. The formal dual-agent critique workflow was not invoked.

Screenshots: `docs/screenshots/landing-desktop.jpg`, `landing-mobile.jpg`, `start-desktop.jpg`, `start-mobile.jpg`, `dashboard-desktop.jpg`, `dashboard-mobile.jpg`, `dashboard-arabic.jpg`, `dashboard-night.jpg`, `city-desktop.jpg`, `city-mobile.jpg`. Screenshots are browser evidence, not official provider data.

Limits at that point: all data and procedural rules are fictional; no uploads, live AI, government integration, or persistent progress.

## 2 October 2026 — scroll story, still frontend only

Replaced the generic landing with a night scroll story: dune field, a keystone that drops on scroll, a three-line deadlock, a sequence that becomes five lanes, press-and-hold persona change, and a sample step you can mark done. The workspace headline is now the next action, with “I did this” and a plain-language stall picker. No API. People, costs, and timings stay fictional.

Verified in the browser at 1440-wide: hero, keystone drop, problem lines, and the first pass of the order section. The flying labels overlapped, so the order section was changed to a scroll crossfade into lanes. That later pass was typechecked; the browser connection dropped before it was screenshotted again.

