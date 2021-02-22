import { TestBed } from "@angular/core/testing";

import { MatDatepickerIntlCustom } from "./datepicker-intl.service";

describe("MatDatepickerIntlCustom", () => {
  let service: MatDatepickerIntlCustom;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatDatepickerIntlCustom);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
