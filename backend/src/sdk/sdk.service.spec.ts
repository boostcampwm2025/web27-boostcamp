import { Test, TestingModule } from '@nestjs/testing';
import { SdkService } from './sdk.service';
import { LogRepository } from 'src/log/repository/log.repository.interface';
import { CacheRepository } from 'src/cache/repository/cache.repository.interface';

describe('SdkService', () => {
  let service: SdkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SdkService,
        {
          provide: LogRepository,
          useValue: {
            saveViewLog: jest.fn(),
            saveClickLog: jest.fn(),
            getViewLog: jest.fn(),
            listViewLogs: jest.fn(),
            listClickLogs: jest.fn(),
          },
        },
        {
          provide: CacheRepository,
          useValue: {
            setAuctionData: jest.fn(),
            getAuctionData: jest.fn(),
            deleteAuctionData: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SdkService>(SdkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
