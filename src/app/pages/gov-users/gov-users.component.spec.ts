import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovUsersComponent } from './gov-users.component';

describe('GovUsersComponent', () => {
  let component: GovUsersComponent;
  let fixture: ComponentFixture<GovUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GovUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GovUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
