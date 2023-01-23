import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorLogListComponent } from './error-log-list.component';

describe('ErrorLogListComponent', () => {
  let component: ErrorLogListComponent;
  let fixture: ComponentFixture<ErrorLogListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorLogListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorLogListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
