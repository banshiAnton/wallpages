import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertDivComponent } from './alert-div.component';

describe('AlertDivComponent', () => {
  let component: AlertDivComponent;
  let fixture: ComponentFixture<AlertDivComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertDivComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertDivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
