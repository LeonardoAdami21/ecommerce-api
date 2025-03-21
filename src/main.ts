import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { appPort, mongooseUrl } from './env/envoriment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // swagger setup
  const config = new DocumentBuilder()
    .setTitle('Ecommerce API')
    .setDescription('Documentation API for Ecommerce')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1', app, document);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(appPort, () => {
    console.log(`Server running on port http://localhost:${appPort}/api/v1`);
    console.log(`Database connected on ${mongooseUrl}`);
  });
}
bootstrap();
