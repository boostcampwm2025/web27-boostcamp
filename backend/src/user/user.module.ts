import { Module } from '@nestjs/common';
import { UserRepository } from './repository/user/user.repository';
// import { JsonUserRepository } from './repository/user/json-user.repository';
import { TypeOrmUserRepository } from './repository/user/typeorm-user.repository';

@Module({
  providers: [{ provide: UserRepository, useClass: TypeOrmUserRepository }],
  exports: [UserRepository],
})
export class UserModule {}
