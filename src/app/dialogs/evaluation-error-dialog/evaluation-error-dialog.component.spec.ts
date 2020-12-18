import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EvaluationErrorDialogComponent } from './evaluation-error-dialog.component';

describe('EvaluationErrorDialogComponent', () => {
  let component: EvaluationErrorDialogComponent;
  let fixture: ComponentFixture<EvaluationErrorDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluationErrorDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationErrorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
