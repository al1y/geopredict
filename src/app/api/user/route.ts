import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const privyId = request.headers.get('x-privy-user-id')
    if (!privyId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    let user = await prisma.user.findUnique({ where: { privyId } })
    if (!user) {
      user = await prisma.user.create({ data: { privyId } })
    }

    return NextResponse.json({ balance: user.balance })
  } catch (error) {
    console.error('Failed to fetch user:', error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}
