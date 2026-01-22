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
import { UserRepository } from 'src/user/repository/user.repository.interface';
import { OAuthAccountRepository } from './repository/oauthaccount.repository.interface';
import { OAuthProvider } from './entities/oauth-account.entity';
import { CacheRepository } from 'src/cache/repository/cache.repository.interface';

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
export type OAuthState =
  | { intent: 'login' }
  | { intent: 'register'; role: UserRole };

export type StoredOAuthState = OAuthState & { expiresAt: number };

export type AuthorizeResult = {
  isNew: boolean;
  jwt?: string;
  role?: UserRole;
};

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
    private readonly oauthAccountRepository: OAuthAccountRepository,
    private readonly cacheRepository: CacheRepository
  ) {}

  async getGoogleAuthUrl(intent: AuthIntent, role?: UserRole): Promise<string> {
    const { GOOGLE_CLIENT_ID: clientId, GOOGLE_REDIRECT_URI: redirectUri } =
      process.env;

    if (!clientId || !redirectUri) {
      throw new Error('Google OAuth env가 누락되었습니다.');
    }

    const state = randomUUID();

    const expiresAt = Date.now() + 10 * 60 * 1000;

    // TODO(후순위): 명시적 타입 가드 때문에 길어짐 추후에 리팩토링 필요할 거 같음
    if (intent === 'register') {
      if (role !== UserRole.ADVERTISER && role !== UserRole.PUBLISHER) {
        throw new BadRequestException('role이 올바르지 않습니다.');
      }

      const stateData: StoredOAuthState = {
        expiresAt,
        intent: 'register',
        role,
      };

      await this.cacheRepository.setOAuthState(
        state,
        stateData,
        15 * 60 * 1000
      );
    } else {
      const stateData: StoredOAuthState = {
        expiresAt,
        intent: 'login',
      };

      await this.cacheRepository.setOAuthState(
        state,
        stateData,
        15 * 60 * 1000
      );
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      state,
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  async validateState(state: string): Promise<OAuthState> {
    const data = await this.cacheRepository.getOAuthState(state);
    if (!data) throw new UnauthorizedException('잘못된 state입니다.');

    if (data.expiresAt < Date.now()) {
      await this.cacheRepository.deleteOAuthState(state);
      throw new UnauthorizedException('만료된 state입니다.');
    }

    // 사용 후 삭제 (일회용)
    await this.cacheRepository.deleteOAuthState(state);

    if (data.intent === 'register') {
      if (!data.role) {
        throw new BadRequestException('role이 누락되었습니다.');
      }
      return { intent: 'register', role: data.role };
    }

    return { intent: 'login' };
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
    payload: GoogleIdTokenPayload,
    state: OAuthState
  ): Promise<AuthorizeResult> {
    const { sub, email, email_verified } = payload;
    const provider = OAuthProvider.GOOGLE;
    const userId = await this.oauthAccountRepository.findUserIdByProviderSub(
      provider,
      sub
    );
    const role = state.intent === 'register' ? state.role : undefined;
    const isEmailVerified =
      email_verified === true || email_verified === 'true';

    // 회원가입
    if (!userId) {
      if (!email || !isEmailVerified) {
        throw new UnauthorizedException('이메일 검증이 필요합니다.');
      }

      // login intent에서는 신규 생성하지 않음
      if (state.intent === 'login') return { isNew: true };

      if (await this.userRepository.findByEmail(email)) {
        throw new ConflictException('이미 존재하는 이메일입니다.');
      }
      if (!role) {
        throw new BadRequestException('role이 올바르지 않습니다.');
      }
      const id = await this.userRepository.createUser(email, role);
      await this.oauthAccountRepository.createOAuthAccount(
        provider,
        sub,
        email,
        isEmailVerified,
        id
      );

      return { isNew: true };
    }
    // 로그인
    const user = await this.userRepository.getById(userId);
    if (!user) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }

    // register intent인데 기존 유저인 경우: 자동 로그인 금지
    if (state.intent === 'register') {
      return { isNew: false };
    }

    const jwt = await this.issueAccessToken({
      userId,
      email: user.email,
      role: user.role,
    });
    return { isNew: false, jwt, role: user.role };
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
