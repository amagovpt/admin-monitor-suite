import { TestBed } from '@angular/core/testing';

import { AccessibilityStatementService } from './accessibility-statement.service';

describe('AccessibilityStatementService', () => {
  let service: AccessibilityStatementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccessibilityStatementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    service.getByWebsiteId('4').subscribe((accessibilityStatements) => {
      console.log(console.log(accessibilityStatements))
    });
;
  });
});
