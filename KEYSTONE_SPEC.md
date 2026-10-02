# KEYSTONE — Final Build Spec (one-shot)

> **How to use:** put this file in the project root as `KEYSTONE_SPEC.md`. In Cursor or Codex, send the kickoff message at the very bottom of this file. The agent builds everything end to end without stopping, verifying itself with Playwright as it goes.
> Setup (skills + MCP) is in `keystone-build-prompt.md`, Part 1. Do that tonight.

---

## 0. Inspiration (agent: STUDY THESE FIRST)

Before designing, use the **Playwright MCP** to visit each URL below. For each one:
1. Screenshot the first viewport at 1440×900.
2. Scroll in 10% increments and screenshot each step, so you capture how the scroll animations progress.
3. Write 5 bullet notes in `/docs/inspiration.md`: typography, color, layout rhythm, motion patterns, and signature interaction.

**Rule:** borrow PATTERNS and FEELING, never assets, copy, logos, or brand marks.

| Site | What to take from it |
|---|---|
| https://pear.no/ | Editorial, neoclassical art direction: a monumental painted object as the hero; warm near-black background; serif headlines that mix italic and roman inside one sentence; staccato three-line manifestos; one giant stat; honest small-caps labels ("Full disclosure"); an "Asked before" FAQ; looping film in the footer. |
| https://inkwell.tech/ | Scroll storytelling where a long numbered sequential process (a countdown list) visibly transforms into a parallel system; "Click & hold to change…" press-and-hold interaction; minimal section index nav (Intro / Vision / …); quiet, confident pacing. |
| _ADD URL_ | _add notes later_ |
| _ADD URL_ | _add notes later_ |

---

## 1. The idea (do not change the core)

**Keystone: the unlock order for a new life in Abu Dhabi.**

- **Problem:** Newcomers don't fail because they don't know WHAT to do. They fail because steps depend on each other, across federal, emirate, private, and personal actors, in an order that's different for every person:
  - **Federal:** residence visa and Emirates ID via ICP.
  - **Emirate:** TAMM, Tawtheeq, utilities.
  - **Private:** banks, schools, insurers.
  - **Personal:** landlord, employer HR.

  A wrong order costs weeks and thousands of dirhams.
- **Solution:** Keystone reads your documents, builds your personal dependency graph, and shows the ONE step today that unlocks the most other steps. It reroutes when something goes wrong.
- **Positioning:** Keystone is the **on-ramp to TAMM**, not a rival. TAMM organizes services; Keystone sequences your whole first 90 days across every actor, starting before you even have an Emirates ID, and deep-links into TAMM whenever a step lives there. Pitch line: *"Built to become a TAMM Space for your first 90 days."*
- **Who pays (impact slide):** employers' HR and relocation teams, because faster settling means faster productive hires. Government gets anonymized "where people get stuck" insights for free.
- **Guardrail:** the AI never invents rules. A curated rules engine decides the order. The AI only reads documents, picks applicable steps, explains them, and drafts messages. Every rule shows a "Demo data · verify on TAMM" note.

### The metaphor that runs through everything
In an arch, the **keystone** is the top center stone. Until it's placed, the arch can't stand. When it drops in, the whole structure locks. In Keystone:
- Every step is a **stone** (voussoir).
- Your progress is an **arch** being built.
- Today's highest-leverage step is the **gold keystone**.
- When all stones are set, the arch stands, and you are settled.

The arch appears in the hero, the dashboard progress meter, the unlock animation, and the final "settled" moment. It is the brand.

---

## 2. Design system — "Monument"

### Art direction
Neoclassical editorial meets Emirati sandstone. Think a museum catalogue printed in Abu Dhabi: monumental, calm, warm, precise. Late-afternoon desert light. No purple gradients, no glassmorphism, no emoji icons, no generic 3-column feature cards, no centered-everything layouts.

