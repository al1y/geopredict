import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateOdds } from '@/lib/amm'

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
    console.error('Failed to fetch markets:', error)
    return NextResponse.json({ error: 'Failed to fetch markets' }, { status: 500 })
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
