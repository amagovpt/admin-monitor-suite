import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovUserComponent } from './gov-user.component';

describe('GovUserComponent', () => {
  let component: GovUserComponent;
  let fixture: ComponentFixture<GovUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GovUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GovUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
