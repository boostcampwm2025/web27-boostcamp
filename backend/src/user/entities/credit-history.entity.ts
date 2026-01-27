import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { CampaignEntity } from '../../campaign/entities/campaign.entity';

export enum CreditHistoryType {
  CHARGE = 'CHARGE',
  WITHDRAW = 'WITHDRAW',
}

@Entity('CreditHistory')
export class CreditHistoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @Column({
    type: 'enum',
    enum: CreditHistoryType,
    comment: 'CHARGE: 충전, WITHDRAW: 캠페인 생성 시 차감',
  })
  type: CreditHistoryType;

  @Column({ type: 'int', comment: '변동 금액 (절댓값)' })
  amount: number;

  @Column({
    name: 'balance_after',
    type: 'int',
    comment: '변동 후 잔액',
  })
  balanceAfter: number;

  @Column({
    name: 'campaign_id',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'WITHDRAW인 경우 생성된 캠페인 ID',
  })
  campaignId: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => UserEntity, (user) => user.creditHistories)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => CampaignEntity, { nullable: true })
  @JoinColumn({ name: 'campaign_id' })
  campaign: CampaignEntity | null;
}
