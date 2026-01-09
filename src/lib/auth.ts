import { prisma } from './prisma'

export async function getOrCreateUser(privyId: string) {
  let user = await prisma.user.findUnique({ where: { privyId } })
  if (!user) {
    user = await prisma.user.create({ data: { privyId } })
  }
  return user
}
