import { Test, TestingModule } from '@nestjs/testing';
import { SdkController } from './sdk.controller';
import { SdkService } from './sdk.service';
import { LogRepository } from 'src/log/repository/log.repository.interface';
import { AuctionStore } from 'src/cache/auction/auction.store.interface';

describe('SdkController', () => {
  let controller: SdkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SdkController],
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
          provide: AuctionStore,
          useValue: {
            set: jest.fn(),
            get: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SdkController>(SdkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
