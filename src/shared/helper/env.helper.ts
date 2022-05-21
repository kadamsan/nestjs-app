import { Logger } from '@nestjs/common';
import { existsSync } from 'fs';
import { resolve } from 'path';

export function getEnvPath(dest: string): string {
  const logger = new Logger('bootstrap');

  const env: string | undefined = process.env.NODE_ENV;
  logger.log(`NODE_ENV: ${env}`);
  const fallback: string = resolve(`${dest}/.env`);
  const filename: string = env ? `.env.${env}` : '.env.development';
  let filePath: string = resolve(`${dest}/${filename}`);

  if (!existsSync(filePath)) {
    filePath = fallback;
  }

  return filePath;
}
