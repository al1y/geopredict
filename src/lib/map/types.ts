// Map abstraction layer types - allows swapping map providers

export interface MapViewState {
  longitude: number
  latitude: number
  zoom: number
}

export interface MapMarker {
  id: string
  longitude: number
  latitude: number
  label?: string
  data?: unknown
}

export interface MapProviderProps {
  viewState: MapViewState
  onViewStateChange: (viewState: MapViewState) => void
  markers: MapMarker[]
  onMarkerClick?: (marker: MapMarker) => void
  children?: React.ReactNode
}

// Supported map providers
export type MapProviderType = 'mapbox' | 'leaflet' | 'google'
