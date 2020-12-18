import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListOfWebsitesComponent } from './list-of-websites.component';

describe('ListOfWebsitesComponent', () => {
  let component: ListOfWebsitesComponent;
  let fixture: ComponentFixture<ListOfWebsitesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfWebsitesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfWebsitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
