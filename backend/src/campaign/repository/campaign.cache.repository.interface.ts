import { CachedCampaign } from '../types/campaign.types';

export abstract class CampaignCacheRepository {
  abstract saveCampaignCacheById(
    id: string,
    data: CachedCampaign,
    ttl?: number
  ): Promise<void>;
  abstract findCampaignCacheById(id: string): Promise<CachedCampaign | null>;

  // 상태만 업데이트 (embeddingTags 보존)
  abstract updateCampaignStatus(id: string, status: string): Promise<void>;

  abstract updateDailySpentCacheById(id: string, amount: number): Promise<void>;

  // 태그별 임베딩 업데이트
  abstract updateCampaignEmbeddingTags(
    id: string,
    embeddingTags: { [tagName: string]: number[] }
  ): Promise<void>;

  abstract deleteCampaignCacheById(id: string): Promise<void>;
  abstract existsCampaignCacheById(id: string): Promise<boolean>;

  // RTB 비딩용: 모든 캠페인 조회 (Redis에서)
  abstract getAllCampaigns(): Promise<CachedCampaign[]>;
}
