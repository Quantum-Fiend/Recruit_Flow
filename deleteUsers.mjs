import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.user.deleteMany({});
  console.log('All users deleted');
}
main().catch(console.error).finally(() => prisma.$disconnect());
