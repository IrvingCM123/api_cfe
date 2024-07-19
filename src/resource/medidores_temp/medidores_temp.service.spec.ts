import { Test, TestingModule } from '@nestjs/testing';
import { MedidoresTempService } from './medidores_temp.service';

describe('MedidoresTempService', () => {
  let service: MedidoresTempService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedidoresTempService],
    }).compile();

    service = module.get<MedidoresTempService>(MedidoresTempService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
