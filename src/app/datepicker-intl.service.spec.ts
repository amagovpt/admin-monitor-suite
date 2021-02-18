import { TestBed } from '@angular/core/testing';

import { DatepickerIntlService } from './datepicker-intl.service';

describe('DatepickerIntlService', () => {
  let service: DatepickerIntlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatepickerIntlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
