import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DumpListComponent } from './dump-list.component';

describe('DumpListComponent', () => {
  let component: DumpListComponent;
  let fixture: ComponentFixture<DumpListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DumpListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DumpListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
