import { Role } from '../types/user.types';
import { User } from '../types/user.types';

export abstract class UserRepository {
  abstract getById(userId: number): User | undefined;
  abstract verifyRole(userId: number, role: Role): boolean;
}
