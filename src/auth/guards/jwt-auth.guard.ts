import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtUserAuthGuard extends AuthGuard('jwt_user') {}

@Injectable()
export class JwtAdminAuthGuard extends AuthGuard('jwt_admin') {}
