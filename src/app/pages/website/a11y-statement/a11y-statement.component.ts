import { Component, Input, OnInit } from '@angular/core';
import { AccessibilityStatement } from '../../../models/accessibilityStatement';

@Component({
  selector: 'app-a11y-statement',
  templateUrl: './a11y-statement.component.html',
  styleUrls: ['./a11y-statement.component.css'],
})
export class A11yStatementComponent implements OnInit {
  @Input("a11Statement") a11Statement: AccessibilityStatement;


  constructor() { }

  ngOnInit(): void {
  }

}
