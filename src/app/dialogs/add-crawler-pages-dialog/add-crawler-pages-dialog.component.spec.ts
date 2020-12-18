import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddCrawlerPagesDialogComponent } from './add-crawler-pages-dialog.component';

describe('AddCrawlerPagesDialogComponent', () => {
  let component: AddCrawlerPagesDialogComponent;
  let fixture: ComponentFixture<AddCrawlerPagesDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCrawlerPagesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCrawlerPagesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
