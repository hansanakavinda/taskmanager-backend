const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      firstName: 'super',
      lastName: 'admin',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'jane.smith@example.com',
      password: hashedPassword,
      firstName: 'Jane',
      lastName: 'Smith',
    },
  });

  // Create sample tasks
  const tasks = [
    {
      title: 'Complete project proposal',
      description: 'Write and submit the project proposal for Q1',
      status: 'PENDING',
      priority: 'HIGH',
      userId: user1.id,
      dueDate: new Date('2024-12-15'),
    },
    {
      title: 'Review team performance',
      description: 'Conduct quarterly review meetings',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      userId: user1.id,
      dueDate: new Date('2024-12-10'),
    },
    {
      title: 'Update documentation',
      description: 'Update API documentation with new endpoints',
      status: 'COMPLETED',
      priority: 'LOW',
      userId: user2.id,
      completedAt: new Date(),
    },
    {
      title: 'Setup CI/CD pipeline',
      description: 'Configure continuous integration and deployment',
      status: 'PENDING',
      priority: 'URGENT',
      userId: user2.id,
      dueDate: new Date('2024-11-30'),
    },
  ];

  for (const task of tasks) {
    await prisma.task.create({ data: task });
  }

  console.log('✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });