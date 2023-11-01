import { LoginDto, RefreshTokenDto } from './dto';
import { AuthService } from './auth.service';
import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Login de usuário
  @Post('login')
  @HttpCode(200)
  @ApiResponse({
    // Documentação da resposta pro swagger
    status: 200,
    description: 'Login realizado com sucesso',
    content: {
      'application/json': {
        schema: {
          example: {
            statusCode: 200,
            access_token: 'token',
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    // Documentação da resposta pro swagger
    description: 'Caso o email e/ou senha estejam incorretos',
    content: {
      'application/json': {
        schema: {
          example: {
            statusCode: 401,
            message: 'Verifique as credenciais e tente novamente',
          },
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    // Documentação da resposta pro swagger
    description: 'Erro ao logar o usuário',
    content: {
      'application/json': {
        schema: {
          example: {
            statusCode: 500,
            message:
              'Não foi possível logar o usuário. Tente novamente mais tarde.',
          },
        },
      },
    },
  })
  async login(@Body() data: LoginDto) {
    return await this.authService.login(data);
  }

  // Refresh token de usuário
  @Post('refresh')
  @HttpCode(200)
  @ApiResponse({
    // Documentação da resposta pro swagger
    status: 200,
    description: 'Token atualizado com sucesso',
    content: {
      'application/json': {
        schema: {
          example: {
            access_token: 'token',
            refresh_token: 'token',
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    // Documentação da resposta pro swagger
    description: 'Caso o token esteja expirado ou inválido',
    content: {
      'application/json': {
        schema: {
          example: {
            statusCode: 401,
            message: 'Token Expirado',
          },
        },
      },
    },
  })
  async refreshUser(@Body() data: RefreshTokenDto) {
    return await this.authService.refreshUser(data.refresh_token);
  }

  // Login de admnistrador
  @Post('admin/login')
  @HttpCode(200)
  @ApiResponse({
    // Documentação da resposta pro swagger
    status: 200,
    description: 'Login realizado com sucesso',
    content: {
      'application/json': {
        schema: {
          example: {
            access_token: 'token',
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    // Documentação da resposta pro swagger
    description: 'Caso o email e/ou senha estejam incorretos',
    content: {
      'application/json': {
        schema: {
          example: {
            statusCode: 401,
            message: 'Verifique as credenciais e tente novamente',
          },
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    // Documentação da resposta pro swagger
    description: 'Erro ao logar o administrador',
    content: {
      'application/json': {
        schema: {
          example: {
            statusCode: 500,
            message:
              'Não foi possível logar o administrador. Tente novamente mais tarde.',
          },
        },
      },
    },
  })
  async loginAdmin(@Body() data: LoginDto) {
    return await this.authService.loginAdmin(data);
  }

  // Refresh token de usuário
  @Post('admin/refresh')
  @HttpCode(200)
  @ApiResponse({
    // Documentação da resposta pro swagger
    status: 200,
    description: 'Token atualizado com sucesso',
    content: {
      'application/json': {
        schema: {
          example: {
            access_token: 'token',
            refresh_token: 'token',
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    // Documentação da resposta pro swagger
    description: 'Caso o token esteja expirado ou inválido',
    content: {
      'application/json': {
        schema: {
          example: {
            statusCode: 401,
            message: 'Token Expirado/Assinatura Inválida',
          },
        },
      },
    },
  })
  async refreshAdmin(@Body() data: RefreshTokenDto) {
    return await this.authService.refreshAdmin(data.refresh_token);
  }
}
