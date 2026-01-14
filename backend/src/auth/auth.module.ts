import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { OAuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [OAuthService],
})
export class AuthModule {}
