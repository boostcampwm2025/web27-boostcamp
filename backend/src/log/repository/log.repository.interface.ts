import { SaveClickLog } from '../types/save-click-log.type';
import { SaveViewLog } from '../types/save-view-log.type';

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

  abstract existsByViewId(viewId: number): Promise<boolean>;
}
