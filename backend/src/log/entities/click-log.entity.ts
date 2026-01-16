import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ViewLog } from './view-log.entity';

@Entity('ClickLog')
export class ClickLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'view_id', type: 'int' })
  viewId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => ViewLog, (viewLog) => viewLog.clickLogs)
  @JoinColumn({ name: 'view_id' })
  viewLog: ViewLog;
}
