import type {
  Campaign,
  DecisionContext,
  ScoringResult,
} from '../types/decision.types';

// 추후 ML 모델 기반 스코어링 전략을 위해서 Promise 기반으로 정의
export abstract class Scorer {
  abstract score(
    campaign: Campaign,
    context: DecisionContext
  ): Promise<ScoringResult>;
}
