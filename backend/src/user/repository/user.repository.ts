import { UserEntity, UserRole } from 'src/user/entities/user.entity';

export abstract class UserRepository {
  abstract getById(userId: number): Promise<UserEntity | null>;
  abstract verifyRole(userId: number, role: UserRole): Promise<boolean>;
  abstract createUser(email: string, role: UserRole): Promise<number>;
  abstract findByEmail(email: string): Promise<number | null>;
}
