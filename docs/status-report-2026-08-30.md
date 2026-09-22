# Handyman Price Guide — Status Report

_Date: 2026-08-30_

## Executive summary

The Handyman Price Guide has moved well past the original MVP. It now includes SQLite persistence, room-based job navigation, quote templates, scope checklists, client/quote/completion tracking, and a hardened API layer. The latest audit removed low-value UI (job images, verbose strategy panel) and added validation plus transactional saves.

**Status:** Feature-complete for Louie's current quoting workflow. **Paused** while focus shifts to the new **Fishing Tool** project.

## Current capabilities

| Area | Status |
| --- | --- |
| Quick quoting (room → area → job) | Done |
| Same-fixture add-ons | Done |
| Multi-job cart + shared visit costs | Done |
| Save/load quotes + clients | Done |
| Job completion tracking | Done |
| Quote templates | Done |
| Step 3 scope checklist | Done |
| Trade-status / referral boundaries | Done |
| Print invoice + client message | Done |
| Automated tests (21) | Passing |

## Tech stack

- **Frontend:** Next.js 16, React 19, Tailwind 4
- **Backend:** Next.js API routes
- **Database:** SQLite (`local-data.db`) via Drizzle ORM + `better-sqlite3`
- **Tests:** `tsx --test` (pricing engine, catalog integrity, API helpers, quote templates)

## Git state

- **Remote:** `github.com/webllrzjohnson/handyman`
- **Latest commits:** room navigation, persistence fixes, closet/add-on fixes, image feature (later removed locally)
- **Working tree:** uncommitted improvements from audit + templates (see `PROJECT_STATUS.md`)

## What was removed (on purpose)

- Step 3 job images — unreliable URLs, little quoting value
- `SaveLoadQuote.tsx` — functionality merged into main page
- Custom `migrate.ts` — replaced by `drizzle-kit push/migrate`
- Charging strategy panel — redundant with existing pricing modes

## Recommended next session

1. Commit uncommitted work.
2. Run 3–5 real quote scenarios (kitchen sink bundle, door tune-up, bathroom refresh, multi-room visit).
3. Tune prices for your most common jobs.
4. Decide whether to split `page.tsx` before the next UI feature.

## Out of scope (for now)

- Email/SMS quote delivery
- Mobile-first redesign
- Public deployment
- Payment processing / scheduling

---

_For day-to-day "what's next," see `PROJECT_STATUS.md` at the repo root._
