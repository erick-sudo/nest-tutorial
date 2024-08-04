import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from 'src/users/user.dtos';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn({ email, password }: SignInDto) {
    const user = await this.usersService.findByEmail(email);
    if (!user.verifyPassword(password)) {
      throw new UnauthorizedException('Wrong password');
    }

    const payload = { sub: user.id, email: user.email };

    return { access_token: await this.jwtService.signAsync(payload, {}) };
  }
}
