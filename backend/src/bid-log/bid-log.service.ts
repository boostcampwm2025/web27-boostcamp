import { Injectable, MessageEvent } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable } from 'rxjs';
import { BidStatus } from './bid-log.types';
import { BidLogRepository } from './repositories/bid-log.repository.interface';
import { BidLogDataDto, BidLogItemDto } from './dto/bid-log-response.dto';
import { CampaignRepository } from 'src/campaign/repository/campaign.repository.interface';
import { BlogRepository } from 'src/blog/repository/blog.repository.interface';

@Injectable()
export class BidLogService {
  constructor(
    private readonly bidLogRepository: BidLogRepository,
    private readonly campaignRepository: CampaignRepository,
    private readonly blogRepository: BlogRepository,
    private readonly eventEmitter: EventEmitter2
  ) {}

  async getRealtimeBidLogs(
    userId: number,
    limit: number,
    offset: number,
    startDate?: string,
    endDate?: string
  ): Promise<BidLogDataDto> {
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
        postUrl: log.postUrl || blog?.domain || 'unknown.com',
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
      total,
      hasMore,
      bids,
    };
  }

  // SSE: 실시간 입찰 이벤트 구독
  subscribeToBidEvents(userId: number): Observable<MessageEvent> {
    return new Observable((observer) => {
      const listener = (bid: BidLogItemDto) => {
        // 해당 광고주의 입찰만 필터링
        if (bid.userId === userId) {
          observer.next({
            data: JSON.stringify(bid),
          } as MessageEvent);
        }
      };

      // 이벤트 리스너 등록
      this.eventEmitter.on('bid.created', listener);

      // 연결 종료 시 리스너 제거 (메모리 누수 방지)
      return () => {
        this.eventEmitter.off('bid.created', listener);
      };
    });
  }

  // RTB에서 호출할 이벤트 발행 메서드
  async emitBidCreated(bidLogId: number): Promise<void> {
    // BidLog 조회 및 DTO 변환
    const log = await this.bidLogRepository.findById(bidLogId);
    if (!log) return;

    const campaign = await this.campaignRepository.getById(log.campaignId);
    const blog = await this.blogRepository.findById(log.blogId);
    const winAmount = await this.bidLogRepository.findWinAmountByAuctionId(
      log.auctionId
    );

    const bidData: BidLogItemDto & { userId: number } = {
      id: log.id!,
      createdAt: log.createdAt!,
      campaignId: log.campaignId,
      campaignTitle: campaign?.title || 'Unknown Campaign',
      blogKey: blog?.blogKey || 'Unknown Blog Key',
      blogName: blog?.name || 'Unknown Blog',
      postUrl: log.postUrl || blog?.domain || 'unknown.com',
      bidAmount: log.bidPrice,
      winAmount: winAmount,
      isWon: log.status === BidStatus.WIN,
      isHighIntent: log.isHighIntent,
      behaviorScore: log.behaviorScore,
      userId: campaign?.userId || 0,
    };

    // 이벤트 발행
    this.eventEmitter.emit('bid.created', bidData);
  }
}
