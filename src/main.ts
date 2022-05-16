import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app: INestApplication = await NestFactory.create(AppModule);
  await app.listen(3000);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
