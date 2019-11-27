import { TestBed } from '@angular/core/testing';

import { TbDeckService } from './tb-deck.service';

describe('TbDeckService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TbDeckService = TestBed.get(TbDeckService);
    expect(service).toBeTruthy();
  });
});
