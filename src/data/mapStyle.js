/**
 * Custom map style for Cape May County, NJ — "Coastal Natural" theme.
 *
 * Applied when VITE_GOOGLE_MAPS_MAP_ID is not set (inline fallback).
 * For production, create a Cloud-based Map Style in the Google Cloud Console:
 *   Maps Platform → Map Styles → Create Style → paste these values or use the visual editor
 * Then create a Map ID and set VITE_GOOGLE_MAPS_MAP_ID in your environment.
 *
 * Design intent:
 *   - Warm sandy/off-white land
 *   - Deep coastal blue water (matches --ocean brand token)
 *   - Muted green for parks and nature areas
 *   - Minimal road network — scenic, not navigational
 *   - No POI clutter (businesses, transit icons hidden)
 *   - Clear labels for natural features, water bodies, parks
 */
export const COASTAL_MAP_STYLE = [
  // Base land color — warm sand
  { elementType: 'geometry', stylers: [{ color: '#f5f0e8' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#4b5563' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f5efe0' }] },

  // Water — ocean/bay blue matching brand --ocean
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#1a6fa8' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#a8d4f0' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#0b2e54' }],
  },

  // Parks and nature — muted marsh green
  {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [{ color: '#b7e4c7' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#9ccea8' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#2d6a4f' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#e8f5ed' }],
  },

  // Natural features (beaches, wetlands)
  {
    featureType: 'landscape.natural',
    elementType: 'geometry',
    stylers: [{ color: '#ede8d8' }],
  },
  {
    featureType: 'landscape.natural.terrain',
    elementType: 'geometry',
    stylers: [{ color: '#e0dcc8' }],
  },

  // Roads — very minimal, warm gray
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#ded6c0' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#cec5aa' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#7a6f5e' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{ color: '#d4c8aa' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#c8b88a' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#b8a87a' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b5e40' }],
  },
  {
    featureType: 'road.local',
    elementType: 'labels',
    stylers: [{ visibility: 'simplified' }],
  },

  // Hide commercial POI clutter
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.business',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.medical',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.school',
    stylers: [{ visibility: 'off' }],
  },

  // Keep attractions and government visible (lighthouses etc. fall here)
  {
    featureType: 'poi.attraction',
    stylers: [{ visibility: 'simplified' }],
  },
  {
    featureType: 'poi.government',
    stylers: [{ visibility: 'simplified' }],
  },

  // Transit — hide
  {
    featureType: 'transit',
    stylers: [{ visibility: 'off' }],
  },

  // Administrative boundaries — soft sand stroke
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#c8b890' }],
  },
  {
    featureType: 'administrative.land_parcel',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'administrative.neighborhood',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9a8c70' }],
  },
]
