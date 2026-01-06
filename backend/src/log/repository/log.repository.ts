export abstract class LogRepository {
  abstract saveViewLog(dto: SaveViewLogDto): void;
  abstract saveClickLog(dto: SaveClickLogDto): void;
}
