import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CampaignRepository } from './campaign.repository';
import { Campaign as CampaignType } from '../types/campaign.types';
import { Campaign } from '../entities/campaign.entity';

@Injectable()
export class TypeOrmCampaignRepository extends CampaignRepository {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>
  ) {
    super();
  }

  async listByUserId(userId: number): Promise<CampaignType[]> {
    const campaigns = await this.campaignRepository.find({
      where: { userId },
      relations: ['tags'],
    });
    return campaigns.map((campaign) => this.toType(campaign));
  }

  async getById(campaignId: string): Promise<CampaignType | undefined> {
    const campaign = await this.campaignRepository.findOne({
      where: { id: campaignId },
      relations: ['tags'],
    });
    return campaign ? this.toType(campaign) : undefined;
  }

  private toType(entity: Campaign): CampaignType {
    return {
      id: entity.id,
      userId: entity.userId,
      title: entity.title,
      content: entity.content,
      image: entity.image,
      url: entity.url,
      maxCpc: entity.maxCpc,
      dailyBudget: entity.dailyBudget,
      totalBudget: entity.totalBudget,
      isHighIntent: entity.isHighIntent,
      status: entity.status,
      startDate: entity.startDate,
      endDate: entity.endDate,
      createdAt: entity.createdAt,
      deletedAt: entity.deletedAt,
    };
  }
}
