import { Injectable } from '@nestjs/common';
import { BidLogRepository } from './repositories/bid-log.repository';
import { CampaignRepository } from '../rtb/repositories/campaign.repository.interface';
import { BidLogResponseDto, BidLogItemDto } from './dto/bid-log-response.dto';
import { MOCK_BLOGS } from '../common/constants';

@Injectable()
export class BidLogService {
  constructor(
    private readonly bidLogRepository: BidLogRepository,
    private readonly campaignRepository: CampaignRepository
  ) {}

  async getRealtimeBidLogs(
    limit: number,
    offset: number
  ): Promise<BidLogResponseDto> {
    // 1. 모든 BidLog 가져오기
    const allBidLogs = this.bidLogRepository.getAll();

    // 2. 모든 Campaign 가져오기
    const allCampaigns = await this.campaignRepository.findAll();

    // 3. userId=1인 캠페인만 필터링
    const userCampaigns = allCampaigns.filter((c) => c.user_id === 1);
    const userCampaignIds = new Set(userCampaigns.map((c) => c.id));

    // 4. userId=1의 캠페인에 해당하는 BidLog만 필터링
    const filteredBidLogs = allBidLogs.filter((log) =>
      userCampaignIds.has(log.campaignId)
    );

    // 5. 최신순 정렬 (timestamp 내림차순)
    const sortedBidLogs = filteredBidLogs.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // 6. offset + limit 적용
    const paginatedBidLogs = sortedBidLogs.slice(offset, offset + limit);

    // 7. DTO로 변환 (Campaign, Blog 조인)
    const data: BidLogItemDto[] = paginatedBidLogs.map((log) => {
      const campaign = userCampaigns.find((c) => c.id === log.campaignId);
      const blog = MOCK_BLOGS.find((b) => b.blog_key === log.blogId);
      const winAmount = this.bidLogRepository.findWinAmountByAuctionId(
        log.auctionId
      );

      return {
        id: log.id!,
        timestamp: log.timestamp,
        campaignId: log.campaignId,
        campaignTitle: campaign?.title || 'Unknown Campaign',
        blogKey: log.blogId,
        blogName: blog?.name || 'Unknown Blog',
        blogDomain: blog?.domain || 'unknown.com',
        bidAmount: log.bidPrice,
        winAmount: winAmount,
        isWon: log.status === 'WIN',
        isHighIntent: log.isHighIntent,
        behaviorScore: log.behaviorScore,
      };
    });

    // 8. 최종 응답 형식
    return {
      status: 'success',
      message: '광고주 실시간 입찰 로그입니다.',
      data,
      timestamp: new Date().toISOString(),
    };
  }
}
