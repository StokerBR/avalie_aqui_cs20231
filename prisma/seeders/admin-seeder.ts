import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker/locale/pt_BR';
import * as bcrypt from 'bcrypt';

/**
 * Insere a quantidade especificada de admins aleatórios no banco de dados
 * @param prisma PrismaClient
 * @param qty integer
 */
export async function adminSeeder(prisma: PrismaClient, qty = 5) {
  // Gerar um admin aleatório
  const fakerAdmin = async () => ({
    email: faker.internet.email(),
    name: faker.person.firstName() + faker.person.lastName(),
    password: await bcrypt.hash(faker.internet.password(), 10),
  });

  console.log('Executando seeder de admins');

  // Cadastrar o admin padrão
  await prisma.adminUser.create({
    data: {
      email: 'admin@avalieaqui.com',
      name: 'Administrador Avalie Aqui',
      password: await bcrypt.hash('avalieaqui123', 10),
    },
  });

  // Cadastrar os admins aleatórios
  for (let i = 0; i < qty; i++) {
    await prisma.adminUser.create({ data: await fakerAdmin() });
  }
}
