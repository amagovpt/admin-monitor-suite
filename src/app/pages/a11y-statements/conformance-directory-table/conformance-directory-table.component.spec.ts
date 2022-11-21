import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConformanceDirectoryTableComponent } from './conformance-directory-table.component';

describe('ConformanceDirectoryTableComponent', () => {
  let component: ConformanceDirectoryTableComponent;
  let fixture: ComponentFixture<ConformanceDirectoryTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConformanceDirectoryTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConformanceDirectoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
