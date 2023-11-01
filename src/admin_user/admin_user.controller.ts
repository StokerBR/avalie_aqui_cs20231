import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AdminUserService } from './admin_user.service';
import { RegisterAdminUserDto } from './dto';
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Admin User')
@Controller('admin')
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

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
            message: 'Admin cadastrado com sucesso.',
          },
        },
      },
    },
  })
  @ApiForbiddenResponse({
    // Documentação da resposta pro swagger
    description: 'Caso o email e já estiver em uso',
    content: {
      'application/json': {
        schema: {
          example: {
            statusCode: 403,
            message: 'O Email especificado já está em uso.',
          },
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    // Documentação da resposta pro swagger
    description: 'Erro ao cadastrar o admin',
    content: {
      'application/json': {
        schema: {
          example: {
            statusCode: 500,
            message:
              'Não foi possível cadastrar o admin. Tente novamente mais tarde.',
          },
        },
      },
    },
  })
  register(@Body() registerUserDto: RegisterAdminUserDto) {
    return this.adminUserService.register(registerUserDto);
  }

  @Get('')
  @UseGuards(JwtAdminAuthGuard)
  @ApiBearerAuth('Admin access-token')
  @ApiAcceptedResponse({
    // Documentação da resposta pro swagger
    description: 'Dados do usuário obtidos com sucesso',
    content: {
      'application/json': {
        schema: {
          example: {
            id: 1,
            name: 'João Borges',
            email: 'joaoborges@gmail.com',
          },
        },
      },
    },
  })
  getAdmin(@Request() req: any) {
    return this.adminUserService.getAdmin(req);
  }
}
