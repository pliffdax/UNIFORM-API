import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 1) CORS для фронта
  app.enableCors({
    origin: [
      'http://localhost:3000', // Next.js dev
      process.env.FRONTEND_ORIGIN || '', // можно переопределить .env
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Disposition'],
  });

  // 2) Раздача статики: файлы из ./uploads будут доступны по /static/...
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/static' });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Uniform API')
    .setDescription('API documentation for the Uniform service')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  console.log(`🚀 Server is running on http://localhost:${port}`);
  console.log(`📘 Swagger available at http://localhost:${port}/swagger`);
  console.log(`🗂️ Static files served at http://localhost:${port}/static`);
}
bootstrap();
