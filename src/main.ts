import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appPort } from './env/envoriment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
    credentials: true,
  });
  await app.listen(appPort, () => {
    console.log(`Server is running on http://localhost:${appPort}/api`);
  });
}
bootstrap();
