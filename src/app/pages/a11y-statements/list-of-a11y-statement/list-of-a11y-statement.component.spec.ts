import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfA11yStatementComponent } from './list-of-a11y-statement.component';

describe('ListOfA11yStatementComponent', () => {
  let component: ListOfA11yStatementComponent;
  let fixture: ComponentFixture<ListOfA11yStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOfA11yStatementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfA11yStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
