import { OAuthProvider } from '../entities/oauth-account.entity';

export abstract class OAuthAccountRepository {
  abstract findUserIdByProviderSub(
    provider: string,
    sub: string
  ): Promise<number | null>;

  abstract createOAuthAccount(
    provider: OAuthProvider,
    sub: string,
    email: string,
    isEmailVerified: boolean,
    id: number
  ): Promise<void>;
}
