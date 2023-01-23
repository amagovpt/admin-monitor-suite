import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SealTableComponent } from './seal-table.component';

describe('SealTableComponent', () => {
  let component: SealTableComponent;
  let fixture: ComponentFixture<SealTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SealTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SealTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
