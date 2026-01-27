import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger, Inject } from '@nestjs/common';
import { MLEngine } from 'src/rtb/ml/mlEngine.interface';
import { REDIS_CLIENT } from 'src/redis/redis.module';
import Redis from 'ioredis';

@Processor('embedding-queue')
export class EmbeddingWorker extends WorkerHost {
  private readonly logger = new Logger(EmbeddingWorker.name);

  constructor(
    private readonly mlEngine: MLEngine,
    @Inject(REDIS_CLIENT) private readonly redis: any
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);

    try {
      if (job.name === 'generate-campaign-embedding') {
        const { campaignId, text } = job.data;
        await this.generateCampaignEmbedding(campaignId, text);
      } else if (job.name === 'generate-blog-embedding') {
        const { blogId, text } = job.data;
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

    // 2. Redis JSON에 임베딩 추가
    const key = `campaign:${campaignId}`;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await this.redis.call(
      'JSON.SET',
      key,
      '$.embedding',
      JSON.stringify(embedding)
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await this.redis.call(
      'JSON.SET',
      key,
      '$.embedding_version',
      JSON.stringify('all-MiniLM-L6-v2')
    );

    this.logger.log(`Generated embedding for campaign ${campaignId}`);
  }

  private async generateBlogEmbedding(blogId: string, text: string) {
    const embedding = await this.mlEngine.getEmbedding(text);
    const key = `blog:${blogId}`;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await this.redis.call(
      'JSON.SET',
      key,
      '$.embedding',
      JSON.stringify(embedding)
    );

    this.logger.log(`Generated embedding for blog ${blogId}`);
  }
}
