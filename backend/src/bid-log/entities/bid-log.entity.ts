import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  type Relation,
} from 'typeorm';
import type { Campaign } from '../../campaign/entities/campaign.entity';
import type { Blog } from '../../blog/entities/blog.entity';
import * as CampaignEntity from '../../campaign/entities/campaign.entity';
import * as BlogEntity from '../../blog/entities/blog.entity';

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

  @CreateDateColumn({ name: 'created_at', comment: 'TTL 적용' })
  createdAt: Date;

  // Relations
  @ManyToOne(
    () => CampaignEntity.Campaign,
    (campaign: Campaign) => campaign.bidLogs
  )
  @JoinColumn({ name: 'campaign_id' })
  campaign: Relation<Campaign>;

  @ManyToOne(() => BlogEntity.Blog, (blog: Blog) => blog.bidLogs)
  @JoinColumn({ name: 'blog_id' })
  blog: Relation<Blog>;
}
