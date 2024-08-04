import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/decorators/route.decorator';
import { jwtConstants } from '../auth.constants';

export class GrantedAuthority {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  toString() {
    return this.name;
  }
}

export class Principal {
  email: string;
  id: number;
}

export class Authentication {
  #authorities: Array<GrantedAuthority>;
  #principal: Principal;

  private constructor() {
    this.#authorities = [];
  }

  static build(): Authentication {
    return new Authentication();
  }

  addAuthorities(...authorities: Array<GrantedAuthority>): Authentication {
    this.#authorities = this.#authorities.concat(authorities);
    return this;
  }

  setPrincipal(principal: Principal): Authentication {
    this.#principal = principal;
    return this;
  }

  get authorities() {
    return this.#authorities;
  }

  get principal() {
    return this.#principal;
  }
}

declare global {
  namespace Express {
    interface Request {
      authentication?: Authentication;
    }
  }
}

@Injectable()
export class AuthenticationGuard implements CanActivate {
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
    request.authentication = Authentication.build()
      .addAuthorities(new GrantedAuthority('admin'))
      .setPrincipal({ email: user.email, id: user.id });

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

// request['auth'] = {principal: {user.}}
