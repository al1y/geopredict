'use client'

import { useCallback, useState } from 'react'
import MapGL, { Marker, Popup, NavigationControl, GeolocateControl } from 'react-map-gl'
import type { ViewStateChangeEvent } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import type { MarketWithOdds } from '@/types'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

interface MapProps {
  markets: MarketWithOdds[]
  selectedMarket: MarketWithOdds | null
  onMarketSelect: (market: MarketWithOdds | null) => void
  userBalance: number
  onBetPlaced: () => void
}

export function Map({ markets, selectedMarket, onMarketSelect, userBalance, onBetPlaced }: MapProps) {
  const [viewState, setViewState] = useState({
    longitude: 40,
    latitude: 30,
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
      onClick={() => onMarketSelect(null)}
    >
      {/* Navigation controls hidden for cleaner UI */}

      {markets.map((market) => (
        <Marker
          key={market.id}
          longitude={market.longitude}
          latitude={market.latitude}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation()
            onMarketSelect(market)
          }}
        >
          <div
            className="cursor-pointer transition-transform hover:scale-110"
            title={market.title}
          >
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 ${
                selectedMarket?.id === market.id ? 'bg-blue-400 border-blue-300 scale-125' : 'bg-blue-500 border-white'
              }`}>
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

      {selectedMarket && (
        <Popup
          longitude={selectedMarket.longitude}
          latitude={selectedMarket.latitude}
          anchor="left"
          offset={20}
          closeButton={true}
          closeOnClick={false}
          onClose={() => onMarketSelect(null)}
          className="market-popup"
          maxWidth="320px"
        >
          <MarketPopup
            market={selectedMarket}
            userBalance={userBalance}
            onBetPlaced={onBetPlaced}
          />
        </Popup>
      )}
    </MapGL>
  )
}

function MarketPopup({
  market,
  userBalance,
  onBetPlaced
}: {
  market: MarketWithOdds
  userBalance: number
  onBetPlaced: () => void
}) {
  const [amount, setAmount] = useState(10)
  const [position, setPosition] = useState<'yes' | 'no'>('yes')
  const [isLoading, setIsLoading] = useState(false)

  const handleBet = async () => {
    if (amount <= 0 || amount > userBalance) return
    setIsLoading(true)
    try {
      const res = await fetch('/api/bets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          marketId: market.id,
          amount,
          position: position === 'yes',
        }),
      })
      if (res.ok) onBetPlaced()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-1 min-w-[280px]">
      <div className="text-xs text-gray-500 mb-1">{market.locationName}</div>
      <h3 className="font-semibold text-sm text-gray-900 mb-2 leading-tight">{market.title}</h3>

      <div className="flex gap-2 mb-3">
        <div className="flex-1 bg-green-100 rounded p-2 text-center">
          <div className="text-lg font-bold text-green-600">{Math.round(market.yesOdds * 100)}%</div>
          <div className="text-xs text-green-700">Yes</div>
        </div>
        <div className="flex-1 bg-red-100 rounded p-2 text-center">
          <div className="text-lg font-bold text-red-600">{Math.round(market.noOdds * 100)}%</div>
          <div className="text-xs text-red-700">No</div>
        </div>
      </div>

      <p className="text-xs text-gray-600 mb-3 line-clamp-2">{market.description}</p>

      {userBalance > 0 ? (
        <div className="space-y-2">
          <div className="flex gap-1">
            <button
              onClick={() => setPosition('yes')}
              className={`flex-1 py-1.5 rounded text-xs font-semibold transition ${
                position === 'yes' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Yes
            </button>
            <button
              onClick={() => setPosition('no')}
              className={`flex-1 py-1.5 rounded text-xs font-semibold transition ${
                position === 'no' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              No
            </button>
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              min={1}
              max={userBalance}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="flex-1 px-2 py-1 border rounded text-sm"
            />
            <button
              onClick={handleBet}
              disabled={isLoading || amount <= 0}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm font-medium disabled:bg-gray-300"
            >
              {isLoading ? '...' : 'Bet'}
            </button>
          </div>
          <div className="text-xs text-gray-400">Balance: {userBalance} credits</div>
        </div>
      ) : (
        <div className="text-xs text-gray-500 text-center py-2">
          Login to place bets
        </div>
      )}
    </div>
  )
}
