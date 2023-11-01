import { AdminUser, User } from '@prisma/client';

export type JwtUserPayload = Pick<User, 'id' | 'name' | 'email'>;
export type JwtAdminPayload = Pick<AdminUser, 'id' | 'name' | 'email'>;
