import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Ecommerce Api')
    .setDescription('Tecnologias: Nestjs, Swagger, Mongoose, MongoDB e Docker')
    .addBearerAuth()
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);
  await app.listen(process.env.APP_PORT || 3000, () =>
    console.log(
      `App is Running\nDocumentation available on http://localhost:${process.env.APP_PORT}/docs`,
    ),
  );
}
bootstrap();
