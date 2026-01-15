import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { OAuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [OAuthService],
})
export class AuthModule {}
