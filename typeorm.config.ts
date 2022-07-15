import { DataSource } from 'typeorm';

/**
 * This Configuration is required for Migrations i.e typeorm CLI.
 * A migration is just a single file with sql queries to update a database schema and apply new changes to an existing database.
 * TypeORM provides a place where you can write or generate sql queries and run them when needed. This place is called "migrations".
 */
export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'nest',
  username: 'postgres',
  password: 'postgres',
  entities: ['dist/**/*.entity.{ts,js}'],
  migrations: ['dist/migrations/*.{ts,js}'],
  migrationsTableName: 'typeorm_migrations',
  migrationsRun: true, // alternative, use CLI and run migration:run command.
  logger: 'file',
  logging: true,
  synchronize: false, // one should never use TRUE in production!
  cache: {
    ignoreErrors: true,
    duration: 30000, // 30 seconds
  },
});
