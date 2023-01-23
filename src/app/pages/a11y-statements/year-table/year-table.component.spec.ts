import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearTableComponent } from './year-table.component';

describe('YearTableComponent', () => {
  let component: YearTableComponent;
  let fixture: ComponentFixture<YearTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YearTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YearTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
