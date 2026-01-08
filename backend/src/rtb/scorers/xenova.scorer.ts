import { Injectable, Logger } from '@nestjs/common';
import { Scorer } from './scorer.interface';
// import { MLEngine } from '../ml/mlEngine.interface';
import type { Candidate, ScoredCandidate } from '../types/decision.types';

@Injectable()
export class TransformerScorer extends Scorer {
  private readonly logger = new Logger(TransformerScorer.name);

  // 점수 공식 가중치 (설정으로 분리)
  private readonly CPC_WEIGHT = 0.3;
  private readonly SIMILARITY_WEIGHT = 0.7;

  constructor() {
    super();
  }

  /**
   * 여러 캠페인 후보의 점수를 병렬(비동기)로 계산합니다.
   *
   * @param candidates - 점수를 매길 캠페인 후보 목록
   * @returns 점수가 계산된 캠페인 목록
   */
  async scoreCandidates(candidates: Candidate[]): Promise<ScoredCandidate[]> {
    return Promise.all(
      candidates.map((candidate) => this.scoreCandidate(candidate))
    );
  }

  /**
   * 단일 캠페인의 점수를 계산합니다.
   * CPC와 유사도(Similarity)를 가중치에 따라 합산합니다.
   *
   * @param candidate - 점수를 매길 단일 캠페인 후보
   * @returns 점수가 포함된 캠페인 객체 (Promise)
   */
  private scoreCandidate(candidate: Candidate): Promise<ScoredCandidate> {
    const { campaign, similarity } = candidate;

    // 1. 매칭된 태그 계산
    // const matchedTags = campaign.tags.filter((tag) =>
    //   context.tags.includes(tag.name)
    // );

    // 2. 점수 계산: CPC * 0.3 + Similarity * 70
    const cpc = campaign.max_cpc;
    const cpcScore = cpc * this.CPC_WEIGHT;
    const similarityScore = similarity * 100 * this.SIMILARITY_WEIGHT;
    const finalScore = cpcScore + similarityScore;

    this.logger.debug(
      `Campaign ${campaign.id}: ` +
        `CPC=${cpc}(${cpcScore.toFixed(1)}점), ` +
        `Similarity=${similarity.toFixed(3)}(${similarityScore.toFixed(1)}점), ` +
        `Total=${finalScore.toFixed(1)}점`
    );

    return Promise.resolve({
      ...campaign,
      score: finalScore,
    });
  }
}
