import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { slugify } from '../../src/util/functions';

/**
 * Insere a quantidade especificada de produtos aleatórios no banco de dados
 * @param prisma PrismaClient
 * @param qty integer
 */
export async function productSeeder(prisma: PrismaClient, qty = 10) {
  // Gerar um produto aleatório
  const fakerProduct = () => ({
    name: faker.commerce.productName(),
    category: slugify(faker.commerce.department()),
    image_url: faker.image.url(),
  });

  console.log('Executando seeder de produtos');

  // Cadastrar os produtos aleatórios
  for (let i = 0; i < qty; i++) {
    await prisma.product.create({ data: fakerProduct() });
  }
}
