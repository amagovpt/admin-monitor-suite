import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEvaluationTableComponent } from './user-evaluation-table.component';

describe('UserEvaluationTableComponent', () => {
  let component: UserEvaluationTableComponent;
  let fixture: ComponentFixture<UserEvaluationTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserEvaluationTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserEvaluationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
