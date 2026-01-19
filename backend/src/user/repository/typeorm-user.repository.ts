import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TypeOrmUserRepository extends UserRepository {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>
  ) {
    super();
  }

  async getById(userId: number): Promise<User | null> {
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
  async createUser(email: string): Promise<number> {
    const user = await this.userRepo.save({ email });
    return user.id;
  }
}
