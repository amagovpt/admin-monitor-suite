import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetService } from '../../services/get.service';

@Component({
  selector: 'app-a11y-statement',
  templateUrl: './a11y-statement.component.html',
  styleUrls: ['./a11y-statement.component.css']
})
export class A11yStatementComponent implements OnInit {
  a11yStatement: any;
  loading: boolean;
  error: boolean;

  constructor(private get: GetService,
    private activatedRoute: ActivatedRoute,
    private cd: ChangeDetectorRef) {
    this.loading = true;
    this.error = false;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      const id  = params.id || null;
    this.get.getA11yStatementById(id).subscribe((a11tStatement) => {
      if (a11tStatement) {
        this.a11yStatement = a11tStatement;
      }
      else {
        this.error = true;
      }

      this.loading = false;
      this.cd.detectChanges();
    })
  })
}
}