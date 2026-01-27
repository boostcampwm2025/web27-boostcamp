import {
  Injectable,
  NotFoundException,
  BadRequestException,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { CampaignRepository } from './repository/campaign.repository.interface';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { GetCampaignListDto } from './dto/get-campaign-list.dto';
import { CampaignStatus } from './entities/campaign.entity';
import type {
  CampaignWithTags,
  CampaignWithStats,
  CachedCampaign,
} from './types/campaign.types';
import { AVAILABLE_TAGS } from '../common/constants';
import { UserRepository } from 'src/user/repository/user.repository.interface';
import { CampaignCacheRepository } from './repository/campaign.cache.repository.interface';

@Injectable()
export class CampaignService implements OnModuleInit {
  private readonly logger = new Logger(CampaignService.name);

  constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly userRepository: UserRepository,
    private readonly campaignCacheRepository: CampaignCacheRepository,
    @InjectQueue('embedding-queue') private readonly embeddingQueue: Queue
  ) {}

  onModuleInit() {
    this.logger.log('🚀 Campaign 초기 로딩 시작...');

    // 백그라운드 실행 (await 없음)
    this.loadAllCampaigns().catch((error) => {
      this.logger.error('Campaign 초기 로딩 실패:', error);
    });
  }

  private async loadAllCampaigns(): Promise<void> {
    try {
      const campaigns = await this.campaignRepository.getAll();

      this.logger.log(`📦 총 ${campaigns.length}개 Campaign 로딩 중...`);

      let loaded = 0;
      let embeddingQueued = 0;

      for (const campaign of campaigns) {
        // Redis에 캐싱
        await this.campaignCacheRepository.saveCampaignCacheById(
          campaign.id,
          this.convertToCachedCampaignType(campaign)
        );

        loaded++;

        // 임베딩 생성 큐 추가 (중복 방지)
        await this.embeddingQueue.add(
          'generate-campaign-embedding',
          {
            campaignId: campaign.id,
            text: `${campaign.title} ${campaign.content}`,
          },
          {
            jobId: `campaign-embedding-${campaign.id}`,
            removeOnComplete: true,
            removeOnFail: false,
            attempts: 3,
          }
        );

        embeddingQueued++;

        // 진행 상황 로깅 (100개당 1번)
        if (loaded % 100 === 0) {
          this.logger.log(
            `📊 Campaign 로딩 진행: ${loaded}/${campaigns.length}`
          );
        }
      }

      this.logger.log(
        `✅ Campaign 로딩 완료: ${loaded}개, 임베딩 큐: ${embeddingQueued}개`
      );
    } catch (error) {
      this.logger.error('Campaign 로딩 중 에러 발생:', error);
      throw error;
    }
  }

  // 캠페인 생성 (태그 검증 + 날짜 유효성 체크 + 시작일 기준 상태 설정)
  async createCampaign(
    userId: number,
    dto: CreateCampaignDto
  ): Promise<CampaignWithTags> {
    await this.validateBudget({
      userId,
      maxCpc: dto.maxCpc,
      dailyBudget: dto.dailyBudget,
      totalBudget: dto.totalBudget,
      checkBalance: true,
    });
    const tagIds = this.validateAndGetTagIds(dto.tags);

    if (new Date(dto.startDate) >= new Date(dto.endDate)) {
      throw new BadRequestException('시작일은 종료일보다 앞서야 합니다.');
    }

    // 시작일이 오늘 이하면 ACTIVE, 내일 이상이면 PENDING
    const initialStatus = this.determineInitialStatus(dto.startDate);

    // 실제 DB 먼저
    const campaign = await this.campaignRepository.create(
      userId,
      dto,
      tagIds,
      initialStatus
    );

    // Redis 캐싱 (write-through 비슷하게)
    await this.campaignCacheRepository.saveCampaignCacheById(
      campaign.id,
      this.convertToCachedCampaignType(campaign)
    );

    return campaign;
  }

  // 캠페인 목록 조회 (페이지네이션 + 정렬 + 통계)
  async getCampaignList(userId: number, dto: GetCampaignListDto) {
    const { campaigns, total } = await this.campaignRepository.findByUserId(
      userId,
      dto.status,
      dto.limit,
      dto.offset,
      dto.sortBy,
      dto.order
    );

    // 통계 필드 추가
    const campaignsWithStats =
      await this.addStatsToMultipleCampaigns(campaigns);

    // hasMore 계산
    const hasMore = (dto.offset || 0) + (dto.limit || 3) < total;

    return {
      campaigns: campaignsWithStats,
      total,
      hasMore,
    };
  }

  // 특정 캠페인 조회 (소유권 검증 + 통계)
  async getCampaignById(
    campaignId: string,
    userId: number
  ): Promise<CampaignWithStats> {
    const campaign = await this.campaignRepository.findOne(campaignId, userId);

    if (!campaign) {
      throw new NotFoundException('캠페인을 찾을 수 없습니다.');
    }

    // 통계 필드 추가
    return this.addStatsToCampaign(campaign);
  }

  // 캠페인 수정 (소유권 + 날짜 + 태그 검증 + 시작일 변경 시 상태 재결정)
  async updateCampaign(
    campaignId: string,
    userId: number,
    dto: UpdateCampaignDto
  ): Promise<CampaignWithTags> {
    const campaign = await this.campaignRepository.findOne(campaignId, userId);

    if (!campaign) {
      throw new NotFoundException('캠페인을 찾을 수 없습니다.');
    }

    if (dto.endDate && new Date(dto.endDate) <= campaign.startDate) {
      throw new BadRequestException('종료일은 시작일보다 이후여야 합니다.');
    }

    const tagIds = dto.tags ? this.validateAndGetTagIds(dto.tags) : undefined;

    // 시작일이 변경된 경우, 상태 재결정 (PENDING/ACTIVE 상태인 경우에만)
    let newStatus: CampaignStatus | undefined;
    if (
      dto.startDate &&
      (campaign.status === 'PENDING' || campaign.status === 'ACTIVE')
    ) {
      newStatus = this.determineInitialStatus(dto.startDate);
    }

    // TODO: 업데이트 시 DB 먼저 할지 고려 필요
    const updatedCampaign = await this.campaignRepository.update(
      campaignId,
      dto,
      tagIds,
      newStatus
    );

    // Redis 캐시 업데이트
    await this.campaignCacheRepository.saveCampaignCacheById(
      updatedCampaign.id,
      this.convertToCachedCampaignType(updatedCampaign)
    );

    return updatedCampaign;
  }

  // 캠페인 삭제 (소프트 삭제, 소유권 검증)
  async deleteCampaign(campaignId: string, userId: number): Promise<void> {
    const campaign = await this.campaignRepository.findOne(campaignId, userId);

    if (!campaign) {
      throw new NotFoundException('캠페인을 찾을 수 없습니다.');
    }

    // Redis 먼저 삭제 (캠페인 내 돈 관련 부분에 대한 빠른 업데이트)
    await this.campaignCacheRepository.deleteCampaignCacheById(campaignId);

    // DB 삭제 (Soft Delete)
    await this.campaignRepository.delete(campaignId);
  }

  // ============================================================================
  // 모듈화 된 함수들
  // ============================================================================
  private async validateBudget({
    userId,
    maxCpc,
    dailyBudget,
    totalBudget,
    checkBalance,
  }: {
    userId: number;
    maxCpc: number;
    dailyBudget: number;
    totalBudget: number | null;
    checkBalance?: boolean;
  }): Promise<void> {
    if (maxCpc > dailyBudget) {
      throw new BadRequestException('CPC값은 일 예산을 초과할 수 없습니다.');
    }

    if (totalBudget !== null && dailyBudget > totalBudget) {
      throw new BadRequestException('일 예산은 총 예산을 초과할 수 없습니다.');
    }

    if (checkBalance && totalBudget !== null) {
      const balance = await this.userRepository.getBalanceById(userId);

      if (balance == null) {
        throw new NotFoundException();
      }

      if (totalBudget > balance) {
        throw new BadRequestException(
          '총 예산은 보유 잔액을 초과할 수 없습니다.'
        );
      }
    }
  }
  // 시작일 기준 초기 상태 결정
  private determineInitialStatus(
    startDate: string
  ): CampaignStatus.ACTIVE | CampaignStatus.PENDING {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    return start <= today ? CampaignStatus.ACTIVE : CampaignStatus.PENDING;
  }

  // 태그 이름 배열을 태그 ID 배열로 변환
  private validateAndGetTagIds(tagNames: string[]): number[] {
    const tagIds: number[] = [];

    for (const name of tagNames) {
      const tag = AVAILABLE_TAGS.find((t) => t.name === name);
      if (!tag) {
        throw new BadRequestException(`존재하지 않는 태그입니다: ${name}`);
      }
      tagIds.push(tag.id);
    }

    return tagIds;
  }
  // 단일 캠페인에 통계 필드 추가
  private async addStatsToCampaign(
    campaign: CampaignWithTags
  ): Promise<CampaignWithStats> {
    const viewCounts = await this.campaignRepository.getViewCountsByCampaignIds(
      [campaign.id]
    );
    const clickCounts =
      await this.campaignRepository.getClickCountsByCampaignIds([campaign.id]);

    const impressions = viewCounts.get(campaign.id) || 0;
    const clicks = clickCounts.get(campaign.id) || 0;

    return {
      ...campaign,
      impressions,
      clicks,
      ctr: this.calculateCTR(clicks, impressions),
      dailySpentPercent: this.calculatePercent(
        campaign.dailySpent,
        campaign.dailyBudget
      ),
      totalSpentPercent: this.calculatePercent(
        campaign.totalSpent,
        campaign.totalBudget
      ),
    };
  }

  // CTR 계산 (소수점 2자리)
  private calculateCTR(clicks: number, impressions: number): number {
    if (impressions === 0) return 0;
    return parseFloat(((clicks / impressions) * 100).toFixed(2));
  }

  // 퍼센트 계산 (소수점 2자리)
  private calculatePercent(spent: number, budget: number | null): number {
    if (budget === null || budget === 0) return 0;
    return parseFloat(((spent / budget) * 100).toFixed(2));
  }

  // 여러 캠페인에 통계 필드 추가
  private async addStatsToMultipleCampaigns(
    campaigns: CampaignWithTags[]
  ): Promise<CampaignWithStats[]> {
    if (campaigns.length === 0) {
      return [];
    }

    const campaignIds = campaigns.map((c) => c.id);

    // 일괄 집계
    const viewCounts =
      await this.campaignRepository.getViewCountsByCampaignIds(campaignIds);
    const clickCounts =
      await this.campaignRepository.getClickCountsByCampaignIds(campaignIds);

    // 각 캠페인에 통계 추가
    return campaigns.map((campaign) => {
      const impressions = viewCounts.get(campaign.id) || 0;
      const clicks = clickCounts.get(campaign.id) || 0;

      return {
        ...campaign,
        impressions,
        clicks,
        ctr: this.calculateCTR(clicks, impressions),
        dailySpentPercent: this.calculatePercent(
          campaign.dailySpent,
          campaign.dailyBudget
        ),
        totalSpentPercent: this.calculatePercent(
          campaign.totalSpent,
          campaign.totalBudget
        ),
      };
    });
  }

  private convertToCachedCampaignType(
    campaign: CampaignWithTags
  ): CachedCampaign {
    return {
      id: campaign.id,
      userId: campaign.userId,
      title: campaign.title,
      content: campaign.content,
      image: campaign.image,
      url: campaign.url,
      maxCpc: campaign.maxCpc,
      dailyBudget: campaign.dailyBudget,
      totalBudget: campaign.totalBudget ?? null,
      dailySpent: campaign.dailySpent,
      totalSpent: campaign.totalSpent,
      lastResetDate: campaign.lastResetDate.toISOString(),
      isHighIntent: campaign.isHighIntent,
      status: campaign.status,
      startDate: campaign.startDate.toISOString(),
      endDate: campaign.endDate.toISOString(),
      createdAt: campaign.createdAt.toISOString(),
      // embedding은 Worker가 나중에 추가
    };
  }
}
