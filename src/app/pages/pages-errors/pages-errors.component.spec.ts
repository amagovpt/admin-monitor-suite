import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesErrorsComponent } from './pages-errors.component';

describe('PagesErrorsComponent', () => {
  let component: PagesErrorsComponent;
  let fixture: ComponentFixture<PagesErrorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagesErrorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagesErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
