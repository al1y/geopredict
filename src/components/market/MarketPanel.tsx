'use client'

import { useState } from 'react'
import type { MarketWithOdds } from '@/types'
import { BetInterface } from './BetInterface'

interface MarketPanelProps {
  market: MarketWithOdds
  onClose: () => void
  userBalance: number
  onBetPlaced: () => void
}

export function MarketPanel({ market, onClose, userBalance, onBetPlaced }: MarketPanelProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 rounded-t-2xl shadow-2xl border-t border-gray-700 max-h-[80vh] overflow-y-auto z-50">
      <div className="sticky top-0 bg-gray-900 p-4 border-b border-gray-800 flex items-center justify-between">
        <div>
          <span className="text-xs text-gray-400">{market.locationName}</span>
          <h2 className="text-lg font-bold text-white">{market.title}</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-800 rounded-full transition-colors"
        >
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-4 space-y-4">
        <p className="text-gray-300">{market.description}</p>

        <div className="flex gap-4">
          <div className="flex-1 bg-green-500/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {Math.round(market.yesOdds * 100)}%
            </div>
            <div className="text-sm text-green-300">Yes</div>
          </div>
          <div className="flex-1 bg-red-500/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-400">
              {Math.round(market.noOdds * 100)}%
            </div>
            <div className="text-sm text-red-300">No</div>
          </div>
        </div>

        <div className="text-sm text-gray-400">
          <strong>Resolution:</strong> {market.resolutionCriteria}
        </div>

        <BetInterface
          market={market}
          userBalance={userBalance}
          onBetPlaced={onBetPlaced}
        />
      </div>
    </div>
  )
}
