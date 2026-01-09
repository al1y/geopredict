'use client'

import { useCallback, useState } from 'react'
import MapGL, { Marker, Popup } from 'react-map-gl'
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
          <div className="cursor-pointer transition-all duration-200 hover:scale-110">
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-2xl flex items-center justify-center
                  text-white text-xs font-bold shadow-lg
                  transition-all duration-200
                  ${selectedMarket?.id === market.id
                    ? 'bg-gradient-to-br from-blue-400 to-purple-500 scale-110 marker-glow'
                    : 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500'
                  }
                `}
                style={{
                  boxShadow: selectedMarket?.id === market.id
                    ? '0 0 30px rgba(96, 165, 250, 0.6), 0 4px 15px rgba(0,0,0,0.3)'
                    : '0 4px 15px rgba(0,0,0,0.3)',
                }}
              >
                {Math.round(market.yesOdds * 100)}%
              </div>
              {viewState.zoom > 3.5 && (
                <div className="mt-2 px-3 py-1.5 glass-dark rounded-lg text-xs text-white/90 max-w-[140px] truncate font-medium">
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
          offset={25}
          closeButton={true}
          closeOnClick={false}
          onClose={() => onMarketSelect(null)}
          maxWidth="340px"
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
    <div className="p-4 min-w-[300px]">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"></div>
        <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">
          {market.locationName}
        </span>
      </div>

      <h3 className="font-semibold text-slate-800 mb-4 leading-snug text-[15px]">
        {market.title}
      </h3>

      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setPosition('yes')}
          className={`flex-1 rounded-xl p-3 text-center transition-all duration-200 ${
            position === 'yes'
              ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-lg shadow-emerald-200'
              : 'bg-emerald-50 hover:bg-emerald-100'
          }`}
        >
          <div className={`text-2xl font-bold ${position === 'yes' ? 'text-white' : 'text-emerald-600'}`}>
            {Math.round(market.yesOdds * 100)}%
          </div>
          <div className={`text-xs font-semibold ${position === 'yes' ? 'text-emerald-100' : 'text-emerald-600'}`}>
            Yes
          </div>
        </button>
        <button
          onClick={() => setPosition('no')}
          className={`flex-1 rounded-xl p-3 text-center transition-all duration-200 ${
            position === 'no'
              ? 'bg-gradient-to-br from-rose-400 to-rose-500 text-white shadow-lg shadow-rose-200'
              : 'bg-rose-50 hover:bg-rose-100'
          }`}
        >
          <div className={`text-2xl font-bold ${position === 'no' ? 'text-white' : 'text-rose-600'}`}>
            {Math.round(market.noOdds * 100)}%
          </div>
          <div className={`text-xs font-semibold ${position === 'no' ? 'text-rose-100' : 'text-rose-600'}`}>
            No
          </div>
        </button>
      </div>

      <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">
        {market.description}
      </p>

      {userBalance > 0 ? (
        <div className="space-y-3">
          <div className="flex gap-2 items-center">
            <input
              type="number"
              min={1}
              max={userBalance}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="flex-1 px-4 py-2.5 bg-slate-100 border-0 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Amount"
            />
            <button
              onClick={handleBet}
              disabled={isLoading || amount <= 0}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-200"
            >
              {isLoading ? '...' : 'Bet'}
            </button>
          </div>
          <div className="text-xs text-slate-400 font-medium">
            Balance: <span className="text-blue-500">{userBalance}</span> credits
          </div>
        </div>
      ) : (
        <div className="text-sm text-slate-400 text-center py-3 bg-slate-50 rounded-xl font-medium">
          Login to place bets
        </div>
      )}
    </div>
  )
}
