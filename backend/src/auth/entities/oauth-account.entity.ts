import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

export enum OAuthProvider {
  GOOGLE = 'GOOGLE',
}

@Entity('OAuthAccount')
@Index('uq_oauth_provider_subject', ['provider', 'providerSubject'], {
  unique: true,
})
@Index('uq_oauth_user_provider', ['userId', 'provider'], { unique: true })
export class OAuthAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({
    type: 'enum',
    enum: OAuthProvider,
  })
  provider: OAuthProvider;

  @Column({
    name: 'provider_subject',
    type: 'varchar',
    length: 255,
    comment: 'ex) Google sub',
  })
  providerSubject: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'provider에서 받은 email (옵션)',
  })
  email: string | null;

  @Column({
    name: 'email_verified',
    type: 'boolean',
    nullable: true,
    comment: 'provider에서 받은 email 검증 여부 (옵션)',
  })
  emailVerified: boolean | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.oauthAccounts)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
