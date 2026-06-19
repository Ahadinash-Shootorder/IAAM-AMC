# CLAUDE.md — IAAM-AMC

> Project-level guidance for AI coding agents working in this repository.
> Read `AGENTS.md` first (it is combined automatically). The single-source
> onboarding document for humans/agents is `.kimchi/docs/project-overview.md` —
> read it before exploring the codebase.

---

## 1. What this project is

**IAAM-AMC** — marketing & conference website for the International Association
of Advanced Materials. Next.js App Router app with:

- **Public site** (Server Components): Home, About, Events (upcoming /
  individual / archive), Congress Proceedings, Speakers.
- **Admin dashboard** under `/admin/*` (JWT-protected): CMS for pages &
  sections, plus CRUD for Speakers / Sponsors / Events / Proceedings, a
  Media library, Contact queries, Activity logs, Settings.
- **Dynamic sections**: each public page is composed from a list of `Section`
  rows (DB) rendered in `order`. Section content is stored as a JSON string
  in `Section.content` and parsed by `src/lib/data.js`.

## 2. Stack (pinned versions — do not casually upgrade)

| Layer | Version | Notes |
|---|---|---|
| Next.js | **16.2.6** | App Router. **See §3 — this is NOT training-data Next.js.** |
| React | **19.2.4** | Server Components by default. |
| Tailwind CSS | **v4** | Uses `@tailwindcss/postcss`; config in `postcss.config.mjs`. |
| Prisma | **5.22.0** | See §4 — schema/provider mismatch. |
| Auth | `jose` (JWT) + `bcryptjs` | Cookie name: `admin_token`. |
| Icons | `react-icons` | |

## 3. Next.js 16 is breaking — read the docs first

`AGENTS.md` contains the warning. Concrete implications:

- Before writing **any** route handler, server action, middleware, or
  metadata code, **read the relevant guide in `node_modules/next/dist/docs/`**.
- APIs you may assume from training data (e.g. `cookies()`, `headers()`,
  route handler signatures, dynamic params shape, caching defaults) have
  changed. Verify against the bundled docs, not memory.
- Heed deprecation notices emitted by `next build`.

## 4. Database — provider gotcha

`prisma/schema.prisma` declares:

```
provider = "postgresql"
```

…but **local development uses SQLite** (`prisma/dev.db`). `DATABASE_URL` is
the source of truth — make sure yours matches the engine you're running
against. PostgreSQL is intended for production (see `PROJECT_STATUS.md` item
38). Do not "fix" the schema to SQLite without confirming intent.

The build script (`npm run build`) runs `prisma db push && prisma db seed &&
next build`, so destructive schema changes will hit the live DB during a
production build.

## 5. Auth & security invariants (do not weaken)

Source of truth: `middleware.js` + `src/app/api/admin/login/route.js`.

- The `admin_token` cookie is **httpOnly** + `Secure` (prod) +
  `SameSite=lax`, 24h expiry.
- Middleware exempts only `/admin/login`, `/api/admin/login`,
  `/api/admin/logout`. Every other `/admin/*` and `/api/admin/*` requires a
  valid `jose` JWT verified against `JWT_SECRET`.
- **`JWT_SECRET` must be set in production.** `middleware.js` throws on
  boot if `NODE_ENV=production` and the env var is missing. Never remove
  this guard.
- Login is rate-limited: **5 attempts / 15-minute lockout per IP**. Do not
  remove or weaken this without an explicit user request.
- Passwords are hashed with `bcryptjs`. Never log or echo passwords,
  tokens, or `JWT_SECRET`.
- Default seeded admin: `admin@iaam.com` / `admin123`. This is for local
  dev only — flag any change that would expose it beyond `NODE_ENV !==
  production`.

## 6. Content model — read this before touching sections

- `Page` → `Section` (composite PK `[pageId, id]`).
- `Section.content` is a **JSON-encoded string**, not a JSON column.
  `readPageSectionData` / `writePageSectionData` in `src/lib/data.js` handle
  stringification — call those helpers, do not `JSON.parse` inline.
- `Section.draftContent` holds unpublished edits (see `PROJECT_STATUS.md`
  item 53 — "Preview Before Publish"). Preserve this column in any new
  migration.
