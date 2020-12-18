import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DeleteTagConfirmationDialogComponent } from './delete-tag-confirmation-dialog.component';

describe('DeleteTagConfirmationDialogComponent', () => {
  let component: DeleteTagConfirmationDialogComponent;
  let fixture: ComponentFixture<DeleteTagConfirmationDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteTagConfirmationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteTagConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
