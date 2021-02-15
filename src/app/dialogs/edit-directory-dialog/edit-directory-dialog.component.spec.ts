import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDirectoryDialogComponent } from './edit-directory-dialog.component';

describe('EditDirectoryDialogComponent', () => {
  let component: EditDirectoryDialogComponent;
  let fixture: ComponentFixture<EditDirectoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditDirectoryDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDirectoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
