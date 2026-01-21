import { Injectable, Inject } from '@nestjs/common';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { CampaignRepository } from './campaign.repository';
import { CampaignWithTags, Tag } from '../types/campaign.types';
import { CampaignStatus } from '../entities/campaign.entity';
import { CreateCampaignDto } from '../dto/create-campaign.dto';
import { UpdateCampaignDto } from '../dto/update-campaign.dto';
import { AVAILABLE_TAGS } from '../../common/constants';
import { LogRepository } from '../../log/repository/log.repository.interface';

type FixtureCampaign = {
  id: string;
  user_id: number;
  title: string;
  content: string;
  image: string;
  url: string;
  tags?: Tag[];
  max_cpc: number;
  daily_budget: number;
  total_budget: number | null;
  daily_spent?: number;
  total_spent?: number;
  last_reset_date?: string;
  is_high_intent: boolean;
  status: CampaignStatus;
  start_date: string;
  end_date: string;
  created_at: string;
  deleted_at: string | null;
};

type Fixture = {
  campaigns: FixtureCampaign[];
};

@Injectable()
export class JsonCampaignRepository extends CampaignRepository {
  private readonly campaignsById: Map<string, CampaignWithTags>;
  private readonly campaigns: CampaignWithTags[];

  constructor(@Inject(LogRepository) private readonly logRepository: LogRepository) {
    super();
    const campaigns = loadFixture().campaigns.map(toCampaignWithTags);
    this.campaigns = campaigns;
    this.campaignsById = new Map(campaigns.map((c) => [c.id, c]));
  }

  getAll(): Promise<CampaignWithTags[]> {
    return Promise.resolve([...this.campaigns]);
  }

  getById(campaignId: string): Promise<CampaignWithTags | null> {
    return Promise.resolve(this.campaignsById.get(campaignId) ?? null);
  }

  getByTags(tags: Tag[]): Promise<CampaignWithTags[]> {
    const tagNameSet = new Set(tags.map((t) => t.name));
    return Promise.resolve(
      this.campaigns.filter((campaign) =>
        (campaign.tags ?? []).some((tag) => tagNameSet.has(tag.name))
      )
    );
  }

  listByUserId(userId: number): Promise<CampaignWithTags[]> {
    return Promise.resolve(this.campaigns.filter((c) => c.userId === userId));
  }

  create(
    userId: number,
    dto: CreateCampaignDto,
    tagIds: number[]
  ): Promise<CampaignWithTags> {
    const now = new Date();
    const campaign: CampaignWithTags = {
      id: randomUUID(),
      userId,
      title: dto.title,
      content: dto.content,
      image: dto.image,
      url: dto.url,
      maxCpc: dto.maxCpc,
      dailyBudget: dto.dailyBudget,
      totalBudget: dto.totalBudget,
      dailySpent: 0,
      totalSpent: 0,
      lastResetDate: now,
      isHighIntent: dto.isHighIntent,
      status: CampaignStatus.PENDING,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      createdAt: now,
      deletedAt: null,
      tags: this.getTagsByIds(tagIds),
    };

    this.campaigns.push(campaign);
    this.campaignsById.set(campaign.id, campaign);

    return Promise.resolve(campaign);
  }

