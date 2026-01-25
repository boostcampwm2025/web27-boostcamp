import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ClickLogEntity } from './click-log.entity';

@Entity('ViewLog')
export class ViewLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'auction_id', type: 'varchar', length: 255 })
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

  @Column({
    name: 'post_url',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '게시글 URL (대시보드 노출용)',
  })
  postUrl: string | null;

  @Column({ type: 'int', comment: '과금액 (2nd price, KRW)' })
  cost: number;

  @Column({
    name: 'position_ratio',
    type: 'float',
    nullable: true,
    comment: '광고 위치 (0.0~1.0)',
  })
  positionRatio: number | null;

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @OneToMany(() => ClickLogEntity, (clickLog) => clickLog.viewLog)
  clickLogs: ClickLogEntity[];
}
