import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Blog } from '../../blog/entities/blog.entity';
import { Campaign } from '../../campaign/entities/campaign.entity';

export enum UserRole {
  PUBLISHER = 'PUBLISHER',
  ADVERTISER = 'ADVERTISER',
  ADMIN = 'ADMIN',
}

@Entity('User')
export class User {
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

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  // Relations
  @OneToMany(() => Blog, (blog) => blog.user)
  blogs: Blog[];

  @OneToMany(() => Campaign, (campaign) => campaign.user)
  campaigns: Campaign[];
}
