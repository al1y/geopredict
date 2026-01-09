import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const markets = [
  {
    title: 'China-Taiwan military conflict by 2027?',
    description: 'Will there be a direct military engagement between China and Taiwan before January 1, 2027?',
    latitude: 23.6978,
    longitude: 120.9605,
    locationName: 'Taiwan Strait',
    resolutionCriteria: 'Resolves YES if any confirmed military strikes or invasion occurs between PRC and ROC forces.',
    expiresAt: new Date('2027-01-01'),
  },
  {
    title: 'Strait of Hormuz closure in 2026?',
    description: 'Will the Strait of Hormuz be closed to commercial shipping for more than 7 consecutive days in 2026?',
    latitude: 26.5667,
    longitude: 56.2500,
    locationName: 'Strait of Hormuz',
    resolutionCriteria: 'Resolves YES if maritime authorities confirm closure for 7+ consecutive days.',
    expiresAt: new Date('2027-01-01'),
  },
  {
    title: 'US purchases Greenland by 2028?',
    description: 'Will the United States acquire sovereignty or significant territorial control over Greenland before 2028?',
    latitude: 71.7069,
    longitude: -42.6043,
    locationName: 'Greenland',
    resolutionCriteria: 'Resolves YES if any formal agreement transfers territorial control or sovereignty to the US.',
    expiresAt: new Date('2028-01-01'),
  },
  {
    title: 'Russia-Ukraine ceasefire in 2026?',
    description: 'Will there be a formal ceasefire agreement between Russia and Ukraine in 2026?',
    latitude: 48.3794,
    longitude: 31.1656,
    locationName: 'Ukraine',
    resolutionCriteria: 'Resolves YES if both parties sign a ceasefire agreement that holds for at least 30 days.',
    expiresAt: new Date('2027-01-01'),
  },
  {
    title: 'South China Sea military incident in 2026?',
    description: 'Will there be a military incident involving the US and China in the South China Sea in 2026?',
    latitude: 12.0,
    longitude: 114.0,
    locationName: 'South China Sea',
    resolutionCriteria: 'Resolves YES if any confirmed military engagement or collision occurs between US and Chinese forces.',
    expiresAt: new Date('2027-01-01'),
  },
  {
    title: 'North Korea nuclear test in 2026?',
    description: 'Will North Korea conduct a nuclear weapons test in 2026?',
    latitude: 40.3399,
    longitude: 127.5101,
    locationName: 'North Korea',
    resolutionCriteria: 'Resolves YES if seismic data or official statements confirm a nuclear test.',
    expiresAt: new Date('2027-01-01'),
  },
  {
    title: 'Israel-Iran direct conflict in 2026?',
    description: 'Will Israel and Iran engage in direct military conflict (not via proxies) in 2026?',
    latitude: 32.0853,
    longitude: 34.7818,
    locationName: 'Tel Aviv',
    resolutionCriteria: 'Resolves YES if Israeli and Iranian military forces directly engage each other.',
    expiresAt: new Date('2027-01-01'),
  },
  {
    title: 'Panama Canal control dispute escalates?',
    description: 'Will there be a significant diplomatic crisis or military posturing over Panama Canal control in 2026?',
    latitude: 9.0820,
    longitude: -79.6824,
    locationName: 'Panama Canal',
    resolutionCriteria: 'Resolves YES if major diplomatic protests, sanctions, or military deployments occur related to canal control.',
    expiresAt: new Date('2027-01-01'),
  },
]

async function main() {
  console.log('Seeding markets...')

  for (const market of markets) {
    await prisma.market.create({ data: market })
    console.log(`Created: ${market.title}`)
  }

  console.log('Done!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
