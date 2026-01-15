import { OAuthProvider } from '../../types/oauth-account.types';

export abstract class OAuthAccountRepository {
  abstract getUserByProviderSub(
    provider: OAuthProvider,
    sub: string
  ): number | undefined;
}
