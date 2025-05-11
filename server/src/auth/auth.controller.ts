import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Response,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoacalAuthGuard } from 'src/guard/local-auth.guard';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { LoginDto } from './dto/auth.dto';
import { RefreshAuthGuard } from 'src/guard/refresh-jwt-auth.guard';
import { GithubAuthGuard } from 'src/guard/github-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(LoacalAuthGuard)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refreshToken(@Request() request) {
    return this.authService.refreshToken(request.user);
  }

  @UseGuards(GithubAuthGuard)
  @Get('github/login')
  async githubLogin() {}

  @UseGuards(GithubAuthGuard)
  @Get('github/callback')
  async githubCallback(@Request() request, @Response() response) {
    const { user, tokens } = request.user;

    response.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });

    response.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });

    response.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }
}
