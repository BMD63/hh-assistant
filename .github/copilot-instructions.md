## Purpose
Short, focused guidance for AI agents working on this repo. Use these notes to be immediately productive: where to look, how data flows, and project-specific patterns.

## Big picture
- Single-page React + TypeScript app built with Vite. UI lives in `src/components/`; business logic in `src/hooks/`; persistent client state in `src/stores/` (Zustand); external integration via `src/services/hhApi.ts`.
- Data flow: UI -> hooks (useSearch/useVacancies) -> stores (filters/search) -> service (hhApiService) -> HH public API. Query string composition is done in `src/utils/searchQueryBuilder.ts`.

## Key files to inspect (quick map)
- `package.json` — dev/build/test scripts (dev = `vite`, build = `tsc -b && vite build`, lint, type-check).
- `src/services/hhApi.ts` — encapsulates fetch calls to https://api.hh.ru. Modify here to change API behavior (headers, auth, rate-limiting).
- `src/hooks/useVacancies.ts` — core vacancy search logic, paging and automatic re-search on filter changes.
- `src/hooks/useSearch.ts` — small wrapper around `searchStore` providing handleSearch and migration cleanup.
- `src/stores/*.ts` — zustand stores. Note persisted keys and `partialize` behavior in `filtersStore.ts`.
- `src/utils/searchQueryBuilder.ts` — builds the final text query (handles include/exclude terms using `OR` and `NOT`).
- `src/components/*` — presentational components; `SearchForm.tsx` wires search inputs to the hooks.

## Project-specific conventions & patterns
- State: Uses zustand with `persist` for long-lived UI state. Example keys: `filters-storage` and `search-store` (check store files for exact names).
- Persist details: `filtersStore` uses `partialize` to avoid persisting UI-only state (e.g. `expandedFilters`). If you add UI-only flags, prefer excluding them via `partialize`.
- Hooks are the single place for side-effects and service calls. Prefers small hooks per feature (`useVacancies`, `useSearch`).
- Service layer: `hhApiService` returns parsed JSON and throws on non-OK responses. There is no centralized HTTP client; change `fetchAPI` to add headers, retries, or logging.
- Routing: App mounts routes under `/hh-assistant` and also provides root (`/`) routes for local dev.
- Styling: Tailwind utility classes throughout; components are functional and typed (TSX). Keep CSS in `index.css` and Tailwind config in `tailwind.config.js`.

## Dev & debugging workflows
- Start dev server with `npm run dev` (Vite, HMR).
- Build: `npm run build` (runs `tsc -b` then `vite build`).
- Type checking: `npm run type-check` (fast preflight of TypeScript). Run this before big changes.
- Lint: `npm run lint` (ESLint). Husky is present (`prepare`), check `.husky/` if hooks are configured locally.
- Debugging notes: `hhApiService.searchVacancies` logs input params (`console.log('🔍 searchVacancies called with:', params)`); this is a good place to inspect request shapes.

## Integration & external dependencies
- The app talks directly to the public HH API (no server-side proxy). If you need server-side changes (CORS, API keys), add a proxy or move requests server-side.
- Main third-party libs: React 19, Vite, zustand, react-hook-form, react-router-dom, @tanstack/react-query (present but not central in current hooks), zod for validation.

## How to add a new filter (concrete example)
1. Add state to `src/stores/filtersStore.ts` (and include getters/setters). Remember to update `partialize` if it shouldn't persist.
2. Add a UI component under `src/components/` (follow existing naming + props pattern, e.g. `SalaryFilter.tsx`).
3. Consume the new filter from `useVacancies.ts` — convert to API param and pass to `hhApiService.searchVacancies`.
4. Update `src/utils/searchQueryBuilder.ts` only if you need special text-query logic.

## Small gotchas & discoverable behaviors
- Default area is `'113'` (see `filtersStore`), which means "no area filter"; `hhApiService` omits `area` param if it equals `'113'`.
- `filtersStore` excludes `expandedFilters` from persisted state to avoid saving UI-only flags.
- Legacy localStorage key: `useSearch.ts` removes `search-query-storage` on mount—be mindful if migrating old data.
- Pagination: `useVacancies` requests `per_page: 20` and relies on response `pages` field to compute `hasMore`.

## When to ask the maintainer
- If you need a server-side proxy, API keys, or rate-limiting policy changes.
- If you want to introduce global HTTP middleware (retries, auth) — prefer adding a small client module and updating `hhApiService.fetchAPI`.

---
If any section above is unclear or you want examples expanded (e.g., a suggested PR to add retries to `hhApiService` or to extract a shared HTTP client), tell me which part and I will update the file.
