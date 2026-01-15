import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  type Relation,
} from 'typeorm';
import type { User } from '../../user/entities/user.entity';
import type { BidLog } from '../../bid-log/entities/bid-log.entity';
import type { ViewLog } from '../../log/entities/view-log.entity';

import * as UserEntity from '../../user/entities/user.entity';
import * as BidLogEntity from '../../bid-log/entities/bid-log.entity';
import * as ViewLogEntity from '../../log/entities/view-log.entity';

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
  @ManyToOne(() => UserEntity.User, (user: User) => user.blogs)
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @OneToMany(() => BidLogEntity.BidLog, (bidLog: BidLog) => bidLog.blog)
  bidLogs: Relation<BidLog>[];

  @OneToMany(() => ViewLogEntity.ViewLog, (viewLog: ViewLog) => viewLog.blog)
  viewLogs: Relation<ViewLog>[];
}
