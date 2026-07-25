import { Test, TestingModule } from '@nestjs/testing';
import { ChiefComplaintsController } from './chief-complaints.controller';

describe('ChiefComplaintsController', () => {
  let controller: ChiefComplaintsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChiefComplaintsController],
    }).compile();

    controller = module.get<ChiefComplaintsController>(ChiefComplaintsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
