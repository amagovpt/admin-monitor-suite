import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteEvaluationListConfirmationDialogComponent } from './delete-evaluation-list-confirmation-dialog.component';

describe('DeleteEvaluationListConfirmationDialogComponent', () => {
  let component: DeleteEvaluationListConfirmationDialogComponent;
  let fixture: ComponentFixture<DeleteEvaluationListConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteEvaluationListConfirmationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteEvaluationListConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
