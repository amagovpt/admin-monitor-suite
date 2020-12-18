import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditTagDialogComponent } from './edit-tag-dialog.component';

describe('EditTagDialogComponent', () => {
  let component: EditTagDialogComponent;
  let fixture: ComponentFixture<EditTagDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTagDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTagDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
