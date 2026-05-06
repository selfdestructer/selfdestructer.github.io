import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { usePostHog } from 'posthog-js/react'
import NavBar from './components/NavBar'
import MapPage from './pages/MapPage'
import AboutPage from './pages/AboutPage'
import './App.css'

function PageviewTracker() {
  const location = useLocation()
  const posthog = usePostHog()

  useEffect(() => {
    posthog?.capture('$pageview', { $current_url: window.location.href })
  }, [location, posthog])

  return null
}

export default function App() {
  return (
    <div className="app-shell">
      <NavBar />
      <PageviewTracker />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
    </div>
  )
}
