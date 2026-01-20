import type { UserRole } from 'src/user/entities/user.entity';

declare global {
  namespace Express {
    interface User {
      userId: number;
      role: UserRole;
      email?: string;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};
