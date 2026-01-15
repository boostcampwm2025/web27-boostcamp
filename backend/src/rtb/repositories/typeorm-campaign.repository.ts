import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CampaignRepository as RTBCampaignRepository } from '../../rtb/repositories/campaign.repository.interface';
import { Campaign as RTBCampaign, Tag } from '../../rtb/types/decision.types';
import {
  Campaign,
  CampaignStatus,
} from '../../campaign/entities/campaign.entity';

@Injectable()
export class TypeOrmCampaignRepository implements RTBCampaignRepository {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>
  ) {}

  async findByTags(tags: Tag[]): Promise<RTBCampaign[]> {
    const tagIds = tags.map((t) => t.id);

    // Tag ID로 Campaign 조회
    const campaigns = await this.campaignRepository
      .createQueryBuilder('campaign')
      .leftJoinAndSelect('campaign.tags', 'tag')
      .where('tag.id IN (:...tagIds)', { tagIds })
      .getMany();

    return campaigns.map((campaign) => this.toRTBCampaign(campaign));
  }

  async findById(id: string): Promise<RTBCampaign | null> {
    const campaign = await this.campaignRepository.findOne({
      where: { id },
      relations: ['tags'],
    });
    return campaign ? this.toRTBCampaign(campaign) : null;
  }

  async findAll(): Promise<RTBCampaign[]> {
    const campaigns = await this.campaignRepository.find({
      relations: ['tags'],
      where: { status: CampaignStatus.ACTIVE },
    });
    return campaigns.map((campaign) => this.toRTBCampaign(campaign));
  }

  private toRTBCampaign(entity: Campaign): RTBCampaign {
    return {
      id: entity.id,
      user_id: entity.userId,
      title: entity.title,
      content: entity.content,
      image: entity.image,
      url: entity.url,
      tags: entity.tags.map((t) => ({ id: t.id, name: t.name })),
      max_cpc: entity.maxCpc,
      daily_budget: entity.dailyBudget,
      total_budget: entity.totalBudget,
      is_high_intent: entity.isHighIntent,
      status: entity.status,
      start_date: entity.startDate.toISOString(),
      end_date: entity.endDate.toISOString(),
      created_at: entity.createdAt.toISOString(),
      deleted_at: entity.deletedAt?.toISOString() ?? null,
    };
  }
}
