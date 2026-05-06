# NJ Coast — Scenic Locations Finder

> **Live:** [njcoast.me](https://njcoast.me) · Deployed on GitHub Pages

An interactive map for discovering scenic locations across Cape May County, New Jersey — beaches, wildlife refuges, lighthouses, state parks, and marshes. Powered by Google Maps, Gemini AI, and Vertex AI Search.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Vite 8 + React 19 + React Router v7 |
| Map | Google Maps JS API via `@vis.gl/react-google-maps` |
| AI guide | Gemini 2.0 Flash (`@google/generative-ai`) |
| Search | Vertex AI Search (Discovery Engine REST API) |
| Analytics | PostHog |
| Secrets | Doppler |
| Hosting | GitHub Pages (static, custom domain `njcoast.me`) |

---

## Local development

### 1. Install Doppler CLI
```bash
# macOS
brew install dopplerhq/cli/doppler

# Linux
(curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh || wget -t 3 -qO- https://cli.doppler.com/install.sh) | sh
```

### 2. Log in and link the project
```bash
doppler login
doppler setup   # select project: njcoast, config: dev
```

### 3. Run
```bash
npm install
doppler run -- npm run dev
```
The app is at `http://localhost:5173`.

> **Without Doppler:** copy `.env.example` → `.env.local` and fill in your keys manually.

---

## Environment variables

All secrets live in Doppler under project **njcoast**.  
The canonical reference with descriptions is [`.env.example`](.env.example).

| Variable | Required | Description |
|---|---|---|
| `VITE_POSTHOG_KEY` | Yes | PostHog project API key |
| `VITE_POSTHOG_HOST` | Yes | PostHog ingest host |
| `VITE_GOOGLE_MAPS_API_KEY` | Yes | Maps JS API key (restrict to njcoast.me) |
| `VITE_GOOGLE_MAPS_MAP_ID` | Recommended | Cloud Map ID for custom Cape May styling |
| `VITE_GEMINI_API_KEY` | Yes | Gemini API key (Google AI Studio) |
| `VITE_VERTEX_SEARCH_PROJECT_ID` | Optional | GCP project ID for Vertex AI Search |
| `VITE_VERTEX_SEARCH_LOCATION` | Optional | `global` or `us-central1` |
| `VITE_VERTEX_SEARCH_DATA_STORE` | Optional | Data store ID |
| `VITE_VERTEX_SEARCH_API_KEY` | Optional | API key restricted to discoveryengine.googleapis.com |

---

## Creating your custom Google Map

1. Go to **Google Cloud Console → Maps Platform → Map Styles**
2. Click **Create Style** — choose the visual editor or use [Styling Wizard](https://mapstyle.withgoogle.com/)
   - Suggested palette: warm sand land (`#f5f0e8`), coastal blue water (`#1a6fa8`), muted green parks
   - A ready-to-import coastal JSON style is in `src/data/mapStyle.js`
3. Go to **Maps Platform → Map Management** → **Create Map ID**
   - Map type: JavaScript
   - Associate your new style with the Map ID
4. Set `VITE_GOOGLE_MAPS_MAP_ID` in Doppler (or `.env.local`)

**Without a Map ID** the app uses the built-in `COASTAL_MAP_STYLE` from `src/data/mapStyle.js` as an inline fallback.

> ⚠️ `AdvancedMarker` (colored pins) requires a valid Map ID in production. Set one before deploying.

---

## Google Cloud credits — Vertex AI Search

The app uses the **GenAI App Builder trial credit** for these Discovery Engine SKUs:

| Feature | SKU ID | Used for |
|---|---|---|
| Standard Search API | `BADA-EE26-7BDA` | Location search queries |
| Advance Generative Answers | `C232-DC00-D993` | AI summary of search results |
| Grounded Generation | `C42C-2852-B25D` | Grounded location answers |
| Web Grounded Generation | `FBDD-D195-DEB5` | Web-aware location info |
| Ranking | `EE89-3EE8-2541` | Reranking location results |
| Data Index | `BC7D-6A97-90F8` | Indexing location data store |
| Vector Search Index Building | `8724-DA51-DA95` | Semantic/embedding search |

Also covered (future use): Dialogflow CX text/audio interactions for a conversational agent.

### Setting up Vertex AI Search
1. Enable the **Discovery Engine API** in Cloud Console
2. Go to **Vertex AI → Search & Conversation → Apps → New App → Search**
3. Create a **Data Store** (structured) — import `src/data/scenicLocations.js` exported as JSONL
4. Note your **Project ID** and **Data Store ID**
5. Create an API key restricted to `discoveryengine.googleapis.com` and your domain
6. Add all four `VITE_VERTEX_SEARCH_*` vars to Doppler

---

## HTTPS / SSL

GitHub Pages provisions a **free Let's Encrypt certificate** automatically for `njcoast.me`.

To enable:
1. Make sure your DNS has a CNAME pointing `njcoast.me` → `selfdestructer.github.io`
2. Go to **GitHub → selfdestructer/selfdestructer.github.io → Settings → Pages**
3. Under **Custom domain**, enter `njcoast.me` and save
4. Check **Enforce HTTPS** (appears once the certificate is issued, usually within minutes)

The `CNAME` file in the repo root is automatically copied to `dist/` at build time, so the custom domain survives every deploy.

---

## Deployment

Pushes to `main` trigger the GitHub Actions workflow (`.github/workflows/deploy.yml`):

1. Installs Doppler CLI
2. Runs `npm ci`
3. Calls `doppler run --project njcoast --config prd -- npm run build` — secrets injected at build time
4. Uploads `dist/` to GitHub Pages

**One-time GitHub setup:**
- Add `DOPPLER_TOKEN` as a repository secret (Settings → Secrets → Actions)
  - Get it from Doppler: Project njcoast → Access → Service Tokens → Generate (scope: prd)
- Set Pages source to **GitHub Actions** (Settings → Pages → Source)

---

## Commands

```bash
doppler run -- npm run dev     # local dev with secrets
npm run build                  # production build (secrets must be in env)
npm run lint                   # ESLint
npm run preview                # preview production build locally
```

