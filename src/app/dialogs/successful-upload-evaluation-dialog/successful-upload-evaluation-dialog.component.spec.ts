import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SuccessfulUploadEvaluationDialogComponent } from './successful-upload-evaluation-dialog.component';

describe('SuccessfulUploadEvaluationDialogComponent', () => {
  let component: SuccessfulUploadEvaluationDialogComponent;
  let fixture: ComponentFixture<SuccessfulUploadEvaluationDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessfulUploadEvaluationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessfulUploadEvaluationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
