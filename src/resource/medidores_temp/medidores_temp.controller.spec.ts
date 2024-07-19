import { Test, TestingModule } from '@nestjs/testing';
import { MedidoresTempController } from './medidores_temp.controller';
import { MedidoresTempService } from './medidores_temp.service';

describe('MedidoresTempController', () => {
  let controller: MedidoresTempController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedidoresTempController],
      providers: [MedidoresTempService],
    }).compile();

    controller = module.get<MedidoresTempController>(MedidoresTempController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
