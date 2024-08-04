// import {
//   CanActivate,
//   ExecutionContext,
//   ForbiddenException,
//   Injectable,
// } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { Observable } from 'rxjs';
// import { ROLES_KEY, Roles } from './roles.decorator';
// import { Role } from './role.enum';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
//       context.getHandler(),
//       context.getClass(),
//     ]);
//     if (!roles) {
//       return true;
//     }
//     // const request = context.switchToHttp().getRequest();
//     // const user = request.user;
//     const user = { name: 'Nest User', roles: ['nest-admin'] };

//     if (matchRoles(roles, user.roles)) {
//       return true;
//     }

//     throw new ForbiddenException('');
//   }
// }

// function matchRoles(expectedRoles: string[], currentUserRoles: string[]) {
//   for (let role of expectedRoles) {
//     if (currentUserRoles.includes(role)) {
//       return true;
//     }
//   }

//   return false;
// }
