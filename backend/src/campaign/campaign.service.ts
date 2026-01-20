import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CampaignRepository } from './repository/campaign.repository';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { GetCampaignListDto } from './dto/get-campaign-list.dto';
import { CampaignWithTags } from './types/campaign.types';
import { AVAILABLE_TAGS } from '../common/constants';

@Injectable()
export class CampaignService {
  constructor(private readonly campaignRepository: CampaignRepository) {}

  // 캠페인 생성 (태그 검증 + 날짜 유효성 체크)
  async createCampaign(
    userId: number,
    dto: CreateCampaignDto
  ): Promise<CampaignWithTags> {
    const tagIds = this.validateAndGetTagIds(dto.tags);

    if (new Date(dto.startDate) >= new Date(dto.endDate)) {
      throw new BadRequestException('시작일은 종료일보다 앞서야 합니다.');
    }

    return this.campaignRepository.create(userId, dto, tagIds);
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

  // 사용자의 캠페인 상태별 개수 집계
  private async getStatusCounts(userId: number) {
    const allCampaigns = await this.campaignRepository.listByUserId(userId);

    return {
      pending: allCampaigns.filter(
        (c) => c.status === 'PENDING' && !c.deletedAt
      ).length,
      active: allCampaigns.filter((c) => c.status === 'ACTIVE' && !c.deletedAt)
        .length,
      paused: allCampaigns.filter((c) => c.status === 'PAUSED' && !c.deletedAt)
        .length,
      ended: allCampaigns.filter((c) => c.status === 'ENDED' && !c.deletedAt)
        .length,
    };
  }

  // 캠페인 목록 조회 (페이지네이션 + 상태별 통계)
  async getCampaignList(userId: number, dto: GetCampaignListDto) {
    const { campaigns, total } = await this.campaignRepository.findByUserId(
      userId,
      dto.status,
      dto.limit,
      dto.offset
    );

    const statusCounts = await this.getStatusCounts(userId);

    return {
      campaigns,
      total,
      statistics: {
        pending: statusCounts.pending,
        active: statusCounts.active,
        paused: statusCounts.paused,
        ended: statusCounts.ended,
      },
    };
  }

  // 특정 캠페인 조회 (소유권 검증)
  async getCampaignById(
    campaignId: string,
    userId: number
  ): Promise<CampaignWithTags> {
    const campaign = await this.campaignRepository.findOne(campaignId, userId);

    if (!campaign) {
      throw new NotFoundException('캠페인을 찾을 수 없습니다.');
    }

    return campaign;
  }
}
