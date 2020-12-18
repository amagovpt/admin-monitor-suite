import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DeletePageDialogComponent } from './delete-page-dialog.component';

describe('DeletePageDialogComponent', () => {
  let component: DeletePageDialogComponent;
  let fixture: ComponentFixture<DeletePageDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DeletePageDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletePageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
