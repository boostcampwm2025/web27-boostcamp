// 또는 더 명확하게 분리하려면:
export interface CampaignEmbeddingJobData {
  campaignId: string;
  text: string;
}

export interface BlogEmbeddingJobData {
  blogId: string;
  text: string;
}

// Union 타입으로 통합
export type EmbeddingJobData = CampaignEmbeddingJobData | BlogEmbeddingJobData;
