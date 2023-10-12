import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGovUserDialogComponent } from './edit-gov-user-dialog.component';

describe('EditGovUserDialogComponent', () => {
  let component: EditGovUserDialogComponent;
  let fixture: ComponentFixture<EditGovUserDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditGovUserDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditGovUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
