import { Controller, Get } from '@nestjs/common';
import { OAuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly oauthService: OAuthService) {}

  @Get('google')
  redirectToGoogleAuth() {
    this.oauthService.getGoogleAuthUrl();
  }
}
