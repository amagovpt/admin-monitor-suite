import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CrawlerDialogComponent } from './crawler-dialog.component';

describe('CrawlerDialogComponent', () => {
  let component: CrawlerDialogComponent;
  let fixture: ComponentFixture<CrawlerDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CrawlerDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrawlerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
