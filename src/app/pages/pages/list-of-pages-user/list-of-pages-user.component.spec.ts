import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListOfPagesUserComponent } from './list-of-pages-user.component';

describe('ListOfPagesUserComponent', () => {
  let component: ListOfPagesUserComponent;
  let fixture: ComponentFixture<ListOfPagesUserComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfPagesUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfPagesUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
