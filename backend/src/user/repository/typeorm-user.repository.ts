import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity, UserRole } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TypeOrmUserRepository extends UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>
  ) {
    super();
  }

  async getById(userId: number): Promise<UserEntity | null> {
    const qb = this.userRepo.createQueryBuilder('u');
    const user = await qb.where('u.id = :id', { id: userId }).getOne();
    return user;
  }

  async verifyRole(userId: number, role: UserRole): Promise<boolean> {
    const qb = this.userRepo.createQueryBuilder('u');
    const user = await qb.where('u.id = :id', { id: userId }).getOne();
    if (user && user.role == role) {
      return true;
    }
    return false;
  }

  async createUser(
    email: string,
    role: UserRole,
    termsAgreedAt?: Date
  ): Promise<number> {
    const saved = await this.userRepo.save({ email, role, termsAgreedAt });
    return saved.id;
  }

  async findByEmail(email: string): Promise<number | null> {
    const qb = this.userRepo.createQueryBuilder('u');
    const user = await qb.where('u.email = :email', { email }).getOne();

    if (user) {
      return user.id;
    }

    return null;
  }

  async setFirstLoginAtIfNull(userId: number): Promise<boolean> {
    const qb = this.userRepo.createQueryBuilder('u');
    const result = await qb
      .update(UserEntity)
      .set({ firstLoginAt: () => 'CURRENT_TIMESTAMP' })
      .where('id = :id', { id: userId })
      .andWhere('first_login_at IS NULL')
      .execute();

    return (result.affected ?? 0) > 0;
  }

  async getBalanceById(userId: number): Promise<number | null> {
    const user = await this.userRepo
      .createQueryBuilder('u')
      .where('u.id = :id', { id: userId })
      .getOne();

    if (!user) {
      return null;
    }

    return user.balance;
  }
}
