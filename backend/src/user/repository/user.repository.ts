// import { Role } from '../../types/user.types';
// import { User } from '../../types/user.types';

import { User, UserRole } from 'src/user/entities/user.entity';

export abstract class UserRepository {
  abstract getById(userId: number): Promise<User | null>;
  abstract verifyRole(userId: number, role: UserRole): Promise<boolean>;
  abstract createUser(email: string): Promise<number>;
}