### Color tokens (CSS variables; landing defaults to "Night", dashboard defaults to "Marble")
```
--night-950: #0C0A08   /* warm near-black: landing background */
--night-900: #15120E
--night-800: #221D17
--marble-50:  #F5F1EA  /* dashboard background */
--marble-100: #ECE5D8
--sand-300:   #D9C3A0  /* stones */
--sand-500:   #B8996B
--sand-700:   #7A6243
--gulf-500:   #2F6E9E  /* primary / unlocked */
--gulf-300:   #7FB0D4  /* cerulean sky */
--gold-400:   #D4AA4F  /* ONLY the keystone + unlock moment */
--gold-600:   #A9822F
--ink-900:    #1B1714  /* text on marble */
--ink-100:    #EDE6DA  /* text on night */
--sage-500:   #7D9A7A  /* done */
--amber-500:  #C98A2E  /* due soon */
--clay-500:   #B5553C  /* blocked */
```
Contrast must stay ≥ 4.5:1 for body text in both modes.

### Typography
- **Display (Latin):** Instrument Serif (Google Fonts). Mix roman and *italic* within one headline, the way Pear does. Example: "Everyone gets the *checklist.* Keystone gives you the *order.*"
- **UI / body (Latin):** Geist Sans (fallback: system-ui).
- **Arabic:** IBM Plex Sans Arabic for UI; Amiri for display. Arabic headlines sit beside English, never as an afterthought.
- **Small caps labels:** letter-spacing 0.12em, 11–12px, for eyebrows like "IN PLAIN TERMS" and "STEP 07 / 25".
- **Numbers:** tabular figures everywhere data appears.

### Layout
- 12-column grid, generous margins (min 24px mobile, 64px+ desktop), 8px spacing scale.
- Editorial asymmetry: headlines can span 8 columns offset left, with captions in a narrow right column.
- Hairline dividers (1px, 10–15% opacity). Subtle film-grain overlay (2–3% opacity, static on reduced motion).

### Motion principles (from the Emil + Impeccable + Taste skills)
- UI feedback: 150–250ms, strong ease-out, e.g. `cubic-bezier(0.22, 1, 0.36, 1)`. Exits faster than entrances.
- Springs for physical things (stones): stiffness ~260, damping ~24. Interruptible.
- Never animate high-frequency actions (typing, tab switches, ⌘K) beyond a 120ms fade.
- Scroll set-pieces on the landing page only. The dashboard is calm.
- ONE signature moment: **the keystone drop** (spec in §4).
- Animate transform/opacity only. 60fps target. Full `prefers-reduced-motion` support, with instant states and static art.

---

## 3. Tech stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- shadcn/ui primitives (Dialog, Sheet, Tabs, Tooltip, Command) + Sonner toasts
- Motion (`motion/react`) for UI + scroll-linked animation; Lenis for smooth scroll
- @xyflow/react for the dashboard Unlock Map
- Recharts for small charts
- Hand-written WebGL fragment shader for the dune background (no three.js)
- OpenAI official Node SDK, **server only**, with model names from env
- zod for every AI response schema
- View Transitions API (with a Motion fallback) for the landing → dashboard "through the arch" transition

`.env.local`:
```
OPENAI_API_KEY=sk-REPLACE_ME
OPENAI_MODEL=REPLACE_WITH_CURRENT_MODEL
OPENAI_IMAGE_MODEL=REPLACE_WITH_CURRENT_IMAGE_MODEL
OPENAI_REALTIME_MODEL=REPLACE_WITH_CURRENT_REALTIME_MODEL
NEXT_PUBLIC_DEMO_MODE=true
```
**Everything must work with NO key** (mock mode with realistic delays). When mock mode is active, show a tiny "Demo mode" pill.

---

## 4. Signature components (build these with the most care)

### 4.1 `<Arch/>`: the brand object
- An SVG semicircular arch of **N voussoirs** (stones) + 1 keystone. N = the number of steps in the current persona's plan, clamped to 9–15 visually by grouping steps into stones.
- **Stone look:** sandstone fill using layered gradients + an SVG `feTurbulence` grain filter. Each stone gets a slightly different hue/rotation. Use a soft inner shadow on the bottom edge and a warm rim light on the top edge.
- **Stone states:**
  - Unset: floats 40–80px below its slot, 30% opacity, slight rotation.
  - Set: sits in its slot with a soft settle bounce.
  - Keystone: gold, with a slow 4s light sweep across its face.
