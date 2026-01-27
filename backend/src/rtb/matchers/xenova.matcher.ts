import { Inject, Injectable, Logger } from '@nestjs/common';
import { Matcher } from './matcher.interface';
import { CampaignRepository } from '../../campaign/repository/campaign.repository.interface';
import { MLEngine } from '../ml/mlEngine.interface';
import type { Candidate, DecisionContext } from '../types/decision.types';
import { REDIS_CLIENT } from 'src/redis/redis.module';

import { Redis } from 'ioredis';
import { CampaignEntity } from 'src/campaign/entities/campaign.entity';

@Injectable()
export class TransformerMatcher extends Matcher {
  private readonly logger = new Logger(TransformerMatcher.name);
  // 유사도 임계값
  private readonly SIMILARITY_THRESHOLD = 0.4;
  private readonly K_NEAREST_NEIGHBORS = 10; // 상위 10개 추출

  constructor(
    private readonly campaignRepo: CampaignRepository,
    private readonly mlEngine: MLEngine,
    @Inject(REDIS_CLIENT) private readonly redis: any // ioredis 인스턴스
  ) {
    super();
  }

  //  ML 모델(Transformer)을 사용하여 문맥(Tags)과 유사도가 높은 캠페인 후보를 찾습니다.
  async findCandidatesByTags(context: DecisionContext): Promise<Candidate[]> {
    if (!this.mlEngine.isReady()) {
      this.logger.warn('ML 모델이 준비가 안 되었습니다.');
      return [];
    }

    const requestText = this.buildRequestText(context.tags);

    // 1. 쿼리 벡터 생성
    const queryVector = await this.mlEngine.getEmbedding(requestText);
    const vectorBuffer = Buffer.from(new Float32Array(queryVector).buffer);

    try {
      // 2. Redis Vector Search 실행
      // 쿼리: (*)=>[KNN 10 @embedding $vec AS score]
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const searchResult = await this.redis.call(
        'FT.SEARCH',
        'campaign_idx',
        `(*)=>[KNN ${this.K_NEAREST_NEIGHBORS} @embedding $vec AS score]`,
        'PARAMS',
        '2',
        'vec',
        vectorBuffer,
        'SORTBY',
        'score',
        'DIALECT',
        '2'
      );

      // 3. 결과 파싱 및 JSON 조회
      const candidates: Candidate[] = [];
      const result = searchResult as any[];
      const totalCount = result[0] as number;

      if (totalCount === 0) {
        return [];
      }

      const keys: string[] = [];
      const scores: Map<string, number> = new Map();

      for (let i = 1; i < result.length; i += 2) {
        const key = result[i] as string;
        const details = result[i + 1] as any[];

        let score = 0;
        for (let j = 0; j < details.length; j += 2) {
          if (details[j] === 'score') {
            score = parseFloat(details[j + 1]);
            break;
          }
        }

        // 1 - distance = similarity (Cosine distance)
        const similarity = 1 - score;

        if (similarity >= this.SIMILARITY_THRESHOLD) {
          keys.push(key);
          scores.set(key, similarity);
        }
      }

      if (keys.length === 0) {
        return [];
      }

      // 4. JSON.MGET으로 데이터 일괄 조회
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const jsonResults = await this.redis.call('JSON.MGET', ...keys, '$');

      const parsedResults = (jsonResults as any[]).map((res) => {
        if (!res) return null;
        const jsonStr = Array.isArray(res) ? res[0] : res;
        return JSON.parse(jsonStr);
      });

      for (let i = 0; i < parsedResults.length; i++) {
        const campaignData = parsedResults[i];
        const key = keys[i];

        if (campaignData) {
          const campaign = {
            ...campaignData,
            startDate: new Date(campaignData.startDate),
            endDate: new Date(campaignData.endDate),
            createdAt: new Date(campaignData.createdAt),
            lastResetDate: new Date(campaignData.lastResetDate),
          } as CampaignEntity;

          candidates.push({
            campaign,
            similarity: scores.get(key) || 0,
          });
        }
      }

      return candidates;
    } catch (error) {
      this.logger.error('Redis Vector Search failed:', error);
      return [];
    }
  }

  // 요청 태그 배열을 임베딩을 위한 단일 텍스트로 변환합니다.
  private buildRequestText(tags: string[]): string {
    return tags.join(' ');
  }
}
