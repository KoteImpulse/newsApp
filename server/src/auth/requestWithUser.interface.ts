import { Request } from 'express';
import { User } from 'src/user/entities/user.entity';

interface RequestWithUser extends Request {
  user: User;
  // accessToken?: string;
  // refreshToken?: string;
}

export default RequestWithUser;