- **Props:** `progress`, `keystoneState: 'floating' | 'dropping' | 'set'`, `size`, `interactive`.
- **Used in:** hero (large), the dashboard progress meter (small, 120px), onboarding, and the "Settled" finale.

### 4.2 The keystone drop (signature moment, ~1100ms)
1. The gold keystone lifts 6px (anticipation, 120ms).
2. It drops into the slot (spring).
3. On impact: a 1-frame micro-shake of the whole arch (2px), and a radial gold light bloom from the slot (opacity 0 → 0.6 → 0 over 500ms).
4. Dust: 12–18 tiny sand particles puff outward and fall (canvas or SVG, 600ms).
5. Light travels down both sides of the arch, stone by stone (40ms stagger), briefly warming each stone.

Reduced motion: the stone appears set and a gentle 200ms gold fade plays. Nothing else moves.

### 4.3 `<DuneShader/>`: living background
Full-bleed fragment shader of slow-flowing dune ridges (layered fbm noise), in night-sand tones with a faint cerulean sky gradient at the top and a thin gold rim light on ridge crests.
- Barely-there cursor parallax; scroll shifts the ridges.
- DPR capped at 1.5; paused offscreen and on tab blur.
- Static gradient fallback when WebGL is unavailable or reduced motion is on.
- In the dashboard, run it at 10% opacity behind marble, or disable it.

### 4.4 Press-and-hold interaction (Inkwell-inspired)
`<HoldToChange/>`: hold the mouse or touch for 900ms on a target.
- A circular progress ring fills around the cursor while holding.
- On complete: a haptic-like scale pulse, then the target content morphs.
- Releasing early reverses the ring smoothly.
- Keyboard: hold Space while the target is focused.
- Show the label "Click & hold to become someone else."

---

## 5. Landing page `/` — scroll story (8 sections)

Global elements:
- Lenis smooth scroll.
- Thin gold scroll-progress line at the top.
- Minimal left-edge **section index** (Intro / Problem / Order / You / Demo / Trust / City / Begin). The active item gets an italic serif, with a 2px gold tick.
- Top-right: EN/عربي toggle (a real RTL mirror using logical properties) and an "Open Keystone" button.

**S1 — HERO "The Arch"**
- DuneShader background (night). Centered-left headline in Instrument Serif, ~96px desktop: "Everyone gets the *checklist.* / Keystone gives you the *order.*" The Arabic line sits beneath in Amiri.
- Right side: a large `<Arch/>`. On load, the stones rise into place one by one (stagger 70ms, springs). The gold keystone hovers above the gap, gently bobbing.
- As the user starts scrolling (0 → 15% of the section), the keystone DROPS. This is the signature moment, triggered by scroll.
- CTAs: "Watch Priya's first 30 days ↓" and "Begin →".
- Optional backdrop art: `/public/art/hero-sky.webp` (prompt in §10), sitting behind the shader with a soft mask. If the file is missing, use the shader only.

**S2 — THE PROBLEM "Every step needs another step"** (pinned, ~200vh)
- A Pear-style staccato triplet, revealed line by line on scroll in big italic serif:
  "*You need an Emirates ID* to open a bank account." / "*You need a bank account* for rent cheques." / "*You need a lease* for everything else."
- Behind the text, a faint SVG loop draws itself between those nouns, forming a closed deadlock circle.
- End: one giant number in Pear style: **"5–8 weeks"**, with a small-caps label "TYPICAL TIME LOST TO WRONG ORDER · ILLUSTRATIVE".

**S3 — THE ORDER "From a line to lanes"** (Inkwell-inspired, pinned, ~300vh)
- **Start state:** a tall, narrow, numbered vertical list of all 25 steps (25 → 1 countdown numbering, small caps). It reads as one long, slow, sequential line, with a caption: "This is how most people do it. One step after another."
- **Scroll 20–70%:** the list items lift and fly into **5 parallel lanes** (Visa & ID · Money · Home · Family · Car). Dependency edges draw between them, and steps that can happen in parallel align vertically.
- **Scroll 70–100%:** the critical path glows gold, and a timeline bar under the lanes shrinks from "11 weeks" to "5 weeks" (labeled illustrative). Caption: "The bureaucracy is a sequence. *Your life doesn't have to be.*"
- Use shared `layoutId` or FLIP transforms so each step visibly travels to its lane.

