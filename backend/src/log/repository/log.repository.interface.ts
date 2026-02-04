import { SaveClickLog, SaveViewLog, AggregateClick } from '../types/log.type';

export abstract class LogRepository {
  // 뷰 로그 저장
  abstract saveViewLog(dto: SaveViewLog): Promise<number>;

  // 클릭 로그 저장
  abstract saveClickLog(dto: SaveClickLog): Promise<number>;

  // 뷰 ID로 뷰 로그 조회
  abstract getViewLog(viewId: number): Promise<SaveViewLog | undefined>;

  // 전체 뷰 로그 목록 조회
  abstract listViewLogs(): Promise<SaveViewLog[]>;

  // 전체 클릭 로그 목록 조회
  abstract listClickLogs(): Promise<SaveClickLog[]>;

  // 통계 집계 메서드
  abstract countViewLogsByCampaignIds(
    campaignIds: string[]
  ): Promise<Map<string, number>>;

  abstract countClickLogsByCampaignIds(
    campaignIds: string[]
  ): Promise<Map<string, number>>;

  // 클릭 히스토리 조회 (캠페인 상세 페이지용)
  abstract getClickHistoryByCampaignId(
    campaignId: string,
    limit: number,
    offset: number
  ): Promise<{
    logs: Array<{
      id: number;
      createdAt: Date | null;
      postUrl: string | null;
      blogName: string;
      cost: number;
      behaviorScore: number | null;
      isHighIntent: boolean;
    }>;
    total: number;
  }>;

  abstract existsByViewId(viewId: number): Promise<boolean>;

  // Phase 7: 정산용 집계 메서드
  abstract aggregateClicksByDate(date: Date): Promise<Array<AggregateClick>>;

  abstract aggregateTotalClicksByCampaign(): Promise<Array<AggregateClick>>;

  // viewId로 blogId와 cost 조회 (퍼블리셔 수익 지급용)
  abstract getBlogIdAndCostByViewId(
    viewId: number
  ): Promise<{ blogId: number; cost: number } | null>;
}
