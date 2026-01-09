import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateOdds } from '@/lib/amm'

// Demo markets when database is not available
const DEMO_MARKETS = [
  {
    id: 'demo-1',
    title: 'China-Taiwan military conflict by 2027?',
    description: 'Will there be a direct military engagement between China and Taiwan before January 1, 2027?',
    latitude: 23.6978,
    longitude: 120.9605,
    locationName: 'Taiwan Strait',
    status: 'OPEN',
    resolutionCriteria: 'Resolves YES if any confirmed military strikes or invasion occurs.',
    yesShares: 100,
    noShares: 100,
    yesOdds: 0.5,
    noOdds: 0.5,
  },
  {
    id: 'demo-2',
    title: 'Strait of Hormuz closure in 2026?',
    description: 'Will the Strait of Hormuz be closed to commercial shipping for more than 7 consecutive days in 2026?',
    latitude: 26.5667,
    longitude: 56.25,
    locationName: 'Strait of Hormuz',
    status: 'OPEN',
    resolutionCriteria: 'Resolves YES if maritime authorities confirm closure for 7+ consecutive days.',
    yesShares: 120,
    noShares: 80,
    yesOdds: 0.4,
    noOdds: 0.6,
  },
  {
    id: 'demo-3',
    title: 'US purchases Greenland by 2028?',
    description: 'Will the United States acquire sovereignty or significant territorial control over Greenland before 2028?',
    latitude: 71.7069,
    longitude: -42.6043,
    locationName: 'Greenland',
    status: 'OPEN',
    resolutionCriteria: 'Resolves YES if any formal agreement transfers territorial control.',
    yesShares: 150,
    noShares: 50,
    yesOdds: 0.25,
    noOdds: 0.75,
  },
]

export async function GET() {
  try {
    const markets = await prisma.market.findMany({
      where: { status: 'OPEN' },
      orderBy: { createdAt: 'desc' },
    })

    const marketsWithOdds = markets.map((market) => {
      const odds = calculateOdds(market.yesShares, market.noShares)
      return {
        ...market,
        yesOdds: odds.yes,
        noOdds: odds.no,
      }
    })

    return NextResponse.json(marketsWithOdds)
  } catch (error) {
    console.error('Database unavailable, returning demo markets')
    // Return demo markets when database is not available
    return NextResponse.json(DEMO_MARKETS)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, latitude, longitude, locationName, resolutionCriteria, expiresAt } = body

    const market = await prisma.market.create({
      data: {
        title,
        description,
        latitude,
        longitude,
        locationName,
        resolutionCriteria,
        expiresAt: new Date(expiresAt),
      },
    })

    return NextResponse.json(market)
  } catch (error) {
    console.error('Failed to create market:', error)
    return NextResponse.json({ error: 'Failed to create market' }, { status: 500 })
  }
}
