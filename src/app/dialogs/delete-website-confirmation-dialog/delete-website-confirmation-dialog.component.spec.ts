import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DeleteWebsiteConfirmationDialogComponent } from './delete-website-confirmation-dialog.component';

describe('DeleteWebsiteConfirmationDialogComponent', () => {
  let component: DeleteWebsiteConfirmationDialogComponent;
  let fixture: ComponentFixture<DeleteWebsiteConfirmationDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteWebsiteConfirmationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteWebsiteConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
