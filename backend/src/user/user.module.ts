import { Module } from '@nestjs/common';
import { UserRepository } from './repository/user.repository.interface';
import { TypeOrmUserRepository } from './repository/typeorm-user.repository';
import { CreditHistoryRepository } from './repository/credit-history.repository.interface';
import { TypeOrmCreditHistoryRepository } from './repository/typeorm-credit-history.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { CreditHistoryEntity } from './entities/credit-history.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, CreditHistoryEntity])],
  controllers: [UserController],
  providers: [
    { provide: UserRepository, useClass: TypeOrmUserRepository },
    {
      provide: CreditHistoryRepository,
      useClass: TypeOrmCreditHistoryRepository,
    },
    UserService,
  ],
  exports: [UserRepository, CreditHistoryRepository],
})
export class UserModule {}
