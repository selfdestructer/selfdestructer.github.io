# NJ Coast — Agent Instructions

## Cursor Cloud specific instructions

This is a static Vite + React 19 SPA with no backend, no database, and no Docker dependencies.

### Running the app

```bash
npm run dev        # Starts Vite dev server at http://localhost:5173
npm run build      # Production build → dist/
npm run lint       # ESLint
npm run preview    # Preview production build locally
```

### Key caveats

- **API keys are optional for dev server startup.** The app renders gracefully without any `VITE_*` env vars, but the map page shows a fallback card ("Google Maps API Key Required") instead of the full interactive map + sidebar. The About page and routing work regardless.
- **No Doppler needed in Cloud Agent VMs.** The README recommends `doppler run -- npm run dev` but a plain `npm run dev` works fine. If API keys are needed, create `.env.local` from `.env.example`.
- **Node 22 is compatible** even though CI uses Node 20.
- **ESLint 10 flat config** is used (`eslint.config.js`). Run `npm run lint` to verify.
- **No test framework** is configured in this repo — there are no unit/integration tests to run.
