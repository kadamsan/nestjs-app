export const configuration = () => ({
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT, 10) || 3000,

    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || 'secret',
    JWT_EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME || '5m',

    DATABASE_PORT: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    DATABASE_NAME: process.env.DATABASE_NAME || 'nest',
    DATABASE_USERNAME: process.env.DATABASE_USERNAME || 'postgres',
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || 'postgres',
    DATABASE_HOST: process.env.DATABASE_HOST || 'localhost',
    DATABASE_DIALECT: process.env.DATABASE_DIALECT || 'postgres',

    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_PASSWORD: process.env.REDIS_PORT

  });