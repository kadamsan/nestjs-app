import { Injectable, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  private readonly logger = new Logger(TypeOrmConfigService.name);
  @Inject(ConfigService)
  private readonly configService: ConfigService;

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('DATABASE_HOST') || 'localhost',
      port: this.configService.get<number>('DATABASE_PORT') || 5432,
      database: this.configService.get<string>('DATABASE_NAME') || 'nest',
      username:
        this.configService.get<string>('DATABASE_USERNAME') || 'postgres',
      password:
        this.configService.get<string>('DATABASE_PASSWORD') || 'postgres',
      autoLoadEntities: true,
      entities: ['dist/**/*.entity.{ts,js}'],
      migrations: ['dist/migrations/*.{ts,js}'],
      migrationsTableName: 'typeorm_migrations',
      migrationsRun: false, // alternative, use CLI and run migration:run command.
      logger: 'file',
      logging: true,
      synchronize:
        this.configService.get<string>('NODE_ENV') === 'production'
          ? false
          : false, // one should never use TRUE in production!
      cache: {
        ignoreErrors: true,
        duration: 30000, // 30 seconds
      },
      /*cli: {
        entitiesDir: 'src',
        migrationsDir: 'migrations',
      }*/
    };
  }
}
