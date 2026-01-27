import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { MLEngine } from 'src/rtb/ml/mlEngine.interface';
import { CampaignCacheRepository } from 'src/campaign/repository/campaign.cache.repository.interface';
import { BlogCacheRepository } from 'src/blog/repository/blog.cache.repository.interface';

@Processor('embedding-queue')
export class EmbeddingWorker extends WorkerHost {
  private readonly logger = new Logger(EmbeddingWorker.name);

  constructor(
    private readonly mlEngine: MLEngine,
    private readonly campaignCacheRepository: CampaignCacheRepository,
    private readonly blogCacheRepository: BlogCacheRepository
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);

    try {
      if (job.name === 'generate-campaign-embedding') {
        const { campaignId, text } = job.data as {
          campaignId: string;
          text: string;
        };
        await this.generateCampaignEmbedding(campaignId, text);
      } else if (job.name === 'generate-blog-embedding') {
        const { blogId, text } = job.data as { blogId: number; text: string };
        await this.generateBlogEmbedding(blogId, text);
      }
    } catch (error) {
      this.logger.error(`Job ${job.id} failed:`, error);
      throw error;
    }
  }

  private async generateCampaignEmbedding(campaignId: string, text: string) {
    // 1. 임베딩 생성
    const embedding = await this.mlEngine.getEmbedding(text);

    // 2. Repository를 통해 Redis에 임베딩 업데이트
    await this.campaignCacheRepository.updateCampaignEmbeddingById(
      campaignId,
      embedding
    );

    this.logger.log(`Generated embedding for campaign ${campaignId}`);
  }

  private async generateBlogEmbedding(blogId: number, text: string) {
    // 1. 임베딩 생성
    const embedding = await this.mlEngine.getEmbedding(text);

    // 2. Repository를 통해 Redis에 임베딩 업데이트
    await this.blogCacheRepository.updateBlogEmbeddingById(blogId, embedding);

    this.logger.log(`Generated embedding for blog ${blogId}`);
  }
}
