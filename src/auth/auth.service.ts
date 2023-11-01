import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { JwtAdminPayload, JwtUserPayload } from './auth.types';
import { User, AdminUser } from '@prisma/client';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  /**
   * Valida o usuário
   * @param email string
   * @returns
   */
  async validateUser(email: string): Promise<Omit<User, 'password'>> {
    const user = await this.userService.getByEmail(email);
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * Valida o administrador
   * @param email string
   * @returns
   */
  async validateAdmin(email: string): Promise<Omit<AdminUser, 'password'>> {
    const admin = await this.userService.getAdminByEmail(email);
    if (admin) {
      const { password, ...result } = admin;
      return result;
    }
    return null;
  }

  /**
   * Gera o token de acesso e o token de refresh
   * @param payload
   * @returns
   */
  private generateToken(payload: JwtUserPayload | JwtAdminPayload) {
    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '1d',
        secret: jwtConstants.secret,
      }),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: '7d',
        secret: jwtConstants.secretRefresh,
      }),
    };
  }

  /**
   * Valida o token de refresh
   * @param type
   * @param body
   * @returns
   */
  private async validateRefreshToken(type: string, refreshToken: string) {
    const email = this.jwtService.decode(refreshToken)['email'];
    const user =
      type == 'user'
        ? await this.validateUser(email)
        : await this.validateAdmin(email);

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    try {
      this.jwtService.verify(refreshToken, {
        secret: jwtConstants.secretRefresh,
      });
      return user;
    } catch (err) {
      if (err.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Assinatura Inválida');
      }
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token Expirado');
      }
      throw new UnauthorizedException(err.name);
    }
  }

  /**
   * Realiza o login do usuário
   * @param data LoginDto
   * @returns access_token
   */
  async login(data: LoginDto) {
    const { email, password } = data;

    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtUserPayload = {
        id: user.id,
        email: user.email,
        name: user.name,
      };
      return this.generateToken(payload);
    } else {
      throw new UnauthorizedException(
        'Verifique as credenciais e tente novamente',
      );
    }
  }

  /**
   * Realiza o login do administrador
   * @param data LoginDto
   * @returns access_token
   */
  async loginAdmin(data: LoginDto) {
    const { email, password } = data;

    const admin = await this.prisma.adminUser.findUnique({
      where: {
        email: email,
      },
    });
    if (admin && (await bcrypt.compare(password, admin.password))) {
      const payload: JwtAdminPayload = {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      };
      return this.generateToken(payload);
    } else {
      throw new UnauthorizedException(
        'Verifique as credenciais e tente novamente',
      );
    }
  }

  /**
   * Realiza o refresh do token de acesso do usuário
   * @param refresh_token
   * @returns
   */
  async refreshUser(refresh_token: string) {
    const user = await this.validateRefreshToken('user', refresh_token);
    const payload: JwtUserPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };
    return this.generateToken(payload);
  }

  /**
   * Realiza o refresh do token de acesso do administrador
   * @param refresh_token
   * @returns
   */
  async refreshAdmin(refresh_token: string) {
    const admin = await this.validateRefreshToken('admin', refresh_token);
    const payload: JwtAdminPayload = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
    };
    return this.generateToken(payload);
  }
}
