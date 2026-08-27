# Handyman Price Guide Project Status

_Last updated: 2026-08-26, local inspection from Hermes Coordinator._

## Current project / task state

- Project: Handyman Price Guide.
- Path: `D:\Factory\handyman-price-guide`.
- Purpose: local Toronto/Ontario handyman pricing advisor for Louie.
- Stack: Next.js 16, React 19, TypeScript, Tailwind 4.
- Deployment: local-only MVP. Do not deploy unless Louie explicitly approves.
- Data model: local TypeScript catalogue and pure pricing engine, no database.
- Current branch: `master`.
- Git state at inspection: one initial commit, then local uncommitted MVP work.

## Completed work

- Replaced the default Create Next App page with a usable local pricing advisor.
- Added project rules in `.hermes.md`.
- Added Toronto/Ontario research docs under `docs/`.
- Added a service catalogue in `src/lib/service-catalog.ts`.
- Added pricing logic in `src/lib/pricing-engine.ts`.
- Added automated pricing-engine tests under `tests/pricing-engine.test.ts`.
- Added a `test` script using `tsx --test`.
- Fixed multi-job quote safety so a cart containing only referral-only jobs returns no normal quote total.
- Fixed same-fixture add-on pricing so toilet and sink add-ons selected from the shared add-on panel are included in quote math, not just displayed in the UI.
- Added UI in `src/app/page.tsx` for:
  - job search and category filtering,
  - trade status filtering,
  - acceptable-job toggle,
  - pricing modes for informal, solo freelancer, and company comparison,
  - quantity pricing,
  - material cost, markup, and pickup fee inputs,
  - shared travel, parking, and access costs,
  - same-fixture add-ons,
  - multi-job quote cart,
  - optional HST/tax,
  - print/save-PDF invoice view,
  - client-ready message.
- Added global print styling for invoice output.
- Updated README from default scaffold to project-specific instructions.

## Verification snapshot

Commands run from `D:/factory/handyman-price-guide`:

```bash
npm test
npm run lint
npm run build
```

Results on inspection:

- `npm test` passed: 6 pricing-engine tests, 0 failures.
- `npm run lint` passed.
- `npm run build` passed.
- Local page was opened at `http://localhost:3000/` and rendered the Handyman Price Guide UI.
- Existing Next dev server was already running on port 3000. A new attempted dev server on port 3001 exited because another Next dev server was already running for this project.

## Important decisions and constraints

- Keep this local-first. No database, auth, or deployment until Louie approves.
- Use Toronto/Ontario pricing data first.
- Treat research prices as planning guidance, not guaranteed quotes.
- Keep pricing transparent: labour, minimum visit, quantity, materials, markup, pickup, travel, parking, access, urgency, and tax should stay visible.
- Use clear trade status values: `handyman_ok`, `caution`, `licensed_required`, `do_not_accept`.
- Paid Ontario electrical work touching wiring, fixtures, switches, outlets, panels, breakers, hardwired devices, or circuits should normally be referral/licensed-required.
- Gas/fuel appliance work should be TSSA-certified referral/do-not-accept unless Louie has the required certification.
- For `licensed_required` and `do_not_accept`, the app should not generate a normal accept-this-work quote.
- Use local TypeScript data and pure pricing functions. Do not move job-by-job pricing logic back into `page.tsx`.

## Outstanding work

1. Review the full catalogue for pricing accuracy, duplicate jobs, and trade-boundary labels.
2. Expand tests beyond the first pricing-engine safety set, especially UI behavior and more catalogue edge cases.
3. Split `src/app/page.tsx` into smaller components if it becomes difficult to maintain.
4. Improve invoice/client-message polish after Louie tests real quote scenarios.
5. Decide whether to commit the local MVP files together, after reviewing untracked docs and generated state.
6. Optionally add a project status update habit whenever a phase is completed.

## Next logical action

Review the full job catalogue and test a few real Louie quote scenarios in the UI, then either polish the invoice/client message or split `page.tsx` into components before committing.
