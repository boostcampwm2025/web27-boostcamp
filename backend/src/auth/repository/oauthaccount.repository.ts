export abstract class OAuthAccountRepository {
  abstract findUserIdByProviderSub(
    provider: string,
    sub: string
  ): Promise<number | null>;

  //   abstract createOAuthAccount(
  //     provider: string,
  //     sub: string,
  //     email: string,
  //     email_verified: boolean,
  //     userId: number
  //   ): Promise<void>;
}
