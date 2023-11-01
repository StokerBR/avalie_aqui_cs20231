import { Module } from '@nestjs/common';
import { AdminUserService } from './admin_user.service';
import { AdminUserController } from './admin_user.controller';

@Module({
  controllers: [AdminUserController],
  providers: [AdminUserService],
  exports: [AdminUserService],
})
export class AdminUserModule {}
