import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Roles } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    // const request = context.switchToHttp().getRequest();
    // const user = request.user;
    const user = { name: 'Nest User', roles: ['nest-admin'] };
    return matchRoles(roles, user.roles);
  }
}

function matchRoles(expectedRoles: string[], currentUserRoles: string[]) {
  for (let role of expectedRoles) {
    if (currentUserRoles.includes(role)) {
      return true;
    }
  }

  return false;
}
