# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal expense tracker (PWA) built with React 19, TypeScript, Vite, TanStack Router, TanStack Query, Tailwind v4 and shadcn/ui, styled after Material Design 3. The client talks to a small API (`apps/api`) that stores each user's data in SQLite. The UI is in German and English.

## Commands

Node version is pinned in `.nvmrc`. The repo is an npm workspaces monorepo: the client lives in `apps/web` (`@finances/web`), the API in `apps/api` (`@finances/api`) and shared zod schemas in `packages/shared`. Run the commands below from the repo root; root scripts delegate to the workspaces. Formatting (Prettier) and knip are configured once at the root.

- `npm run dev:web`: start the Vite dev server; it proxies `/api` to the API on port 3000 (`npm run dev:web -- --host` exposes it on the LAN for testing on a phone; add that origin to `TRUSTED_ORIGINS`)
- `npm run build`: type-check (`tsc -b`) and build for production. This is the only type check. Also this compiles Paraglide source files. Don't invoke any Paraglide CLI commands to regenerate files after message changes.
- `npm run lint`: ESLint in every workspace, in parallel (`concurrently`), with `--max-warnings 0`. The root `eslint.config.js` holds the shared defaults (`@eslint/js` + typescript-eslint recommended, ignores); each workspace's `eslint.config.js` extends it (web: React plugins and browser globals; api/shared: Node globals). Known violations are suppressed in `apps/web/eslint-suppressions.json`: don't add to it; after fixing one, run `npx eslint . --prune-suppressions` in that workspace.
- `npm run format` / `npm run format:check`: Prettier with `--cache` (4-space indent, no plugins)
- `npm run knip:check`: detect unused files and exports
- `npm run dev:api`: start the API with `node --watch` (copy `apps/api/.env.example` to `apps/api/.env` first). Run it alongside `npm run dev:web`.
- `npm run cli -w @finances/api -- invite`: operator CLI (commander, `src/cli/`; one file per command in `src/cli/commands/`): `invite`, `reset-password <username>`, `users`, `backup` (snapshot to stdout), `restore [--force]` (from stdin). In Docker: `finances invite`. The CLI logs to stderr (`cli/log-to-stderr.ts` must stay its first import) so stdout only carries command output.
- `npm test`: Vitest in every workspace. Web tests use React Testing Library in jsdom; `apps/web/test/setup.ts` forces the German locale. The API test app (`test/test-app.ts`) stores passwords in plain text instead of scrypt to keep tests fast.

- Per-workspace variants (`<pkg>` is `web`, `api` or `shared`): `build:<pkg>`, `lint:<pkg>`, `format:<pkg>`, `format:check:<pkg>`, `test:<pkg>`, and `check:<pkg>` (format check, lint, build and test of that workspace in a row).

CI (`.github/workflows/ci.yml`) runs `knip:check`, `build`, `format:check`, `lint` and `test` across all workspaces. Locally, only check the workspaces a change touches: run `check:<pkg>` for each of them (`web` and `api` too when `packages/shared` changes, since both import it), plus `knip:check`, before considering a change done. Don't run the repo-wide `lint`/`test`/`build`/`format:check` for a change confined to one workspace.

Releases: pushing a `vX.Y.Z` tag builds the Docker image (Node running the API, which also serves the built client from `STATIC_DIR`; see `Dockerfile`), pushes it to `ghcr.io/jgoedde/finances`, and creates a GitHub release. Bump the version in the root `package.json` first (workspace packages carry no version); it is injected as `__APP_VERSION__`.

## Architecture

Paths below are relative to `apps/web` unless they start with `.github/`, `docker/` or name a root file.

### Data flow (client)

