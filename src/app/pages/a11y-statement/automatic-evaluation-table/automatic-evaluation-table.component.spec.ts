import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomaticEvaluationTableComponent } from './automatic-evaluation-table.component';

describe('AutomaticEvaluationTableComponent', () => {
  let component: AutomaticEvaluationTableComponent;
  let fixture: ComponentFixture<AutomaticEvaluationTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutomaticEvaluationTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomaticEvaluationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
