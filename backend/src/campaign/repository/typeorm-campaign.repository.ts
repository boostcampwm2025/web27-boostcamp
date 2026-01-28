import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, In } from 'typeorm';
import { randomUUID } from 'node:crypto';
import { CampaignRepository } from './campaign.repository.interface';
import { CampaignEntity, CampaignStatus } from '../entities/campaign.entity';
import { TagEntity } from '../../tag/entities/tag.entity';
import { CampaignWithTags, Tag } from '../types/campaign.types';
import { CreateCampaignDto } from '../dto/create-campaign.dto';
import { UpdateCampaignDto } from '../dto/update-campaign.dto';
import { LogRepository } from '../../log/repository/log.repository.interface';

@Injectable()
export class TypeOrmCampaignRepository extends CampaignRepository {
  constructor(
    @InjectRepository(CampaignEntity)
    private readonly campaignRepo: Repository<CampaignEntity>,
    @InjectRepository(TagEntity)
    private readonly tagRepo: Repository<TagEntity>,
    @Inject(LogRepository)
    private readonly logRepository: LogRepository
  ) {
    super();
  }

  async getAll(): Promise<CampaignWithTags[]> {
    const campaigns = await this.campaignRepo.find({
      relations: ['tags'],
      order: { createdAt: 'DESC' },
    });

    return campaigns.map(this.toPlainObject);
  }

  async getById(campaignId: string): Promise<CampaignWithTags | null> {
    const campaign = await this.campaignRepo.findOne({
      where: { id: campaignId },
      relations: ['tags'],
    });

    return campaign ? this.toPlainObject(campaign) : null;
  }

  async getByTags(tags: Tag[]): Promise<CampaignWithTags[]> {
    if (tags.length === 0) {
      return [];
    }

    const tagIds = tags.map((t) => t.id);

    const campaigns = await this.campaignRepo
      .createQueryBuilder('campaign')
      .leftJoinAndSelect('campaign.tags', 'tag')
      .where('tag.id IN (:...tagIds)', { tagIds })
      .andWhere('campaign.deletedAt IS NULL')
      .getMany();

    return campaigns.map(this.toPlainObject);
  }

  async listByUserId(userId: number): Promise<CampaignWithTags[]> {
    const campaigns = await this.campaignRepo.find({
      where: { userId, deletedAt: IsNull() },
      relations: ['tags'],
      order: { createdAt: 'DESC' },
    });

    return campaigns.map(this.toPlainObject);
  }

  async create(
    userId: number,
    dto: CreateCampaignDto,
    tagIds: number[],
    initialStatus: CampaignStatus = CampaignStatus.PENDING
  ): Promise<CampaignWithTags> {
    const tags = await this.tagRepo.find({ where: { id: In(tagIds) } });

    const campaign = this.campaignRepo.create({
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
      lastResetDate: new Date(),
      isHighIntent: dto.isHighIntent,
      status: initialStatus,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      tags,
    });

    const saved = await this.campaignRepo.save(campaign);

    return this.toPlainObject(saved);
  }

  async findByUserId(
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
    const qb = this.campaignRepo
      .createQueryBuilder('campaign')
      .leftJoinAndSelect('campaign.tags', 'tag')
      .where('campaign.userId = :userId', { userId })
      .andWhere('campaign.deletedAt IS NULL');

    if (status) {
      qb.andWhere('campaign.status = :status', { status });
    }

    qb.orderBy(`campaign.${sortBy}`, order.toUpperCase() as 'ASC' | 'DESC');

    const [campaigns, total] = await qb
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return {
      campaigns: campaigns.map(this.toPlainObject),
      total,
    };
  }

  async findOne(
    campaignId: string,
    userId: number
  ): Promise<CampaignWithTags | null> {
    const campaign = await this.campaignRepo.findOne({
      where: {
        id: campaignId,
        userId,
        deletedAt: IsNull(),
      },
      relations: ['tags'],
    });

    return campaign ? this.toPlainObject(campaign) : null;
  }

  async update(
    campaignId: string,
    dto: UpdateCampaignDto,
    tagIds?: number[],
    newStatus?: CampaignStatus
  ): Promise<CampaignWithTags> {
    const campaign = await this.campaignRepo.findOne({
      where: { id: campaignId },
      relations: ['tags'],
    });

    if (!campaign) {
      throw new Error(`Campaign ${campaignId} not found`);
    }

    if (dto.title !== undefined) campaign.title = dto.title;
    if (dto.content !== undefined) campaign.content = dto.content;
    if (dto.image !== undefined) campaign.image = dto.image;
    if (dto.url !== undefined) campaign.url = dto.url;
    if (dto.isHighIntent !== undefined) campaign.isHighIntent = dto.isHighIntent;
    if (dto.maxCpc !== undefined) campaign.maxCpc = dto.maxCpc;
    if (dto.dailyBudget !== undefined) campaign.dailyBudget = dto.dailyBudget;
    if (dto.totalBudget !== undefined) campaign.totalBudget = dto.totalBudget;
    if (dto.startDate !== undefined)
      campaign.startDate = new Date(dto.startDate);
    if (dto.endDate !== undefined) campaign.endDate = new Date(dto.endDate);

    // newStatus가 전달되면 우선 적용, 아니면 dto.status 사용
    if (newStatus !== undefined) {
      campaign.status = newStatus;
    } else if (dto.status !== undefined) {
      campaign.status =
        dto.status === 'ACTIVE' ? CampaignStatus.ACTIVE : CampaignStatus.PAUSED;
    }

    if (tagIds) {
      const tags = await this.tagRepo.find({ where: { id: In(tagIds) } });
      campaign.tags = tags;
    }

    const saved = await this.campaignRepo.save(campaign);

    return this.toPlainObject(saved);
  }

  async delete(campaignId: string): Promise<void> {
    await this.campaignRepo.update(
      { id: campaignId },
      { deletedAt: new Date() }
    );
  }

  async updateStatus(
    campaignId: string,
    status: CampaignStatus
  ): Promise<void> {
    await this.campaignRepo.update({ id: campaignId }, { status });
  }

  async incrementSpent(campaignId: string, amount: number): Promise<void> {
    await this.campaignRepo.increment({ id: campaignId }, 'dailySpent', amount);
    await this.campaignRepo.increment({ id: campaignId }, 'totalSpent', amount);
  }

  async resetDailySpent(campaignId: string): Promise<void> {
    await this.campaignRepo.update(
      { id: campaignId },
      { dailySpent: 0, lastResetDate: new Date() }
    );
  }

  async resetAllDailySpent(): Promise<void> {
    await this.campaignRepo
      .createQueryBuilder()
      .update()
      .set({ dailySpent: 0, lastResetDate: new Date() })
      .execute();
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

  // Entity를 Plain Object로 변환 (Relation 타입 제거)
  private toPlainObject = (entity: CampaignEntity): CampaignWithTags => {
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
      dailySpent: entity.dailySpent,
      totalSpent: entity.totalSpent,
      lastResetDate: entity.lastResetDate,
      isHighIntent: entity.isHighIntent,
      status: entity.status,
      startDate: entity.startDate,
      endDate: entity.endDate,
      createdAt: entity.createdAt,
      deletedAt: entity.deletedAt,
      tags: (entity.tags || []).map((tag) => ({
        id: tag.id,
        name: tag.name,
      })),
    };
  };
}
