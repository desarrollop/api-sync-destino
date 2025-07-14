import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = process.env.PORT || 3002;
  await app.listen(port);

  Logger.log(`🚀 Servidor destino ejecutándose en puerto ${port}`);
  Logger.log(`🔗 Endpoint validar sincronización: http://localhost:${port}/api/sync/health`);
  Logger.log(`📤 Endpoint de sincronización: http://localhost:${port}/api/sync/upload`);
}

bootstrap();
