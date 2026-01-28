import { CachedCampaign } from '../types/campaign.types';

export abstract class CampaignCacheRepository {
  abstract saveCampaignCacheById(
    id: string,
    data: CachedCampaign,
    ttl?: number
  ): Promise<void>;
  abstract findCampaignCacheById(id: string): Promise<CachedCampaign | null>;
  abstract updateDailySpentCacheById(id: string, amount: number): Promise<void>;

  // 태그별 임베딩 업데이트
  abstract updateCampaignEmbeddingTags(
    id: string,
    embeddingTags: { [tagName: string]: number[] }
  ): Promise<void>;

  abstract deleteCampaignCacheById(id: string): Promise<void>;
  abstract existsCampaignCacheById(id: string): Promise<boolean>;
}
