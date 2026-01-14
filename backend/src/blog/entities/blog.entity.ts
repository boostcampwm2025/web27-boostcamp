/* eslint-disable @typescript-eslint/no-unsafe-return */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { BidLog } from '../../bid-log/entities/bid-log.entity';
import { ViewLog } from '../../log/entities/view-log.entity';

@Entity('Blog')
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  domain: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({
    name: 'blog_key',
    type: 'varchar',
    length: 255,
    unique: true,
    comment: 'SDK 연동용 공개 키',
  })
  blogKey: string;

  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  // Relations
  @ManyToOne(() => User, (user) => user.blogs)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => BidLog, (bidLog) => bidLog.blog)
  bidLogs: BidLog[];

  @OneToMany(() => ViewLog, (viewLog) => viewLog.blog)
  viewLogs: ViewLog[];
}
