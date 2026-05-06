import { useState, useRef, useEffect, useCallback } from 'react'
import { usePostHog } from 'posthog-js/react'
import { streamSceneryChat, isConfigured as geminiConfigured } from '../services/gemini'
import { searchLocations, isConfigured as vertexConfigured } from '../services/vertexSearch'
import './AiAssistant.css'

const SUGGESTED_PROMPTS = [
  'Best spot to watch the sunset?',
  'Where can I see migrating birds?',
  'Hidden beach that\'s not crowded?',
  'Good lighthouse to visit with kids?',
  'Where do herons and egrets nest?',
]

/**
 * AiAssistant — a slide-in chat panel powered by Gemini 2.0 Flash.
 * Optionally augments answers with Vertex AI Search results when configured.
 *
 * @param {{ onLocationMention: (name: string) => void }} props
 */
export default function AiAssistant({ onLocationMention }) {
  const posthog = usePostHog()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'model',
      parts: [
        {
          text: "Hey! I'm your Cape May County scenic guide. Ask me about beaches, birding hotspots, lighthouses, or anything you'd like to explore. 🌊",
        },
      ],
    },
  ])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [useVertex, setUseVertex] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  const hasGemini = geminiConfigured()
  const hasVertex = vertexConfigured()

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [isOpen])

  const handleOpen = useCallback(() => {
    setIsOpen(true)
    posthog?.capture('ai_assistant_opened')
  }, [posthog])

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim() || isStreaming || !hasGemini) return

      const userMessage = { role: 'user', parts: [{ text }] }
      const history = messages.slice(1) // exclude greeting from history
      setMessages((prev) => [...prev, userMessage])
      setInput('')
      setIsStreaming(true)

      posthog?.capture('ai_query_sent', {
        query: text,
        uses_vertex: useVertex && hasVertex,
      })

      try {
        // Optional: augment with Vertex AI Search results
        let augmentedText = text
        if (useVertex && hasVertex) {
          try {
            const { results, summary } = await searchLocations(text, {
              pageSize: 3,
              summaryResultCount: 3,
            })
            if (summary || results.length > 0) {
              const context = summary
                ? `[Search context: ${summary}]`
                : `[Found locations: ${results.map((r) => r.title).join(', ')}]`
              augmentedText = `${text}\n\n${context}`
            }
          } catch {
            // Vertex Search failed — fall through to plain Gemini
          }
        }

        // Add empty model message that will be filled by streaming
        setMessages((prev) => [
          ...prev,
          { role: 'model', parts: [{ text: '' }] },
        ])

        const streamResult = await streamSceneryChat(history, augmentedText)
        let fullText = ''

        for await (const chunk of streamResult.stream) {
          const chunkText = chunk.text()
          fullText += chunkText
          setMessages((prev) => {
            const updated = [...prev]
            updated[updated.length - 1] = {
              role: 'model',
              parts: [{ text: fullText }],
            }
            return updated
          })

          // Check if the model mentions a known location
          if (onLocationMention) {
            onLocationMention(fullText)
          }
        }

        posthog?.capture('ai_query_answered', {
          query: text,
          response_length: fullText.length,
        })
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'model',
            parts: [
              {
                text: `Sorry, I ran into an error: ${err.message}. Check that your Gemini API key is configured.`,
              },
            ],
          },
        ])
      } finally {
        setIsStreaming(false)
      }
    },
    [messages, isStreaming, hasGemini, hasVertex, useVertex, posthog, onLocationMention],
  )

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      sendMessage(input)
    },
    [input, sendMessage],
  )

  return (
    <>
      {/* Floating trigger button */}
      <button
        className={`ai-fab${isOpen ? ' ai-fab--open' : ''}`}
        onClick={isOpen ? handleClose : handleOpen}
        aria-label={isOpen ? 'Close AI assistant' : 'Open AI scenic guide'}
        title={hasGemini ? 'Ask your scenic guide' : 'AI guide (needs VITE_GEMINI_API_KEY)'}
      >
        {isOpen ? '✕' : '✨'}
      </button>

      {/* Chat panel */}
      <div className={`ai-panel${isOpen ? ' ai-panel--open' : ''}`} role="dialog" aria-label="AI Scenic Guide">
        <div className="ai-panel-header">
          <span className="ai-panel-title">
            <span className="ai-panel-icon">✨</span>
            Scenic Guide
          </span>
          <div className="ai-panel-controls">
            {hasVertex && (
              <label className="vertex-toggle" title="Augment with Vertex AI Search">
                <input
                  type="checkbox"
                  checked={useVertex}
                  onChange={(e) => setUseVertex(e.target.checked)}
                />
                <span>Vertex Search</span>
              </label>
            )}
            <button className="ai-close-btn" onClick={handleClose} aria-label="Close">✕</button>
          </div>
        </div>

        <div className="ai-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`ai-message ai-message--${msg.role}`}>
              <div className="ai-bubble">{msg.parts[0].text}</div>
            </div>
          ))}
          {isStreaming && messages[messages.length - 1]?.parts[0]?.text === '' && (
            <div className="ai-message ai-message--model">
              <div className="ai-bubble ai-bubble--typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggested prompts (show only when fresh) */}
        {messages.length <= 1 && (
          <div className="ai-suggestions">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                className="ai-suggestion"
                onClick={() => sendMessage(prompt)}
                disabled={isStreaming || !hasGemini}
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        <form className="ai-input-row" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            className="ai-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              hasGemini
                ? 'Ask about scenic spots…'
                : 'Add VITE_GEMINI_API_KEY to enable'
            }
            disabled={isStreaming || !hasGemini}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage(input)
              }
            }}
          />
          <button
            type="submit"
            className="ai-send-btn"
            disabled={!input.trim() || isStreaming || !hasGemini}
            aria-label="Send"
          >
            ↑
          </button>
        </form>

        <p className="ai-footer">
          Powered by Gemini 2.0 Flash
          {hasVertex && useVertex && ' · Vertex AI Search'}
        </p>
      </div>
    </>
  )
}
