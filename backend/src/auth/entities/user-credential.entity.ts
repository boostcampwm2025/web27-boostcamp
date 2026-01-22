import {
  Entity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('UserCredential')
export class UserCredentialEntity {
  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @Column({
    name: 'password_hash',
    type: 'varchar',
    length: 255,
  })
  passwordHash: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  // Relations
  @OneToOne(() => UserEntity, (user) => user.credential)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
