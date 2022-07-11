import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import helmet from 'helmet';
import { setupSwagger } from './shared/swagger';

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

  setupSwagger(app);

  await app.listen(configService.get<number>('PORT'));

  if (configService.get<string>('NODE_ENV') === 'development') {
    // Log current url of app and documentation
    let baseUrl = app.getHttpServer().address().address;
    if (baseUrl === '0.0.0.0' || baseUrl === '::') {
      baseUrl = 'localhost';
    }
    // eslint-disable-next-line prettier/prettier
    const url = `http://${baseUrl}:${configService.get<number>('PORT')}`;
    logger.log(`Listening to ${url}`);
  }
  logger.log(`API Documentation available at ${await app.getUrl()}/docs`);
  logger.log(`Application is running on: ${await app.getUrl()}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
