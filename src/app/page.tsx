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
      <div className="w-full h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white/60 text-lg tracking-wide">Loading...</div>
      </div>
    )
  }

  return (
    <main className="relative w-full h-screen overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-40 p-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <h1 className="text-xl font-semibold text-white tracking-tight">
            Geo<span className="text-blue-400">Predict</span>
          </h1>
        </div>
        <div className="flex items-center gap-3 pointer-events-auto">
          {authenticated && (
            <div className="glass-dark px-4 py-2 rounded-xl text-white/90 text-sm font-medium">
              <span className="text-blue-400">{userBalance}</span> credits
            </div>
          )}
          {authenticated ? (
            <button
              onClick={logout}
              className="btn-glass px-4 py-2 rounded-xl text-white/90 text-sm font-medium"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={login}
              className="btn-primary-glass px-5 py-2 rounded-xl text-white text-sm font-semibold"
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
