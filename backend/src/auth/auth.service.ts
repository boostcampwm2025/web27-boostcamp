import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import axios from 'axios';
import { randomUUID } from 'crypto';
import { createRemoteJWKSet, jwtVerify, SignJWT } from 'jose';
import { UserRole } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/repository/user.repository';
import { OAuthAccountRepository } from './repository/oauthaccount.repository';
import { OAuthProvider } from './entities/oauth-account.entity';

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

export type AuthIntent = 'login' | 'register';

const googleJWKS = createRemoteJWKSet(
  new URL('https://www.googleapis.com/oauth2/v3/certs')
);

const getJwtSecret = () => {
  const value = process.env.JWT_SECRET;
  if (!value) {
    throw new Error('JWT_SECRET가 존재하지 않습니다.');
  }
  return new TextEncoder().encode(value);
};

@Injectable()
export class OAuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly oauthAccountRepository: OAuthAccountRepository
  ) {}

  private readonly stateStore = new Map<
    string,
    { expiresAt: number; intent: AuthIntent }
  >(); // 추후에 Redis로 이동

  getGoogleAuthUrl(intent: AuthIntent): string {
    const { GOOGLE_CLIENT_ID: clientId, GOOGLE_REDIRECT_URI: redirectUri } =
      process.env;

    if (!clientId || !redirectUri) {
      throw new Error('Google OAuth env가 누락되었습니다.');
    }

    const state = randomUUID();

    this.stateStore.set(state, {
      expiresAt: Date.now() + 10 * 60 * 1000,
      intent,
    });

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
    const data = this.stateStore.get(state);
    if (!data) throw new UnauthorizedException('잘못된 state입니다.');

    if (data.expiresAt < Date.now()) {
      this.stateStore.delete(state);
      throw new UnauthorizedException('만료된 state입니다.');
    }

    this.stateStore.delete(state);
    return data.intent;
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

  async getTokensFromGoogle(code: string): Promise<GoogleIdTokenPayload> {
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
      // todo: verifyGoogleIdToken으로 받은 idToken Payload를 기반으로 OauthAccount 과 User 테이블에 사용자 정보를 저장하거나 로그인 처리하는 로직필요
      if (data.id_token) {
        const payload = await this.verifyGoogleIdToken(
          data.id_token,
          client_id
        );
        return payload;
      } else {
        throw new BadGatewayException(
          'Google 서버의 응답에 id 토큰이 존재하지 않습니다.'
        );
      }
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

  async authorizeUserByToken(
    payload: GoogleIdTokenPayload
  ): Promise<void | string> {
    const { sub, email, email_verified } = payload;
    const provider = OAuthProvider.GOOGLE;
    const userId = await this.oauthAccountRepository.findUserIdByProviderSub(
      provider,
      sub
    );
    const isEmailVerified =
      email_verified === true || email_verified === 'true';
    // 회원가입
    if (!userId) {
      if (!email || !isEmailVerified) {
        throw new UnauthorizedException('이메일 검증이 필요합니다.');
      }
      if (await this.userRepository.findByEmail(email)) {
        throw new ConflictException('이미 존재하는 이메일입니다.');
      }
      const id = await this.userRepository.createUser(email);
      await this.oauthAccountRepository.createOAuthAccount(
        provider,
        sub,
        email,
        isEmailVerified,
        id
      );

      return;
    }
    // 로그인
    const user = await this.userRepository.getById(userId);
    if (!user) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }

    const jwt = await this.issueAccessToken({
      userId,
      email: user.email,
      role: user.role,
    });
    return jwt;
  }

  async issueAccessToken(payload: {
    userId: number;
    role: UserRole;
    email?: string;
  }): Promise<string> {
    const jwt = await new SignJWT({
      role: payload.role,
      email: payload.email,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(String(payload.userId))
      .setIssuedAt()
      .setExpirationTime('15m')
      .sign(getJwtSecret());

    return jwt;
  }
}
