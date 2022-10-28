import { ComponentFixture, TestBed } from '@angular/core/testing';

import { A11yStatementsComponent } from './a11y-statements.component';

describe('A11yStatementsComponent', () => {
  let component: A11yStatementsComponent;
  let fixture: ComponentFixture<A11yStatementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ A11yStatementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(A11yStatementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
