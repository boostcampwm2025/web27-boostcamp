import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { OAuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OAuthAccount } from './entities/oauth-account.entity';
import { OAuthAccountRepository } from './repository/oauthaccount.repository';
import { TypeOrmOAuthAccountRepository } from './repository/typeorm-oauthaccount.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OAuthAccount]), UserModule],
  controllers: [AuthController],
  providers: [
    OAuthService,
    {
      provide: OAuthAccountRepository,
      useClass: TypeOrmOAuthAccountRepository,
    },
  ],
})
export class AuthModule {}
