import { TestBed } from '@angular/core/testing';

import { StatisService } from './statis.service';

describe('StatisService', () => {
  let service: StatisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
