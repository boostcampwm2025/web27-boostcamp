import { Injectable } from '@nestjs/common';
import { BidStatus } from './bid-log.types';
import { BidLogRepository } from './repositories/bid-log.repository.interface';
import { BidLogResponseDto, BidLogItemDto } from './dto/bid-log-response.dto';
import { CampaignRepository } from 'src/campaign/repository/campaign.repository';
import { BlogRepository } from 'src/blog/repository/blog.repository.interface';

@Injectable()
export class BidLogService {
  constructor(
    private readonly bidLogRepository: BidLogRepository,
    private readonly campaignRepository: CampaignRepository,
    private readonly blogRepository: BlogRepository
  ) {}

  async getRealtimeBidLogs(
    limit: number,
    offset: number
  ): Promise<BidLogResponseDto> {
    // 1. 모든 BidLog 가져오기
    const allBidLogs = await this.bidLogRepository.getAll();

    // 2. 모든 Campaign 가져오기
    const allCampaigns = await this.campaignRepository.getAll();

    // TODO : userId=1인 캠페인만 필터링하는 로직이 수정 필요
    // TODO : userId 필터링 로직이 campaignRepository에 추가되면 수정 필요
    // 3. userId=1인 캠페인만 필터링
    const userCampaigns = allCampaigns.filter((c) => c.userId === 1);
    const userCampaignIds = new Set(userCampaigns.map((c) => c.id));

    // 4. userId=1의 캠페인에 해당하는 BidLog만 필터링
    const filteredBidLogs = allBidLogs.filter((log) =>
      userCampaignIds.has(log.campaignId)
    );

    // 5. 최신순 정렬 (createdAt 내림차순)
    const sortedBidLogs = filteredBidLogs.sort((a, b) => {
      const timeA = a.createdAt?.getTime() ?? 0;
      const timeB = b.createdAt?.getTime() ?? 0;
      return timeB - timeA;
    });

    // 6. offset + limit 적용
    const paginatedBidLogs = sortedBidLogs.slice(offset, offset + limit);

    // TODO(후순위) : Promise.all로 병렬 처리 필요
    // 7. DTO로 변환 (Campaign, Blog 조인)
    const dataPromises = paginatedBidLogs.map(async (log) => {
      const campaign = userCampaigns.find((c) => c.id === log.campaignId);
      const blog = await this.blogRepository.findById(log.blogId);
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
        blogDomain: blog?.domain || 'unknown.com',
        bidAmount: log.bidPrice,
        winAmount: winAmount,
        isWon: log.status === BidStatus.WIN,
        isHighIntent: log.isHighIntent,
        behaviorScore: log.behaviorScore,
      };
    });

    const data: BidLogItemDto[] = await Promise.all(dataPromises);

    // 8. 최종 응답 형식
    return {
      status: 'success',
      message: '광고주 실시간 입찰 로그입니다.',
      data,
      timestamp: new Date().toISOString(),
    };
  }
}
