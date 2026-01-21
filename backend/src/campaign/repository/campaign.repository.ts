import type { CampaignWithTags, Tag } from '../types/campaign.types';
import type { CreateCampaignDto } from '../dto/create-campaign.dto';
import type { UpdateCampaignDto } from '../dto/update-campaign.dto';
import type { CampaignStatus } from '../entities/campaign.entity';

export abstract class CampaignRepository {
  abstract getAll(): Promise<CampaignWithTags[]>;
  abstract getById(campaignId: string): Promise<CampaignWithTags | null>;
  abstract getByTags(tags: Tag[]): Promise<CampaignWithTags[]>;
  abstract listByUserId(userId: number): Promise<CampaignWithTags[]>;

  abstract create(
    userId: number,
    dto: CreateCampaignDto,
    tagIds: number[]
  ): Promise<CampaignWithTags>;

  abstract findByUserId(
    userId: number,
    status?: CampaignStatus,
    limit?: number,
    offset?: number,
    sortBy?: 'createdAt' | 'startDate' | 'endDate',
    order?: 'asc' | 'desc'
  ): Promise<{
    campaigns: CampaignWithTags[];
    total: number;
  }>;

  abstract findOne(
    campaignId: string,
    userId: number
  ): Promise<CampaignWithTags | null>;

  abstract update(
    campaignId: string,
    dto: UpdateCampaignDto,
    tagIds?: number[]
  ): Promise<CampaignWithTags>;

  abstract delete(campaignId: string): Promise<void>;

  abstract updateStatus(
    campaignId: string,
    status: CampaignStatus
  ): Promise<void>;

  abstract incrementSpent(campaignId: string, amount: number): Promise<void>;

  abstract resetDailySpent(campaignId: string): Promise<void>;

  abstract resetAllDailySpent(): Promise<void>;

  // 통계 집계 메서드
  abstract getViewCountsByCampaignIds(
    campaignIds: string[]
  ): Promise<Map<string, number>>;

  abstract getClickCountsByCampaignIds(
    campaignIds: string[]
  ): Promise<Map<string, number>>;
}
