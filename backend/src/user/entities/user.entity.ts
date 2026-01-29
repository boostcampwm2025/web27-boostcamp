import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { BlogEntity } from '../../blog/entities/blog.entity';
import { CampaignEntity } from '../../campaign/entities/campaign.entity';
import { OAuthAccountEntity } from '../../auth/entities/oauth-account.entity';
import { UserCredentialEntity } from '../../auth/entities/user-credential.entity';
import { CreditHistoryEntity } from '../../advertiser/entities/credit-history.entity';

export enum UserRole {
  PUBLISHER = 'PUBLISHER',
  ADVERTISER = 'ADVERTISER',
  ADMIN = 'ADMIN',
}

@Entity('User')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PUBLISHER,
  })
  role: UserRole;

  @Column({ type: 'int', default: 0, comment: '광고주 예산 잔액 (KRW)' })
  balance: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'first_login_at', type: 'datetime', nullable: true })
  firstLoginAt: Date | null;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  // Relations
  @OneToMany(() => BlogEntity, (blog) => blog.user)
  blogs: BlogEntity[];

  @OneToMany(() => CampaignEntity, (campaign) => campaign.user)
  campaigns: CampaignEntity[];

  @OneToMany(() => OAuthAccountEntity, (oauthAccount) => oauthAccount.user)
  oauthAccounts: OAuthAccountEntity[];

  @OneToOne(() => UserCredentialEntity, (credential) => credential.user)
  credential: UserCredentialEntity;

  @OneToMany(() => CreditHistoryEntity, (creditHistory) => creditHistory.user)
  creditHistories: CreditHistoryEntity[];
}
