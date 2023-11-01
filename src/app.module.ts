import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ProductsModule } from './products/products.module';
import { AdminUserModule } from './admin_user/admin_user.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AdminUserModule,
    AuthModule,
    ProductsModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
