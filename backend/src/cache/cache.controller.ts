import {
  Body,
  Controller,
  ForbiddenException,
  Post,
  Query,
} from '@nestjs/common';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { AuctionStore } from './auction/auction.store';
import { SeedAuctionDto } from './dto/seed-auction.dto';
import { successResponse } from 'src/common/response/success-response';
import { LogRepository } from 'src/log/repository/log.repository';
import { SaveViewLog } from 'src/log/types/save-view-log.type';

@Controller('cache')
export class CacheController {
  constructor(
    private readonly auctionStore: AuctionStore,
    private readonly logRepository: LogRepository
  ) {}

  @Post('auction')
  seedAuction(@Body() dto: SeedAuctionDto) {
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException();
    }

    const { auctionId, blogId, cost } = dto;
    this.auctionStore.set(auctionId, { blogId, cost });
    return successResponse({ auctionId }, 'auction seeded');
  }

  @Post('seed/logs')
  seedLogs(@Query('useNow') useNow?: string) {
    if (process.env.NODE_ENV === 'production') {
      throw new ForbiddenException();
    }

    const fixture = loadFixture();
    const shouldUseNow =
      useNow === '1' || useNow === 'true' || useNow === 'now';
    const nowMs = Date.now();

    const fixtureViewIdToSavedViewId = new Map<number, number>();
    for (const [idx, viewLog] of fixture.view_logs.entries()) {
      const savedViewId = this.logRepository.saveViewLog(
        toSaveViewLog(
          viewLog,
          shouldUseNow ? new Date(nowMs + idx * 1000) : undefined
        )
      );
      fixtureViewIdToSavedViewId.set(viewLog.id, savedViewId);
    }

    let seededClicks = 0;
    for (const [idx, clickLog] of fixture.click_logs.entries()) {
      const savedViewId = fixtureViewIdToSavedViewId.get(clickLog.view_id);
      if (!savedViewId) {
        continue;
      }

      this.logRepository.saveClickLog({
        viewId: savedViewId,
        createdAt: shouldUseNow
          ? new Date(nowMs + idx * 1000 + 500)
          : new Date(clickLog.created_at),
      });
      seededClicks += 1;
    }

    return successResponse(
      { seededViews: fixture.view_logs.length, seededClicks },
      'logs seeded'
    );
  }
}

type FixtureViewLog = {
  id: number;
  auction_id: string;
  campaign_id: string;
  blog_id: number;
  post_url: string | null;
  cost: number;
  position_ratio: number | null;
  is_high_intent: boolean;
  behavior_score: number | null;
  created_at: string;
};

type FixtureClickLog = {
  id: number;
  view_id: number;
  created_at: string;
};

type Fixture = {
  view_logs: FixtureViewLog[];
  click_logs: FixtureClickLog[];
};

const toSaveViewLog = (v: FixtureViewLog, createdAt?: Date): SaveViewLog => {
  return {
    auctionId: v.auction_id,
    campaignId: v.campaign_id,
    blogId: v.blog_id,
    postUrl: v.post_url ?? '',
    cost: v.cost,
    positionRatio: v.position_ratio ?? undefined,
    isHighIntent: v.is_high_intent,
    behaviorScore: v.behavior_score ?? 0,
    createdAt: createdAt ?? new Date(v.created_at),
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

  const moduleRelative = resolve(__dirname, '../mock/erd-fixture.json');
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
