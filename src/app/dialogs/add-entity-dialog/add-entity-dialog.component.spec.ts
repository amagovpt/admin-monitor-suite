import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddEntityDialogComponent } from './add-entity-dialog.component';

describe('AddEntityDialogComponent', () => {
  let component: AddEntityDialogComponent;
  let fixture: ComponentFixture<AddEntityDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEntityDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEntityDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
