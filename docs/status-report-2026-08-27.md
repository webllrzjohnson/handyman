# Handyman Price Guide Status Report

_Date generated: 2026-08-27 19:48 EDT_

## Project summary

Handyman Price Guide is Louie's local Toronto/Ontario handyman pricing advisor. It is currently a local-only MVP built with Next.js 16, React 19, TypeScript, and Tailwind 4.

The app is intended to help quote small handyman jobs by showing transparent pricing inputs, trade/safety boundaries, material costs, quantity pricing, shared visit expenses, and a client-ready message.

## App goal and purpose

The goal of this app is to help Louie price small handyman and building-maintenance jobs in Toronto/Ontario without guessing, undercharging, or accidentally quoting work that should be handled by a licensed trade.

It is for quickly turning a real client request into a practical quote by selecting the job type, quantity, condition, materials, travel, parking, access difficulty, urgency, and same-fixture add-ons. The app then shows the suggested solo-freelancer price, a low-to-high planning range, a company-market comparison, the visible quote math, and a client-ready message.

The app is specifically meant to support Louie as a solo/freelance operator, not to copy large-company pricing blindly. It separates:

- informal floor pricing, useful as low-end market context,
- solo freelancer pricing, the main recommended quote range,
- company comparison pricing, useful to understand the market ceiling,
- licensed/referral-only work, useful for boundaries but not for normal handyman quoting.

What it is for:

- quoting common small repair and installation jobs,
- bundling multiple jobs into one visit so travel and access costs are not double-counted,
- adding related same-fixture work, such as toilet seat, flush handle, fill valve, faucet, PO plug, basket strainer, and P-trap work,
- making material costs, markup, and pickup fees visible,
- warning when a job should be treated as caution, licensed required, or do not accept,
- generating a simple client message and printable quote/invoice preview.

What it is not for yet:

- storing client records,
- saving quote history,
- taking payments,
- scheduling jobs,
- deploying as a public app,
- replacing licensed electrical, gas, fire/life-safety, structural, or high-risk plumbing judgment.

## Current state

- Project path: `D:\Factory\handyman-price-guide`
- Branch: `master`
- Repository history: one initial Create Next App commit, followed by uncommitted MVP work
- Deployment: none, local-only unless Louie explicitly approves deployment
- Data storage: local TypeScript data only, no database
- Main app URL while dev server is running: `http://127.0.0.1:3000`

## Database and persistence information

### Current database status

There is currently no live database in this project.

- No Postgres, Supabase, SQLite, Prisma, Drizzle, migration, schema, seed, or database client setup was found in the app code.
- No `DATABASE_URL` or equivalent database environment variable is required by the current app.
- No server actions or API routes write data to persistent storage.
- Quote state is held in React component state only. Refreshing the page clears the current quote/cart.
- The project should remain database-free until Louie approves adding persistence.

### Current data source

The app uses local TypeScript files as its data layer:

```text
src/lib/service-catalog.ts
src/lib/pricing-engine.ts
```

`service-catalog.ts` is the current catalogue source of truth. It contains typed seed data for jobs, pricing bands, add-ons, option lists, and trade/safety status labels.

`pricing-engine.ts` is the pure calculation layer. It receives catalogue jobs and quote inputs, then returns structured quote totals and line items.

### Current catalogue dataset

Current local catalogue counts:

| Dataset item | Count |
| --- | ---: |
| Service jobs | 52 |
| Categories | 8 |
| Pricing modes | 3 |
| Condition options | 4 |
| Travel options | 3 |
| Parking options | 3 |
| Access options | 3 |
| Material handling options | 4 |
| Urgency options | 3 |
| Jobs with direct job-specific add-ons | 10 |
| Direct job-specific add-ons | 18 |

Service jobs by trade status:

| Trade status | Count |
| --- | ---: |
| `handyman_ok` | 31 |
| `caution` | 16 |
| `licensed_required` | 2 |
| `do_not_accept` | 3 |

Service jobs by category:

| Category | Count |
| --- | ---: |
| Doors, locks, and hardware | 12 |
| Screens and windows | 9 |
| Mounting and hanging | 4 |
| Cabinets | 2 |
| Bathroom small repairs | 1 |
| Filters and maintenance | 7 |
| Referral and licensed work | 5 |
| Plumbing fixtures and drains | 12 |

### Current TypeScript data model

The main job shape is `ServiceJob`:

```ts
type ServiceJob = {
  id: string;
  category: string;
  name: string;
  pricingUnit: string;
  unitLabel: string;
  includedQuantity: number;
  defaultQuantity: number;
  additionalUnitPrice: number;
  pricing: Record<PricingMode, PriceBand>;
  materialAllowance: number;
  tradeStatus: TradeStatus;
  confidence: Confidence;
  sourceConfidence: string;
  included: string[];
  notIncluded: string[];
  stopConditions: string;
  sources: string[];
  addOns: AddOn[];
};
```

Supporting types:

```ts
type TradeStatus = "handyman_ok" | "caution" | "licensed_required" | "do_not_accept";
type PricingMode = "informal_floor" | "solo_freelancer" | "insured_company";
type Confidence = "low" | "medium" | "high";
type PriceBand = { low: number; target: number; high: number };
type AddOn = { id: string; label: string; price: number };
```

### Current quote state model

The UI stores quote/cart state in memory using React state. The cart item shape is currently local to `src/app/page.tsx`:

