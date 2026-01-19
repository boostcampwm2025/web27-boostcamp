import { Module } from '@nestjs/common';
import { UserRepository } from './repository/user/user.repository';
import { TypeOrmUserRepository } from './repository/user/typeorm-user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
// import { JsonUserRepository } from './repository/user/json-user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [{ provide: UserRepository, useClass: TypeOrmUserRepository }],
  exports: [UserRepository],
})
export class UserModule {}
