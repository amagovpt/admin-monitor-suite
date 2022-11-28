import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConformanceTableComponent } from './conformance-table.component';

describe('ConformanceTableComponent', () => {
  let component: ConformanceTableComponent;
  let fixture: ComponentFixture<ConformanceTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConformanceTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConformanceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
