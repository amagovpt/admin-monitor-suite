import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDirectoryDialogComponent } from './add-directory-dialog.component';

describe('AddDirectoryDialogComponent', () => {
  let component: AddDirectoryDialogComponent;
  let fixture: ComponentFixture<AddDirectoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDirectoryDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDirectoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
