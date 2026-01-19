export abstract class OAuthAccountRepository {
  abstract getUserIdByProviderSub(
    provider: string,
    sub: string
  ): Promise<number | null>;
}
