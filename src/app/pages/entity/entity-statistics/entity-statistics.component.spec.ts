import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EntityStatisticsComponent } from './entity-statistics.component';

describe('EntityStatisticsComponent', () => {
  let component: EntityStatisticsComponent;
  let fixture: ComponentFixture<EntityStatisticsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
