import { Injectable } from '@nestjs/common';
import { BidStatus } from './bid-log.types';
import { BidLogRepository } from './repositories/bid-log.repository.interface';
import { BidLogResponseDto, BidLogItemDto } from './dto/bid-log-response.dto';
import { CampaignRepository } from 'src/campaign/repository/campaign.repository.interface';
import { BlogRepository } from 'src/blog/repository/blog.repository.interface';

@Injectable()
export class BidLogService {
  constructor(
    private readonly bidLogRepository: BidLogRepository,
    private readonly campaignRepository: CampaignRepository,
    private readonly blogRepository: BlogRepository
  ) {}

  async getRealtimeBidLogs(
    userId: number,
    limit: number,
    offset: number,
    startDate?: string,
    endDate?: string
  ): Promise<BidLogResponseDto> {
    const total = await this.bidLogRepository.countByUserId(
      userId,
      startDate,
      endDate
    );

    const bidLogs = await this.bidLogRepository.findByUserId(
      userId,
      limit,
      offset,
      'createdAt',
      'desc',
      startDate,
      endDate
    );

    // TODO(후순위): 쿼리 최적화 필요
    // DTO로 변환 (Campaign, Blog 조인)
    const dataPromises = bidLogs.map(async (log) => {
      // Campaign 정보 조회
      const campaign = await this.campaignRepository.getById(log.campaignId);
      // Blog 정보 조회
      const blog = await this.blogRepository.findById(log.blogId);
      // 낙찰가 조회
      const winAmount = await this.bidLogRepository.findWinAmountByAuctionId(
        log.auctionId
      );

      return {
        id: log.id!,
        createdAt: log.createdAt!, // Entity에서 자동생성됨
        campaignId: log.campaignId,
        campaignTitle: campaign?.title || 'Unknown Campaign',
        blogKey: blog?.blogKey || 'Unknown Blog Key',
        blogName: blog?.name || 'Unknown Blog',
        blogDomain: log.postUrl || blog?.domain || 'unknown.com',
        bidAmount: log.bidPrice,
        winAmount: winAmount,
        isWon: log.status === BidStatus.WIN,
        isHighIntent: log.isHighIntent,
        behaviorScore: log.behaviorScore,
      };
    });

    const bids: BidLogItemDto[] = await Promise.all(dataPromises);

    const hasMore = offset + limit < total;

    return {
      status: 'success',
      message: '광고주 실시간 입찰 로그입니다.',
      data: {
        total,
        hasMore,
        bids,
      },
      timestamp: new Date().toISOString(),
    };
  }
}