  findByUserId(
    userId: number,
    status?: CampaignStatus,
    limit: number = 10,
    offset: number = 0,
    sortBy: 'createdAt' | 'startDate' | 'endDate' = 'createdAt',
    order: 'asc' | 'desc' = 'desc'
  ): Promise<{
    campaigns: CampaignWithTags[];
    total: number;
  }> {
    // 사용자의 삭제되지 않은 모든 캠페인
    let filtered = this.campaigns.filter(
      (c) => c.userId === userId && c.deletedAt === null
    );

    // status 필터링 (선택적)
    if (status) {
      filtered = filtered.filter((c) => c.status === (status as string));
    }

    // 정렬
    filtered.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      // Date 객체 비교
      const aTime = aValue instanceof Date ? aValue.getTime() : 0;
      const bTime = bValue instanceof Date ? bValue.getTime() : 0;

      if (order === 'asc') {
        return aTime - bTime;
      } else {
        return bTime - aTime;
      }
    });

    const total = filtered.length;
    const campaigns = filtered.slice(offset, offset + limit);

    return Promise.resolve({ campaigns, total });
  }

  findOne(
    campaignId: string,
    userId: number
  ): Promise<CampaignWithTags | null> {
    const campaign = this.campaignsById.get(campaignId);

    if (!campaign || campaign.userId !== userId || campaign.deletedAt) {
      return Promise.resolve(null);
    }

    return Promise.resolve(campaign);
  }

  update(
    campaignId: string,
    dto: UpdateCampaignDto,
    tagIds?: number[]
  ): Promise<CampaignWithTags> {
    const campaign = this.campaignsById.get(campaignId);

    if (!campaign) {
      throw new Error(`Campaign ${campaignId} not found`);
    }

    if (dto.title !== undefined) campaign.title = dto.title;
    if (dto.content !== undefined) campaign.content = dto.content;
    if (dto.image !== undefined) campaign.image = dto.image;
    if (dto.url !== undefined) campaign.url = dto.url;
    if (dto.maxCpc !== undefined) campaign.maxCpc = dto.maxCpc;
    if (dto.dailyBudget !== undefined) campaign.dailyBudget = dto.dailyBudget;
    if (dto.totalBudget !== undefined) campaign.totalBudget = dto.totalBudget;
    if (dto.status !== undefined) campaign.status = dto.status;
    if (dto.endDate !== undefined) campaign.endDate = new Date(dto.endDate);

    if (tagIds) {
      campaign.tags = this.getTagsByIds(tagIds);
    }

    return Promise.resolve(campaign);
  }

  delete(campaignId: string): Promise<void> {
    const campaign = this.campaignsById.get(campaignId);

    if (campaign) {
      campaign.deletedAt = new Date();
    }

    return Promise.resolve();
  }

  updateStatus(campaignId: string, status: CampaignStatus): Promise<void> {
    const campaign = this.campaignsById.get(campaignId);

    if (campaign) {
      campaign.status = status;
    }

    return Promise.resolve();
  }

  incrementSpent(campaignId: string, amount: number): Promise<void> {
    const campaign = this.campaignsById.get(campaignId);

    if (campaign) {
      campaign.dailySpent += amount;
      campaign.totalSpent += amount;
    }

    return Promise.resolve();
  }

  resetDailySpent(campaignId: string): Promise<void> {
    const campaign = this.campaignsById.get(campaignId);

    if (campaign) {
      campaign.dailySpent = 0;
      campaign.lastResetDate = new Date();
    }

    return Promise.resolve();
  }

  resetAllDailySpent(): Promise<void> {
    const now = new Date();

    this.campaigns.forEach((campaign) => {
      campaign.dailySpent = 0;
      campaign.lastResetDate = now;
    });

    return Promise.resolve();
  }

  async getViewCountsByCampaignIds(
    campaignIds: string[]
  ): Promise<Map<string, number>> {
    return this.logRepository.countViewLogsByCampaignIds(campaignIds);
  }

  async getClickCountsByCampaignIds(
    campaignIds: string[]
  ): Promise<Map<string, number>> {
    return this.logRepository.countClickLogsByCampaignIds(campaignIds);
  }

  private getTagsByIds(tagIds: number[]): Tag[] {
    return tagIds
      .map((id) => AVAILABLE_TAGS.find((t) => t.id === id))
      .filter((tag): tag is Tag => tag !== undefined);
  }
}

const toCampaignWithTags = (c: FixtureCampaign): CampaignWithTags => {
  const now = new Date();
  return {
    id: c.id,
    userId: c.user_id,
    title: c.title,
    content: c.content,
    image: c.image,
    url: c.url,
    tags: c.tags ?? [],
    maxCpc: c.max_cpc,
    dailyBudget: c.daily_budget,
    totalBudget: c.total_budget,
    dailySpent: c.daily_spent ?? 0,
    totalSpent: c.total_spent ?? 0,
    lastResetDate: c.last_reset_date ? new Date(c.last_reset_date) : now,
    isHighIntent: c.is_high_intent,
    status: c.status,
    startDate: new Date(c.start_date),
    endDate: new Date(c.end_date),
    createdAt: new Date(c.created_at),
    deletedAt: c.deleted_at ? new Date(c.deleted_at) : null,
  };
};

const loadFixture = (): Fixture => {
  const fixturePath = getFixturePath();
  const raw = readFileSync(fixturePath, 'utf8');
  return JSON.parse(raw) as Fixture;
};

const getFixturePath = () => {
  if (process.env.ERD_FIXTURE_PATH) {
    return process.env.ERD_FIXTURE_PATH;
  }

  const moduleRelative = resolve(__dirname, '../../mock/erd-fixture.json');
  if (existsSync(moduleRelative)) {
    return moduleRelative;
  }

  const cwdRelative = resolve(process.cwd(), 'src/mock/erd-fixture.json');
  if (existsSync(cwdRelative)) {
    return cwdRelative;
  }

  throw new Error(
    "ERD fixture not found. Set ERD_FIXTURE_PATH or ensure 'src/mock/erd-fixture.json' is available at runtime."
  );
};
