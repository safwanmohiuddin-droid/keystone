# Keystone

An interactive Abu Dhabi relocation prototype based on KEYSTONE_SPEC.md.

## Run locally

Node.js 20+ is required. Dependencies are installed.

```sh
npm run dev
```

Open http://localhost:8069. Routes: `/` (the idea), `/start` (sample onboarding), `/app` (workspace), `/app/city` (synthetic cohort). Choose Priya, Omar or Lena during onboarding.

## Explore

Complete a ready stone, pause a step and resume it from the map. Compare 1/2/4/6 rent-cheque scenarios, review Priya's sample name discrepancy, copy an English or Arabic draft, switch workspace language/theme and replay Priya's 30-day illustrative journey.

All profiles, document comparisons, dates, costs, dependency rules and city cases are fictional. The prototype does not upload personal files, contact providers or run live AI. Progress is held in memory and resets when the page reloads. This is a visual product exploration, not the full production specification.

## Verify

```sh
npm run lint
npm run test
npm run data:check
npm run build
```

Regenerate fixtures with `npm run data:generate`. See `src/data/README.md` for schema, seed and limits. Browser evidence is in `docs/screenshots`; the build log records checks and known gaps.

Original AGENTS.md, KEYSTONE_SPEC.md and CODEX_SETUP.md remain in the root. Next dev automatically appends agent guidance to AGENTS.md. No remote repository is configured. Keep `.env.local` private; the key is currently a placeholder.
