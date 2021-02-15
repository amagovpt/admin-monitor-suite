import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfDirectoriesComponent } from './list-of-directories.component';

describe('ListOfDirectoriesComponent', () => {
  let component: ListOfDirectoriesComponent;
  let fixture: ComponentFixture<ListOfDirectoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOfDirectoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfDirectoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
