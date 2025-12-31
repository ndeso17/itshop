# Copilot instructions — tishop-web

This file captures the minimal, actionable knowledge an AI assistant needs to be productive in this React + Vite single-page app.

Overview

- This is a React (v19) app bootstrapped for Vite. Dev server: `npm run dev` (runs `vite`). Build: `npm run build`.
- Routing is handled by `react-router-dom` and entry/boot is in `src/main.js`.

Key architecture & data flows

- UI: `src/components/` is split into `layout/`, `ui/`, and `common/`. Pages live in `src/pages/`.
- App routes: see [src/routes/AppRoutes.js](src/routes/AppRoutes.js) and auth gating in [src/routes/ProtectedRoute.js](src/routes/ProtectedRoute.js).
- Global state: authentication via `src/context/AuthContext.js` and locale via `src/context/LanguageContext.js`.
- i18n: uses `i18next` + `react-i18next`; initialization in [src/i18n/index.js](src/i18n/index.js) and translations in `src/i18n/locales/*.json`.
- API layer: `src/api/axios.js` wraps `axios`; higher-level endpoints are in `src/api/catalog.js` and `src/api/products.js`. When changing endpoints or base URL, update `src/api/axios.js` first.

Project-specific conventions

- Components are PascalCase and default-exported. Small presentational pieces go in `components/ui/` (e.g., ProductCard). Layout wrappers live in `components/layout/`.
- Pages export React components from `src/pages/*` — these connect to routes directly.
- Prefer using contexts (`AuthContext`, `LanguageContext`) for app-wide concerns rather than prop drilling.
- Localized strings: add keys to all three locale files (`en.json`, `id.json`, `ko.json`) to keep parity.

Developer workflows

- Start dev server: `npm run dev` (Vite HMR).
- Linting: `npm run lint` (uses ESLint configured in repo root). Fixes should follow existing style; avoid sweeping reformat.
- Preview production build: `npm run preview` after `npm run build`.
- There are no automated tests configured; do not add testing assumptions without asking.

Integration points & external deps

- Network: all HTTP calls go through `src/api/axios.js` (axios v1). Mocking/testing will need that file swapped or intercepted.
- i18n: adding a language requires updating locales and `src/i18n/index.js`.
- Auth: `AuthContext` drives ProtectedRoute behavior — changing auth semantics must update context and routes together.

What to watch for when editing

- Keep changes scoped: modify `axios` wrapper for network concerns, contexts for global state, and pages/components for UI.
- Routing: `react-router-dom` v7 has some API differences from v6 — follow existing `AppRoutes.js` patterns.
- Avoid changing ESLint config without CI validation; run `npm run lint` locally.

Typical small tasks examples

- Add product field: update API parsing in `src/api/products.js`, update `src/pages/ProductDetail.js` and `components/ui/ProductCard.js` display, and add translation keys.
- Add new route: add page in `src/pages/`, register path in `src/routes/AppRoutes.js`, and add nav link in `components/layout/Navbar.js`.

If unsure

- Point to the files above and ask to run `npm run dev` and/or `npm run lint` to verify changes.

Feedback

- If any section is unclear or missing details (build env variables, external services), tell me which area to expand.
