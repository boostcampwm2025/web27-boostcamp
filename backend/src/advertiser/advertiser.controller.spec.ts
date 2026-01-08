import { Test, TestingModule } from '@nestjs/testing';
import { AdvertiserController } from './advertiser.controller';

describe('AdvertiserController', () => {
  let controller: AdvertiserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdvertiserController],
    }).compile();

    controller = module.get<AdvertiserController>(AdvertiserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
