import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import {
  AuthorizationOptions,
  PRE_AUTHORIZE_KEY,
} from './authorization.decorators';
import { Role } from './role.enum';
import { Request } from 'express';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const authorizationOptions = this.reflector.getAllAndOverride<
      AuthorizationOptions<Role>
    >(PRE_AUTHORIZE_KEY, [context.getHandler(), context.getClass()]);

    if (!authorizationOptions) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const authentication = request.authentication;

    if (!authentication) {
      throw new UnauthorizedException({
        message: 'Unauthorized Access',
        error: 'Could not authenticate',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    if (
      authentication.authorities.some((grantedAuthority) =>
        authorizationOptions.tokens?.length
          ? authorizationOptions.tokens.some(
              (token) => String(token) === grantedAuthority.toString(),
            )
          : true,
      )
    ) {
      return true;
    }

    throw new ForbiddenException({
      message: 'Forbidden Access',
      error:
        authorizationOptions.violationOptions?.message ||
        'You lack sufficient privileges to perform this action',
      statusCode: HttpStatus.FORBIDDEN,
    });
  }
}
