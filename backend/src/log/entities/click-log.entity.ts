import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ViewLogEntity } from './view-log.entity';

@Entity('ClickLog')
export class ClickLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'view_id', type: 'int' })
  viewId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => ViewLogEntity, (viewLog) => viewLog.clickLogs)
  @JoinColumn({ name: 'view_id' })
  viewLog: ViewLogEntity;
}
