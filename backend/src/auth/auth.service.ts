import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import axios from 'axios';
import { randomUUID } from 'crypto';
import { createRemoteJWKSet, jwtVerify } from 'jose';

export type GoogleTokenResponse = {
  access_token: string;
  expires_in: number;
  scope?: string;
  token_type: string;
  id_token?: string;
  refresh_token?: string;
};

export type GoogleTokenErrorResponse = {
  error?: string;
  error_description?: string;
};

export type GoogleIdTokenPayload = {
  iss: string;
  aud: string;
  sub: string;
  exp: number;
  iat: number;
  email?: string;
  email_verified?: 'true' | 'false' | boolean;
  name?: string;
  picture?: string;
};

const googleJWKS = createRemoteJWKSet(
  new URL('https://www.googleapis.com/oauth2/v3/certs')
);

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

  async getTokensFromGoogle(code: string): Promise<GoogleTokenResponse> {
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

    try {
      const { data } = await axios.post<GoogleTokenResponse>(
        'https://oauth2.googleapis.com/token',
        body,
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );

      if (data.id_token) {
        await this.verifyGoogleIdToken(data.id_token, client_id);
      } else {
        throw new BadGatewayException(
          'Google 서버의 응답에 id 토큰이 존재하지 않습니다.'
        );
      }

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const data = error.response?.data as
          | GoogleTokenErrorResponse
          | undefined;
        const message =
          data?.error && data?.error_description
            ? `${data.error}: ${data.error_description}`
            : (data?.error ??
              data?.error_description ??
              'Google로부터 토큰을 받아오지 못했습니다.');

        if (status === 401) {
          throw new UnauthorizedException(message);
        }
        throw new BadRequestException(message);
      }
      throw error;
    }
  }

  async verifyGoogleIdToken(
    idToken: string,
    clientId: string
  ): Promise<GoogleIdTokenPayload> {
    const { payload } = await jwtVerify(idToken, googleJWKS, {
      issuer: ['https://accounts.google.com', 'accounts.google.com'],
      audience: clientId,
    });

    return payload as unknown as GoogleIdTokenPayload;
  }
}
