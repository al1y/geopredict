'use client'

import { useCallback, useState } from 'react'
import MapGL, { Marker, NavigationControl, GeolocateControl } from 'react-map-gl'
import type { MapRef, ViewStateChangeEvent } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import type { MarketWithOdds } from '@/types'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

interface MapProps {
  markets: MarketWithOdds[]
  onMarketSelect: (market: MarketWithOdds) => void
}

export function Map({ markets, onMarketSelect }: MapProps) {
  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 20,
    zoom: 2,
  })

  const handleMove = useCallback((evt: ViewStateChangeEvent) => {
    setViewState(evt.viewState)
  }, [])

  return (
    <MapGL
      {...viewState}
      onMove={handleMove}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      mapboxAccessToken={MAPBOX_TOKEN}
    >
      <NavigationControl position="top-right" />
      <GeolocateControl position="top-right" />

      {markets.map((market) => (
        <Marker
          key={market.id}
          longitude={market.longitude}
          latitude={market.latitude}
          anchor="bottom"
          onClick={() => onMarketSelect(market)}
        >
          <div
            className="cursor-pointer transition-transform hover:scale-110"
            title={market.title}
          >
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-white">
                {Math.round(market.yesOdds * 100)}%
              </div>
              {viewState.zoom > 4 && (
                <div className="mt-1 px-2 py-1 bg-gray-900/90 rounded text-xs text-white max-w-[120px] truncate">
                  {market.title}
                </div>
              )}
            </div>
          </div>
        </Marker>
      ))}
    </MapGL>
  )
}
