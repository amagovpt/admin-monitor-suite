import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SealDirectoryTableComponent } from './seal-directory-table.component';

describe('SealDirectoryTableComponent', () => {
  let component: SealDirectoryTableComponent;
  let fixture: ComponentFixture<SealDirectoryTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SealDirectoryTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SealDirectoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
