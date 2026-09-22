# Handyman Price Guide — Project Status

_Last updated: 2026-08-30_

## Snapshot

| Item | Value |
| --- | --- |
| Project | Handyman Price Guide |
| Path | `D:\Factory\handyman-price-guide` |
| Remote | `https://github.com/webllrzjohnson/handyman.git` |
| Branch | `master` |
| Stack | Next.js 16, React 19, TypeScript, Tailwind 4, SQLite + Drizzle ORM |
| Deployment | Local-only unless Louie explicitly approves |
| Dev URL | `http://localhost:3000` |

## What it does now

Local Toronto/GTA handyman quoting tool for solo/freelance work. Louie can:

- Browse jobs by room → area → job (Step 1–3 flow)
- Build multi-job quotes with shared visit expenses
- Use same-fixture add-ons (toilet, sink, door, screen door)
- See included/not-included scope in Step 3
- Add quick quote templates (kitchen sink refresh, bathroom refresh, door tune-up, rental turnover)
- Save/load quotes, manage clients, track job completions
- Print invoice preview and copy a client-ready message

## Completed since last status (2026-08-26)

### Data & persistence
- SQLite database with clients, quotes, quote items, job completions
- API routes with validation, transactions, and upsert-style quote item updates
- Foreign keys enabled; quote items preserve `materialId` and `location`
- Shared API helpers/types (`api-helpers.ts`, `api-types.ts`)

### Catalog & UX
- Room-based navigation (Kitchen, Bathroom, Bedroom, Closet, etc.)
- 67+ service jobs with trade-status boundaries
- Referral-only jobs isolated to licensed-trade area (not in default room lists)
- Duplicate same-fixture add-on fixes
- Closet jobs added; Step 3 dropdown and add-on panel fixes
- Step 3 scope checklist (included / not included)
- Quick quote templates

### Cleanup (audit pass)
- Removed Step 3 job images (low value, unreliable URLs)
- Removed charging-strategy panel, unused state, dead imports
- Removed custom `migrate.ts` in favor of `drizzle-kit`
- Tightened types (no `any` in API client / main page)

### Verification (2026-08-30)
- `npm test` — 21 tests, 0 failures (pricing engine, catalog navigation, API helpers, quote templates)
- `npm run lint` — pass
- `npm run build` — pass

## Uncommitted work (needs commit)

Local changes not yet committed on `master`:

- API validation/transaction improvements
- Quote templates + scope checklist
- Image catalog removal and UI cleanup
- New tests: `api-helpers.test.ts`, `quote-templates.test.ts`
- Deleted: `scripts/add-job-images.js`, `SaveLoadQuote.tsx`, `migrate.ts`

**Recommendation:** Commit as one checkpoint before starting unrelated work.

## Paused / deferred

These were discussed but are **not** in scope right now:

- SMS/email quote sending
- Mobile-optimized layout
- Step 3 job images (removed by design)
- Further invoice/PDF polish until real quote scenarios are tested
- Splitting `page.tsx` into smaller components (do when next UI phase starts)

## Known gaps & risks

1. **Pricing accuracy** — catalogue is research-based; Toronto/GTA rates may need periodic updates.
2. **Large main page** — `src/app/page.tsx` still holds most UI logic.
3. **Real-world testing** — save/load, completions, and invoice output need a few live quote walkthroughs.
4. **Uncommitted checkpoint** — significant work sits in the working tree.

## Next actions (when you return)

1. **Commit** the current working tree to GitHub.
2. **Test 3–5 real quotes** end-to-end (save, reload, print, completion tracking).
3. **Review pricing** for jobs you quote most often; adjust `service-catalog.ts` bands.
4. **Optional polish:** invoice layout, component split, export quote as JSON/PDF file.
5. **Optional product:** quote favorites beyond templates, completion variance dashboard.

## Constraints (unchanged)

- Local-first; no public deployment without approval
- Toronto/Ontario pricing and trade boundaries first
- Do not quote `licensed_required` or `do_not_accept` work as normal handyman jobs
- Keep pricing transparent: labour, materials, travel, urgency, tax visible