- `src/api/api-client.ts`: `api` is a Hono RPC client (`hc<AppType>`, ADR 0009) typed from the API's router: paths, params, query, JSON bodies and responses are inferred, so an API change the web doesn't match fails `npm run build`. It sends the session cookie (same origin) and marks the app offline when a request never reaches the server. Wrap every call in `unwrap(api.x.$get(...))`: it throws `ApiError` (status, body) for non-2xx responses, resolves to `undefined` for 204 and otherwise returns the typed success body. For a body that isn't read as JSON (the export download), `ensureOk(...)` throws the same way and returns the response. Encode boolean query parameters with `toBooleanQuery` from `@finances/shared`, next to the `booleanQuery` schemas that decode them. Never write explicit response types or casts (the one exception: the import uploads the user's file unchecked as the request body, since only the API validates exports); `@finances/api` is imported with `import type` only (lint enforces it).
- `src/api/api-errors.ts`: `ApiErrorCode` is derived from every `{ error: code }` body in `AppType`, plus a short list of codes Hono doesn't infer (session middleware, body limit). The messages table must cover exactly those codes, so a new or removed code fails the build. In the API, send errors with `apiError(c, "not_found", 404)` (`http/api-error.ts`), which keeps the code a literal type; a code widened to `string` fails the build.
- Each feature has a `*-queries.ts` module (for example `features/transactions/transaction-queries.ts`) with TanStack Query `queryOptions`, read hooks and mutation hooks. Mutations invalidate the affected query keys (`["transactions"]`, `["insights"]`, `["fixed-costs"]`) in `onSettled`. Read hooks return `[]`/`0`/`null` while loading so components render without loading branches.
- Offline (`features/sync/`, `features/transactions/transaction-mutations.ts`): transaction create/edit/delete are queued TanStack mutations. Their logic (request, optimistic cache update, retry, sync-failure handling) lives in `setMutationDefaults`, never in components, so mutations restored after a reload still run; components only call `useSaveTransaction()`/`useDeleteTransaction()` and never await them. `persistence.ts` restores the cache and the queue from IndexedDB before the app renders and never busts it (no `buster`, `maxAge: Infinity`). List/detail query functions merge pending changes (`pending-changes.ts`), so refetches don't hide them. Network errors and `5xx`/`401` retry forever; other `4xx` become sync failures (`sync-failures.ts`, localStorage). `connectivity.ts` drives TanStack's `onlineManager`, also from failed requests. Fixed costs are online-only.
- Route loaders that need data up front use `context.queryClient.ensureQueryData(...)` and the component reads it with `useSuspenseQuery`.
- Auth: `src/auth/auth-client.ts` wraps the better-auth client; `sessionQuery` holds the signed-in user. The pathless `routes/_authed.tsx` layout redirects to `/login` without a session, so every app route lives under `routes/_authed/`. A 401 from any query or mutation (see `api/query-client.ts`) clears the session and redirects to the login. `/link/$token` redeems invites and password reset links.

Data conventions: a transaction is an expense or an income (`kind`), and `amount` is always non-negative. Transaction `date` is a Unix timestamp in **milliseconds**. `exceptional` transactions (one-off large purchases) are excluded from the insights. Transaction ids are client-generated (`nanoid(8)`) and saved with an idempotent `PUT`; a deleted id can never be written again, so "restore" saves a copy under a new id. Fixed-cost dates are `YYYY-MM-DD` strings in the API; `features/fixed-costs/fixed-cost.ts` hydrates them into the `FixedCost` UI type with derived amounts.

### Routing and UI

- i18n (Paraglide JS): UI texts live in `messages/de.json` and `messages/en.json` (same keys; `project.inlang/settings.json` loads the message-format plugin from `node_modules`, so compiling needs no network). The Vite plugin compiles them into `src/paraglide/`, which is committed like the route tree (lint, Prettier and knip skip it); never edit it by hand. Use `m.some_key()` from `#/paraglide/messages.js`; for lookup tables store the message functions (`{ monthly: m.fixed_cost_interval_monthly }`) and call them when rendering. The locale comes from the settings (localStorage `finances-locale`, per device; `chooseLocale` in `src/i18n.ts` saves it and reloads), else the browser language (`de*` is German, anything else English). `src/i18n.ts` registers that strategy and must stay the first import of `main.tsx`. Format dates and numbers with `getLocale()` from `#/paraglide/runtime.js`; amounts stay EUR. The API sends error codes (`{ error: "not_found" }`); `api/api-errors.ts` words them. Data from the server (default category names) stays German.
- TanStack Router file-based routes live in `src/routes/`. `src/routeTree.gen.ts` is generated by the Vite plugin, so never edit it by hand. Route components are auto code-split.
- `nuqs` handles state stored in the URL query (for example search filters).
- `src/features/<feature>/` holds feature code (transactions, fixed-costs, search filters). `src/components/ui/` holds shadcn components, customized for the M3 look. The `cn` helper is in `src/lib/cn.ts`.
- The UI follows Material Design 3 (baseline, not Expressive). `src/globals.css` is the token source:
    - Colors: raw scheme values are `--md-sys-color-*` (from `public/material-theme.json`), switched by the `.dark` class. They are exposed as Tailwind colors (`bg-surface-container`, `text-on-surface-variant`, `text-income` for the custom income color). Tailwind's default palette is reset, so `bg-blue-500` etc. don't exist. A bridge maps shadcn names (`muted-foreground`, `border`, …) to MD3 roles for CLI-added components; use MD3 names in our own code.
    - Type scale: `text-display-large` … `text-label-small`. Use these instead of `text-sm`/`font-medium`. `font-brand` (Poppins) is for headings and amounts; body text is Roboto.
    - Shape: `rounded-xs` 4dp, `sm` 8dp, `md` 12dp, `lg` 16dp, `xl` 28dp, `full`. Elevation: `shadow-elevation-1` … `-5`. Easing: `ease-standard`, `ease-emphasized*`.
    - Interaction: add `state-layer` (hover/focus/press overlay in the content color) and `focus-ring` to interactive elements. Text roles like `outline` are for borders only; use `on-surface-variant` for secondary text.
