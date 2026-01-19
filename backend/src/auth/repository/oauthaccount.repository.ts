export abstract class OAuthAccountRepository {
  abstract findUserIdByProviderSub(
    provider: string,
    sub: string
  ): Promise<number | null>;
}
