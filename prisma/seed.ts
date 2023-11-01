import { PrismaClient } from '@prisma/client';
import { adminSeeder, productSeeder, userSeeder } from './seeders/index';
import { reviewSeeder } from './seeders/review-seeder';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seeders');

  // Caso o argumento --docker seja passado, verificar se os seeders já foram executados
  if (process.argv.includes('--docker')) {
    let countUsers = await prisma.user.count();
    if (countUsers > 0) {
      console.log('Seeders já realizados');
      return true;
    }
  }

  // Executar os seeders
  await userSeeder(prisma, 10);
  await adminSeeder(prisma, 5);
  await productSeeder(prisma, 20);
  await reviewSeeder(prisma, 50);

  console.log('Seeders finalizados');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
