import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { randomUUID } from 'crypto';

export type GoogleTokenResponse = {
  access_token: string;
  expires_in: number;
  scope?: string;
  token_type: string;
  id_token?: string;
  refresh_token?: string;
};

@Injectable()
export class OAuthService {
  private readonly stateStore = new Map<string, number>(); // 추후에 Redis로 이동

  getGoogleAuthUrl(): string {
    const { GOOGLE_CLIENT_ID: clientId, GOOGLE_REDIRECT_URI: redirectUri } =
      process.env;

    if (!clientId || !redirectUri) {
      throw new Error('Google OAuth env가 누락되었습니다.');
    }

    const state = randomUUID();

    this.stateStore.set(state, Date.now() + 10 * 60 * 1000);

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      state,
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  validateState(state: string) {
    const expiresAt = this.stateStore.get(state);
    if (!expiresAt) throw new UnauthorizedException('잘못된 state입니다.');

    if (expiresAt < Date.now()) {
      this.stateStore.delete(state);
      throw new UnauthorizedException('만료된 state입니다.');
    }

    this.stateStore.delete(state);
  }

  async getTokenFromGoogle(code: string): Promise<GoogleTokenResponse> {
    const {
      GOOGLE_CLIENT_ID: client_id,
      GOOGLE_CLIENT_SECRET: client_secret,
      GOOGLE_REDIRECT_URI: redirect_uri,
    } = process.env;

    if (!client_id || !client_secret || !redirect_uri)
      throw new Error('Google OAuth env가 누락되었습니다.');

    const body = new URLSearchParams({
      code,
      client_id,
      client_secret,
      redirect_uri,
      grant_type: 'authorization_code',
    });

    const { data } = await axios.post<GoogleTokenResponse>(
      'https://oauth2.googleapis.com/token',
      body,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );
    return data;
  }
}
