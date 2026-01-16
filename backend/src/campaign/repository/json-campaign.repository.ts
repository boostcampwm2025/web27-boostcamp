import { Injectable } from '@nestjs/common';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CampaignRepository } from './campaign.repository';
import { CampaignStatus, CampaignWithTags, Tag } from '../types/campaign.types';

type FixtureCampaign = {
  id: string;
  user_id: number;
  title: string;
  content: string;
  image: string;
  url: string;
  tags?: Tag[];
  max_cpc: number;
  daily_budget: number;
  total_budget: number | null;
  is_high_intent: boolean;
  status: CampaignStatus;
  start_date: string;
  end_date: string;
  created_at: string;
  deleted_at: string | null;
};

type Fixture = {
  campaigns: FixtureCampaign[];
};

@Injectable()
export class JsonCampaignRepository extends CampaignRepository {
  private readonly campaignsById: Map<string, CampaignWithTags>;
  private readonly campaigns: CampaignWithTags[];

  constructor() {
    super();
    const campaigns = loadFixture().campaigns.map(toCampaignWithTags);
    this.campaigns = campaigns;
    this.campaignsById = new Map(campaigns.map((c) => [c.id, c]));
  }

  getAll(): Promise<CampaignWithTags[]> {
    return Promise.resolve([...this.campaigns]);
  }

  getById(campaignId: string): Promise<CampaignWithTags | null> {
    return Promise.resolve(this.campaignsById.get(campaignId) ?? null);
  }

  getByTags(tags: Tag[]): Promise<CampaignWithTags[]> {
    const tagNameSet = new Set(tags.map((t) => t.name));
    return Promise.resolve(
      this.campaigns.filter((campaign) =>
        (campaign.tags ?? []).some((tag) => tagNameSet.has(tag.name))
      )
    );
  }

  listByUserId(userId: number): Promise<CampaignWithTags[]> {
    return Promise.resolve(this.campaigns.filter((c) => c.userId === userId));
  }
}

const toCampaignWithTags = (c: FixtureCampaign): CampaignWithTags => {
  return {
    id: c.id,
    userId: c.user_id,
    title: c.title,
    content: c.content,
    image: c.image,
    url: c.url,
    tags: c.tags ?? [],
    maxCpc: c.max_cpc,
    dailyBudget: c.daily_budget,
    totalBudget: c.total_budget,
    isHighIntent: c.is_high_intent,
    status: c.status,
    startDate: new Date(c.start_date),
    endDate: new Date(c.end_date),
    createdAt: new Date(c.created_at),
    deletedAt: c.deleted_at ? new Date(c.deleted_at) : null,
  };
};

const loadFixture = (): Fixture => {
  const fixturePath = getFixturePath();
  const raw = readFileSync(fixturePath, 'utf8');
  return JSON.parse(raw) as Fixture;
};

const getFixturePath = () => {
  if (process.env.ERD_FIXTURE_PATH) {
    return process.env.ERD_FIXTURE_PATH;
  }

  const moduleRelative = resolve(__dirname, '../../mock/erd-fixture.json');
  if (existsSync(moduleRelative)) {
    return moduleRelative;
  }

  const cwdRelative = resolve(process.cwd(), 'src/mock/erd-fixture.json');
  if (existsSync(cwdRelative)) {
    return cwdRelative;
  }

  throw new Error(
    "ERD fixture not found. Set ERD_FIXTURE_PATH or ensure 'src/mock/erd-fixture.json' is available at runtime."
  );
};
