export type MarketStatus = 'OPEN' | 'CLOSED' | 'RESOLVED'

export interface Market {
  id: string
  title: string
  description: string
  imageUrl: string | null
  latitude: number
  longitude: number
  locationName: string
  status: MarketStatus
  resolutionCriteria: string
  resolvedAt: Date | null
  outcome: boolean | null
  yesShares: number
  noShares: number
  createdAt: Date
  expiresAt: Date
}

export interface MarketWithOdds extends Market {
  yesOdds: number
  noOdds: number
}

export interface User {
  id: string
  privyId: string
  balance: number
  createdAt: Date
}

export interface Bet {
  id: string
  userId: string
  marketId: string
  position: boolean
  amount: number
  shares: number
  oddsAtBet: number
  createdAt: Date
}
