import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualEvaluationTableComponent } from './manual-evaluation-table.component';

describe('ManualEvaluationTableComponent', () => {
  let component: ManualEvaluationTableComponent;
  let fixture: ComponentFixture<ManualEvaluationTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualEvaluationTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualEvaluationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
