import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateDirectoryTableComponent } from './state-directory-table.component';

describe('StateDirectoryTableComponent', () => {
  let component: StateDirectoryTableComponent;
  let fixture: ComponentFixture<StateDirectoryTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StateDirectoryTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StateDirectoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
