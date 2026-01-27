import { Inject, Injectable, Logger } from '@nestjs/common';
import { Matcher } from './matcher.interface';
import { CampaignCacheRepository } from '../../campaign/repository/campaign.cache.repository.interface';
import { MLEngine } from '../ml/mlEngine.interface';
import { IOREDIS_CLIENT } from '../../redis/redis.constant';
import type { AppIORedisClient } from '../../redis/redis.type';
import type { Candidate, DecisionContext } from '../types/decision.types';
import type { CachedCampaign } from '../../campaign/types/campaign.types';

@Injectable()
export class TransformerMatcher extends Matcher {
  private readonly logger = new Logger(TransformerMatcher.name);

  // Vector Search 파라미터
  private readonly TOP_K = 10; // 상위 10개 캠페인 검색
  private readonly INDEX_NAME = 'idx:campaign';

  constructor(
    private readonly campaignCacheRepository: CampaignCacheRepository,
    private readonly mlEngine: MLEngine,
    @Inject(IOREDIS_CLIENT) private readonly ioredisClient: AppIORedisClient
  ) {
    super();
  }

  /**
   * Redis Vector Search를 사용하여 문맥(Tags)과 유사도가 높은 캠페인 후보를 찾습니다.
   */
  async findCandidatesByTags(context: DecisionContext): Promise<Candidate[]> {
    // ML 모델 준비 안 됐으면 빈 배열 반환
    if (!this.mlEngine.isReady()) {
      this.logger.warn('ML 모델이 준비되지 않았습니다.');
      return [];
    }

    try {
      // 1. 요청 태그를 텍스트로 변환
      const requestText = this.buildRequestText(context.tags);

      // 2. 요청 텍스트의 임베딩 생성
      const queryEmbedding = await this.mlEngine.getEmbedding(requestText);

      // 3. Redis Vector Search 수행
      const searchResults = await this.vectorSearch(queryEmbedding);

      // 4. 검색 결과를 Candidate 형식으로 변환
      const candidates = searchResults.map((result) => ({
        campaign: this.convertToCampaignWithTags(result.campaign),
        similarity: 1 - result.score, // COSINE distance를 similarity로 변환 (0~1)
      }));

      this.logger.debug(
        `Vector Search 결과: ${candidates.length}개 캠페인 (TOP_K: ${this.TOP_K})`
      );

      return candidates;
    } catch (error) {
      this.logger.error('Vector Search 실패:', error);
      return [];
    }
  }

  /**
   * Redis FT.SEARCH를 사용한 유사도 기반 Vector 유사도 검색
   */
  private async vectorSearch(
    queryEmbedding: number[],
    distanceThreshold: number = 0.6 // COSINE distance 기준 (0.6 = 1- 유사도 0.4)
  ): Promise<Array<{ campaign: CachedCampaign; score: number }>> {
    try {
      const embeddingBlob = Buffer.from(
        new Float32Array(queryEmbedding).buffer
      );

      const result = (await this.ioredisClient.call(
        'FT.SEARCH',
        this.INDEX_NAME,
        // Vector Range Query: distance threshold 이내의 모든 결과
        `@status:{ACTIVE} @embedding:[VECTOR_RANGE ${distanceThreshold} $query_vec]=>{$YIELD_DISTANCE_AS: __embedding_score}`,
        'PARAMS',
        '2',
        'query_vec',
        embeddingBlob,
        'SORTBY',
        '__embedding_score',
        'ASC', // 거리 오름차순 정렬
        'RETURN',
        '2',
        '$',
        '__embedding_score',
        'DIALECT',
        '2'
      )) as unknown[];

      return this.parseSearchResults(result);
    } catch (error) {
      this.logger.error('FT.SEARCH 실행 실패:', error);
      return [];
    }
  }

  /**
   * FT.SEARCH 결과 파싱
   */
  private parseSearchResults(
    result: unknown[]
  ): Array<{ campaign: CachedCampaign; score: number }> {
    if (!Array.isArray(result) || result.length < 1) {
      return [];
    }

    const totalResults = result[0] as number;
    if (totalResults === 0) {
      return [];
    }

    const results: Array<{ campaign: CachedCampaign; score: number }> = [];

    // 결과는 [총개수, key1, [field1, value1, ...], key2, [field2, value2, ...], ...] 형식
    for (let i = 1; i < result.length; i += 2) {
      const fields = result[i + 1] as string[];

      // JSON 데이터 추출
      const jsonIndex = fields.indexOf('$');
      if (jsonIndex === -1 || jsonIndex + 1 >= fields.length) continue;

      const jsonData = fields[jsonIndex + 1];
      const campaign = JSON.parse(jsonData) as CachedCampaign;

      // Score 추출
      const scoreIndex = fields.indexOf('__embedding_score');
      const score =
        scoreIndex !== -1 && scoreIndex + 1 < fields.length
          ? parseFloat(fields[scoreIndex + 1])
          : 1.0;

      results.push({ campaign, score });
    }

    return results;
  }

  /**
   * CachedCampaign을 CampaignWithTags 형식으로 변환
   */
  private convertToCampaignWithTags(cached: CachedCampaign): any {
    return {
      id: cached.id,
      userId: cached.userId,
      title: cached.title,
      content: cached.content,
      image: cached.image,
      url: cached.url,
      maxCpc: cached.maxCpc,
      dailyBudget: cached.dailyBudget,
      totalBudget: cached.totalBudget,
      dailySpent: cached.dailySpent,
      totalSpent: cached.totalSpent,
      lastResetDate: new Date(cached.lastResetDate),
      isHighIntent: cached.isHighIntent,
      status: cached.status,
      startDate: new Date(cached.startDate),
      endDate: new Date(cached.endDate),
      createdAt: new Date(cached.createdAt),
      tags: [], // TODO: 태그 정보는 별도로 조회 필요 (현재는 빈 배열)
    };
  }

  /**
   * 요청 태그 배열을 임베딩을 위한 단일 텍스트로 변환
   */
  private buildRequestText(tags: string[]): string {
    return tags.join(' ');
  }

  // ============== 보류 ================
  /**
   * Redis FT.SEARCH를 사용한 KNN기반 Vector 유사도 검색
   */
  // private async vectorSearch(
  //   queryEmbedding: number[]
  // ): Promise<Array<{ campaign: CachedCampaign; score: number }>> {
  //   try {
  //     // FT.SEARCH 명령어 구성
  //     const embeddingBlob = Buffer.from(
  //       new Float32Array(queryEmbedding).buffer
  //     );

  //     const result = (await this.ioredisClient.call(
  //       'FT.SEARCH',
  //       this.INDEX_NAME,
  //       // KNN 벡터 검색 쿼리: status가 ACTIVE이고 embedding 유사도 상위 K개
  //       `@status:{ACTIVE} => [KNN ${this.TOP_K} @embedding $query_vec AS __embedding_score]`,
  //       'PARAMS',
  //       '2',
  //       'query_vec',
  //       embeddingBlob,
  //       'SORTBY',
  //       '__embedding_score',
  //       'LIMIT',
  //       '0',
  //       this.TOP_K.toString(),
  //       'RETURN',
  //       '2',
  //       '$',
  //       '__embedding_score',
  //       'DIALECT',
  //       '2'
  //     )) as unknown[];

  //     // 결과 파싱
  //     return this.parseSearchResults(result);
  //   } catch (error) {
  //     this.logger.error('FT.SEARCH 실행 실패:', error);
  //     return [];
  //   }
  // }
}
