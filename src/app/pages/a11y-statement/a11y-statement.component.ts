import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-a11y-statement',
  templateUrl: './a11y-statement.component.html',
  styleUrls: ['./a11y-statement.component.css']
})
export class A11yStatementComponent implements OnInit {
  a11yStatement = {
    id: 1,
    website: "Autenticação.Gov",
    statementDate: "11/11/2022",
    state: "completeStatement",
    seal: 'Ouro',
    conformance: 'plenamente conforme',
    automaticEvaluations: 1,
    manualEvaluations: 2,
    userEvaluations: 3,
  };
  constructor() { }

  ngOnInit(): void {
  }

}
