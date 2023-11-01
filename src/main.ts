import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' }); // Habilita o CORS
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true })); // Configuração do ValidationPipe

  // Configuração do Swagger (Swagger: http://localhost:3000/api)
  const config = new DocumentBuilder()
    .setTitle('AvalieAqui')
    .setDescription('Descrição da API do AvalieAqui')
    .setVersion('0.1')
    .addBearerAuth(
      {
        description: 'Token de acesso do usuário',
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'User access-token',
    )
    .addBearerAuth(
      {
        description: 'Token de acesso do administrador',
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'Admin access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Inicia o servidor
  await app.listen(process.env.PORT || 4000, '0.0.0.0');
}
bootstrap();
