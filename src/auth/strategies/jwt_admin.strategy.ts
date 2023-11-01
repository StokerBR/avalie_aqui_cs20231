import { jwtConstants } from '../constants';
import { AuthService } from '../auth.service';
import { JwtAdminPayload } from '../auth.types';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwt_admin') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: JwtAdminPayload) {
    const admin = await this.authService.validateAdmin(payload.email);
    if (!admin) {
      throw new UnauthorizedException();
    }
    return admin;
  }
}
