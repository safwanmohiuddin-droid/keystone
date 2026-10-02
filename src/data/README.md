# Synthetic prototype datasets

All records are fictional, generated with seed 71026. No real people, employers, passport numbers, resident IDs or government records are included. District names are real labels; amounts, durations and counts are fictional. Arabic text is draft demo copy requiring native-speaker review.

Import fixtures from `@/data`, or read JSON files in `synthetic/` independently. Every file includes synthetic metadata. Keep the demo label visible in the product, especially in City Insights. These are generated fictional cases, not anonymised real residents.

Run `npm run data:generate` to reproduce all files. Run `npm run data:check` to validate graphs, persona eligibility, the chronological demo, exact payments and derived analytics.

The 14 datasets include three personas, 30 step definitions (25 core spec steps plus driving branches and recovery tasks), three resolved plans, document facts, mock extractions, name review, 12 cumulative demo chapters, booking/payroll deadlines, 12 rent quotes, four blockers, four bilingual message templates, three companies, 240 city cases and recomputed city summaries.

Use each plan's `dependencies` for graphs. The unresolved catalogue includes alternatives. Recovery tasks are optional until needed. Suggested timeline actions are authored demo chapters, not computed highest-leverage recommendations. No legal deadlines or claimed time savings are fabricated.

Driving-conversion and training paths are scenario assumptions, not proof of national eligibility. The spouse-sponsored plan is simplified and requires real eligibility review before production. The rental example assumes a landlord accepting cheques; fees are quote components, not mandated rates. Utilities represent confirmation of an account handoff after tenancy registration, not a duplicate application.

Documents contain extracted facts only, with explicit SYNTHETIC identifiers and no official-looking images. Name differences prompt human review, not automatic rejection. The fixed arrival baseline is 5 October 2026.
