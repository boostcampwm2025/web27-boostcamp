export type OAuthProvider = 'GOOGLE';

export type OAuthAccount = {
  userId: number;
  provider: OAuthProvider;
  providerSubject: string;
  email?: string;
  emailVerified?: boolean;
  createdAt: Date;
};
