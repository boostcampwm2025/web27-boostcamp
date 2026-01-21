import {
  Entity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
  PrimaryColumn,
  OneToMany,
  type Relation,
} from 'typeorm';
import type { User } from '../../user/entities/user.entity';
import type { Tag } from '../../tag/entities/tag.entity';
import type { BidLogEntity } from '../../bid-log/entities/bid-log.entity';
import type { ViewLogEntity } from '../../log/entities/view-log.entity';
import * as UserEntity from '../../user/entities/user.entity';
import * as TagEntity from '../../tag/entities/tag.entity';
import * as BidLogEntityModule from '../../bid-log/entities/bid-log.entity';
import * as ViewLogEntityModule from '../../log/entities/view-log.entity';

export enum CampaignStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  ENDED = 'ENDED',
}

@Entity('Campaign')
export class Campaign {
  @PrimaryColumn({ type: 'varchar', length: 255, comment: 'UUID' })
  id: string;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ type: 'varchar', length: 255, comment: '광고 제목' })
  title: string;

  @Column({ type: 'text', comment: '광고 설명 내용' })
  content: string;

  @Column({ type: 'varchar', length: 255, comment: '광고 이미지 URL' })
  image: string;

  @Column({ type: 'varchar', length: 255, comment: '광고 클릭 시 이동 URL' })
  url: string;

  @Column({ name: 'max_cpc', type: 'int', comment: '최대 클릭 비용 (KRW)' })
  maxCpc: number;

  @Column({ name: 'daily_budget', type: 'int', comment: '일일 예산 (KRW)' })
  dailyBudget: number;

  @Column({
    name: 'total_budget',
    type: 'int',
    nullable: true,
    comment: '총 예산 (옵션, KRW)',
  })
  totalBudget: number | null;

  @Column({
    name: 'is_high_intent',
    type: 'boolean',
    default: false,
    comment: '고의도 타겟팅',
  })
  isHighIntent: boolean;

  @Column({
    type: 'enum',
    enum: CampaignStatus,
    default: CampaignStatus.PENDING,
  })
  status: CampaignStatus;

  @Column({ name: 'start_date', type: 'datetime' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'datetime' })
  endDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  // Relations
  @ManyToOne(() => UserEntity.User, (user: User) => user.campaigns)
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @ManyToMany(() => TagEntity.Tag, (tag: Tag) => tag.campaigns)
  @JoinTable({
    name: 'CampaignTag',
    joinColumn: { name: 'campaign_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Relation<Tag[]>;

  @OneToMany(
    () => BidLogEntityModule.BidLogEntity,
    (bidLog: BidLogEntity) => bidLog.campaign
  )
  bidLogs: Relation<BidLogEntity[]>;

  @OneToMany(
    () => ViewLogEntityModule.ViewLogEntity,
    (viewLog: ViewLogEntity) => viewLog.campaign
  )
  viewLogs: Relation<ViewLogEntity[]>;
}
