import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChooseObservatoryWebsitePagesDialogComponent } from './choose-observatory-website-pages-dialog.component';

describe('ChooseObservatoryWebsitePagesDialogComponent', () => {
  let component: ChooseObservatoryWebsitePagesDialogComponent;
  let fixture: ComponentFixture<ChooseObservatoryWebsitePagesDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseObservatoryWebsitePagesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseObservatoryWebsitePagesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
