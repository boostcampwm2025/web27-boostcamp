// Campaign 임베딩 Job (Worker가 Redis에서 태그 조회)
export interface CampaignEmbeddingJobData {
  campaignId: string;
  text?: string; // 더 이상 사용하지 않음 (하위 호환성 유지)
}

export interface BlogEmbeddingJobData {
  blogId: number;
  text: string;
}

// Union 타입으로 통합
export type EmbeddingJobData = CampaignEmbeddingJobData | BlogEmbeddingJobData;
