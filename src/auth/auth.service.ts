import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from './strategy/jwt/jwt.payload';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    @Inject(ConfigService) private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user: User = await this.userService.findUserByEmail(email);

      if (!user) {
        throw new UnauthorizedException('Incorrect Credentials');
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        throw new UnauthorizedException('Incorrect Credentials');
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      delete user.password;
      return user;
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }

  async validate(payload: JwtPayload): Promise<any> {
    const user = await this.userService.findUserById(+payload.sub);
    if (!user) {
      throw new UnauthorizedException(
        'You are not authorized to perform the operation',
      );
    }
    delete user.password;
    return user;
  }

  async generateToken(user: User): Promise<any> {
    const payload: JwtPayload = {
      sub: user.id.toString(),
    };
    return {
      expiresIn: this.configService.get<string>('JWT_EXPIRATION_TIME'),
      accessToken: this.jwtService.sign({ ...payload }),
    };
  }
}
