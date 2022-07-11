import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  getHello(): string {
    return 'Hello, nest! A progressive Node.js framework for building efficient, reliable and scalable server-side applications.';
  }
}
