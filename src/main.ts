import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appPort } from './env/envoriment';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const swaggerOptions = new DocumentBuilder()
    .setTitle('Ecommerce API')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['set-cookie'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
  });
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api', app, document);
  await app.listen(appPort, () => {
    console.log(`Server is running on http://localhost:${appPort}/api`);
  });
}
bootstrap();
