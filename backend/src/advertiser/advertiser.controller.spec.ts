import { Test, TestingModule } from '@nestjs/testing';
import { AdvertiserController } from './advertiser.controller';
import { AdvertiserService } from './advertiser.service';

describe('AdvertiserController', () => {
  let controller: AdvertiserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdvertiserController],
      providers: [
        {
          provide: AdvertiserService,
          useValue: { getDashboardStats: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<AdvertiserController>(AdvertiserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
