import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Cria uma nova avaliação
   * @param createReviewDto
   * @returns
   */
  async create(createReviewDto: CreateReviewDto) {
    try {
      const review = {
        ...(await this.prisma.review.create({
          data: createReviewDto,
          select: {
            id: true,
          },
        })),
        message: 'Avaliação realizada com sucesso.',
      };

      return review;
    } catch (error) {
      throw new HttpException(
        'Falha ao realizar avaliação. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obter todas as avaliações cadastradas
   * @returns array
   */
  async findAll() {
    try {
      return await this.prisma.review.findMany({
        select: {
          id: true,
          reviewer: {
            select: {
              id: true,
              name: true,
            },
          },
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
      });
    } catch (error) {
      throw new HttpException(
        'Houve um erro na listagem de avaliações. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obter uma avaliação pelo id
   * @param id
   * @returns
   */
  async findOne(id: number) {
    try {
      const review = await this.prisma.review.findUnique({
        where: {
          id: id,
        },
        select: {
          id: true,
          reviewer: {
            select: {
              id: true,
              name: true,
            },
          },
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
      });
      if (review) {
        return review;
      }
    } catch (error) {
      throw new HttpException(
        'Falha ao obter dados da avaliação. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    throw new HttpException('Avaliação inválida.', HttpStatus.BAD_REQUEST);
  }

  /**
   * Atualiza os dados de uma avaliação
   * @param updateReviewDto
   * @returns
   */
  async update(id: number, updateReviewDto: Partial<UpdateReviewDto>) {
    try {
      const review = await this.prisma.review.findUnique({
        where: {
          id: id,
        },
      });
      if (review) {
        // Atualiza os dados da avaliação
        await this.prisma.review.update({
          where: { id: id },
          data: updateReviewDto,
        });
        return { message: 'Avaliação atualizada com sucesso.' };
      }
    } catch (error) {
      throw new HttpException(
        'Falha ao atualizar dados da avaliação. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    throw new HttpException('Avaliação inválida.', HttpStatus.BAD_REQUEST);
  }

  /**
   * Deleta uma avaliação
   * @param id
   * @returns
   */
  async remove(id: number) {
    try {
      const review = await this.prisma.review.findUnique({
        where: {
          id: id,
        },
      });
      if (review) {
        // Deleta a avaliação
        await this.prisma.review.delete({
          where: { id: id },
        });
        return { message: 'Avaliação excluída com sucesso.' };
      }
    } catch (error) {
      throw new HttpException(
        'Falha ao excluir avaliação. Tente novamente mais tarde.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    throw new HttpException('Avaliação inválida.', HttpStatus.BAD_REQUEST);
    try {
      return await this.prisma.review.delete({
        where: { id: id },
      });
    } catch (error) {
      throw new HttpException(
        'Falha ao Excluir Avaliação',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
