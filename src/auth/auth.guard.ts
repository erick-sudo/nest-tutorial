import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from './auth.constants';
import { UsersService } from 'src/users/users.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/decorators/route.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      // 💡 Skip auth
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    return this.validateRequest(request);
  }

  async validateRequest(request: Request) {
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Authentication details not found');
    }
    const payload = await this.jwtService
      .verifyAsync(token, {
        secret: jwtConstants.secret,
      })
      .catch((_err) => {
        throw new UnauthorizedException(
          'Invalid or expired authentication details',
        );
      });

    const email = payload.email;
    const user = await this.usersService.findByEmail(email).catch((_err) => {
      throw new UnauthorizedException(
        'Sorry! User with the provided authentication details could not be verified',
      );
    });

    // Insert user details here

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

// request['auth'] = {principal: {user.}}
