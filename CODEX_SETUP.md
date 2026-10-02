# Codex Prep Kit — tools first, idea last

Do Steps 1–3 **tonight**. Run Prompts A–D tonight if you have time, or first thing tomorrow. Only then hand Codex the idea with Prompt E.

```
Step 1  Terminal setup        → Codex, project, skills, MCP servers, config
Step 2  Drop in files         → AGENTS.md (house rules) + KEYSTONE_SPEC.md (the idea, unused until Prompt E)
Step 3  Prompt A              → Tool check
        Prompt B              → Study the reference websites
        Prompt C              → Design foundation (tokens, type, theme, RTL)
        Prompt D              → Motion Lab (pre-build and verify every animation primitive)
        Prompt E              → THE IDEA (one shot)
```

Why this order: by the time Codex reads the idea, it already has working, tested animation building blocks and a finished design system. The one-shot build then just assembles them, which is far more reliable than inventing everything at once.

---

## STEP 1 — Terminal setup

### 1.1 Install Codex and create the project
```bash
npm install -g @openai/codex
codex --version                     # confirm it's installed, then sign in when prompted

npx create-next-app@latest keystone --typescript --tailwind --app --src-dir --eslint
cd keystone
git init && git add . && git commit -m "scaffold"
```

### 1.2 Install the skills (project-level, into `.agents/skills/`)
Codex scans `.agents/skills/` in the repo, and your personal skills folder is `~/.agents/skills/`.
```bash
# Emil Kowalski: design engineering, animation decisions, polish
npx skills add emilkowalski/skill -a codex

# Impeccable: design language + critique / audit / polish commands
npx skills add pbakaus/impeccable --skill impeccable -a codex
#   alternative that compiles specifically for your harness:  npx impeccable install

# Taste: anti-generic frontend taste
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend" -a codex

# Recommended extra: motion principles from Emil Kowalski, Jakub Krehel, Jhey Tompkins
npx skills add kylezantos/design-motion-principles -a codex

ls .agents/skills                   # you should see all of them
```
If `-a codex` errors, drop it. The CLI auto-detects installed agents.

### 1.3 Add the MCP servers
```bash
# Playwright: Codex's eyes (screenshots, clicking, console logs)
codex mcp add playwright -- npx @playwright/mcp@latest
npx playwright install chromium

# Figma (remote): opens a Figma sign-in in your browser
codex mcp add figma --url https://mcp.figma.com/mcp

# OpenAI developer docs: current API usage and model names
codex mcp add openaiDeveloperDocs --url https://developers.openai.com/mcp

# Context7: up-to-date docs for Next.js, Motion, React Flow, etc.
codex mcp add context7 -- npx -y @upstash/context7-mcp

codex mcp list                      # all four should be listed
```
If Figma's remote server gives auth trouble, re-run the `codex mcp add figma ...` command. As a last resort, use the Figma desktop app's local server: `codex mcp add figma-desktop --url http://127.0.0.1:3845/mcp`.

### 1.4 Codex config (`~/.codex/config.toml`)
Add these alongside the MCP entries the commands above created:
```toml
model_reasoning_effort = "high"
approval_policy = "on-request"
sandbox_mode = "workspace-write"

[sandbox_workspace_write]
network_access = true          # needed for npm installs and fetching fonts

[mcp_servers.playwright]
command = "npx"
args = ["@playwright/mcp@latest"]
startup_timeout_sec = 60       # npx can be slow on first launch
```
Restart Codex after editing. If a key is rejected by your Codex version, run `codex --help` or check the config reference and remove that line.

### 1.5 Environment file (`.env.local`)
```
OPENAI_API_KEY=sk-REPLACE_ME
OPENAI_MODEL=REPLACE_WITH_CURRENT_MODEL
OPENAI_IMAGE_MODEL=REPLACE_WITH_CURRENT_IMAGE_MODEL
OPENAI_REALTIME_MODEL=REPLACE_WITH_CURRENT_REALTIME_MODEL
NEXT_PUBLIC_DEMO_MODE=true
```
Add `.env.local` to `.gitignore` (create-next-app already does this; confirm it).

---

## STEP 2 — Drop in the files
Put these in the project root:
- `AGENTS.md`: the house rules (design, motion, typography, verification loop). Codex reads it automatically on every task.
- `KEYSTONE_SPEC.md`: the idea. **Don't mention it until Prompt E.**

