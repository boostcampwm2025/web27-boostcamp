import { Module } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { TypeOrmUserRepository } from './repository/typeorm-user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [{ provide: UserRepository, useClass: TypeOrmUserRepository }],
  exports: [UserRepository],
  controllers: [UserController],
})
export class UserModule {}
