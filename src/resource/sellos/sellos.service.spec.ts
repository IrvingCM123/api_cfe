import { Test, TestingModule } from '@nestjs/testing';
import { SellosService } from './sellos.service';

describe('SellosService', () => {
  let service: SellosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SellosService],
    }).compile();

    service = module.get<SellosService>(SellosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
