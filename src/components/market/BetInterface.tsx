'use client'

import { useState } from 'react'
import type { MarketWithOdds } from '@/types'

interface BetInterfaceProps {
  market: MarketWithOdds
  userBalance: number
  onBetPlaced: () => void
}

export function BetInterface({ market, userBalance, onBetPlaced }: BetInterfaceProps) {
  const [amount, setAmount] = useState(10)
  const [position, setPosition] = useState<'yes' | 'no'>('yes')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePlaceBet = async () => {
    if (amount <= 0 || amount > userBalance) {
      setError('Invalid bet amount')
      return
    }

    setIsLoading(true)
    setError(null)

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

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to place bet')
      }

      onBetPlaced()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to place bet')
    } finally {
      setIsLoading(false)
    }
  }

  const estimatedShares = position === 'yes'
    ? amount / market.yesOdds
    : amount / market.noOdds

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setPosition('yes')}
          className={`flex-1 py-3 rounded-lg font-bold transition-colors ${
            position === 'yes'
              ? 'bg-green-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Buy Yes
        </button>
        <button
          onClick={() => setPosition('no')}
          className={`flex-1 py-3 rounded-lg font-bold transition-colors ${
            position === 'no'
              ? 'bg-red-500 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Buy No
        </button>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">Amount</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            max={userBalance}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
          />
          <span className="text-gray-400">credits</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">Balance: {userBalance} credits</div>
      </div>

      <div className="text-sm text-gray-400">
        Est. shares: <span className="text-white">{estimatedShares.toFixed(2)}</span>
      </div>

      {error && (
        <div className="text-red-400 text-sm">{error}</div>
      )}

      <button
        onClick={handlePlaceBet}
        disabled={isLoading || amount <= 0 || amount > userBalance}
        className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-bold text-white transition-colors"
      >
        {isLoading ? 'Placing bet...' : `Place Bet`}
      </button>
    </div>
  )
}
