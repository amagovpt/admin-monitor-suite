import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CrawlerConfigDialogComponent } from './crawler-config-dialog.component';

describe('CrawlerConfigDialogComponent', () => {
  let component: CrawlerConfigDialogComponent;
  let fixture: ComponentFixture<CrawlerConfigDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CrawlerConfigDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrawlerConfigDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
