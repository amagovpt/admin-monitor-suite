import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditDomainDialogComponent } from './edit-domain-dialog.component';

describe('EditDomainDialogComponent', () => {
  let component: EditDomainDialogComponent;
  let fixture: ComponentFixture<EditDomainDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDomainDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDomainDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