- `cn()` registers the custom text/shadow/font/ease tokens with tailwind-merge. Add new theme tokens there too, or tailwind-merge may drop them as conflicting classes.
- Use the primitives for MD3 components (`Button` variants `filled`/`filledTonal`/`elevated`/`outline`/`text`/`ghost`, `Card` variants, `Badge variant="md3"` as a chip, `SegmentedButton`, `TopAppBar`) rather than hand-styling.
- Icons: Material Symbols Rounded via `unplugin-icons` (`import AddIcon from "~icons/material-symbols/add-rounded"`, 24px by default; outlined `-outline-rounded` variants unless MD3 asks for filled, e.g. active navigation destinations). Type icon props as `IconComponent` (`src/lib/icon.ts`). Category icons are the exception: users store Lucide icon names, so `CategoryAvatar` and the category form still render them with `lucide-react/dynamic`.
- Empty states: use `Empty` from `components/ui/empty.tsx` (icon in `EmptyMedia`, title, description, optional actions in `EmptyContent`; `size="compact"` inside cards and sheets), and `OfflineEmpty` for content that can't load offline. Never a bare "nothing here" paragraph.
- `src/utils/color.ts` uses `@material/material-color-utilities` to derive tonal container colors from category colors.
- PWA: `vite-plugin-pwa` uses `registerType: "prompt"`. The update toast is wired in `routes/__root.tsx` via `src/pwa.ts`.

### API (`apps/api`)

Server-authoritative design; see `docs/adr/` and `GLOSSARY.md`.

- Hono + better-sqlite3 + Kysely + better-auth. Node runs the `.ts` sources directly (type stripping), so the API uses only erasable TS syntax. `tsc -b` is a type check only.
- One endpoint per file: `features/<feature>/<verb>-<noun>.ts` exports `factory.createHandlers(...validators, handler)` (`http/factory.ts`). Only the feature's `routes.ts` maps paths to endpoints (chained: `new Hono<AppEnv>().get(...).post(...)`); `app.ts` mounts the routers in chained expressions whose type is exported as `AppType` (`@finances/api`): the signed-in routers go into one sub-router that applies `requireUser` once (admin routers into a nested one with `requireAdmin`). A `.route(...)`/`.get(...)` outside a chain (or in a loop) is invisible to the web client. `validate(...)` types the schema's input for the client and its output for the handler. Endpoints get their dependencies from the context (`c.var.db`, `c.var.auth`, `c.var.userId`), validate every input with `validate(...)` and stay thin: helpers shared within a feature, and logic the CLI also uses, live in the feature module (`features/<feature>/<feature>.ts`); pure aggregation lives in its own module (e.g. `insights/month-overview.ts`).
- Request/response schemas live in `packages/shared` (zod) and are shared with the client.
- `db/migrate.ts` first lets better-auth migrate its own tables, then runs our Kysely migrations from `db/migrations/`. Append new migrations; never edit applied ones.
- Every app table is keyed by `(user_id, id)`, and every query must filter by the session's `userId`. Transactions are written with an idempotent `PUT /api/transactions/:id` (create or replace). Deletes leave a tombstone so late replays of a deleted id are ignored.
- Export/import (`features/data-transfer/`): `GET /api/data/export` returns the versioned `DataExport` JSON (`packages/shared/src/export.ts`); `POST /api/data/import` takes that JSON and only imports into an account without transactions and fixed costs. Changing the export shape means bumping `version` and still accepting old versions.
- Users are created only server-side (invites via the operator CLI, admin bootstrap from `ADMIN_USERNAME`/`ADMIN_PASSWORD`); public sign-up is disabled. In production `main.ts` also serves the built client from `STATIC_DIR` (`http/static.ts`). New users get the default categories via a better-auth `databaseHooks` hook.

### Conventions

- Imports use the `#/` alias (pointing at the workspace's `src/`) and include the explicit `.ts`/`.tsx` extension. The alias is Node's subpath import, defined by `imports` in each app's `package.json` (not tsconfig `paths`, which Node and Vitest ignore), so it works in Node, Vite, Vitest and TypeScript alike.
- TS runs in strict mode with `noUncheckedIndexedAccess`, so indexed access returns `T | undefined`.
- Every `switch` is exhaustive: end it with ``default: throw new Error(`unreachable error - type ${String(value satisfies never)}`)``, so a new union member fails to compile (`String()` because lint rejects `never` in a template literal).
- Separate a JSDoc block from the code above it with one empty line (not needed directly after an opening `{`).
- Knip is strict (`includeEntryExports`; it only ignores the generated `src/paraglide/`, the message-format plugin, which only `project.inlang` references, and `@svgr/plugin-jsx`, which unplugin-icons loads by name): every export must be imported somewhere, including from `packages/shared` and the shadcn components in `components/ui/`. Only export what's used, and delete unused components instead of ignoring them.

## Agent skills

### Issue tracker

Issues live in GitHub Issues on jgoedde/Finances (`gh` CLI). See `docs/agents/issue-tracker.md`.

### Triage labels

Default five labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: root `GLOSSARY.md` + `docs/adr/`. See `docs/agents/domain.md`.
