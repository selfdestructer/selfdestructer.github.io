import { useState, useCallback } from 'react'
import { usePostHog } from 'posthog-js/react'
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  Pin,
} from '@vis.gl/react-google-maps'
import {
  SCENIC_LOCATIONS,
  CATEGORIES,
  COUNTY_CENTER,
  DEFAULT_ZOOM,
} from '../data/scenicLocations'
import { COASTAL_MAP_STYLE } from '../data/mapStyle'
import AiAssistant from '../components/AiAssistant'
import './MapPage.css'

const CATEGORY_COLORS = {
  beach: '#f4a261',
  wildlife: '#52b788',
  park: '#40916c',
  landmark: '#e76f51',
  'nature-center': '#457b9d',
}

export default function MapPage() {
  const posthog = usePostHog()
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [mapType, setMapType] = useState('roadmap')

  const filteredLocations =
    activeCategory === 'all'
      ? SCENIC_LOCATIONS
      : SCENIC_LOCATIONS.filter((loc) => loc.category === activeCategory)

  const handleCategoryChange = useCallback(
    (categoryId) => {
      setActiveCategory(categoryId)
      setSelectedLocation(null)
      posthog?.capture('category_filter_changed', { category: categoryId })
    },
    [posthog],
  )

  const handleMarkerClick = useCallback(
    (location) => {
      setSelectedLocation(location)
      posthog?.capture('location_selected', {
        location_id: location.id,
        location_name: location.name,
        category: location.category,
      })
    },
    [posthog],
  )

  const handleMapTypeChange = useCallback(
    (type) => {
      setMapType(type)
      posthog?.capture('map_type_changed', { map_type: type })
    },
    [posthog],
  )

  // When the AI mentions a location name, highlight it on the map
  const handleLocationMention = useCallback(
    (responseText) => {
      const mentioned = SCENIC_LOCATIONS.find((loc) =>
        responseText.toLowerCase().includes(loc.name.toLowerCase()),
      )
      if (mentioned && mentioned.id !== selectedLocation?.id) {
        setSelectedLocation(mentioned)
      }
    },
    [selectedLocation],
  )

  const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  // Custom Map ID created in Google Cloud Console → Maps Platform → Map Management
  // Required for AdvancedMarker and cloud-based custom styling.
  // Falls back to inline COASTAL_MAP_STYLE when not set (development).
  const mapId = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || undefined

  if (!mapsApiKey) {
    return (
      <div className="map-page map-page--no-key">
        <div className="no-key-card">
          <span className="no-key-icon">🗺️</span>
          <h2>Google Maps API Key Required</h2>
          <p>
            Add <code>VITE_GOOGLE_MAPS_API_KEY</code> to your{' '}
            <code>.env.local</code> file to enable the map.
          </p>
          <pre>{`VITE_GOOGLE_MAPS_API_KEY=your_key_here`}</pre>
        </div>
      </div>
    )
  }

  return (
    <div className="map-page">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>Scenic Spots</h1>
          <p className="sidebar-subtitle">
            {filteredLocations.length} location
            {filteredLocations.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="category-filters">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`category-btn${activeCategory === cat.id ? ' active' : ''}`}
              onClick={() => handleCategoryChange(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <ul className="location-list">
          {filteredLocations.map((loc) => (
            <li
              key={loc.id}
              className={`location-item${selectedLocation?.id === loc.id ? ' selected' : ''}`}
              onClick={() => handleMarkerClick(loc)}
            >
              <span
                className="location-dot"
                style={{ background: CATEGORY_COLORS[loc.category] }}
              />
              <div className="location-text">
                <strong>{loc.name}</strong>
                <span className="location-tags">
                  {loc.tags.slice(0, 3).join(' · ')}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      <div className="map-container">
        <div className="map-type-switcher">
          {['roadmap', 'satellite', 'hybrid', 'terrain'].map((type) => (
            <button
              key={type}
              className={`map-type-btn${mapType === type ? ' active' : ''}`}
              onClick={() => handleMapTypeChange(type)}
              title={
                type === 'roadmap' && mapId
                  ? 'Custom Cape May style'
                  : type === 'roadmap'
                    ? 'Coastal style (set Map ID for custom cloud style)'
                    : undefined
              }
            >
              {type === 'roadmap' ? (mapId ? '🗺 Custom' : '🗺 Styled') : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <APIProvider apiKey={mapsApiKey}>
          <Map
            mapId={mapId}
            defaultCenter={COUNTY_CENTER}
            defaultZoom={DEFAULT_ZOOM}
            mapTypeId={mapType}
            gestureHandling="greedy"
            disableDefaultUI={false}
            // Inline style fallback when no cloud Map ID is set.
            // Note: styles are ignored when mapId is set (cloud styling takes over).
            styles={mapId ? undefined : mapType === 'roadmap' ? COASTAL_MAP_STYLE : undefined}
            style={{ width: '100%', height: '100%' }}
          >
            {filteredLocations.map((loc) => (
              <AdvancedMarker
                key={loc.id}
                position={{ lat: loc.lat, lng: loc.lng }}
                onClick={() => handleMarkerClick(loc)}
                title={loc.name}
              >
                <Pin
                  background={CATEGORY_COLORS[loc.category]}
                  borderColor={
                    selectedLocation?.id === loc.id ? '#fff' : 'transparent'
                  }
                  glyphColor="#fff"
                  scale={selectedLocation?.id === loc.id ? 1.3 : 1}
                />
              </AdvancedMarker>
            ))}

            {selectedLocation && (
              <InfoWindow
                position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                onCloseClick={() => setSelectedLocation(null)}
                pixelOffset={[0, -40]}
              >
                <div className="info-window">
                  <h3>{selectedLocation.name}</h3>
                  <p>{selectedLocation.description}</p>
                  <div className="info-window-tags">
                    {selectedLocation.tags.map((tag) => (
                      <span key={tag} className="info-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>

        <AiAssistant onLocationMention={handleLocationMention} />
      </div>
    </div>
  )
}
