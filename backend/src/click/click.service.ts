import { Injectable } from '@nestjs/common';
import { ClickLogRepository } from './click-log.repository';
import { ClickLog } from '../types/click-log';
import { TrackClickDto, TrackClickResponseDto } from '../types/dto/track-click.dto';

@Injectable()
export class ClickService {
  constructor(private readonly clickLogRepository: ClickLogRepository) { }

  trackClick(dto: TrackClickDto): TrackClickResponseDto {
    const { campaignId, campaignName, url } = dto;

    const timestamp = new Date().toISOString();
    const trackingUrl = this.buildTrackingUrl(url, campaignId);

    const clickLog: ClickLog = {
      timestamp,
      campaignId,
      campaignName,
      url: trackingUrl,
    };

    this.clickLogRepository.save(clickLog);

    return {
      redirectUrl: trackingUrl,
      logId: `${campaignId}-${Date.now()}`,
      timestamp,
    };
  }

  getRecentLogs(limit: number = 10): ClickLog[] {
    return this.clickLogRepository.findRecent(limit);
  }

  private buildTrackingUrl(baseUrl: string, campaignId: string): string {
    const url = new URL(baseUrl);
    url.searchParams.append('utm_source', 'quantad');
    url.searchParams.append('utm_campaign', campaignId);
    url.searchParams.append('utm_medium', 'cpc');
    return url.toString();
  }
}
