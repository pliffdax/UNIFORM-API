import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Uniform API')
    .setDescription('API documentation for the Uniform service')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Authorization'],
  });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `🚀 Server is running on http://localhost:${process.env.PORT ?? 3000}`,
  );
  console.log(
    `📘 Swagger available at http://localhost:${process.env.PORT ?? 3000}/swagger`,
  );
}
bootstrap();