**S4 — YOU "Different for everyone"** (press-and-hold persona morph)
- Large persona card on the left: name, short bio, and the facts that matter (family, car, sponsor), with a small arch showing their plan size.
- Right side: their lanes (a compact version of S3).
- `<HoldToChange/>`: hold to become Priya → Omar → Lena (cycles). On change, the bio crossfades, stones are added or removed from the arch, lanes reshuffle with layout animation, and a counter shows "+4 steps / −2 steps".
- Caption: "Same city. Same rules. *Completely different order.*"

**S5 — DEMO "Priya's first 30 days"** (the demo inside the website, MOST IMPORTANT)
- A framed, fully interactive mini version of the real dashboard, using the actual components scaled into a device frame. Laptop frame on desktop, phone frame on mobile.
- Controls above: ▶ Play / ❚❚ Pause / ↺ Reset, plus a scrubbable timeline (Day 0 → Day 30) with chapter ticks.
- **Chapters (deterministic autoplay with an animated cursor that moves and clicks):**
  - Day 0: Arrive. Priya drops her offer letter, it scans, and her arch assembles.
  - Day 1: Medical test, marked done. A stone sets.
  - Day 3: Emirates ID biometrics. The Deadline radar shows the "book by" marker.
  - Day 6: Bank account becomes the KEYSTONE. The keystone drop plays and 5 tiles unlock.
  - Day 6: Name-mismatch guard flags "Priya Ramesh Nair" vs "Priya R. Nair". A correction email is drafted in EN + AR.
  - Day 8: STUCK, "Landlord delayed the lease." The graph reroutes: the serviced-apartment extension lights up and the Today card changes.
  - Day 9: Lease + cheques. The cheque planner shows 4 cheques with reminders.
  - Day 10: Tawtheeq leads to utilities.
  - Day 14: School enrollment.
  - Day 21: Family visas.
  - Day 30: All stones set. The **"Settled" finale** plays: the arch completes, a slow gold light sweeps across it, and a caption reads "Priya is settled. 23 days faster than the usual order (illustrative)."
- Captions appear as subtitles in the frame (EN, toggle AR).
- The user can pause and take over at any moment by clicking tiles directly.
- Below the frame: "Try it yourself →" (goes to /start).

**S6 — TRUST "Asked before"** (Pear-inspired FAQ, an accordion with smooth height animation)
- "Isn't this what TAMM does?" Answer: TAMM organizes Abu Dhabi government services. Keystone sequences your first 90 days across federal, emirate, private, and personal steps, starts before you have an Emirates ID, and hands you into TAMM at the right moment. It is built to plug into TAMM.
- "Where does the order come from?" Answer: a curated rules engine reviewed against official sources. AI reads and explains; it never invents rules.
- "What happens to my documents?" Answer: processed for extraction, then deleted. The demo stores nothing.
- "What if something goes wrong?" Answer: Stuck mode reroutes your plan.
- "Who pays for this?" Answer: employers and relocation teams. Free for the newcomer.
- A small-caps label "IN PLAIN TERMS" above honest notes, in Pear's "Full disclosure" style.

**S7 — CITY "Where Abu Dhabi gets stuck"**
- A preview of City Insights: an abstract hex-grid district map (NOT real map tiles) with a heat overlay, plus a "Top 5 blockers this month" bar list. All labeled "anonymized · aggregated · demo".
- Line: "Every reroute teaches the city something."

