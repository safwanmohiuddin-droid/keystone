# Build log

## 2 October 2026 — synthetic dataset foundation

Added 14 reproducible JSON datasets, a TypeScript import entry point, documentation, a seed generator and a consistency checker. Includes three personas, three fictional employers, 30 task definitions, a 12-chapter replay, 12 housing quotes and 240 fictional city cases. All rules, costs and durations are demo assumptions, not production advice or measured outcomes.

Verified: `npm run data:check`, identical file hashes after regeneration, TypeScript and ESLint. Checks cover persona eligibility, acyclic graphs, valid replay actions, cheque totals and independently recomputed city aggregates. No screens changed; browser screenshots do not apply to this data milestone. The landing/dashboard prototype remains to be built.
