import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DomainStatisticsComponent } from './domain-statistics.component';

describe('DomainStatisticsComponent', () => {
  let component: DomainStatisticsComponent;
  let fixture: ComponentFixture<DomainStatisticsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DomainStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
