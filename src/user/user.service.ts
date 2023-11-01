import * as bcrypt from 'bcrypt';
import { RegisterUserDto, UpdateUserDto } from './dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /**
   * Cadastrar um novo usuário
   * @param RegisterUserDto
   * @returns User
   */
  async register(registerUserDto: RegisterUserDto) {
    // Verificar se o email já existe
    if (await this.emailExists(registerUserDto.email)) {
      throw new HttpException(
        'O Email especificado já está em uso.',
        HttpStatus.FORBIDDEN,
      );
    }

    // Verificar se o CPF já existe
    if (await this.cpfExists(registerUserDto.cpf)) {
      throw new HttpException(
        'O CPF especificado já está em uso.',
        HttpStatus.FORBIDDEN,
      );
    }

    // Criptografar a senha
    const hash = await bcrypt.hash(registerUserDto.password, 10);

    // Remover os caracteres não numéricos do CPF
    const cpf = registerUserDto.cpf.replace(/\D/g, '');

    // Substituir a senha do DTO pelo hash
    registerUserDto = { ...registerUserDto, cpf: cpf, password: hash };

    try {
      // Cadastrar o usuário
      const user = await this.prisma.user.create({
        data: registerUserDto,
        select: {
          id: true,
        },
      });

      user['message'] = 'Usuário cadastrado com sucesso.';

      return user;
    } catch (error) {
      throw new HttpException(
        'Falha ao cadastrar usuário. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obter os dados de um usuário pelo ID
   * @param id number
   * @returns object
   */
  getUser(req: any) {
    const user: User = req.user;
    return this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
      },
    });
  }

  /**
   * Obter as avaliações de um usuário
   * @param id integer
   * @returns Product
   */
  getReviews(id: number) {
    try {
      const productReviews = this.prisma.user.findUnique({
        where: {
          id: id,
        },
        select: {
          reviews: {
            select: {
              id: true,
              ratedProduct: {
                select: {
                  id: true,
                  name: true,
                  category: true,
                  image_url: true,
                },
              },
              rating: true,
              comments: true,
            },
          },
        },
      });
      if (productReviews) {
        return productReviews;
      }
    } catch (error) {
      throw new HttpException(
        'Falha ao obter as avaliações do produto. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    throw new HttpException('Produto inválido.', HttpStatus.BAD_REQUEST);
  }

  /**
   * Atualiza os dados de uma avaliação
   * @param updateUserDto
   * @returns
   */
  async update(req: any, updateUserDto: Partial<UpdateUserDto>) {
    const user: User = req.user;
    try {
      // Atualiza os dados da avaliação
      await this.prisma.user.update({
        where: { id: user.id },
        data: updateUserDto,
      });
      return { message: 'Usuário atualizado com sucesso.' };
    } catch (error) {
      throw new HttpException(
        'Falha ao atualizar dados do usuário. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // --------------------------------------------------

  // Verifica se o email já existe
  private async emailExists(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    return !!user;
  }

  // Verifica se o CPF já existe
  private async cpfExists(cpf: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        cpf: cpf,
      },
    });

    return !!user;
  }

  //Busca usuário pelo email
  async getByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
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
