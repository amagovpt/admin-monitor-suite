import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagCrawlerInformationDialogComponent } from './tag-crawler-information-dialog.component';

describe('TagCrawlerInformationDialogComponent', () => {
  let component: TagCrawlerInformationDialogComponent;
  let fixture: ComponentFixture<TagCrawlerInformationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TagCrawlerInformationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagCrawlerInformationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
