import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Res,
} from '@nestjs/common';
import { type AuthIntent, OAuthService } from './auth.service';
import { type Response } from 'express';
import { Public } from './decorators/public.decorator';
import { UserRole } from 'src/user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly oauthService: OAuthService) {}

  // 구글 로그인 페이지로 리다이렉트 하기 위한 요청 받음
  @Get('google')
  @Public()
  redirectToGoogleAuth(
    @Res() res: Response,
    @Query('intent') intent: AuthIntent,
    @Query('role') role?: UserRole
  ): void {
    if (intent !== 'login' && intent !== 'register') {
      throw new BadRequestException('잘못된 접근입니다.');
    }

    if (intent === 'login' && role) {
      throw new BadRequestException('login 요청에는 role을 보낼 수 없습니다.');
    }

    if (intent === 'register') {
      if (role !== UserRole.ADVERTISER && role !== UserRole.PUBLISHER) {
        throw new BadRequestException('role이 올바르지 않습니다.');
      }
    }

    const url = this.oauthService.getGoogleAuthUrl(
      intent,
      intent === 'register' ? role : undefined
    );
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
    const stateData = this.oauthService.validateState(state);
    const payload = await this.oauthService.getTokensFromGoogle(code);

    const result = await this.oauthService.authorizeUserByToken(
      payload,
      stateData
    );

    const clientUrl = process.env.CLIENT_URL ?? 'http://localhost:5173';
    let redirectUrl = `${clientUrl}/auth/login`;

    if (stateData.intent === 'login') {
      if (result.isNew) {
        redirectUrl = `${clientUrl}/auth/register?reason=not_found`;
      } else {
        if (result.jwt) {
          res.cookie('access_token', result.jwt, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 15 * 60 * 1000,
          });
        }
        redirectUrl =
          result.role === UserRole.PUBLISHER
            ? `${clientUrl}/publisher/dashboard`
            : `${clientUrl}/advertiser/dashboard`;
      }
    } else {
      redirectUrl = result.isNew
        ? `${clientUrl}/auth/login?reason=registered`
        : `${clientUrl}/auth/login?reason=already_exists`;
    }

    return res.redirect(redirectUrl);
  }
}
