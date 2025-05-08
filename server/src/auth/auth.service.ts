import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { compare } from 'bcrypt';
import { LoginDto } from './dto/auth.dto';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import { JwtService } from '@nestjs/jwt';
import refreshJwtConfig from './config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials!');

    return { id: user.id };
  }

  async login(dto: LoginDto) {
    const user = await this.userService.getUserByEmail(dto.email);

    const payload: AuthJwtPayload = {
      id: user.id,
      sub: { username: user.username, email: user.email },
    };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, this.refreshTokenConfig);

    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  async refreshToken(user: User, token: string) {
    const userFromDb = await this.userService.getUserById(user.id);

    const payload: AuthJwtPayload = {
      id: userFromDb.id,
      sub: { username: userFromDb.username, email: userFromDb.email },
    };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
    };
  }
}
