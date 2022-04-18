import { RolesForUsers } from 'src/user/entities/user.entity';

export interface AccessTokenPayload {
  email: string;
  id: number;
  createdAt: Date;
  isActivated: boolean;
}
export interface RefreshTokenPayload {
  email: string;
  id: number;
  createdAt: Date;
  isActivated: boolean;
  activationLink: string;
  role: RolesForUsers
}
