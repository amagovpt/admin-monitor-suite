import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessCriteriaCounterComponent } from './success-criteria-counter.component';

describe('SuccessCriteriaCounterComponent', () => {
  let component: SuccessCriteriaCounterComponent;
  let fixture: ComponentFixture<SuccessCriteriaCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccessCriteriaCounterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessCriteriaCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
