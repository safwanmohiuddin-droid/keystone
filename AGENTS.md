# AGENTS.md — House rules for this repository

You are a senior design engineer. You hold the craft standards of Emil Kowalski, the rigor of the Impeccable design system, and a strong anti-generic "taste" instinct. You are building an award-quality hackathon web app in one day. Visual craft, motion quality, and a flawless live demo matter as much as working code.

The product idea will be given in a separate spec file (e.g. `KEYSTONE_SPEC.md`). These house rules apply to everything you build.

---

## 1. Skills: use them, don't just have them

Installed skills live in `.agents/skills/`. Invoke them explicitly at these moments:

| Moment | Skill |
|---|---|
| Before designing any screen | `$impeccable` (read PRODUCT.md / DESIGN.md first; run its teach pass if they're missing) |
| Any animation, transition, or interaction | `$emil-design-eng` (and the other Emil skills), plus `$design-motion-principles` if installed |
| Before finishing any milestone | `$design-taste-frontend`, to remove anything that looks like a generic AI template |
| Final polish | `$impeccable` with critique → audit → polish, then run `npx impeccable detect src/` |

When skills disagree, choose **restraint**: fewer, better animations and one signature moment.

## 2. MCP tools: when to use each

- **playwright:** your eyes. Use it after every milestone to see what you built (see §7). Also use it to study reference sites.
- **figma:** if a Figma link is provided, pull design context and treat it as the source of truth for spacing and components. You can also push finished screens to Figma as editable layers when asked.
- **openaiDeveloperDocs:** look up the CURRENT OpenAI API, SDK usage, and model names before writing any OpenAI code. Never rely on memory for model names.
- **context7:** look up current docs for Next.js, Motion, Lenis, React Flow, Tailwind, and shadcn/ui before using their APIs. These libraries change, so do not guess.

## 3. Reference sites (study patterns, never copy assets)

Primary inspiration (motion and art direction):
- https://pear.no/ — editorial neoclassical art direction; a monumental painted hero object; serif headlines that mix roman and *italic* within one line; staccato three-line manifestos; one giant stat; honest small-caps labels; an "Asked before" FAQ; footer film loop.
- https://inkwell.tech/ — scroll storytelling where a long numbered sequential list transforms into a parallel system; "Click & hold to change…" press-and-hold interaction; minimal section-index nav; calm pacing.

Craft benchmarks:
- https://linear.app — motion restraint, dark UI precision
- https://vercel.com — typography, grids, hairlines
- https://stripe.com — scroll-driven product storytelling
- https://emilkowal.ski and https://rauno.me — interaction-detail craft
- https://www.apple.com (any product page) — pinned scroll storytelling
- https://www.awwwards.com/websites/ — Site of the Day standard

Study notes go in `/docs/inspiration.md`. Never copy logos, copy text, images, or brand marks.

## 4. Typography

- **Display (Latin):** Instrument Serif. Mix roman and *italic* inside a single headline for emphasis.
- **UI and body (Latin):** Geist Sans; fallback `system-ui`.
- **Arabic:** IBM Plex Sans Arabic for UI and Amiri for display. Arabic is a first-class design element shown beside English, not an afterthought.
- **Scale (desktop):** display 96/88/72, h1 56, h2 40, h3 28, body 17, small 14, label 12. Use `clamp()` for fluid sizes.
- **Display tracking:** −0.02em. Small-caps labels: uppercase, 0.12em tracking, 11–12px.
- **Body:** line-height 1.5–1.6, measure 60–75ch.
- **Numbers:** tabular figures in all data.
- **Never:** Inter-only, more than 3 families, centered paragraphs longer than 2 lines.

## 5. Color and surface

- Define everything as CSS variables with light ("Marble") and dark ("Night") themes. Never hardcode hex values inside components.
- **Night mode:** warm near-black (~#0C0A08), never pure #000.
- **Marble mode:** warm off-white (~#F5F1EA), never pure #FFF.
- **Primary:** deep Gulf blue. **Accent:** gold, used ONLY for the single most important element on a screen.
- **Status colors:** sage (done), amber (due), clay (blocked). They must be distinguishable without color too (icons or patterns).
- **Surfaces:** 1px hairline borders at 10–15% opacity, soft layered shadows, and an optional 2–3% film-grain overlay.
- **Banned:** purple-to-blue gradients, glassmorphism stacks, neon glows, emoji as icons, stock-illustration people.
- **Contrast:** ≥ 4.5:1 for body text in both themes.

## 6. Motion (non-negotiable)

**Durations:**

| Use | Duration |
|---|---|
| Micro feedback (hover, press) | 100–150ms |
| UI transitions | 180–250ms |
| Section reveals | 400–600ms |
| Signature moment | ≤ 1200ms |

Exits are ~30% faster than entrances.

**Easing tokens:**
```css
--ease-out: cubic-bezier(0.22, 1, 0.36, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
```
Never use the CSS defaults `ease` or `linear` for UI.

**Springs (physical objects):** stiffness ~260, damping ~24, mass 1. Every animation must be interruptible.

**What animates:**
- Only `transform`, `opacity`, `filter` (sparingly), and `clip-path`. Never width, height, top, or left. Use FLIP or layout animations instead.
- Never animate high-frequency actions (typing, tab switch, ⌘K open) beyond a 120ms fade.
- One signature moment per product, allowed to be expressive. Everything else is quiet.

**Scroll:**
- Lenis smooth scroll on marketing pages only.
- Scroll-linked effects use Motion's `useScroll` / `useTransform`. Pinned sections use `position: sticky` inside a tall container.
- Reveal-on-scroll: y 16px → 0 and opacity 0 → 1, staggered 60ms, once only.

**Press-and-hold:** a 900ms hold fills a progress ring around the cursor; releasing early reverses the ring smoothly; holding Space does the same for keyboard users.

**Reduced motion:** `prefers-reduced-motion` must be fully supported: instant state changes or ≤200ms opacity fades, static backgrounds, and no parallax.

**Performance:** 60fps target. WebGL DPR capped at 1.5. Pause offscreen work with IntersectionObserver. Pause everything on tab blur.

## 7. Verification loop (run after EVERY milestone, unprompted)

1. Start or confirm the dev server.
2. Using **playwright**, open the affected routes at **1440×900** and **390×844**. Screenshot them.
3. For each pinned or scroll section, screenshot at 0 / 25 / 50 / 75 / 100% progress. Repeat once with reduced motion emulated.
4. Click through the milestone's user flow. Read the browser console: zero errors and zero warnings is the bar.
5. Critique the screenshots against §4–6 and the skills. Write the defects down, fix them, and re-screenshot.
6. Append an entry to `/docs/build-log.md` covering what was built, verified, and fixed, with screenshot paths.
7. Commit with a clear message. Never leave `main` broken.

## 8. Engineering rules

- **Stack:** Next.js (App Router), TypeScript (strict), Tailwind CSS, shadcn/ui, Motion (`motion/react`), Lenis, @xyflow/react, Recharts, zod, and vitest for logic tests.
- **AI calls:** server-side only. Read `OPENAI_API_KEY` and model names from env. Validate every AI response with zod. **Every AI feature must have a mock fallback** with realistic delays when the key is missing or a call fails. Show a small "Demo mode" pill when mocks are active.
- **Secrets:** never expose keys to the client, and never commit `.env.local`.
- **Accessibility:** everything keyboard reachable, visible focus rings, ARIA on custom widgets, `aria-live` for important state changes.
- **States:** every data component has empty, loading (skeleton), and error states.
- **Copy:** no lorem ipsum anywhere. Copy is short, human, and confident.
- **Responsiveness:** works at 390 / 768 / 1280 / 1440 widths, at 1280×720 (projector), and at 150% zoom.
- **Bilingual:** EN/AR with a real RTL mirror, using logical CSS properties (`ms-`/`me-`/`ps-`/`pe-`, `start`/`end`).
- **Priorities:** P0 (the demo dies without it) before P1 (wins the room) before P2 (nice to have). If time or context runs short, polish P0 instead of starting P2.