**S8 — BEGIN** (footer)
- DuneShader loop (a "film" feel, like Pear's footer loop). A huge italic headline: "Place your *first stone.*" with a "Begin →" button.
- The triplet in small caps: "WE READ IT · WE ORDER IT · YOU WALK THROUGH IT".
- Credit: "Built in one day at the OpenAI × Abu Dhabi Hackathon." Team names are placeholders.

**Transition:** clicking "Begin" or "Open Keystone" zooms the camera THROUGH the hero arch (scale + blur + fade, about 700ms), and the marble dashboard emerges on the other side. Use the View Transitions API with a Motion fallback.

---

## 6. Onboarding `/start` (the "aha" in 60 seconds)

Three steps with a progress arch at the top:
1. **"Drop what you have."** Drag-and-drop zone for an offer letter, passport, and visa, plus a big secondary button "Use Priya's sample documents". A scan animation plays: a light bar sweeps across the document thumbnail, and extracted fields fly out into a facts card (name, nationality, sponsor, family, arrival date, employer).
2. **"Three quick questions."** Tappable chip answers only, no typing:
   - Kids starting school? (Yes / No)
   - Bringing a car or converting a licence? (Yes / No / Not sure)
   - Arrival date? (date chip)
3. **"Placing your stones…"** The arch assembles from the plan (stones appear per step group). The keystone hovers. Then a "See today's keystone →" button runs the arch transition into /app.

---

## 7. Dashboard `/app` (Marble mode by default)

**Layout:** a slim left icon rail, a top bar, and the main grid. Responsive at 390 / 768 / 1280 / 1440.

**Top bar:**
- A mini `<Arch/>` progress meter, e.g. "9 of 25 stones set".
- Grace period ring, e.g. "Day 6 of 30", which turns amber when ≤10 days are left.
- Persona switcher, ⌘K, EN/عربي, Night/Marble toggle.

**A) TODAY: the keystone card** (largest card, top-left)
- One action only, with a gold keystone icon, the title, and an "Unlocks 5 steps" chip.
- Includes: a "Bring" checklist, a "Where" chip, typical duration, an "Open in TAMM" link (placeholder) when the step lives in TAMM, and an **"I did this"** button.
- Clicking "I did this" plays the keystone drop in the mini arch AND the unlock wave across the map. The card then slides out and the next keystone slides in.

**B) UNLOCK MAP** (React Flow)
- 5 horizontal lanes with sticky lane labels (EN + AR).
- Custom stone-shaped nodes (rounded trapezoid) in these states:
  - Locked: frosted sand with a lock glyph.
  - Available: Gulf outline.
  - Doing: Gulf fill at 20%.
  - Done: sage with a check.
  - Blocked: clay with a hatched pattern.
  - Keystone: gold ring with a slow glow; only ever one.
- Hairline edges. On unlock, light pulses along the outgoing edges.
- Toolbar: "Critical path" (gold highlight), "Fit", lane filter.
- Clicking a node opens a right Sheet with: why it matters (AI explanation), depends on / unlocks, documents needed, where, typical days, "Mark done", and the "Demo data · verify on TAMM" note.
- Mobile: lanes become horizontally swipeable rows.

**C) DEADLINE RADAR**
A horizontal timeline from Day 0 to Day 90. It shows hard deadlines, back-calculated "book by" markers, and a today line. Tooltips on hover; overdue items in clay.

**D) DOCUMENTS + NAME-MISMATCH GUARD**
- Document cards with extracted fields.
- The mismatch alert shows each name variant as tokens and highlights the differing ones. Actions: "Draft correction request" and "Mark as acceptable".

**E) RENT CHEQUE PLANNER**
- A segmented control for 1 / 2 / 4 / 6 cheques. It shows the fake rent difference, cash needed upfront, and a small bar chart.
- A cheque calendar with reminder chips.
- Calm warning copy about bounced cheques, with a link out (no legal advice).

**F) SAY IT FOR ME** (Sheet)
- Templates: landlord, HR salary certificate, school admissions, bank.
- Tone: formal / friendly.
- Output in EN and AR side by side (the AR side is RTL with Arabic fonts), with copy buttons.

**G) STUCK MODE**
- A floating "Something went wrong?" pill opens a picker:
  - Bank rejected me
  - Landlord delayed lease
  - Medical test rescheduled
  - Name mismatch rejected
- Picking one animates the reroute: affected nodes turn clay, the alternate path draws in, and the keystone moves.
- A diff toast summarizes the change, e.g. "+1 step · −3 days · new keystone: Salary letter".

