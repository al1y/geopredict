// Map abstraction layer
// Swap providers by changing MAP_PROVIDER env var or this default

export * from './types'

import type { MapProviderType } from './types'

export const MAP_PROVIDER: MapProviderType =
  (process.env.NEXT_PUBLIC_MAP_PROVIDER as MapProviderType) || 'mapbox'
