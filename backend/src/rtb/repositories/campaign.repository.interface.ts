import type { Campaign, Tag } from '../types/decision.types';

// 나중에 redis 캐시로 전환 시, 비동기 처리를 위해 Promise 반환 타입 사용
export abstract class CampaignRepository {
  abstract findByTags(tags: Tag[]): Promise<Campaign[]>;
  abstract findById(id: string): Promise<Campaign | null>;
  abstract findAll(): Promise<Campaign[]>;
}
