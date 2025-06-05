import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadEvaluationCSVComponent } from './upload-evaluation-csv.component';

describe('UploadEvaluationCSVComponent', () => {
  let component: UploadEvaluationCSVComponent;
  let fixture: ComponentFixture<UploadEvaluationCSVComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadEvaluationCSVComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadEvaluationCSVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
