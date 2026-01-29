import { Module } from '@nestjs/common';
import { UserRepository } from './repository/user.repository.interface';
import { TypeOrmUserRepository } from './repository/typeorm-user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    { provide: UserRepository, useClass: TypeOrmUserRepository },
    UserService,
  ],
  exports: [UserRepository, UserService],
})
export class UserModule {}
