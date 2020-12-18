import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportWebsiteDialogComponent } from './import-website-dialog.component';

describe('ImportWebsiteDialogComponent', () => {
  let component: ImportWebsiteDialogComponent;
  let fixture: ComponentFixture<ImportWebsiteDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportWebsiteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportWebsiteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
