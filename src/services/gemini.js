/**
 * Gemini service — wraps @google/generative-ai for browser use.
 *
 * Uses the Gemini 2.0 Flash model (fast + cheap, good for real-time UI).
 * API key is loaded from VITE_GEMINI_API_KEY at build time.
 *
 * Covered under Google Cloud GenAI credits via the Gemini API quota.
 */

import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

let _client = null

function getClient() {
  if (!API_KEY) return null
  if (!_client) _client = new GoogleGenerativeAI(API_KEY)
  return _client
}

/**
 * System instruction that scopes the assistant to Cape May County scenic locations.
 */
const SYSTEM_INSTRUCTION = `You are a friendly, knowledgeable guide for NJ Coast — a scenic locations finder
focused on Cape May County, New Jersey. Help users discover beautiful spots: beaches, wildlife refuges,
lighthouses, state parks, marshes, heronries, and historic landmarks.

When asked about a specific location, include:
- What makes it scenic or worth visiting
- Best time of year and time of day
- What wildlife or natural features to look for
- Any tips for parking, access, or facilities

Keep answers concise (2–4 sentences unless the user asks for more).
If a user asks about something outside Cape May County or unrelated to scenic/nature locations,
politely redirect them back to what you know.`

/**
 * Ask the Gemini assistant a question about scenic locations.
 * Returns a streaming result for real-time display.
 *
 * @param {Array<{role: 'user'|'model', parts: [{text: string}]}>} history
 * @param {string} message
 * @returns {Promise<import('@google/generative-ai').GenerateContentStreamResult>}
 */
export async function streamSceneryChat(history, message) {
  const client = getClient()
  if (!client) throw new Error('VITE_GEMINI_API_KEY is not configured')

  const model = client.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_INSTRUCTION,
  })

  const chat = model.startChat({ history })
  return chat.sendMessageStream(message)
}

/**
 * Generate a short AI-written "spotlight" blurb for a scenic location.
 * Used to enrich location detail cards with dynamic copy.
 *
 * @param {{ name: string, description: string, tags: string[], category: string }} location
 * @returns {Promise<string|null>}
 */
export async function generateLocationSpotlight(location) {
  const client = getClient()
  if (!client) return null

  const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const prompt = `Write a vivid, 2-sentence visitor spotlight for this Cape May County scenic location.
Make it evocative — highlight what makes it special to a visitor standing there.

Location: ${location.name}
Category: ${location.category}
Tags: ${location.tags.join(', ')}
Base description: ${location.description}

Return only the 2-sentence spotlight, no labels or formatting.`

  const result = await model.generateContent(prompt)
  return result.response.text().trim()
}

export const isConfigured = () => Boolean(API_KEY)
