import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { compare } from 'bcrypt';
import { LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(dto: LoginDto) {
    const user = await this.userService.getUserByEmail(dto.email);
    if (!user) throw new NotFoundException('User not found');
    const isPasswordValid = await compare(dto.password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials!');

    return { id: user.id };
  }
}
