import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Campaign } from '../../campaign/entities/campaign.entity';

@Entity('Tag')
export class TagEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    comment: "서비스 정의 태그 (예: 'React')",
  })
  name: string;

  // Relations
  @ManyToMany(() => Campaign, (campaign) => campaign.tags)
  campaigns: Campaign[];
}