**H) VOICE** (behind a flag)
- A mic button. If a key is set, use the Realtime API. Otherwise, play a scripted conversation with live captions.

**Also include:**
- **Command palette (⌘K):** jump to a step, switch persona, run the demo, trigger stuck mode, toggle language, reset.
- **First-visit guided tour:** spotlight coachmarks over Today → Map → Radar → Mismatch → Stuck. Skippable, arrow-key navigable.
- **Shortcuts:** `Shift+D` resets to Priya Day 0; `Shift+P` plays the demo.
- **"Settled" state:** when all steps are done, play a full-screen arch completion and offer "Share your arch" (a downloadable image card via html-to-image).

---

## 8. City Insights `/app/city`
- Hex-grid stylized district map with heat.
- "Top 5 blockers this month" horizontal bars.
- Median days per step.
- A callout: "The dependency that delays the most newcomers: Bank account → Chequebook (demo)".
- Label everything "anonymized · aggregated · demo".

---

## 9. Data + logic

`/src/data/steps.ts`: about 25 typed steps.

```ts
type Lane = "visa" | "money" | "home" | "family" | "car";
type Step = {
  id: string;
  title: { en: string; ar: string };
  lane: Lane;
  actor: "federal" | "emirate" | "private" | "personal";
  dependsOn: string[];
  conditions?: { hasFamily?: boolean; hasKids?: boolean; hasCar?: boolean;
                 sponsor?: "employer" | "spouse"; licenceConvertible?: boolean };
  typicalDays: number;
  docsNeeded: string[];
  where: string;
  tammUrl?: string;              // placeholder links
  hardDeadline?: { daysFromArrival: number; label: string };
};
```

**Steps by lane:**
- **visa:** entry_permit, arrival, medical_test, eid_biometrics, residence_visa, eid_card
- **money:** local_sim, bank_account, salary_transfer, chequebook, credit_file
- **home:** temp_stay, apartment_search, lease_and_cheques, tawtheeq, utilities, internet
- **family:** dependent_visas, dependent_eids, family_insurance, school_enrollment
- **car:** eye_test, licence_conversion, car_purchase, car_registration

**Example dependencies:**
- bank_account ← eid_card
- chequebook ← bank_account
- lease_and_cheques ← chequebook
- tawtheeq ← lease_and_cheques
- utilities ← tawtheeq
- dependent_visas ← residence_visa + tawtheeq + salary_transfer
- school_enrollment ← dependent_eids + tawtheeq
- licence_conversion ← eye_test + eid_card
- car_registration ← licence_conversion + car_purchase

**Personas** (`/src/data/personas.ts`):
- **Priya:** Indian software engineer; spouse + 2 kids; Indian licence. Name variants: "Priya Ramesh Nair" / "Priya R. Nair" / "NAIR PRIYA RAMESH". This is the default.
- **Omar:** Egyptian, single, no car, shared flat.
- **Lena:** German, sponsored by her spouse, wants to work, converts her licence.

**Rules engine** (`/src/lib/graph.ts`): pure functions, plus unit tests (vitest).
- `planFor(persona)`
- `statuses(plan, done, blocked)`
- `pickKeystone(plan, state)`: among available steps, choose the max transitive descendants, tie-broken by the nearest hard deadline.
- `criticalPath(plan)`
- `reroute(plan, state, event)` → `{ plan, state, diff }`
- `toArchStones(plan)`: groups steps into 9–15 stones for the arch.

**AI routes** (server only; zod-validated structured outputs; mock fallback on a missing key or any error):

| Route | Input | Output |
|---|---|---|
| `POST /api/extract` | image/PDF (vision) | `{ names[], nationality, sponsor, family[], arrivalDate, employer }` |
| `POST /api/plan` | facts | `{ stepIds[], why: Record<stepId, string> }`, restricted to known step ids only |
| `POST /api/explain` | `{ stepId, persona }` | a 2-sentence, friendly explanation |
| `POST /api/draft` | `{ template, context, tone }` | `{ en, ar }` |

Mocks live in `/src/data/mocks/*`, returned with 800–1400ms delays.

---

## 10. Art assets (optional, generated at the hackathon)

