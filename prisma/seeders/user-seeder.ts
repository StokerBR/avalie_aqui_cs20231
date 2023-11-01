import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker/locale/pt_BR';
import * as bcrypt from 'bcrypt';
const fakerbr = require('faker-br');

/**
 * Insere a quantidade especificada de usuários aleatórios no banco de dados
 * @param prisma PrismaClient
 * @param qty integer
 */
export async function userSeeder(prisma: PrismaClient, qty = 10) {
  // Gerar um usuário aleatório
  const fakerUser = async () => ({
    email: faker.internet.email(),
    name: faker.person.firstName() + faker.person.lastName(),
    cpf: fakerbr.br.cpf(),
    password: await bcrypt.hash(faker.internet.password(), 10),
  });

  console.log('Executando seeders de usuários');

  // Cadastrar o usuário padrão
  await prisma.user.create({
    data: {
      email: 'usuario@avalieaqui.com',
      name: 'Usuário Avalie Aqui',
      cpf: fakerbr.br.cpf(),
      password: await bcrypt.hash('avalieaqui123', 10),
    },
  });

  // Cadastrar os usuários aleatórios
  for (let i = 0; i < qty; i++) {
    await prisma.user.create({ data: await fakerUser() });
  }
}
