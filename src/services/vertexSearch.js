/**
 * Vertex AI Search service — uses the Discovery Engine REST API.
 *
 * Covered SKUs from the GenAI App Builder trial credit:
 *   - Vertex AI Search: Standard Search API Request Count  (BADA-EE26-7BDA)
 *   - Vertex AI Search: Enterprise Search API Request Count (93D6-7280-CF05)
 *   - Vertex AI Search: Advanced Generative Answers Request Count (C232-DC00-D993)
 *   - Vertex AI Search: Grounded Generation (C42C-2852-B25D)
 *   - Vertex AI Search: Web Grounded Generation (FBDD-D195-DEB5)
 *   - Vertex AI Search: Ranking (EE89-3EE8-2541)
 *   - Vertex AI Search and Conversation: Data Index (BC7D-6A97-90F8)
 *
 * Also covered under the same credit:
 *   - Vector Search Index Building (8724-DA51-DA95) — for embedding-based semantic search
 *   - Dialogflow CX text/audio interactions — for conversational agent (future)
 *
 * Setup requirements (one-time in Google Cloud Console):
 *   1. Enable the Discovery Engine API
 *   2. Create an App in Vertex AI Search > Apps > New App > Search
 *   3. Create a data store (unstructured or structured JSON with your locations)
 *   4. Import your location data (src/data/scenicLocations.js exported as JSONL)
 *   5. Note your Project ID, Data Store ID, and Serving Config ID
 *   6. Create an API key restricted to the Discovery Engine API for your domain
 *
 * Environment variables required:
 *   VITE_VERTEX_SEARCH_PROJECT_ID   — GCP project number or ID
 *   VITE_VERTEX_SEARCH_LOCATION     — e.g. "us-central1" or "global" (covered region)
 *   VITE_VERTEX_SEARCH_DATA_STORE   — Data store ID from Vertex AI Search console
 *   VITE_VERTEX_SEARCH_API_KEY      — API key restricted to discoveryengine.googleapis.com
 */

const PROJECT_ID = import.meta.env.VITE_VERTEX_SEARCH_PROJECT_ID
const LOCATION = import.meta.env.VITE_VERTEX_SEARCH_LOCATION || 'global'
const DATA_STORE_ID = import.meta.env.VITE_VERTEX_SEARCH_DATA_STORE
const API_KEY = import.meta.env.VITE_VERTEX_SEARCH_API_KEY

const BASE_URL = `https://discoveryengine.googleapis.com/v1`

/**
 * Search for scenic locations using Vertex AI Search.
 * Uses the "search with answer" endpoint to get both results and a Grounded Generation summary.
 *
 * @param {string} query - Natural language query, e.g. "best birding spots in Cape May"
 * @param {{ pageSize?: number, summaryResultCount?: number }} options
 * @returns {Promise<{ results: Array, summary: string | null }>}
 */
export async function searchLocations(query, { pageSize = 5, summaryResultCount = 3 } = {}) {
  if (!isConfigured()) {
    throw new Error('Vertex AI Search is not configured. Check VITE_VERTEX_SEARCH_* env vars.')
  }

  const servingConfig = `projects/${PROJECT_ID}/locations/${LOCATION}/collections/default_collection/dataStores/${DATA_STORE_ID}/servingConfigs/default_serving_config`
  const url = `${BASE_URL}/${servingConfig}:search?key=${API_KEY}`

  const body = {
    query,
    pageSize,
    queryExpansionSpec: { condition: 'AUTO' },
    spellCorrectionSpec: { mode: 'AUTO' },
    contentSearchSpec: {
      snippetSpec: { returnSnippet: true },
      summarySpec: {
        summaryResultCount,
        includeCitations: true,
        ignoreAdversarialQuery: true,
        ignoreNonSummarySeekingQuery: true,
        // Uses Advance Generative Answers SKU: C232-DC00-D993
        modelPromptSpec: {
          preamble:
            'You are a scenic locations guide for Cape May County, NJ. Summarize the search results to help the user find the best spot for their interest.',
        },
      },
    },
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Vertex AI Search error ${res.status}: ${err}`)
  }

  const data = await res.json()

  const results = (data.results || []).map((r) => {
    const doc = r.document?.derivedStructData || r.document?.structData || {}
    return {
      id: r.id,
      title: doc.title || doc.name || r.id,
      snippet: r.document?.derivedStructData?.snippets?.[0]?.snippet || '',
      link: doc.link || null,
      raw: doc,
    }
  })

  const summary = data.summary?.summaryText || null

  return { results, summary }
}

/**
 * Rank a list of location candidates against a user query.
 * Uses Vertex AI Search Ranking SKU: EE89-3EE8-2541
 *
 * @param {string} query
 * @param {Array<{ id: string, title: string, content: string }>} records
 * @returns {Promise<Array<{ id: string, score: number }>>}
 */
export async function rankLocations(query, records) {
  if (!isConfigured()) return records.map((r, i) => ({ ...r, score: 1 - i * 0.1 }))

  const rankingConfig = `projects/${PROJECT_ID}/locations/${LOCATION}/rankingConfigs/default_ranking_config`
  const url = `${BASE_URL}/${rankingConfig}:rank?key=${API_KEY}`

  const body = {
    model: 'semantic-ranker-512@latest',
    topN: records.length,
    query,
    records: records.map((r) => ({ id: r.id, title: r.title, content: r.content })),
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) return records.map((r, i) => ({ ...r, score: 1 - i * 0.1 }))

  const data = await res.json()
  return data.records || []
}

export const isConfigured = () =>
  Boolean(PROJECT_ID && DATA_STORE_ID && API_KEY)
