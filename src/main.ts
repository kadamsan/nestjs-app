import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import helmet from 'helmet';

declare const module: any;

async function bootstrap() {
  const logger = new Logger('bootstrap');

  const app: INestApplication = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);

  app.use(helmet()); //  it must come before other calls to app.use() or setup functions that may call app.use().
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(configService.get<number>('PORT'));

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
