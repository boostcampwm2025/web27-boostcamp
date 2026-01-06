import { SaveClickLogDto } from '../dto/save-click-log.dto';
import { SaveViewLogDto } from '../dto/save-view-log.dto';
import { LogRepository } from './log.repository';

export class InMemoryLogRepository extends LogRepository {
  private readonly viewLog = new Map<number, SaveViewLogDto>();
  private viewLogIdx = 0;
  private readonly clickLog = new Map<number, SaveClickLogDto>();
  private clickLogIdx = 0;

  // 인메모리 Map 자료구조에 저장 (다음주에 DB로 갈아끼우기)
  saveViewLog(dto: SaveViewLogDto): number {
    const { auctiondId, campaignId, blogId, cost, positionRatio, createdAt } =
      dto;
    this.viewLogIdx += 1;
    this.viewLog.set(this.viewLogIdx, {
      auctiondId,
      campaignId,
      blogId,
      cost,
      positionRatio,
      createdAt,
    });

    return this.viewLogIdx;
  }

  // todo: abstact class 선언해두어서 일단 구현부를 작성해두었는데 return을 어떤걸 해줄지 정하고 수정할 예정
  saveClickLog(dto: SaveClickLogDto): void {
    const { viewId, createdAt } = dto;
    this.clickLogIdx += 1;
    this.clickLog.set(this.clickLogIdx, {
      viewId,
      createdAt,
    });
  }
}