```ts
type QuoteCartItem = {
  id: string;
  jobId: string;
  quantity: number;
  conditionId: string;
  materialId: string;
  materialCost: number;
  materialMarkupPercent: number;
  materialPickupFee: number;
  selectedAddOnIds: string[];
};
```

This is not persisted. There is no saved customer list, quote history, invoice table, or local browser storage yet.

### If a database is added later

A future database should not be added casually. Recommended first persistence options, in order:

1. Browser local storage for draft quotes, lowest complexity and still local-first.
2. Export/import JSON for quote snapshots, useful before adding accounts.
3. SQLite or Postgres only if Louie wants saved clients, quote history, admin editing, or deployment.

Possible future tables, if a real database becomes necessary:

- `services`, for job catalogue rows.
- `service_add_ons`, for reusable and job-specific add-ons.
- `pricing_modes`, for informal, solo freelancer, and company pricing bands.
- `quote_drafts`, for saved quote sessions.
- `quote_items`, for jobs inside each quote.
- `clients`, only if Louie wants client history.
- `source_notes`, if catalogue research needs editable provenance.

Do not add these tables until there is a clear product need.

## Completed work

### Product and UI

- Replaced the default Create Next App page with a functioning handyman price guide.
- Added job search, category filtering, trade-status filtering, and an acceptable-job toggle.
- Added pricing modes:
  - informal floor,
  - solo freelancer,
  - company comparison.
- Added quantity pricing with first-item and additional-item logic.
- Added material cost, markup, and pickup-fee inputs.
- Added shared travel, parking, and access costs.
- Added same-fixture add-ons for toilet and sink-related work.
- Added a multi-job cart so shared visit expenses apply once.
- Added optional HST/tax input.
- Added invoice preview and print/save-PDF styling.
- Added client-ready message generation.

### Catalogue and pricing logic

- Added `src/lib/service-catalog.ts` for typed local job data.
- Added `src/lib/pricing-engine.ts` for pure quote math.
- Added Toronto/Ontario handyman pricing research docs under `docs/`.
- Added safety-oriented trade status values:
  - `handyman_ok`,
  - `caution`,
  - `licensed_required`,
  - `do_not_accept`.
- Added and fixed same-fixture add-on logic so shared toilet and sink add-ons are included in quote math, not only shown in the UI.
- Fixed blocked/referral-only multi-job carts so they do not generate a normal quote total.

### Testing and verification

- Added a `test` script using `tsx --test`.
- Added pricing-engine tests in `tests/pricing-engine.test.ts`.
- Current test coverage includes:
  - suppressing normal totals for licensed/referral-only work,
  - quantity add-on math,
  - material markup and pickup fee math,
  - multi-job shared visit expenses,
  - toilet same-fixture add-ons beyond tank valves,
  - sink same-fixture add-ons for faucet, PO plug, basket strainer, and P-trap work,
  - all-blocked carts returning zero quote total.

## Latest verification

Commands run from `D:/factory/handyman-price-guide`:

```bash
npm test
npm run lint
npm run build
```

Results:

- `npm test` passed: 6 tests, 0 failures.
- `npm run lint` passed.
- `npm run build` passed.
- Next.js production build completed successfully and prerendered `/` and `/_not-found` as static routes.

## Current git state

Modified tracked files:

```text
README.md
package-lock.json
package.json
src/app/globals.css
src/app/layout.tsx
src/app/page.tsx
```

Untracked files/directories:

```text
.hermes.md
PROJECT_STATUS.md
docs/
src/lib/
tests/
```

This work has not been committed yet.

## Important decisions and constraints

- Keep the app local-first.
- Do not add a database, auth, deployment, payment provider, analytics, or external services unless Louie approves.
- Use Toronto/Ontario pricing data first.
- Treat all pricing as planning guidance, not a guaranteed quote.
- Keep freelancer pricing separate from company comparison pricing.
- Keep visible quote inputs for labour, minimum visit, quantity, condition, materials, material markup, pickup fee, travel, parking, access, urgency, and tax.
- Keep licensing and safety boundaries separate from price math.
- Do not generate normal accept-this-work quotes for `licensed_required` or `do_not_accept` work.
- Paid Ontario electrical work touching wiring, outlets, switches, fixtures, panels, breakers, circuits, or hardwired devices should normally be marked licensed/referral-only.
- Gas/fuel appliance work should be TSSA-certified referral/do-not-accept unless Louie has the required certification.

## Known issues and risks

1. `src/app/page.tsx` is large and should be split into components when the MVP behavior stabilizes.
2. The same-fixture add-on panel now works, but some options may feel duplicated, for example generic supply-line add-ons versus fixture-specific supply-line add-ons.
3. The full service catalogue still needs a careful review for pricing accuracy, duplicate jobs, and trade-boundary labels.
4. The invoice/client message should be tested against real quote scenarios before relying on it with clients.
5. The working tree contains many uncommitted files, so commit grouping should be reviewed before saving a checkpoint.

## Recommended next actions

1. Test 3 to 5 real quote scenarios in the UI, especially toilet and sink bundles.
2. Clean up duplicate or confusing same-fixture add-ons.
3. Review the plumbing and referral-only trade labels for practical boundaries.
4. Split the large page into components if further UI edits are planned.
5. Commit the MVP in a clean checkpoint once Louie approves the current behavior.
