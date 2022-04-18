import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  mixin,
  Type,
} from '@nestjs/common';
import Permission from 'src/user/permission.type';
import RequestWithUser from '../requestWithUser.interface';
import { JwtRefreshTokenGuard } from './jwtRefresh.guard';

const PermissionGuard = (permission: Permission): Type<CanActivate> => {
  class PermissionGuardMixin extends JwtRefreshTokenGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;
      if (user?.permissions.includes(permission)) {
        return true;
      } else {
        throw new BadRequestException(
          'Нет достаточных прав для этого действия',
        );
      }
    }
  }

  return mixin(PermissionGuardMixin);
};

export default PermissionGuard;
