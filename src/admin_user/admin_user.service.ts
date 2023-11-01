import * as bcrypt from 'bcrypt';
import { RegisterAdminUserDto } from './dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AdminUser } from '@prisma/client';

@Injectable()
export class AdminUserService {
  constructor(private prisma: PrismaService) {}

  /**
   * Cadastrar um novo usuário
   * @param RegisterUserDto
   * @returns AdminUser
   */
  async register(registerAdminUserDto: RegisterAdminUserDto) {
    // Verificar se o email já existe
    if (await this.emailExists(registerAdminUserDto.email)) {
      throw new HttpException(
        'O Email especificado já está em uso.',
        HttpStatus.FORBIDDEN,
      );
    }

    // Criptografar a senha
    const hash = await bcrypt.hash(registerAdminUserDto.password, 10);

    // Substituir a senha do DTO pelo hash
    registerAdminUserDto = { ...registerAdminUserDto, password: hash };

    try {
      // Cadastrar o admin
      const user = await this.prisma.adminUser.create({
        data: registerAdminUserDto,
        select: {
          id: true,
        },
      });

      user['message'] = 'Admin cadastrado com sucesso.';

      return user;
    } catch (error) {
      throw new HttpException(
        'Falha ao cadastrar admin. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obter os dados de um usuário pelo ID
   * @param id number
   * @returns object
   */
  getAdmin(req: any) {
    const admin: AdminUser = req.user;
    return this.prisma.adminUser.findUnique({
      where: {
        id: admin.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  // --------------------------------------------------

  // Verifica se o email já existe
  private async emailExists(email: string) {
    const admin = await this.prisma.adminUser.findUnique({
      where: {
        email: email,
      },
    });

    return !!admin;
  }

  //Busca admin pelo email
  async getAdminByEmail(email: string) {
    return await this.prisma.adminUser.findUnique({
      where: {
        email: email,
      },
    });
  }
}
