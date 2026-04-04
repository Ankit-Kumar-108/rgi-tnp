import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding student master records...');
  
  await prisma.studentMaster.upsert({
    where: { enrollmentNumber: '0158CS241012' },
    update: {},
    create: {
      enrollmentNumber: '0158CS241012',
      name: 'Ankit Kumar',
      branch: 'Computer Science',
      course: 'B.Tech',
      batch: '2024-2028'
    },
  });

  console.log('Seeding alumni master records...');

  await prisma.alumniMaster.upsert({
    where: { enrollmentNumber: '0108CS201001' },
    update: {},
    create: {
      enrollmentNumber: '0108CS201001',
      name: 'Jane Doe',
      branch: 'Information Technology',
      course: 'B.Tech',
      batch: '2020-2024'
    },
  });

  console.log('Seeded successfully! You can register with:');
  console.log('Student -> Name: Ankit Kumar, Enrollment: 0158CS241012');
  console.log('Alumni -> Name: Jane Doe, Enrollment: 0108CS201001');
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
