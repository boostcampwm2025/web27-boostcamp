import { Injectable, OnModuleInit, Logger } from '@nestjs/common';

import { MLEngine } from './mlEngine.interface';
import type { Pipeline } from '@xenova/transformers';

@Injectable()
export class XenovaMLEngine extends MLEngine implements OnModuleInit {
  private readonly logger = new Logger(XenovaMLEngine.name);
  private embedder: Pipeline | null = null;
  private modelReady = false;

  // 사용할 모델과 태스크 정의
  private static readonly TASK = 'feature-extraction';
  private static readonly MODEL = 'Xenova/all-MiniLM-L6-v2';

  // 서버 시작 시 모델 로딩
  async onModuleInit() {
    this.logger.log('🔄 Transformer 모델 로딩 중');
    try {
      await this.loadModel();
      this.modelReady = true;
      this.logger.log(
        `✅ ${XenovaMLEngine.MODEL}이 성공적으로 로드 되었습니다!`
      );
    } catch (error) {
      this.logger.error('모델 로드를 실패하였습니다.:', error);
      this.modelReady = false;
    }
  }

  isReady(): boolean {
    return this.modelReady;
  }

  async getEmbedding(text: string): Promise<number[]> {
    if (!this.embedder) {
      throw new Error('Model not loaded yet');
    }

    const result = await this.embedder(text, {
      pooling: 'mean',
      normalize: true,
    });

    return Array.from(result.data);
  }

  calculateSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      throw new Error(
        `Vector dimensions must match: ${vecA.length} vs ${vecB.length}`
      );
    }

    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    return Math.max(0, Math.min(1, dotProduct));
  }

  async computeTextSimilarity(textA: string, textB: string): Promise<number> {
    const [embA, embB] = await Promise.all([
      this.getEmbedding(textA),
      this.getEmbedding(textB),
    ]);
    return this.calculateSimilarity(embA, embB);
  }

  private async loadModel() {
    // transformers 모듈 동적 로드
    const { pipeline } = await import('@xenova/transformers');

    // 이제 pipeline으로 모델 로드
    this.embedder = await pipeline(XenovaMLEngine.TASK, XenovaMLEngine.MODEL);
  }
}