- **`SectionHistory`** is written **on every publish**, not on draft save.
  Restoring history is a user-facing feature (item 55) — don't break it.
- **Every section write also writes a JSON backup** to
  `data/pages/[pageId]/[sectionId].json` via `src/lib/backup.js`. Keep
  backups in sync — losing a backup path is a data-loss event, not a bug.
- Admin mutations are logged via `logActivity(adminEmail, action, details)`
  to `prisma.activityLog`. Always call it on create/update/delete of
  Speaker, Sponsor, Event, Proceeding, Media, or Section content.

## 7. Routing conventions

- Public pages are **Server Components** reading directly from Prisma. Do
  not introduce `useEffect` + `fetch` for data that can be read on the
  server.
- Admin pages are typically **Client Components** calling authenticated API
  routes under `/api/admin/*`.
- API routes under `/api/admin/*` must rely on `middleware.js` for auth —
  do **not** duplicate the JWT verify in each route handler unless you have
  a specific reason (and then add it to the route's docstring).
- The public contact form posts to `/api/contact` — that route is **not**
  protected.

## 8. Commands

```bash
npm install              # also runs `prisma generate` (postinstall)
npx prisma db seed       # seeds pages/sections/speakers/... + admin@iaam.com
npm run dev              # next dev
npm run build            # prisma db push && prisma db seed && next build
npm run lint             # eslint (eslint-config-next, core-web-vitals)
```

## 9. Files to know before you start

| Concern | Path |
|---|---|
| Route protection | `middleware.js` |
| DB schema | `prisma/schema.prisma` |
| Seed data + admin user | `prisma/seed.js`, `prisma/seed_data/` |
| Prisma client singleton | `src/lib/db.js` |
| Section CRUD + draft/publish | `src/lib/data.js` |
| File-system backups | `src/lib/backup.js` |
| Audit logging | `src/lib/logger.js` |
| Login API (rate limit) | `src/app/api/admin/login/route.js` |
| Admin shell | `src/app/admin/layout.js` |
| Page registry | `data/pages.json` |
| Human/agent onboarding | `.kimchi/docs/project-overview.md` |
| Task status (✅/⏳/⏭️) | `PROJECT_STATUS.md` |

## 10. What NOT to do without explicit user approval

- **Never** commit secrets. `.env*` is git-ignored — keep it that way.
- **Never** weaken or bypass auth, rate limiting, or password hashing
  "temporarily".
- **Never** `git add -A` / `git add .` — stage explicit paths.
- **Never** `git reset --hard`, `git push --force`, `git branch -D`, or
  `git clean -f` on `main` / `master` / `release/*` without explicit
  approval. Detect the default branch dynamically
  (`git symbolic-ref refs/remotes/origin/HEAD --short`) rather than
  hardcoding.
- **Never** `--no-verify` to skip hooks. Fix the underlying issue.
- **Never** amend a published commit unless the user explicitly asks.
- For `git rebase` / `git commit` / `git merge --squash`, set
  `GIT_EDITOR=true` so an editor prompt cannot hang the run.
- Do not introduce new runtime dependencies without explicit instruction.
- Do not modify generated files (`prisma/migrations/**`, `.next/**`,
  `next-env.d.ts`) by hand.

## 11. Conventions

- Prefer editing the smallest reasonable scope; do not reformat unrelated
  files.
- Match existing style: Tailwind v4 utility classes, `react-icons` for
  icons, Server Components for public data fetching, Client Components for
  admin interactivity.
- Place new components next to siblings: `src/components/<Domain>/...`.
- Admin CRUD pages should reuse `src/components/Admin/CrudTable.jsx` and
  `src/components/Admin/MediaPickerModal.jsx` rather than forking them.
- After editing a file, run `npx eslint <file>` (or `npm run lint`) before
  claiming the work is complete.

## 12. Working directory rules (Kimchi harness)

- Intermediate artefacts — plans, research notes, scratch — go in
  `.kimchi/docs/`, **never** in the project tree or `/tmp`.
- Working documents passed between subagents also go in `.kimchi/docs/`.
