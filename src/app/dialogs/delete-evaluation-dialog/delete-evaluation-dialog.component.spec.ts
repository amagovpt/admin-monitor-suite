import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DeleteEvaluationDialogComponent } from './delete-evaluation-dialog.component';

describe('DeleteEvaluationDialogComponent', () => {
  let component: DeleteEvaluationDialogComponent;
  let fixture: ComponentFixture<DeleteEvaluationDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteEvaluationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteEvaluationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
