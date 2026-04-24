const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@smartseason.com' },
    update: {},
    create: { name: 'Admin User', email: 'admin@smartseason.com', password: adminPassword, role: 'ADMIN' }
  });

  const agentPassword = await bcrypt.hash('agent123', 10);
  const agent1 = await prisma.user.upsert({
    where: { email: 'agent1@smartseason.com' },
    update: {},
    create: { name: 'Agent One', email: 'agent1@smartseason.com', password: agentPassword, role: 'AGENT' }
  });

  const agent2 = await prisma.user.upsert({
    where: { email: 'agent2@smartseason.com' },
    update: {},
    create: { name: 'Agent Two', email: 'agent2@smartseason.com', password: agentPassword, role: 'AGENT' }
  });

  console.log('✅ Users seeded!');
  console.log('✅ Seed complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());