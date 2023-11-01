import { ReviewsService } from './reviews.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { HttpStatus, HttpException } from '@nestjs/common';

// Mock do PrismaService para testes
const prismaServiceMock = {
  review: {
    create: jest.fn((data) =>
      Promise.resolve({
        id: 1,
        rating: data.rating,
        reviewerId: data.reviewerId,
        ratedProductId: data.ratedProductId,
        comments: data.comments,
      }),
    ),
    findUnique: jest.fn((data) =>
      Promise.resolve({
        id: data.where.id,
        rating: 4.5,
        comments: 'Ótimo produto!',
        reviewer: { id: 1, name: 'João' },
        ratedProduct: {
          id: 1,
          name: 'Product 1',
          category: 'Eletrônicos',
          image_url: 'https://exemplo.com/produto1.png',
        },
      }),
    ),
    findMany: jest.fn(() =>
      Promise.resolve([
        {
          id: 1,
          rating: 4.5,
          comments: 'Ótimo produto!',
          reviewer: { id: 1, name: 'João' },
          ratedProduct: {
            id: 1,
            name: 'Product 1',
            category: 'Eletrônicos',
            image_url: 'https://exemplo.com/produto1.png',
          },
        },
        {
          id: 2,
          rating: 3.8,
          comments: 'Bom produto, poderia ser melhor.',
          reviewer: { id: 2, name: 'Maria' },
          ratedProduct: {
            id: 1,
            name: 'Product 1',
            category: 'Eletrônicos',
            image_url: 'https://exemplo.com/produto1.png',
          },
        },
        {
          id: 3,
          rating: 5.0,
          comments: 'Produto excelente!',
          reviewer: { id: 1, name: 'João' },
          ratedProduct: {
            id: 2,
            name: 'Product 2',
            category: 'Roupas',
            image_url: 'https://exemplo.com/produto2.png',
          },
        },
      ]),
    ),
    update: jest.fn((id, data) => Promise.resolve({ id, ...data })),
    delete: jest.fn((id) => Promise.resolve({ id })),
  },
};

const createReviewDto: CreateReviewDto = {
  reviewerId: 1,
  ratedProductId: 1,
  rating: 4.5,
  comments: 'Ótimo produto!',
};

const updateReviewDto: UpdateReviewDto = {
  rating: 4.8,
};

