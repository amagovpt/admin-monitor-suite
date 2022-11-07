import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateA11yStatementDialogComponent } from './update-a11y-statement-dialog.component';

describe('UpdateA11yStatementDialogComponent', () => {
  let component: UpdateA11yStatementDialogComponent;
  let fixture: ComponentFixture<UpdateA11yStatementDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateA11yStatementDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateA11yStatementDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
