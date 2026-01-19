import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Redirect,
  Res,
} from '@nestjs/common';
import { OAuthService } from './auth.service';
import { type Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly oauthService: OAuthService) {}

  // 구글 로그인 페이지로 리다이렉트 하기 위한 요청 받음
  @Get('google')
  redirectToGoogleAuth(@Res() res: Response): void {
    const url = this.oauthService.getGoogleAuthUrl();
    return res.redirect(url);
  }

  @Get('google/callback')
  @Redirect()
  async handleRedirectCallback(
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
    await this.oauthService.authorizeUserByToken(payload);

    return { url: `${process.env.CLIENT_URL}/auth/login` };
  }
}
