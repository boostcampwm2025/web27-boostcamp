import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

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

  @Column({
    name: 'campaign_id',
    type: 'varchar',
    length: 255,
    comment: '논리적 참조: Campaign.id (FK 없음)',
  })
  campaignId: string;

  @Column({
    name: 'blog_id',
    type: 'int',
    comment: '논리적 참조: Blog.id (FK 없음)',
  })
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

  @Column({
    name: 'post_url',
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: '광고가 게재된 블로그 포스트 URL',
  })
  postUrl: string | null;

  @CreateDateColumn({ name: 'created_at', comment: 'TTL 적용' })
  createdAt: Date;
}
