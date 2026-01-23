import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { OAuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OAuthAccountEntity } from './entities/oauth-account.entity';
import { OAuthAccountRepository } from './repository/oauthaccount.repository.interface';
import { TypeOrmOAuthAccountRepository } from './repository/typeorm-oauthaccount.repository';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OAuthAccountEntity]),
    UserModule,
    CacheModule,
  ],
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