Commit: `git add . && git commit -m "agents rules + skills + spec"`

Launch Codex in the project folder: `codex`

---

## STEP 3 — Priming prompts (paste one at a time, in order)

### Prompt A — Tool check
```
Before any work, verify your toolbox and report back in a short table:
1. List every skill in .agents/skills with one line on when you'll use it.
2. List every MCP server you can reach and its main tools.
3. Use the playwright MCP to open https://example.com, take a screenshot, and report the page title and any console messages.
4. Use openaiDeveloperDocs to find the current recommended OpenAI model for (a) text + vision with structured outputs, (b) image generation, (c) realtime voice. Write them to .env.example as comments. Do not hard-code them anywhere else.
5. Use context7 to confirm the current import paths and core APIs for: motion (motion/react), lenis, @xyflow/react, shadcn/ui. Write a one-page cheat sheet to /docs/lib-cheatsheet.md.
6. Confirm you've read AGENTS.md and summarize its 5 most important rules in one line each.
Do not write app code yet.
```

### Prompt B — Study the reference websites
```
Study our reference websites using the playwright MCP. For EACH site listed in AGENTS.md §3 (start with pear.no and inkwell.tech, which are the most important):
1. Screenshot the first viewport at 1440x900 and at 390x844.
2. Scroll in 10% increments, screenshotting each step, so you capture how scroll animations progress. Save to /docs/refs/<site>/.
3. Hover and press the main interactive elements, and note what animates (property, approximate duration, easing feel, stagger).
4. Note the fonts (inspect computed styles), the color palette (sample 5–7 colors), the grid and margins, and the type scale.

Then write:
- /docs/inspiration.md: per site, 5 bullets each for typography, color, layout rhythm, motion patterns, and signature interaction.
- /docs/motion-catalog.md: a deduplicated catalog of every motion pattern you observed. For each: name, where it was seen, what it communicates, an implementation approach with our stack (Motion / CSS / WebGL), suggested duration and easing, and a reduced-motion fallback. Rank them by "wow per effort".

Borrow patterns only, never assets, copy, or logos. Do not write app code yet.
```

### Prompt C — Design foundation
```
Invoke $impeccable and $design-taste-frontend. Using AGENTS.md §4–6 and /docs/inspiration.md, build the design foundation. No product screens yet.

1. Install the stack listed in AGENTS.md §8 (shadcn/ui init, motion, lenis, @xyflow/react, recharts, zod, vitest). Use context7 to confirm current install steps.
2. Fonts via next/font: Instrument Serif (display), Geist Sans (UI), IBM Plex Sans Arabic + Amiri (Arabic). Include proper fallbacks.
3. Write the design tokens as CSS variables in two themes, "Night" and "Marble":
   - colors: warm near-black, marble, sand scale, Gulf blue, gold, ink, sage / amber / clay
   - type scale with clamp()
   - an 8px spacing scale
   - radii, hairline borders, layered shadows
   - motion tokens: durations, easing curves, spring presets
   Map them into Tailwind.
4. Add a theme toggle, an EN/AR toggle with real RTL (logical properties), and a Lenis smooth-scroll provider (disabled under reduced motion).
5. Add a subtle film-grain overlay component (static under reduced motion).
6. Write DESIGN.md documenting every token, with do/don't examples.
7. Build /styleguide: show every token, the full type scale (EN + AR side by side, including a mixed roman/italic headline), buttons (all states), inputs, chips, cards, focus rings, and status colors in both themes.

Run the AGENTS.md §7 verification loop on /styleguide in both themes and both directions (LTR/RTL). Then commit.
```

