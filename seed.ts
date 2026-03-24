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
      batch: 2028
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
      batch: '2024' // Note: Batch is a String for AlumniMaster
    },
  });

  console.log('Seeded successfully! You can register with:');
  console.log('Student -> Name: Ankit Kumar, Enrollment: 0108CS211001');
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
