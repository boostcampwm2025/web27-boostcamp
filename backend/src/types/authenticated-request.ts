import type { Request } from 'express';
import type { UserRole } from 'src/user/entities/user.entity';

export type AuthenticatedRequest = Request & {
  user: {
    userId: number;
    role: UserRole;
    email?: string;
  };
};
