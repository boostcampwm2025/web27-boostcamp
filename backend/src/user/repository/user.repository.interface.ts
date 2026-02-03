import { UserEntity, UserRole } from 'src/user/entities/user.entity';

export abstract class UserRepository {
  abstract getById(userId: number): Promise<UserEntity | null>;
  abstract verifyRole(userId: number, role: UserRole): Promise<boolean>;
  abstract createUser(
    email: string,
    role: UserRole,
    termsAgreedAt?: Date
  ): Promise<number>;
  abstract findByEmail(email: string): Promise<number | null>;
  abstract setFirstLoginAtIfNull(userId: number): Promise<boolean>;
  abstract getBalanceById(userId: number): Promise<number | null>;
}
