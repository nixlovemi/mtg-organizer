import { TestBed } from '@angular/core/testing';

import { TbSetService } from './tb-set.service';

describe('TbSetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TbSetService = TestBed.get(TbSetService);
    expect(service).toBeTruthy();
  });
});
