import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditWebsiteDialogComponent } from './edit-website-dialog.component';

describe('EditWebsiteDialogComponent', () => {
  let component: EditWebsiteDialogComponent;
  let fixture: ComponentFixture<EditWebsiteDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditWebsiteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWebsiteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