describe('ReviewsService', () => {
  let reviewsService: ReviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    reviewsService = module.get<ReviewsService>(ReviewsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(reviewsService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new review', async () => {
      const result = await reviewsService.create(createReviewDto);

      expect(result.id).toBeDefined();
      expect(result.message).toEqual('Avaliação realizada com sucesso.');
    });

    it('should throw an error if review creation fails', async () => {
      prismaServiceMock.review.create.mockRejectedValueOnce(new Error());

      await expect(reviewsService.create(createReviewDto)).rejects.toThrowError(
        new HttpException(
          'Falha ao realizar avaliação. Tente novamente mais tarde.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of reviews', async () => {
      const result = await reviewsService.findAll();

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(3); // Assumindo que adicionamos 3 avaliações no mock

      // Verifica as propriedades do objeto de review para o primeiro review no array
      expect(result[0].id).toEqual(1);
      expect(result[0].rating).toEqual(4.5);
      expect(result[0].reviewer).toEqual({ id: 1, name: 'João' });
      expect(result[0].ratedProduct).toEqual({
        id: 1,
        name: 'Product 1',
        category: 'Eletrônicos',
        image_url: 'https://exemplo.com/produto1.png',
      });
      expect(result[0].comments).toEqual('Ótimo produto!');

      // Verifica as propriedades do objeto de review para o segundo review no array
      expect(result[1].id).toEqual(2);
      expect(result[1].rating).toEqual(3.8);
      expect(result[1].reviewer).toEqual({ id: 2, name: 'Maria' });
      expect(result[1].ratedProduct).toEqual({
        id: 1,
        name: 'Product 1',
        category: 'Eletrônicos',
        image_url: 'https://exemplo.com/produto1.png',
      });
      expect(result[1].comments).toEqual('Bom produto, poderia ser melhor.');

      // Verifica as propriedades do objeto de review para o terceiro review no array
      expect(result[2].rating).toEqual(5.0);
      expect(result[2].reviewer).toEqual({ id: 1, name: 'João' });
      expect(result[2].ratedProduct).toEqual({
        id: 2,
        name: 'Product 2',
        category: 'Roupas',
        image_url: 'https://exemplo.com/produto2.png',
      });
      expect(result[2].comments).toEqual('Produto excelente!');
    });

    it('should throw an error if retrieval fails', async () => {
      prismaServiceMock.review.findMany.mockRejectedValueOnce(new Error());

      await expect(reviewsService.findAll()).rejects.toThrowError(
        new HttpException(
          'Houve um erro na listagem de avaliações. Tente novamente mais tarde.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('findOne', () => {
    it('should return a review by id', async () => {
      const reviewId = 1;
      const result = await reviewsService.findOne(reviewId);
      console.log(result);
      expect(result).toEqual({
        id: reviewId,
        rating: 4.5,
        comments: 'Ótimo produto!',
        reviewer: { id: 1, name: 'João' },
        ratedProduct: {
          id: 1,
          name: 'Product 1',
          category: 'Eletrônicos',
          image_url: 'https://exemplo.com/produto1.png',
        },
      });
    });

    it('should throw an error if review with the provided id is not found', async () => {
      const reviewId = 999;
      prismaServiceMock.review.findUnique.mockResolvedValueOnce(null);

      await expect(reviewsService.findOne(reviewId)).rejects.toThrowError(
        new HttpException('Avaliação inválida.', HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw an error if retrieval fails', async () => {
      const reviewId = 1;
      prismaServiceMock.review.findUnique.mockRejectedValueOnce(new Error());

      await expect(reviewsService.findOne(reviewId)).rejects.toThrowError(
        new HttpException(
          'Falha ao obter dados da avaliação. Tente novamente mais tarde.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('update', () => {
    it('should update a review by id', async () => {
      const reviewId = 1;
      const result = await reviewsService.update(reviewId, updateReviewDto);

      expect(result).toEqual({ message: 'Avaliação atualizada com sucesso.' });
    });

    it('should throw an error if review with the provided id is not found', async () => {
      const reviewId = 999;
      prismaServiceMock.review.findUnique.mockResolvedValueOnce(null);

      await expect(
        reviewsService.update(reviewId, updateReviewDto),
      ).rejects.toThrowError(
        new HttpException('Avaliação inválida.', HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw an error if update fails', async () => {
      const reviewId = 1;
      prismaServiceMock.review.update.mockRejectedValueOnce(new Error());

      await expect(
        reviewsService.update(reviewId, updateReviewDto),
      ).rejects.toThrowError(
        new HttpException(
          'Falha ao atualizar dados da avaliação. Tente novamente mais tarde.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('remove', () => {
    it('should delete a review by id', async () => {
      const reviewId = 1;
      const result = await reviewsService.remove(reviewId);

      expect(result).toEqual({ message: 'Avaliação excluída com sucesso.' });
    });

    it('should throw an error if review with the provided id is not found', async () => {
      const reviewId = 999;
      prismaServiceMock.review.findUnique.mockResolvedValueOnce(null);

      await expect(reviewsService.remove(reviewId)).rejects.toThrowError(
        new HttpException('Avaliação inválida.', HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw an error if deletion fails', async () => {
      const reviewId = 1;
      prismaServiceMock.review.delete.mockRejectedValueOnce(new Error());

      await expect(reviewsService.remove(reviewId)).rejects.toThrowError(
        new HttpException(
          'Falha ao excluir avaliação. Tente novamente mais tarde.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
});
