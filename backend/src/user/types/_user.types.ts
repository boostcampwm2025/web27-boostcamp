export type Role = 'ADVERTISER' | 'PUBLISHER' | 'ADMIN';

export type User = {
  id: number;
  email: string;
  role: Role;
  balance: number;
  createdAt: Date;
  deletedAt: Date | null;
};
