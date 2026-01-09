'use client'

import dynamic from 'next/dynamic'
import type { MarketWithOdds } from '@/types'

const Map = dynamic(() => import('./Map').then((mod) => mod.Map), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
      <div className="text-white">Loading map...</div>
    </div>
  ),
})

interface MapWrapperProps {
  markets: MarketWithOdds[]
  selectedMarket: MarketWithOdds | null
  onMarketSelect: (market: MarketWithOdds | null) => void
  userBalance: number
  onBetPlaced: () => void
}

export function MapWrapper({ markets, selectedMarket, onMarketSelect, userBalance, onBetPlaced }: MapWrapperProps) {
  return (
    <Map
      markets={markets}
      selectedMarket={selectedMarket}
      onMarketSelect={onMarketSelect}
      userBalance={userBalance}
      onBetPlaced={onBetPlaced}
    />
  )
}
