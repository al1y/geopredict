'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/useAuth'
import { MapWrapper } from '@/components/map/MapWrapper'
import type { MarketWithOdds } from '@/types'

export default function Home() {
  const { ready, authenticated, login, logout } = useAuth()
  const [markets, setMarkets] = useState<MarketWithOdds[]>([])
  const [selectedMarket, setSelectedMarket] = useState<MarketWithOdds | null>(null)
  const [userBalance, setUserBalance] = useState(0)

  const fetchMarkets = useCallback(async () => {
    try {
      const res = await fetch('/api/markets')
      if (res.ok) {
        const data = await res.json()
        setMarkets(data)
      }
    } catch (e) {
      console.error('Failed to fetch markets:', e)
    }
  }, [])

  const fetchUserBalance = useCallback(async () => {
    if (!authenticated) return
    try {
      const res = await fetch('/api/user')
      if (res.ok) {
        const data = await res.json()
        setUserBalance(data.balance)
      }
    } catch (e) {
      console.error('Failed to fetch user:', e)
    }
  }, [authenticated])

  useEffect(() => {
    fetchMarkets()
  }, [fetchMarkets])

  useEffect(() => {
    if (authenticated) {
      fetchUserBalance()
    } else {
      setUserBalance(0)
    }
  }, [authenticated, fetchUserBalance])

  const handleBetPlaced = () => {
    fetchMarkets()
    fetchUserBalance()
    setSelectedMarket(null)
  }

  if (!ready) {
    return (
      <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <main className="relative w-full h-screen overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-40 p-4 flex items-center justify-between pointer-events-none">
        <h1 className="text-xl font-bold text-white drop-shadow-lg">GeoPredict</h1>
        <div className="flex items-center gap-3 pointer-events-auto">
          {authenticated && (
            <div className="bg-gray-900/80 backdrop-blur px-3 py-1.5 rounded-lg text-white text-sm">
              {userBalance} credits
            </div>
          )}
          {authenticated ? (
            <button
              onClick={logout}
              className="bg-gray-900/80 backdrop-blur hover:bg-gray-800 px-4 py-2 rounded-lg text-white text-sm transition-colors"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={login}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors"
            >
              Login
            </button>
          )}
        </div>
      </header>

      {/* Map */}
      <MapWrapper
        markets={markets}
        selectedMarket={selectedMarket}
        onMarketSelect={setSelectedMarket}
        userBalance={userBalance}
        onBetPlaced={handleBetPlaced}
      />
    </main>
  )
}
