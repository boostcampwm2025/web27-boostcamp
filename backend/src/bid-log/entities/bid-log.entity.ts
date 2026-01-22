import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  type Relation,
} from 'typeorm';
import type { CampaignEntity } from '../../campaign/entities/campaign.entity';
import type { BlogEntity } from '../../blog/entities/blog.entity';
import * as CampaignEntityModule from '../../campaign/entities/campaign.entity';
import * as BlogEntityModule from '../../blog/entities/blog.entity';

import { BidStatus } from '../bid-log.types';

@Entity('BidLog')
export class BidLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'auction_id',
    type: 'varchar',
    length: 255,
    comment: '요청별 고유 UUID',
  })
  auctionId: string;

  @Column({ name: 'campaign_id', type: 'varchar', length: 255 })
  campaignId: string;

  @Column({ name: 'blog_id', type: 'int' })
  blogId: number;

  @Column({ type: 'enum', enum: BidStatus })
  status: BidStatus;

  @Column({ name: 'bid_price', type: 'int', comment: '입찰가 (KRW)' })
  bidPrice: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Glass Box 사유',
  })
  reason: string | null;

  @Column({
    name: 'is_high_intent',
    type: 'boolean',
    default: false,
    comment: '고의도 여부',
  })
  isHighIntent: boolean;

  @Column({
    name: 'behavior_score',
    type: 'float',
    nullable: true,
    comment: '행동 점수 (0~100)',
  })
  behaviorScore: number | null;

  @CreateDateColumn({ name: 'created_at', comment: 'TTL 적용' })
  createdAt: Date;

  // Relations
  @ManyToOne(
    () => CampaignEntityModule.CampaignEntity,
    (campaign: CampaignEntity) => campaign.bidLogs
  )
  @JoinColumn({ name: 'campaign_id' })
  campaign: Relation<CampaignEntity>;

  @ManyToOne(
    () => BlogEntityModule.BlogEntity,
    (blog: BlogEntity) => blog.bidLogs
  )
  @JoinColumn({ name: 'blog_id' })
  blog: Relation<BlogEntity>;
}
