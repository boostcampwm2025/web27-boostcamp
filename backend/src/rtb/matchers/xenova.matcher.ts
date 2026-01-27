import { Injectable, Logger } from '@nestjs/common';
import { Matcher } from './matcher.interface';
import { CampaignRepository } from '../../campaign/repository/campaign.repository.interface';
import { MLEngine } from '../ml/mlEngine.interface';
import type { Candidate, DecisionContext } from '../types/decision.types';
import type { CampaignWithTags } from '../../campaign/types/campaign.types';
@Injectable()
export class TransformerMatcher extends Matcher {
  private readonly logger = new Logger(TransformerMatcher.name);

  // 유사도 임계값
  private readonly SIMILARITY_THRESHOLD = 0.4;

  constructor(
    private readonly campaignRepo: CampaignRepository,
    private readonly mlEngine: MLEngine
  ) {
    super();
  }

  //  ML 모델(Transformer)을 사용하여 문맥(Tags)과 유사도가 높은 캠페인 후보를 찾습니다.
  async findCandidatesByTags(context: DecisionContext): Promise<Candidate[]> {
    // ML 모델 준비 안 됐으면 빈 배열 반환 (Scorer에서 태그 매칭으로 커버 예정)
    if (!this.mlEngine.isReady()) {
      this.logger.warn('ML 모델이 준비가 안 되었습니다.');
      return [];
    }

    const requestText = this.buildRequestText(context.tags);
    const allCampaigns = await this.campaignRepo.getAll();

    // 모든 캠페인과 유사도 계산
    const withSimilarity = await Promise.all(
      allCampaigns.map(async (campaign) => {
        const campaignText = this.buildCampaignText(campaign);

        const similarity = await this.mlEngine.computeTextSimilarity(
          requestText,
          campaignText
        );
        return { campaign, similarity };
      })
    );

    // 임계값 이상만 필터링
    const candidates = withSimilarity.filter(
      ({ similarity }) => similarity >= this.SIMILARITY_THRESHOLD
    );

    this.logger.debug(
      `필터링된 캠페인 수 ${candidates.length}/${allCampaigns.length} 캠페인의 유사도 (임계값: ${this.SIMILARITY_THRESHOLD})`
    );

    return candidates;
  }

  // 요청 태그 배열을 임베딩을 위한 단일 텍스트로 변환합니다.
  private buildRequestText(tags: string[]): string {
    return tags.join(' ');
  }

  //  캠페인 정보를 임베딩을 위한 단일 텍스트로 변환합니다.
  private buildCampaignText(campaign: CampaignWithTags): string {
    const tagNames = (campaign.tags ?? []).map((t) => t.name).join(' ');

    // return `${campaign.title} ${campaign.content} ${tagNames}`; // 더 풍부한 문맥은 추후에 고려

    return tagNames;
  }
}
