import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OPAWTableComponent } from './opawtable.component';

describe('OPAWTableComponent', () => {
  let component: OPAWTableComponent;
  let fixture: ComponentFixture<OPAWTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OPAWTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OPAWTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
