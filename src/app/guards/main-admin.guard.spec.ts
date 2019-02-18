import { TestBed, async, inject } from '@angular/core/testing';

import { MainAdminGuard } from './main-admin.guard';

describe('MainAdminGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MainAdminGuard]
    });
  });

  it('should ...', inject([MainAdminGuard], (guard: MainAdminGuard) => {
    expect(guard).toBeTruthy();
  }));
});
