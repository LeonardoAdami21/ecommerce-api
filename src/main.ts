import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { initSwagger } from './app.swagger';
import { appPort } from './env/envoriment';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  app.disable('x-powered-by');
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  //app.useWebSocketAdapter(new IoAdapter(app));
  initSwagger(app);

  const logger = new Logger('NestApplication');
  await app.startAllMicroservices();
  app.listen(appPort, '0.0.0.0', async () => {
    logger.log(`Running At: ${await app.getUrl()}`);
    logger.log(`Documentation: ${await app.getUrl()}/v2/docs`);
    logger.log(
      `Database: ${process.env.MYSQL_USER}@${process.env.MYSQL_HOST}@localhost$:${process.env.MYSQL_PORT}/${process.env.MYSQL_DATABASE}`,
    );
  });
}
bootstrap();
