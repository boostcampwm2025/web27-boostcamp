import { Module } from '@nestjs/common';
import { UserRepository } from './repository/user/user.repository';
import { JsonUserRepository } from './repository/user/json-user.repository';

@Module({
  providers: [{ provide: UserRepository, useClass: JsonUserRepository }],
  exports: [UserRepository],
})
export class UserModule {}
