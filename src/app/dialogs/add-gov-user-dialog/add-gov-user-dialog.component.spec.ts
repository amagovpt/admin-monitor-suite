import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGovUserDialogComponent } from './add-gov-user-dialog.component';

describe('AddGovUserDialogComponent', () => {
  let component: AddGovUserDialogComponent;
  let fixture: ComponentFixture<AddGovUserDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGovUserDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGovUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
