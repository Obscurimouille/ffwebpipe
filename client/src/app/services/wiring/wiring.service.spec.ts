import { TestBed } from '@angular/core/testing';

import { WiringService } from './wiring.service';

describe('WiringService', () => {
  let service: WiringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WiringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
