import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { slugify } from '../util/functions';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Cadastrar um novo produto
   * @param createProductDto
   * @returns
   */
  async create(createProductDto: CreateProductDto) {
    // Verificar se o nome já existe
    if (await this.nameExists(createProductDto.name)) {
      throw new HttpException(
        'O Nome especificado já está em uso.',
        HttpStatus.FORBIDDEN,
      );
    }

    // Transformar o nome da categoria em slug
    const category_slug = slugify(createProductDto.category);
    createProductDto.category = category_slug;

    try {
      // Cadastrar o usuário
      const product = await this.prisma.product.create({
        data: createProductDto,
        select: {
          id: true,
        },
      });

      product['message'] = 'Produto cadastrado com sucesso.';

      return product;
    } catch (error) {
      throw new HttpException(
        'Falha ao cadastrar produto. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obter todos os produtos cadastrados
   * @returns array
   */
  async findAll() {
    try {
      return await this.prisma.product.findMany({
        select: {
          id: true,
          name: true,
          category: true,
          image_url: true,
        },
        /* orderBy: {
          id: 'desc',
        }, */
      });
    } catch (error) {
      throw new HttpException(
        'Houve um erro na listagem de produtos. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obter as avaliações de um produto
   * @param id integer
   * @returns Product
   */
  getReviews(id: number) {
    try {
      const productReviews = this.prisma.product.findUnique({
        where: {
          id: id,
        },
        select: {
          reviews: {
            select: {
              id: true,
              reviewer: {
                select: {
                  id: true,
                  name: true,
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
   * Obter um produto pelo id
   * @param id integer
   * @returns Product
   */
  async findOne(id: number) {
    try {
      const product = await this.prisma.product.findUnique({
        where: {
          id: id,
        },
        select: {
          id: true,
          name: true,
          category: true,
          image_url: true,
        },
      });

      if (product) {
        const ratingData = await this.prisma.review.aggregate({
          where: {
            ratedProductId: id,
          },
          _avg: {
            rating: true,
          },
          _count: {
            id: true,
          },
        });

        return {
          product: {
            ...product,
            average_rating: ratingData._avg.rating,
            count_ratings: ratingData._count.id,
          },
        };
      }
    } catch (error) {
      throw new HttpException(
        'Falha ao obter dados do produto. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    throw new HttpException('Produto inválido.', HttpStatus.BAD_REQUEST);
  }

  /**
   * Atualiza os dados de um produto
   * @param id
   * @param updateProductDto
   * @returns
   */
  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.prisma.product.findUnique({
        where: {
          id: id,
        },
      });

      if (product) {
        // Atualizar o produto
        await this.prisma.product.update({
          where: { id: id },
          data: updateProductDto,
        });
        return { message: 'Produto alterado com sucesso.' };
      }
    } catch (error) {
      throw new HttpException(
        'Falha ao atualizar dados do produto. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    throw new HttpException('Produto inválido.', HttpStatus.BAD_REQUEST);
  }

  /**
   * Delete um produto
   * @param id
   * @returns
   */
  async remove(id: number) {
    try {
      const product = await this.prisma.product.findUnique({
        where: {
          id: id,
        },
      });

      if (product) {
        // Excluir o produto
        await this.prisma.product.delete({
          where: { id: id },
        });
        return { message: 'Produto excluído com sucesso.' };
      }
    } catch (error) {
      throw new HttpException(
        'Falha ao excluir produto. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    throw new HttpException('Produto inválido.', HttpStatus.BAD_REQUEST);
  }

  // --------------------------------------------------

  // Verifica se o nome já existe
  private async nameExists(name: string) {
    const user = await this.prisma.product.findUnique({
      where: {
        name: name,
      },
    });

    return !!user;
  }
}
