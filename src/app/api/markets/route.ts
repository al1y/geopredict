import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateOdds } from '@/lib/amm'

// Demo markets from Polymarket geopolitics with location data
const DEMO_MARKETS = [
  {
    id: 'pm-taiwan',
    title: 'Will China invade Taiwan by end of 2026?',
    description: 'This market will resolve to "Yes" if China commences a military offensive intended to establish control over any portion of the Republic of China (Taiwan) by December 31, 2026.',
    latitude: 23.6978,
    longitude: 120.9605,
    locationName: 'Taiwan',
    status: 'OPEN',
    resolutionCriteria: 'Official confirmation by China, Taiwan, UN, or any permanent UN Security Council member.',
    imageUrl: 'https://polymarket-upload.s3.us-east-2.amazonaws.com/china-invades-taiwan-in-2025-CCSd9dX2mrea.jpg',
    yesShares: 87.5,
    noShares: 12.5,
    yesOdds: 0.125,
    noOdds: 0.875,
  },
  {
    id: 'pm-ukraine-ceasefire',
    title: 'Russia x Ukraine ceasefire by end of 2026?',
    description: 'Will there be an official ceasefire agreement between Russia and Ukraine by December 31, 2026? Only general pauses in conflict qualify.',
    latitude: 48.3794,
    longitude: 31.1656,
    locationName: 'Ukraine',
    status: 'OPEN',
    resolutionCriteria: 'Official announcements from Russia and Ukraine or credible media consensus.',
    imageUrl: 'https://polymarket-upload.s3.us-east-2.amazonaws.com/russia-x-ukraine-ceasefire-in-2025-w2voYOygx80B.jpg',
    yesShares: 55.5,
    noShares: 44.5,
    yesOdds: 0.445,
    noOdds: 0.555,
  },
  {
    id: 'pm-iran-israel',
    title: 'Israel x Iran ceasefire broken by March 2026?',
    description: 'Will Israel or Iran initiate a drone, missile, or air strike on the other\'s soil by March 31, 2026?',
    latitude: 32.0853,
    longitude: 34.7818,
    locationName: 'Israel',
    status: 'OPEN',
    resolutionCriteria: 'Consensus of credible reporting on strikes.',
    imageUrl: 'https://polymarket-upload.s3.us-east-2.amazonaws.com/israel-x-iran-ceasefire-broken-by--OrvBXFZfRmz.jpg',
    yesShares: 48,
    noShares: 52,
    yesOdds: 0.52,
    noOdds: 0.48,
  },
  {
    id: 'pm-china-india',
    title: 'China x India military clash by December 2026?',
    description: 'Will there be a military encounter between Chinese and Indian forces by December 31, 2026?',
    latitude: 34.5553,
    longitude: 77.5371,
    locationName: 'Galwan Valley',
    status: 'OPEN',
    resolutionCriteria: 'Consensus of credible reporting.',
    imageUrl: 'https://polymarket-upload.s3.us-east-2.amazonaws.com/china-x-india-military-clash-by-december-31-eggJM4CWN6Un.jpg',
    yesShares: 86.5,
    noShares: 13.5,
    yesOdds: 0.135,
    noOdds: 0.865,
  },
  {
    id: 'pm-xi-jinping',
    title: 'Xi Jinping out before 2027?',
    description: 'Will Xi Jinping be removed from power as General Secretary of the Communist Party before December 31, 2026?',
    latitude: 39.9042,
    longitude: 116.4074,
    locationName: 'Beijing',
    status: 'OPEN',
    resolutionCriteria: 'Consensus of credible reporting.',
    imageUrl: 'https://polymarket-upload.s3.us-east-2.amazonaws.com/xi-jinping-out-in-2025-EjF4SM20eaa3.jpg',
    yesShares: 93.5,
    noShares: 6.5,
    yesOdds: 0.065,
    noOdds: 0.935,
  },
  {
    id: 'pm-putin',
    title: 'Putin out as President of Russia by end of 2026?',
    description: 'Will Vladimir Putin be removed from power as President of Russia by December 31, 2026?',
    latitude: 55.7558,
    longitude: 37.6173,
    locationName: 'Moscow',
    status: 'OPEN',
    resolutionCriteria: 'Consensus of credible reporting.',
    imageUrl: 'https://polymarket-upload.s3.us-east-2.amazonaws.com/putin-out-as-president-of-russia-in-2025-nWuurkC8qfbi.jpg',
    yesShares: 90.5,
    noShares: 9.5,
    yesOdds: 0.095,
    noOdds: 0.905,
  },
  {
    id: 'pm-nato-leave',
    title: 'Will any country leave NATO by June 2026?',
    description: 'Will any member state formally withdraw from NATO or provide notice of denunciation by June 30, 2026?',
    latitude: 50.8503,
    longitude: 4.3517,
    locationName: 'Brussels (NATO HQ)',
    status: 'OPEN',
    resolutionCriteria: 'Official information from government and NATO.',
    imageUrl: 'https://polymarket-upload.s3.us-east-2.amazonaws.com/will-any-country-leave-nato-in-2025-d6BB5x1Nv0DA.jpg',
    yesShares: 94.95,
    noShares: 5.05,
    yesOdds: 0.0505,
    noOdds: 0.9495,
  },
  {
    id: 'pm-syria-israel',
    title: 'Israel and Syria normalize relations by June 2026?',
    description: 'Will both Israel and Syria officially announce diplomatic relations by June 30, 2026?',
    latitude: 33.5138,
    longitude: 36.2765,
    locationName: 'Damascus',
    status: 'OPEN',
    resolutionCriteria: 'Official information from Israel and Syria.',
    imageUrl: 'https://polymarket-upload.s3.us-east-2.amazonaws.com/israel-and-syria-normalize-relations-in-2025-cTktGZLyjnB_.jpg',
    yesShares: 83.5,
    noShares: 16.5,
    yesOdds: 0.165,
    noOdds: 0.835,
  },
  {
    id: 'pm-somaliland',
    title: 'US recognize Somaliland by June 2026?',
    description: 'Will the U.S. government formally recognize Somaliland as an independent state by June 30, 2026?',
    latitude: 9.56,
    longitude: 44.065,
    locationName: 'Hargeisa, Somaliland',
    status: 'OPEN',
    resolutionCriteria: 'Official information from U.S. government.',
    imageUrl: 'https://polymarket-upload.s3.us-east-2.amazonaws.com/us-recognize-somaliland-in-2025-737-DuhSKvX-Zcud.jpg',
    yesShares: 77.5,
    noShares: 22.5,
    yesOdds: 0.225,
    noOdds: 0.775,
  },
  {
    id: 'pm-kostyantynivka',
    title: 'Will Russia capture Kostyantynivka by March 2026?',
    description: 'Will Russia capture the Kostyantynivka railroad station according to the ISW map by March 31, 2026?',
    latitude: 48.5231,
    longitude: 37.7072,
    locationName: 'Kostyantynivka, Ukraine',
    status: 'OPEN',
    resolutionCriteria: 'ISW Ukraine map shows train station shaded red.',
    imageUrl: 'https://polymarket-upload.s3.us-east-2.amazonaws.com/will-russia-capture-kostyantynivka-by-38lHU3PVeM7C.jpg',
    yesShares: 22.5,
    noShares: 77.5,
    yesOdds: 0.775,
    noOdds: 0.225,
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
