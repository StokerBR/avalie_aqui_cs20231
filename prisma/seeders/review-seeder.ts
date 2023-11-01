import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker/locale/pt_BR';

/**
 * Insere a quantidade especificada de avaliações aleatórias no banco de dados
 * @param prisma PrismaClient
 * @param qty integer
 */
export async function reviewSeeder(prisma: PrismaClient, qty = 10) {
  let countUsers = await prisma.user.count();
  let countProducts = await prisma.product.count();

  // Gerar um avaliaçõe aleatória
  const fakerReview = () => ({
    reviewerId: faker.number.int({ min: 1, max: countUsers }),
    ratedProductId: faker.number.int({ min: 1, max: countProducts }),
    rating: faker.number.float({ min: 0, max: 5, precision: 0.5 }),
    comments: faker.datatype.boolean() ? faker.lorem.paragraph() : null,
  });

  console.log('Executando seeder de avaliações');

  // Cadastrar os avaliações aleatórias
  for (let i = 0; i < qty; i++) {
    await prisma.review.create({ data: fakerReview() });
  }
}
