import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateOdds, calculateBuyShares } from '@/lib/amm'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { marketId, amount, position } = body

    // Get privy user ID from cookie/header (simplified - in production use Privy server SDK)
    const privyId = request.headers.get('x-privy-user-id')
    if (!privyId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Get or create user
    let user = await prisma.user.findUnique({ where: { privyId } })
    if (!user) {
      user = await prisma.user.create({ data: { privyId } })
    }

    // Check balance
    if (user.balance < amount) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
    }

    // Get market
    const market = await prisma.market.findUnique({ where: { id: marketId } })
    if (!market) {
      return NextResponse.json({ error: 'Market not found' }, { status: 404 })
    }
    if (market.status !== 'OPEN') {
      return NextResponse.json({ error: 'Market is not open' }, { status: 400 })
    }

    // Calculate shares and new pool state
    const { sharesReceived, newYesShares, newNoShares } = calculateBuyShares(
      amount,
      position,
      market.yesShares,
      market.noShares
    )

    const odds = calculateOdds(market.yesShares, market.noShares)
    const oddsAtBet = position ? odds.yes : odds.no

    // Execute transaction
    const [bet] = await prisma.$transaction([
      prisma.bet.create({
        data: {
          userId: user.id,
          marketId,
          position,
          amount,
          shares: sharesReceived,
          oddsAtBet,
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { balance: { decrement: amount } },
      }),
      prisma.market.update({
        where: { id: marketId },
        data: {
          yesShares: newYesShares,
          noShares: newNoShares,
        },
      }),
    ])

    return NextResponse.json(bet)
  } catch (error) {
    console.error('Failed to place bet:', error)
    return NextResponse.json({ error: 'Failed to place bet' }, { status: 500 })
  }
}