### Prompt D — Motion Lab (pre-build every animation primitive)
```
Invoke $emil-design-eng and $design-motion-principles. Build a /lab route: a gallery of reusable, production-quality motion primitives, each in its own demo panel with replay buttons and a reduced-motion toggle. Put the components in /src/components/motion/. Use /docs/motion-catalog.md, prioritizing the highest "wow per effort" patterns.

Build these primitives:
1.  <Reveal> and <RevealGroup>: scroll-in fade-up with stagger, once only.
2.  <SplitHeadline>: headline words rise in with a stagger; supports mixed roman/italic segments and Arabic (no letter-splitting for Arabic, because it breaks letter joining).
3.  <PinnedSection progress>: a sticky container that exposes 0–1 scroll progress to its children, with a debug overlay toggle.
4.  <DrawPath>: an SVG path that draws with scroll progress (stroke-dashoffset).
5.  <ListToLanes>: a FLIP/layout demo where a numbered vertical list of ~20 items morphs into 5 parallel lanes based on progress, with connecting lines drawing between items (Inkwell-inspired).
6.  <HoldToChange>: a 900ms press-and-hold with a ring filling around the cursor; early release reverses; keyboard Space support; onComplete callback.
7.  <SpringDrop>: an object drops into a slot with anticipation (lift 6px), a spring settle, a 2px impact shake, a radial light bloom, and a small particle puff (canvas). Must be interruptible.
8.  <LightTravel>: a highlight that travels sequentially across a set of elements or graph edges (40ms stagger).
9.  <DuneShader>: a WebGL fragment shader of slow-flowing dune ridges (fbm noise) in warm night tones, with a cerulean top gradient and a faint gold rim on the crests. Cursor parallax, scroll-reactive, DPR capped at 1.5, pauses offscreen and on blur, static fallback.
10. <ScrollProgressBar> and <SectionIndex>: a thin top progress line, plus a left-edge section nav where the active item turns italic serif with a gold tick.
11. <SmoothAccordion>: height animation via layout or grid-rows, ~220ms.
12. <CountUp>: animated number on enter, tabular figures.
13. <DeviceFrame>: laptop and phone frames that can scale live components inside them.
14. <AnimatedCursor> + <Autoplay>: a scripted fake cursor that moves along curves, shows click ripples, and drives a deterministic timeline of steps with play / pause / scrub / reset and subtitles. This will power an in-page product demo.
15. <Coachmarks>: a spotlight-cutout guided tour with arrow-key navigation.
16. <PageTransition>: a View Transitions API "zoom through" transition between routes, with a Motion fallback.

For each one: make it interruptible, transform/opacity only, with a full reduced-motion path. Test at 60fps (use Playwright to record a short performance trace on /lab and report any long frames).

Then run the full AGENTS.md §7 verification loop on /lab. Do an Emil-style review with a before/after table for every primitive: should it animate at all, its duration, easing, and interruptibility. Fix what the review finds. Commit.
```

### Prompt E — THE IDEA (one shot)
```
Now the product. Read KEYSTONE_SPEC.md completely. Map every visual and motion requirement in the spec onto the primitives already built in /src/components/motion/ and the tokens in DESIGN.md. Reuse them; don't rebuild them. Note any gaps in /docs/build-log.md before starting.

Run $impeccable's teach/init pass using the spec's product context, so PRODUCT.md exists.

Then build milestones M1 through M8 from spec §12, in order, without waiting for my approval between milestones. After each milestone, run the AGENTS.md §7 verification loop with the playwright MCP and commit. Finish every P0 to a polished, verified state before starting P1; if you run low on time or context, stop adding scope and polish what exists.

Final pass:
- $impeccable critique → audit → polish, then `npx impeccable detect src/`.
- An Emil review table for every animation.
- A $design-taste-frontend sweep for anything generic.
- Run the in-page demo autoplay 3 times back to back with zero console errors.
- Write /docs/DEMO_SCRIPT.md (a 3-minute click path with timestamps) and a list of anything unfinished.
```

---

## Useful follow-up prompts during the day

**"It looks generic."**
```
Run $design-taste-frontend on <route>. Screenshot with playwright, list the 10 most template-looking things, and replace each with an intentional choice from DESIGN.md and /docs/inspiration.md. Show before/after screenshots.
```

**"The animation feels off."**
```
Invoke $emil-design-eng. Review the <component> animation: record it with playwright at 0/25/50/75/100%, check the duration, easing, interruptibility, and whether it should exist at all. Propose the fix as a before/after table, then apply it.
```

**"Match this reference."**
```
Open <URL> with playwright, scroll-capture the <section>, describe its motion in detail, then adapt that pattern (not the assets) for <our section>, using our tokens and primitives.
```

**"Demo-day hardening."**
```
Remove the API key, restart, and run the full demo path with playwright at 1280x720 and at 150% zoom. Fix every issue. Confirm the Shift+D reset works. Commit as "demo-ready".
```

**"Pitch assets."**
```
Use the figma MCP to send the hero, the dashboard, and the demo screens into my Figma file as editable layers for the pitch deck.
```
