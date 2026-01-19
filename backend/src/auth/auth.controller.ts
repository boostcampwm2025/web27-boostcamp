import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Res,
} from '@nestjs/common';
import { OAuthService } from './auth.service';
import { type Response } from 'express';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly oauthService: OAuthService) {}

  // 구글 로그인 페이지로 리다이렉트 하기 위한 요청 받음
  @Get('google')
  @Public()
  redirectToGoogleAuth(@Res() res: Response): void {
    const url = this.oauthService.getGoogleAuthUrl();
    return res.redirect(url);
  }

  @Get('google/callback')
  @Public()
  async handleRedirectCallback(
    @Res() res: Response,
    @Query('state') state: string,
    @Query('code') code: string,
    @Query('error') error?: string,
    @Query('error_description') errorDescription?: string
  ) {
    if (error) {
      throw new BadRequestException(errorDescription ?? error);
    }
    if (!code) {
      throw new BadRequestException('code가 없습니다.');
    }
    if (!state) {
      throw new BadRequestException('state가 없습니다.');
    }
    this.oauthService.validateState(state);

    const payload = await this.oauthService.getTokensFromGoogle(code);
    const jwt = await this.oauthService.authorizeUserByToken(payload);

    if (jwt) {
      res.cookie('access_token', jwt, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60 * 1000,
      });
    }

    const clientUrl = process.env.CLIENT_URL ?? 'http://localhost:5173';
    const redirectUrl = jwt
      ? `${clientUrl}/auth/login`
      : `${clientUrl}/auth/register`;

    return res.redirect(redirectUrl);
  }
}
