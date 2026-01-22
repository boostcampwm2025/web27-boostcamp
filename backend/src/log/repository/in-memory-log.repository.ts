import { SaveClickLog } from '../types/save-click-log.type';
import { SaveViewLog } from '../types/save-view-log.type';
import { LogRepository } from './log.repository.interface';

export class InMemoryLogRepository extends LogRepository {
  private readonly viewLog = new Map<number, SaveViewLog>();
  private viewLogIdx = 0;
  private readonly clickLog = new Map<number, SaveClickLog>();
  private clickLogIdx = 0;

  // 인메모리 Map 자료구조에 저장
  saveViewLog(dto: SaveViewLog): Promise<number> {
    this.viewLogIdx += 1;
    this.viewLog.set(this.viewLogIdx, { ...dto });

    return Promise.resolve(this.viewLogIdx);
  }

  saveClickLog(dto: SaveClickLog): Promise<number> {
    this.clickLogIdx += 1;
    this.clickLog.set(this.clickLogIdx, { ...dto });

    return Promise.resolve(this.clickLogIdx);
  }

  getViewLog(viewId: number): Promise<SaveViewLog | undefined> {
    return Promise.resolve(this.viewLog.get(viewId));
  }

  listViewLogs(): Promise<SaveViewLog[]> {
    return Promise.resolve(Array.from(this.viewLog.values()));
  }

  listClickLogs(): Promise<SaveClickLog[]> {
    return Promise.resolve(Array.from(this.clickLog.values()));
  }

  countViewLogsByCampaignIds(
    campaignIds: string[]
  ): Promise<Map<string, number>> {
    const counts = new Map<string, number>();

    // 캠페인 ID별로 ViewLog 개수 집계
    for (const viewLog of this.viewLog.values()) {
      if (campaignIds.includes(viewLog.campaignId)) {
        const currentCount = counts.get(viewLog.campaignId) || 0;
        counts.set(viewLog.campaignId, currentCount + 1);
      }
    }

    // 요청한 모든 campaignId에 대해 0으로 초기화 (없는 경우 대비)
    campaignIds.forEach((id) => {
      if (!counts.has(id)) {
        counts.set(id, 0);
      }
    });

    return Promise.resolve(counts);
  }

  countClickLogsByCampaignIds(
    campaignIds: string[]
  ): Promise<Map<string, number>> {
    const counts = new Map<string, number>();

    // ViewLog를 통해 campaign_id 매핑 필요
    for (const clickLog of this.clickLog.values()) {
      const viewLog = this.viewLog.get(clickLog.viewId);
      if (viewLog && campaignIds.includes(viewLog.campaignId)) {
        const currentCount = counts.get(viewLog.campaignId) || 0;
        counts.set(viewLog.campaignId, currentCount + 1);
      }
    }

    // 요청한 모든 campaignId에 대해 0으로 초기화
    campaignIds.forEach((id) => {
      if (!counts.has(id)) {
        counts.set(id, 0);
      }
    });

    return Promise.resolve(counts);
  }
}
