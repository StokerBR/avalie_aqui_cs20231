import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtUserAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtUserAuthGuard)
  @ApiBearerAuth('User access-token')
  @ApiAcceptedResponse({
    // Documentação da resposta pro swagger
    description: 'Cadastro realizado com sucesso',
    content: {
      'application/json': {
        schema: {
          example: {
            id: 1,
            message: 'Avaliação realizada com sucesso.',
          },
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    // Documentação da resposta pro swagger
    description: 'Erro ao cadastrar a avaliação',
    content: {
      'application/json': {
        schema: {
          example: {
            message:
              'Não foi possível realizar a avaliação. Tente novamente mais tarde.',
          },
        },
      },
    },
  })
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  @Get()
  @ApiAcceptedResponse({
    // Documentação da resposta pro swagger
    description: 'Listagem de avaliações concluída com sucesso',
    content: {
      'application/json': {
        schema: {
          example: [
            {
              id: 1,
              reviewer: {
                id: 9,
                name: 'FábioCarvalho',
              },
              ratedProduct: {
                id: 4,
                name: 'Licenciado Algodão Toalhas',
                category: 'esportes',
                image_url: 'https://picsum.photos/seed/u2o2idWcUA/640/480',
              },
              rating: 0.5,
              comments: null,
            },
            {
              id: 2,
              reviewer: {
                id: 7,
                name: 'PietroNogueira',
              },
              ratedProduct: {
                id: 11,
                name: 'Lustroso Granito Luvas',
                category: 'casa',
                image_url:
                  'https://loremflickr.com/640/480?lock=2047377961648128',
              },
              rating: 4.5,
              comments:
                'Nisi asperiores non debitis nesciunt quis. Veniam debitis repellendus. Sequi expedita pariatur sint explicabo distinctio dicta mollitia ad dignissimos.',
            },
          ],
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    // Documentação da resposta pro swagger
    description: 'Houve um erro na listagem de avaliações',
    content: {
      'application/json': {
        schema: {
          example: {
            message:
              'Houve um erro na listagem de avaliações. Tente novamente mais tarde.',
          },
        },
      },
    },
  })
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get(':id')
  @ApiAcceptedResponse({
    // Documentação da resposta pro swagger
    description: 'Produto encontrado com sucesso',
    content: {
      'application/json': {
        schema: {
          example: {
            id: 1,
            reviewer: {
              id: 9,
              name: 'FábioCarvalho',
            },
            ratedProduct: {
              id: 4,
              name: 'Licenciado Algodão Toalhas',
              category: 'esportes',
              image_url: 'https://picsum.photos/seed/u2o2idWcUA/640/480',
            },
            rating: 0.5,
            comments: null,
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    // Documentação da resposta pro swagger
    description: 'Avaliação inválida',
    content: {
      'application/json': {
        schema: {
          example: {
            message: 'Avaliação inválida',
          },
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    // Documentação da resposta pro swagger
    description: 'Há algo errado na recuperação de dados dessa avaliação',
    content: {
      'application/json': {
        schema: {
          example: {
            message:
              'Falha ao obter dados da avaliação. Tente novamente mais tarde.',
          },
        },
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtUserAuthGuard)
  @ApiBearerAuth('User access-token')
  @ApiAcceptedResponse({
    // Documentação da resposta pro swagger
    description: 'Avaliação alterada com sucesso',
    content: {
      'application/json': {
        schema: {
          example: {
            message: 'Avaliação alterada com sucesso.',
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    // Documentação da resposta pro swagger
    description: 'Avaliação Inválida',
    content: {
      'application/json': {
        schema: {
          example: {
            message: 'Avaliação Inválida',
          },
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    // Documentação da resposta pro swagger
    description: 'Não foi possível alterar esta avaliação',
    content: {
      'application/json': {
        schema: {
          example: {
            message:
              'Não foi possível alterar essa avaliação. Tente novamente mais tarde.',
          },
        },
      },
    },
  })
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(+id, updateReviewDto);
  }

  @Delete(':id')
  @UseGuards(JwtUserAuthGuard)
  @ApiBearerAuth('User access-token')
  @ApiAcceptedResponse({
    // Documentação da resposta pro swagger
    description: 'Avaliação alterada com sucesso',
    content: {
      'application/json': {
        schema: {
          example: {
            message: 'Avaliação alterada com sucesso.',
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    // Documentação da resposta pro swagger
    description: 'Avaliação Inválida',
    content: {
      'application/json': {
        schema: {
          example: {
            message: 'Avaliação Inválida',
          },
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    // Documentação da resposta pro swagger
    description: 'Não foi possível remover esta avaliação',
    content: {
      'application/json': {
        schema: {
          example: {
            message:
              'Não foi possível remover essa avaliação. Tente novamente mais tarde.',
          },
        },
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(+id);
  }
}
