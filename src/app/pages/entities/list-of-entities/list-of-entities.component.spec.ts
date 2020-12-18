import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListOfEntitiesComponent } from './list-of-entities.component';

describe('ListOfEntitiesComponent', () => {
  let component: ListOfEntitiesComponent;
  let fixture: ComponentFixture<ListOfEntitiesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfEntitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfEntitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
