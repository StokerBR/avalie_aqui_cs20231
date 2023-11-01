import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto, UpdateUserDto } from './dto';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtUserAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '@prisma/client';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Cadastrar um novo usuário
  @Post('register')
  @ApiAcceptedResponse({
    // Documentação da resposta pro swagger
    description: 'Cadastro realizado com sucesso',
    content: {
      'application/json': {
        schema: {
          example: {
            id: 1,
            message: 'Usuário cadastrado com sucesso.',
          },
        },
      },
    },
  })
  @ApiForbiddenResponse({
    // Documentação da resposta pro swagger
    description: 'Caso o email e/ou CPF já estiverem em uso',
    content: {
      'application/json': {
        schema: {
          example: {
            statusCode: 403,
            message: 'O Email/CPF especificado já está em uso.',
          },
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    // Documentação da resposta pro swagger
    description: 'Erro ao cadastrar o usuário',
    content: {
      'application/json': {
        schema: {
          example: {
            statusCode: 500,
            message:
              'Não foi possível cadastrar o usuário. Tente novamente mais tarde.',
          },
        },
      },
    },
  })
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.userService.register(registerUserDto);
  }

  @Get('')
  @UseGuards(JwtUserAuthGuard)
  @ApiBearerAuth('User access-token')
  @ApiAcceptedResponse({
    // Documentação da resposta pro swagger
    description: 'Dados do usuário obtidos com sucesso',
    content: {
      'application/json': {
        schema: {
          example: {
            id: 1,
            name: 'João da Silva',
            email: 'joaodasilva@gmail.com',
            cpf: '69796737000',
          },
        },
      },
    },
  })
  getUser(@Request() req: any) {
    return this.userService.getUser(req);
  }

  @Get(':id/reviews')
  @ApiAcceptedResponse({
    // Documentação da resposta pro swagger
    description: 'Avaliações do usuário obtidas com sucesso',
    content: {
      'application/json': {
        schema: {
          example: {
            reviews: [
              {
                id: 15,
                ratedProduct: {
                  id: 17,
                  name: 'Impressionante Algodão Frango',
                  category: 'saude',
                  image_url: 'https://picsum.photos/seed/y7IMpRWhze/640/480',
                },
                rating: 2,
                comments:
                  'Facilis maxime quisquam eaque assumenda. Veritatis debitis vero asperiores animi vitae temporibus cumque. Expedita quod labore fuga.',
              },
              {
                id: 19,
                ratedProduct: {
                  id: 8,
                  name: 'Inteligente Granito Computador',
                  category: 'filmes',
                  image_url: 'https://picsum.photos/seed/kiR8nJ/640/480',
                },
                rating: 3.5,
                comments: null,
              },
            ],
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    // Documentação da resposta pro swagger
    description: 'Usuário inválido',
    content: {
      'application/json': {
        schema: {
          example: {
            message: 'Usuário inválido',
          },
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    // Documentação da resposta pro swagger
    description: 'Há algo errado na recuperação das avaliações desse usuário',
    content: {
      'application/json': {
        schema: {
          example: {
            message:
              'Falha ao obter avaliações do usuário. Tente novamente mais tarde.',
          },
        },
      },
    },
  })
  getReviews(@Param('id') id: string) {
    return this.userService.getReviews(+id);
  }

  // Cadastrar um novo usuário
  @Put('')
  @UseGuards(JwtUserAuthGuard)
  @ApiBearerAuth('User access-token')
  @ApiAcceptedResponse({
    // Documentação da resposta pro swagger
    description: 'Dados atualizados com sucesso',
    content: {
      'application/json': {
        schema: {
          example: {
            message: 'Usuário atualizado com sucesso.',
          },
        },
      },
    },
  })
  @ApiForbiddenResponse({
    // Documentação da resposta pro swagger
    description: 'Caso o email/CPF já estiverem em uso',
    content: {
      'application/json': {
        schema: {
          example: {
            statusCode: 403,
            message: 'O Email/CPF especificado já está em uso.',
          },
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    // Documentação da resposta pro swagger
    description: 'Erro ao atualizar dados do usuário',
    content: {
      'application/json': {
        schema: {
          example: {
            statusCode: 500,
            message:
              'Não foi possível atualizar dados do usuário. Tente novamente mais tarde.',
          },
        },
      },
    },
  })
  update(@Request() req: any, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req, updateUserDto);
  }
}
