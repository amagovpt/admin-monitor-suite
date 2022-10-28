import { ComponentFixture, TestBed } from '@angular/core/testing';

import { A11yStatementComponent } from './a11y-statement.component';

describe('A11yStatementComponent', () => {
  let component: A11yStatementComponent;
  let fixture: ComponentFixture<A11yStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ A11yStatementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(A11yStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
