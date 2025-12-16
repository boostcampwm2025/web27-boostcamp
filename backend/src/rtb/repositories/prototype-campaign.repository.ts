import { Injectable, OnModuleInit } from '@nestjs/common';
import type { CampaignRepository } from './campaign.repository.interface';
import type { Campaign, Tag } from '../types/decision.types';
import { readFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class PrototypeCampaignRepository
  implements CampaignRepository, OnModuleInit
{
  private campaigns: Campaign[] = [];

  async onModuleInit() {
    // 서버 시작 시 한 번만 파일을 비동기로 읽어 메모리에 적재 -> 나중에 Redis로 전환 필요
    const filePath = join(process.cwd(), 'src/data/campaigns.mock.json');
    const fileContent = await readFile(filePath, 'utf-8');
    this.campaigns = JSON.parse(fileContent) as Campaign[];
  }

  findByTags(tags: Tag[]): Promise<Campaign[]> {
    const tagNames = tags.map((tag) => tag.name);
    return Promise.resolve(
      this.campaigns.filter((campaign) =>
        campaign.tags.some((tag) => tagNames.includes(tag.name))
      )
    );
  }

  findById(id: string): Promise<Campaign | null> {
    return Promise.resolve(this.campaigns.find((c) => c.id === id) || null);
  }

  findAll(): Promise<Campaign[]> {
    return Promise.resolve(this.campaigns);
  }
}
