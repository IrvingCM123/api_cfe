import { Test, TestingModule } from '@nestjs/testing';
import { SellosController } from './sellos.controller';
import { SellosService } from './sellos.service';

describe('SellosController', () => {
  let controller: SellosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SellosController],
      providers: [SellosService],
    }).compile();

    controller = module.get<SellosController>(SellosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
