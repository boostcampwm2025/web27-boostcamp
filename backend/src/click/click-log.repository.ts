import { Injectable } from '@nestjs/common';
import { ClickLog } from '../types/click-log';

@Injectable()
export class ClickLogRepository {
  private clickLogs: ClickLog[] = [];

  save(clickLog: ClickLog): void {
    this.clickLogs.unshift(clickLog);
  }

  findRecent(limit: number = 10): ClickLog[] {
    return this.clickLogs.slice(0, limit);
  }

  count(): number {
    return this.clickLogs.length;
  }

  findByCampaignId(campaignId: string): ClickLog[] {
    return this.clickLogs.filter((log) => log.campaignId === campaignId);
  }
}
