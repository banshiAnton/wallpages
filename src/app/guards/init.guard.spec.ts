import { TestBed, async, inject } from '@angular/core/testing';

import { InitGuard } from './init.guard';

describe('InitGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InitGuard]
    });
  });

  it('should ...', inject([InitGuard], (guard: InitGuard) => {
    expect(guard).toBeTruthy();
  }));
});
