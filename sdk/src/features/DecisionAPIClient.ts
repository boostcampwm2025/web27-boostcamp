import type {
  APIClient,
  DecisionRequest,
  DecisionResponse,
  SDKConfig,
  Tag,
} from '@/shared/types';

// Decision API 클라이언트 (광고 가져오기)
export class DecisionAPIClient implements APIClient {
  constructor(private readonly config: SDKConfig) {}

  async fetchDecision(
    tags: Tag[],
    postUrl: string,
    behaviorScore: number = 0,
    isHighIntent: boolean = false
  ): Promise<DecisionResponse> {
    const requestBody: DecisionRequest = {
      blogKey: this.config.blogKey,
      tags: tags.map((tag) => tag.name),
      postUrl,
      behaviorScore,
      isHighIntent,
    };

    try {
      const response = await fetch(`${this.config.apiBase}/sdk/decision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API 오류: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[BoostAD SDK] API 호출 실패:', error);
      // API 실패 시 빈 응답 반환 (광고 없음 상태)
      return {
        status: 'error',
        message: 'API 호출 실패',
        data: {
          campaign: null,
          auctionId: '',
        },
        timestamp: new Date().toISOString(),
      };
    }
  }
}
