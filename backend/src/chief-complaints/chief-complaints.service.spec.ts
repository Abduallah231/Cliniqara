import { Test, TestingModule } from '@nestjs/testing';
import { ChiefComplaintsService } from './chief-complaints.service';

describe('ChiefComplaintsService', () => {
  let service: ChiefComplaintsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChiefComplaintsService],
    }).compile();

    service = module.get<ChiefComplaintsService>(ChiefComplaintsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
