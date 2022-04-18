import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  mixin,
  Type,
} from '@nestjs/common';
import { RolesForUsers } from 'src/user/entities/user.entity';
import RequestWithUser from '../requestWithUser.interface';

const RoleGuard = (
  role1: RolesForUsers,
  role2?: RolesForUsers,
): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;

      if (user?.role.includes(role1) || user?.role.includes(role2)) {
        return true;
      } else {
        throw new BadRequestException(
          'Нет достаточных прав для этого действия',
        );
      }
    }
  }

  return mixin(RoleGuardMixin);
};

export default RoleGuard;
