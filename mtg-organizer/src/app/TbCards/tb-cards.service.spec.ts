import { TestBed } from '@angular/core/testing';

import { TbCardsService } from './tb-cards.service';

describe('TbCardsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TbCardsService = TestBed.get(TbCardsService);
    expect(service).toBeTruthy();
  });
});
