/**
 * Curated scenic locations across Cape May County, NJ.
 * Coordinates are (lat, lng).
 */
export const SCENIC_LOCATIONS = [
  {
    id: 'cape-may-lighthouse',
    name: 'Cape May Lighthouse',
    category: 'landmark',
    lat: 38.93218,
    lng: -74.96018,
    description:
      'Iconic 1859 lighthouse at the tip of the Cape May peninsula. Climb 199 steps for panoramic views of the Delaware Bay and Atlantic Ocean.',
    tags: ['lighthouse', 'historic', 'ocean views', 'climb'],
  },
  {
    id: 'sunset-beach',
    name: 'Sunset Beach',
    category: 'beach',
    lat: 38.93531,
    lng: -74.96545,
    description:
      'Famous for its daily flag-lowering ceremony and Cape May Diamonds — quartz crystals washed ashore from the Delaware River.',
    tags: ['sunset', 'beach', 'cape may diamonds', 'ceremony'],
  },
  {
    id: 'higbee-beach-wma',
    name: 'Higbee Beach Wildlife Management Area',
    category: 'wildlife',
    lat: 38.94872,
    lng: -74.96497,
    description:
      'Premier birding spot during fall migration. Wooded dunes host thousands of songbirds. Also a popular beach on Delaware Bay.',
    tags: ['birding', 'migration', 'beach', 'dunes', 'wildlife'],
  },
  {
    id: 'cape-may-point-state-park',
    name: 'Cape May Point State Park',
    category: 'park',
    lat: 38.93491,
    lng: -74.95879,
    description:
      'Coastal trails through freshwater ponds, hawk watch platform, and beach access. World-renowned raptor migration in fall.',
    tags: ['birding', 'raptors', 'trails', 'hawk watch', 'state park'],
  },
  {
    id: 'stone-harbor-bird-sanctuary',
    name: 'Stone Harbor Bird Sanctuary',
    category: 'wildlife',
    lat: 39.04946,
    lng: -74.76241,
    description:
      'Seven-acre heronry in the middle of Stone Harbor borough. Great Blue Herons, Snowy Egrets, and Night-Herons nest here every summer.',
    tags: ['herons', 'egrets', 'heronry', 'nesting', 'wildlife'],
  },
  {
    id: 'wetlands-institute',
    name: 'The Wetlands Institute',
    category: 'nature-center',
    lat: 39.06081,
    lng: -74.77024,
    description:
      'Research and education center surrounded by over 6,000 acres of pristine salt marsh. Tower overlook with sweeping marsh views.',
    tags: ['salt marsh', 'education', 'terrapin', 'tower', 'eco'],
  },
  {
    id: 'two-mile-landing',
    name: 'Two Mile Beach Unit (USFWS)',
    category: 'wildlife',
    lat: 39.01378,
    lng: -74.80254,
    description:
      'Part of the Cape May National Wildlife Refuge. Undeveloped barrier island beach and dune habitat protecting shorebird nesting areas.',
    tags: ['shorebirds', 'nesting', 'wildlife refuge', 'dunes', 'beach'],
  },
  {
    id: 'avalon-dunes',
    name: 'Avalon Dune Trail',
    category: 'park',
    lat: 39.09441,
    lng: -74.71357,
    description:
      'Boardwalk trail through restored coastal dunes in Avalon. Great for observing native dune plants and ocean vistas.',
    tags: ['dunes', 'boardwalk', 'ocean views', 'native plants'],
  },
  {
    id: 'hereford-inlet-lighthouse',
    name: 'Hereford Inlet Lighthouse',
    category: 'landmark',
    lat: 39.00384,
    lng: -74.79598,
    description:
      '1874 Victorian lighthouse surrounded by lush Victorian gardens. Located at the Hereford Inlet in North Wildwood.',
    tags: ['lighthouse', 'gardens', 'victorian', 'historic'],
  },
  {
    id: 'nummy-island',
    name: "Nummy Island",
    category: 'wildlife',
    lat: 39.04617,
    lng: -74.77701,
    description:
      'Tidal marsh island off Stone Harbor accessible by foot. Exceptional shorebird and wading bird habitat with open bay views.',
    tags: ['shorebirds', 'marsh', 'bay views', 'birding'],
  },
  {
    id: 'cape-may-beach',
    name: 'Cape May Beach (Beach Ave)',
    category: 'beach',
    lat: 38.93159,
    lng: -74.92388,
    description:
      'Victorian-era beachfront along one of America\'s oldest seaside resorts. Historic architecture lines the promenade.',
    tags: ['beach', 'victorian', 'promenade', 'historic', 'swimming'],
  },
  {
    id: 'cold-spring-village',
    name: 'Historic Cold Spring Village',
    category: 'landmark',
    lat: 38.97262,
    lng: -74.89571,
    description:
      'Living history museum with 30 restored 19th-century buildings set on a wooded 22-acre site.',
    tags: ['historic', 'museum', 'village', '19th century'],
  },
]

export const CATEGORIES = [
  { id: 'all', label: 'All Locations' },
  { id: 'beach', label: '🏖 Beaches' },
  { id: 'wildlife', label: '🐦 Wildlife' },
  { id: 'park', label: '🌿 Parks' },
  { id: 'landmark', label: '🏛 Landmarks' },
  { id: 'nature-center', label: '🔭 Nature Centers' },
]

// Cape May County map center
export const COUNTY_CENTER = { lat: 39.01, lng: -74.84 }
export const DEFAULT_ZOOM = 11