These are on-theme for an OpenAI hackathon. Generate them with the OpenAI image model and save them to `/public/art/`. Every asset needs a code fallback.

- **hero-sky.webp (2400×1400):** "Neoclassical oil painting, a vast cerulean late-afternoon sky over soft Abu Dhabi desert dunes, warm golden light low on the horizon, subtle clouds, museum-quality brushwork, calm and monumental, no buildings, no text, no people, wide composition with empty space on the left for typography."
- **arch-reference.webp (optional, art direction only):** "Neoclassical oil painting of a monumental sandstone arch standing alone in the desert at golden hour, the top center keystone glowing gold, cerulean sky, museum lighting, no text." Use it as a reference for stone colors; the arch itself is built in SVG.
- **og.jpg (1200×630):** the hero arch with the keystone set, plus the wordmark "Keystone".

---

## 11. Quality bar
- Zero console errors or warnings.
- Lighthouse ≥ 85 performance and ≥ 95 accessibility on `/`.
- Everything keyboard reachable, with visible focus rings in gold, ARIA labels on graph nodes, and `aria-live` for unlock announcements ("Bank account done. 5 steps unlocked.").
- Every data component has empty, loading (shimmer in sand tones), and error states.
- Copy is human, short, and confident. No lorem ipsum anywhere.
- Arabic text is real (have it reviewed by a native speaker during the event) and RTL mirrors correctly.
- Works at 1280×720 projector resolution and 150% zoom.

---

## 12. Build order (agent: do NOT stop for approval between milestones)

Priorities: **P0** = the demo dies without it. **P1** = this wins the room. **P2** = only if time remains.

| # | Milestone | Priority |
|---|---|---|
| M1 | Tokens, fonts, RTL, layout shell, data, rules engine + tests, mock AI routes | P0 |
| M2 | `<Arch/>` + keystone drop + DuneShader + S1 Hero | P0 |
| M3 | /start onboarding + /app Today card + Unlock Map + unlock wave | P0 |
| M4 | S5 Demo with deterministic autoplay + all chapters + Settled finale | P0 |
| M5 | S3 line-to-lanes, S4 hold-to-change, S2 problem | P1 |
| M6 | Radar, Mismatch guard, Say-it-for-me, Stuck mode, ⌘K, tour | P1 |
| M7 | S6–S8, City Insights, arch transition, cheque planner | P1/P2 |
| M8 | Voice, share-your-arch image, real OpenAI calls wired | P2 |

**After EVERY milestone, run the verification loop:**
1. Start the dev server. With the Playwright MCP, open the affected pages at 1440 and 390 widths.
2. For scroll sections: screenshot at 0 / 25 / 50 / 75 / 100% of each pinned section, plus once with reduced motion emulated.
3. Click through the milestone's flow and read the console.
4. Critique the screenshots against §2 and the installed skills (Emil, Impeccable, Taste). List defects and fix them. Re-screenshot.
5. Append a short entry to `/docs/build-log.md` covering what was built, verified, and fixed, with screenshot paths.

**Final pass:**
- Run `/impeccable critique` → `/impeccable audit` → `/impeccable polish`, and run `npx impeccable detect src/`.
- Do an Emil review of every animation with a before/after table.
- Do a Taste pass to remove anything generic.
- Run the S5 autoplay 3× back to back with zero errors.
- Write `/docs/DEMO_SCRIPT.md`: a 3-minute click path with timestamps.

If a Figma file link is provided, pull its design context via the Figma MCP and treat it as the source of truth for spacing and components.

---

## KICKOFF MESSAGE (paste this into Cursor / Codex)

```
Read KEYSTONE_SPEC.md completely. Then read and apply the installed skills: Emil Kowalski's design-engineering skill, impeccable, and design-taste-frontend. Start with §0: study the inspiration sites using the Playwright MCP and write /docs/inspiration.md. Then build milestones M1 through M8 in order, running the verification loop after each one, without waiting for my approval. If you run low on time or context, finish every P0 to a polished, verified state before starting P1. Never leave the app in a broken state between milestones: commit after each verified milestone with a clear message. At the end, give me the demo script and a list of anything not finished.
```
