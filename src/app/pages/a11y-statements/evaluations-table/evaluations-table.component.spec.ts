import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationsTableComponent } from './evaluations-table.component';

describe('EvaluationsTableComponent', () => {
  let component: EvaluationsTableComponent;
  let fixture: ComponentFixture<EvaluationsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvaluationsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
